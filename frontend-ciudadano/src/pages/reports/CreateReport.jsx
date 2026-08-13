import "./CreateReport.css";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Camera, Image, MapPin, ShieldAlert } from "lucide-react";
import { clearSession } from "../../services/authService";
import { createIncident, getCurrentSessionUser } from "../../services/reportService";

function CreateReport() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getCurrentSessionUser();
  const selectedIncidentType = location.state?.incidentType || null;

  const [description, setDescription] = useState("");
  const [locationReference, setLocationReference] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [evidenceName, setEvidenceName] = useState("");

  useEffect(() => {
    if (!selectedIncidentType || !Number.isInteger(Number(selectedIncidentType.idTipoIncidente))) {
      navigate("/tipos-reporte", { replace: true });
    }
  }, [navigate, selectedIncidentType]);

  const counter = `${description.length}/1000`;

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setSubmitError("Tu navegador no soporta geolocalización.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLatitude = Number(position.coords.latitude);
        const currentLongitude = Number(position.coords.longitude);

        setLatitude(currentLatitude);
        setLongitude(currentLongitude);
        setLocationReference(`Lat ${currentLatitude.toFixed(6)}, Lon ${currentLongitude.toFixed(6)}`);
        setSubmitError("");
      },
      () => {
        setSubmitError("No se pudo obtener la ubicación actual.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userId = currentUser?.id;

    if (!userId && userId !== 0) {
      clearSession();
      navigate("/login");
      return;
    }

    if (!selectedIncidentType || !Number.isInteger(Number(selectedIncidentType.idTipoIncidente))) {
      navigate("/tipos-reporte");
      return;
    }

    if (!description.trim()) {
      setSubmitError("Escribe una descripción del incidente.");
      return;
    }

    if (
      latitude === null ||
      longitude === null ||
      !Number.isFinite(Number(latitude)) ||
      !Number.isFinite(Number(longitude)) ||
      Number(latitude) < -90 ||
      Number(latitude) > 90 ||
      Number(longitude) < -180 ||
      Number(longitude) > 180
    ) {
      setSubmitError("Debes indicar una ubicación válida para registrar el incidente.");
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError("");

      await createIncident({
        idUsuario: Number(userId),
        idTipoIncidente: Number(selectedIncidentType.idTipoIncidente),
        descripcion: description.trim(),
        latitud: Number(latitude),
        longitud: Number(longitude),
        direccionReferencia: locationReference.trim() || null
      });

      navigate("/mis-reportes");
    } catch (submitErrorObject) {
      const status = submitErrorObject?.status;
      const normalizedMessage = submitErrorObject?.message || "Ocurrió un error al registrar el reporte.";

      if (status === 401) {
        clearSession();
        navigate("/login");
        return;
      }

      if (status === 403) {
        setSubmitError("No tienes permiso para realizar esta operación.");
        return;
      }

      if (status === 400) {
        setSubmitError("Revisa los datos ingresados e intenta nuevamente.");
        return;
      }

      if (status === 500) {
        setSubmitError("Ocurrió un error al registrar el reporte.");
        return;
      }

      if (status === 0) {
        setSubmitError("No fue posible conectar con el servicio de reportes.");
        return;
      }

      if (normalizedMessage.includes("ya no está disponible") || normalizedMessage.includes("no existe")) {
        setSubmitError("El tipo de incidente seleccionado ya no está disponible.");
        return;
      }

      if (normalizedMessage.includes("error al registrar")) {
        setSubmitError("Ocurrió un error al registrar el reporte.");
        return;
      }

      setSubmitError(normalizedMessage || "Ocurrió un error al registrar el reporte.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAttachEvidenceFromUrl = () => {
    const url = window.prompt("Pega la URL pública de la imagen de evidencia:", evidenceUrl);
    if (!url) return;

    const trimmedUrl = url.trim();

    try {
      const parsed = new URL(trimmedUrl);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        throw new Error("URL no soportada");
      }
    } catch {
      setSubmitError("La URL de evidencia no es válida.");
      return;
    }

    const suggestedName = trimmedUrl.split("/").pop() || "evidencia-ciudadana";

    setEvidenceUrl(trimmedUrl);
    setEvidenceName(suggestedName);
    setSubmitError("");
  };

  if (!selectedIncidentType || !Number.isInteger(Number(selectedIncidentType.idTipoIncidente))) {
    return null;
  }

  return (
    <main className="create-report-container">
      <section className="create-report-card">
        <header className="report-header">
          <button className="report-icon-button" onClick={() => navigate("/menu")} type="button" aria-label="Volver al menú">
            <ArrowLeft size={28} />
          </button>

          <h1>Generar Reporte</h1>

          <button className="report-icon-button" type="button" aria-label="Enviar reporte">
            <Send size={28} />
          </button>
        </header>

        <section className="selected-report-icon-section">
          <div className="selected-report-icon blue">
            <ShieldAlert size={42} />
          </div>
        </section>

        <form className="report-content" onSubmit={handleSubmit}>
          <div className="selected-type-readonly">
            <span className="report-label">Tipo de incidente</span>
            <strong>{selectedIncidentType.nombre}</strong>
            {selectedIncidentType.descripcion && <p>{selectedIncidentType.descripcion}</p>}
            <button
              type="button"
              className="report-change-type"
              onClick={() => navigate("/tipos-reporte")}
            >
              Cambiar tipo
            </button>
          </div>

          <label className="report-label" htmlFor="description">Descripción / Detalle</label>
          <textarea
            id="description"
            className="report-textarea"
            placeholder="Escribe aquí lo que está sucediendo..."
            maxLength="1000"
            required
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          <p className="counter">{counter}</p>

          <label className="report-label" htmlFor="locationReference">Referencia de ubicación</label>
          <input
            id="locationReference"
            className="report-textarea"
            style={{ minHeight: 48, padding: "0 16px" }}
            type="text"
            placeholder="Av., barrio, punto de referencia o coordenadas"
            value={locationReference}
            onChange={(event) => setLocationReference(event.target.value)}
          />

          {currentUser && (
            <p className="counter" style={{ marginTop: 8 }}>
              Reportando como {currentUser.fullName || currentUser.email}
            </p>
          )}

          {submitError && <p className="counter">{submitError}</p>}

          <h2 className="evidence-title">Agregar evidencia</h2>

          <section className="evidence-buttons">
            <button type="button" className="evidence-option" disabled>
              <Camera size={34} />
              <span>Tomar Foto</span>
            </button>

            <button type="button" className="evidence-option" onClick={handleAttachEvidenceFromUrl}>
              <Image size={34} />
              <span>{evidenceUrl ? "Imagen vinculada" : "Agregar Imagen"}</span>
            </button>

            <button type="button" className="evidence-option" onClick={handleUseCurrentLocation}>
              <MapPin size={34} />
              <span>Ubicación Actual</span>
            </button>
          </section>

          {evidenceUrl && (
            <p className="counter" style={{ marginTop: 8 }}>
              Evidencia lista: {evidenceName}
            </p>
          )}

          <section className="map-preview">
            <div className="map-circle"></div>
            <div className="map-point"></div>
          </section>

          <section className="location-card">
            <MapPin size={24} />
            <div>
              <strong>Ubicación actual</strong>
              <p>{locationReference || "Sin ubicación capturada aún"}</p>
            </div>
          </section>

          <button
            className="send-report-button"
            type="submit"
            disabled={submitting}
          >
            <Send size={26} />
            {submitting ? "Enviando reporte..." : "Enviar Reporte"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default CreateReport;