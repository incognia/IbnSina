import React from 'react';
import { Drawer, List, ListItemIcon, ListItemText, Divider, ListItemButton } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HistoryIcon from '@mui/icons-material/History';

const MenuNavegacion: React.FC<{
  onNavigate: (page: 'registro' | 'historial') => void,
  open: boolean,
  onClose: () => void
}> = ({ onNavigate, open, onClose }) => {
  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <List sx={{ width: 250 }}>
        <ListItemButton onClick={() => { onNavigate('registro'); onClose(); }}>
          <ListItemIcon><AssignmentIcon /></ListItemIcon>
          <ListItemText primary="Registro" />
        </ListItemButton>
        <ListItemButton onClick={() => { onNavigate('historial'); onClose(); }}>
          <ListItemIcon><HistoryIcon /></ListItemIcon>
          <ListItemText primary="Historial" />
        </ListItemButton>
      </List>
      <Divider />
    </Drawer>
  );
};

export default MenuNavegacion; 