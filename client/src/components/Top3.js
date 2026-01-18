import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Top3.css';

function Top3() {
  const [topClanes, setTopClanes] = useState([]);
  const [torneoActivo, setTorneoActivo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [indiceActual, setIndiceActual] = useState(0);

  // Leer configuración desde URL params
  const params = new URLSearchParams(window.location.search);
  const config = {
    cantidad: parseInt(params.get('cantidad') || '3'),
    bg: params.get('bg') || 'dark',
    transparente: params.get('transparente') === 'true',
    mostrarMedallas: params.get('medallas') !== 'false',
    mostrarNumeros: params.get('numeros') !== 'false',
    mostrarPuntos: params.get('puntos') !== 'false',
    mostrarVictorias: params.get('victorias') !== 'false',
    mostrarFooter: params.get('footer') !== 'false',
    coloresClan: params.get('coloresClan') !== 'false',
    velocidad: parseInt(params.get('velocidad') || '10'),
    tamañoFuente: params.get('fuente') || 'normal',
    animaciones: params.get('animaciones') !== 'false',
    borde: params.get('borde') !== 'false',
    titulo: params.get('titulo') || 'TOP',
    ancho: parseInt(params.get('ancho') || '600'),
    altura: parseInt(params.get('altura') || '400'),
    modo: params.get('modo') || 'tabla',
    tiempoSlider: parseInt(params.get('tiempoSlider') || '5')
  };

  const cargarDatos = useCallback(async () => {
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

        // Tomar la cantidad configurada
        setTopClanes(clanesOrdenados.slice(0, config.cantidad));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setLoading(false);
    }
  }, [config.cantidad]);

  useEffect(() => {
    // Cargar datos inicialmente
    cargarDatos();

    // Actualizar según velocidad configurada
    const interval = setInterval(cargarDatos, config.velocidad * 1000);

    return () => clearInterval(interval);
  }, [cargarDatos, config.velocidad]);

  // Slider automático para modo slider
  useEffect(() => {
    if (config.modo === 'slider' && topClanes.length > 0) {
      const intervaloSlider = setInterval(() => {
        setIndiceActual((prev) => (prev + 1) % topClanes.length);
      }, config.tiempoSlider * 1000); // Cambiar según tiempo configurado

      return () => clearInterval(intervaloSlider);
    }
  }, [config.modo, topClanes.length, config.tiempoSlider]);

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

  if (loading) {
    return (
      <div 
        className={`top3-container bg-${config.bg} ${config.transparente ? 'transparente' : ''}`}
        style={{ width: `${config.ancho}px`, height: `${config.altura}px` }}
      >
        <div className="top3-loading">Cargando...</div>
      </div>
    );
  }

  if (!torneoActivo) {
    return (
      <div 
        className={`top3-container bg-${config.bg} ${config.transparente ? 'transparente' : ''}`}
        style={{ width: `${config.ancho}px`, height: `${config.altura}px` }}
      >
        <div className="top3-no-data">No hay torneo activo</div>
      </div>
    );
  }

  // Renderizado modo slider
  if (config.modo === 'slider' && topClanes.length > 0) {
    const clanActual = topClanes[indiceActual];
    return (
      <div 
        className={`top3-container bg-${config.bg} ${config.transparente ? 'transparente' : ''} fuente-${config.tamañoFuente} ${config.borde ? 'con-borde' : 'sin-borde'} modo-slider`}
        style={{ width: `${config.ancho}px`, height: `${config.altura}px` }}
      >
        <div className="top3-header">
          <h1>{config.titulo}</h1>
        </div>

        <div className="slider-content">
          <div className={`slider-item ${config.coloresClan ? obtenerClaseEspecial(clanActual.clan) : ''}`}>
            <div className="slider-posicion">
              <span className="numero-grande">#{indiceActual + 1}</span>
            </div>
            <div className="slider-clan">{clanActual.clan}</div>
            <div className="slider-puntos">
              <span className="puntos-valor">{clanActual.puntos}</span>
              <span className="puntos-label">PUNTOS</span>
            </div>
          </div>
          
          <div className="slider-indicadores">
            {topClanes.map((_, index) => (
              <span 
                key={index} 
                className={`indicador ${index === indiceActual ? 'activo' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Renderizado modo tabla
  return (
    <div 
      className={`top3-container bg-${config.bg} ${config.transparente ? 'transparente' : ''} fuente-${config.tamañoFuente} ${config.animaciones ? 'con-animaciones' : ''} ${config.borde ? 'con-borde' : 'sin-borde'}`}
      style={{ width: `${config.ancho}px`, height: `${config.altura}px` }}
    >
      <div className="top3-header">
        <h1>{config.titulo}</h1>
      </div>

      <div className="top3-table">
        {topClanes.map((clanData, index) => (
          <div 
            key={index} 
            className={`top3-row ${config.coloresClan ? obtenerClaseEspecial(clanData.clan) : ''}`}
          >
            <div className="top3-posicion">
              <span className="numero">{index + 1}</span>
            </div>
            <div className="top3-clan">{clanData.clan}</div>
            <div className="top3-stats">
              <div className="stat-puntos">
                <span className="stat-valor">{clanData.puntos}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Top3;
