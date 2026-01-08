import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1E40AF" },
    secondary: { main: "#7C3AED" },
    background: { default: "#F4F6F8", paper: "#FFFFFF" },
    text: { primary: "#0F172A", secondary: "#475569" },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: ["Inter", "Segoe UI", "Roboto", "system-ui", "Arial"].join(","),
    button: { textTransform: "none", fontWeight: 600 },
  },
});

export default theme;
