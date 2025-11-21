import React from "react";
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  Avatar,
  Stack
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

export const Topbar: React.FC = () => {
  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: "background.paper"
      }}
    >
      <Toolbar sx={{ minHeight: 72, px: { xs: 2, md: 3 } }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h1" sx={{ fontSize: 20, fontWeight: 600 }}>
            Plataforma de Gestión de Matrículas
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Control de estudiantes, matrículas y documentos digitales.
          </Typography>
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Admin Secretaría
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Secretaría Académica
            </Typography>
          </Box>
          <Avatar sx={{ width: 32, height: 32 }}>SA</Avatar>
          <IconButton size="small" color="inherit">
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
