"use client";
import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button, Alert, CircularProgress } from "@mui/material";
import apiService from "../services/api";

const RegistroSignosVitales: React.FC = () => {
  const [form, setForm] = useState({
    glucosa: '', presionSistolica: '', presionDiastolica: '', oxigenacion: '', temperatura: '', peso: '', circunferenciaCintura: '', pulso: '', sintomas: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess(false);
    try {
      const datos: any = {};
      if (form.glucosa) datos.glucosa = { valor: Number(form.glucosa) };
      if (form.presionSistolica || form.presionDiastolica) datos.presionArterial = { sistolica: form.presionSistolica ? Number(form.presionSistolica) : undefined, diastolica: form.presionDiastolica ? Number(form.presionDiastolica) : undefined };
      if (form.oxigenacion) datos.oxigenacion = { valor: Number(form.oxigenacion) };
      if (form.temperatura) datos.temperatura = { valor: Number(form.temperatura) };
      if (form.peso) datos.peso = { valor: Number(form.peso) };
      if (form.circunferenciaCintura) datos.circunferenciaCintura = { valor: Number(form.circunferenciaCintura) };
      if (form.pulso) datos.pulso = { valor: Number(form.pulso) };
      if (form.sintomas) datos.notas = form.sintomas;
      await apiService.registrarSignosVitales(datos);
      setSuccess(true); setForm({ glucosa: '', presionSistolica: '', presionDiastolica: '', oxigenacion: '', temperatura: '', peso: '', circunferenciaCintura: '', pulso: '', sintomas: '' });
    } catch (err: any) {
      setError(err.message || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto' }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Registro de Signos Vitales</Typography>
        <TextField label="Glucosa (mg/dL)" name="glucosa" value={form.glucosa} onChange={handleChange} fullWidth margin="normal" type="number" />
        <TextField label="Presión Sistólica" name="presionSistolica" value={form.presionSistolica} onChange={handleChange} fullWidth margin="normal" type="number" />
        <TextField label="Presión Diastólica" name="presionDiastolica" value={form.presionDiastolica} onChange={handleChange} fullWidth margin="normal" type="number" />
        <TextField label="Oxigenación (%)" name="oxigenacion" value={form.oxigenacion} onChange={handleChange} fullWidth margin="normal" type="number" />
        <TextField label="Temperatura (°C)" name="temperatura" value={form.temperatura} onChange={handleChange} fullWidth margin="normal" type="number" />
        <TextField label="Peso (kg)" name="peso" value={form.peso} onChange={handleChange} fullWidth margin="normal" type="number" />
        <TextField label="Cintura (cm)" name="circunferenciaCintura" value={form.circunferenciaCintura} onChange={handleChange} fullWidth margin="normal" type="number" />
        <TextField label="Pulso (lpm)" name="pulso" value={form.pulso} onChange={handleChange} fullWidth margin="normal" type="number" />
        <TextField label="Síntomas (opcional)" name="sintomas" value={form.sintomas} onChange={handleChange} fullWidth margin="normal" multiline rows={2} />
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>Registro exitoso</Alert>}
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>{loading ? <CircularProgress size={24} /> : 'Registrar'}</Button>
      </Paper>
    </Box>
  );
};

export default RegistroSignosVitales; 