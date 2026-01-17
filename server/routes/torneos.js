const express = require('express');
const router = express.Router();
const Torneo = require('../models/Torneo');

// Obtener todos los torneos
router.get('/', async (req, res) => {
  try {
    const torneos = await Torneo.find().sort({ fecha: -1 });
    res.json(torneos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener torneos', error: error.message });
  }
});

// Obtener un torneo por ID
router.get('/:id', async (req, res) => {
  try {
    const torneo = await Torneo.findById(req.params.id);
    if (!torneo) {
      return res.status(404).json({ mensaje: 'Torneo no encontrado' });
    }
    res.json(torneo);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener torneo', error: error.message });
  }
});

// Crear un nuevo torneo
router.post('/', async (req, res) => {
  try {
    const nuevoTorneo = new Torneo(req.body);
    const torneoGuardado = await nuevoTorneo.save();
    res.status(201).json(torneoGuardado);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear torneo', error: error.message });
  }
});

// Actualizar un torneo
router.put('/:id', async (req, res) => {
  try {
    const torneoActualizado = await Torneo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!torneoActualizado) {
      return res.status(404).json({ mensaje: 'Torneo no encontrado' });
    }
    res.json(torneoActualizado);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar torneo', error: error.message });
  }
});

// Eliminar un torneo
router.delete('/:id', async (req, res) => {
  try {
    const torneoEliminado = await Torneo.findByIdAndDelete(req.params.id);
    if (!torneoEliminado) {
      return res.status(404).json({ mensaje: 'Torneo no encontrado' });
    }
    res.json({ mensaje: 'Torneo eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar torneo', error: error.message });
  }
});

// Actualizar jornadas del torneo
router.put('/:id/jornadas', async (req, res) => {
  try {
    const { jornadas } = req.body;
    const torneoActualizado = await Torneo.findByIdAndUpdate(
      req.params.id,
      { jornadas },
      { new: true, runValidators: true }
    );
    if (!torneoActualizado) {
      return res.status(404).json({ mensaje: 'Torneo no encontrado' });
    }
    res.json(torneoActualizado);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar jornadas', error: error.message });
  }
});

// Actualizar resultado individual de un partido y puntos inmediatamente
router.post('/:id/actualizar-resultado', async (req, res) => {
  try {
    const { jornadaNumero, dia, indicePartido, accion, ganador, perdedor, resultadoAnterior } = req.body;
    const torneo = await Torneo.findById(req.params.id);
    
    if (!torneo) {
      return res.status(404).json({ mensaje: 'Torneo no encontrado' });
    }

    // Encontrar la jornada
    const jornadaIndex = torneo.jornadas.findIndex(j => j.numero === jornadaNumero);
    if (jornadaIndex === -1) {
      return res.status(404).json({ mensaje: 'Jornada no encontrada' });
    }

    const diaKey = dia === 1 ? 'dia1' : 'dia2';
    const jornada = torneo.jornadas[jornadaIndex];

    // Si hay resultado anterior, revertir puntos
    if (resultadoAnterior && resultadoAnterior.ganador) {
      const ganadorAnterior = torneo.tablaPosiciones.find(e => e.clan === resultadoAnterior.ganador);
      const perdedorAnterior = torneo.tablaPosiciones.find(e => e.clan === resultadoAnterior.perdedor);
      
      if (ganadorAnterior) {
        ganadorAnterior.puntos -= 3;
        ganadorAnterior.partidos -= 1;
        ganadorAnterior.ganados -= 1;
      }
      if (perdedorAnterior) {
        perdedorAnterior.partidos -= 1;
        perdedorAnterior.perdidos -= 1;
      }
    }

    // Actualizar resultado en la jornada
    if (!jornada[diaKey].resultados) {
      jornada[diaKey].resultados = [];
    }

    // Filtrar el resultado anterior del mismo partido
    jornada[diaKey].resultados = jornada[diaKey].resultados.filter(r => r.partido !== indicePartido);

    // Si no es desmarcar, agregar nuevo resultado y sumar puntos
    if (accion !== 'desmarcar' && ganador && perdedor) {
      jornada[diaKey].resultados.push({
        partido: indicePartido,
        ganador,
        perdedor
      });

      // Actualizar puntos del ganador
      const equipoGanador = torneo.tablaPosiciones.find(e => e.clan === ganador);
      if (equipoGanador) {
        equipoGanador.puntos += 3;
        equipoGanador.partidos += 1;
        equipoGanador.ganados += 1;
      }

      // Actualizar estadísticas del perdedor
      const equipoPerdedor = torneo.tablaPosiciones.find(e => e.clan === perdedor);
      if (equipoPerdedor) {
        equipoPerdedor.partidos += 1;
        equipoPerdedor.perdidos += 1;
      }
    }

    await torneo.save();
    res.json({
      mensaje: 'Resultado actualizado exitosamente',
      torneo
    });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar resultado', error: error.message });
  }
});

