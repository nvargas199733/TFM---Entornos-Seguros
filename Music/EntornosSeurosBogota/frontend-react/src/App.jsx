/*
  App:
  Configuración principal de rutas.
*/

import { Routes, Route } from "react-router-dom";
import HomePolice from "./pages/HomePolice";
import ReportsPolice from "./pages/ReportsPolice";
import UserReportDetail from "./pages/UserReportDetail";
import CreatePoliceReport from "./pages/CreatePoliceReport";
import AdminHome from "./pages/AdminHome";
import CreateUserAdmin from "./pages/CreateUserAdmin";
import ManageUsersAdmin from "./pages/ManageUsersAdmin";
import AdminIncidents from "./pages/AdminIncidents";
import AdminIncidentDetail from "./pages/AdminIncidentDetail";

const App = () => {
  return (
    <Routes>
      {/* Inicio */}
      <Route path="/" element={<HomePolice />} />

      {/* Reportes */}
      <Route path="/reportes" element={<ReportsPolice />} />

      <Route path="/reportes/:id" element={<UserReportDetail />} />

      <Route
        path="/reportes/:id/generar-informe"
        element={<CreatePoliceReport />}
      />
      <Route path="/admin" element={<AdminHome />} />
      <Route path="/admin/crear-usuario" element={<CreateUserAdmin />} />
      <Route path="/admin/gestion-usuarios" element={<ManageUsersAdmin />} />
      <Route path="/admin/editar-usuario/:id" element={<CreateUserAdmin />} />
      <Route path="/admin/incidentes" element={<AdminIncidents />} />
      <Route path="/admin/incidentes/:id" element={<AdminIncidentDetail />} />
    </Routes>
  );
};

export default App;
