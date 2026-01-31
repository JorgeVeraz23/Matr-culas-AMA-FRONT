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
import LockResetIcon from "@mui/icons-material/LockReset";

export const Topbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    logout();
    navigate("/login", { replace: true });
  };

  const { displayName, displayRole, initials } = useMemo(() => {
    const name = user?.username ?? "Usuario";
    const role = user?.role ?? "Rol";

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
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ minHeight: 72, px: { xs: 2, md: 3 } }}>
        {/* TITULO */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h6"
            sx={{ fontSize: 20, fontWeight: 700 }}
          >
            Plataforma de Gestión de Matrículas
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.25 }}
          >
            Control de estudiantes, matrículas y documentos digitales.
          </Typography>
        </Box>

        {/* USUARIO */}
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
            "&:hover": { bgcolor: "action.hover" },
            userSelect: "none",
          }}
        >
          <Box sx={{ textAlign: "right" }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, lineHeight: 1.1 }}
            >
              {displayName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {displayRole}
            </Typography>
          </Box>

          <Avatar
            sx={{
              width: 36,
              height: 36,
              fontWeight: 700,
              bgcolor: "primary.main",
              color: "common.white",
            }}
          >
            {initials}
          </Avatar>

          <IconButton size="small" onClick={handleOpen}>
            <ExpandMoreRoundedIcon />
          </IconButton>
        </Stack>

        {/* MENU USUARIO */}
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
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0px 8px 24px rgba(15,23,42,0.12)",
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.25 }}>
            <Typography variant="subtitle2" fontWeight={700}>
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
            <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
            Configuración
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleClose();
              navigate("/cambiar-contrasena");
            }}
          >
            <LockResetIcon fontSize="small" sx={{ mr: 1 }} />
            Cambiar contraseña
          </MenuItem>

          <Divider />

          <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
            <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
            Cerrar sesión
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
