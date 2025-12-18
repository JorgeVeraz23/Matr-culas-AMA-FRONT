import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import { Sidebar } from "../components/layout/Sidebar";
import { Topbar } from "../components/layout/Topbar";
import { DashboardPage } from "../pages/DashboardPage";
import { StudentsPage } from "../pages/StudentsPage";
import { EnrollmentsPage } from "../pages/EnrollmentsPage";
import { DocumentsPage } from "../pages/DocumentsPage";
import { SettingsPage } from "../pages/SettingsPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { LoginPage } from "../pages/LoginPage"; // si luego manejas auth real
import { ParaleloPage } from "../pages/ParaleloPage";
import { CursoPage } from "../pages/CursoPage";
import { RepresentantePage } from "../pages/RepresentantePage";

export const AppRouter: React.FC = () => {
  const isAuthenticated = true; // TODO: conectar con backend

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="*" element={<Navigate to="/login" />} /> */}
      </Routes>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Sidebar />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar />
        <Box component="main" sx={{ p: { xs: 2, md: 3 } }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/enrollments" element={<EnrollmentsPage />} />
            <Route path="/representante" element={<RepresentantePage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/paralelo" element={<ParaleloPage/>} />
            <Route path="/curso" element={<CursoPage/>} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};
