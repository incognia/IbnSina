const mongoose = require('mongoose');

const signosVitalesSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario es requerido']
    },
    // Fecha y hora de la medición
    fecha: {
        type: Date,
        required: [true, 'La fecha es requerida'],
        default: Date.now
    },
    // Glucosa (mg/dL)
    glucosa: {
        valor: {
            type: Number,
            min: [0, 'La glucosa no puede ser negativa'],
            max: [1000, 'Valor de glucosa demasiado alto']
        },
        unidad: {
            type: String,
            enum: ['mg/dL', 'mmol/L'],
            default: 'mg/dL'
        },
        tipo: {
            type: String,
            enum: ['ayunas', 'postprandial', 'aleatoria', 'antes_comida', 'despues_comida'],
            required: function() { return this.glucosa && this.glucosa.valor; }
        },
        notas: String
    },
    // Presión arterial (mmHg)
    presionArterial: {
        sistolica: {
            type: Number,
            min: [50, 'Presión sistólica demasiado baja'],
            max: [300, 'Presión sistólica demasiado alta']
        },
        diastolica: {
            type: Number,
            min: [30, 'Presión diastólica demasiado baja'],
            max: [200, 'Presión diastólica demasiado alta']
        },
        pulso: {
            type: Number,
            min: [30, 'Pulso demasiado bajo'],
            max: [200, 'Pulso demasiado alto']
        },
        posicion: {
            type: String,
            enum: ['sentado', 'acostado', 'de_pie'],
            default: 'sentado'
        },
        brazo: {
            type: String,
            enum: ['izquierdo', 'derecho'],
            default: 'izquierdo'
        },
        notas: String
    },
    // Oxigenación (%)
    oxigenacion: {
        valor: {
            type: Number,
            min: [70, 'Oxigenación demasiado baja'],
            max: [100, 'Oxigenación no puede ser mayor a 100%']
        },
        notas: String
    },
    // Temperatura (°C)
    temperatura: {
        valor: {
            type: Number,
            min: [30, 'Temperatura demasiado baja'],
            max: [45, 'Temperatura demasiado alta']
        },
        unidad: {
            type: String,
            enum: ['°C', '°F'],
            default: '°C'
        },
        notas: String
    },
    // Peso (kg)
    peso: {
        valor: {
            type: Number,
            min: [20, 'Peso demasiado bajo'],
            max: [500, 'Peso demasiado alto']
        },
        notas: String
    },
    // Circunferencia de cintura (cm)
    circunferenciaCintura: {
        valor: {
            type: Number,
            min: [50, 'Circunferencia demasiado baja'],
            max: [200, 'Circunferencia demasiado alta']
        },
        notas: String
    },
    // Pulso independiente
    pulso: {
        valor: {
            type: Number,
            min: [30, 'Pulso demasiado bajo'],
            max: [200, 'Pulso demasiado alto']
        },
        notas: String
    },
    // Síntomas asociados
    sintomas: [{
        nombre: {
            type: String,
            required: true
        },
        intensidad: {
            type: String,
            enum: ['leve', 'moderado', 'severo'],
            default: 'leve'
        },
        duracion: String
    }],
    // Notas generales
    notas: String,
    // Ubicación de la medición
    ubicacion: {
        type: String,
        enum: ['casa', 'consulta_medica', 'farmacia', 'hospital', 'otro'],
        default: 'casa'
    }
}, {
    timestamps: true
});

// Índices para optimizar consultas
signosVitalesSchema.index({ usuario: 1, fecha: -1 });
signosVitalesSchema.index({ usuario: 1, 'glucosa.valor': 1 });
signosVitalesSchema.index({ usuario: 1, 'presionArterial.sistolica': 1 });

// Método para obtener el estado de la glucosa
signosVitalesSchema.methods.getEstadoGlucosa = function() {
    if (!this.glucosa || !this.glucosa.valor) return null;
    
    const valor = this.glucosa.valor;
    const tipo = this.glucosa.tipo;
    
    // Rangos según ADA (American Diabetes Association)
    if (tipo === 'ayunas') {
        if (valor < 70) return 'hipoglucemia';
        if (valor >= 70 && valor <= 99) return 'normal';
        if (valor >= 100 && valor <= 125) return 'prediabetes';
        return 'diabetes';
    } else if (tipo === 'postprandial') {
        if (valor < 70) return 'hipoglucemia';
        if (valor >= 70 && valor <= 139) return 'normal';
        if (valor >= 140 && valor <= 199) return 'prediabetes';
        return 'diabetes';
    }
    
    return 'no_clasificado';
};

