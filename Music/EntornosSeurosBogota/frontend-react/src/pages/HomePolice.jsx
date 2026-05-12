import Header from "../components/Header";
import "../styles/home-police.css";
import ActionCard from "../components/ActionCard";

const HomePolice = () => {
  return (
    <div className="home-police">
      <Header />

      <main className="home-police__content">
        <section className="home-police__banner">
          <div>
            <h2 className="home-police__banner-title">
              Panel de gestión policial
            </h2>

            <p className="home-police__banner-text">
              Consulta incidentes, reportes y herramientas de apoyo para la
              gestión de seguridad ciudadana.
            </p>
          </div>
        </section>

        <section className="home-police__main-grid">
  <div className="home-police__actions">
    <ActionCard
      title="Ver Mapa"
      icon="🗺️"
      description="Consulta incidentes geolocalizados y zonas de atención prioritaria."
    />

    <ActionCard
      title="Reportes"
      icon="📋"
      description="Revisa informes, registros y seguimiento de incidentes comunitarios."
    />
  </div>
</section>

        
      </main>
    </div>
  );
};

export default HomePolice;