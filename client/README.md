# IbnSina - Frontend

## Descripción
Frontend de la aplicación IbnSina para el control de medicamentos y signos vitales, desarrollado con React, TypeScript y Material UI.

## Tecnologías
- React 19.1.0
- TypeScript 4.9.5
- React Scripts 5.0.1
- Material-UI (MUI) - Componentes de interfaz
- Emotion - Sistema de estilos

## Características Implementadas

### ✅ Completado
- **Interfaz moderna con Material UI** optimizada para dispositivos móviles
- **Soporte de tema claro/oscuro** con modo oscuro por defecto
- **Navegación lateral** con menú hamburguesa
- **Estructura modular** con componentes reutilizables
- **Páginas de registro e historial** de signos vitales
- **AppBar responsivo** con switch de tema y menú

### 🚧 En Desarrollo
- Formulario de registro de signos vitales
- Visualización de historial con gráficos
- Conexión con API del backend
- Sistema de alertas y notificaciones

## Scripts Disponibles

### `npm start`
Ejecuta la aplicación en modo desarrollo.
Abre [http://localhost:3000](http://localhost:3000) para verla en el navegador.

### `npm test`
Ejecuta el test runner en modo interactivo.

### `npm run build`
Construye la aplicación para producción en la carpeta `build`.

### `npm run eject`
**Nota: Esta es una operación unidireccional. Una vez que ejecutes `eject`, no podrás volver atrás.**

## Estructura del Proyecto
```
client/
├── public/           # Archivos estáticos
├── src/              # Código fuente
│   ├── components/   # Componentes React
│   │   └── MenuNavegacion.tsx
│   ├── pages/        # Páginas de la aplicación
│   │   ├── RegistroSignosVitales.tsx
│   │   └── HistorialSignosVitales.tsx
│   ├── services/     # Servicios API (pendiente)
│   ├── styles/       # Estilos CSS (pendiente)
│   └── utils/        # Utilidades (pendiente)
└── package.json
```

## Componentes Principales

### App.tsx
- Configuración del tema Material UI
- Soporte de modo claro/oscuro
- Navegación entre páginas
- AppBar con menú y switch de tema

### MenuNavegacion.tsx
- Drawer lateral con opciones de navegación
- Iconos descriptivos para cada sección
- Integración con el sistema de navegación

### Páginas
- **RegistroSignosVitales.tsx**: Formulario para registrar signos vitales
- **HistorialSignosVitales.tsx**: Visualización del historial de registros

## Desarrollo
Este frontend se conecta con el backend en `http://localhost:5000` para las operaciones de la API.

## Características de UX/UI

### Modo Oscuro por Defecto
- Optimizado para uso nocturno y dispositivos móviles
- Reduce la fatiga visual
- Mejor contraste para lectura

### Navegación Intuitiva
- Menú hamburguesa accesible
- Iconos descriptivos
- Transiciones suaves

### Responsive Design
- Optimizado para dispositivos móviles
- Adaptable a diferentes tamaños de pantalla
- Interfaz táctil amigable

## Próximos Pasos

### Formulario de Registro
- Campos para todos los signos vitales
- Validaciones en tiempo real
- Envío automático al backend

### Historial y Gráficos
- Tabla de registros históricos
- Gráficos de tendencias
- Filtros y búsqueda

### Integración con API
- Servicios para comunicación con backend
- Manejo de estados de carga
- Gestión de errores

## Desarrollador
- **Rodrigo Álvarez**
- Contacto: incognia@gmail.com

## Licencia
GPLv3 - Rodrigo Ernesto Álvarez Aguilera
