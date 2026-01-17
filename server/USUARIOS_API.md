# 🔐 Sistema de Autenticación de Usuarios

## Modelo de Usuario

El sistema incluye un modelo de usuario con dos roles:
- **usuario**: Usuario normal con permisos básicos
- **admin**: Administrador con permisos completos

### Campos del Usuario

```javascript
{
  nombre: String (requerido, 3-50 caracteres),
  email: String (requerido, único),
  password: String (requerido, min 6 caracteres, hasheado),
  rol: String (enum: 'usuario' | 'admin', default: 'usuario'),
  activo: Boolean (default: true),
  avatar: String (opcional)
}
```

## 📋 Usuarios de Prueba

### Administrador
- **Email**: admin@torneo.com
- **Password**: admin123
- **Rol**: admin

### Usuario Normal
- **Email**: usuario@torneo.com
- **Password**: usuario123
- **Rol**: usuario

⚠️ **IMPORTANTE**: Cambiar estas contraseñas en producción.

## 🚀 API Endpoints

### Autenticación Pública

#### 1. Registro de Usuario
```http
POST /api/usuarios/registro
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "rol": "usuario"  // opcional, por defecto 'usuario'
}
```

**Respuesta exitosa (201)**:
```json
{
  "mensaje": "Usuario registrado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "65f1234567890abcdef12345",
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "usuario"
  }
}
```

#### 2. Login
```http
POST /api/usuarios/login
Content-Type: application/json

{
  "email": "admin@torneo.com",
  "password": "admin123"
}
```

**Respuesta exitosa (200)**:
```json
{
  "mensaje": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "65f1234567890abcdef12345",
    "nombre": "Administrador",
    "email": "admin@torneo.com",
    "rol": "admin"
  }
}
```

### Rutas Protegidas (requieren token)

Para todas las rutas siguientes, incluir el header:
```http
Authorization: Bearer [tu-token-jwt]
```

#### 3. Obtener Perfil
```http
GET /api/usuarios/perfil
Authorization: Bearer [token]
```

#### 4. Actualizar Perfil
```http
PUT /api/usuarios/perfil
Authorization: Bearer [token]
Content-Type: application/json

{
  "nombre": "Nuevo Nombre",
  "avatar": "https://example.com/avatar.jpg"
}
```

#### 5. Cambiar Contraseña
```http
PUT /api/usuarios/cambiar-password
Authorization: Bearer [token]
Content-Type: application/json

{
  "passwordActual": "password123",
  "passwordNueva": "nuevoPassword456"
}
```

### Rutas de Administrador (requieren rol 'admin')

#### 6. Listar Todos los Usuarios
```http
GET /api/usuarios
Authorization: Bearer [token-admin]
```

#### 7. Obtener Usuario por ID
```http
GET /api/usuarios/:id
Authorization: Bearer [token-admin]
```

#### 8. Actualizar Usuario
```http
PUT /api/usuarios/:id
Authorization: Bearer [token-admin]
Content-Type: application/json

{
  "nombre": "Nombre Actualizado",
  "email": "nuevo@email.com",
  "rol": "admin",
  "activo": true
}
```

#### 9. Eliminar Usuario
```http
DELETE /api/usuarios/:id
Authorization: Bearer [token-admin]
```

## 🔒 Seguridad

- Las contraseñas se hashean con **bcryptjs** antes de guardarlas
- La autenticación se realiza con **JSON Web Tokens (JWT)**
- Los tokens expiran en **30 días**
- El campo `password` nunca se devuelve en las respuestas (excepto para comparación interna)
- Validaciones de email y longitud de campos

## 💻 Uso en el Frontend

### Ejemplo de Login
```javascript
const login = async (email, password) => {
  try {
    const response = await axios.post('http://localhost:5000/api/usuarios/login', {
      email,
      password
    });
    
    // Guardar token en localStorage
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
    
    return response.data;
  } catch (error) {
    console.error('Error al iniciar sesión:', error.response.data);
    throw error;
  }
};
```

### Ejemplo de Petición Autenticada
```javascript
const obtenerPerfil = async () => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await axios.get('http://localhost:5000/api/usuarios/perfil', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error al obtener perfil:', error.response.data);
    throw error;
  }
};
```

## 🛠️ Comandos Útiles

```bash
# Crear usuarios de prueba (admin y usuario)
npm run crear-admin

# Iniciar servidor
npm start

# Iniciar en modo desarrollo
npm run dev
```

## 📝 Variables de Entorno

Asegúrate de tener en tu archivo `.env`:

```env
MONGODB_URI=mongodb://localhost:27017/torneo
PORT=5000
JWT_SECRET=tu_secreto_super_seguro_aqui
```

## 🧪 Pruebas con Postman/Thunder Client

1. **Login**: POST a `/api/usuarios/login` con credenciales
2. Copiar el `token` de la respuesta
3. Para rutas protegidas: Agregar header `Authorization: Bearer [token]`
4. Para rutas de admin: Usar el token del usuario admin

## ⚠️ Notas Importantes

- El primer usuario con rol 'admin' debe crearse con `npm run crear-admin`
- Los tokens JWT tienen una expiración de 30 días
- En producción, cambiar `JWT_SECRET` por un valor seguro y único
- Los usuarios inactivos (`activo: false`) no pueden hacer login
