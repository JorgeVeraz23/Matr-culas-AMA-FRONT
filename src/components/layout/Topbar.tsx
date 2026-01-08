import React, { useMemo, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export const Topbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    logout();
    navigate("/login", { replace: true });
  };

  const { displayName, displayRole, initials } = useMemo(() => {
    const name = user?.username ?? "Usuario";
    const role = user?.role ?? "Rol";

    // iniciales (2 letras)
    const ini = name
      .replace(/[^a-zA-Z0-9]+/g, " ")
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    return { displayName: name, displayRole: role, initials: ini || "U" };
  }, [user]);

  return (
    <AppBar
      position="static"
      elevation={1}
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: "primary.main",
      }}
    >
      <Toolbar sx={{ minHeight: 72, px: { xs: 2, md: 3 } }}>
        {/* TITULO */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontSize: 22, fontWeight: 700, color: "common.white" }}>
            Plataforma de Gestión de Matrículas
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, color: "rgba(255,255,255,0.8)" }}>
            Control de estudiantes, matrículas y documentos digitales.
          </Typography>
        </Box>

        {/* USUARIO (click abre menu) */}
        <Stack
          direction="row"
          spacing={1.25}
          alignItems="center"
          onClick={handleOpen}
          sx={{
            cursor: "pointer",
            px: 1,
            py: 0.75,
            borderRadius: 2,
            "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
            userSelect: "none",
          }}
        >
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "common.white", lineHeight: 1.1 }}>
              {displayName}
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)" }}>
              {displayRole}
            </Typography>
          </Box>

          <Avatar
            sx={{
              width: 36,
              height: 36,
              fontWeight: 800,
              bgcolor: "secondary.main",
              boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
            }}
          >
            {initials}
          </Avatar>

          <IconButton
            size="small"
            sx={{ color: "rgba(255,255,255,0.9)" }}
            onClick={handleOpen}
          >
            <ExpandMoreRoundedIcon />
          </IconButton>
        </Stack>

        {/* MENU OCULTO (logout aqui) */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 220,
              borderRadius: 2,
              overflow: "hidden",
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.25 }}>
            <Typography variant="subtitle2" fontWeight={800}>
              {displayName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {displayRole}
            </Typography>
          </Box>

          <Divider />

          <MenuItem
            onClick={() => {
              handleClose();
              navigate("/settings");
            }}
          >
            <SettingsIcon fontSize="small" style={{ marginRight: 10 }} />
            Configuración
          </MenuItem>

          <Divider />

          <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
            <LogoutIcon fontSize="small" style={{ marginRight: 10 }} />
            Cerrar sesión
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
