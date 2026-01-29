import React from "react";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import GroupsIcon from "@mui/icons-material/Groups";
import EventIcon from "@mui/icons-material/Event";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SchoolIcon from "@mui/icons-material/School";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import FolderIcon from "@mui/icons-material/Folder";
import SettingsIcon from "@mui/icons-material/Settings";
import CastForEducation  from "@mui/icons-material/CastForEducation";
import  FamilyRestroom  from "@mui/icons-material/FamilyRestroom";
import DateRange from "@mui/icons-material/DateRange";
import Reportes from "@mui/icons-material/Report";
import ViewModule  from "@mui/icons-material/ViewModule";

import { NavLink, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";


const drawerWidth = 260;

export const Sidebar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

const menuItems = [
  { label: "Dashboard", icon: <DashboardIcon />, to: "/dashboard" },
  { label: "Usuarios", icon: <PeopleIcon />, to: "/usuarios" },
  { label: "Paralelos", icon: <ViewModule />, to: "/paralelo" },
  { label: "Año Lectivo", icon: <DateRange />, to: "/anio-lectivo" },
  { label: "Representantes", icon: <FamilyRestroom />, to: "/representantes" },
  { label: "Profesores", icon: <CastForEducation />, to: "/profesores" },
  { label: "Materias", icon: <MenuBookIcon />, to: "/materia" },
  { label: "Estudiantes", icon: <SchoolIcon />, to: "/students" },
  { label: "Cupos", icon: <LocalOfferIcon />, to: "/ofertas" },
  { label: "Reportes", icon: <Reportes />, to: "/reportes" },
  { label: "Matrículas", icon: <HowToRegIcon />, to: "/matricula" },
  { label: "Documentos digitales", icon: <FolderIcon />, to: "/documents" },
  { label: "Configuración", icon: <SettingsIcon />, to: "/settings" }
];

  const content = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar sx={{ px: 2, minHeight: 72 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2, fontSize: '20px', color: theme.palette.primary.main }}>
            Matrículas AMA
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Escuela Ana María Iza
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        <List sx={{ mt: 1 }}>
          {menuItems.map((item) => {
            const selected = location.pathname.startsWith(item.to);
            return (
              <ListItemButton
                key={item.to}
                component={NavLink}
                to={item.to}
                selected={selected}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  mb: 0.5,
                  backgroundColor: selected ? theme.palette.primary.light : "transparent",
                  '&:hover': {
                    backgroundColor: theme.palette.primary.light,
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: selected ? "white" : theme.palette.text.primary }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: 16, fontWeight: selected ? 700 : 500, letterSpacing: 0.5 }}
                  sx={{ color: selected ? "white" : theme.palette.text.primary }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>
      <Box sx={{ p: 2, backgroundColor: theme.palette.grey[200] }}>
        <Typography variant="caption" color="text.secondary">
          Versión prototipo • {new Date().getFullYear()}
        </Typography>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: theme.palette.background.default,
            color: theme.palette.text.primary,
            borderRight: `2px solid ${theme.palette.divider}`
          }
        }}
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          bgcolor: theme.palette.background.default,
          color: theme.palette.text.primary,
          borderRight: `2px solid ${theme.palette.divider}`
        }
      }}
    >
      {content}
    </Drawer>
  );
};
