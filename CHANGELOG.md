# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere al [Versionado Semántico](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Frontend completo con React y TypeScript
- Interfaz moderna con Material UI (MUI)
- Soporte de tema claro/oscuro con modo oscuro por defecto
- Navegación lateral con menú hamburguesa
- Páginas de registro e historial de signos vitales
- Estructura modular de componentes y páginas
- Optimización para dispositivos móviles

### Changed
- Actualizada documentación del README principal
- Mejorada la estructura del proyecto con carpetas organizadas

### Corregido
- Se actualizaron los tipos y el servicio de API en el frontend para reflejar la estructura anidada real de los signos vitales proveniente del backend.
- Se corrigió la visualización del historial de signos vitales para acceder correctamente a los valores anidados (por ejemplo, glucosa.valor, presionArterial.sistolica, etc.).
- Se eliminó una advertencia de ESLint por importación no utilizada en el formulario de registro de signos vitales.

## [0.2.0] - 2025-01-14

### Added
- Sistema completo de control de signos vitales
- Modelo SignosVitales con campos médicos completos
- API RESTful para gestión de signos vitales
- Clasificación automática según estándares médicos (ADA, AHA, OMS)
- Alertas automáticas para valores críticos
- Cálculo automático de IMC y clasificación de peso
- Rutas para estadísticas y alertas
- Documentación completa de la API
- Ejemplos prácticos de uso con comandos curl

### Changed
- Actualizada documentación del README
- Mejorada la estructura de archivos del proyecto

## [0.1.0] - 2025-01-13

### Added
- Estructura inicial del proyecto MERN
- Backend con Node.js y Express
- Modelos de MongoDB para Usuario, Medicamento y Dosis
- Rutas API básicas para medicamentos
- Frontend con React y TypeScript
- Documentación inicial del proyecto
- README con explicación del origen del nombre IbnSina
- Archivos de configuración y dependencias
- Licencia GPLv3
- Guías de contribución, despliegue y seguridad

### Changed
- Configuración inicial del entorno de desarrollo
- Estructura de carpetas organizada

---

## Notas de Versión

### v0.2.0
Esta versión introduce el sistema completo de control de signos vitales, con clasificación automática según estándares médicos internacionales y alertas para valores críticos.

### v0.1.0
Versión inicial del proyecto con la estructura base MERN y documentación completa. 