import "./Menu.css";
import { useNavigate } from "react-router-dom";

import {
  Menu,
  Bell,
  MapPinned,
  FileText,
  ClipboardList,
  User
} from "lucide-react";

function MenuPage() {
    const navigate = useNavigate();
  return (
    <main className="menu-container">

      {/* Header */}
      <header className="top-header">

        <button className="icon-button">
          <Menu size={32} />
        </button>

        <button className="icon-button">
          <Bell size={30} />
        </button>

      </header>

      {/* Logo */}
      <section className="logo-section">

        <img
          src="/Logo E.S.png"
          alt="Entornos Seguros"
          className="menu-logo"
        />

      </section>

      {/* Grid botones */}
      <section className="menu-grid">

        <button className="menu-card">
          <MapPinned size={70} />
          <span>Mapa de los CAI</span>
        </button>

        <button className="menu-card">
          <FileText size={70} />
          <span>Generar Reportes</span>
        </button>

        <button className="menu-card">
          <ClipboardList size={70} />
          <span>Mis Reportes</span>
        </button>

        <button
        className="menu-card"
        onClick={() => navigate("/perfil")}
        >
        <User size={70} />
        <span>Perfil</span>
        </button>

      </section>

    </main>
  );
}

export default MenuPage;