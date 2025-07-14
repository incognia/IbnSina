const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Medicamento = require('../models/Medicamento');
const Dosis = require('../models/Dosis');

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

// GET /api/medicamentos
router.get('/', auth, async (req, res) => {
    try {
        const { estado, categoria, search } = req.query;
        const filtros = { usuario: req.usuarioId };

        if (estado) filtros.estado = estado;
        if (categoria) filtros.categoria = categoria;
        if (search) {
            filtros.$or = [
                { nombre: { $regex: search, $options: 'i' } },
                { nombreGenerico: { $regex: search, $options: 'i' } },
                { laboratorio: { $regex: search, $options: 'i' } }
            ];
        }

        const medicamentos = await Medicamento.find(filtros).sort({ createdAt: -1 });
        
        // Agregar información adicional a cada medicamento
        const medicamentosConInfo = medicamentos.map(med => ({
            ...med.toObject(),
            pastillasDisponibles: med.calcularPastillasDisponibles(),
            diasRestantes: med.calcularDiasRestantes(),
            necesitaReabastecimiento: med.necesitaReabastecimiento(),
            cajasProximasVencer: med.getCajasProximasVencer().length,
            cajasVencidas: med.getCajasVencidas().length
        }));

        res.json(medicamentosConInfo);
    } catch (error) {
        console.error('Error obteniendo medicamentos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// GET /api/medicamentos/:id
router.get('/:id', auth, async (req, res) => {
    try {
        const medicamento = await Medicamento.findOne({
            _id: req.params.id,
            usuario: req.usuarioId
        });

        if (!medicamento) {
            return res.status(404).json({ message: 'Medicamento no encontrado' });
        }

        const medicamentoConInfo = {
            ...medicamento.toObject(),
            pastillasDisponibles: medicamento.calcularPastillasDisponibles(),
            diasRestantes: medicamento.calcularDiasRestantes(),
            necesitaReabastecimiento: medicamento.necesitaReabastecimiento(),
            cajasProximasVencer: medicamento.getCajasProximasVencer(),
            cajasVencidas: medicamento.getCajasVencidas()
        };

        res.json(medicamentoConInfo);
    } catch (error) {
        console.error('Error obteniendo medicamento:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// POST /api/medicamentos
router.post('/', auth, [
    body('nombre').notEmpty().withMessage('El nombre del medicamento es requerido'),
    body('presentacion.forma').notEmpty().withMessage('La forma de presentación es requerida'),
    body('dosificacion.frecuencia').notEmpty().withMessage('La frecuencia es requerida'),
    body('categoria').notEmpty().withMessage('La categoría es requerida'),
    body('dosificacion.horarios').isArray({ min: 1 }).withMessage('Debe especificar al menos un horario'),
    body('dosisDiarias.total').isInt({ min: 1 }).withMessage('El total de dosis diarias debe ser al menos 1'),
    body('dosisDiarias.horarios').isArray({ min: 1 }).withMessage('Debe especificar al menos un horario diario')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const medicamentoData = {
            ...req.body,
            usuario: req.usuarioId
        };

        const medicamento = new Medicamento(medicamentoData);
        await medicamento.save();

        // Agregar entrada al historial
        medicamento.historialCambios.push({
            tipo: 'creacion',
            descripcion: 'Medicamento creado',
            usuario: req.usuarioId
        });
        await medicamento.save();

        res.status(201).json({
            message: 'Medicamento creado exitosamente',
            medicamento: medicamento.getResumen()
        });
    } catch (error) {
        console.error('Error creando medicamento:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// PUT /api/medicamentos/:id
router.put('/:id', auth, async (req, res) => {
    try {
        const medicamento = await Medicamento.findOne({
            _id: req.params.id,
            usuario: req.usuarioId
        });

        if (!medicamento) {
            return res.status(404).json({ message: 'Medicamento no encontrado' });
        }

        // Actualizar campos permitidos
        const camposPermitidos = [
            'nombre', 'nombreGenerico', 'laboratorio', 'presentacion', 'dosificacion',
            'receta', 'estado', 'efectosSecundarios', 'contraindicaciones',
            'interacciones', 'notas', 'categoria', 'recordatorios', 'dosisDiarias'
        ];

        camposPermitidos.forEach(campo => {
            if (req.body[campo] !== undefined) {
                medicamento[campo] = req.body[campo];
            }
        });

        // Agregar entrada al historial
        medicamento.historialCambios.push({
            tipo: 'modificacion',
            descripcion: 'Medicamento modificado',
            usuario: req.usuarioId
        });

        await medicamento.save();

        res.json({
            message: 'Medicamento actualizado exitosamente',
            medicamento: medicamento.getResumen()
        });
    } catch (error) {
        console.error('Error actualizando medicamento:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// DELETE /api/medicamentos/:id
router.delete('/:id', auth, async (req, res) => {
    try {
        const medicamento = await Medicamento.findOne({
            _id: req.params.id,
            usuario: req.usuarioId
        });

        if (!medicamento) {
            return res.status(404).json({ message: 'Medicamento no encontrado' });
        }

        await Medicamento.findByIdAndDelete(req.params.id);

        res.json({ message: 'Medicamento eliminado exitosamente' });
    } catch (error) {
        console.error('Error eliminando medicamento:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// PUT /api/medicamentos/:id/estado
router.put('/:id/estado', auth, [
    body('estado').isIn(['activo', 'pausado', 'terminado', 'vencido']).withMessage('Estado inválido')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const medicamento = await Medicamento.findOne({
            _id: req.params.id,
            usuario: req.usuarioId
        });

        if (!medicamento) {
            return res.status(404).json({ message: 'Medicamento no encontrado' });
        }

        const estadoAnterior = medicamento.estado;
        medicamento.estado = req.body.estado;

        // Agregar entrada al historial
        medicamento.historialCambios.push({
            tipo: req.body.estado === 'activo' ? 'reactivacion' : 'pausa',
            descripcion: `Estado cambiado de ${estadoAnterior} a ${req.body.estado}`,
            usuario: req.usuarioId
        });

        await medicamento.save();

        res.json({
            message: 'Estado del medicamento actualizado exitosamente',
            medicamento: medicamento.getResumen()
        });
    } catch (error) {
        console.error('Error actualizando estado:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// POST /api/medicamentos/:id/cajas
router.post('/:id/cajas', auth, [
    body('cantidadPastillas').isInt({ min: 1 }).withMessage('La cantidad de pastillas debe ser al menos 1'),
    body('fechaVencimiento').isISO8601().withMessage('Fecha de vencimiento inválida'),
    body('fechaCompra').optional().isISO8601().withMessage('Fecha de compra inválida'),
    body('lote').optional().isString().withMessage('El lote debe ser texto'),
    body('notas').optional().isString().withMessage('Las notas deben ser texto')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const medicamento = await Medicamento.findOne({
            _id: req.params.id,
            usuario: req.usuarioId
        });

        if (!medicamento) {
            return res.status(404).json({ message: 'Medicamento no encontrado' });
        }

        const datosCaja = {
            cantidadPastillas: req.body.cantidadPastillas,
            fechaVencimiento: new Date(req.body.fechaVencimiento),
            fechaCompra: req.body.fechaCompra ? new Date(req.body.fechaCompra) : new Date(),
            lote: req.body.lote,
            notas: req.body.notas
        };

        await medicamento.agregarCaja(datosCaja);

        res.json({
            message: 'Caja agregada exitosamente',
            medicamento: medicamento.getResumen()
        });
    } catch (error) {
        console.error('Error agregando caja:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// POST /api/medicamentos/:id/dosis/:horaIndex/tomar
router.post('/:id/dosis/:horaIndex/tomar', auth, [
    body('horaIndex').isInt({ min: 0 }).withMessage('Índice de hora inválido')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const medicamento = await Medicamento.findOne({
            _id: req.params.id,
            usuario: req.usuarioId
        });

        if (!medicamento) {
            return res.status(404).json({ message: 'Medicamento no encontrado' });
        }

        const horaIndex = parseInt(req.params.horaIndex);
        
        if (horaIndex >= medicamento.dosisDiarias.horarios.length) {
            return res.status(400).json({ message: 'Índice de hora inválido' });
        }

        await medicamento.marcarDosisTomada(horaIndex);

        // Agregar entrada al historial
        medicamento.historialCambios.push({
            tipo: 'consumo_dosis',
            descripcion: `Dosis tomada a las ${medicamento.dosisDiarias.horarios[horaIndex].hora}`,
            usuario: req.usuarioId
        });
        await medicamento.save();

        res.json({
            message: 'Dosis marcada como tomada exitosamente',
            medicamento: medicamento.getResumen()
        });
    } catch (error) {
        console.error('Error marcando dosis como tomada:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// POST /api/medicamentos/:id/dosis/resetear
router.post('/:id/dosis/resetear', auth, async (req, res) => {
    try {
        const medicamento = await Medicamento.findOne({
            _id: req.params.id,
            usuario: req.usuarioId
        });

        if (!medicamento) {
            return res.status(404).json({ message: 'Medicamento no encontrado' });
        }

        await medicamento.resetearDosisDiarias();

        res.json({
            message: 'Dosis diarias reseteadas exitosamente',
            medicamento: medicamento.getResumen()
        });
    } catch (error) {
        console.error('Error reseteando dosis:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// GET /api/medicamentos/dashboard/estadisticas
router.get('/dashboard/estadisticas', auth, async (req, res) => {
    try {
        const totalMedicamentos = await Medicamento.countDocuments({ usuario: req.usuarioId });
        const medicamentosActivos = await Medicamento.countDocuments({ 
            usuario: req.usuarioId, 
            estado: 'activo' 
        });
        
        const medicamentos = await Medicamento.find({ usuario: req.usuarioId });
        let totalCajasVencidas = 0;
        let totalCajasProximasVencer = 0;
        let medicamentosReabastecimiento = 0;

        medicamentos.forEach(med => {
            totalCajasVencidas += med.getCajasVencidas().length;
            totalCajasProximasVencer += med.getCajasProximasVencer().length;
            if (med.necesitaReabastecimiento()) {
                medicamentosReabastecimiento++;
            }
        });

        // Estadísticas por categoría
        const porCategoria = await Medicamento.aggregate([
            { $match: { usuario: req.usuarioId } },
            { $group: { _id: '$categoria', count: { $sum: 1 } } }
        ]);

        res.json({
            total: totalMedicamentos,
            activos: medicamentosActivos,
            cajasVencidas: totalCajasVencidas,
            cajasProximasVencer: totalCajasProximasVencer,
            reabastecimiento: medicamentosReabastecimiento,
            porCategoria
        });
    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// GET /api/medicamentos/proximos-vencimientos
router.get('/proximos-vencimientos', auth, async (req, res) => {
    try {
        const { dias = 30 } = req.query;
        const medicamentos = await Medicamento.find({ usuario: req.usuarioId });

        const medicamentosConVencimientos = medicamentos.map(med => {
            const cajasProximas = med.getCajasProximasVencer(parseInt(dias));
            return {
                medicamento: {
                    id: med._id,
                    nombre: med.nombre,
                    categoria: med.categoria
                },
                cajasProximasVencer: cajasProximas.map(caja => ({
                    numeroCaja: caja.numeroCaja,
                    fechaVencimiento: caja.fechaVencimiento,
                    diasRestantes: Math.ceil((caja.fechaVencimiento - new Date()) / (1000 * 60 * 60 * 24)),
                    pastillasRestantes: caja.cantidadPastillas - caja.pastillasConsumidas
                }))
            };
        }).filter(med => med.cajasProximasVencer.length > 0);

        res.json(medicamentosConVencimientos);
    } catch (error) {
        console.error('Error obteniendo próximos vencimientos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router; 