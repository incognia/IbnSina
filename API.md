# API Documentation - IbnSina

## Base URL
```
http://localhost:5000/api
```

## Autenticación
La API utiliza JWT para autenticación. Incluye el token en el header:
```
Authorization: Bearer <token>
```

## Endpoints

### Usuarios

#### POST /api/usuarios/registro
Registra un nuevo usuario.

**Body:**
```json
{
  "nombre": "string",
  "email": "string",
  "password": "string",
  "edad": "number",
  "altura": "number",
  "peso": "number",
  "condiciones": ["string"],
  "medicamentosActivos": ["string"]
}
```

#### POST /api/usuarios/login
Inicia sesión de usuario.

**Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

#### GET /api/usuarios/perfil
Obtiene el perfil del usuario autenticado.

#### PUT /api/usuarios/perfil
Actualiza el perfil del usuario.

#### POST /api/usuarios/peso
Registra el peso semanal del usuario.

**Body:**
```json
{
  "peso": "number",
  "fecha": "date"
}
```

#### GET /api/usuarios/imc
Obtiene el historial de IMC del usuario.

### Medicamentos

#### GET /api/medicamentos
Obtiene todos los medicamentos del usuario.

#### POST /api/medicamentos
Crea un nuevo medicamento.

**Body:**
```json
{
  "nombre": "string",
  "descripcion": "string",
  "dosisDiaria": "number",
  "unidad": "string",
  "frecuencia": "string",
  "instrucciones": "string",
  "efectosSecundarios": ["string"],
  "interacciones": ["string"]
}
```

#### GET /api/medicamentos/:id
Obtiene un medicamento específico.

#### PUT /api/medicamentos/:id
Actualiza un medicamento.

#### DELETE /api/medicamentos/:id
Elimina un medicamento.

#### POST /api/medicamentos/:id/cajas
Agrega una nueva caja al inventario.

**Body:**
```json
{
  "cantidad": "number",
  "fechaVencimiento": "date",
  "lote": "string",
  "fabricante": "string"
}
```

#### GET /api/medicamentos/:id/inventario
Obtiene el inventario de un medicamento.

#### POST /api/medicamentos/:id/dosis
Marca una dosis como tomada.

**Body:**
```json
{
  "fecha": "date",
  "hora": "string",
  "cantidad": "number"
}
```

#### GET /api/medicamentos/:id/estadisticas
Obtiene estadísticas del medicamento.

#### GET /api/medicamentos/vencimientos
Obtiene alertas de medicamentos próximos a vencer.

### Dosis

#### GET /api/dosis
Obtiene el historial de dosis del usuario.

#### GET /api/dosis/:medicamentoId
Obtiene dosis de un medicamento específico.

#### POST /api/dosis
Registra una nueva dosis.

**Body:**
```json
{
  "medicamentoId": "string",
  "fecha": "date",
  "hora": "string",
  "cantidad": "number",
  "tomada": "boolean",
  "efectosSecundarios": ["string"],
  "notas": "string"
}
```

#### PUT /api/dosis/:id
Actualiza una dosis.

#### DELETE /api/dosis/:id
Elimina una dosis.

#### GET /api/dosis/adherencia
Obtiene estadísticas de adherencia.

### Signos Vitales

#### GET /api/signos-vitales
Obtiene el historial de signos vitales del usuario.

**Query Parameters:**
- `page`: Número de página (default: 1)
- `limit`: Registros por página (default: 20)
- `tipo`: Tipo de medición (glucosa, presion, oxigenacion, peso, temperatura)
- `fechaInicio`: Fecha de inicio (YYYY-MM-DD)
- `fechaFin`: Fecha de fin (YYYY-MM-DD)
- `orden`: Orden de resultados (asc, desc)

#### GET /api/signos-vitales/:id
Obtiene un registro específico de signos vitales.

#### POST /api/signos-vitales
Registra nuevos signos vitales.

**Body:**
```json
{
  "glucosa": { "valor": 110, "tipo": "ayunas", "dispositivo": { "tipo": "glucometro" } },
  "presionArterial": { "sistolica": 120, "diastolica": 80, "dispositivo": { "tipo": "tensiometro" } },
  "oxigenacion": { "valor": 98, "dispositivo": { "tipo": "oximetro" } },
  "temperatura": { "valor": 36.7, "dispositivo": { "tipo": "termometro" } },
  "peso": { "valor": 70, "dispositivo": { "tipo": "bascula" } },
  "circunferenciaCintura": { "valor": 90, "dispositivo": { "tipo": "cinta_metrica" } },
  "pulso": { "valor": 72, "dispositivo": { "tipo": "smartwatch" } }
}
```

