const mongoose = require('mongoose');

const dosisSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    medicamento: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medicamento',
        required: true
    },
    // Información de la dosis
    dosis: {
        cantidad: {
            type: Number,
            required: true
        },
        unidad: {
            type: String,
            required: true
        }
    },
    // Fecha y hora programada
    fechaProgramada: {
        type: Date,
        required: true
    },
    // Fecha y hora real de la toma
    fechaReal: {
        type: Date
    },
    // Estado de la dosis
    estado: {
        type: String,
        enum: ['programada', 'tomada', 'omitida', 'retrasada'],
        default: 'programada'
    },
    // Información adicional
    notas: String,
    // Efectos secundarios reportados
    efectosSecundarios: [{
        sintoma: String,
        intensidad: {
            type: String,
            enum: ['leve', 'moderado', 'severo']
        },
        fechaReporte: {
            type: Date,
            default: Date.now
        }
    }],
    // Recordatorio
    recordatorio: {
        enviado: {
            type: Boolean,
            default: false
        },
        fechaEnvio: Date,
        tipo: {
            type: String,
            enum: ['push', 'email', 'sms']
        }
    },
    // Contexto de la toma
    contexto: {
        conComida: {
            type: Boolean,
            default: false
        },
        antesComida: {
            type: Boolean,
            default: false
        },
        despuesComida: {
            type: Boolean,
            default: false
        },
        conAgua: {
            type: Boolean,
            default: true
        },
        otrasInstrucciones: String
    },
    // Métricas de adherencia
    adherencia: {
        tomadaATiempo: {
            type: Boolean,
            default: false
        },
        minutosRetraso: Number,
        razonOmitida: String
    }
}, {
    timestamps: true
});

// Índices para consultas eficientes
dosisSchema.index({ usuario: 1, fechaProgramada: 1 });
dosisSchema.index({ medicamento: 1, fechaProgramada: 1 });
dosisSchema.index({ usuario: 1, estado: 1 });
dosisSchema.index({ fechaProgramada: 1, estado: 'programada' });

// Método para marcar como tomada
dosisSchema.methods.marcarComoTomada = function(fechaReal = new Date()) {
    this.estado = 'tomada';
    this.fechaReal = fechaReal;
    
    // Calcular si fue tomada a tiempo
    const tiempoProgramado = new Date(this.fechaProgramada);
    const tiempoReal = new Date(fechaReal);
    const diferenciaMinutos = Math.abs(tiempoReal - tiempoProgramado) / (1000 * 60);
    
    this.adherencia.tomadaATiempo = diferenciaMinutos <= 30; // 30 minutos de tolerancia
    this.adherencia.minutosRetraso = diferenciaMinutos > 30 ? diferenciaMinutos : 0;
    
    return this.save();
};

// Método para marcar como omitida
dosisSchema.methods.marcarComoOmitida = function(razon = '') {
    this.estado = 'omitida';
    this.adherencia.razonOmitida = razon;
    return this.save();
};

// Método para verificar si está retrasada
dosisSchema.methods.estaRetrasada = function() {
    if (this.estado !== 'programada') return false;
    const ahora = new Date();
    const programada = new Date(this.fechaProgramada);
    return ahora > programada;
};

// Método para calcular minutos de retraso
dosisSchema.methods.calcularMinutosRetraso = function() {
    if (this.estado !== 'programada') return 0;
    const ahora = new Date();
    const programada = new Date(this.fechaProgramada);
    const diferencia = ahora - programada;
    return Math.max(0, Math.floor(diferencia / (1000 * 60)));
};

// Método para obtener información resumida
dosisSchema.methods.getResumen = function() {
    return {
        id: this._id,
        medicamento: this.medicamento,
        fechaProgramada: this.fechaProgramada,
        estado: this.estado,
        tomadaATiempo: this.adherencia.tomadaATiempo,
        estaRetrasada: this.estaRetrasada(),
        minutosRetraso: this.calcularMinutosRetraso()
    };
};

// Método estático para obtener dosis del día
dosisSchema.statics.getDosisDelDia = function(usuarioId, fecha = new Date()) {
    const inicioDia = new Date(fecha);
    inicioDia.setHours(0, 0, 0, 0);
    
    const finDia = new Date(fecha);
    finDia.setHours(23, 59, 59, 999);
    
    return this.find({
        usuario: usuarioId,
        fechaProgramada: {
            $gte: inicioDia,
            $lte: finDia
        }
    }).populate('medicamento');
};

// Método estático para obtener estadísticas de adherencia
dosisSchema.statics.getEstadisticasAdherencia = async function(usuarioId, fechaInicio, fechaFin) {
    const dosis = await this.find({
        usuario: usuarioId,
        fechaProgramada: {
            $gte: fechaInicio,
            $lte: fechaFin
        }
    });
    
    const total = dosis.length;
    const tomadas = dosis.filter(d => d.estado === 'tomada').length;
    const omitidas = dosis.filter(d => d.estado === 'omitida').length;
    const aTiempo = dosis.filter(d => d.adherencia.tomadaATiempo).length;
    
    return {
        total,
        tomadas,
        omitidas,
        aTiempo,
        porcentajeAdherencia: total > 0 ? (tomadas / total) * 100 : 0,
        porcentajeATiempo: total > 0 ? (aTiempo / total) * 100 : 0
    };
};

module.exports = mongoose.model('Dosis', dosisSchema); 