# Guía de Contribución - IbnSina

¡Gracias por tu interés en contribuir a IbnSina! Este documento proporciona las pautas para contribuir al proyecto.

## Código de Conducta

Este proyecto se compromete a proporcionar un entorno acogedor para todos los contribuyentes. Por favor, sé respetuoso y constructivo en todas las interacciones.

## ¿Cómo Contribuir?

### 1. Reportar Bugs

Antes de crear un reporte de bug:

1. **Busca en los issues existentes** para ver si ya se ha reportado
2. **Verifica que el bug no sea un comportamiento esperado**
3. **Asegúrate de que el bug sea reproducible**

Al reportar un bug, incluye:

- **Descripción clara** del problema
- **Pasos para reproducir** el bug
- **Comportamiento esperado** vs **comportamiento actual**
- **Información del sistema** (OS, versión de Node.js, etc.)
- **Capturas de pantalla** si es relevante

### 2. Solicitar Funcionalidades

Antes de solicitar una nueva funcionalidad:

1. **Verifica que no esté ya planificada** en los issues
2. **Explica claramente** el caso de uso
3. **Describe los beneficios** para los usuarios

### 3. Contribuir Código

#### Configuración del Entorno

1. **Fork del repositorio**
2. **Clona tu fork** localmente
3. **Instala las dependencias**:
   ```bash
   npm run install-all
   ```
4. **Configura las variables de entorno**:
   ```bash
   cp .env.example .env
   ```

#### Flujo de Trabajo

1. **Crea una rama** para tu feature/fix:
   ```bash
   git checkout -b feature/nombre-de-la-funcionalidad
   # o
   git checkout -b fix/nombre-del-fix
   ```

2. **Haz tus cambios** siguiendo las pautas de código

3. **Ejecuta los tests** (cuando estén disponibles):
   ```bash
   npm test
   ```

4. **Verifica que el código funcione**:
   ```bash
   npm run dev
   ```

5. **Commit tus cambios**:
   ```bash
   git add .
   git commit -m "feat: agregar nueva funcionalidad"
   ```

6. **Push a tu fork**:
   ```bash
   git push origin feature/nombre-de-la-funcionalidad
   ```

7. **Crea un Pull Request**

#### Convenciones de Commit

Usa el formato [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Tipos de commit:
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Documentación
- `style`: Cambios de formato
- `refactor`: Refactorización de código
- `test`: Agregar o corregir tests
- `chore`: Cambios en build o herramientas

Ejemplos:
```
feat: agregar sistema de notificaciones push
fix(auth): corregir validación de token JWT
docs: actualizar README con nuevas instrucciones
```

#### Pautas de Código

##### JavaScript/Node.js
- Usa **ES6+** cuando sea posible
- **Indentación**: 2 espacios
- **Punto y coma**: Sí
- **Comillas**: Dobles para strings
- **Nombres de variables**: camelCase
- **Nombres de funciones**: camelCase
- **Nombres de clases**: PascalCase

##### React/TypeScript
- **Componentes**: PascalCase
- **Props**: camelCase
- **Hooks**: camelCase
- **Interfaces**: PascalCase con prefijo I
- **Types**: PascalCase

##### Base de Datos
- **Colecciones**: camelCase
- **Campos**: camelCase
- **Índices**: Nombres descriptivos

#### Estructura de Archivos

```
server/
├── controllers/     # Lógica de negocio
├── models/         # Modelos de MongoDB
├── routes/         # Definición de rutas
├── middleware/     # Middleware personalizado
├── config/         # Configuraciones
└── utils/          # Utilidades

client/
├── src/
│   ├── components/ # Componentes reutilizables
│   ├── pages/      # Páginas de la aplicación
│   ├── services/   # Servicios API
│   ├── hooks/      # Custom hooks
│   ├── types/      # Definiciones de TypeScript
│   ├── utils/      # Utilidades
│   └── styles/     # Estilos
```

### 4. Documentación

- **Actualiza la documentación** cuando agregues nuevas funcionalidades
- **Incluye ejemplos** de uso cuando sea apropiado
- **Documenta las APIs** nuevas o modificadas

### 5. Tests

- **Escribe tests** para nuevas funcionalidades
- **Asegúrate de que los tests pasen** antes de hacer PR
- **Mantén la cobertura de tests** alta

## Proceso de Review

1. **Todos los PRs** serán revisados
2. **Los tests deben pasar** antes de merge
3. **Se pueden solicitar cambios** durante la review
4. **Una vez aprobado**, se hará merge

## Licencia

Al contribuir, aceptas que tus contribuciones serán licenciadas bajo la misma licencia GPLv3 del proyecto.

## Contacto

- **Desarrollador**: Rodrigo Álvarez
- **Email**: incognia@gmail.com
- **Issues**: Usa los issues de GitHub para reportar problemas

## Agradecimientos

¡Gracias a todos los contribuyentes que hacen de IbnSina un proyecto mejor! 