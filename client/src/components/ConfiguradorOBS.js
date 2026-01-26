import React, { useState, useEffect } from 'react';
import Toast from './Toast';
import './ConfiguradorOBS.css';

function ConfiguradorOBS() {
  // Cargar configuración guardada o usar valores por defecto
  const configGuardada = localStorage.getItem('obsConfig');
  const tamanoPreviewGuardado = localStorage.getItem('tamanoPreview');
  
  const [config, setConfig] = useState(
    configGuardada ? JSON.parse(configGuardada) : {
      cantidad: 3,
      bg: 'dark',
      transparente: false,
      medallas: true,
      numeros: true,
      puntos: true,
      victorias: true,
      footer: true,
      coloresClan: true,
      velocidad: 10,
      fuente: 'normal',
      animaciones: true,
      borde: true,
      titulo: 'TOP',
      ancho: 600,
      altura: 600,
      modo: 'tabla',
      tiempoSlider: 5
    }
  );

  const [tamanoPreview, setTamanoPreview] = useState(
    tamanoPreviewGuardado ? parseInt(tamanoPreviewGuardado) : 500
  );

  const [urlCopiada, setUrlCopiada] = useState(false);
  const [pestanaActiva, setPestanaActiva] = useState('contenido');
  const [toastConfig, setToastConfig] = useState({ visible: false, mensaje: '', tipo: 'info' });

  // Ajustar tamaño de preview automáticamente según la cantidad de clanes
  useEffect(() => {
    const alturaBase = 150;
    const alturasPorClan = 45;
    const alturaRecomendada = alturaBase + (config.cantidad * alturasPorClan);
    
    if (config.cantidad >= 8) {
      setTamanoPreview(Math.min(alturaRecomendada, 1000));
    } else if (config.cantidad >= 5) {
      setTamanoPreview(600);
    } else {
      setTamanoPreview(500);
    }
  }, [config.cantidad]);

  useEffect(() => {
    localStorage.setItem('obsConfig', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('tamanoPreview', tamanoPreview.toString());
  }, [tamanoPreview]);

  const handleChange = (key, value) => {
    setConfig({ ...config, [key]: value });
    setUrlCopiada(false);
  };

  const generarURL = () => {
    const baseURL = `${window.location.origin}/top3`;
    const params = new URLSearchParams();
    
    if (config.cantidad !== 3) params.append('cantidad', config.cantidad);
    if (config.bg !== 'dark') params.append('bg', config.bg);
    if (config.transparente) params.append('transparente', 'true');
    if (!config.medallas) params.append('medallas', 'false');
    if (!config.numeros) params.append('numeros', 'false');
    if (!config.puntos) params.append('puntos', 'false');
    if (!config.victorias) params.append('victorias', 'false');
    if (!config.footer) params.append('footer', 'false');
    if (!config.coloresClan) params.append('coloresClan', 'false');
    if (config.velocidad !== 10) params.append('velocidad', config.velocidad);
    if (config.fuente !== 'normal') params.append('fuente', config.fuente);
    if (!config.animaciones) params.append('animaciones', 'false');
    if (!config.borde) params.append('borde', 'false');
    if (config.titulo !== 'TOP') params.append('titulo', config.titulo);
    if (config.ancho !== 600) params.append('ancho', config.ancho);
    if (config.altura !== 600) params.append('altura', config.altura);
    if (config.modo !== 'tabla') params.append('modo', config.modo);
    if (config.tiempoSlider !== 5) params.append('tiempoSlider', config.tiempoSlider);

    const queryString = params.toString();
    return queryString ? `${baseURL}?${queryString}` : baseURL;
  };

  const copiarURL = () => {
    const url = generarURL();
    navigator.clipboard.writeText(url);
    setUrlCopiada(true);
    setTimeout(() => setUrlCopiada(false), 3000);
  };

  const mostrarToastInstrucciones = () => {
    const mensaje = `En OBS: Fuentes → Agregar → Navegador. Usa la URL copiada y actualiza cada ${config.velocidad}s.`;
    setToastConfig({ visible: true, mensaje, tipo: 'info' });
  };

  return (
    <div className="configurador-container">
      {toastConfig.visible && (
        <Toast 
          mensaje={toastConfig.mensaje}
          tipo={toastConfig.tipo}
          onClose={() => setToastConfig({ ...toastConfig, visible: false })}
        />
      )}
      <header className="configurador-header">
        <div className="header-content">
          <h1>🎨 Configurador OBS</h1>
          <p>Personaliza tu tabla de posiciones para OBS Studio</p>
        </div>
      </header>

      <div className="configurador-main">
        {/* Panel lateral derecho - Vista previa */}
        <aside className="configurador-preview-panel">
          <div className="preview-sticky">
            <h3>👁️ Vista Previa</h3>
            <div className="preview-container">
              <iframe 
                src={generarURL()} 
                title="Vista Previa OBS"
                frameBorder="0"
              />
            </div>
            <div className="preview-actions">
              <button 
                className="btn-copiar-url"
                onClick={copiarURL}
              >
                {urlCopiada ? '✅ ¡Copiada!' : '📋 Copiar URL'}
              </button>
              <a 
                href={generarURL()} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-abrir-ventana"
              >
                <span className="btn-icon">🔗</span>
                <span className="btn-text">
                  <span className="btn-title">Nueva ventana</span>
                  <span className="btn-sub">Abrir vista OBS</span>
                </span>
              </a>
            </div>
          </div>
        </aside>

        {/* Contenido principal */}
        <main className="configurador-content">
          {/* Pestañas */}
          <div className="pestanas-container">
            <button 
              className={`pestana ${pestanaActiva === 'contenido' ? 'activa' : ''}`}
              onClick={() => setPestanaActiva('contenido')}
            >
              📊 Contenido
            </button>
            <button 
              className={`pestana ${pestanaActiva === 'estilos' ? 'activa' : ''}`}
              onClick={() => setPestanaActiva('estilos')}
            >
              🎨 Estilos
            </button>
            <button 
              className={`pestana ${pestanaActiva === 'dimensiones' ? 'activa' : ''}`}
              onClick={() => setPestanaActiva('dimensiones')}
            >
              📐 Dimensiones
            </button>
            <button 
              className={`pestana ${pestanaActiva === 'presets' ? 'activa' : ''}`}
              onClick={() => setPestanaActiva('presets')}
            >
              ⚡ Presets
            </button>
          </div>

          {/* Contenido de pestañas */}
          <div className="pestana-contenido">
            {pestanaActiva === 'contenido' && (
              <div className="seccion-grid">
                <div className="opcion">
                  <label>📺 Modo de visualización</label>
                  <select value={config.modo} onChange={(e) => handleChange('modo', e.target.value)}>
                    <option value="tabla">Tabla completa</option>
                    <option value="slider">Slider rotativo</option>
                  </select>
                </div>

                {config.modo === 'slider' && (
                  <div className="opcion">
                    <label>⏱️ Tiempo de rotación (segundos)</label>
                    <div className="input-range-group">
                      <input 
                        type="range" 
                        min="2" 
                        max="15" 
                        step="1"
                        value={config.tiempoSlider}
                        onChange={(e) => handleChange('tiempoSlider', parseInt(e.target.value))}
                      />
                      <span className="valor-actual">{config.tiempoSlider}s</span>
                    </div>
                  </div>
                )}

                <div className="opcion">
                  <label>👥 Cantidad de clanes</label>
                  <select value={config.cantidad} onChange={(e) => handleChange('cantidad', parseInt(e.target.value))}>
                    <option value="3">Top 3</option>
                    <option value="5">Top 5</option>
                    <option value="6">Top 6</option>
                    <option value="8">Top 8</option>
                    <option value="10">Top 10</option>
                    <option value="12">Todos (12)</option>
                  </select>
                </div>

                <div className="opcion">
                  <label>✍️ Título personalizado</label>
                  <input 
                    type="text" 
                    value={config.titulo} 
                    onChange={(e) => handleChange('titulo', e.target.value)}
                    placeholder="TOP"
                    maxLength="20"
                  />
                </div>

                <div className="checkboxes-grid">
                  <div className="opcion-checkbox">
                    <input 
                      type="checkbox" 
                      id="medallas" 
                      checked={config.medallas}
                      onChange={(e) => handleChange('medallas', e.target.checked)}
                    />
                    <label htmlFor="medallas">Medallas 🥇🥈🥉</label>
                  </div>

                  <div className="opcion-checkbox">
                    <input 
                      type="checkbox" 
                      id="numeros" 
                      checked={config.numeros}
                      onChange={(e) => handleChange('numeros', e.target.checked)}
                    />
                    <label htmlFor="numeros">Números #1, #2...</label>
                  </div>

                  <div className="opcion-checkbox">
                    <input 
                      type="checkbox" 
                      id="puntos" 
                      checked={config.puntos}
                      onChange={(e) => handleChange('puntos', e.target.checked)}
                    />
                    <label htmlFor="puntos">Puntos</label>
                  </div>

                  <div className="opcion-checkbox">
                    <input 
                      type="checkbox" 
                      id="victorias" 
                      checked={config.victorias}
                      onChange={(e) => handleChange('victorias', e.target.checked)}
                    />
                    <label htmlFor="victorias">Victorias</label>
                  </div>

                  <div className="opcion-checkbox opcion-checkbox-footer">
                    <input 
                      type="checkbox" 
                      id="footer" 
                      checked={config.footer}
                      onChange={(e) => handleChange('footer', e.target.checked)}
                    />
                    <label htmlFor="footer">Pie de página</label>
                  </div>
                </div>
              </div>
            )}

            {pestanaActiva === 'estilos' && (
              <div className="seccion-grid">
                <div className="opcion">
                  <label>🎨 Fondo</label>
                  <select value={config.bg} onChange={(e) => handleChange('bg', e.target.value)}>
                    <option value="dark">Oscuro</option>
                    <option value="black">Negro</option>
                    <option value="blue">Azul</option>
                    <option value="purple">Morado</option>
                    <option value="gradient">Degradado</option>
                    <option value="transparent">Transparente</option>
                  </select>
                </div>

                <div className="opcion">
                  <label>📝 Tamaño de fuente</label>
                  <select value={config.fuente} onChange={(e) => handleChange('fuente', e.target.value)}>
                    <option value="pequeña">Pequeña</option>
                    <option value="normal">Normal</option>
                    <option value="grande">Grande</option>
                    <option value="extragrande">Extra Grande</option>
                  </select>
                </div>

                <div className="checkboxes-grid">
                  <div className="opcion-checkbox">
                    <input 
                      type="checkbox" 
                      id="transparente" 
                      checked={config.transparente}
                      onChange={(e) => handleChange('transparente', e.target.checked)}
                    />
                    <label htmlFor="transparente">Fondo transparente</label>
                  </div>

                  <div className="opcion-checkbox">
                    <input 
                      type="checkbox" 
                      id="coloresClan" 
                      checked={config.coloresClan}
                      onChange={(e) => handleChange('coloresClan', e.target.checked)}
                    />
                    <label htmlFor="coloresClan">Colores por clan</label>
                  </div>

                  <div className="opcion-checkbox">
                    <input 
                      type="checkbox" 
                      id="borde" 
                      checked={config.borde}
                      onChange={(e) => handleChange('borde', e.target.checked)}
                    />
                    <label htmlFor="borde">Borde dorado</label>
                  </div>

                  <div className="opcion-checkbox">
                    <input 
                      type="checkbox" 
                      id="animaciones" 
                      checked={config.animaciones}
                      onChange={(e) => handleChange('animaciones', e.target.checked)}
                    />
                    <label htmlFor="animaciones">Animaciones</label>
                  </div>
                </div>
              </div>
            )}

            {pestanaActiva === 'dimensiones' && (
              <div className="seccion-grid">
                <div className="opcion">
                  <label>📏 Ancho (px)</label>
                  <div className="input-range-group">
                    <input 
                      type="range" 
                      min="300" 
                      max="1200" 
                      step="50"
                      value={config.ancho}
                      onChange={(e) => handleChange('ancho', parseInt(e.target.value))}
                    />
                    <input 
                      type="number" 
                      min="300" 
                      max="1200" 
                      step="50"
                      value={config.ancho}
                      onChange={(e) => handleChange('ancho', parseInt(e.target.value) || 300)}
                      className="numero-input"
                    />
                  </div>
                </div>

                <div className="opcion">
                  <label>📏 Altura (px)</label>
                  <div className="input-range-group">
                    <input 
                      type="range" 
                      min="200" 
                      max="800" 
                      step="50"
                      value={config.altura}
                      onChange={(e) => handleChange('altura', parseInt(e.target.value))}
                    />
                    <input 
                      type="number" 
                      min="200" 
                      max="800" 
                      step="50"
                      value={config.altura}
                      onChange={(e) => handleChange('altura', parseInt(e.target.value) || 200)}
                      className="numero-input"
                    />
                  </div>
                </div>

                <div className="opcion full-width">
                  <label>⏱️ Velocidad de actualización (segundos)</label>
                  <div className="input-range-group">
                    <input 
                      type="range" 
                      min="5" 
                      max="60" 
                      step="5"
                      value={config.velocidad}
                      onChange={(e) => handleChange('velocidad', parseInt(e.target.value))}
                    />
                    <span className="valor-actual">{config.velocidad}s</span>
                  </div>
                </div>
              </div>
            )}

            {pestanaActiva === 'presets' && (
              <div className="presets-grid">
                <button className="preset-btn" onClick={() => setConfig({
                  cantidad: 3, bg: 'dark', transparente: false, medallas: true,
                  numeros: true, puntos: true, victorias: true, footer: true,
                  coloresClan: true, velocidad: 10, fuente: 'normal',
                  animaciones: true, borde: true, titulo: 'TOP', ancho: 600, altura: 600, modo: 'tabla', tiempoSlider: 5
                })}>
                  <span className="preset-emoji">🎯</span>
                  <span className="preset-nombre">Clásico</span>
                </button>
                <button className="preset-btn" onClick={() => setConfig({
                  cantidad: 5, bg: 'gradient', transparente: false, medallas: true,
                  numeros: false, puntos: true, victorias: true, footer: false,
                  coloresClan: true, velocidad: 15, fuente: 'grande',
                  animaciones: true, borde: true, titulo: 'TOP', ancho: 700, altura: 500, modo: 'tabla', tiempoSlider: 5
                })}>
                  <span className="preset-emoji">✨</span>
                  <span className="preset-nombre">Premium</span>
                </button>
                <button className="preset-btn" onClick={() => setConfig({
                  cantidad: 3, bg: 'dark', transparente: true, medallas: true,
                  numeros: false, puntos: true, victorias: false, footer: false,
                  coloresClan: true, velocidad: 10, fuente: 'grande',
                  animaciones: false, borde: false, titulo: 'LÍDERES', ancho: 600, altura: 350, modo: 'tabla', tiempoSlider: 5
                })}>
                  <span className="preset-emoji">👻</span>
                  <span className="preset-nombre">Minimalista</span>
                </button>
                <button className="preset-btn" onClick={() => setConfig({
                  cantidad: 5, bg: 'dark', transparente: false, medallas: false,
                  numeros: false, puntos: true, victorias: false, footer: false,
                  coloresClan: true, velocidad: 10, fuente: 'grande',
                  animaciones: false, borde: false, titulo: 'TOP', ancho: 600, altura: 400, modo: 'slider', tiempoSlider: 4
                })}>
                  <span className="preset-emoji">🎬</span>
                  <span className="preset-nombre">Slider</span>
                </button>
                <button className="preset-btn" onClick={() => setConfig({
                  cantidad: 12, bg: 'black', transparente: false, medallas: true,
                  numeros: true, puntos: true, victorias: true, footer: true,
                  coloresClan: false, velocidad: 30, fuente: 'pequeña',
                  animaciones: false, borde: false, titulo: 'TABLA COMPLETA', ancho: 800, altura: 600, modo: 'tabla', tiempoSlider: 5
                })}>
                  <span className="preset-emoji">📊</span>
                  <span className="preset-nombre">Tabla Completa</span>
                </button>
              </div>
            )}
          </div>

          {/* Instrucciones */}
          <div className="instrucciones-card">
            <h3>📌 Cómo usar en OBS</h3>
            <ol>
              <li>Copia la URL del panel lateral (botón azul)</li>
              <li>En OBS: <strong>Fuentes → Agregar → Navegador</strong></li>
              <li>Pega la URL copiada en el campo URL</li>
              <li>Ajusta el tamaño según necesites</li>
              <li>¡Listo! Se actualizará automáticamente cada {config.velocidad} segundos</li>
            </ol>
            <button className="btn-toast-instrucciones" onClick={mostrarToastInstrucciones}>
              📢 Mostrar instrucción en Toast
            </button>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="configurador-footer">
        <p>© 2026 <strong>Boantek</strong> - Todos los derechos reservados</p>
      </footer>
    </div>
  );
}

export default ConfiguradorOBS;
