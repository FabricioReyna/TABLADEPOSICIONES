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
  const [vistaActiva, setVistaActiva] = useState('tabla'); // 'tabla' o 'jornadas'
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
