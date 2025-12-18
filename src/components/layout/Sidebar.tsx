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
import DashboardIcon from "@mui/icons-material/SpaceDashboard";
import ClassIcon from "@mui/icons-material/Class";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import DescriptionIcon from "@mui/icons-material/Description";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SettingsIcon from "@mui/icons-material/Settings";
import { NavLink, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const drawerWidth = 260;

export const Sidebar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", icon: <DashboardIcon />, to: "/dashboard" },
    { label: "Paralelos", icon: <BookmarkIcon />, to: "/paralelo" },
    { label: "Cursos", icon: <ClassIcon />, to: "/curso" },
    { label: "Representante", icon: <PersonIcon />, to: "/representante" },
    { label: "Estudiantes", icon: <SchoolIcon />, to: "/students" },
    { label: "Matrículas", icon: <AssignmentIcon />, to: "/enrollments" },
    { label: "Documentos digitales", icon: <DescriptionIcon />, to: "/documents" },
    { label: "Configuración", icon: <SettingsIcon />, to: "/settings" }
  ];

  const content = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar sx={{ px: 2, minHeight: 72 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>
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
                  mb: 0.5
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: 14 }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Versión prototipo • {new Date().getFullYear()}
        </Typography>
      </Box>
    </Box>
  );

  if (isMobile) {
    // Para avance rápido, el drawer queda fijo también en mobile
    return (
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "grey.900",
            color: "grey.50"
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
          bgcolor: "grey.900",
          color: "grey.50"
        }
      }}
    >
      {content}
    </Drawer>
  );
};
