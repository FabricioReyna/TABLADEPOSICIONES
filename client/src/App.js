import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import TablaPosiciones from './components/TablaPosiciones';
import Jornadas from './components/Jornadas';
import GestionClanes from './components/GestionClanes';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Top3 from './components/Top3';
import ConfiguradorOBS from './components/ConfiguradorOBS';
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
      <div className="app-content-wrapper">
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
            {vistaActiva === 'tabla' && (
              <TablaPosiciones 
                tablaPosiciones={torneo.tablaPosiciones} 
              />
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
                <h2>🎨 Configurador Personalizado OBS</h2>
                <p>Personaliza cómo quieres que se vea tu tabla en OBS Studio con todas las opciones disponibles:</p>
                
                <div className="obs-configurador-link">
                  <a 
                    href="/configurador-obs" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-configurador"
                  >
                    🚀 Abrir Configurador Completo
                  </a>
                  <p className="configurador-descripcion">
                    ✨ Opciones: tamaño, colores, transparencia, animaciones, y mucho más
                  </p>
                </div>

                <div className="url-card">
                  <h3>⚡ URL Rápida (configuración por defecto)</h3>
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
                  <p className="url-info">Esta URL muestra el TOP 3 con la configuración estándar</p>
                </div>

                <div className="obs-instructions">
                  <h3>📌 Instrucciones para OBS:</h3>
                  <ol>
                    <li>Usa el <strong>Configurador Completo</strong> para personalizar tu tabla</li>
                    <li>Copia la URL generada</li>
                    <li>En OBS: <strong>Fuentes → Agregar → Navegador</strong></li>
                    <li>Pega la URL y ajusta el tamaño (recomendado: 600x400)</li>
                    <li>¡Se actualizará automáticamente!</li>
                  </ol>
                </div>

                <div className="obs-preview">
                  <h3>👁️ Vista Previa Rápida:</h3>
                  <a 
                    href="/top3" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-preview"
                  >
                    🔗 Ver TOP 3 por defecto
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

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <p>© 2026 <strong>Boantek</strong> - Todos los derechos reservados</p>
        </div>
      </footer>
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
          <Route path="/configurador-obs" element={<ConfiguradorOBS />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
