# 📚 Tutorial - Aplicación de Gestión de Torneos de Clanes

## 🎯 Introducción

Esta aplicación es un sistema completo para gestionar torneos de clanes con múltiples jornadas, resultados y estadísticas en tiempo real. Ideal para streamers, organizadores de torneos de gaming y comunidades competitivas.

---

## 🚀 ¿Qué puedes hacer con esta aplicación?

### Para Usuarios (Vista Pública)

1. **Ver la Tabla de Posiciones en vivo**
2. **Consultar el Calendario de Jornadas**
3. **Ver los Resultados de Partidos**

### Para Administradores (Con Login)

1. **Gestionar Clanes** (agregar, editar, eliminar)
2. **Actualizar Resultados de Partidos**
3. **Configurar Overlays para OBS**
4. **Gestionar Jornadas del Torneo**

---

## 📖 Guía de Uso

### 1. 📊 Tabla de Posiciones

#### Vista General

La **Tabla de Posiciones** muestra el ranking actual de todos los clanes participantes.

**Columnas de la tabla:**
- **Pos**: Posición en el ranking (🥇🥈🥉 para el TOP 3)
- **Clan**: Nombre del clan
- **PJ**: Partidos Jugados
- **PG**: Partidos Ganados
- **PP**: Partidos Perdidos
- **Pts**: Puntos totales

**Características:**
- ✅ Los clanes se ordenan automáticamente por puntos
- ✅ En caso de empate, se desempata por partidos ganados
- ✅ Los 3 primeros lugares tienen destacados especiales
- ✅ Algunos clanes tienen colores personalizados (Vegetta, Willy, Nia, Alexby, Roier, Focus)

**¿Cómo funciona el puntaje?**
- **Victoria**: +3 puntos
- **Derrota**: 0 puntos

---

### 2. 📅 Calendario de Jornadas

#### Vista General

El **Calendario de Jornadas** muestra todas las fechas programadas del torneo con sus respectivos enfrentamientos.

**Estructura de las Jornadas:**
- Cada jornada tiene **2 días** de juego
- Cada día tiene **6 partidos** (enfrentamientos 1v1 entre clanes)
- Los partidos se organizan en parejas de clanes

**Navegación:**
- **"Todas"**: Ver todas las jornadas juntas
- **"Jornada X"**: Ver solo una jornada específica

#### Para Usuarios (Vista Pública)

**Lo que puedes ver:**
- 📅 Fechas de cada jornada
- 👥 Enfrentamientos programados
- ✅ Resultados marcados (ganadores destacados en verde)
- ❌ Partidos sin jugar

**Indicadores visuales:**
- ✅ **Fondo verde**: Clan ganador
- ⚪ **Sin color**: Partido pendiente

#### Para Administradores (Con Login)

**Funciones adicionales:**

##### Marcar Resultados
1. **Haz doble clic** sobre el clan ganador
2. El resultado se actualiza instantáneamente
3. Los puntos se suman automáticamente en la tabla de posiciones

**Acciones disponibles:**
- **Primer clic**: Marcar ganador (suma 3 puntos)
- **Segundo clic en el mismo clan**: Desmarcar ganador (resta 3 puntos)
- **Clic en el otro clan**: Cambiar ganador (ajusta puntos automáticamente)

##### Reiniciar Resultados
- Botón **"🔄 Reiniciar Resultados"**: Elimina todos los resultados de todas las jornadas
- Requiere confirmación para evitar eliminaciones accidentales
- Útil para empezar un nuevo torneo

**💡 Tip:** Los cambios se guardan automáticamente y se reflejan en tiempo real en la tabla de posiciones.

---

### 3. 👥 Gestión de Clanes

**⚠️ Sección exclusiva para administradores**

Esta sección te permite administrar completamente los clanes del torneo.

#### Agregar un Clan

1. Ve a la sección **"👥 Gestión de Clanes"**
2. Escribe el nombre del clan en el campo **"Nombre del clan"**
3. Haz clic en **"➕ Agregar Clan"**
4. El clan aparecerá inmediatamente en la lista

**Validaciones:**
- ❌ No se permiten nombres duplicados
- ❌ No se permiten nombres vacíos
- ✅ Los espacios al inicio y final se eliminan automáticamente

#### Editar un Clan

1. Encuentra el clan en la lista
2. Haz clic en el botón **"✏️"** (editar)
3. Cambia el nombre
4. Haz clic en **"💾 Guardar"** o presiona **Enter**
5. Haz clic en **"❌"** para cancelar

