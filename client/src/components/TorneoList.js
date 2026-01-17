import React from 'react';
import './TorneoList.css';

function TorneoList({ torneo }) {
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="torneo-detail-container">
      <div className="torneo-info-card">
        <div className="info-section">
          <div className="info-item-large">
            <span className="icon-large">📅</span>
            <div>
              <label>Fecha del Torneo</label>
              <span className="info-value">{formatearFecha(torneo.fecha)}</span>
            </div>
          </div>
          <div className="info-item-large">
            <span className="icon-large">📍</span>
            <div>
              <label>Ubicación</label>
              <span className="info-value">{torneo.ubicacion}</span>
            </div>
          </div>
          <div className="info-item-large">
            <span className="icon-large">👥</span>
            <div>
              <label>Total de Clanes</label>
              <span className="info-value">{torneo.equipos.length} participantes</span>
            </div>
          </div>
        </div>

        <div className="descripcion-section">
          <h3>📖 Descripción</h3>
          <p>{torneo.descripcion}</p>
        </div>
      </div>

      <div className="clanes-container">
        <h2>🎮 Clanes Participantes</h2>
        <div className="clanes-grid">
          {torneo.equipos.map((clan, index) => (
            <div key={index} className="clan-card">
              <div className="clan-number">#{index + 1}</div>
              <div className="clan-name">{clan}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TorneoList;
