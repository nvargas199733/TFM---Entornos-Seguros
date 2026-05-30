import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "../pages/auth/Register";
import RegisterForm from "../pages/auth/RegisterForm";
import Login from "../pages/auth/Login";
import MenuPage from "../pages/menu/Menu";
import Profile from "../pages/profile/Profile";
import CreateReport from "../pages/reports/CreateReport";
import MyReports from "../pages/reports/MyReports";
import ReportTypes from "../pages/reports/ReportTypes";

function AppRoutes() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Register />}
        />
        <Route
          path="/registro"
          element={<RegisterForm />}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/menu"
          element={<MenuPage />}
        />
        <Route 
          path="/perfil" 
          element={<Profile />} 
        />
        <Route 
          path="/generar-reporte" 
          element={<CreateReport />} 
        />
        <Route 
          path="/mis-reportes" 
          element={<MyReports />} 
        />
        <Route 
          path="/tipos-reporte" 
          element={<ReportTypes />} 
        />

      </Routes>

    </BrowserRouter>
  );
}

export default AppRoutes;