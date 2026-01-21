import React, { useState } from 'react';
import axios from 'axios';
import Toast from './Toast';
import ModalConfirmacion from './ModalConfirmacion';
import './GestionClanes.css';

function GestionClanes({ clanes, torneoId, onUpdate, puedeEditar }) {
  const [editando, setEditando] = useState(null);
  const [nombreEditado, setNombreEditado] = useState('');
  const [editandoPuntos, setEditandoPuntos] = useState(null);
  const [puntosEditados, setPuntosEditados] = useState('');
  const [nuevoClan, setNuevoClan] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [toast, setToast] = useState(null);
  const [modalEliminar, setModalEliminar] = useState(null);

  const handleEditar = (clan) => {
    setEditando(clan.clan);
    setNombreEditado(clan.clan);
  };

  const handleEditarPuntos = (clan) => {
    setEditandoPuntos(clan.clan);
    setPuntosEditados(clan.puntos.toString());
  };

  const handleAjustarPuntos = async (nombreClan, cambio) => {
    const clan = clanes.find(c => c.clan === nombreClan);
    if (!clan) return;

    const nuevosPuntos = Math.max(0, clan.puntos + cambio);
    
    setGuardando(true);
    try {
      await axios.put(`https://tabladeposiciones.onrender.com/api/torneos/${torneoId}/clanes/${nombreClan}/puntos`, {
        puntos: nuevosPuntos
      });
      setToast({ mensaje: `Puntos ${cambio > 0 ? 'incrementados' : 'decrementados'} exitosamente`, tipo: 'success' });
      onUpdate();
    } catch (error) {
      console.error('Error al ajustar puntos:', error);
      setToast({ mensaje: 'Error al ajustar los puntos', tipo: 'error' });
    } finally {
      setGuardando(false);
    }
  };

  const handleGuardarPuntos = async () => {
    if (editandoPuntos === null) return;

    const puntosNum = parseInt(puntosEditados);
    if (isNaN(puntosNum) || puntosNum < 0) {
      setToast({ mensaje: 'Los puntos deben ser un número positivo', tipo: 'error' });
      return;
    }

    setGuardando(true);
    try {
      await axios.put(`https://tabladeposiciones.onrender.com/api/torneos/${torneoId}/clanes/${editandoPuntos}/puntos`, {
        puntos: puntosNum
      });
      setToast({ mensaje: 'Puntos actualizados exitosamente', tipo: 'success' });
      setEditandoPuntos(null);
      setPuntosEditados('');
      onUpdate();
    } catch (error) {
      console.error('Error al editar puntos:', error);
      setToast({ mensaje: 'Error al editar los puntos', tipo: 'error' });
    } finally {
      setGuardando(false);
    }
  };

  const handleGuardarEdicion = async () => {
    if (!nombreEditado.trim() || !editando) return;

    setGuardando(true);
    try {
      await axios.put(`https://tabladeposiciones.onrender.com/api/torneos/${torneoId}/clanes/${editando}`, {
        nuevoNombre: nombreEditado.trim()
      });
      setToast({ mensaje: 'Clan actualizado exitosamente', tipo: 'success' });
      setEditando(null);
      setNombreEditado('');
      onUpdate();
    } catch (error) {
      console.error('Error al editar clan:', error);
      setToast({ mensaje: 'Error al editar el clan', tipo: 'error' });
    } finally {
      setGuardando(false);
    }
  };

  const confirmarEliminar = async () => {
    const nombreClan = modalEliminar;
    setModalEliminar(null);

    setGuardando(true);
    try {
      await axios.delete(`https://tabladeposiciones.onrender.com/api/torneos/${torneoId}/clanes/${nombreClan}`);
      setToast({ mensaje: 'Clan eliminado exitosamente', tipo: 'success' });
      onUpdate();
    } catch (error) {
      console.error('Error al eliminar clan:', error);
      setToast({ mensaje: 'Error al eliminar el clan', tipo: 'error' });
    } finally {
      setGuardando(false);
    }
  };

  const handleAgregarClan = async (e) => {
    e.preventDefault();
    if (!nuevoClan.trim()) return;

    setGuardando(true);
    try {
      await axios.post(`https://tabladeposiciones.onrender.com/api/torneos/${torneoId}/clanes`, {
        nombre: nuevoClan.trim()
      });
      setToast({ mensaje: 'Clan agregado exitosamente', tipo: 'success' });
      setNuevoClan('');
      onUpdate();
    } catch (error) {
      console.error('Error al agregar clan:', error);
      setToast({ 
        mensaje: error.response?.data?.mensaje || 'Error al agregar el clan', 
        tipo: 'error' 
      });
    } finally {
      setGuardando(false);
    }
  };

  if (!puedeEditar) {
    return (
      <div className="gestion-clanes-container">
        <h2>👥 Gestión de Clanes</h2>
        <div className="admin-notice">
          <p>🔒 Inicia sesión como administrador para gestionar los clanes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gestion-clanes-container">
      <h2>👥 Gestión de Clanes</h2>
      
      <div className="info-panel">
        <p>📊 Total de clanes: <strong>{clanes.length}</strong></p>
        <p>💡 Puedes agregar, editar o eliminar clanes del torneo</p>
      </div>

      {/* Formulario para agregar nuevo clan */}
      <div className="agregar-clan-section">
        <h3>➕ Agregar Nuevo Clan</h3>
        <form onSubmit={handleAgregarClan} className="agregar-clan-form">
          <input
            type="text"
            placeholder="Nombre del clan"
            value={nuevoClan}
            onChange={(e) => setNuevoClan(e.target.value)}
            maxLength={50}
            disabled={guardando}
          />
          <button 
            type="submit" 
            disabled={guardando || !nuevoClan.trim()}
            title="Agregar nuevo clan al torneo"
          >
            {guardando ? '⏳ Agregando...' : '✅ Agregar'}
          </button>
        </form>
      </div>

      {/* Lista de clanes */}
      <div className="clanes-list-section">
        <h3>📋 Clanes Registrados</h3>
        <div className="clanes-list">
          {clanes
            .sort((a, b) => a.clan.localeCompare(b.clan))
            .map((clan) => (
              <div key={clan.clan} className="clan-item">
                {editando === clan.clan ? (
                  <div className="clan-edit">
                    <input
                      type="text"
                      value={nombreEditado}
                      onChange={(e) => setNombreEditado(e.target.value)}
                      maxLength={50}
                      autoFocus
                    />
                    <div className="clan-edit-actions">
                      <button 
                        className="btn-guardar-edit"
                        onClick={handleGuardarEdicion}
                        disabled={guardando || !nombreEditado.trim()}
                      >
                        ✅
                      </button>
                      <button 
                        className="btn-cancelar-edit"
                        onClick={() => {
                          setEditando(null);
                          setNombreEditado('');
                        }}
                        disabled={guardando}
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                ) : editandoPuntos === clan.clan ? (
                  <div className="clan-edit">
                    <span className="clan-nombre">{clan.clan}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="number"
                        value={puntosEditados}
                        onChange={(e) => setPuntosEditados(e.target.value)}
                        min="0"
                        style={{ width: '80px' }}
                        autoFocus
                      />
                      <span>Pts</span>
                    </div>
                    <div className="clan-edit-actions">
                      <button 
                        className="btn-guardar-edit"
                        onClick={handleGuardarPuntos}
                        disabled={guardando}
                      >
                        ✅
                      </button>
                      <button 
                        className="btn-cancelar-edit"
                        onClick={() => {
                          setEditandoPuntos(null);
                          setPuntosEditados('');
                        }}
                        disabled={guardando}
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="clan-info">
                      <span className="clan-nombre">{clan.clan}</span>
                      <span className="clan-stats">
                        {clan.partidos} PJ • {clan.ganados} PG • {clan.perdidos} PP • {clan.puntos} Pts
                      </span>
                    </div>
                    <div className="clan-actions">
                      <button 
                        className="btn-puntos-ajuste"
                        onClick={() => handleAjustarPuntos(clan.clan, -1)}
                        disabled={guardando || clan.puntos === 0}
                        title="Restar 1 punto"
                      >
                        ➖
                      </button>
                      <button 
                        className="btn-puntos-ajuste"
                        onClick={() => handleAjustarPuntos(clan.clan, 1)}
                        disabled={guardando}
                        title="Sumar 1 punto"
                      >
                        ➕
                      </button>
                      <button 
                        className="btn-editar"
                        onClick={() => handleEditar(clan)}
                        disabled={guardando}
                        title="Editar nombre del clan"
                      >
                        ✏️ Editar
                      </button>
                      <button 
                        className="btn-editar"
                        onClick={() => handleEditarPuntos(clan)}
                        disabled={guardando}
                        title="Editar puntos manualmente"
                      >
                        🎯 Puntos
                      </button>
                      <button 
                        className="btn-eliminar"
                        onClick={() => setModalEliminar(clan.clan)}
                        disabled={guardando}
                        title="Eliminar clan del torneo"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
        </div>
      </div>
      {toast && (
        <Toast 
          mensaje={toast.mensaje}
          tipo={toast.tipo}
          onClose={() => setToast(null)}
        />
      )}

      {modalEliminar && (
        <ModalConfirmacion
          titulo={`🗑️ Eliminar Clan "${modalEliminar}"`}
          mensaje={
            <div>
              <p>¿Estás seguro de eliminar este clan?</p>
              <br />
              <p><strong>Esto eliminará:</strong></p>
              <ul style={{marginLeft: '20px', lineHeight: '1.8'}}>
                <li>El clan de la tabla de posiciones</li>
                <li>Todos sus partidos programados</li>
                <li>Su historial de resultados</li>
              </ul>
              <br />
              <p><strong>Esta acción no se puede deshacer.</strong></p>
            </div>
          }
          onConfirmar={confirmarEliminar}
          onCancelar={() => setModalEliminar(null)}
          tipo="danger"
        />
      )}    </div>
  );
}

export default GestionClanes;
