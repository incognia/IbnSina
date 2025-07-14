const express = require('express');
const router = express.Router();
const SignosVitales = require('../models/SignosVitales');
const Usuario = require('../models/Usuario');
const { body, validationResult } = require('express-validator');

// Middleware para verificar autenticación (simulado)
const authMiddleware = (req, res, next) => {
    // TODO: Implementar verificación real de JWT
    req.usuarioId = req.headers['user-id'] || '507f1f77bcf86cd799439011';
    next();
};

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// GET /api/signos-vitales - Obtener historial de signos vitales
router.get('/', async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 20, 
            tipo = null, 
            fechaInicio = null, 
            fechaFin = null,
            orden = 'desc'
        } = req.query;

        const filtro = { usuario: req.usuarioId };
        
        // Filtro por tipo de medición
        if (tipo) {
            if (tipo === 'glucosa') filtro['glucosa.valor'] = { $exists: true };
            else if (tipo === 'presion') filtro['presionArterial.sistolica'] = { $exists: true };
            else if (tipo === 'oxigenacion') filtro['oxigenacion.valor'] = { $exists: true };
            else if (tipo === 'peso') filtro['peso.valor'] = { $exists: true };
            else if (tipo === 'temperatura') filtro['temperatura.valor'] = { $exists: true };
        }

        // Filtro por rango de fechas
        if (fechaInicio || fechaFin) {
            filtro.fecha = {};
            if (fechaInicio) filtro.fecha.$gte = new Date(fechaInicio);
            if (fechaFin) filtro.fecha.$lte = new Date(fechaFin);
        }

        const skip = (page - 1) * limit;
        
        const signosVitales = await SignosVitales.find(filtro)
            .sort({ fecha: orden === 'desc' ? -1 : 1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('usuario', 'nombre apellidos');

        const total = await SignosVitales.countDocuments(filtro);

        res.json({
            success: true,
            data: signosVitales,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error obteniendo signos vitales:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// GET /api/signos-vitales/:id - Obtener un registro específico
router.get('/:id', async (req, res) => {
    try {
        const signosVitales = await SignosVitales.findOne({
            _id: req.params.id,
            usuario: req.usuarioId
        }).populate('usuario', 'nombre apellidos altura');

        if (!signosVitales) {
            return res.status(404).json({
                success: false,
                error: 'Registro no encontrado'
            });
        }

        // Agregar información calculada
        const usuario = await Usuario.findById(req.usuarioId);
        const signosConCalculos = signosVitales.toObject();
        
        if (usuario) {
            signosConCalculos.estadoGlucosa = signosVitales.getEstadoGlucosa();
            signosConCalculos.estadoPresion = signosVitales.getEstadoPresion();
            signosConCalculos.estadoOxigenacion = signosVitales.getEstadoOxigenacion();
            signosConCalculos.imc = signosVitales.calcularIMC(usuario.altura);
            signosConCalculos.clasificacionIMC = signosVitales.getClasificacionIMC(usuario.altura);
            signosConCalculos.alertas = signosVitales.getAlertas(usuario.altura);
        }

        res.json({
            success: true,
            data: signosConCalculos
        });
    } catch (error) {
        console.error('Error obteniendo signos vitales:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// POST /api/signos-vitales - Registrar nuevos signos vitales
router.post('/', [
    body('fecha').optional().isISO8601().withMessage('Fecha inválida'),
    body('glucosa.valor').optional().isFloat({ min: 0, max: 1000 }).withMessage('Valor de glucosa inválido'),
    body('glucosa.tipo').optional().isIn(['ayunas', 'postprandial', 'aleatoria', 'antes_comida', 'despues_comida']).withMessage('Tipo de glucosa inválido'),
    body('glucosa.dispositivo.tipo').optional().isIn(['glucometro', 'smartwatch', 'otro']).withMessage('Tipo de dispositivo de glucosa inválido'),
    body('presionArterial.sistolica').optional().isFloat({ min: 50, max: 300 }).withMessage('Presión sistólica inválida'),
    body('presionArterial.diastolica').optional().isFloat({ min: 30, max: 200 }).withMessage('Presión diastólica inválida'),
    body('presionArterial.pulso').optional().isFloat({ min: 30, max: 200 }).withMessage('Pulso inválido'),
    body('presionArterial.dispositivo.tipo').optional().isIn(['tensiometro', 'smartwatch', 'otro']).withMessage('Tipo de dispositivo de presión inválido'),
    body('oxigenacion.valor').optional().isFloat({ min: 70, max: 100 }).withMessage('Oxigenación inválida'),
    body('oxigenacion.dispositivo.tipo').optional().isIn(['oximetro', 'smartwatch', 'otro']).withMessage('Tipo de dispositivo de oxigenación inválido'),
    body('temperatura.valor').optional().isFloat({ min: 30, max: 45 }).withMessage('Temperatura inválida'),
    body('temperatura.dispositivo.tipo').optional().isIn(['termometro', 'otro']).withMessage('Tipo de dispositivo de temperatura inválido'),
    body('peso.valor').optional().isFloat({ min: 20, max: 500 }).withMessage('Peso inválido'),
    body('peso.dispositivo.tipo').optional().isIn(['bascula', 'otro']).withMessage('Tipo de dispositivo de peso inválido'),
    body('circunferenciaCintura.valor').optional().isFloat({ min: 50, max: 200 }).withMessage('Circunferencia inválida'),
    body('circunferenciaCintura.dispositivo.tipo').optional().isIn(['cinta_metrica']).withMessage('Tipo de dispositivo de cintura inválido'),
    body('pulso.valor').optional().isFloat({ min: 30, max: 200 }).withMessage('Pulso inválido'),
    body('pulso.dispositivo.tipo').optional().isIn(['smartwatch', 'oximetro', 'tensiometro', 'otro']).withMessage('Tipo de dispositivo de pulso inválido')
], async (req, res) => {
    try {
        // Verificar errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Datos inválidos',
                details: errors.array()
            });
        }

        // Verificar que al menos un signo vital esté presente
        const { glucosa, presionArterial, oxigenacion, temperatura, peso, circunferenciaCintura, pulso } = req.body;
        if (!glucosa && !presionArterial && !oxigenacion && !temperatura && !peso && !circunferenciaCintura && !pulso) {
            return res.status(400).json({
                success: false,
                error: 'Debe registrar al menos un signo vital'
            });
        }

        // Crear el registro
        const signosVitales = new SignosVitales({
            usuario: req.usuarioId,
            ...req.body
        });

        await signosVitales.save();

        // Obtener información calculada
        const usuario = await Usuario.findById(req.usuarioId);
        const signosConCalculos = signosVitales.toObject();
        
        if (usuario) {
            signosConCalculos.estadoGlucosa = signosVitales.getEstadoGlucosa();
            signosConCalculos.estadoPresion = signosVitales.getEstadoPresion();
            signosConCalculos.estadoOxigenacion = signosVitales.getEstadoOxigenacion();
            signosConCalculos.imc = signosVitales.calcularIMC(usuario.altura);
            signosConCalculos.clasificacionIMC = signosVitales.getClasificacionIMC(usuario.altura);
            signosConCalculos.alertas = signosVitales.getAlertas(usuario.altura);
        }

        res.status(201).json({
            success: true,
            data: signosConCalculos,
            message: 'Signos vitales registrados exitosamente'
        });
    } catch (error) {
        console.error('Error registrando signos vitales:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// PUT /api/signos-vitales/:id - Actualizar registro
router.put('/:id', [
    body('fecha').optional().isISO8601().withMessage('Fecha inválida'),
    body('glucosa.valor').optional().isFloat({ min: 0, max: 1000 }).withMessage('Valor de glucosa inválido'),
    body('presionArterial.sistolica').optional().isFloat({ min: 50, max: 300 }).withMessage('Presión sistólica inválida'),
    body('presionArterial.diastolica').optional().isFloat({ min: 30, max: 200 }).withMessage('Presión diastólica inválida')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Datos inválidos',
                details: errors.array()
            });
        }

        const signosVitales = await SignosVitales.findOneAndUpdate(
            { _id: req.params.id, usuario: req.usuarioId },
            req.body,
            { new: true, runValidators: true }
        );

        if (!signosVitales) {
            return res.status(404).json({
                success: false,
                error: 'Registro no encontrado'
            });
        }

        res.json({
            success: true,
            data: signosVitales,
            message: 'Registro actualizado exitosamente'
        });
    } catch (error) {
        console.error('Error actualizando signos vitales:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// DELETE /api/signos-vitales/:id - Eliminar registro
router.delete('/:id', async (req, res) => {
    try {
        const signosVitales = await SignosVitales.findOneAndDelete({
            _id: req.params.id,
            usuario: req.usuarioId
        });

        if (!signosVitales) {
            return res.status(404).json({
                success: false,
                error: 'Registro no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Registro eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error eliminando signos vitales:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// GET /api/signos-vitales/estadisticas - Obtener estadísticas
router.get('/estadisticas/estadisticas', async (req, res) => {
    try {
        const { fechaInicio, fechaFin, tipo } = req.query;
        
        const filtro = { usuario: req.usuarioId };
        if (fechaInicio || fechaFin) {
            filtro.fecha = {};
            if (fechaInicio) filtro.fecha.$gte = new Date(fechaInicio);
            if (fechaFin) filtro.fecha.$lte = new Date(fechaFin);
        }

        const signosVitales = await SignosVitales.find(filtro).sort({ fecha: -1 });
        const usuario = await Usuario.findById(req.usuarioId);

        const estadisticas = {
            totalRegistros: signosVitales.length,
            ultimaMedicion: signosVitales[0] || null,
            promedios: {},
            rangos: {},
            alertas: []
        };

        // Calcular promedios y rangos
        if (signosVitales.length > 0) {
            // Glucosa
            const glucosas = signosVitales.filter(s => s.glucosa && s.glucosa.valor).map(s => s.glucosa.valor);
            if (glucosas.length > 0) {
                estadisticas.promedios.glucosa = (glucosas.reduce((a, b) => a + b, 0) / glucosas.length).toFixed(1);
                estadisticas.rangos.glucosa = {
                    min: Math.min(...glucosas),
                    max: Math.max(...glucosas)
                };
            }

            // Presión arterial
            const presiones = signosVitales.filter(s => s.presionArterial && s.presionArterial.sistolica);
            if (presiones.length > 0) {
                const sistolicas = presiones.map(s => s.presionArterial.sistolica);
                const diastolicas = presiones.map(s => s.presionArterial.diastolica);
                
                estadisticas.promedios.presionArterial = {
                    sistolica: (sistolicas.reduce((a, b) => a + b, 0) / sistolicas.length).toFixed(0),
                    diastolica: (diastolicas.reduce((a, b) => a + b, 0) / diastolicas.length).toFixed(0)
                };
                estadisticas.rangos.presionArterial = {
                    sistolica: { min: Math.min(...sistolicas), max: Math.max(...sistolicas) },
                    diastolica: { min: Math.min(...diastolicas), max: Math.max(...diastolicas) }
                };
            }

            // Peso
            const pesos = signosVitales.filter(s => s.peso && s.peso.valor).map(s => s.peso.valor);
            if (pesos.length > 0) {
                estadisticas.promedios.peso = (pesos.reduce((a, b) => a + b, 0) / pesos.length).toFixed(1);
                estadisticas.rangos.peso = {
                    min: Math.min(...pesos),
                    max: Math.max(...pesos)
                };
                
                if (usuario) {
                    const imcActual = (pesos[0] / Math.pow(usuario.altura / 100, 2)).toFixed(1);
                    estadisticas.imcActual = imcActual;
                }
            }

            // Oxigenación
            const oxigenaciones = signosVitales.filter(s => s.oxigenacion && s.oxigenacion.valor).map(s => s.oxigenacion.valor);
            if (oxigenaciones.length > 0) {
                estadisticas.promedios.oxigenacion = (oxigenaciones.reduce((a, b) => a + b, 0) / oxigenaciones.length).toFixed(1);
                estadisticas.rangos.oxigenacion = {
                    min: Math.min(...oxigenaciones),
                    max: Math.max(...oxigenaciones)
                };
            }
        }

        // Obtener alertas del último registro
        if (estadisticas.ultimaMedicion && usuario) {
            estadisticas.alertas = estadisticas.ultimaMedicion.getAlertas(usuario.altura);
        }

        res.json({
            success: true,
            data: estadisticas
        });
    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// GET /api/signos-vitales/alertas - Obtener alertas recientes
router.get('/alertas/alertas', async (req, res) => {
    try {
        const { dias = 7 } = req.query;
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() - parseInt(dias));

        const signosVitales = await SignosVitales.find({
            usuario: req.usuarioId,
            fecha: { $gte: fechaLimite }
        }).sort({ fecha: -1 });

        const usuario = await Usuario.findById(req.usuarioId);
        const alertas = [];

        signosVitales.forEach(signo => {
            if (usuario) {
                const alertasSigno = signo.getAlertas(usuario.altura);
                if (alertasSigno.length > 0) {
                    alertas.push({
                        fecha: signo.fecha,
                        tipo: 'signos_vitales',
                        alertas: alertasSigno,
                        datos: {
                            glucosa: signo.glucosa,
                            presionArterial: signo.presionArterial,
                            oxigenacion: signo.oxigenacion,
                            peso: signo.peso
                        }
                    });
                }
            }
        });

        res.json({
            success: true,
            data: alertas
        });
    } catch (error) {
        console.error('Error obteniendo alertas:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

module.exports = router; 