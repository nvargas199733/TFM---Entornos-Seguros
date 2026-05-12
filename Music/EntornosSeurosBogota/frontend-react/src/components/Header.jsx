import "../styles/header.css";
// Componente Header
const Header = () => {
  return (
    <header className="header">

      {/* Logo y nombre */}
      <div className="header__brand">
        <span className="header__logo">🛡️</span>

        <h1 className="header__title">
          Entornos Seguros
        </h1>
      </div>

      {/* Navegación */}
      <nav className="header__nav">

        <a
          className="header__link header__link--active"
          href="#inicio"
        >
          Inicio
        </a>

        <a
          className="header__link"
          href="#mapa"
        >
          Ver Mapa
        </a>

        <a
          className="header__link"
          href="#reportes"
        >
          Reportes
        </a>
      </nav>

      {/* Botón usuario */}
      <button
        className="header__user-button"
        type="button"
      >
        👤
      </button>

    </header>
  );
};

export default Header;