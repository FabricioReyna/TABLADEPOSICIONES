import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un token guardado al cargar la app
    const tokenGuardado = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');

    if (tokenGuardado && usuarioGuardado) {
      setToken(tokenGuardado);
      setUsuario(JSON.parse(usuarioGuardado));
      // Configurar axios con el token
      axios.defaults.headers.common['Authorization'] = `Bearer ${tokenGuardado}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/usuarios/login', {
        email,
        password
      });

      const { token: nuevoToken, usuario: nuevoUsuario } = response.data;

      // Guardar en localStorage
      localStorage.setItem('token', nuevoToken);
      localStorage.setItem('usuario', JSON.stringify(nuevoUsuario));

      // Actualizar estado
      setToken(nuevoToken);
      setUsuario(nuevoUsuario);

      // Configurar axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${nuevoToken}`;

      return response.data;
    } catch (error) {
      throw error.response?.data || { mensaje: 'Error al iniciar sesión' };
    }
  };

  const logout = () => {
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    // Limpiar estado
    setToken(null);
    setUsuario(null);

    // Limpiar header de axios
    delete axios.defaults.headers.common['Authorization'];
  };

  const registro = async (nombre, email, password) => {
    try {
      const response = await axios.post('/api/usuarios/registro', {
        nombre,
        email,
        password
      });

      const { token: nuevoToken, usuario: nuevoUsuario } = response.data;

      // Guardar en localStorage
      localStorage.setItem('token', nuevoToken);
      localStorage.setItem('usuario', JSON.stringify(nuevoUsuario));

      // Actualizar estado
      setToken(nuevoToken);
      setUsuario(nuevoUsuario);

      // Configurar axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${nuevoToken}`;

      return response.data;
    } catch (error) {
      throw error.response?.data || { mensaje: 'Error al registrarse' };
    }
  };

  const esAdmin = () => {
    return usuario?.rol === 'admin';
  };

  const value = {
    usuario,
    token,
    loading,
    login,
    logout,
    registro,
    esAdmin,
    estaAutenticado: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
