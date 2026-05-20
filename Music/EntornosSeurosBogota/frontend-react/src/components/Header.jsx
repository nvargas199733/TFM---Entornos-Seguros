import "../styles/header.css";
import logo from "../assets/logo.jpg";
import { Link } from "react-router-dom";
// Componente Header
const Header = () => {
  return (
    <header className="header">
      {/* Logo y nombre */}
      <div className="header__brand">
        <img className="header__logo" src={logo} alt="Logo Entornos Seguros" />

        <h1 className="header__title">Entornos Seguros</h1>
      </div>

      {/* Navegación */}
      <nav className="header__nav">
        <Link className="header__link header__link--active" to="/">
          Inicio
        </Link>

        <Link className="header__link" to="/reportes">
          Reportes
        </Link>
      </nav>

      {/* Botón usuario */}
      <button className="header__user-button" type="button">
        👤
      </button>
    </header>
  );
};

export default Header;