// Reiniciar torneo (resetear puntos y resultados)
router.post('/:id/reiniciar', async (req, res) => {
  try {
    const torneo = await Torneo.findById(req.params.id);
    
    if (!torneo) {
      return res.status(404).json({ mensaje: 'Torneo no encontrado' });
    }

    // Resetear tabla de posiciones
    torneo.tablaPosiciones.forEach(equipo => {
      equipo.puntos = 0;
      equipo.partidos = 0;
      equipo.ganados = 0;
      equipo.perdidos = 0;
    });

    // Limpiar resultados de todas las jornadas y marcarlas como no completadas
    torneo.jornadas.forEach(jornada => {
      jornada.completada = false;
      jornada.dia1.resultados = [];
      jornada.dia2.resultados = [];
    });

    await torneo.save();
    res.json({
      mensaje: 'Torneo reiniciado exitosamente',
      torneo
    });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al reiniciar torneo', error: error.message });
  }
});

// Finalizar jornada y actualizar puntos
router.post('/:id/finalizar-jornada', async (req, res) => {
  try {
    const { jornadaNumero, resultados } = req.body;
    const torneo = await Torneo.findById(req.params.id);
    
    if (!torneo) {
      return res.status(404).json({ mensaje: 'Torneo no encontrado' });
    }

    // Encontrar la jornada
    const jornadaIndex = torneo.jornadas.findIndex(j => j.numero === jornadaNumero);
    if (jornadaIndex === -1) {
      return res.status(404).json({ mensaje: 'Jornada no encontrada' });
    }

    // Marcar jornada como completada
    torneo.jornadas[jornadaIndex].completada = true;

    // Actualizar puntos en la tabla de posiciones
    const ganadores = [
      ...resultados.dia1.map(r => r.ganador),
      ...resultados.dia2.map(r => r.ganador)
    ];
    const perdedores = [
      ...resultados.dia1.map(r => r.perdedor),
      ...resultados.dia2.map(r => r.perdedor)
    ];

    // Actualizar estadísticas
    ganadores.forEach(ganador => {
      const equipo = torneo.tablaPosiciones.find(e => e.clan === ganador);
      if (equipo) {
        equipo.partidos += 1;
        equipo.ganados += 1;
        equipo.puntos += 3; // 3 puntos por victoria
      }
    });

    perdedores.forEach(perdedor => {
      const equipo = torneo.tablaPosiciones.find(e => e.clan === perdedor);
      if (equipo) {
        equipo.partidos += 1;
        equipo.perdidos += 1;
        // 0 puntos por derrota
      }
    });

    await torneo.save();
    res.json({
      mensaje: 'Jornada finalizada y puntos actualizados',
      torneo
    });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al finalizar jornada', error: error.message });
  }
});

// Agregar nuevo clan
router.post('/:id/clanes', async (req, res) => {
  try {
    const { nombre } = req.body;
    const torneo = await Torneo.findById(req.params.id);
    
    if (!torneo) {
      return res.status(404).json({ mensaje: 'Torneo no encontrado' });
    }

    // Verificar que no exista ya
    const clanExistente = torneo.tablaPosiciones.find(c => c.clan.toLowerCase() === nombre.toLowerCase());
    if (clanExistente) {
      return res.status(400).json({ mensaje: 'Ya existe un clan con ese nombre' });
    }

    // Agregar nuevo clan
    torneo.tablaPosiciones.push({
      clan: nombre,
      puntos: 0,
      partidos: 0,
      ganados: 0,
      perdidos: 0
    });

    await torneo.save();
    res.json({
      mensaje: 'Clan agregado exitosamente',
      torneo
    });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al agregar clan', error: error.message });
  }
});

