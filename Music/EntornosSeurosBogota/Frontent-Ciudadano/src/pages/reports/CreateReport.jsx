import "./CreateReport.css";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  Camera,
  Image,
  MapPin
} from "lucide-react";

function CreateReport() {
  const navigate = useNavigate();

  return (
    <main className="create-report-container">
      <section className="create-report-card">
        <header className="report-header">
          <button className="report-icon-button" onClick={() => navigate("/menu")}>
            <ArrowLeft size={28} />
          </button>

          <h1>Generar Reporte</h1>

          <button className="report-icon-button">
            <Send size={28} />
          </button>
        </header>

        <section className="report-content">
          <label className="report-label">Descripción / Detalle</label>

          <textarea
            className="report-textarea"
            placeholder="Escribe aquí lo que está sucediendo..."
            maxLength="1000"
            required
          />

          <p className="counter">0/1000</p>

          <h2 className="evidence-title">Evidencia</h2>

          <section className="evidence-buttons">
            <button type="button" className="evidence-option">
              <Camera size={34} />
              <span>Tomar Foto</span>
            </button>

            <button type="button" className="evidence-option">
              <Image size={34} />
              <span>Agregar Imagen</span>
            </button>

            <button type="button" className="evidence-option">
              <MapPin size={34} />
              <span>Ubicación Actual</span>
            </button>
          </section>

          <section className="map-preview">
            <div className="map-circle"></div>
            <div className="map-point"></div>
          </section>

          <section className="location-card">
            <MapPin size={24} />
            <div>
              <strong>Ubicación actual</strong>
              <p>Cra. 16 # 15-28, Centro, Bogotá, Colombia</p>
            </div>
          </section>

          <button className="send-report-button">
            <Send size={26} />
            Enviar Reporte
          </button>
        </section>
      </section>
    </main>
  );
}

export default CreateReport;