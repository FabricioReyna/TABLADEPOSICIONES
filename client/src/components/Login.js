import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Login({ onLoginSuccess }) {
  const [modoRegistro, setModoRegistro] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const { login, registro } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      if (modoRegistro) {
        if (!formData.nombre || !formData.email || !formData.password) {
          setError('Todos los campos son obligatorios');
          setCargando(false);
          return;
        }
        await registro(formData.nombre, formData.email, formData.password);
      } else {
        if (!formData.email || !formData.password) {
          setError('Email y contraseña son obligatorios');
          setCargando(false);
          return;
        }
        await login(formData.email, formData.password);
      }
      // Llamar al callback de éxito si existe
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err) {
      setError(err.mensaje || 'Error al procesar la solicitud');
      setCargando(false);
    }
  };

  const cambiarModo = () => {
    setModoRegistro(!modoRegistro);
    setError('');
    setFormData({ nombre: '', email: '', password: '' });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🏆 Torneo de Clanes</h1>
          <h2>{modoRegistro ? 'Crear Cuenta' : 'Iniciar Sesión'}</h2>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          {modoRegistro && (
            <div className="form-group">
              <label htmlFor="nombre">👤 Nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Tu nombre"
                disabled={cargando}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">📧 Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              disabled={cargando}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">🔑 Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={cargando}
            />
          </div>

          <button 
            type="submit" 
            className="btn-login"
            disabled={cargando}
          >
            {cargando ? '⏳ Cargando...' : (modoRegistro ? '✅ Registrarse' : '🚀 Entrar')}
          </button>
        </form>

        <div className="login-footer">
          <button 
            onClick={cambiarModo}
            className="btn-cambiar-modo"
            disabled={cargando}
          >
            {modoRegistro 
              ? '¿Ya tienes cuenta? Inicia sesión' 
              : '¿No tienes cuenta? Regístrate'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