// Editar nombre de clan
router.put('/:id/clanes/:nombreClan', async (req, res) => {
  try {
    const { nombreClan } = req.params;
    const { nuevoNombre } = req.body;
    const torneo = await Torneo.findById(req.params.id);
    
    if (!torneo) {
      return res.status(404).json({ mensaje: 'Torneo no encontrado' });
    }

    // Buscar el clan
    const clan = torneo.tablaPosiciones.find(c => c.clan === nombreClan);
    if (!clan) {
      return res.status(404).json({ mensaje: 'Clan no encontrado' });
    }

    // Verificar que el nuevo nombre no exista
    const nombreExiste = torneo.tablaPosiciones.find(c => c.clan.toLowerCase() === nuevoNombre.toLowerCase() && c.clan !== nombreClan);
    if (nombreExiste) {
      return res.status(400).json({ mensaje: 'Ya existe un clan con ese nombre' });
    }

    // Actualizar nombre en tabla de posiciones
    clan.clan = nuevoNombre;

    // Actualizar en todas las jornadas
    torneo.jornadas.forEach(jornada => {
      // Actualizar equipos en dia1
      jornada.dia1.equipos = jornada.dia1.equipos.map(e => e === nombreClan ? nuevoNombre : e);
      // Actualizar equipos en dia2
      jornada.dia2.equipos = jornada.dia2.equipos.map(e => e === nombreClan ? nuevoNombre : e);
      // Actualizar resultados en dia1
      if (jornada.dia1.resultados) {
        jornada.dia1.resultados.forEach(r => {
          if (r.ganador === nombreClan) r.ganador = nuevoNombre;
          if (r.perdedor === nombreClan) r.perdedor = nuevoNombre;
        });
      }
      // Actualizar resultados en dia2
      if (jornada.dia2.resultados) {
        jornada.dia2.resultados.forEach(r => {
          if (r.ganador === nombreClan) r.ganador = nuevoNombre;
          if (r.perdedor === nombreClan) r.perdedor = nuevoNombre;
        });
      }
    });

    await torneo.save();
    res.json({
      mensaje: 'Clan actualizado exitosamente',
      torneo
    });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar clan', error: error.message });
  }
});

// Eliminar clan
router.delete('/:id/clanes/:nombreClan', async (req, res) => {
  try {
    const { nombreClan } = req.params;
    const torneo = await Torneo.findById(req.params.id);
    
    if (!torneo) {
      return res.status(404).json({ mensaje: 'Torneo no encontrado' });
    }

    // Eliminar de tabla de posiciones
    torneo.tablaPosiciones = torneo.tablaPosiciones.filter(c => c.clan !== nombreClan);

    // Eliminar de todas las jornadas
    torneo.jornadas.forEach(jornada => {
      // Eliminar de equipos dia1
      jornada.dia1.equipos = jornada.dia1.equipos.filter(e => e !== nombreClan);
      // Eliminar de equipos dia2
      jornada.dia2.equipos = jornada.dia2.equipos.filter(e => e !== nombreClan);
      // Eliminar resultados relacionados en dia1
      if (jornada.dia1.resultados) {
        jornada.dia1.resultados = jornada.dia1.resultados.filter(r => 
          r.ganador !== nombreClan && r.perdedor !== nombreClan
        );
      }
      // Eliminar resultados relacionados en dia2
      if (jornada.dia2.resultados) {
        jornada.dia2.resultados = jornada.dia2.resultados.filter(r => 
          r.ganador !== nombreClan && r.perdedor !== nombreClan
        );
      }
    });

    await torneo.save();
    res.json({
      mensaje: 'Clan eliminado exitosamente',
      torneo
    });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al eliminar clan', error: error.message });
  }
});

module.exports = router;
