import React, { useState } from 'react';
import './ModalConfirmacion.css';

function ModalConfirmacion({ titulo, mensaje, onConfirmar, onCancelar, tipo = 'danger' }) {
  return (
    <div className="modal-overlay" onClick={onCancelar}>
      <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
        <div className={`modal-header modal-${tipo}`}>
          <h3>{titulo}</h3>
        </div>
        <div className="modal-body">
          {typeof mensaje === 'string' ? (
            <p>{mensaje}</p>
          ) : (
            mensaje
          )}
        </div>
        <div className="modal-footer">
          <button className="btn-modal-cancelar" onClick={onCancelar}>
            Cancelar
          </button>
          <button className={`btn-modal-confirmar btn-modal-${tipo}`} onClick={onConfirmar}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalConfirmacion;
