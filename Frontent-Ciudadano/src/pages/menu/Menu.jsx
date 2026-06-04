import "./Menu.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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
    const [openMenu, setOpenMenu] = useState(false);
  return (
    <main className="menu-container">

      {/* Header */}
      <header className="top-header">
        <button
            className="icon-button"
            onClick={() => setOpenMenu(true)}
        >
           <Menu size={32} />
        </button>

        <button className="icon-button">
          <Bell size={30} />
        </button>

      </header>

            {
        openMenu && (
            <>
            <div
                className="sidebar-overlay"
                onClick={() => setOpenMenu(false)}
            ></div>

            <aside className="sidebar-menu">
              <section className="sidebar-top">
                <img
                  src="/Logo E.S.png"
                  alt="Entornos Seguros"
                  className="sidebar-logo"
                />
              </section>

              <section className="sidebar-items">
                <button
                  className="sidebar-item"
                  onClick={() => navigate("/mapa-cai")}
                >
                  <MapPinned size={24} />
                  Mapa de los CAI
                </button>               

                <button className="sidebar-item" onClick={() => navigate("/tipos-reporte")}>
                  <FileText size={24} />
                  Generar Reportes
                </button>

                <button className="sidebar-item" onClick={() => navigate("/mis-reportes")}>
                  <ClipboardList size={24} />
                  Mis Reportes
                </button>

                <button className="sidebar-item" onClick={() => navigate("/perfil")}>
                  <User size={24} />
                  Perfil
                </button>

              </section>           

              <button className="logout-button" onClick={() => navigate("/")}>
                Cerrar sesión
              </button>
            </aside>
            </>
        )
        }

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

        <button
          className="menu-card"
          onClick={() => navigate("/mapa-cai")}
        >
          <MapPinned size={70} />
          <span>Mapa de los CAI</span>
        </button>  

        <button
            className="menu-card"
            onClick={() => navigate("/tipos-reporte")}
        >
            <FileText size={70} />
            <span>Generar Reportes</span>
        </button>

        <button
            className="menu-card"
            onClick={() => navigate("/mis-reportes")}
        >
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