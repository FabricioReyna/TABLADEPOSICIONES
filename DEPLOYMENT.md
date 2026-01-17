# 🚀 Guía de Despliegue - Torneo de Clanes

## ✅ Configuración Completada

Tu aplicación ya está parcialmente configurada. He realizado los siguientes cambios:

1. ✅ Creado archivos `.env.production` y `.env.development` en el cliente
2. ✅ Configurado axios para usar la URL de la API en producción
3. ✅ Eliminado el proxy del `package.json` del cliente

## 📋 Variables de Entorno

### Backend (Ya desplegado en Render)
Tu backend está en: `https://tabladeposiciones.onrender.com`

**Variables de entorno necesarias en Render:**
- `MONGODB_URI`: Tu conexión a MongoDB Atlas
- `JWT_SECRET`: Clave secreta para JWT
- `PORT`: 5000 (Render lo asigna automáticamente)

### Frontend 
Los archivos `.env` ya están creados:
- `.env.development`: Usa `http://localhost:5000` para desarrollo local
- `.env.production`: Usa `https://tabladeposiciones.onrender.com` para producción

## 🌐 Desplegar Frontend en Vercel

### Opción 1: Desde la interfaz web (Recomendado)

1. Ve a [vercel.com](https://vercel.com) e inicia sesión con GitHub
2. Haz clic en "Add New Project"
3. Importa tu repositorio de GitHub
4. Configura:
   - **Framework Preset:** Create React App
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
5. Agrega la variable de entorno:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://tabladeposiciones.onrender.com`
6. Haz clic en "Deploy"

### Opción 2: Desde la terminal

```bash
# Instalar Vercel CLI
npm i -g vercel

# Ir a la carpeta del cliente
cd client

# Ejecutar deploy
vercel

# Seguir las instrucciones:
# - Set up and deploy: Y
# - Which scope?: Tu cuenta
# - Link to existing project?: N
# - Project name: torneo-clanes (o el que prefieras)
# - In which directory is your code?: ./
# - Override settings?: N

# Para producción
vercel --prod
```

## 🔧 Verificar Backend en Render

Asegúrate de que tu backend en Render tenga:

1. **Build Command:** `npm install`
2. **Start Command:** `npm start`
3. **Variables de Entorno:**
   ```
   MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/torneo
   JWT_SECRET=tu_clave_secreta_muy_segura
   PORT=5000
   ```

## 🧪 Probar Localmente

```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client
npm start
```

El frontend usará automáticamente `http://localhost:5000` en desarrollo.

## ✅ CORS en el Backend

Tu backend ya tiene CORS habilitado. Si necesitas restringirlo solo a tu frontend:

```javascript
// En server.js
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://tu-frontend.vercel.app'
  ],
  credentials: true
}));
```

## 📱 URLs Finales

Una vez desplegado todo:

- **Frontend:** `https://tu-proyecto.vercel.app`
- **Backend:** `https://tabladeposiciones.onrender.com`
- **Base de Datos:** MongoDB Atlas

## 🔍 Solución de Problemas

### Error de CORS
Si ves errores de CORS, actualiza el backend en `server.js`:
```javascript
app.use(cors({
  origin: '*', // O especifica tu dominio de Vercel
  credentials: true
}));
```

### Error 502 en Render
- Render en plan gratuito puede tardar 50+ segundos en iniciarse si está inactivo
- La primera carga puede dar timeout, pero funcionará después

### Variables de entorno no funcionan
- Vercel: Redeploya después de agregar variables
- Render: Restart manual después de agregar variables

## 🎉 ¡Listo!

Tu aplicación debería estar funcionando en producción después de seguir estos pasos.
