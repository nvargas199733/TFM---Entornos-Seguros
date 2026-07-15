import "./CreateReport.css";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  Camera,
  Image,
  MapPin,
  ShieldAlert,
  PersonStanding,
  Car,
  House,
  UserSearch
} from "lucide-react";
import {
  createIncident,
  getCurrentSessionUser,
  resolveIncidentTypeId
} from "../../services/reportService";

function CreateReport() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedReport = location.state || {
    title: "Generar Reporte",
    color: "blue"
  };

  const [description, setDescription] = useState("");
  const [locationReference, setLocationReference] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [typeId, setTypeId] = useState(null);
  const [isLoadingType, setIsLoadingType] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const currentUser = useMemo(() => getCurrentSessionUser(), []);

  useEffect(() => {
    let active = true;

    const loadType = async () => {
      try {
        setIsLoadingType(true);
        setError("");

        const incidentTypeId = await resolveIncidentTypeId(selectedReport.title);

        if (active) {
          setTypeId(incidentTypeId);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError.message || "No se pudo resolver el tipo de reporte");
        }
      } finally {
        if (active) {
          setIsLoadingType(false);
        }
      }
    };

    if (selectedReport.title !== "Generar Reporte") {
      loadType();
    } else {
      setIsLoadingType(false);
    }

    return () => {
      active = false;
    };
  }, [selectedReport.title]);

  const counter = `${description.length}/1000`;

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Tu navegador no soporta geolocalización");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: currentLatitude, longitude: currentLongitude } = position.coords;
        setLatitude(currentLatitude);
        setLongitude(currentLongitude);
        setLocationReference(
          `Lat ${currentLatitude.toFixed(6)}, Lon ${currentLongitude.toFixed(6)}`
        );
        setError("");
      },
      () => {
        setError("No se pudo obtener la ubicación actual");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      setError("Debes iniciar sesión para crear un reporte");
      return;
    }

    if (!typeId) {
      setError("No se pudo identificar el tipo de reporte");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");

      await createIncident({
        idUsuario: currentUser.id,
        idTipoIncidente: typeId,
        descripcion: description.trim(),
        latitud: latitude,
        longitud: longitude,
        direccionReferencia: locationReference.trim() || null
      });

      setSuccess("Reporte enviado correctamente");
      navigate("/mis-reportes");
    } catch (submitError) {
      setError(submitError.message || "No se pudo enviar el reporte");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="create-report-container">
      <section className="create-report-card">
        <header className="report-header">
          <button className="report-icon-button" onClick={() => navigate("/menu")}>
            <ArrowLeft size={28} />
          </button>

          <h1>{selectedReport.title}</h1>

          <button className="report-icon-button">
            <Send size={28} />
          </button>
        </header>

        <section className="selected-report-icon-section">
          <div className={`selected-report-icon ${selectedReport.color}`}>
            {selectedReport.title === "Emergencia de Seguridad" && <ShieldAlert size={42} />}
            {selectedReport.title === "Robo a persona" && <PersonStanding size={42} />}
            {selectedReport.title === "Robo de vehículo" && <Car size={42} />}
            {selectedReport.title === "Robo a casa" && <House size={42} />}
            {selectedReport.title === "Actividad sospechosa" && <UserSearch size={42} />}
          </div>
        </section>
        
        <section className="report-content">
          <label className="report-label">Descripción / Detalle</label>

          <textarea
            className="report-textarea"
            placeholder="Escribe aquí lo que está sucediendo..."
            maxLength="1000"
            required
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          <p className="counter">{counter}</p>

          <label className="report-label">Referencia de ubicación</label>
          <input
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

          {isLoadingType && <p className="counter">Cargando tipo de reporte...</p>}
          {error && <p className="counter">{error}</p>}
          {success && <p className="counter">{success}</p>}

          <h2 className="evidence-title">Agregar evidencia</h2>

          <section className="evidence-buttons">
            <button type="button" className="evidence-option" disabled>
              <Camera size={34} />
              <span>Tomar Foto</span>
            </button>

            <button type="button" className="evidence-option" disabled>
              <Image size={34} />
              <span>Agregar Imagen</span>
            </button>

            <button type="button" className="evidence-option" onClick={handleUseCurrentLocation}>
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
              <p>{locationReference || "Sin ubicación capturada aún"}</p>
            </div>
          </section>

          <button
            className="send-report-button"
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || isLoadingType}
          >
            <Send size={26} />
            {isSubmitting ? "Enviando..." : "Enviar Reporte"}
          </button>
        </section>
      </section>
    </main>
  );
}

export default CreateReport;