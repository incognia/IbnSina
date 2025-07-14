# Política de Seguridad - IbnSina

## Reportar Vulnerabilidades de Seguridad

Si descubres una vulnerabilidad de seguridad en IbnSina, por favor **NO** la reportes públicamente. En su lugar, sigue estos pasos:

### Proceso de Reporte

1. **Contacta directamente** al desarrollador:
   - **Email**: incognia@gmail.com
   - **Asunto**: `[SECURITY] Vulnerabilidad en IbnSina`

2. **Incluye en tu reporte**:
   - Descripción detallada de la vulnerabilidad
   - Pasos para reproducir el problema
   - Impacto potencial de la vulnerabilidad
   - Sugerencias de mitigación (si las tienes)

3. **Tiempo de respuesta**: Intentaremos responder dentro de 48 horas

4. **Actualizaciones**: Te mantendremos informado sobre el progreso de la corrección

## Medidas de Seguridad Implementadas

### Autenticación y Autorización
- **JWT Tokens** para autenticación de usuarios
- **Bcrypt** para hashing de contraseñas
- **Middleware de autorización** para proteger rutas
- **Validación de entrada** en todos los endpoints

### Protección de Datos
- **Helmet.js** para headers de seguridad HTTP
- **CORS** configurado apropiadamente
- **Rate limiting** para prevenir ataques de fuerza bruta
- **Sanitización de datos** de entrada

### Base de Datos
- **MongoDB** con configuración segura
- **Validación de esquemas** con Mongoose
- **Índices de seguridad** en campos sensibles
- **Backup automático** de datos

### Frontend
- **HTTPS** obligatorio en producción
- **Content Security Policy** implementado
- **Validación del lado cliente** y servidor
- **Sanitización de datos** antes de renderizar

## Buenas Prácticas de Seguridad

### Para Desarrolladores
1. **Nunca commits credenciales** en el código
2. **Usa variables de entorno** para configuraciones sensibles
3. **Valida todas las entradas** de usuario
4. **Mantén las dependencias actualizadas**
5. **Revisa el código** antes de hacer merge

### Para Usuarios
1. **Usa contraseñas fuertes** y únicas
2. **No compartas** tus credenciales
3. **Cierra sesión** cuando no uses la aplicación
4. **Reporta** comportamientos sospechosos

## Actualizaciones de Seguridad

### Proceso de Actualización
1. **Identificación** de la vulnerabilidad
2. **Desarrollo** de la corrección
3. **Testing** exhaustivo
4. **Despliegue** de la actualización
5. **Notificación** a los usuarios

### Notificaciones
- **Críticas**: Inmediatas por email
- **Altas**: Dentro de 24 horas
- **Medias/Bajas**: En la próxima actualización regular

## Configuración de Seguridad

### Variables de Entorno Requeridas
```env
# JWT Secret (mínimo 32 caracteres)
JWT_SECRET=tu_jwt_secret_super_seguro_y_largo_aqui

# MongoDB URI (usar autenticación)
MONGODB_URI=mongodb://usuario:password@localhost:27017/ibnsina

# Entorno
NODE_ENV=production
```

### Configuración de Producción
```javascript
// Headers de seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const rateLimit = require('express-rate-limit');
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por ventana
}));
```

## Auditoría de Seguridad

### Herramientas Recomendadas
- **npm audit**: Para vulnerabilidades en dependencias
- **ESLint security**: Para detectar problemas de seguridad en código
- **OWASP ZAP**: Para testing de seguridad web
- **Snyk**: Para monitoreo continuo de vulnerabilidades

### Comandos de Auditoría
```bash
# Verificar vulnerabilidades en dependencias
npm audit

# Actualizar dependencias vulnerables
npm audit fix

# Verificar configuración de seguridad
npm run security-check
```

## Contacto de Seguridad

- **Email**: incognia@gmail.com
- **Asunto**: `[SECURITY] IbnSina`
- **Respuesta**: Dentro de 48 horas

## Historial de Vulnerabilidades

### Versión 1.0.0
- No se han reportado vulnerabilidades de seguridad

---

**Nota**: Esta política de seguridad está en constante evolución. Se actualizará según sea necesario para mantener la seguridad del proyecto.

## Desarrollador
- **Rodrigo Álvarez**
- Contacto: incognia@gmail.com 