import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HistoryIcon from '@mui/icons-material/History';

const MenuNavegacion: React.FC<{ onNavigate: (page: string) => void, open: boolean, onClose: () => void }> = ({ onNavigate, open, onClose }) => {
  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <List sx={{ width: 250 }}>
        <ListItem button onClick={() => { onNavigate('registro'); onClose(); }}>
          <ListItemIcon><AssignmentIcon /></ListItemIcon>
          <ListItemText primary="Registro" />
        </ListItem>
        <ListItem button onClick={() => { onNavigate('historial'); onClose(); }}>
          <ListItemIcon><HistoryIcon /></ListItemIcon>
          <ListItemText primary="Historial" />
        </ListItem>
      </List>
      <Divider />
    </Drawer>
  );
};

export default MenuNavegacion; 