# CHANGELOG

Todas las modificaciones importantes de este proyecto se documentarán en este archivo.

El formato sigue las recomendaciones de [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y este proyecto utiliza la licencia [GPLv3](LICENSE).

## [Unreleased]
- Sistema completo de control de signos vitales
- Modelo SignosVitales con validaciones médicas
- Endpoints para registro, consulta y estadísticas de signos vitales
- Clasificación automática de glucosa según ADA
- Clasificación automática de presión arterial según AHA
- Alertas automáticas para valores fuera de rango
- Cálculo de IMC y clasificación de peso
- Seguimiento de oxigenación y temperatura
- Estadísticas y tendencias de signos vitales
- Funcionalidades y mejoras en desarrollo.

## [1.0.0] - 2024-06-XX
### Añadido
- Estructura inicial MERN (MongoDB, Express, React, Node.js) para control de medicamentos, peso, IMC y calorías.
- Modelos backend: Usuario (con datos personales, condiciones médicas, métodos para IMC), Medicamento (inventario por cajas, control de dosis diarias, fechas de caducidad, historial de cambios, métodos de cálculo), Dosis (seguimiento de tomas, adherencia, efectos secundarios).
- Rutas API: registro/login de usuarios, gestión de perfil, medicamentos, dosis, inventario y estadísticas.
- Sistema de inventario de medicamentos por cajas, control de dosis diarias, marcadores de consumo, cálculo de pastillas restantes, control de fechas de caducidad por caja y alertas automáticas.
- Endpoints para agregar cajas, marcar dosis como tomadas, resetear dosis diarias y obtener estadísticas de inventario y vencimientos.
- Registro semanal de peso, control de peso, IMC, calorías y menús.
- Documentación detallada en README, incluyendo explicación del nombre IbnSina y licencia GPLv3.
- Configuración de entorno y dependencias (backend y frontend).
- Instalación y configuración de MongoDB Community en macOS.

### Documentación
- **API.md**: Documentación completa de todos los endpoints de la API con ejemplos de uso.
- **DEPLOYMENT.md**: Guía detallada de despliegue en producción con configuraciones de servidor.
- **CONTRIBUTING.md**: Guías de contribución con pautas de código y proceso de desarrollo.
- **SECURITY.md**: Política de seguridad y procedimientos para reportar vulnerabilidades.
- **CHANGELOG.md**: Historial de versiones siguiendo el formato Keep a Changelog.
- Actualización del README principal con referencias a toda la documentación.
- Personalización del README del cliente con información específica del proyecto.

[Unreleased]: https://github.com/tu_usuario/IbnSina/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/tu_usuario/IbnSina/releases/tag/v1.0.0 