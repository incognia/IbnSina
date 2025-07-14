const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Dosis = require('../models/Dosis');
const Medicamento = require('../models/Medicamento');

const router = express.Router();

// Middleware para validar JWT
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Token no proporcionado' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.usuarioId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido' });
    }
};

// GET /api/dosis/hoy
router.get('/hoy', auth, async (req, res) => {
    try {
        const dosis = await Dosis.getDosisDelDia(req.usuarioId);
        
        // Agrupar por medicamento
        const dosisAgrupadas = dosis.reduce((acc, dosis) => {
            const medicamentoId = dosis.medicamento._id.toString();
            if (!acc[medicamentoId]) {
                acc[medicamentoId] = {
                    medicamento: dosis.medicamento,
                    dosis: []
                };
            }
            acc[medicamentoId].dosis.push(dosis);
            return acc;
        }, {});

        res.json(Object.values(dosisAgrupadas));
    } catch (error) {
        console.error('Error obteniendo dosis del día:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// GET /api/dosis
router.get('/', auth, async (req, res) => {
    try {
        const { fecha, medicamento, estado } = req.query;
        const filtros = { usuario: req.usuarioId };

        if (fecha) {
            const fechaInicio = new Date(fecha);
            fechaInicio.setHours(0, 0, 0, 0);
            const fechaFin = new Date(fecha);
            fechaFin.setHours(23, 59, 59, 999);
            
            filtros.fechaProgramada = {
                $gte: fechaInicio,
                $lte: fechaFin
            };
        }

        if (medicamento) filtros.medicamento = medicamento;
        if (estado) filtros.estado = estado;

        const dosis = await Dosis.find(filtros)
            .populate('medicamento')
            .sort({ fechaProgramada: 1 });

        res.json(dosis);
    } catch (error) {
        console.error('Error obteniendo dosis:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// POST /api/dosis/:id/tomar
router.post('/:id/tomar', auth, [
    body('fechaReal').optional().isISO8601().withMessage('Fecha inválida'),
    body('notas').optional().isString().withMessage('Las notas deben ser texto'),
    body('efectosSecundarios').optional().isArray().withMessage('Efectos secundarios debe ser un array')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const dosis = await Dosis.findOne({
            _id: req.params.id,
            usuario: req.usuarioId
        });

        if (!dosis) {
            return res.status(404).json({ message: 'Dosis no encontrada' });
        }

        if (dosis.estado === 'tomada') {
            return res.status(400).json({ message: 'Esta dosis ya fue tomada' });
        }

        const fechaReal = req.body.fechaReal ? new Date(req.body.fechaReal) : new Date();
        
        // Marcar como tomada
        await dosis.marcarComoTomada(fechaReal);

        // Actualizar inventario del medicamento
        const medicamento = await Medicamento.findById(dosis.medicamento);
        if (medicamento && medicamento.inventario.cantidadDisponible > 0) {
            medicamento.inventario.cantidadDisponible -= 1;
            await medicamento.save();
        }

        // Agregar efectos secundarios si se proporcionan
        if (req.body.efectosSecundarios) {
            dosis.efectosSecundarios.push(...req.body.efectosSecundarios);
        }

        if (req.body.notas) {
            dosis.notas = req.body.notas;
        }

        await dosis.save();

        res.json({
            message: 'Dosis marcada como tomada exitosamente',
            dosis: dosis.getResumen()
        });
    } catch (error) {
        console.error('Error marcando dosis como tomada:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// POST /api/dosis/:id/omitir
router.post('/:id/omitir', auth, [
    body('razon').optional().isString().withMessage('La razón debe ser texto')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const dosis = await Dosis.findOne({
            _id: req.params.id,
            usuario: req.usuarioId
        });

        if (!dosis) {
            return res.status(404).json({ message: 'Dosis no encontrada' });
        }

        if (dosis.estado === 'tomada') {
            return res.status(400).json({ message: 'Esta dosis ya fue tomada' });
        }

        await dosis.marcarComoOmitida(req.body.razon || '');

        res.json({
            message: 'Dosis marcada como omitida exitosamente',
            dosis: dosis.getResumen()
        });
    } catch (error) {
        console.error('Error marcando dosis como omitida:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// GET /api/dosis/estadisticas
router.get('/estadisticas', auth, async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query;
        
        let fechaInicioObj, fechaFinObj;
        
        if (fechaInicio && fechaFin) {
            fechaInicioObj = new Date(fechaInicio);
            fechaFinObj = new Date(fechaFin);
        } else {
            // Por defecto, último mes
            fechaFinObj = new Date();
            fechaInicioObj = new Date();
            fechaInicioObj.setMonth(fechaInicioObj.getMonth() - 1);
        }

        const estadisticas = await Dosis.getEstadisticasAdherencia(
            req.usuarioId,
            fechaInicioObj,
            fechaFinObj
        );

        // Obtener estadísticas por medicamento
        const dosis = await Dosis.find({
            usuario: req.usuarioId,
            fechaProgramada: {
                $gte: fechaInicioObj,
                $lte: fechaFinObj
            }
        }).populate('medicamento');

        const porMedicamento = dosis.reduce((acc, dosis) => {
            const medicamentoId = dosis.medicamento._id.toString();
            if (!acc[medicamentoId]) {
                acc[medicamentoId] = {
                    medicamento: dosis.medicamento.nombre,
                    total: 0,
                    tomadas: 0,
                    omitidas: 0,
                    aTiempo: 0
                };
            }
            
            acc[medicamentoId].total += 1;
            if (dosis.estado === 'tomada') acc[medicamentoId].tomadas += 1;
            if (dosis.estado === 'omitida') acc[medicamentoId].omitidas += 1;
            if (dosis.adherencia.tomadaATiempo) acc[medicamentoId].aTiempo += 1;
            
            return acc;
        }, {});

        // Calcular porcentajes
        Object.values(porMedicamento).forEach(med => {
            med.porcentajeAdherencia = med.total > 0 ? (med.tomadas / med.total) * 100 : 0;
            med.porcentajeATiempo = med.total > 0 ? (med.aTiempo / med.total) * 100 : 0;
        });

        res.json({
            general: estadisticas,
            porMedicamento: Object.values(porMedicamento)
        });
    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// GET /api/dosis/proximas
router.get('/proximas', auth, async (req, res) => {
    try {
        const { horas = 24 } = req.query;
        const fechaLimite = new Date();
        fechaLimite.setHours(fechaLimite.getHours() + parseInt(horas));

        const dosis = await Dosis.find({
            usuario: req.usuarioId,
            estado: 'programada',
            fechaProgramada: {
                $gte: new Date(),
                $lte: fechaLimite
            }
        }).populate('medicamento').sort({ fechaProgramada: 1 });

        res.json(dosis);
    } catch (error) {
        console.error('Error obteniendo próximas dosis:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// GET /api/dosis/retrasadas
router.get('/retrasadas', auth, async (req, res) => {
    try {
        const dosis = await Dosis.find({
            usuario: req.usuarioId,
            estado: 'programada',
            fechaProgramada: { $lt: new Date() }
        }).populate('medicamento').sort({ fechaProgramada: 1 });

        const dosisConRetraso = dosis.map(dosis => ({
            ...dosis.toObject(),
            minutosRetraso: dosis.calcularMinutosRetraso()
        }));

        res.json(dosisConRetraso);
    } catch (error) {
        console.error('Error obteniendo dosis retrasadas:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// POST /api/dosis/generar-programacion
router.post('/generar-programacion', auth, [
    body('medicamentoId').notEmpty().withMessage('ID del medicamento es requerido'),
    body('fechaInicio').isISO8601().withMessage('Fecha de inicio inválida'),
    body('fechaFin').optional().isISO8601().withMessage('Fecha de fin inválida')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { medicamentoId, fechaInicio, fechaFin } = req.body;

        // Verificar que el medicamento existe y pertenece al usuario
        const medicamento = await Medicamento.findOne({
            _id: medicamentoId,
            usuario: req.usuarioId
        });

        if (!medicamento) {
            return res.status(404).json({ message: 'Medicamento no encontrado' });
        }

        const fechaInicioObj = new Date(fechaInicio);
        const fechaFinObj = fechaFin ? new Date(fechaFin) : new Date();
        fechaFinObj.setMonth(fechaFinObj.getMonth() + 1); // Por defecto, un mes

        const dosisGeneradas = [];

        // Generar dosis para cada horario del medicamento
        for (let fecha = new Date(fechaInicioObj); fecha <= fechaFinObj; fecha.setDate(fecha.getDate() + 1)) {
            for (const horario of medicamento.dosificacion.horarios) {
                const [hora, minuto] = horario.hora.split(':');
                const fechaProgramada = new Date(fecha);
                fechaProgramada.setHours(parseInt(hora), parseInt(minuto), 0, 0);

                const dosis = new Dosis({
                    usuario: req.usuarioId,
                    medicamento: medicamentoId,
                    dosis: {
                        cantidad: horario.dosis,
                        unidad: medicamento.presentacion.concentracion.unidad
                    },
                    fechaProgramada,
                    estado: 'programada'
                });

                dosisGeneradas.push(dosis);
            }
        }

        await Dosis.insertMany(dosisGeneradas);

        res.json({
            message: 'Programación de dosis generada exitosamente',
            dosisGeneradas: dosisGeneradas.length
        });
    } catch (error) {
        console.error('Error generando programación:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router; 