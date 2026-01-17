import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Top3.css';

function Top3() {
  const [top3, setTop3] = useState([]);
  const [torneoActivo, setTorneoActivo] = useState(null);
  const [loading, setLoading] = useState(true);

  const cargarDatos = async () => {
    try {
      // Obtener torneo activo
      const torneoRes = await axios.get('https://tabladeposiciones.onrender.com/api/torneos/activo');
      const torneo = torneoRes.data;
      setTorneoActivo(torneo);

      if (torneo && torneo.tablaPosiciones) {
        // Ordenar clanes por puntos y partidos ganados
        const clanesOrdenados = [...torneo.tablaPosiciones].sort((a, b) => {
          if (b.puntos !== a.puntos) return b.puntos - a.puntos;
          if (b.ganados !== a.ganados) return b.ganados - a.ganados;
          return a.clan.localeCompare(b.clan);
        });

        // Tomar solo los 3 primeros
        setTop3(clanesOrdenados.slice(0, 3));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Cargar datos inicialmente
    cargarDatos();

    // Actualizar cada 10 segundos
    const interval = setInterval(cargarDatos, 10000);

    return () => clearInterval(interval);
  }, []);

  const obtenerClaseEspecial = (nombreClan) => {
    const nombreLower = nombreClan.toLowerCase();
    if (nombreLower.includes('vegetta')) return 'vegetta-row';
    if (nombreLower.includes('willy')) return 'willy-row';
    if (nombreLower.includes('nia')) return 'nia-row';
    if (nombreLower.includes('alexby')) return 'alexby-row';
    if (nombreLower.includes('roier')) return 'roier-row';
    if (nombreLower.includes('focus')) return 'focus-row';
    return '';
  };

  const obtenerMedalla = (posicion) => {
    switch(posicion) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="top3-container">
        <div className="top3-loading">Cargando...</div>
      </div>
    );
  }

  if (!torneoActivo) {
    return (
      <div className="top3-container">
        <div className="top3-no-data">No hay torneo activo</div>
      </div>
    );
  }

  return (
    <div className="top3-container">
      <div className="top3-header">
        <h1>🏆 TOP 3</h1>
        <h2>{torneoActivo.nombre}</h2>
      </div>

      <div className="top3-table">
        {top3.map((clanData, index) => (
          <div 
            key={index} 
            className={`top3-row ${obtenerClaseEspecial(clanData.clan)}`}
          >
            <div className="top3-posicion">
              <span className="medalla">{obtenerMedalla(index)}</span>
              <span className="numero">#{index + 1}</span>
            </div>
            <div className="top3-clan">{clanData.clan}</div>
            <div className="top3-stats">
              <div className="stat">
                <span className="stat-valor">{clanData.puntos}</span>
                <span className="stat-label">PTS</span>
              </div>
              <div className="stat">
                <span className="stat-valor">{clanData.ganados}</span>
                <span className="stat-label">V</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="top3-footer">
        Actualización automática cada 10s
      </div>
    </div>
  );
}

export default Top3;
