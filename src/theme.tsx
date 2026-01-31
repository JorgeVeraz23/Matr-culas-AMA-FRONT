import { createTheme } from "@mui/material/styles";

const shadows: [
  "none",
  string, string, string, string,
  string, string, string, string,
  string, string, string, string,
  string, string, string, string,
  string, string, string, string,
  string, string, string, string
] = [
  "none",
  "0px 1px 2px rgba(15,23,42,0.06)",
  "0px 2px 4px rgba(15,23,42,0.06)",
  "0px 4px 6px rgba(15,23,42,0.06)",
  "0px 6px 8px rgba(15,23,42,0.06)",
  "0px 8px 10px rgba(15,23,42,0.06)",
  "0px 10px 12px rgba(15,23,42,0.06)",
  "0px 12px 14px rgba(15,23,42,0.06)",
  "0px 14px 16px rgba(15,23,42,0.06)",
  "0px 16px 18px rgba(15,23,42,0.06)",
  "0px 18px 20px rgba(15,23,42,0.06)",
  "0px 20px 22px rgba(15,23,42,0.06)",
  "0px 22px 24px rgba(15,23,42,0.06)",
  "0px 24px 26px rgba(15,23,42,0.06)",
  "0px 26px 28px rgba(15,23,42,0.06)",
  "0px 28px 30px rgba(15,23,42,0.06)",
  "0px 30px 32px rgba(15,23,42,0.06)",
  "0px 32px 34px rgba(15,23,42,0.06)",
  "0px 34px 36px rgba(15,23,42,0.06)",
  "0px 36px 38px rgba(15,23,42,0.06)",
  "0px 38px 40px rgba(15,23,42,0.06)",
  "0px 40px 42px rgba(15,23,42,0.06)",
  "0px 42px 44px rgba(15,23,42,0.06)",
  "0px 44px 46px rgba(15,23,42,0.06)",
  "0px 46px 48px rgba(15,23,42,0.06)",
];

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1E40AF" },
    secondary: { main: "#7C3AED" },
    background: { default: "#F4F6F8", paper: "#FFFFFF" },
    text: { primary: "#0F172A", secondary: "#475569" },
    divider: "#E5E7EB",
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: ["Inter", "Segoe UI", "Roboto", "system-ui", "Arial"].join(","),
    button: { textTransform: "none", fontWeight: 600 },
  },
  shadows,
});

export default theme;
