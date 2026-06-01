import Header from "../components/Header";
import "../styles/home-police.css";
import ActionCard from "../components/ActionCard";
import StatsPanel from "../components/StatsPanel";
import bannerImage from "../assets/banner-police.png";
import NewsVideoSection from "../components/NewsVideoSection";
import Footer from "../components/Footer";
import HeroBanner from "../components/HeroBanner";


const HomePolice = () => {
  return (
    <div className="home-police">
      <Header />

      <main className="home-police__content">
        <HeroBanner
          title="Panel de gestión policial"
          description="Consulta incidentes, informes y herramientas de apoyo para la gestión de seguridad ciudadana."
          backgroundImage={bannerImage}
        />

        <section className="home-police__main-grid">
          {/* COLUMNA IZQUIERDA */}
          <div className="home-police__left">
            {/* TARJETAS PRINCIPALES */}
            <div className="home-police__actions">
              <ActionCard
                title="Ver Mapa"
                icon="🗺️"
                description="Consulta incidentes geolocalizados y zonas de atención prioritaria."
              />

              <ActionCard
                title="Informes"
                icon="📋"
                description="Revisa informes, registros y seguimiento de incidentes comunitarios."
                link="/reportes"
              />
            </div>
            
            <NewsVideoSection />
          </div>

          {/* PANEL DERECHO */}
          <StatsPanel />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePolice;
