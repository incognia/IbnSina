const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const router = express.Router();

// Middleware para validar JWT
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Token no proporcionado' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const usuario = await Usuario.findById(decoded.id);
        
        if (!usuario) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }
        
        req.usuario = usuario;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido' });
    }
};

// POST /api/usuarios/registro
router.post('/registro', [
    body('nombre').notEmpty().withMessage('El nombre es requerido'),
    body('apellidos').notEmpty().withMessage('Los apellidos son requeridos'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('edad').isInt({ min: 1 }).withMessage('La edad debe ser un número válido'),
    body('altura').isInt({ min: 100, max: 250 }).withMessage('La altura debe estar entre 100 y 250 cm'),
    body('peso').isFloat({ min: 30, max: 300 }).withMessage('El peso debe estar entre 30 y 300 kg')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { nombre, apellidos, email, password, edad, altura, peso, condiciones } = req.body;

        // Verificar si el email ya existe
        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }

        // Crear nuevo usuario
        const usuario = new Usuario({
            nombre,
            apellidos,
            email,
            password,
            edad,
            altura,
            peso,
            condiciones: condiciones || []
        });

        await usuario.save();

        // Generar token JWT
        const token = jwt.sign(
            { id: usuario._id },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            usuario: usuario.toPublicJSON(),
            token
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// POST /api/usuarios/login
router.post('/login', [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('La contraseña es requerida')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // Buscar usuario
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Verificar contraseña
        const passwordValida = await usuario.compararPassword(password);
        if (!passwordValida) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Generar token JWT
        const token = jwt.sign(
            { id: usuario._id },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login exitoso',
            usuario: usuario.toPublicJSON(),
            token
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// GET /api/usuarios/perfil
router.get('/perfil', auth, async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario._id);
        res.json({
            usuario: usuario.toPublicJSON(),
            imc: usuario.calcularIMC(),
            condicionesActivas: usuario.getCondicionesActivas()
        });
    } catch (error) {
        console.error('Error obteniendo perfil:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// PUT /api/usuarios/perfil
router.put('/perfil', auth, [
    body('nombre').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
    body('apellidos').optional().notEmpty().withMessage('Los apellidos no pueden estar vacíos'),
    body('edad').optional().isInt({ min: 1 }).withMessage('La edad debe ser un número válido'),
    body('altura').optional().isInt({ min: 100, max: 250 }).withMessage('La altura debe estar entre 100 y 250 cm'),
    body('peso').optional().isFloat({ min: 30, max: 300 }).withMessage('El peso debe estar entre 30 y 300 kg')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const camposPermitidos = ['nombre', 'apellidos', 'edad', 'altura', 'peso', 'condiciones', 'contactoEmergencia', 'notificaciones', 'configuracionPrivacidad'];
        const actualizaciones = {};

        camposPermitidos.forEach(campo => {
            if (req.body[campo] !== undefined) {
                actualizaciones[campo] = req.body[campo];
            }
        });

        const usuario = await Usuario.findByIdAndUpdate(
            req.usuario._id,
            actualizaciones,
            { new: true, runValidators: true }
        );

        res.json({
            message: 'Perfil actualizado exitosamente',
            usuario: usuario.toPublicJSON(),
            imc: usuario.calcularIMC()
        });
    } catch (error) {
        console.error('Error actualizando perfil:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// PUT /api/usuarios/cambiar-password
router.put('/cambiar-password', auth, [
    body('passwordActual').notEmpty().withMessage('La contraseña actual es requerida'),
    body('passwordNueva').isLength({ min: 6 }).withMessage('La nueva contraseña debe tener al menos 6 caracteres')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { passwordActual, passwordNueva } = req.body;

        // Verificar contraseña actual
        const passwordValida = await req.usuario.compararPassword(passwordActual);
        if (!passwordValida) {
            return res.status(400).json({ message: 'La contraseña actual es incorrecta' });
        }

        // Actualizar contraseña
        req.usuario.password = passwordNueva;
        await req.usuario.save();

        res.json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
        console.error('Error cambiando contraseña:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// DELETE /api/usuarios/cuenta
router.delete('/cuenta', auth, async (req, res) => {
    try {
        await Usuario.findByIdAndDelete(req.usuario._id);
        res.json({ message: 'Cuenta eliminada exitosamente' });
    } catch (error) {
        console.error('Error eliminando cuenta:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router; 