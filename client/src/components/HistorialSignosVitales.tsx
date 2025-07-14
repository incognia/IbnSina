"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress, Alert, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import apiService from "../services/api";

interface SignosVitalesResponse {
  _id: string;
  fecha?: string;
  glucosa?: { valor?: number; dispositivo?: { tipo?: string } };
  presionArterial?: { sistolica?: number; diastolica?: number; dispositivo?: { tipo?: string }, pulso?: number };
  oxigenacion?: { valor?: number; dispositivo?: { tipo?: string } };
  temperatura?: { valor?: number; dispositivo?: { tipo?: string } };
  peso?: { valor?: number; dispositivo?: { tipo?: string } };
  circunferenciaCintura?: { valor?: number };
  pulso?: { valor?: number; dispositivo?: { tipo?: string } };
  alertas?: string[];
}

const HistorialSignosVitales: React.FC = () => {
  const [registros, setRegistros] = useState<SignosVitalesResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [registroAEliminar, setRegistroAEliminar] = useState<string | null>(null);

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

  const handleDeleteClick = (id: string) => {
    setRegistroAEliminar(id);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!registroAEliminar) return;
    try {
      await apiService.eliminarRegistro(registroAEliminar);
      setRegistros(registros => registros.filter(r => r._id !== registroAEliminar));
    } catch (err) {
      alert('No se pudo eliminar el registro.');
    } finally {
      setDialogOpen(false);
      setRegistroAEliminar(null);
    }
  };

  const handleCancelDelete = () => {
    setDialogOpen(false);
    setRegistroAEliminar(null);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Historial de Signos Vitales</Typography>
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
                  <TableCell>Presión</TableCell>
                  <TableCell>Oxigenación</TableCell>
                  <TableCell>Temperatura</TableCell>
                  <TableCell>Peso</TableCell>
                  <TableCell>Cintura</TableCell>
                  <TableCell>Pulso</TableCell>
                  <TableCell>Alertas</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {registros.map((r) => (
                  <TableRow key={r._id}>
                    <TableCell>{r.fecha ? new Date(r.fecha).toLocaleString() : ''}</TableCell>
                    <TableCell>{r.glucosa?.valor ?? '-'}</TableCell>
                    <TableCell>{r.presionArterial ? `${r.presionArterial.sistolica ?? '-'} / ${r.presionArterial.diastolica ?? '-'}` : '-'}</TableCell>
                    <TableCell>{r.oxigenacion?.valor ?? '-'}</TableCell>
                    <TableCell>{r.temperatura?.valor ?? '-'}</TableCell>
                    <TableCell>{r.peso?.valor ?? '-'}</TableCell>
                    <TableCell>{r.circunferenciaCintura?.valor ?? '-'}</TableCell>
                    <TableCell>{r.pulso?.valor ?? (r.presionArterial?.pulso ?? '-')}</TableCell>
                    <TableCell>
                      {Array.isArray(r.alertas) && r.alertas.length > 0
                        ? r.alertas.map((a, i) => (
                            <Chip key={i} label={a} color="warning" size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                          ))
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <IconButton aria-label="Eliminar" color="error" onClick={() => handleDeleteClick(r._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
      <Dialog open={dialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Eliminar registro</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar este registro de signos vitales? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HistorialSignosVitales; 