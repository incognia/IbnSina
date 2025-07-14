const mongoose = require('mongoose');

const medicamentoSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    nombre: {
        type: String,
        required: [true, 'El nombre del medicamento es requerido'],
        trim: true
    },
    nombreGenerico: {
        type: String,
        trim: true
    },
    laboratorio: {
        type: String,
        trim: true
    },
    // Información de la presentación
    presentacion: {
        forma: {
            type: String,
            enum: ['tableta', 'capsula', 'jarabe', 'inyeccion', 'crema', 'pomada', 'gotas', 'inhalador', 'parche', 'otro'],
            required: true
        },
        concentracion: {
            cantidad: Number,
            unidad: String // mg, ml, mcg, etc.
        },
        cantidadPorUnidad: Number // cuántas tabletas por caja, etc.
    },
    // Información de dosificación
    dosificacion: {
        dosis: {
            cantidad: Number,
            unidad: String
        },
        frecuencia: {
            type: String,
            enum: ['diario', 'cada_12_horas', 'cada_8_horas', 'cada_6_horas', 'cada_4_horas', 'semanal', 'mensual', 'personalizado'],
            required: true
        },
        horarios: [{
            hora: String, // formato "HH:MM"
            dosis: Number
        }],
        instrucciones: String // "Tomar con comida", "Antes del desayuno", etc.
    },
    // Información de la receta
    receta: {
        medico: {
            nombre: String,
            especialidad: String,
            telefono: String
        },
        fechaPrescripcion: Date,
        fechaVencimiento: Date,
        numeroReceta: String
    },
    // Estado del medicamento
    estado: {
        type: String,
        enum: ['activo', 'pausado', 'terminado', 'vencido'],
        default: 'activo'
    },
    // Inventario por cajas
    inventario: {
        cajas: [{
            numeroCaja: {
                type: Number,
                required: true
            },
            cantidadPastillas: {
                type: Number,
                required: true
            },
            pastillasConsumidas: {
                type: Number,
                default: 0
            },
            fechaCompra: {
                type: Date,
                default: Date.now
            },
            fechaVencimiento: {
                type: Date,
                required: true
            },
            lote: String,
            estado: {
                type: String,
                enum: ['activa', 'agotada', 'vencida'],
                default: 'activa'
            },
            notas: String
        }],
        cantidadMinima: {
            type: Number,
            default: 5
        }
    },
    // Control de dosis diarias
    dosisDiarias: {
        total: {
            type: Number,
            required: true,
            default: 1
        },
        horarios: [{
            hora: String, // formato "HH:MM"
            dosis: Number,
            tomada: {
                type: Boolean,
                default: false
            },
            fechaUltimaToma: Date
        }]
    },
    // Efectos secundarios y contraindicaciones
    efectosSecundarios: [String],
    contraindicaciones: [String],
    interacciones: [String],
    // Notas personales
    notas: String,
    // Categorización
    categoria: {
        type: String,
        enum: ['hipertension', 'diabetes', 'dolor', 'vitaminas', 'antibiotico', 'otro'],
        required: true
    },
    // Configuración de recordatorios
    recordatorios: {
        activo: {
            type: Boolean,
            default: true
        },
        notificarAntes: {
            type: Number, // minutos antes
            default: 15
        },
        sonido: {
            type: Boolean,
            default: true
        },
        vibracion: {
            type: Boolean,
            default: true
        }
    },
    // Historial de cambios
    historialCambios: [{
        fecha: {
            type: Date,
            default: Date.now
        },
        tipo: {
            type: String,
            enum: ['creacion', 'modificacion', 'pausa', 'reactivacion', 'terminacion', 'consumo_dosis', 'agregar_caja', 'vencimiento_caja']
        },
        descripcion: String,
        usuario: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Usuario'
        }
    }]
}, {
    timestamps: true
});

// Índices para búsquedas eficientes
medicamentoSchema.index({ usuario: 1, nombre: 1 });
medicamentoSchema.index({ usuario: 1, estado: 1 });
medicamentoSchema.index({ usuario: 1, categoria: 1 });
medicamentoSchema.index({ 'inventario.cajas.fechaVencimiento': 1 });

// Método para calcular total de pastillas disponibles
medicamentoSchema.methods.calcularPastillasDisponibles = function() {
    return this.inventario.cajas
        .filter(caja => caja.estado === 'activa')
        .reduce((total, caja) => total + (caja.cantidadPastillas - caja.pastillasConsumidas), 0);
};

// Método para calcular días restantes de medicamento
medicamentoSchema.methods.calcularDiasRestantes = function() {
    const pastillasDisponibles = this.calcularPastillasDisponibles();
    const dosisDiarias = this.dosisDiarias.total;
    
    if (dosisDiarias <= 0) return 0;
    return Math.floor(pastillasDisponibles / dosisDiarias);
};

