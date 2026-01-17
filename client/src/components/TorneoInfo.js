import React from 'react';
import './TorneoInfo.css';

function TorneoInfo({ torneo }) {
  return (
    <div className="torneo-info-card">
      <div className="info-section-single">
        <div className="info-item-large">
          <span className="icon-large">👥</span>
          <div>
            <label>Total de Clanes Participantes</label>
            <span className="info-value">{torneo.equipos.length} Clanes</span>
          </div>
        </div>
      </div>

      <div className="descripcion-section">
        <h3>📖 Descripción del Torneo</h3>
        <p>{torneo.descripcion}</p>
      </div>
    </div>
  );
}

export default TorneoInfo;
