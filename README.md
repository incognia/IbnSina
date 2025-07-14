# IbnSina - Sistema de Control de Medicamentos

[![GitHub release](https://img.shields.io/github/v/release/incognia/IbnSina?include_prereleases&label=release)](https://github.com/incognia/IbnSina/releases)
[![GitHub tag](https://img.shields.io/github/v/tag/incognia/IbnSina)](https://github.com/incognia/IbnSina/tags)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/incognia/IbnSina/ci.yml?branch=main&label=build)](https://github.com/incognia/IbnSina/actions)
[![License: GPL v3](https://img.shields.io/github/license/incognia/IbnSina)](LICENSE)

## Descripción
IbnSina es un sistema integral de control de medicamentos y signos vitales diseñado para pacientes con condiciones crónicas como hipertensión y diabetes. El nombre está inspirado en Avicena (Ibn Sina), el médico y filósofo persa del siglo XI, considerado uno de los padres de la medicina moderna.

### Origen del Nombre
**Avicena (980-1037)** fue un médico, filósofo y científico persa que revolucionó la medicina medieval. Su obra "El Canon de la Medicina" fue un texto médico estándar en Europa y el mundo islámico durante siglos. Avicena estableció las bases de la medicina basada en evidencia y desarrolló técnicas quirúrgicas avanzadas para su época. Su enfoque sistemático en el diagnóstico y tratamiento de enfermedades, junto con su énfasis en la observación clínica, lo convierte en una figura inspiradora para sistemas médicos modernos.

## Características Principales

### Backend (Node.js/Express)
- ✅ **API RESTful completa** para gestión de medicamentos y signos vitales
- ✅ **Sistema de signos vitales** con clasificación automática según estándares médicos
- ✅ **Alertas automáticas** basadas en valores críticos (ADA, AHA, OMS)
- ✅ **Cálculo automático de IMC** y clasificación de peso
- ✅ **Base de datos MongoDB** con modelos optimizados
- ✅ **Validaciones robustas** y manejo de errores

### Frontend (React/TypeScript)
- ✅ **Interfaz moderna con Material UI** optimizada para dispositivos móviles
- ✅ **Soporte de tema claro/oscuro** con modo oscuro por defecto
- ✅ **Navegación lateral** con menú hamburguesa
- ✅ **Estructura modular** con componentes reutilizables
- ✅ **Páginas de registro e historial** de signos vitales

### Signos Vitales Soportados
- **Glucosa** (mg/dL) - Clasificación ADA
- **Presión Arterial** (mmHg) - Clasificación AHA
- **Oxigenación** (%) - Clasificación OMS
- **Temperatura** (°C) - Clasificación OMS
- **Peso** (kg) - Cálculo automático de IMC
- **Circunferencia de Cintura** (cm)
- **Síntomas** (texto libre)
- **Dispositivo** (identificación del medidor)

## Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **CORS** - Soporte para peticiones cross-origin

### Frontend
- **React 19.1.0** - Biblioteca de interfaz de usuario
- **TypeScript 4.9.5** - Tipado estático
- **Material-UI (MUI)** - Componentes de interfaz
- **React Scripts 5.0.1** - Herramientas de desarrollo

## Instalación y Configuración

### Prerrequisitos
- Node.js (versión 18 o superior)
- MongoDB Community Server
- npm o yarn

### Instalación

1. **Clonar el repositorio:**
```bash
git clone https://github.com/incognia/IbnSina.git
cd IbnSina
```

2. **Instalar dependencias del backend:**
```bash
npm install
```

3. **Instalar dependencias del frontend:**
```bash
cd client
npm install
```

4. **Configurar MongoDB:**
   - Instalar MongoDB Community Server
   - Crear base de datos `ibnsina`
   - Configurar variables de entorno (ver `env.example`)

5. **Configurar variables de entorno:**
```bash
cp env.example .env
# Editar .env con tus configuraciones
```

### Ejecución

1. **Iniciar el backend:**
```bash
# Desde la raíz del proyecto
npm start
# El servidor estará disponible en http://localhost:5000
```

2. **Iniciar el frontend:**
```bash
# Desde la carpeta client
cd client
npm start
# La aplicación estará disponible en http://localhost:3000
```

**Nota:** En macOS, si tienes activado el "Receptor AirPlay" en Configuración del Sistema, puede causar conflictos con el puerto 5000. Desactívalo temporalmente o cambia el puerto del backend.

## Uso

### Interfaz Web
1. Abre http://localhost:3000 en tu navegador
2. Usa el menú hamburguesa para navegar entre secciones
3. Cambia entre tema claro/oscuro con el botón en la barra superior
4. Registra tus signos vitales en la sección "Registro"
5. Consulta tu historial en la sección "Historial"
6. **Ahora puedes eliminar cualquier registro de signos vitales desde el historial usando el botón de papelera al final de cada fila.**

### API REST
Consulta la [documentación completa de la API](API.md) para todas las operaciones disponibles.

## Documentación

- **[API.md](API.md)** - Documentación completa de la API REST
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Guía de despliegue
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Guía de contribución
- **[SECURITY.md](SECURITY.md)** - Política de seguridad
- **[EJEMPLOS_SIGNOS_VITALES.md](EJEMPLOS_SIGNOS_VITALES.md)** - Ejemplos prácticos de uso

## Estructura del Proyecto

```
IbnSina/
├── server/                 # Backend (Node.js/Express)
│   ├── models/            # Modelos de MongoDB
│   ├── routes/            # Rutas de la API
│   └── index.js           # Servidor principal
├── client/                # Frontend (React/TypeScript)
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── pages/         # Páginas principales
│   │   ├── services/      # Servicios API
│   │   ├── styles/        # Estilos CSS
│   │   └── utils/         # Utilidades
│   └── public/            # Archivos estáticos
├── docs/                  # Documentación adicional
└── README.md              # Este archivo
```

## Características Avanzadas

### Clasificación Automática de Signos Vitales
El sistema clasifica automáticamente los valores según estándares médicos internacionales:

- **Glucosa:** Según criterios ADA (American Diabetes Association)
- **Presión Arterial:** Según criterios AHA (American Heart Association)
- **Oxigenación y Temperatura:** Según criterios OMS (Organización Mundial de la Salud)

### Alertas Automáticas
El sistema genera alertas automáticas para valores críticos:
- Glucosa > 200 mg/dL (Hiperglucemia)
- Presión sistólica > 140 mmHg (Hipertensión)
- Oxigenación < 95% (Hipoxemia)
- Temperatura > 38°C (Fiebre)

### Cálculo de IMC
El sistema calcula automáticamente el Índice de Masa Corporal (IMC) y clasifica el peso:
- Bajo peso: IMC < 18.5
- Peso normal: IMC 18.5-24.9
- Sobrepeso: IMC 25-29.9
- Obesidad: IMC ≥ 30

## Próximos Pasos

- [ ] **Formulario de registro** de signos vitales
- [ ] **Visualización de historial** con gráficos
- [ ] **Sistema de notificaciones** para alertas
- [ ] **Reportes médicos** en PDF
- [ ] **Sincronización móvil** con PWA
- [ ] **Autenticación de usuarios**
- [ ] **Compartir datos** con médicos

## Contribución

¡Las contribuciones son bienvenidas! Consulta [CONTRIBUTING.md](CONTRIBUTING.md) para más detalles.

## Licencia

Este proyecto está bajo la Licencia GPLv3. Ver [LICENSE](LICENSE) para más detalles.

## Desarrollador

- **Rodrigo Álvarez**
- Contacto: incognia@gmail.com

---

*"La medicina es el arte de imitar los procedimientos curativos de la naturaleza." - Avicena* 

## Notas de desarrollo

- A partir de la versión 0.3.0, la validación de dispositivos es estricta y diferenciada por cada medición (glucosa, presión, oxigenación, etc.), lo que garantiza compatibilidad total entre frontend y backend.
- El registro de signos vitales es estable y la estructura de datos está alineada entre frontend y backend para evitar errores de validación.
- La estructura de los datos de signos vitales en el frontend ahora corresponde a la estructura anidada del backend (por ejemplo, glucosa.valor, presionArterial.sistolica, etc.).
- El historial de signos vitales muestra correctamente los valores anidados y alertas.
- Se corrigieron advertencias de ESLint relacionadas con importaciones no utilizadas. 