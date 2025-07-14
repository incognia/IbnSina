import React from 'react';
import { Box } from '@mui/material';
import FormularioSignosVitales from '../components/FormularioSignosVitales';

const RegistroSignosVitales: React.FC = () => {
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 2 }}>
      <FormularioSignosVitales />
    </Box>
  );
};

export default RegistroSignosVitales; 