> **Nota:** Cada subdocumento relevante debe incluir su propio campo `dispositivo` si se desea registrar el dispositivo usado. El campo `dispositivo` a nivel raíz ya no es válido ni aceptado.

##### Validación de dispositivos por medición

| Medición                | Valores permitidos para `dispositivo.tipo`         |
|------------------------|---------------------------------------------------|
| glucosa                | `glucometro`, `smartwatch`, `otro`                |
| presionArterial        | `tensiometro`, `smartwatch`, `otro`               |
| oxigenacion            | `oximetro`, `smartwatch`, `otro`                  |
| temperatura            | `termometro`, `otro`                              |
| peso                   | `bascula`, `otro`                                 |
| circunferenciaCintura  | `cinta_metrica`                                   |
| pulso                  | `smartwatch`, `oximetro`, `tensiometro`, `otro`   |

- Si se envía un valor no permitido, la API responderá con error 400 y un mensaje de validación.
- El campo `tipo` es obligatorio dentro de `dispositivo` si se incluye el objeto `dispositivo`.

#### PUT /api/signos-vitales/:id
Actualiza un registro de signos vitales.

#### DELETE /api/signos-vitales/:id
Elimina un registro de signos vitales.

#### GET /api/signos-vitales/estadisticas
Obtiene estadísticas de signos vitales.

**Query Parameters:**
- `fechaInicio`: Fecha de inicio para estadísticas
- `fechaFin`: Fecha de fin para estadísticas
- `tipo`: Tipo de medición para filtrar

#### GET /api/signos-vitales/alertas
Obtiene alertas recientes de signos vitales.

**Query Parameters:**
- `dias`: Número de días hacia atrás (default: 7)

## Códigos de Respuesta

- `200` - Éxito
- `201` - Creado
- `400` - Error de validación
- `401` - No autorizado
- `404` - No encontrado
- `500` - Error del servidor

## Ejemplos de Respuesta

### Éxito
```json
{
  "success": true,
  "data": {},
  "message": "Operación exitosa"
}
```

### Error
```json
{
  "success": false,
  "error": "Mensaje de error",
  "details": {}
}
```

### Ejemplo de payload para registrar signos vitales

```json
{
  "glucosa": { "valor": 110, "tipo": "ayunas", "dispositivo": { "tipo": "glucometro" } },
  "presionArterial": { "sistolica": 120, "diastolica": 80, "dispositivo": { "tipo": "tensiometro" } },
  "oxigenacion": { "valor": 98, "dispositivo": { "tipo": "oximetro" } },
  "temperatura": { "valor": 36.7, "dispositivo": { "tipo": "termometro" } },
  "peso": { "valor": 70, "dispositivo": { "tipo": "bascula" } },
  "circunferenciaCintura": { "valor": 90, "dispositivo": { "tipo": "cinta_metrica" } },
  "pulso": { "valor": 72, "dispositivo": { "tipo": "smartwatch" } }
}
```

### Respuesta de ejemplo para GET /api/signos-vitales

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "fecha": "2024-06-14T12:34:56.789Z",
      "glucosa": { "valor": 110, "tipo": "ayunas", "dispositivo": { "tipo": "glucometro" } },
      "presionArterial": { "sistolica": 120, "diastolica": 80, "dispositivo": { "tipo": "tensiometro" } },
      "oxigenacion": { "valor": 98, "dispositivo": { "tipo": "oximetro" } },
      "temperatura": { "valor": 36.7, "dispositivo": { "tipo": "termometro" } },
      "peso": { "valor": 70, "dispositivo": { "tipo": "bascula" } },
      "circunferenciaCintura": { "valor": 90, "dispositivo": { "tipo": "cinta_metrica" } },
      "pulso": { "valor": 72, "dispositivo": { "tipo": "smartwatch" } },
      "alertas": ["Presión arterial elevada"],
      "imc": 24.2,
      "clasificacionIMC": "peso_normal",
      "createdAt": "2024-06-14T12:34:56.789Z",
      "updatedAt": "2024-06-14T12:34:56.789Z"
    }
    // ... más registros ...
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 42,
    "pages": 3
  }
}
```

- Cada subdocumento relevante tiene su propio campo `dispositivo`.
- El campo `pulso` puede estar como subdocumento independiente o dentro de presión arterial.

## Desarrollador
- **Rodrigo Álvarez**
- Contacto: incognia@gmail.com 