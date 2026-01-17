import React, { useEffect } from 'react';
import './Toast.css';

function Toast({ mensaje, tipo = 'info', onClose, duracion = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duracion);

    return () => clearTimeout(timer);
  }, [duracion, onClose]);

  const iconos = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  return (
    <div className={`toast toast-${tipo}`}>
      <span className="toast-icon">{iconos[tipo]}</span>
      <span className="toast-mensaje">{mensaje}</span>
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  );
}

export default Toast;
