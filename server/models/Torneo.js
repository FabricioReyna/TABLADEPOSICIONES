const mongoose = require('mongoose');

const torneoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  ubicacion: {
    type: String,
    required: true
  },
  equipos: [{
    type: String
  }],
  estado: {
    type: String,
    enum: ['activo', 'finalizado', 'cancelado'],
    default: 'activo'
  },
  tablaPosiciones: [{
    clan: String,
    puntos: { type: Number, default: 0 },
    partidos: { type: Number, default: 0 },
    ganados: { type: Number, default: 0 },
    perdidos: { type: Number, default: 0 }
  }],
  jornadas: [{
    numero: Number,
    completada: { type: Boolean, default: false },
    dia1: {
      fecha: Date,
      equipos: [String],
      resultados: [{
        partido: Number,
        ganador: String,
        perdedor: String
      }]
    },
    dia2: {
      fecha: Date,
      equipos: [String],
      resultados: [{
        partido: Number,
        ganador: String,
        perdedor: String
      }]
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Torneo', torneoSchema);