// Método para obtener el estado de la presión arterial
signosVitalesSchema.methods.getEstadoPresion = function() {
    if (!this.presionArterial || !this.presionArterial.sistolica || !this.presionArterial.diastolica) return null;
    
    const sistolica = this.presionArterial.sistolica;
    const diastolica = this.presionArterial.diastolica;
    
    // Clasificación según AHA (American Heart Association)
    if (sistolica < 90 && diastolica < 60) return 'hipotension';
    if (sistolica < 120 && diastolica < 80) return 'normal';
    if ((sistolica >= 120 && sistolica <= 129) && diastolica < 80) return 'elevada';
    if ((sistolica >= 130 && sistolica <= 139) || (diastolica >= 80 && diastolica <= 89)) return 'hipertension_estadio1';
    if (sistolica >= 140 || diastolica >= 90) return 'hipertension_estadio2';
    if (sistolica >= 180 || diastolica >= 120) return 'crisis_hipertensiva';
    
    return 'no_clasificado';
};

// Método para obtener el estado de la oxigenación
signosVitalesSchema.methods.getEstadoOxigenacion = function() {
    if (!this.oxigenacion || !this.oxigenacion.valor) return null;
    
    const valor = this.oxigenacion.valor;
    
    if (valor >= 95) return 'normal';
    if (valor >= 90 && valor < 95) return 'leve_hypoxemia';
    if (valor >= 80 && valor < 90) return 'moderada_hypoxemia';
    return 'severa_hypoxemia';
};

// Método para calcular IMC si hay peso y altura del usuario
signosVitalesSchema.methods.calcularIMC = function(alturaUsuario) {
    if (!this.peso || !this.peso.valor || !alturaUsuario) return null;
    
    const alturaMetros = alturaUsuario / 100;
    return (this.peso.valor / (alturaMetros * alturaMetros)).toFixed(1);
};

// Método para obtener clasificación del IMC
signosVitalesSchema.methods.getClasificacionIMC = function(alturaUsuario) {
    const imc = this.calcularIMC(alturaUsuario);
    if (!imc) return null;
    
    const imcNum = parseFloat(imc);
    
    if (imcNum < 18.5) return 'bajo_peso';
    if (imcNum >= 18.5 && imcNum < 25) return 'peso_normal';
    if (imcNum >= 25 && imcNum < 30) return 'sobrepeso';
    if (imcNum >= 30 && imcNum < 35) return 'obesidad_grado1';
    if (imcNum >= 35 && imcNum < 40) return 'obesidad_grado2';
    return 'obesidad_grado3';
};

// Método para obtener resumen de alertas
signosVitalesSchema.methods.getAlertas = function(alturaUsuario) {
    const alertas = [];
    
    // Alertas de glucosa
    const estadoGlucosa = this.getEstadoGlucosa();
    if (estadoGlucosa === 'hipoglucemia') alertas.push('Glucosa baja - Consulte a su médico');
    if (estadoGlucosa === 'diabetes') alertas.push('Glucosa elevada - Consulte a su médico');
    
    // Alertas de presión arterial
    const estadoPresion = this.getEstadoPresion();
    if (estadoPresion === 'hipotension') alertas.push('Presión arterial baja');
    if (estadoPresion === 'hipertension_estadio1' || estadoPresion === 'hipertension_estadio2') {
        alertas.push('Presión arterial elevada - Consulte a su médico');
    }
    if (estadoPresion === 'crisis_hipertensiva') alertas.push('CRISIS HIPERTENSIVA - Busque atención médica inmediata');
    
    // Alertas de oxigenación
    const estadoOxigenacion = this.getEstadoOxigenacion();
    if (estadoOxigenacion === 'moderada_hypoxemia' || estadoOxigenacion === 'severa_hypoxemia') {
        alertas.push('Oxigenación baja - Consulte a su médico');
    }
    
    // Alertas de peso/IMC
    const clasificacionIMC = this.getClasificacionIMC(alturaUsuario);
    if (clasificacionIMC === 'bajo_peso') alertas.push('Peso bajo - Consulte a su médico');
    if (clasificacionIMC === 'sobrepeso' || clasificacionIMC.includes('obesidad')) {
        alertas.push('Peso elevado - Considere consultar a su médico');
    }
    
    return alertas;
};

module.exports = mongoose.model('SignosVitales', signosVitalesSchema); 