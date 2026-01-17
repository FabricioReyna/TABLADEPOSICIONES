import React, { useState } from 'react';
import './ConfiguradorOBS.css';

function ConfiguradorOBS() {
  const [config, setConfig] = useState({
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
    titulo: 'TOP'
  });

  const [urlCopiada, setUrlCopiada] = useState(false);

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
      <p className="configurador-descripcion">
        Personaliza cómo se verá tu tabla en OBS y copia la URL generada
      </p>

      <div className="configurador-grid">
        {/* Columna izquierda - Opciones */}
        <div className="configurador-opciones">
          <div className="seccion">
            <h2>📊 Contenido</h2>
            
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
            <h2>🔗 URL para OBS</h2>
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
            <h2>👁️ Vista Previa</h2>
            <p className="preview-info">Abre en nueva ventana para ver el resultado:</p>
            <a 
              href={generarURL()} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-preview-grande"
            >
              🔗 Abrir Vista Previa
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
              animaciones: true, borde: true, titulo: 'TOP'
            })}>
              🎯 Clásico (Por defecto)
            </button>
            <button onClick={() => setConfig({
              cantidad: 5, bg: 'gradient', transparente: false, medallas: true,
              numeros: false, puntos: true, victorias: true, footer: false,
              coloresClan: true, velocidad: 15, fuente: 'grande',
              animaciones: true, borde: true, titulo: 'TOP'
            })}>
              ✨ Premium
            </button>
            <button onClick={() => setConfig({
              cantidad: 3, bg: 'dark', transparente: true, medallas: true,
              numeros: false, puntos: true, victorias: false, footer: false,
              coloresClan: true, velocidad: 10, fuente: 'grande',
              animaciones: false, borde: false, titulo: 'LÍDERES'
            })}>
              👻 Minimalista Transparente
            </button>
            <button onClick={() => setConfig({
              cantidad: 12, bg: 'black', transparente: false, medallas: false,
              numeros: true, puntos: true, victorias: true, footer: true,
              coloresClan: false, velocidad: 30, fuente: 'pequeña',
              animaciones: false, borde: false, titulo: 'TABLA COMPLETA'
            })}>
              📊 Tabla Completa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfiguradorOBS;
