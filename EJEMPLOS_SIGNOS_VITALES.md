# Ejemplos de Uso - Control de Signos Vitales

## Registro de Glucosa

### Glucosa en Ayunas
```bash
curl -X POST http://localhost:5000/api/signos-vitales \
  -H "Content-Type: application/json" \
  -H "user-id: 507f1f77bcf86cd799439011" \
  -d '{
    "glucosa": {
      "valor": 95,
      "tipo": "ayunas",
      "notas": "Medición matutina en ayunas"
    },
    "dispositivo": {
      "marca": "Accu-Chek",
      "modelo": "Active",
      "tipo": "glucometro"
    }
  }'
```

### Glucosa Postprandial
```bash
curl -X POST http://localhost:5000/api/signos-vitales \
  -H "Content-Type: application/json" \
  -H "user-id: 507f1f77bcf86cd799439011" \
  -d '{
    "glucosa": {
      "valor": 140,
      "tipo": "postprandial",
      "notas": "2 horas después del desayuno"
    },
    "dispositivo": {
      "marca": "Accu-Chek",
      "modelo": "Active",
      "tipo": "glucometro"
    }
  }'
```

## Registro de Presión Arterial

### Presión Normal
```bash
curl -X POST http://localhost:5000/api/signos-vitales \
  -H "Content-Type: application/json" \
  -H "user-id: 507f1f77bcf86cd799439011" \
  -d '{
    "presionArterial": {
      "sistolica": 120,
      "diastolica": 80,
      "pulso": 72,
      "posicion": "sentado",
      "brazo": "izquierdo",
      "notas": "Medición en reposo"
    },
    "dispositivo": {
      "marca": "Omron",
      "modelo": "M3",
      "tipo": "tensiometro"
    }
  }'
```

### Presión Elevada (con alerta)
```bash
curl -X POST http://localhost:5000/api/signos-vitales \
  -H "Content-Type: application/json" \
  -H "user-id: 507f1f77bcf86cd799439011" \
  -d '{
    "presionArterial": {
      "sistolica": 150,
      "diastolica": 95,
      "pulso": 85,
      "posicion": "sentado",
      "brazo": "izquierdo",
      "notas": "Presión elevada, consultar médico"
    },
    "dispositivo": {
      "marca": "Omron",
      "modelo": "M3",
      "tipo": "tensiometro"
    }
  }'
```

## Registro Completo de Signos Vitales

```bash
curl -X POST http://localhost:5000/api/signos-vitales \
  -H "Content-Type: application/json" \
  -H "user-id: 507f1f77bcf86cd799439011" \
  -d '{
    "fecha": "2024-06-15T08:30:00Z",
    "glucosa": {
      "valor": 110,
      "tipo": "ayunas",
      "notas": "Medición matutina"
    },
    "presionArterial": {
      "sistolica": 135,
      "diastolica": 88,
      "pulso": 75,
      "posicion": "sentado",
      "brazo": "izquierdo",
      "notas": "Medición en reposo"
    },
    "oxigenacion": {
      "valor": 98,
      "notas": "Oxigenación normal"
    },
    "peso": {
      "valor": 117.0,
      "notas": "Peso matutino"
    },
    "temperatura": {
      "valor": 36.8,
      "unidad": "°C"
    },
    "circunferenciaCintura": {
      "valor": 105,
      "notas": "Medición abdominal"
    },
    "sintomas": [
      {
        "nombre": "dolor_cabeza",
        "intensidad": "leve",
        "duracion": "1 hora"
      }
    ],
    "notas": "Medición completa de la mañana",
    "ubicacion": "casa",
    "dispositivo": {
      "marca": "Omron",
      "modelo": "M3",
      "tipo": "tensiometro"
    }
  }'
```

## Consultas y Estadísticas

### Obtener Historial de Glucosa
```bash
curl "http://localhost:5000/api/signos-vitales?tipo=glucosa&limit=10" \
  -H "user-id: 507f1f77bcf86cd799439011"
```

### Obtener Estadísticas del Último Mes
```bash
curl "http://localhost:5000/api/signos-vitales/estadisticas?fechaInicio=2024-05-15&fechaFin=2024-06-15" \
  -H "user-id: 507f1f77bcf86cd799439011"
```

### Obtener Alertas Recientes
```bash
curl "http://localhost:5000/api/signos-vitales/alertas?dias=7" \
  -H "user-id: 507f1f77bcf86cd799439011"
```

## Clasificaciones Automáticas

### Glucosa (según ADA)
- **Hipoglucemia**: < 70 mg/dL
- **Normal (ayunas)**: 70-99 mg/dL
- **Prediabetes (ayunas)**: 100-125 mg/dL
- **Diabetes (ayunas)**: ≥ 126 mg/dL
- **Normal (postprandial)**: 70-139 mg/dL
- **Prediabetes (postprandial)**: 140-199 mg/dL
- **Diabetes (postprandial)**: ≥ 200 mg/dL

### Presión Arterial (según AHA)
- **Hipotensión**: < 90/60 mmHg
- **Normal**: < 120/80 mmHg
- **Elevada**: 120-129/< 80 mmHg
- **Hipertensión Estadio 1**: 130-139/80-89 mmHg
- **Hipertensión Estadio 2**: ≥ 140/≥ 90 mmHg
- **Crisis Hipertensiva**: ≥ 180/≥ 120 mmHg

### Oxigenación
- **Normal**: ≥ 95%
- **Leve Hypoxemia**: 90-94%
- **Moderada Hypoxemia**: 80-89%
- **Severa Hypoxemia**: < 80%

### IMC
- **Bajo peso**: < 18.5
- **Peso normal**: 18.5-24.9
- **Sobrepeso**: 25-29.9
- **Obesidad Grado 1**: 30-34.9
- **Obesidad Grado 2**: 35-39.9
- **Obesidad Grado 3**: ≥ 40

## Alertas Automáticas

El sistema genera alertas automáticas cuando:

1. **Glucosa baja** (< 70 mg/dL): "Glucosa baja - Consulte a su médico"
2. **Glucosa elevada** (según tipo): "Glucosa elevada - Consulte a su médico"
3. **Presión baja**: "Presión arterial baja"
4. **Presión elevada**: "Presión arterial elevada - Consulte a su médico"
5. **Crisis hipertensiva**: "CRISIS HIPERTENSIVA - Busque atención médica inmediata"
6. **Oxigenación baja**: "Oxigenación baja - Consulte a su médico"
7. **Peso bajo**: "Peso bajo - Consulte a su médico"
8. **Peso elevado**: "Peso elevado - Considere consultar a su médico"

## Desarrollador
- **Rodrigo Álvarez**
- Contacto: incognia@gmail.com 