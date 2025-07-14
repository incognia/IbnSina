# Roadmap IbnSina

Este roadmap detalla el estado actual del proyecto, lo que ya está implementado y lo que está pendiente por migrar, mejorar o desarrollar. Incluye tanto la funcionalidad de signos vitales como el inventario de medicamentos, así como mejoras de UX, API y DevOps.

---

## 1. Funcionalidad ya implementada (hasta v0.4.1)

### Migración y limpieza
- Migración completa del frontend de React CRA a Next.js 15.3.5 (App Router, React 19, TypeScript 5)
- Eliminación total de la lógica y campos de dispositivos en signos vitales (frontend, backend y base de datos)
- Interfaz limpia y coherente: barra superior con título y botón de cambio de tema (claro/oscuro), navegación por botones “Registro” e “Historial”, sin menú hamburguesa ni elementos sin funcionalidad
- Limpieza de residuos de CRA y migraciones previas
- Documentación, changelog y badges de versión/release/tag actualizados

### Signos vitales
- Página de Registro de Signos Vitales:
  - Formulario para capturar glucosa, presión arterial, oxigenación, temperatura, peso, cintura, pulso y síntomas
  - Validaciones básicas de campos numéricos
  - Envío de datos al backend (Express/MongoDB)
- Página de Historial de Signos Vitales:
  - Tabla con los registros recientes (sin columnas de dispositivo)
  - Botón para eliminar registros individuales
  - Visualización de alertas generadas automáticamente
- Consumo de API RESTful para registro, obtención y eliminación de signos vitales
- Modo oscuro por defecto, con soporte para modo claro

### Backend y API
- Modelo de signos vitales en MongoDB (sin campos de dispositivo)
- API RESTful para gestión de signos vitales (crear, consultar, eliminar)
- Validaciones básicas y manejo de errores

### Inventario de medicamentos (backend)
- Modelo de medicamentos en MongoDB:
  - Campos: nombre, presentación, inventario (cajas/lotes), dosis, vencimientos, estado, etc.
- API RESTful para medicamentos:
  - Endpoints para crear, consultar, actualizar, eliminar medicamentos
  - Soporte para inventario por cajas/lotes y alertas de vencimiento

---

## 2. Pendiente por implementar o migrar

### Inventario de medicamentos (frontend)
- [ ] Página de Inventario de Medicamentos en Next.js:
    - [ ] Visualización de lista de medicamentos con información clave (nombre, presentación, cantidad, estado)
    - [ ] Formulario para agregar nuevo medicamento
    - [ ] Edición y eliminación de medicamentos existentes
    - [ ] Visualización de inventario por cajas/lotes y vencimientos
    - [ ] Alertas de bajo inventario y próximos vencimientos
    - [ ] Integración con el backend existente
    - [ ] Filtros y búsqueda en el inventario
    - [ ] Mejorar validaciones y feedback en la UI de medicamentos

### Signos vitales y mejoras UX
- [ ] Validaciones avanzadas en el formulario (rango de valores, campos obligatorios, feedback en tiempo real)
- [ ] Confirmación visual tras registro exitoso (snackbar/toast)
- [ ] Edición de registros de signos vitales (no solo eliminación)
- [ ] Paginación o scroll infinito en el historial para grandes volúmenes de datos
- [ ] Filtros por fecha/tipo de medición en el historial

### Funcionalidad avanzada
- [ ] Visualización de historial con gráficos (tendencias de glucosa, presión, etc.)
- [ ] Sistema de notificaciones para alertas críticas (en frontend y/o por email)
- [ ] Reportes médicos descargables en PDF
- [ ] Sincronización móvil (PWA o app nativa)
- [ ] Autenticación de usuarios (login, registro, roles)
- [ ] Compartir datos con médicos o familiares (vía email, PDF, o acceso web)
- [ ] Soporte multilenguaje (i18n)

### Backend y API
- [ ] Mejorar validaciones y manejo de errores en la API
- [ ] Endpoints para estadísticas y reportes agregados
- [ ] Seguridad avanzada (rate limiting, CORS más estricto, JWT real)
- [ ] Tests automáticos de API

### DevOps y calidad
- [ ] Tests unitarios y de integración en frontend y backend
- [ ] Integración continua (CI) y despliegue automático (CD)
- [ ] Mejorar documentación técnica y de usuario final

---

## 3. Notas y decisiones clave
- El campo de dispositivo fue eliminado por ser problemático e inútil en la práctica.
- La migración a Next.js se priorizó para asegurar una base moderna y mantenible.
- El inventario de medicamentos es una prioridad pendiente en el frontend.
- El roadmap debe revisarse y actualizarse tras cada release mayor.

---

**Última actualización:** v0.4.1 (2025-07-14) 