import React, { useState, useEffect } from 'react';
import './TorneoForm.css';

function TorneoForm({ onSubmit, torneoEditar, setTorneoEditar }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    fecha: '',
    ubicacion: '',
    equipos: '',
    estado: 'activo'
  });

  useEffect(() => {
    if (torneoEditar) {
      setFormData({
        nombre: torneoEditar.nombre,
        descripcion: torneoEditar.descripcion,
        fecha: torneoEditar.fecha.split('T')[0],
        ubicacion: torneoEditar.ubicacion,
        equipos: torneoEditar.equipos.join(', '),
        estado: torneoEditar.estado
      });
    }
  }, [torneoEditar]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const torneoData = {
      ...formData,
      equipos: formData.equipos.split(',').map(e => e.trim()).filter(e => e)
    };
    onSubmit(torneoData);
    setFormData({
      nombre: '',
      descripcion: '',
      fecha: '',
      ubicacion: '',
      equipos: '',
      estado: 'activo'
    });
  };

  const handleCancel = () => {
    setTorneoEditar(null);
    setFormData({
      nombre: '',
      descripcion: '',
      fecha: '',
      ubicacion: '',
      equipos: '',
      estado: 'activo'
    });
  };

  return (
    <div className="torneo-form-container">
      <h2>{torneoEditar ? '✏️ Editar Torneo' : '➕ Nuevo Torneo'}</h2>
      <form onSubmit={handleSubmit} className="torneo-form">
        <div className="form-group">
          <label htmlFor="nombre">Nombre del Torneo</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            placeholder="Ej: Copa América 2026"
          />
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
            placeholder="Describe el torneo..."
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="fecha">Fecha</label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="ubicacion">Ubicación</label>
          <input
            type="text"
            id="ubicacion"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleChange}
            required
            placeholder="Ej: Ciudad de México"
          />
        </div>

        <div className="form-group">
          <label htmlFor="equipos">Equipos (separados por coma)</label>
          <input
            type="text"
            id="equipos"
            name="equipos"
            value={formData.equipos}
            onChange={handleChange}
            placeholder="Ej: Equipo A, Equipo B, Equipo C"
          />
        </div>

        <div className="form-group">
          <label htmlFor="estado">Estado</label>
          <select
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
          >
            <option value="activo">Activo</option>
            <option value="finalizado">Finalizado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-submit">
            {torneoEditar ? 'Actualizar' : 'Crear Torneo'}
          </button>
          {torneoEditar && (
            <button type="button" onClick={handleCancel} className="btn-cancel">
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default TorneoForm;
