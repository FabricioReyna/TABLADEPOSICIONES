const mongoose = require('mongoose');
require('dotenv').config();
const Usuario = require('./models/Usuario');

async function crearAdmin() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Conectado a MongoDB');

    // Verificar si ya existe un admin
    const adminExistente = await Usuario.findOne({ email: 'admin@torneo.com' });
    
    if (adminExistente) {
      console.log('⚠️  Ya existe un administrador con ese email');
      process.exit(0);
    }

    // Crear usuario administrador
    const admin = new Usuario({
      nombre: 'Administrador',
      email: 'admin@torneo.com',
      password: 'admin123',
      rol: 'admin'
    });

    await admin.save();

    console.log('\n✅ Usuario administrador creado exitosamente:');
    console.log('   📧 Email: admin@torneo.com');
    console.log('   🔑 Password: admin123');
    console.log('\n⚠️  ¡IMPORTANTE! Cambia esta contraseña después del primer login\n');

    // Crear un usuario normal de ejemplo
    const usuarioNormal = new Usuario({
      nombre: 'Usuario Demo',
      email: 'usuario@torneo.com',
      password: 'usuario123',
      rol: 'usuario'
    });

    await usuarioNormal.save();

    console.log('✅ Usuario normal creado exitosamente:');
    console.log('   📧 Email: usuario@torneo.com');
    console.log('   🔑 Password: usuario123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear usuarios:', error);
    process.exit(1);
  }
}

// Ejecutar la función
crearAdmin();
