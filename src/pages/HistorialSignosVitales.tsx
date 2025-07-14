import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const HistorialSignosVitales: React.FC = () => {
  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Historial de Signos Vitales
        </Typography>
        {/* Aquí irá la tabla/listado de registros */}
        <Typography variant="body2" color="text.secondary">
          Próximamente: tabla con registros, clasificaciones e IMC.
        </Typography>
      </Paper>
    </Box>
  );
};

export default HistorialSignosVitales; 