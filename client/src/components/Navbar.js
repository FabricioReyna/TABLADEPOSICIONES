import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { usuario, logout, esAdmin } = useAuth();

  return (
    <div className="navbar">
      <div className="navbar-content">
        <div className="navbar-user">
          <span className="user-icon">👤</span>
          <div className="user-info">
            <span className="user-name">{usuario?.nombre}</span>
            <span className="user-role">
              {esAdmin() ? '👑 Admin' : '🎮 Usuario'}
            </span>
          </div>
        </div>
        <button onClick={logout} className="btn-logout">
          🚪 Salir
        </button>
      </div>
    </div>
  );
}

export default Navbar;
