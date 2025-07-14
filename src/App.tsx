import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import MenuNavegacion from './components/MenuNavegacion';
import RegistroSignosVitales from './pages/RegistroSignosVitales';
import HistorialSignosVitales from './pages/HistorialSignosVitales';

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function App() {
  const [mode, setMode] = React.useState<'light' | 'dark'>('dark');
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [page, setPage] = React.useState<'registro' | 'historial'>('registro');

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={() => setMenuOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              IbnSina
            </Typography>
            <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Toolbar>
        </AppBar>
        <MenuNavegacion open={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={setPage} />
        <Box sx={{ p: 2 }}>
          {page === 'registro' && <RegistroSignosVitales />}
          {page === 'historial' && <HistorialSignosVitales />}
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App; 