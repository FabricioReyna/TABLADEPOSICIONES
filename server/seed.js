const mongoose = require('mongoose');
require('dotenv').config();

// Importar el modelo de Torneo
const Torneo = require('./models/Torneo');

// Función para generar jornadas
function generarJornadas(clanes, fechaInicio) {
  const jornadas = [];
  const clonesArray = [...clanes];
  let fechaActual = new Date(fechaInicio);
  
  for (let i = 1; i <= 7; i++) {
    let equiposDia1, equiposDia2;
    
    // Jornada 7 es especial - Playoff
    if (i === 7) {
      // Para la jornada 7, los equipos se organizarán según la tabla de posiciones
      // Los top 6 pelean entre ellos (día 1)
      // Los bottom 6 (del 7 al 12) pelean entre ellos (día 2)
      // Nota: La organización real se hará cuando la jornada esté lista para jugarse
      // Por ahora dejamos los equipos mezclados como placeholder
      const shuffled = [...clonesArray].sort(() => Math.random() - 0.5);
      equiposDia1 = shuffled.slice(0, 6);
      equiposDia2 = shuffled.slice(6, 12);
    } else {
      // Jornadas normales: mezclar clanes
      const shuffled = [...clonesArray].sort(() => Math.random() - 0.5);
      equiposDia1 = shuffled.slice(0, 6);
      equiposDia2 = shuffled.slice(6, 12);
    }
    
    // Día 1: primeros 6 equipos (3 partidos 1 vs 1)
    const dia1Fecha = new Date(fechaActual);
    
    // Día 2: siguientes 6 equipos (3 partidos 1 vs 1)
    fechaActual.setDate(fechaActual.getDate() + 1);
    const dia2Fecha = new Date(fechaActual);
    
    jornadas.push({
      numero: i,
      esPlayoff: i === 7,
      dia1: {
        fecha: dia1Fecha,
        equipos: equiposDia1,
        resultados: [],
        descripcion: i === 7 ? 'TOP 6 - Playoff' : null
      },
      dia2: {
        fecha: dia2Fecha,
        equipos: equiposDia2,
        resultados: [],
        descripcion: i === 7 ? 'Posiciones 7-12' : null
      }
    });
    
    // Avanzar al siguiente inicio (después de 2 días)
    fechaActual.setDate(fechaActual.getDate() + 1);
  }
  
  return jornadas;
}

// Datos iniciales
const clanes = ['501th', 'Tripulantes (Roier)', 'Terrible (Focus)', 'vahalla', 'Stormentados', 'resistencia', 'Esclavos_De_Hestia (Nia)', 'Core', 'Arnor (Alexby11)', 'Lobos Nocturnos (Vegetta)', 'Hermandad Oscuro (WillyREX)', 'KOKITOS'];
const fechaInicio = new Date('2026-02-15');

const torneos = [
  {
    nombre: 'Torneo de Clanes 2026',
    descripcion: 'Torneo competitivo entre los mejores clanes',
    fecha: fechaInicio,
    ubicacion: 'Arena Principal',
    equipos: clanes,
    estado: 'activo',
    tablaPosiciones: clanes.map(clan => ({
      clan: clan,
      puntos: 0,
      partidos: 0,
      ganados: 0,
      perdidos: 0
    })),
    jornadas: generarJornadas(clanes, fechaInicio)
  }
];

// Función para poblar la base de datos
async function seedDatabase() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar la colección de torneos
    await Torneo.deleteMany({});
    console.log('🗑️  Base de datos limpiada');

    // Insertar torneos
    const torneosCreados = await Torneo.insertMany(torneos);
    console.log(`✅ Torneo creado exitosamente`);

    // Mostrar el torneo creado
    console.log('\n📋 Torneo de Clanes creado:');
    torneosCreados.forEach((torneo) => {
      console.log(`\n🏆 ${torneo.nombre}`);
      console.log(`   📅 Fecha: ${torneo.fecha.toLocaleDateString('es-ES')}`);
      console.log(`   📍 Ubicación: ${torneo.ubicacion}`);
      console.log(`   👥 Clanes participantes (${torneo.equipos.length}):`);
      torneo.equipos.forEach((clan, i) => {
        console.log(`      ${i + 1}. ${clan}`);
      });
    });

    console.log('\n✅ Base de datos poblada correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
    process.exit(1);
  }
}

// Ejecutar la función
seedDatabase();