// Método para verificar si necesita reabastecimiento
medicamentoSchema.methods.necesitaReabastecimiento = function() {
    const diasRestantes = this.calcularDiasRestantes();
    return diasRestantes <= this.inventario.cantidadMinima;
};

// Método para verificar cajas próximas a vencer
medicamentoSchema.methods.getCajasProximasVencer = function(dias = 30) {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + dias);
    
    return this.inventario.cajas.filter(caja => 
        caja.estado === 'activa' && 
        caja.fechaVencimiento <= fechaLimite &&
        caja.fechaVencimiento > new Date()
    );
};

// Método para verificar cajas vencidas
medicamentoSchema.methods.getCajasVencidas = function() {
    return this.inventario.cajas.filter(caja => 
        caja.fechaVencimiento < new Date()
    );
};

// Método para marcar dosis como tomada
medicamentoSchema.methods.marcarDosisTomada = function(horaIndex) {
    if (horaIndex >= 0 && horaIndex < this.dosisDiarias.horarios.length) {
        this.dosisDiarias.horarios[horaIndex].tomada = true;
        this.dosisDiarias.horarios[horaIndex].fechaUltimaToma = new Date();
        
        // Consumir una pastilla de la caja más antigua disponible
        const cajaActiva = this.inventario.cajas
            .filter(caja => caja.estado === 'activa' && (caja.cantidadPastillas - caja.pastillasConsumidas) > 0)
            .sort((a, b) => a.fechaCompra - b.fechaCompra)[0];
            
        if (cajaActiva) {
            cajaActiva.pastillasConsumidas += 1;
            
            // Si la caja se agotó, marcarla como agotada
            if (cajaActiva.pastillasConsumidas >= cajaActiva.cantidadPastillas) {
                cajaActiva.estado = 'agotada';
            }
        }
        
        return this.save();
    }
    throw new Error('Índice de hora inválido');
};

// Método para resetear dosis diarias
medicamentoSchema.methods.resetearDosisDiarias = function() {
    this.dosisDiarias.horarios.forEach(horario => {
        horario.tomada = false;
        horario.fechaUltimaToma = null;
    });
    return this.save();
};

// Método para agregar nueva caja
medicamentoSchema.methods.agregarCaja = function(datosCaja) {
    const numeroCaja = this.inventario.cajas.length + 1;
    const nuevaCaja = {
        numeroCaja,
        cantidadPastillas: datosCaja.cantidadPastillas,
        fechaCompra: datosCaja.fechaCompra || new Date(),
        fechaVencimiento: datosCaja.fechaVencimiento,
        lote: datosCaja.lote,
        notas: datosCaja.notas
    };
    
    this.inventario.cajas.push(nuevaCaja);
    
    // Agregar entrada al historial
    this.historialCambios.push({
        tipo: 'agregar_caja',
        descripcion: `Caja ${numeroCaja} agregada con ${datosCaja.cantidadPastillas} pastillas`,
        usuario: this.usuario
    });
    
    return this.save();
};

// Método para verificar y actualizar estado de cajas vencidas
medicamentoSchema.methods.verificarCajasVencidas = function() {
    const cajasVencidas = this.getCajasVencidas();
    let cajasActualizadas = 0;
    
    cajasVencidas.forEach(caja => {
        if (caja.estado === 'activa') {
            caja.estado = 'vencida';
            cajasActualizadas++;
            
            // Agregar entrada al historial
            this.historialCambios.push({
                tipo: 'vencimiento_caja',
                descripcion: `Caja ${caja.numeroCaja} marcada como vencida`,
                usuario: this.usuario
            });
        }
    });
    
    if (cajasActualizadas > 0) {
        return this.save();
    }
    return Promise.resolve(this);
};

// Método para obtener información resumida
medicamentoSchema.methods.getResumen = function() {
    return {
        id: this._id,
        nombre: this.nombre,
        categoria: this.categoria,
        estado: this.estado,
        pastillasDisponibles: this.calcularPastillasDisponibles(),
        diasRestantes: this.calcularDiasRestantes(),
        necesitaReabastecimiento: this.necesitaReabastecimiento(),
        cajasProximasVencer: this.getCajasProximasVencer().length,
        cajasVencidas: this.getCajasVencidas().length,
        dosisDiarias: this.dosisDiarias.total,
        proximaDosis: this.dosisDiarias.horarios.find(h => !h.tomada)?.hora || null
    };
};

// Middleware para verificar cajas vencidas antes de guardar
medicamentoSchema.pre('save', function(next) {
    this.verificarCajasVencidas().then(() => next()).catch(next);
});

module.exports = mongoose.model('Medicamento', medicamentoSchema); 