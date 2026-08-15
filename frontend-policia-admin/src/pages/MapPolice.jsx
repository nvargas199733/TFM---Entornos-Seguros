import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/map-police.css";

function MapPolice() {
  return (
    <div className="map-police">
      <Header />
      <main className="map-police__content">
        <section className="map-police__placeholder" aria-labelledby="map-police-title">
          <h1 id="map-police-title">Mapa operativo</h1>
          <p>El mapa operativo estará disponible próximamente.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default MapPolice;