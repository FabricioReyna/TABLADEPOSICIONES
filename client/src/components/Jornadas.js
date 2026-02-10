import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Toast from './Toast';
import ModalConfirmacion from './ModalConfirmacion';
import './Jornadas.css';

function Jornadas({ jornadas, torneoId, onUpdate, puedeEditar = false }) {
  const [jornadasExpandidas, setJornadasExpandidas] = useState([]);
  const [jornadasTemp, setJornadasTemp] = useState(jornadas);
  const [guardando, setGuardando] = useState(false);
  const [toast, setToast] = useState(null);
  const [modalReiniciar, setModalReiniciar] = useState(false);
  const [jornadaSeleccionada, setJornadaSeleccionada] = useState('todas'); // 'todas' o número de jornada
  const [draggedItem, setDraggedItem] = useState(null); // { jornadaNumero, dia, indice }

  // Actualizar jornadasTemp cuando cambien las jornadas desde props
  useEffect(() => {
    setJornadasTemp(jornadas);
  }, [jornadas]);

  const toggleJornada = (numero) => {
    setJornadasExpandidas(prev => 
      prev.includes(numero) 
        ? prev.filter(n => n !== numero)
        : [...prev, numero]
    );
  };

  // Marcar ganador al hacer doble click
  const marcarGanador = async (jornadaNumero, dia, indicePartido, clanGanador) => {
    if (!puedeEditar) return;

    const jornada = jornadasTemp.find(j => j.numero === jornadaNumero);
    const diaKey = dia === 1 ? 'dia1' : 'dia2';
    const equiposPartido = jornada[diaKey].equipos.slice(indicePartido * 2, indicePartido * 2 + 2);
    
    // Verificar si ya hay un ganador para este partido
    const resultadoExistente = jornada[diaKey].resultados?.find(r => 
      r.partido === indicePartido
    );

    let accion, ganador, perdedor;

    if (resultadoExistente && resultadoExistente.ganador === clanGanador) {
      // Desmarcar ganador (restar puntos)
      accion = 'desmarcar';
      ganador = resultadoExistente.ganador;
      perdedor = resultadoExistente.perdedor;
    } else if (resultadoExistente) {
      // Cambiar ganador (restar puntos del anterior, sumar al nuevo)
      accion = 'cambiar';
      ganador = clanGanador;
      perdedor = equiposPartido.find(e => e !== clanGanador);
    } else {
      // Marcar nuevo ganador (sumar puntos)
      accion = 'marcar';
      ganador = clanGanador;
      perdedor = equiposPartido.find(e => e !== clanGanador);
    }

    // Actualizar UI optimistamente
    const nuevasJornadas = jornadasTemp.map(j => {
      if (j.numero !== jornadaNumero) return j;

      let nuevosResultados = j[diaKey].resultados || [];

      if (accion === 'desmarcar') {
        nuevosResultados = nuevosResultados.filter(r => r.partido !== indicePartido);
      } else {
        nuevosResultados = nuevosResultados.filter(r => r.partido !== indicePartido);
        nuevosResultados.push({
          partido: indicePartido,
          ganador,
          perdedor
        });
      }

      return {
        ...j,
        [diaKey]: {
          ...j[diaKey],
          resultados: nuevosResultados
        }
      };
    });

    setJornadasTemp(nuevasJornadas);

    // Actualizar puntos en el backend inmediatamente
    try {
      await axios.post(`https://tabladeposiciones.onrender.com/api/torneos/${torneoId}/actualizar-resultado`, {
        jornadaNumero,
        dia,
        indicePartido,
        accion,
        ganador: accion !== 'desmarcar' ? ganador : null,
        perdedor: accion !== 'desmarcar' ? perdedor : null,
        resultadoAnterior: resultadoExistente || null
      });
      
      // Actualizar datos para refrescar la tabla de posiciones
      onUpdate();
    } catch (error) {
      console.error('Error al actualizar resultado:', error);
      setToast({ mensaje: 'Error al actualizar el resultado', tipo: 'error' });
      // Revertir cambio en UI
      setJornadasTemp(jornadasTemp);
    }
  };

  // Verificar si una jornada está completa (todos los partidos tienen ganador)
  const esJornadaCompleta = (jornada) => {
    const resultadosDia1 = jornada.dia1.resultados?.length || 0;
    const resultadosDia2 = jornada.dia2.resultados?.length || 0;
    return resultadosDia1 === 3 && resultadosDia2 === 3; // 3 partidos por día
  };

  // Mover jornada completa
  const finalizarJornada = async (jornadaNumero) => {
    const jornada = jornadasTemp.find(j => j.numero === jornadaNumero);
    if (!esJornadaCompleta(jornada)) return;

    setGuardando(true);
    try {
      // Finalizar jornada sin actualizar puntos
      await axios.post(`/api/torneos/${torneoId}/finalizar-jornada`, {
        jornadaNumero,
        resultados: {
          dia1: jornada.dia1.resultados,
          dia2: jornada.dia2.resultados
        }
      });
      alert('✅ Jornada finalizada');
    } catch (error) {
      console.error('Error al finalizar jornada:', error);
      alert('❌ Error al finalizar la jornada');
    } finally {
      setGuardando(false);
    }
  };

  const randomizarEncuentros = () => {
    const TOTAL_JORNADAS = 12;
    const jornadasOriginales = [...jornadasTemp];
    let todasLasJornadas = [...jornadasTemp];

    // Si faltan jornadas, crearlas sin tocar las ya existentes
    if (todasLasJornadas.length < TOTAL_JORNADAS) {
      const numerosExistentes = todasLasJornadas.map(j => j.numero);
      const maxNumero = numerosExistentes.length ? Math.max(...numerosExistentes) : 0;

      const fechas = todasLasJornadas
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

        nuevas.push({
          numero,
          completada: false,
          dia1: { fecha: dia1Fecha, equipos: [], resultados: [] },
          dia2: { fecha: dia2Fecha, equipos: [], resultados: [] }
        });

        fechaBase = new Date(dia2Fecha);
      }

      todasLasJornadas = [...todasLasJornadas, ...nuevas];
    }

    const clanes = [...new Set(todasLasJornadas.flatMap(j => [...j.dia1.equipos, ...j.dia2.equipos]).filter(Boolean))];

    const jornadaTieneResultados = (jornada) =>
      (jornada.dia1.resultados?.length > 0) || (jornada.dia2.resultados?.length > 0);
    const esJornadaFija = (jornada) => jornada.completada || jornadaTieneResultados(jornada);
    
    // Registrar SOLO los enfrentamientos de jornadas ya hechas (para no modificarlas)
    const enfrentamientosExistentes = new Set();

    todasLasJornadas.forEach(jornada => {
      if (!esJornadaFija(jornada)) return;

      // Revisar día 1
      for (let i = 0; i < jornada.dia1.equipos.length; i += 2) {
        const eq1 = jornada.dia1.equipos[i];
        const eq2 = jornada.dia1.equipos[i + 1];
        if (eq1 && eq2) {
          // Guardar en ambos órdenes para facilitar búsqueda
          enfrentamientosExistentes.add(`${eq1}-${eq2}`);
          enfrentamientosExistentes.add(`${eq2}-${eq1}`);
        }
      }
      // Revisar día 2
      for (let i = 0; i < jornada.dia2.equipos.length; i += 2) {
        const eq1 = jornada.dia2.equipos[i];
        const eq2 = jornada.dia2.equipos[i + 1];
        if (eq1 && eq2) {
          enfrentamientosExistentes.add(`${eq1}-${eq2}`);
          enfrentamientosExistentes.add(`${eq2}-${eq1}`);
        }
      }
    });

    console.log(`📋 Enfrentamientos existentes registrados: ${enfrentamientosExistentes.size / 2}`);

    // Función para verificar si un enfrentamiento ya existe
    const yaSeEnfrentaron = (eq1, eq2) => {
      return enfrentamientosExistentes.has(`${eq1}-${eq2}`);
    };

    // Función para generar emparejamientos válidos sin repeticiones
    const generarEmparejamientos = (clanesDisponibles) => {
      const maxIntentos = 5000; // Aumentar intentos para mejor búsqueda
      let intento = 0;
      
      while (intento < maxIntentos) {
        const shuffled = [...clanesDisponibles].sort(() => Math.random() - 0.5);
        let esValido = true;
        
        // Verificar que NINGÚN emparejamiento de esta configuración ya exista
        for (let i = 0; i < shuffled.length; i += 2) {
          const eq1 = shuffled[i];
          const eq2 = shuffled[i + 1];
          if (eq1 && eq2 && yaSeEnfrentaron(eq1, eq2)) {
            esValido = false;
            break;
          }
        }
        
        if (esValido) {
          // Marcar estos nuevos enfrentamientos como usados
          for (let i = 0; i < shuffled.length; i += 2) {
            const eq1 = shuffled[i];
            const eq2 = shuffled[i + 1];
            if (eq1 && eq2) {
              enfrentamientosExistentes.add(`${eq1}-${eq2}`);
              enfrentamientosExistentes.add(`${eq2}-${eq1}`);
            }
          }
          return shuffled;
        }
        
        intento++;
      }
      
      return null; // No se pudo encontrar una configuración válida después de muchos intentos
    };

    // Randomizar solo jornadas NO hechas
    let falloGeneracion = false;
    const nuevasJornadas = todasLasJornadas.map((jornada) => {
      if (esJornadaFija(jornada)) {
        console.log(`⏭️ Jornada ${jornada.numero} - Mantener (ya hecha)`);
        return jornada; // No randomizar jornadas hechas
      }

      console.log(`🎲 Generando Jornada ${jornada.numero}...`);

      // Intentar generar día 1
      const equiposDia1 = generarEmparejamientos(clanes);
      if (!equiposDia1) {
        console.error(`❌ No se pudo generar día 1 para Jornada ${jornada.numero}`);
        falloGeneracion = true;
        return jornada; // Mantener la jornada sin cambios
      }

      // Intentar generar día 2
      const equiposDia2 = generarEmparejamientos(clanes);
      if (!equiposDia2) {
        console.error(`❌ No se pudo generar día 2 para Jornada ${jornada.numero}`);
        falloGeneracion = true;
        return jornada; // Mantener la jornada sin cambios
      }

      console.log(`✅ Jornada ${jornada.numero} generada correctamente`);

      return {
        ...jornada,
        dia1: {
          ...jornada.dia1,
          equipos: equiposDia1.slice(0, 6),
          resultados: [] // Limpiar resultados al randomizar
        },
        dia2: {
          ...jornada.dia2,
          equipos: equiposDia2.slice(0, 6),
          resultados: []
        }
      };
    });
    
    if (falloGeneracion) {
      setToast({ 
        mensaje: '⚠️ No se pudieron generar más encuentros únicos. Se mantuvieron las jornadas actuales.', 
        tipo: 'error' 
      });
      setJornadasTemp(jornadasOriginales);
      return;
    }

    setJornadasTemp(nuevasJornadas);
    setToast({ 
      mensaje: '✅ Encuentros reordenados sin repetir enfrentamientos en jornadas pendientes', 
      tipo: 'success' 
    });
  };

  const guardarJornadas = async () => {
    setGuardando(true);
    try {
      await axios.put(`https://tabladeposiciones.onrender.com/api/torneos/${torneoId}/jornadas`, {
        jornadas: jornadasTemp
      });
      setToast({ mensaje: 'Jornadas guardadas exitosamente', tipo: 'success' });
      onUpdate();
    } catch (error) {
      console.error('Error al guardar jornadas:', error);
      setToast({ mensaje: 'Error al guardar las jornadas', tipo: 'error' });
    } finally {
      setGuardando(false);
    }
  };

  const confirmarReiniciarTorneo = async () => {
    setModalReiniciar(false);
    setGuardando(true);
    try {
      await axios.post(`https://tabladeposiciones.onrender.com/api/torneos/${torneoId}/reiniciar`);
      setToast({ mensaje: 'Torneo reiniciado exitosamente', tipo: 'success' });
      onUpdate();
    } catch (error) {
      console.error('Error al reiniciar torneo:', error);
      setToast({ mensaje: 'Error al reiniciar el torneo', tipo: 'error' });
    } finally {
      setGuardando(false);
    }
  };

  // Funciones para drag and drop manual
  const handleDragStart = (e, jornadaNumero, dia, indice) => {
    if (!puedeEditar) return;
    setDraggedItem({ jornadaNumero, dia, indice });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetJornada, targetDia, targetIndice) => {
    e.preventDefault();
    if (!puedeEditar || !draggedItem) return;

    const { jornadaNumero: sourceJornada, dia: sourceDia, indice: sourceIndice } = draggedItem;
    
    // No hacer nada si es la misma posición
    if (sourceJornada === targetJornada && sourceDia === targetDia && sourceIndice === targetIndice) {
      setDraggedItem(null);
      return;
    }

    intercambiarEquipos(sourceJornada, sourceDia, sourceIndice, targetJornada, targetDia, targetIndice);
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  // Intercambiar equipos y propagar cambios a jornadas siguientes
  const intercambiarEquipos = (jornadaOrigen, diaOrigen, indiceOrigen, jornadaDestino, diaDestino, indiceDestino) => {
    const nuevasJornadas = [...jornadasTemp];
    
    const jornadaOrigenObj = nuevasJornadas.find(j => j.numero === jornadaOrigen);
    const jornadaDestinoObj = nuevasJornadas.find(j => j.numero === jornadaDestino);
    
    const diaOrigenKey = diaOrigen === 1 ? 'dia1' : 'dia2';
    const diaDestinoKey = diaDestino === 1 ? 'dia1' : 'dia2';
    
    // Intercambiar equipos
    const equipoOrigen = jornadaOrigenObj[diaOrigenKey].equipos[indiceOrigen];
    const equipoDestino = jornadaDestinoObj[diaDestinoKey].equipos[indiceDestino];
    
    jornadaOrigenObj[diaOrigenKey].equipos[indiceOrigen] = equipoDestino;
    jornadaDestinoObj[diaDestinoKey].equipos[indiceDestino] = equipoOrigen;
    
    // Si movemos en la misma jornada, ya terminamos
    if (jornadaOrigen === jornadaDestino) {
      setJornadasTemp(nuevasJornadas);
      setToast({ mensaje: '🔄 Equipos intercambiados', tipo: 'success' });
      return;
    }
    
    // Propagar cambios a todas las jornadas siguientes
    const jornadaMayor = Math.max(jornadaOrigen, jornadaDestino);
    
    // Para cada jornada posterior a la modificada
    for (let i = jornadaMayor + 1; i <= nuevasJornadas.length; i++) {
      const jornadaPosterior = nuevasJornadas.find(j => j.numero === i);
      if (!jornadaPosterior) continue;
      
      // Actualizar todas las apariciones del equipo origen
      ['dia1', 'dia2'].forEach(diaKey => {
        jornadaPosterior[diaKey].equipos = jornadaPosterior[diaKey].equipos.map(equipo => {
          if (equipo === equipoOrigen) return equipoDestino;
          if (equipo === equipoDestino) return equipoOrigen;
          return equipo;
        });
        
        // También actualizar resultados si existen
        if (jornadaPosterior[diaKey].resultados) {
          jornadaPosterior[diaKey].resultados = jornadaPosterior[diaKey].resultados.map(resultado => ({
            ...resultado,
            ganador: resultado.ganador === equipoOrigen ? equipoDestino : 
                     resultado.ganador === equipoDestino ? equipoOrigen : resultado.ganador,
            perdedor: resultado.perdedor === equipoOrigen ? equipoDestino : 
                      resultado.perdedor === equipoDestino ? equipoOrigen : resultado.perdedor
          }));
        }
      });
    }
    
    setJornadasTemp(nuevasJornadas);
    setToast({ 
      mensaje: `🔄 Equipos intercambiados y actualizados en ${nuevasJornadas.length - jornadaMayor} jornadas siguientes`, 
      tipo: 'success' 
    });
  };
  // Separar jornadas activas y completadas
  const jornadasActivas = jornadasTemp.filter(j => !j.completada);
  const jornadasCompletadas = jornadasTemp.filter(j => j.completada);

  // Filtrar jornadas según selección
  const filtrarJornadas = (jornadas) => {
    if (jornadaSeleccionada === 'todas') return jornadas;
    return jornadas.filter(j => j.numero === parseInt(jornadaSeleccionada));
  };

  // Obtener ganador de un partido específico
  const obtenerGanador = (jornada, dia, indicePartido) => {
    const diaKey = dia === 1 ? 'dia1' : 'dia2';
    const resultado = jornada[diaKey].resultados?.find(r => r.partido === indicePartido);
    return resultado?.ganador;
  };

  // Renderizar sección de jornadas
  const renderJornadas = (jornadas, titulo, icono) => (
    <>
      {jornadas.length > 0 && (
        <>
          <h3 className="seccion-titulo">{icono} {titulo}</h3>
          <div className="jornadas-list">
            {jornadas.map((jornada) => {
              const completa = esJornadaCompleta(jornada);
              return (
                <div key={jornada.numero} className={`jornada-card ${completa && !jornada.completada ? 'jornada-lista' : ''}`}>
                  <div 
                    className="jornada-header"
                    onClick={() => toggleJornada(jornada.numero)}
                  >
                    <div className="jornada-titulo">
                      <span className="jornada-numero">
                        Jornada {jornada.numero}
                        {completa && !jornada.completada && ' ✓'}
                      </span>
                    </div>
                    <div className="jornada-header-right">
                      {completa && !jornada.completada && puedeEditar && (
                        <button 
                          className="btn-finalizar-jornada"
                          onClick={(e) => {
                            e.stopPropagation();
                            finalizarJornada(jornada.numero);
                          }}
                          disabled={guardando}
                        >
                          ✅ Finalizar
                        </button>
                      )}
                      <span className={`expand-icon ${jornadasExpandidas.includes(jornada.numero) ? 'expanded' : ''}`}>
                        ▼
                      </span>
                    </div>
                  </div>

                  {jornadasExpandidas.includes(jornada.numero) && (
                    <div className="jornada-content">
                      {/* DÍA 1 */}
                      <div className="dia-section">
                        <div className="dia-header">
                          <h4>📆 Día 1</h4>
                        </div>
                        <div className="encuentros-container">
                          {jornada.dia1.equipos.length >= 6 && (
                            <>
                              {[0, 1, 2].map(indicePartido => {
                                const equipo1 = jornada.dia1.equipos[indicePartido * 2];
                                const equipo2 = jornada.dia1.equipos[indicePartido * 2 + 1];
                                const ganador = obtenerGanador(jornada, 1, indicePartido);
                                
                                return (
                                  <div key={indicePartido} className="partido">
                                    <span className="partido-numero">Partido {indicePartido + 1}</span>
                                    <div className="versus-box">
                                      <span 
                                        className={`clan-vs ${ganador === equipo1 ? 'ganador' : ''} ${ganador && ganador !== equipo1 ? 'perdedor' : ''} ${puedeEditar ? 'editable draggable' : ''}`}
                                        onDoubleClick={() => marcarGanador(jornada.numero, 1, indicePartido, equipo1)}
                                        draggable={puedeEditar}
                                        onDragStart={(e) => handleDragStart(e, jornada.numero, 1, indicePartido * 2)}
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, jornada.numero, 1, indicePartido * 2)}
                                        onDragEnd={handleDragEnd}
                                        title={puedeEditar ? '🎯 Arrastra para intercambiar posición' : ''}
                                      >
                                        {puedeEditar && '⋮⋮ '}{equipo1}
                                        {ganador === equipo1 && ' 🏆'}
                                      </span>
                                      <span className="vs-text">VS</span>
                                      <span 
                                        className={`clan-vs ${ganador === equipo2 ? 'ganador' : ''} ${ganador && ganador !== equipo2 ? 'perdedor' : ''} ${puedeEditar ? 'editable draggable' : ''}`}
                                        onDoubleClick={() => marcarGanador(jornada.numero, 1, indicePartido, equipo2)}
                                        draggable={puedeEditar}
                                        onDragStart={(e) => handleDragStart(e, jornada.numero, 1, indicePartido * 2 + 1)}
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, jornada.numero, 1, indicePartido * 2 + 1)}
                                        onDragEnd={handleDragEnd}
                                        title={puedeEditar ? '🎯 Arrastra para intercambiar posición' : ''}
                                      >
                                        {puedeEditar && '⋮⋮ '}{equipo2}
                                        {ganador === equipo2 && ' 🏆'}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </>
                          )}
                        </div>
                      </div>

                      {/* DÍA 2 */}
                      <div className="dia-section">
                        <div className="dia-header">
                          <h4>📆 Día 2</h4>
                        </div>
                        <div className="encuentros-container">
                          {jornada.dia2.equipos.length >= 6 && (
                            <>
                              {[0, 1, 2].map(indicePartido => {
                                const equipo1 = jornada.dia2.equipos[indicePartido * 2];
                                const equipo2 = jornada.dia2.equipos[indicePartido * 2 + 1];
                                const ganador = obtenerGanador(jornada, 2, indicePartido);
                                
                                return (
                                  <div key={indicePartido} className="partido">
                                    <span className="partido-numero">Partido {indicePartido + 1}</span>
                                    <div className="versus-box">
                                      <span 
                                        className={`clan-vs ${ganador === equipo1 ? 'ganador' : ''} ${ganador && ganador !== equipo1 ? 'perdedor' : ''} ${puedeEditar ? 'editable draggable' : ''}`}
                                        onDoubleClick={() => marcarGanador(jornada.numero, 2, indicePartido, equipo1)}
                                        draggable={puedeEditar}
                                        onDragStart={(e) => handleDragStart(e, jornada.numero, 2, indicePartido * 2)}
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, jornada.numero, 2, indicePartido * 2)}
                                        onDragEnd={handleDragEnd}
                                        title={puedeEditar ? '🎯 Arrastra para intercambiar posición' : ''}
                                      >
                                        {puedeEditar && '⋮⋮ '}{equipo1}
                                        {ganador === equipo1 && ' 🏆'}
                                      </span>
                                      <span className="vs-text">VS</span>
                                      <span 
                                        className={`clan-vs ${ganador === equipo2 ? 'ganador' : ''} ${ganador && ganador !== equipo2 ? 'perdedor' : ''} ${puedeEditar ? 'editable draggable' : ''}`}
                                        onDoubleClick={() => marcarGanador(jornada.numero, 2, indicePartido, equipo2)}
                                        draggable={puedeEditar}
                                        onDragStart={(e) => handleDragStart(e, jornada.numero, 2, indicePartido * 2 + 1)}
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, jornada.numero, 2, indicePartido * 2 + 1)}
                                        onDragEnd={handleDragEnd}
                                        title={puedeEditar ? '🎯 Arrastra para intercambiar posición' : ''}
                                      >
                                        {puedeEditar && '⋮⋮ '}{equipo2}
                                        {ganador === equipo2 && ' 🏆'}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );

  return (
    <div className="jornadas-container">
      <h2>📅 Calendario de Jornadas</h2>
      
      <div className="jornadas-controles">
        <div className="selector-jornada">
          <label htmlFor="filtro-jornada">🔍 Filtrar por jornada:</label>
          <select 
            id="filtro-jornada"
            value={jornadaSeleccionada}
            onChange={(e) => setJornadaSeleccionada(e.target.value)}
            className="select-jornada"
          >
            <option value="todas">Todas las jornadas</option>
            {jornadasTemp.map(j => (
              <option key={j.numero} value={j.numero}>
                Jornada {j.numero} {j.completada ? '✅' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="jornadas-info">
        <p>🎮 Cada jornada dura 2 días • Cada día: 3 partidos (6 clanes, 1 vs 1)</p>
        {puedeEditar && (
          <>
            <p className="instruccion">💡 Doble click en un clan para marcarlo como ganador</p>
            <p className="instruccion">🎯 Arrastra y suelta equipos para reorganizar manualmente (se actualiza en jornadas siguientes)</p>
          </>
        )}
      </div>

      {puedeEditar && (
        <div className="jornadas-actions">
          <button 
            className="btn-randomizar" 
            onClick={randomizarEncuentros}
            title="Mezclar aleatoriamente los enfrentamientos"
          >
            🎲 Randomizar Encuentros
          </button>
          <button 
            className="btn-guardar" 
            onClick={guardarJornadas}
            disabled={guardando}
            title="Guardar cambios en el calendario"
          >
            {guardando ? '⏳ Guardando...' : '💾 Guardar Jornadas'}
          </button>
          <button 
            className="btn-reiniciar" 
            onClick={() => setModalReiniciar(true)}
            disabled={guardando}
            title="Resetear todos los puntos y resultados"
          >
            🔄 Reiniciar Torneo
          </button>
        </div>
      )}
      
      {!puedeEditar && (
        <div className="admin-notice">
          <p>🔒 Inicia sesión como administrador para editar las jornadas</p>
        </div>
      )}
      
      {renderJornadas(filtrarJornadas(jornadasActivas), 'Jornadas Activas', '🎮')}
      {renderJornadas(filtrarJornadas(jornadasCompletadas), 'Jornadas Completadas', '✅')}

      {toast && (
        <Toast 
          mensaje={toast.mensaje}
          tipo={toast.tipo}
          onClose={() => setToast(null)}
        />
      )}

      {modalReiniciar && (
        <ModalConfirmacion
          titulo="⚠️ Reiniciar Torneo"
          mensaje={
            <div>
              <p>¿Estás seguro de reiniciar el torneo?</p>
              <br />
              <p><strong>Esto eliminará:</strong></p>
              <ul style={{marginLeft: '20px', lineHeight: '1.8'}}>
                <li>Todos los resultados de las jornadas</li>
                <li>Todos los puntos de la tabla de posiciones</li>
                <li>El historial de jornadas completadas</li>
              </ul>
              <br />
              <p><strong>Esta acción no se puede deshacer.</strong></p>
            </div>
          }
          onConfirmar={confirmarReiniciarTorneo}
          onCancelar={() => setModalReiniciar(false)}
          tipo="danger"
        />
      )}
    </div>
  );
}

export default Jornadas;
