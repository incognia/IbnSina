const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true
    },
    apellidos: {
        type: String,
        required: [true, 'Los apellidos son requeridos'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
    },
    // Información personal
    edad: {
        type: Number,
        required: [true, 'La edad es requerida']
    },
    altura: {
        type: Number, // en centímetros
        required: [true, 'La altura es requerida']
    },
    peso: {
        type: Number, // en kilogramos
        required: [true, 'El peso es requerido']
    },
    // Condiciones médicas
    condiciones: [{
        nombre: {
            type: String,
            required: true
        },
        fechaDiagnostico: {
            type: Date,
            default: Date.now
        },
        activa: {
            type: Boolean,
            default: true
        }
    }],
    // Información de contacto de emergencia
    contactoEmergencia: {
        nombre: String,
        telefono: String,
        relacion: String
    },
    // Configuración de notificaciones
    notificaciones: {
        email: {
            type: Boolean,
            default: true
        },
        push: {
            type: Boolean,
            default: true
        },
        recordatorios: {
            type: Boolean,
            default: true
        }
    },
    // Configuración de privacidad
    configuracionPrivacidad: {
        compartirDatos: {
            type: Boolean,
            default: false
        },
        mostrarHistorial: {
            type: Boolean,
            default: true
        }
    }
}, {
    timestamps: true
});

// Método para encriptar contraseña antes de guardar
usuarioSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Método para comparar contraseñas
usuarioSchema.methods.compararPassword = async function(passwordCandidata) {
    return await bcrypt.compare(passwordCandidata, this.password);
};

// Método para obtener información pública del usuario
usuarioSchema.methods.toPublicJSON = function() {
    const usuario = this.toObject();
    delete usuario.password;
    return usuario;
};

// Método para calcular IMC
usuarioSchema.methods.calcularIMC = function() {
    const alturaMetros = this.altura / 100;
    return (this.peso / (alturaMetros * alturaMetros)).toFixed(1);
};

// Método para obtener condiciones activas
usuarioSchema.methods.getCondicionesActivas = function() {
    return this.condiciones.filter(condicion => condicion.activa);
};

module.exports = mongoose.model('Usuario', usuarioSchema); 