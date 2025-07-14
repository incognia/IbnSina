"use client";
import React, { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import RegistroSignosVitales from "../components/RegistroSignosVitales";
import HistorialSignosVitales from "../components/HistorialSignosVitales";

export default function AppShell() {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');
  const [page, setPage] = useState<'registro' | 'historial'>('registro');
  const theme = React.useMemo(() => createTheme({ palette: { mode } }), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            IbnSina
          </Typography>
          <IconButton sx={{ ml: 1 }} onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')} color="inherit">
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 2 }}>
        <ButtonGroup sx={{ mb: 2 }}>
          <Button variant={page === 'registro' ? 'contained' : 'outlined'} onClick={() => setPage('registro')}>Registro</Button>
          <Button variant={page === 'historial' ? 'contained' : 'outlined'} onClick={() => setPage('historial')}>Historial</Button>
        </ButtonGroup>
        {page === 'registro' && <RegistroSignosVitales />}
        {page === 'historial' && <HistorialSignosVitales />}
      </Box>
    </ThemeProvider>
  );
}
