import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Divider,
  Card,
  CardContent,
  Chip,
  CircularProgress
} from '@mui/material';
import { LocalHospital, Monitor, Scale, Thermostat, Favorite, Height } from '@mui/icons-material';
import apiService from '../services/api';

interface FormData {
  glucosa: number | '';
  presionSistolica: number | '';
  presionDiastolica: number | '';
  oxigenacion: number | '';
  temperatura: number | '';
  peso: number | '';
  circunferenciaCintura: number | '';
  sintomas: string;
  dispositivo: string;
}

const FormularioSignosVitales: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    glucosa: '',
    presionSistolica: '',
    presionDiastolica: '',
    oxigenacion: '',
    temperatura: '',
    peso: '',
    circunferenciaCintura: '',
    sintomas: '',
    dispositivo: ''
  });

  const [alertas, setAlertas] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validarSignosVitales = (): string[] => {
    const alertas: string[] = [];

    // Validación de glucosa
    if (formData.glucosa !== '') {
      const glucosa = Number(formData.glucosa);
      if (glucosa > 200) {
        alertas.push('⚠️ Glucosa elevada (>200 mg/dL) - Hiperglucemia');
      } else if (glucosa < 70) {
        alertas.push('⚠️ Glucosa baja (<70 mg/dL) - Hipoglucemia');
      }
    }

    // Validación de presión arterial
    if (formData.presionSistolica !== '' && formData.presionDiastolica !== '') {
      const sistolica = Number(formData.presionSistolica);
      const diastolica = Number(formData.presionDiastolica);
      
      if (sistolica > 140 || diastolica > 90) {
        alertas.push('⚠️ Presión arterial elevada (>140/90 mmHg) - Hipertensión');
      } else if (sistolica < 90 || diastolica < 60) {
        alertas.push('⚠️ Presión arterial baja (<90/60 mmHg) - Hipotensión');
      }
    }

    // Validación de oxigenación
    if (formData.oxigenacion !== '') {
      const oxigenacion = Number(formData.oxigenacion);
      if (oxigenacion < 95) {
        alertas.push('⚠️ Oxigenación baja (<95%) - Hipoxemia');
      }
    }

    // Validación de temperatura
    if (formData.temperatura !== '') {
      const temperatura = Number(formData.temperatura);
      if (temperatura > 38) {
        alertas.push('⚠️ Temperatura elevada (>38°C) - Fiebre');
      } else if (temperatura < 36) {
        alertas.push('⚠️ Temperatura baja (<36°C) - Hipotermia');
      }
    }

    return alertas;
  };

  const calcularIMC = (): { imc: number; clasificacion: string } | null => {
    if (formData.peso !== '' && formData.circunferenciaCintura !== '') {
      // Asumiendo altura promedio para cálculo básico
      const peso = Number(formData.peso);
      const altura = 1.70; // Altura promedio, idealmente se debería medir
      const imc = peso / (altura * altura);
      
      let clasificacion = '';
      if (imc < 18.5) clasificacion = 'Bajo peso';
      else if (imc < 25) clasificacion = 'Peso normal';
      else if (imc < 30) clasificacion = 'Sobrepeso';
      else clasificacion = 'Obesidad';

      return { imc: Math.round(imc * 10) / 10, clasificacion };
    }
    return null;
  };

  const limpiarFormulario = () => {
    setFormData({
      glucosa: '',
      presionSistolica: '',
      presionDiastolica: '',
      oxigenacion: '',
      temperatura: '',
      peso: '',
      circunferenciaCintura: '',
      sintomas: '',
      dispositivo: ''
    });
    setAlertas([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const nuevasAlertas = validarSignosVitales();
    setAlertas(nuevasAlertas);

    // Preparar datos para enviar al backend con estructura anidada
    const datosParaEnviar: any = {};
    if (formData.glucosa !== '') datosParaEnviar.glucosa = { valor: Number(formData.glucosa), tipo: 'ayunas' };
    if (formData.presionSistolica !== '' || formData.presionDiastolica !== '') datosParaEnviar.presionArterial = {
      sistolica: formData.presionSistolica !== '' ? Number(formData.presionSistolica) : undefined,
      diastolica: formData.presionDiastolica !== '' ? Number(formData.presionDiastolica) : undefined
    };
    if (formData.oxigenacion !== '') datosParaEnviar.oxigenacion = { valor: Number(formData.oxigenacion) };
    if (formData.temperatura !== '') datosParaEnviar.temperatura = { valor: Number(formData.temperatura) };
    if (formData.peso !== '') datosParaEnviar.peso = { valor: Number(formData.peso) };
    if (formData.circunferenciaCintura !== '') datosParaEnviar.circunferenciaCintura = { valor: Number(formData.circunferenciaCintura) };
    if (formData.dispositivo) datosParaEnviar.dispositivo = { tipo: formData.dispositivo };
    if (formData.sintomas) datosParaEnviar.notas = formData.sintomas;

    setIsLoading(true);
    setErrorMessage('');

    try {
      const respuesta = await apiService.registrarSignosVitales(datosParaEnviar);
      console.log('Respuesta del servidor:', respuesta);
      setShowSuccess(true);
      limpiarFormulario();
    } catch (error) {
      console.error('Error al enviar datos:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error desconocido');
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const imcData = calcularIMC();

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocalHospital color="primary" />
          Registro de Signos Vitales
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Completa los campos con tus mediciones más recientes. Los valores se clasificarán automáticamente según estándares médicos.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Primera fila: Glucosa y Presión Arterial */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              sx={{ flex: 1, minWidth: 200 }}
              label="Glucosa (mg/dL)"
              type="number"
              value={formData.glucosa}
              onChange={(e) => handleInputChange('glucosa', e.target.value)}
              InputProps={{
                startAdornment: <Monitor sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              helperText="Valor normal: 70-200 mg/dL"
            />
            
            <Box sx={{ display: 'flex', gap: 1, flex: 1, minWidth: 200 }}>
              <TextField
                fullWidth
                label="Presión Sistólica"
                type="number"
                value={formData.presionSistolica}
                onChange={(e) => handleInputChange('presionSistolica', e.target.value)}
                InputProps={{
                  startAdornment: <Favorite sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                helperText="mmHg"
              />
              <TextField
                fullWidth
                label="Presión Diastólica"
                type="number"
                value={formData.presionDiastolica}
                onChange={(e) => handleInputChange('presionDiastolica', e.target.value)}
                helperText="mmHg"
              />
            </Box>
          </Box>

          {/* Segunda fila: Oxigenación y Temperatura */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              sx={{ flex: 1, minWidth: 200 }}
              label="Oxigenación (%)"
              type="number"
              value={formData.oxigenacion}
              onChange={(e) => handleInputChange('oxigenacion', e.target.value)}
              InputProps={{
                startAdornment: <Favorite sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              helperText="Valor normal: 95-100%"
            />
            
            <TextField
              sx={{ flex: 1, minWidth: 200 }}
              label="Temperatura (°C)"
              type="number"
              value={formData.temperatura}
              onChange={(e) => handleInputChange('temperatura', e.target.value)}
              InputProps={{
                startAdornment: <Thermostat sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              helperText="Valor normal: 36-38°C"
            />
          </Box>

          {/* Tercera fila: Peso y Circunferencia */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              sx={{ flex: 1, minWidth: 200 }}
              label="Peso (kg)"
              type="number"
              value={formData.peso}
              onChange={(e) => handleInputChange('peso', e.target.value)}
              InputProps={{
                startAdornment: <Scale sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
            
            <TextField
              sx={{ flex: 1, minWidth: 200 }}
              label="Circunferencia de Cintura (cm)"
              type="number"
              value={formData.circunferenciaCintura}
              onChange={(e) => handleInputChange('circunferenciaCintura', e.target.value)}
              InputProps={{
                startAdornment: <Height sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Box>

          {/* Síntomas */}
          <TextField
            fullWidth
            label="Síntomas (opcional)"
            multiline
            rows={3}
            value={formData.sintomas}
            onChange={(e) => handleInputChange('sintomas', e.target.value)}
            placeholder="Describe cualquier síntoma que experimentes..."
          />

          {/* Dispositivo */}
          <FormControl fullWidth>
            <InputLabel>Dispositivo de Medición</InputLabel>
            <Select
              value={formData.dispositivo}
              label="Dispositivo de Medición"
              onChange={(e) => handleInputChange('dispositivo', e.target.value)}
            >
              <MenuItem value="glucometro">Glucometro</MenuItem>
              <MenuItem value="tensiometro">Tensiómetro</MenuItem>
              <MenuItem value="oximetro">Oxímetro</MenuItem>
              <MenuItem value="termometro">Termómetro</MenuItem>
              <MenuItem value="bascula">Báscula</MenuItem>
              <MenuItem value="cinta_medicion">Cinta de Medición</MenuItem>
              <MenuItem value="otro">Otro</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Cálculo de IMC */}
        {imcData && (
          <Card sx={{ mt: 3, bgcolor: 'background.paper' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Cálculo de IMC
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Typography variant="body1">
                  IMC: <strong>{imcData.imc}</strong>
                </Typography>
                <Chip 
                  label={imcData.clasificacion}
                  color={
                    imcData.clasificacion === 'Peso normal' ? 'success' :
                    imcData.clasificacion === 'Sobrepeso' ? 'warning' :
                    imcData.clasificacion === 'Obesidad' ? 'error' : 'info'
                  }
                />
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Alertas */}
        {alertas.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom color="warning.main">
              Alertas Detectadas
            </Typography>
            {alertas.map((alerta, index) => (
              <Alert key={index} severity="warning" sx={{ mb: 1 }}>
                {alerta}
              </Alert>
            ))}
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        {/* Botones */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button 
            variant="outlined" 
            onClick={limpiarFormulario}
            disabled={isLoading}
          >
            Limpiar
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            size="large"
            startIcon={isLoading ? <CircularProgress size={20} /> : <LocalHospital />}
            disabled={isLoading}
          >
            {isLoading ? 'Registrando...' : 'Registrar Signos Vitales'}
          </Button>
        </Box>
      </Paper>

      {/* Notificaciones */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success">
          Signos vitales registrados exitosamente
        </Alert>
      </Snackbar>

      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
      >
        <Alert onClose={() => setShowError(false)} severity="error">
          {errorMessage || 'Error al registrar los signos vitales'}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FormularioSignosVitales; 