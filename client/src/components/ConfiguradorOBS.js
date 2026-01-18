import React, { useState, useEffect } from 'react';
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

  // Guardar configuración cuando cambie
  useEffect(() => {
    localStorage.setItem('obsConfig', JSON.stringify(config));
  }, [config]);

  // Guardar tamaño de preview cuando cambie
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
    
    // Solo agregar parámetros que no sean los valores por defecto
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

  return (
    <div className="configurador-container">
      <h1>🎨 Configurador OBS - Tabla de Posiciones</h1>

      <div className="configurador-grid">
        {/* Columna izquierda - Opciones */}
        <div className="configurador-opciones">
          <div className="seccion">
            <h2>📊 Contenido</h2>
            
            <div className="opcion">
              <label>Modo de visualización</label>
              <select value={config.modo} onChange={(e) => handleChange('modo', e.target.value)}>
                <option value="tabla">Tabla completa</option>
                <option value="slider">Slider rotativo</option>
              </select>
            </div>

            {config.modo === 'slider' && (
              <div className="opcion">
                <label>Tiempo de rotación del slider (segundos)</label>
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
            )}

            <div className="opcion">
              <label>Cantidad de clanes a mostrar</label>
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
              <label>Título personalizado</label>
              <input 
                type="text" 
                value={config.titulo} 
                onChange={(e) => handleChange('titulo', e.target.value)}
                placeholder="TOP"
                maxLength="20"
              />
            </div>

            <div className="opcion-checkbox">
              <input 
                type="checkbox" 
                id="medallas" 
                checked={config.medallas}
                onChange={(e) => handleChange('medallas', e.target.checked)}
              />
              <label htmlFor="medallas">Mostrar medallas (🥇🥈🥉)</label>
            </div>

            <div className="opcion-checkbox">
              <input 
                type="checkbox" 
                id="numeros" 
                checked={config.numeros}
                onChange={(e) => handleChange('numeros', e.target.checked)}
              />
              <label htmlFor="numeros">Mostrar números de posición (#1, #2...)</label>
            </div>

            <div className="opcion-checkbox">
              <input 
                type="checkbox" 
                id="puntos" 
                checked={config.puntos}
                onChange={(e) => handleChange('puntos', e.target.checked)}
              />
              <label htmlFor="puntos">Mostrar puntos</label>
            </div>

            <div className="opcion-checkbox">
              <input 
                type="checkbox" 
                id="victorias" 
                checked={config.victorias}
                onChange={(e) => handleChange('victorias', e.target.checked)}
              />
              <label htmlFor="victorias">Mostrar victorias</label>
            </div>

            <div className="opcion-checkbox">
              <input 
                type="checkbox" 
                id="footer" 
                checked={config.footer}
                onChange={(e) => handleChange('footer', e.target.checked)}
              />
              <label htmlFor="footer">Mostrar pie de página (actualización)</label>
            </div>
          </div>

          <div className="seccion">
            <h2>🎨 Estilo Visual</h2>

            <div className="opcion">
              <label>Fondo</label>
              <select value={config.bg} onChange={(e) => handleChange('bg', e.target.value)}>
                <option value="dark">Oscuro</option>
                <option value="black">Negro</option>
                <option value="blue">Azul</option>
                <option value="purple">Morado</option>
                <option value="gradient">Degradado</option>
                <option value="transparent">Transparente</option>
              </select>
            </div>

            <div className="opcion-checkbox">
              <input 
                type="checkbox" 
                id="transparente" 
                checked={config.transparente}
                onChange={(e) => handleChange('transparente', e.target.checked)}
              />
              <label htmlFor="transparente">Fondo transparente (sin fondo)</label>
            </div>

            <div className="opcion-checkbox">
              <input 
                type="checkbox" 
                id="coloresClan" 
                checked={config.coloresClan}
                onChange={(e) => handleChange('coloresClan', e.target.checked)}
              />
              <label htmlFor="coloresClan">Colores especiales por clan</label>
            </div>

            <div className="opcion">
              <label>Tamaño de fuente</label>
              <select value={config.fuente} onChange={(e) => handleChange('fuente', e.target.value)}>
                <option value="pequeña">Pequeña</option>
                <option value="normal">Normal</option>
                <option value="grande">Grande</option>
                <option value="extragrande">Extra Grande</option>
              </select>
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
              <label htmlFor="animaciones">Animaciones de entrada</label>
            </div>
          </div>

          <div className="seccion">
            <h2>📐 Dimensiones</h2>
            
            <div className="opcion">
              <label>Ancho (px)</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input 
                  type="range" 
                  min="300" 
                  max="1200" 
                  step="50"
                  value={config.ancho}
                  onChange={(e) => handleChange('ancho', parseInt(e.target.value))}
                  style={{ flex: 1 }}
                />
                <input 
                  type="number" 
                  min="300" 
                  max="1200" 
                  step="50"
                  value={config.ancho}
                  onChange={(e) => handleChange('ancho', parseInt(e.target.value) || 300)}
                  style={{ width: '80px' }}
                />
              </div>
            </div>

            <div className="opcion">
              <label>Altura (px)</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input 
                  type="range" 
                  min="200" 
                  max="800" 
                  step="50"
                  value={config.altura}
                  onChange={(e) => handleChange('altura', parseInt(e.target.value))}
                  style={{ flex: 1 }}
                />
                <input 
                  type="number" 
                  min="200" 
                  max="800" 
                  step="50"
                  value={config.altura}
                  onChange={(e) => handleChange('altura', parseInt(e.target.value) || 200)}
                  style={{ width: '80px' }}
                />
              </div>
            </div>
          </div>

          <div className="seccion">
            <h2>⏱️ Actualización</h2>
            
            <div className="opcion">
              <label>Velocidad de actualización (segundos)</label>
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

        {/* Columna derecha - Vista previa y URL */}
        <div className="configurador-resultado">
          <div className="seccion-url">
            <h2>🔗 URL para OBS </h2>
            <div className="url-display">
              <input 
                type="text" 
                readOnly 
                value={generarURL()}
                onClick={(e) => e.target.select()}
              />
            </div>
            <button 
              className="btn-copiar-grande" 
              onClick={copiarURL}
            >
              {urlCopiada ? '✅ ¡Copiada!' : '📋 Copiar URL'}
            </button>
          </div>

          <div className="seccion-preview">
            <h2>👁️ Vista Previa en Vivo</h2>
            <div className="control-tamano-preview">
              <label>Tamaño de vista previa</label>
              <input 
                type="range" 
                min="300" 
                max="800" 
                step="50"
                value={tamanoPreview}
                onChange={(e) => setTamanoPreview(parseInt(e.target.value))}
              />
              <span className="valor-actual">{tamanoPreview}px</span>
            </div>
            <div className="preview-frame" style={{ height: tamanoPreview }}>
              <iframe 
                src={generarURL()} 
                title="Vista Previa OBS"
                width="100%"
                height={tamanoPreview}
                frameBorder="0"
              />
            </div>
            <a 
              href={generarURL()} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-preview-grande"
            >
              🔗 Abrir en Nueva Ventana
            </a>
          </div>

          <div className="seccion-instrucciones">
            <h2>📌 Cómo usar en OBS</h2>
            <ol>
              <li>Copia la URL generada arriba</li>
              <li>En OBS: <strong>Fuentes → Agregar → Navegador</strong></li>
              <li>Pega la URL copiada</li>
              <li>Ajusta el tamaño según necesites (recomendado: 600x400)</li>
              <li>¡Listo! Se actualizará automáticamente</li>
            </ol>
          </div>

          <div className="seccion-presets">
            <h2>⚡ Configuraciones Rápidas</h2>
            <button onClick={() => setConfig({
              cantidad: 3, bg: 'dark', transparente: false, medallas: true,
              numeros: true, puntos: true, victorias: true, footer: true,
              coloresClan: true, velocidad: 10, fuente: 'normal',
              animaciones: true, borde: true, titulo: 'TOP', ancho: 600, altura: 600, modo: 'tabla', tiempoSlider: 5
            })}>
              🎯 Clásico (Por defecto)
            </button>
            <button onClick={() => setConfig({
              cantidad: 5, bg: 'gradient', transparente: false, medallas: true,
              numeros: false, puntos: true, victorias: true, footer: false,
              coloresClan: true, velocidad: 15, fuente: 'grande',
              animaciones: true, borde: true, titulo: 'TOP', ancho: 700, altura: 500, modo: 'tabla', tiempoSlider: 5
            })}>
              ✨ Premium
            </button>
            <button onClick={() => setConfig({
              cantidad: 3, bg: 'dark', transparente: true, medallas: true,
              numeros: false, puntos: true, victorias: false, footer: false,
              coloresClan: true, velocidad: 10, fuente: 'grande',
              animaciones: false, borde: false, titulo: 'LÍDERES', ancho: 600, altura: 350, modo: 'tabla', tiempoSlider: 5
            })}>
              👻 Minimalista Transparente
            </button>
            <button onClick={() => setConfig({
              cantidad: 5, bg: 'dark', transparente: false, medallas: false,
              numeros: false, puntos: true, victorias: false, footer: false,
              coloresClan: true, velocidad: 10, fuente: 'grande',
              animaciones: false, borde: false, titulo: 'TOP', ancho: 600, altura: 400, modo: 'slider', tiempoSlider: 4
            })}>
              🎬 Slider Rotativo
            </button>
            <button onClick={() => setConfig({
              cantidad: 12, bg: 'black', transparente: false, medallas: false,
              numeros: true, puntos: true, victorias: true, footer: true,
              coloresClan: false, velocidad: 30, fuente: 'pequeña',
              animaciones: false, borde: false, titulo: 'TABLA COMPLETA', ancho: 800, altura: 600, modo: 'tabla', tiempoSlider: 5
            })}>

              📊 Tabla Completa
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="configurador-footer">
        <div className="footer-info">
          <p className="footer-descripcion">
            🎮 Personaliza cómo se verá tu tabla en OBS y copia la URL generada
          </p>
          <p className="footer-clanes">
            📊 Soporte para hasta 12 clanes simultáneos
          </p>
        </div>
        <div className="footer-copyright">
          <p>© 2026 <strong>Boantek</strong> - Todos los derechos reservados</p>
        </div>
      </div>
    </div>
  );
}

export default ConfiguradorOBS;
