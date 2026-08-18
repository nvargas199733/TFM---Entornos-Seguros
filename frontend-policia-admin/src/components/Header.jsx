import { Link, useNavigate } from "react-router-dom";
import "../styles/header.css";
import logo from "../assets/logo.jpg";
import { LogOut, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { clearSession, getSession } from "../services/authService";

/*
  Header:
  Componente reutilizable para navegación principal.
  Permite navegación dinámica según el rol e incluye Cerrar sesión.
*/

const Header = ({ navLinks }) => {
  const navigate = useNavigate();
  const session = getSession();
  const role = session?.user?.role;

  const defaultPoliceLinks = [
    { label: "Inicio", path: "/" },
    { label: "Reportes", path: "/reportes" },
    { label: "Mapa", path: "/mapa" },
  ];

  const defaultAdminLinks = [
    { label: "Inicio", path: "/admin" },
    { label: "Crear usuario", path: "/admin/crear-usuario" },
    { label: "Gestión de usuario", path: "/admin/gestion-usuarios" },
    { label: "Incidentes", path: "/admin/incidentes" },
  ];

  const [darkMode, setDarkMode] = useState(
    document.body.classList.contains("dark-mode"),
  );

  const toggleDarkMode = () => {
    document.body.classList.toggle("dark-mode");
    setDarkMode(document.body.classList.contains("dark-mode"));
  };

  const handleLogout = () => {
    clearSession();
    navigate("/login", { replace: true });
  };

  const links =
    navLinks || (role === "ADMIN" ? defaultAdminLinks : defaultPoliceLinks);

  return (
    <header className="header">
      {/* Logo y nombre */}
      <div className="header__brand">
        <img className="header__logo" src={logo} alt="Logo Entornos Seguros" />
        <h1 className="header__title">Entornos Seguros</h1>
      </div>

      {/* Navegación dinámica */}
      <nav className="header__nav" aria-label="Navegación principal">
        {links.map((link) => (
          <Link key={link.path} to={link.path} className="header__link">
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Acciones de cabecera */}
      <div className="header__actions">
        <button
          className="header__theme-button"
          type="button"
          onClick={toggleDarkMode}
          aria-label={darkMode ? "Activar modo claro" : "Activar modo oscuro"}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button
          className="header__logout-button"
          type="button"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
