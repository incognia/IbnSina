import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const RegistroSignosVitales: React.FC = () => {
  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Registro de Signos Vitales
        </Typography>
        {/* Aquí irá el formulario de registro */}
        <Typography variant="body2" color="text.secondary">
          Próximamente: formulario para registrar glucosa, presión arterial, oxigenación, temperatura, peso, cintura, síntomas y dispositivo.
        </Typography>
      </Paper>
    </Box>
  );
};

export default RegistroSignosVitales; 