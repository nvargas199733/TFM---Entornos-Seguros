import { Link } from "react-router-dom";
import "../styles/header.css";
import logo from "../assets/logo.jpg";

/*
  Header:
  Componente reutilizable para navegación principal.

  Ahora permite navegación dinámica según el rol.
*/

const Header = ({ navLinks }) => {
  /*
    Links por defecto para el rol policía.
  */
  const defaultLinks = [
    { label: "Inicio", path: "/" },
    { label: "Reportes", path: "/reportes" },
  ];
  const toggleDarkMode = () => {
    document.body.classList.toggle("dark-mode");
  };

  /*
    Si recibe navLinks:
    usa esos links.

    Si no:
    usa los links por defecto.
  */
  const links = navLinks || defaultLinks;

  return (
    <header className="header">
      {/* Logo y nombre */}
      <div className="header__brand">
        <img className="header__logo" src={logo} alt="Logo Entornos Seguros" />

        <h1 className="header__title">Entornos Seguros</h1>
      </div>

      {/* Navegación dinámica */}
      <nav className="header__nav">
        {links.map((link) => (
          <Link key={link.path} to={link.path} className="header__link">
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Botón usuario */}
      <button className="header__user" type="button" onClick={toggleDarkMode}>
        🌙
      </button>
    </header>
  );
};

export default Header;
