const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

// Middleware para verificar token
const verificarToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ mensaje: 'Acceso denegado. No hay token.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto_temporal');
    req.usuario = await Usuario.findById(decoded.id);
    
    if (!req.usuario) {
      return res.status(401).json({ mensaje: 'Token inválido' });
    }
    
    next();
  } catch (error) {
    res.status(401).json({ mensaje: 'Token inválido', error: error.message });
  }
};

// Middleware para verificar si es admin
const verificarAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ mensaje: 'Acceso denegado. Se requiere rol de administrador.' });
  }
  next();
};

// Registrar un nuevo usuario
router.post('/registro', async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El email ya está registrado' });
    }

    // Crear nuevo usuario
    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password,
      rol: rol || 'usuario' // Por defecto es 'usuario'
    });

    await nuevoUsuario.save();

    // Generar token
    const token = jwt.sign(
      { id: nuevoUsuario._id, rol: nuevoUsuario.rol },
      process.env.JWT_SECRET || 'secreto_temporal',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      token,
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol
      }
    });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al registrar usuario', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario y incluir el password
    const usuario = await Usuario.findOne({ email }).select('+password');
    
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    // Verificar si el usuario está activo
    if (!usuario.activo) {
      return res.status(401).json({ mensaje: 'Usuario inactivo' });
    }

    // Comparar contraseñas
    const passwordValida = await usuario.compararPassword(password);
    
    if (!passwordValida) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    // Generar token
    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET || 'secreto_temporal',
      { expiresIn: '30d' }
    );

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al iniciar sesión', error: error.message });
  }
});

// Obtener perfil del usuario autenticado
router.get('/perfil', verificarToken, async (req, res) => {
  try {
    res.json({
      usuario: {
        id: req.usuario._id,
        nombre: req.usuario.nombre,
        email: req.usuario.email,
        rol: req.usuario.rol,
        avatar: req.usuario.avatar,
        createdAt: req.usuario.createdAt
      }
    });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al obtener perfil', error: error.message });
  }
});

// Actualizar perfil del usuario autenticado
router.put('/perfil', verificarToken, async (req, res) => {
  try {
    const { nombre, avatar } = req.body;
    
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.usuario._id,
      { nombre, avatar },
      { new: true, runValidators: true }
    );

    res.json({
      mensaje: 'Perfil actualizado exitosamente',
      usuario: {
        id: usuarioActualizado._id,
        nombre: usuarioActualizado.nombre,
        email: usuarioActualizado.email,
        rol: usuarioActualizado.rol,
        avatar: usuarioActualizado.avatar
      }
    });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar perfil', error: error.message });
  }
});

// Cambiar contraseña
router.put('/cambiar-password', verificarToken, async (req, res) => {
  try {
    const { passwordActual, passwordNueva } = req.body;

    const usuario = await Usuario.findById(req.usuario._id).select('+password');
    
    const passwordValida = await usuario.compararPassword(passwordActual);
    if (!passwordValida) {
      return res.status(401).json({ mensaje: 'La contraseña actual es incorrecta' });
    }

    usuario.password = passwordNueva;
    await usuario.save();

    res.json({ mensaje: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al cambiar contraseña', error: error.message });
  }
});

// ============ RUTAS DE ADMINISTRADOR ============

// Obtener todos los usuarios (solo admin)
router.get('/', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const usuarios = await Usuario.find().sort({ createdAt: -1 });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios', error: error.message });
  }
});

// Obtener un usuario por ID (solo admin)
router.get('/:id', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuario', error: error.message });
  }
});

// Actualizar un usuario (solo admin)
router.put('/:id', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const { nombre, email, rol, activo } = req.body;
    
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      { nombre, email, rol, activo },
      { new: true, runValidators: true }
    );

    if (!usuarioActualizado) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json({
      mensaje: 'Usuario actualizado exitosamente',
      usuario: usuarioActualizado
    });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar usuario', error: error.message });
  }
});

// Eliminar un usuario (solo admin)
router.delete('/:id', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
    
    if (!usuarioEliminado) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json({ mensaje: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar usuario', error: error.message });
  }
});

module.exports = { router, verificarToken, verificarAdmin };
