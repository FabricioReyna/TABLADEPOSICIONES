import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import TorneoInfo from './components/TorneoInfo';
import TablaPosiciones from './components/TablaPosiciones';
import Jornadas from './components/Jornadas';
import GestionClanes from './components/GestionClanes';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Top3 from './components/Top3';
import { AuthProvider, useAuth } from './context/AuthContext';
import axios from 'axios';


const USE_CLOUD = process.env.REACT_APP_USE_CLOUD === '1';
const API_URL = USE_CLOUD 
  ? process.env.REACT_APP_API_URL_CLOUD 
  : process.env.REACT_APP_API_URL_LOCAL;

axios.defaults.baseURL = API_URL;

console.log(`🔌 Conectando a: ${USE_CLOUD ? '☁️ NUBE' : '💻 LOCAL'} - ${API_URL}`);

function AppContent() {
  const [torneo, setTorneo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [vistaActiva, setVistaActiva] = useState('tabla'); // 'tabla', 'jornadas', 'clanes', 'obs'
  const [mostrarInfo, setMostrarInfo] = useState(true);
  const { estaAutenticado, esAdmin } = useAuth();

  // Obtener el torneo de clanes
  const fetchTorneo = async () => {
    try {
      const response = await axios.get('https://tabladeposiciones.onrender.com/api/torneos');
      if (response.data && response.data.length > 0) {
        setTorneo(response.data[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar el torneo:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTorneo();
  }, []);

  const handleUpdateTorneo = () => {
    fetchTorneo();
  };

  const handleLoginSuccess = () => {
    setMostrarLogin(false);
  };

  // Si se quiere mostrar el login
  if (mostrarLogin) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Mostrar la aplicación (con o sin autenticación)
  return (
    <div className="App">
      {estaAutenticado ? (
        <Navbar />
      ) : (
        <div className="login-prompt">
          <button 
            className="btn-login-header" 
            onClick={() => setMostrarLogin(true)}
          >
            🔑 Iniciar Sesión
          </button>
        </div>
      )}
      <header className="App-header">
        <h1>🏆 Torneo de Clanes 2026</h1>
      </header>

      {/* Navbar de navegación entre vistas */}
      <div className="vista-navbar">
        <button 
          className={`vista-btn ${vistaActiva === 'tabla' ? 'activo' : ''}`}
          onClick={() => setVistaActiva('tabla')}
        >
          📊 Tabla de Posiciones
        </button>
        <button 
          className={`vista-btn ${vistaActiva === 'jornadas' ? 'activo' : ''}`}
          onClick={() => setVistaActiva('jornadas')}
        >
          📅 Calendario de Jornadas
        </button>
        {estaAutenticado && esAdmin() && (
          <button 
            className={`vista-btn ${vistaActiva === 'clanes' ? 'activo' : ''}`}
            onClick={() => setVistaActiva('clanes')}
          >
            👥 Gestión de Clanes
          </button>
        )}
        <button 
          className={`vista-btn ${vistaActiva === 'obs' ? 'activo' : ''}`}
          onClick={() => setVistaActiva('obs')}
        >
          📺 URL para OBS
        </button>
      </div>

      <div className="container">
        {loading ? (
          <div className="loading">Cargando torneo...</div>
        ) : torneo ? (
          <>
            <div className="info-toggle-container">
              <button 
                className="btn-toggle-info"
                onClick={() => setMostrarInfo(!mostrarInfo)}
                title={mostrarInfo ? 'Ocultar información del torneo' : 'Mostrar información del torneo'}
              >
                {mostrarInfo ? '👁️ Ocultar Info' : '👁️ Mostrar Info'}
              </button>
            </div>

            {mostrarInfo && <TorneoInfo torneo={torneo} />}
            
            {vistaActiva === 'tabla' && mostrarInfo && (
              <TablaPosiciones 
                tablaPosiciones={torneo.tablaPosiciones} 
              />
            )}
            
            {vistaActiva === 'tabla' && !mostrarInfo && (
              <div className="vista-oculta-mensaje">
                <p>📊 Tabla de posiciones oculta</p>
                <small>Haz clic en "Mostrar Info" para verla</small>
              </div>
            )}
            
            {vistaActiva === 'jornadas' && (
              <Jornadas 
                jornadas={torneo.jornadas} 
                torneoId={torneo._id}
                onUpdate={handleUpdateTorneo}
                puedeEditar={estaAutenticado && esAdmin()}
              />
            )}
            
            {vistaActiva === 'clanes' && (
              <GestionClanes 
                clanes={torneo.tablaPosiciones}
                torneoId={torneo._id}
                onUpdate={handleUpdateTorneo}
                puedeEditar={estaAutenticado && esAdmin()}
              />
            )}

            {vistaActiva === 'obs' && (
              <div className="obs-info-container">
                <h2>📺 URL para OBS Studio</h2>
                <p>Copia esta URL y úsala como "Browser Source" en OBS para mostrar el TOP 3 en vivo:</p>
                
                <div className="url-card">
                  <h3>🌐 URL Producción</h3>
                  <div className="url-box">
                    <input 
                      type="text" 
                      readOnly 
                      value={`${window.location.origin}/top3`}
                      onClick={(e) => e.target.select()}
                    />
                    <button 
                      className="btn-copy"
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/top3`);
                        alert('✅ URL copiada al portapapeles!');
                      }}
                    >
                      📋 Copiar
                    </button>
                  </div>
                </div>

                <div className="obs-instructions">
                  <h3>📌 Instrucciones para OBS:</h3>
                  <ol>
                    <li>En OBS, click derecho en "Fuentes" → <strong>"Agregar" → "Navegador"</strong></li>
                    <li>Pega la URL copiada arriba</li>
                    <li>Tamaño recomendado: <strong>600 x 400</strong> (ajusta según necesites)</li>
                    <li>Marca <strong>"Actualizar navegador cuando la escena se activa"</strong> (opcional)</li>
                    <li>¡Listo! Se actualizará automáticamente cada 10 segundos</li>
                  </ol>
                </div>

                <div className="obs-preview">
                  <h3>👁️ Vista Previa:</h3>
                  <a 
                    href="/top3" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-preview"
                  >
                    🔗 Abrir vista previa en nueva pestaña
                  </a>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="loading">No hay torneo disponible</div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route path="/top3" element={<Top3 />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
