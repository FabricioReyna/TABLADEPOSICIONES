const mongoose = require('mongoose');
require('dotenv').config();

const Torneo = require('./models/Torneo');

const TOTAL_JORNADAS = 12;

const construirEnfrentamientos = (jornadas) => {
  const set = new Set();
  jornadas.forEach(jornada => {
    ['dia1', 'dia2'].forEach(diaKey => {
      const equipos = jornada?.[diaKey]?.equipos || [];
      for (let i = 0; i < equipos.length; i += 2) {
        const eq1 = equipos[i];
        const eq2 = equipos[i + 1];
        if (eq1 && eq2) {
          set.add(`${eq1}||${eq2}`);
          set.add(`${eq2}||${eq1}`);
        }
      }
    });
  });
  return set;
};

const yaSeEnfrentaron = (set, eq1, eq2) => set.has(`${eq1}||${eq2}`);

const generarEmparejamientos = (clanes, enfrentamientos, maxIntentos = 5000) => {
  let intento = 0;
  while (intento < maxIntentos) {
    const shuffled = [...clanes].sort(() => Math.random() - 0.5);
    let esValido = true;
    for (let i = 0; i < shuffled.length; i += 2) {
      const eq1 = shuffled[i];
      const eq2 = shuffled[i + 1];
      if (eq1 && eq2 && yaSeEnfrentaron(enfrentamientos, eq1, eq2)) {
        esValido = false;
        break;
      }
    }
    if (esValido) {
      for (let i = 0; i < shuffled.length; i += 2) {
        const eq1 = shuffled[i];
        const eq2 = shuffled[i + 1];
        if (eq1 && eq2) {
          enfrentamientos.add(`${eq1}||${eq2}`);
          enfrentamientos.add(`${eq2}||${eq1}`);
        }
      }
      return shuffled;
    }
    intento++;
  }
  return null;
};

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);

  const torneo = await Torneo.findOne({ estado: 'activo' }).sort({ fecha: -1 });
  if (!torneo) {
    console.error('No hay torneo activo.');
    process.exit(1);
  }

  const jornadasExistentes = torneo.jornadas || [];
  const numerosExistentes = jornadasExistentes.map(j => j.numero || 0);
  const maxNumero = numerosExistentes.length ? Math.max(...numerosExistentes) : 0;

  // Limpiar cualquier marca de playoff en jornadas existentes
  torneo.jornadas = jornadasExistentes.map(j => {
    const limpia = { ...j.toObject?.() };
    delete limpia.esPlayoff;
    if (limpia.dia1) delete limpia.dia1.descripcion;
    if (limpia.dia2) delete limpia.dia2.descripcion;
    return limpia;
  });

  const clanes = torneo.equipos || [];
  const enfrentamientos = construirEnfrentamientos(torneo.jornadas);

  const fechas = torneo.jornadas
    .flatMap(j => [j?.dia1?.fecha, j?.dia2?.fecha])
    .filter(Boolean)
    .map(f => new Date(f));

  let fechaBase = fechas.length
    ? new Date(Math.max(...fechas.map(f => f.getTime())))
    : new Date();

  const nuevas = [];
  for (let numero = maxNumero + 1; numero <= TOTAL_JORNADAS; numero++) {
    const dia1Fecha = new Date(fechaBase);
    dia1Fecha.setDate(dia1Fecha.getDate() + 1);
    const dia2Fecha = new Date(dia1Fecha);
    dia2Fecha.setDate(dia2Fecha.getDate() + 1);

    let equiposDia1 = generarEmparejamientos(clanes, enfrentamientos);
    let equiposDia2 = generarEmparejamientos(clanes, enfrentamientos);

    if (!equiposDia1 || !equiposDia2) {
      // Fallback: permitir repeticiones si no hay combinaciones únicas
      equiposDia1 = [...clanes].sort(() => Math.random() - 0.5);
      equiposDia2 = [...clanes].sort(() => Math.random() - 0.5);
      console.warn(`No se pudo evitar repeticiones en jornada ${numero}. Se generó aleatorio.`);
    }

    nuevas.push({
      numero,
      completada: false,
      dia1: { fecha: dia1Fecha, equipos: equiposDia1.slice(0, 6), resultados: [] },
      dia2: { fecha: dia2Fecha, equipos: equiposDia2.slice(0, 6), resultados: [] }
    });

    fechaBase = new Date(dia2Fecha);
  }

  torneo.jornadas = [...torneo.jornadas, ...nuevas];
  await torneo.save();

  console.log(`Actualizado torneo: ${torneo.nombre}`);
  console.log(`Jornadas totales: ${torneo.jornadas.length}`);

  process.exit(0);
}

run().catch(err => {
  console.error('Error actualizando jornadas:', err);
  process.exit(1);
});
