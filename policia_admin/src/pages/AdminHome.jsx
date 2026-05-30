import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroBanner from "../components/HeroBanner";
import ActionCard from "../components/ActionCard";
import StatsPanel from "../components/StatsPanel";
import NewsVideoSection from "../components/NewsVideoSection";

import bannerImage from "../assets/banner-police.png";

import "../styles/admin-home.css";

const AdminHome = () => {
  const adminLinks = [
  { label: "Inicio", path: "/admin" },
  { label: "Crear usuario", path: "/admin/crear-usuario" },
  { label: "Gestión de usuario", path: "/admin/gestion-usuarios" },
  { label: "Incidentes", path: "/admin/incidentes" },
];

  return (
    <div className="admin-home">
      <Header navLinks={adminLinks} />

      <main className="admin-home__content">
        <HeroBanner
          title="Panel de administración"
          description="Gestiona usuarios, supervisa incidentes y consulta estadísticas generales del sistema."
          backgroundImage={bannerImage}
        />

        <section className="admin-home__main-grid">
          <div className="admin-home__left">
            <div className="admin-home__actions">
              <ActionCard
                title="Crear usuario"
                icon="👤"
                description="Registra nuevos usuarios para el sistema Entornos Seguros."
                link="/admin/crear-usuario"
              />

              <ActionCard
                title="Gestión de usuario"
                icon="📋"
                description="Consulta, administra y actualiza usuarios registrados."
                link="/admin/gestion-usuarios"
              />
            </div>

            <NewsVideoSection />
          </div>

          <StatsPanel />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AdminHome;