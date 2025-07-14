const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ibnsina', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error conectando a MongoDB:', err));

// Rutas básicas
app.get('/', (req, res) => {
    res.json({ 
        message: 'Bienvenido a IbnSina - API de Control de Medicamentos',
        developer: 'Rodrigo Ernesto Álvarez Aguilera',
        version: '1.0.0'
    });
});

// Rutas de la API
app.use('/api/medicamentos', require('./routes/medicamentos'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/dosis', require('./routes/dosis'));
app.use('/api/signos-vitales', require('./routes/signosVitales'));

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Algo salió mal en el servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Ruta 404
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
    console.log(`👨‍💻 Desarrollado por: Rodrigo Álvarez`);
    console.log(`📱 Aplicación: Control de Medicamentos IbnSina`);
}); 