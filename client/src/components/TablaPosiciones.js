import React from 'react';
import './TablaPosiciones.css';

function TablaPosiciones({ tablaPosiciones }) {
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
            </tr>
          </thead>
          <tbody>
            {tablaOrdenada.map((equipo, index) => {
              const isVegetta = equipo.clan.toLowerCase().includes('vegeta');
              return (
                <tr 
                  key={equipo.clan || index} 
                  className={`${index < 3 ? 'top-three' : ''} ${isVegetta ? 'vegetta-row' : ''}`}
                >
                  <td className="posicion">
                    {index === 0 && '🥇'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                    {index > 2 && index + 1}
                  </td>
                  <td className="clan-name">{equipo.clan}</td>
                  <td>{equipo.partidos || 0}</td>
                  <td className="ganados">{equipo.ganados || 0}</td>
                  <td className="perdidos">{equipo.perdidos || 0}</td>
                  <td className="puntos">{equipo.puntos || 0}</td>
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
    </div>
  );
}

export default TablaPosiciones;
