import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress, Alert } from '@mui/material';
import apiService, { SignosVitalesResponse } from '../services/api';

const HistorialSignosVitales: React.FC = () => {
  const [registros, setRegistros] = useState<SignosVitalesResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistorial = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await apiService.obtenerHistorial(50);
        setRegistros(data);
      } catch (err) {
        setError('No se pudo obtener el historial.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistorial();
  }, []);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Historial de Signos Vitales
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Glucosa</TableCell>
                  <TableCell>Dispositivo Glucosa</TableCell>
                  <TableCell>Presión</TableCell>
                  <TableCell>Dispositivo Presión</TableCell>
                  <TableCell>Oxigenación</TableCell>
                  <TableCell>Dispositivo Oxigenación</TableCell>
                  <TableCell>Temperatura</TableCell>
                  <TableCell>Dispositivo Temperatura</TableCell>
                  <TableCell>Peso</TableCell>
                  <TableCell>Dispositivo Peso</TableCell>
                  <TableCell>Cintura</TableCell>
                  <TableCell>Dispositivo Cintura</TableCell>
                  <TableCell>Pulso</TableCell>
                  <TableCell>Dispositivo Pulso</TableCell>
                  <TableCell>Alertas</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {registros.map((r) => (
                  <TableRow key={r._id}>
                    <TableCell>{r.fecha ? new Date(r.fecha).toLocaleString() : ''}</TableCell>
                    <TableCell>{r.glucosa?.valor ?? '-'}</TableCell>
                    <TableCell>{r.glucosa?.dispositivo?.tipo ?? '-'}</TableCell>
                    <TableCell>{r.presionArterial ? `${r.presionArterial.sistolica ?? '-'} / ${r.presionArterial.diastolica ?? '-'}` : '-'}</TableCell>
                    <TableCell>{r.presionArterial?.dispositivo?.tipo ?? '-'}</TableCell>
                    <TableCell>{r.oxigenacion?.valor ?? '-'}</TableCell>
                    <TableCell>{r.oxigenacion?.dispositivo?.tipo ?? '-'}</TableCell>
                    <TableCell>{r.temperatura?.valor ?? '-'}</TableCell>
                    <TableCell>{r.temperatura?.dispositivo?.tipo ?? '-'}</TableCell>
                    <TableCell>{r.peso?.valor ?? '-'}</TableCell>
                    <TableCell>{r.peso?.dispositivo?.tipo ?? '-'}</TableCell>
                    <TableCell>{r.circunferenciaCintura?.valor ?? '-'}</TableCell>
                    <TableCell>{r.circunferenciaCintura?.dispositivo?.tipo ?? '-'}</TableCell>
                    <TableCell>{r.pulso?.valor ?? (r.presionArterial?.pulso ?? '-')}</TableCell>
                    <TableCell>{r.pulso?.dispositivo?.tipo ?? (r.presionArterial?.dispositivo?.tipo ?? '-')}</TableCell>
                    <TableCell>
                      {Array.isArray(r.alertas) && r.alertas.length > 0
                        ? r.alertas.map((a, i) => (
                            <Chip key={i} label={a} color="warning" size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                          ))
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default HistorialSignosVitales; 