import React, { useState } from 'react';
import axios from 'axios';
import Toast from './Toast';
import './TablaPosiciones.css';

function TablaPosiciones({ tablaPosiciones, torneoId, puedeEditar, onUpdate }) {
  const [editando, setEditando] = useState(null);
  const [valores, setValores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [toast, setToast] = useState(null);

  if (!tablaPosiciones || tablaPosiciones.length === 0) {
    return (
      <div className="tabla-posiciones-container">
        <h2>📊 Tabla General de Posiciones</h2>
        <div className="empty-tabla">Cargando tabla de posiciones...</div>
      </div>
    );
  }

  // Ordenar por puntos
  const tablaOrdenada = [...tablaPosiciones].sort((a, b) => {
    if (b.puntos !== a.puntos) return b.puntos - a.puntos;
    return b.ganados - a.ganados;
  });

  const handleEditar = (equipo) => {
    setEditando(equipo.clan);
    setValores({
      puntos: equipo.puntos,
      partidos: equipo.partidos,
      ganados: equipo.ganados,
      perdidos: equipo.perdidos
    });
  };

  const handleCancelar = () => {
    setEditando(null);
    setValores({});
  };

  const handleGuardar = async (nombreClan) => {
    setGuardando(true);
    try {
      await axios.put(`https://tabladeposiciones.onrender.com/api/torneos/${torneoId}/clanes/${encodeURIComponent(nombreClan)}/estadisticas`, valores);
      setToast({ mensaje: 'Estadísticas actualizadas exitosamente', tipo: 'success' });
      setEditando(null);
      setValores({});
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error al actualizar estadísticas:', error);
      setToast({ mensaje: 'Error al actualizar las estadísticas', tipo: 'error' });
    } finally {
      setGuardando(false);
    }
  };

  const handleChange = (campo, valor) => {
    const valorNum = parseInt(valor) || 0;
    setValores(prev => ({ ...prev, [campo]: valorNum }));
  };

  return (
    <div className="tabla-posiciones-container">
      <h2>📊 Tabla General de Posiciones</h2>
      <div className="tabla-wrapper">
        <table className="tabla-posiciones">
          <thead>
            <tr>
              <th>Pos</th>
              <th>Clan</th>
              <th>PJ</th>
              <th>PG</th>
              <th>PP</th>
              <th>Pts</th>
              {puedeEditar && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {tablaOrdenada.map((equipo, index) => {
              const clanLower = equipo.clan.toLowerCase();
              const isVegetta = clanLower.includes('vegetta');
              const isWilly = clanLower.includes('willy');
              const isNia = clanLower.includes('nia');
              const isAlexby = clanLower.includes('alexby');
              const isRoier = clanLower.includes('roier');
              const isFocus = clanLower.includes('focus');
              
              let specialClass = '';
              if (isVegetta) specialClass = 'vegetta-row';
              else if (isWilly) specialClass = 'willy-row';
              else if (isNia) specialClass = 'nia-row';
              else if (isAlexby) specialClass = 'alexby-row';
              else if (isRoier) specialClass = 'roier-row';
              else if (isFocus) specialClass = 'focus-row';
              
              const estaEditando = editando === equipo.clan;

              return (
                <tr 
                  key={equipo.clan || index} 
                  className={`${index < 3 ? 'top-three' : ''} ${specialClass} ${estaEditando ? 'editing-row' : ''}`}
                  onDoubleClick={() => puedeEditar && !estaEditando && handleEditar(equipo)}
                  style={{ cursor: puedeEditar && !estaEditando ? 'pointer' : 'default' }}
                  title={puedeEditar && !estaEditando ? 'Doble clic para editar' : ''}
                >
                  <td className="posicion">
                    {index === 0 && '🥇'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                    {index > 2 && index + 1}
                  </td>
                  <td className="clan-name">{equipo.clan}</td>
                  
                  {estaEditando ? (
                    <>
                      <td>
                        <input
                          type="number"
                          className="edit-input"
                          value={valores.partidos}
                          onChange={(e) => handleChange('partidos', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="edit-input ganados"
                          value={valores.ganados}
                          onChange={(e) => handleChange('ganados', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="edit-input perdidos"
                          value={valores.perdidos}
                          onChange={(e) => handleChange('perdidos', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="edit-input puntos"
                          value={valores.puntos}
                          onChange={(e) => handleChange('puntos', e.target.value)}
                        />
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{equipo.partidos || 0}</td>
                      <td className="ganados">{equipo.ganados || 0}</td>
                      <td className="perdidos">{equipo.perdidos || 0}</td>
                      <td className="puntos">{equipo.puntos || 0}</td>
                    </>
                  )}

                  {puedeEditar && (
                    <td className="acciones-cell">
                      {estaEditando ? (
                        <>
                          <button 
                            className="btn-guardar-tabla"
                            onClick={() => handleGuardar(equipo.clan)}
                            disabled={guardando}
                            title="Guardar cambios"
                          >
                            ✅
                          </button>
                          <button 
                            className="btn-cancelar-tabla"
                            onClick={handleCancelar}
                            disabled={guardando}
                            title="Cancelar edición"
                          >
                            ❌
                          </button>
                        </>
                      ) : null}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="tabla-leyenda">
        <span><strong>PJ:</strong> Partidos Jugados</span>
        <span><strong>PG:</strong> Partidos Ganados</span>
        <span><strong>PP:</strong> Partidos Perdidos</span>
        <span><strong>Pts:</strong> Puntos</span>
      </div>
      {toast && (
        <Toast 
          mensaje={toast.mensaje}
          tipo={toast.tipo}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default TablaPosiciones;
