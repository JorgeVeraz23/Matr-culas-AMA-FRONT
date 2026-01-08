import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import { Sidebar } from "../components/layout/Sidebar";
import { Topbar } from "../components/layout/Topbar";
import { DashboardPage } from "../pages/DashboardPage";
import { EnrollmentsPage } from "../pages/EnrollmentsPage";
import { DocumentsPage } from "../pages/DocumentsPage";
import { SettingsPage } from "../pages/SettingsPage";
import StudentsPage from "../pages/students/StudentsPage";
import NotFoundPage from "../pages/NotFoundPage";
import CreateStudentForm from "../pages/students/CreateStudentsPage";
import ParalelosPage from "../pages/paralelo/ParaleloPage";
import CreateParaleloForm from "../pages/paralelo/CreateParaleloPage";
import { useAuth } from "../auth/AuthContext";
import LoginPage from "../pages/LoginPage";
import MateriasPage from "../pages/materia/MostrarMateriaPage";
import CreateMateriaForm from "../pages/materia/CreateMateriaPage";
import OfertasPage from "../pages/ofertas/OfertasPage";
import CreateOfertaPage from "../pages/ofertas/CreateOfertaPage";

export const AppRouter: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
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
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/materia" element={<MateriasPage />} />
            <Route path="/materia/create" element={<CreateMateriaForm />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/students/create" element={<CreateStudentForm />} />
            <Route path="/enrollments" element={<EnrollmentsPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/paralelo" element={<ParalelosPage />} />
            <Route path="/paralelos/create" element={<CreateParaleloForm />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/ofertas" element={<OfertasPage />} /> 
            <Route path="/ofertas/create" element={<CreateOfertaPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};
