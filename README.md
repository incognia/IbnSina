# IbnSina - Control de Medicamentos

## Descripción
Aplicación web desarrollada para el control y gestión de medicamentos personales. Diseñada específicamente para pacientes con condiciones crónicas como hipertensión y diabetes que requieren medicación diaria.

## Desarrollador
- **Rodrigo Álvarez**
- Contacto: incognia@gmail.com

## Características Principales
- 📋 Catálogo de medicamentos personal
- ⏰ Recordatorios de medicación
- 📊 Seguimiento de dosis tomadas
- 📅 Historial de medicación
- 🔔 Alertas y notificaciones
- 📱 Interfaz responsive y moderna
- ⚖️ Registro semanal de peso corporal
- 🧮 Cálculo automático de IMC
- 🍽️ Conteo de calorías y sugerencia de menús saludables
- 🩸 Control de glucosa (ayunas, postprandial, aleatoria)
- ❤️ Monitoreo de presión arterial (sistólica, diastólica, pulso)
- 💨 Seguimiento de oxigenación sanguínea
- 🌡️ Registro de temperatura corporal
- 📏 Medición de circunferencia de cintura
- 📈 Estadísticas y tendencias de signos vitales
- ⚠️ Alertas automáticas según rangos médicos

## Tecnologías Utilizadas
- **Backend**: Node.js, Express, MongoDB
- **Frontend**: React.js, Material-UI
- **Base de Datos**: MongoDB con Mongoose
- **Autenticación**: JWT

## Instalación

### Prerrequisitos
- Node.js (v16 o superior)
- MongoDB instalado y ejecutándose
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd IbnSina
```

2. **Instalar dependencias**
```bash
npm run install-all
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```
Editar el archivo `.env` con tus configuraciones de MongoDB.

4. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

## Estructura del Proyecto
```
IbnSina/
├── server/                 # Backend (Node.js + Express)
│   ├── controllers/        # Controladores de la API
│   ├── models/            # Modelos de MongoDB
│   ├── routes/            # Rutas de la API
│   ├── middleware/        # Middleware personalizado
│   └── config/            # Configuraciones
├── client/                # Frontend (React)
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── pages/         # Páginas de la aplicación
│   │   ├── services/      # Servicios API
│   │   └── styles/        # Estilos CSS
│   └── public/            # Archivos estáticos
└── package.json
```

## Scripts Disponibles
- `npm run dev`: Ejecuta servidor y cliente en modo desarrollo
- `npm run server`: Solo el servidor backend
- `npm run client`: Solo el cliente frontend
- `npm run build`: Construye la aplicación para producción

## Documentación

### 📚 Guías Principales
- **[API Documentation](API.md)** - Documentación completa de la API
- **[Deployment Guide](DEPLOYMENT.md)** - Guía de despliegue en producción
- **[Contributing Guide](CONTRIBUTING.md)** - Cómo contribuir al proyecto
- **[Security Policy](SECURITY.md)** - Política de seguridad y reporte de vulnerabilidades

### 📋 Control de Cambios
- **[CHANGELOG](CHANGELOG.md)** - Historial de versiones y cambios

### 📖 Ejemplos de Uso
- **[Ejemplos Signos Vitales](EJEMPLOS_SIGNOS_VITALES.md)** - Ejemplos prácticos del control de signos vitales

## Licencia
Este proyecto está licenciado bajo los términos de la licencia GNU General Public License v3.0 o posterior (GPLv3).
Copyright (c) Rodrigo Ernesto Álvarez Aguilera
Consulta el archivo LICENSE para más detalles.

## Contacto
Desarrollado por Rodrigo Ernesto Álvarez Aguilera 

## ¿Por qué el nombre IbnSina?

El nombre del proyecto hace honor a **Ibn Siná** (Avicena, 980-1037), uno de los médicos y pensadores más influyentes de la historia. Nacido en la actual Uzbekistán, Ibn Siná fue un polímata persa de la época de oro del Islam, conocido en Occidente como Avicena. Su obra más famosa, el _Canon de la Medicina_, fue el texto médico de referencia en Europa y el mundo islámico durante siglos. Además de sus contribuciones a la medicina, escribió sobre filosofía, matemáticas, astronomía y música, y es considerado uno de los padres de la medicina moderna y la ciencia experimental. Elegí este nombre como homenaje a su legado y a la importancia del conocimiento y el autocuidado en la salud. 