**💡 Nota:** Al editar un clan, se actualizan automáticamente:
- Todos los resultados de jornadas
- La tabla de posiciones
- Los enfrentamientos programados

#### Eliminar un Clan

1. Encuentra el clan en la lista
2. Haz clic en el botón **"🗑️"** (eliminar)
3. Confirma la eliminación en el modal

**⚠️ Advertencia:** 
- Al eliminar un clan se pierden todos sus resultados y estadísticas
- Esta acción NO se puede deshacer
- Los enfrentamientos programados con ese clan quedarán incompletos

---

### 4. 🎨 Configurador OBS

**⚠️ Sección exclusiva para administradores**

El **Configurador OBS** te permite crear overlays personalizados para tus streams en OBS/Streamlabs.

#### ¿Qué es un Overlay?

Un overlay es una superposición visual que muestra la tabla de posiciones en tu stream en tiempo real.

#### Cómo Configurar

##### Paso 1: Personaliza la Visualización

**Contenido:**
- **Cantidad de clanes**: Elige cuántos clanes mostrar (Top 3, 5, 6, 8, 10 o todos)
- **Título personalizado**: Cambia el texto del título (por defecto "TOP")

**Elementos Visuales:**
- ☑️ **Medallas**: Muestra 🥇🥈🥉 para el TOP 3
- ☑️ **Números de posición**: Muestra el número de posición (#1, #2, etc.)
- ☑️ **Puntos**: Muestra la columna de puntos totales
- ☑️ **Victorias**: Muestra partidos ganados (PG)
- ☑️ **Footer**: Muestra pie de página con leyenda
- ☑️ **Colores de clan**: Aplica colores personalizados a clanes específicos
- ☑️ **Animaciones**: Activa transiciones suaves
- ☑️ **Borde**: Agrega borde alrededor de la tabla

**Estilo:**
- **Fondo**: 
  - Oscuro (Negro)
  - Claro (Blanco)
  - Azul
  - Gradiente
  - **Transparente** (para superponer sobre tu contenido)
  
- **Fuente**:
  - Normal (Por defecto)
  - Condensada (Más estrecha)
  - Expandida (Más ancha)

**Actualización:**
- **Velocidad de actualización**: Ajusta cada cuántos segundos se actualiza (1-60 segundos)

##### Paso 2: Vista Previa en Vivo

El panel derecho muestra **en tiempo real** cómo se verá tu overlay con la configuración actual.

**Características de la vista previa:**
- 🔄 Se actualiza instantáneamente con cada cambio
- 📊 Muestra los datos reales del torneo
- 🎨 Aplica todos los estilos seleccionados

##### Paso 3: Generar URL para OBS

1. Una vez satisfecho con la configuración, haz clic en **"📋 Copiar URL para OBS"**
2. La URL se copia automáticamente al portapapeles
3. Verás una confirmación: **"✅ URL copiada al portapapeles"**

##### Paso 4: Agregar a OBS/Streamlabs

**En OBS Studio:**
1. Haz clic en **"+"** en la sección de Fuentes
2. Selecciona **"Navegador"**
3. Dale un nombre (ej: "Tabla TOP 3")
4. Pega la URL copiada en el campo **"URL"**
5. Configura el tamaño:
   - **Ancho**: 400-600px (depende de tu configuración)
   - **Alto**: 300-800px (según cantidad de clanes)
6. Marca **"Actualizar navegador cuando la escena se vuelve activa"**
7. Haz clic en **"Aceptar"**

**En Streamlabs OBS:**
1. Haz clic en **"+"** en Fuentes
2. Selecciona **"Widget de navegador"**
3. Pega la URL en el campo de URL
4. Ajusta tamaño y posición
5. Guarda

**💡 Tips para OBS:**
- Si seleccionaste "Fondo transparente", puedes superponer la tabla sobre tu gameplay
- Ubica la tabla en una esquina donde no tape contenido importante
- Usa diferentes configuraciones para diferentes escenas
- La tabla se actualiza automáticamente según la velocidad configurada

##### Ejemplo de URL

```
https://tudominio.com/top3?cantidad=5&bg=transparente&transparente=true&velocidad=5&titulo=RANKING
```

**Parámetros comunes:**
- `cantidad=5`: Muestra 5 clanes
- `bg=transparente`: Fondo transparente
- `velocidad=5`: Actualiza cada 5 segundos
- `titulo=RANKING`: Cambia el título
- `medallas=false`: Oculta medallas
- `puntos=false`: Oculta columna de puntos

---

### 5. 🔑 Sistema de Login (Administradores)

#### Iniciar Sesión

1. Haz clic en **"🔑 Iniciar Sesión"** en la esquina superior
2. Ingresa tu usuario y contraseña de administrador
3. Haz clic en **"Ingresar"**

**Una vez autenticado:**
- ✅ Aparece la barra de navegación con tu nombre
- ✅ Se desbloquean las secciones de administración
- ✅ Puedes ver y usar el botón **"Cerrar Sesión"**

#### Permisos de Administrador

Con una cuenta de administrador puedes:
- ✏️ Editar resultados de partidos
- 👥 Gestionar clanes (agregar, editar, eliminar)
- 🎨 Acceder al configurador OBS
- 🔄 Reiniciar resultados del torneo

#### Cerrar Sesión

1. Haz clic en **"Cerrar Sesión"** en la barra de navegación
2. Volverás a la vista pública
3. Las funciones de administración se ocultarán

---

## 🎮 Flujo de Trabajo Típico

### Para Organizar un Torneo

#### Configuración Inicial
1. **Inicia sesión** como administrador
2. Ve a **"👥 Gestión de Clanes"**
3. **Agrega todos los clanes** participantes
4. Verifica que aparezcan en la tabla de posiciones

#### Durante las Jornadas
1. Ve a **"📅 Calendario de Jornadas"**
2. Selecciona la jornada actual
3. **Doble clic** en los clanes ganadores a medida que terminan los partidos
4. La tabla de posiciones se actualiza automáticamente

#### Para Streamers
1. Ve a **"🎨 Configurador OBS"**
2. Personaliza el overlay a tu gusto
3. **Copia la URL**
4. Agrégala a OBS como fuente de navegador
5. Tu stream mostrará la tabla actualizada en vivo

#### Entre Jornadas
- Los usuarios pueden consultar:
  - 📊 Tabla de posiciones actualizada
  - 📅 Resultados de jornadas anteriores
  - 📅 Próximos enfrentamientos

#### Finalizar Torneo
- Revisa la tabla final
- El TOP 3 se destaca automáticamente con medallas

#### Nuevo Torneo
1. **Opcional**: Elimina clanes que no participen
2. Agrega nuevos clanes si es necesario
3. Haz clic en **"🔄 Reiniciar Resultados"** para limpiar todos los resultados
4. Confirma la acción
5. ¡Listo para empezar de nuevo!

---

## 💡 Tips y Mejores Prácticas

### Para Administradores

1. **Guarda los cambios progresivamente**: Cada resultado se guarda automáticamente, no temas marcar resultados uno por uno

2. **Verifica los resultados**: Antes de marcar un resultado, confirma que sea el equipo correcto para evitar cambios

3. **Usa el configurador OBS**: Prueba diferentes configuraciones en la vista previa antes de copiar la URL

4. **Nombra los clanes claramente**: Usa nombres únicos y fáciles de identificar

5. **Backup de datos**: Los datos se guardan en la base de datos, pero considera hacer respaldos periódicos

### Para Streamers

1. **Fondo transparente**: Usa esta opción para integrar la tabla naturalmente en tu stream

2. **Posicionamiento**: Coloca la tabla donde no tape información importante (esquina superior derecha es popular)

3. **Actualización moderada**: 5-10 segundos es un buen intervalo de actualización (no sobrecarga y se ve fluido)

4. **Múltiples escenas**: Crea diferentes overlays para diferentes momentos:
   - **TOP 3** para la escena principal
   - **Tabla completa** para recaps entre partidos

5. **Tamaño responsive**: Ajusta el tamaño en OBS hasta que se vea equilibrado con tu layout

### Para Usuarios

1. **Consulta regular**: La tabla se actualiza en tiempo real, refresca la página si no ves cambios

2. **Navega entre secciones**: Usa los botones de navegación para moverte entre tabla y jornadas

3. **Comparte**: La URL es amigable para compartir con otros participantes o espectadores

---

## 📱 Interfaz Responsive

La aplicación es **completamente responsive** y funciona en:
- 💻 Desktop
- 📱 Tablets
- 📱 Smartphones

**Optimizaciones móviles:**
- Tablas con scroll horizontal en pantallas pequeñas
- Botones de tamaño táctil
- Navegación simplificada
- Formularios adaptados

---

## 🔧 Resolución de Problemas

### La tabla no se actualiza

1. Refresca la página (F5)
2. Verifica tu conexión a internet
3. Comprueba que el servidor backend esté funcionando

### No puedo marcar resultados

- Asegúrate de estar **autenticado** como administrador
- Verifica que estés haciendo **doble clic** en el clan ganador

### El overlay no se ve en OBS

1. Verifica que la URL esté correctamente pegada
2. Comprueba que OBS tenga acceso a internet
3. Ajusta el tamaño de la fuente de navegador
4. Habilita "Actualizar navegador cuando la escena se vuelve activa"

### Error al agregar clan

- Verifica que el nombre no esté duplicado
- Asegúrate de que el nombre no esté vacío
- Comprueba tu conexión al servidor

### Los puntos no cuadran

1. Revisa todos los resultados marcados en las jornadas
2. Verifica que no haya resultados duplicados
3. Usa "🔄 Reiniciar Resultados" y vuelve a marcar si es necesario

---

## 🎯 Casos de Uso

### Caso 1: Torneo de 12 Clanes, 6 Jornadas

**Configuración:**
- 12 clanes registrados
- 6 jornadas programadas (2 días cada una)
- 6 partidos por día = 12 partidos por jornada
- Total: 72 partidos

**Gestión:**
1. Registra los 12 clanes
2. Marca resultados después de cada jornada
3. Usa overlay "TOP 3" durante streams
4. Consulta la tabla entre jornadas

### Caso 2: Transmisión en Vivo

**Setup:**
- OBS con overlay transparente
- TOP 5 visible en esquina superior derecha
- Actualización cada 10 segundos
- Sin footer para ahorrar espacio

**Durante el stream:**
- Administrador marca resultados en tiempo real
- Overlay se actualiza automáticamente
- Viewers ven la tabla actualizada
- Streamer no necesita intervenir

### Caso 3: Gestión Comunitaria

**Uso:**
- Página web pública para la comunidad
- Administradores rotativos con cuentas propias
- Clanes pueden seguir sus posiciones
- Estadísticas accesibles 24/7

---

## 📊 Estadísticas y Métricas

### Qué se rastrea automáticamente

Para cada clan:
- ✅ Puntos totales
- ✅ Partidos jugados (PJ)
- ✅ Partidos ganados (PG)
- ✅ Partidos perdidos (PP)
- ✅ Posición en el ranking

### Cómo se calculan los puntos

```
Puntos = Partidos Ganados × 3
```

**Ejemplo:**
- Clan con 8 victorias = 8 × 3 = **24 puntos**
- Clan con 3 victorias = 3 × 3 = **9 puntos**

### Criterios de desempate

Si dos clanes tienen los mismos puntos:
1. Se compara **Partidos Ganados** (mayor primero)
2. Si aún empatan, mantienen posiciones consecutivas

---

## 🚀 Próximas Funcionalidades (Roadmap)

Ideas para expandir la aplicación:

- 📊 **Estadísticas avanzadas**: Rachas de victorias, head-to-head
- 📈 **Gráficos de evolución**: Ver cómo han progresado los clanes
- 🏆 **Historial de torneos**: Archivo de torneos pasados
- 👤 **Perfiles de clan**: Página individual para cada clan
- 📱 **Notificaciones**: Alertas cuando se actualiza un resultado
- 🎮 **Integración Twitch**: Comandos de chat para consultar tabla
- 📸 **Exportar imágenes**: Generar imágenes de la tabla para redes sociales
- 🔄 **Sincronización multi-dispositivo**: Múltiples admins simultáneos
- 📅 **Generador de jornadas**: Crear enfrentamientos automáticamente
- 🎨 **Temas personalizados**: Más opciones de diseño

---

## 🤝 Soporte

Si tienes problemas o sugerencias:

1. Revisa esta guía primero
2. Verifica la sección de **Resolución de Problemas**
3. Contacta al administrador del sistema
4. Reporta bugs o sugiere mejoras

---

## 📝 Notas Finales

Esta aplicación está diseñada para ser **intuitiva y fácil de usar**, tanto para administradores como para espectadores.

**Recuerda:**
- 🔐 Protege tus credenciales de administrador
- 💾 Los cambios se guardan automáticamente
- 🔄 Puedes deshacer resultados con doble clic
- 🎨 Experimenta con el configurador OBS
- 📊 La tabla siempre refleja los datos más recientes

**¡Disfruta organizando tu torneo!** 🏆

---

**Versión del Tutorial**: 1.0  
**Última actualización**: Enero 2026  
**Aplicación**: Torneo de Clanes 2026
