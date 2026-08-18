import "leaflet/dist/leaflet.css";
import "../styles/map-police.css";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { fetchIncidents } from "../services/policeApi";
import { getSession, clearSession } from "../services/authService";

/* ── Constantes geográficas (mismas que el mapa ciudadano) ──── */
const BOGOTA_CENTER = [4.6243, -74.0636];
const BOGOTA_BOUNDS = [
  [4.47, -74.25],
  [4.83, -74.0]
];
const BOGOTA_ZOOM_INITIAL = 12;
const BOGOTA_ZOOM_MIN = 11;
const BOGOTA_ZOOM_MAX = 18;

const STATUS_ALL  = "TODOS";
const TYPE_ALL    = "TODOS";
const PERIOD_ALL  = "TODOS";
const PERIOD_WEEK = "SEMANA";

/* ── Validación de coordenadas ───────────────────────────────── */
function isValidCoord(lat, lng) {
  const la = Number(lat);
  const lo = Number(lng);
  return (
    !Number.isNaN(la) &&
    !Number.isNaN(lo) &&
    la >= -90 && la <= 90 &&
    lo >= -180 && lo <= 180
  );
}

/* ── Verificación de pertenencia a Bogotá ────────────────────── */
function isWithinBogota(lat, lng) {
  const la = Number(lat);
  const lo = Number(lng);
  const [[swLat, swLng], [neLat, neLng]] = BOGOTA_BOUNDS;
  return la >= swLat && la <= neLat && lo >= swLng && lo <= neLng;
}

/* ── Semana actual: misma lógica que StatsPanel ──────────────── */
function isWithinLastSevenDays(dateString) {
  const reportDate = new Date(dateString);
  const today = new Date();
  const differenceDays = (today - reportDate) / (1000 * 60 * 60 * 24);
  return differenceDays <= 7;
}

/* ── Formateo de fecha ───────────────────────────────────────── */
function formatDate(dateString) {
  if (!dateString) return "Fecha no disponible";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Fecha no disponible";
  return date.toLocaleString("es-EC");
}

/* ── Icono por tipo de incidente ────────────────────────────── */
const INCIDENT_ICON_MAP = {
  "emergencia de seguridad": { symbol: "🛡️", cls: "incident-marker--emergency" },
  "robo a persona":          { symbol: "🚶", cls: "incident-marker--person"    },
  "robo de vehículo":        { symbol: "🚗", cls: "incident-marker--vehicle"   },
  "robo a casa":             { symbol: "🏠", cls: "incident-marker--house"     },
  "actividad sospechosa":    { symbol: "👁️", cls: "incident-marker--suspicious"},
};

function getIconConfig(tipoIncidente) {
  const key = String(tipoIncidente ?? "").toLowerCase().trim();
  return INCIDENT_ICON_MAP[key] ?? { symbol: "📍", cls: "incident-marker--unknown" };
}

function buildMarkerIcon(tipoIncidente, estadoIncidente) {
  const { symbol, cls } = getIconConfig(tipoIncidente);
  const statusCls =
    String(estadoIncidente ?? "").toUpperCase() === "ATENDIDO"
      ? "incident-marker--atendido"
      : "incident-marker--pendiente";

  return L.divIcon({
    className: `incident-marker ${cls} ${statusCls}`,
    html: `<span class="incident-marker__pin" aria-hidden="true">${symbol}</span>`,
    iconSize:    [38, 38],
    iconAnchor:  [19, 38],
    popupAnchor: [0, -36],
  });
}

/* ── Componente auxiliar: ajusta la vista a los marcadores ───── */
function BoundsController({ mappableIncidents }) {
  const map = useMap();

  useEffect(() => {
    if (mappableIncidents.length === 0) {
      /* Sin marcadores: volver al centro y zoom de respaldo de Bogotá */
      map.setView(BOGOTA_CENTER, BOGOTA_ZOOM_INITIAL);
      return;
    }

    if (mappableIncidents.length === 1) {
      const { latitud, longitud } = mappableIncidents[0];
      map.setView([Number(latitud), Number(longitud)], 14);
      return;
    }

    const bounds = L.latLngBounds(
      mappableIncidents.map(({ latitud, longitud }) => [Number(latitud), Number(longitud)])
    );
    /* Mismo padding que el ciudadano; maxZoom 16 para no acercarse en exceso */
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
  }, [map, mappableIncidents]);

  return null;
}

/* ── Popup del incidente ─────────────────────────────────────── */
function IncidentPopup({ incident, onNavigate }) {
  const location =
    incident.direccionReferencia && incident.direccionReferencia.trim()
      ? incident.direccionReferencia
      : `${Number(incident.latitud).toFixed(5)}, ${Number(incident.longitud).toFixed(5)}`;

  const desc = incident.description ?? "";
  const shortDesc = desc.length > 120 ? `${desc.slice(0, 120)}…` : desc;

  return (
    <article className="map-police__popup">
      <p className="map-police__popup-type">{incident.type}</p>

      <span
        className={`map-police__popup-badge ${
          String(incident.estadoIncidente ?? "").toUpperCase() === "ATENDIDO"
            ? "map-police__popup-badge--atendido"
            : "map-police__popup-badge--pendiente"
        }`}
      >
        {incident.estadoIncidente ?? "Desconocido"}
      </span>

      <p className="map-police__popup-date">{formatDate(incident.reportedAt)}</p>
      <p className="map-police__popup-location">{location}</p>

      {shortDesc && (
        <p className="map-police__popup-desc">{shortDesc}</p>
      )}

      <button
        type="button"
        className="map-police__popup-action"
        onClick={() => onNavigate(incident.id)}
      >
        Ver detalle
      </button>
    </article>
  );
}

/* ── Componente principal ────────────────────────────────────── */
function MapPolice() {
  const navigate = useNavigate();

  const [incidents,  setIncidents]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [statusFilter, setStatusFilter] = useState(STATUS_ALL);
  const [typeFilter,   setTypeFilter]   = useState(TYPE_ALL);
  const [periodFilter, setPeriodFilter] = useState(PERIOD_ALL);

  /* ── Carga única de incidentes ─── */
  useEffect(() => {
    const session = getSession();
    if (!session?.token) {
      setLoading(false);
      return;
    }

    let active = true;

    const loadIncidents = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await fetchIncidents();

        if (active) {
          setIncidents(Array.isArray(data) ? data : []);
        }
      } catch (loadError) {
        if (!active) return;

        const status = loadError?.status;

        if (status === 401) {
          clearSession();
          navigate("/login", { replace: true });
          return;
        }

        if (status === 403) {
          setError("No tienes permiso para consultar el mapa operativo.");
          return;
        }

        if (status === 500) {
          setError("Ocurrió un error al cargar el mapa operativo.");
          return;
        }

        if (loadError instanceof TypeError || status === 0) {
          setError("No fue posible conectar con el servicio de incidentes.");
          return;
        }

        setError("Ocurrió un error al cargar el mapa operativo.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadIncidents();

    return () => { active = false; };
  }, [navigate]);

  /* ── Clasificación por coordenadas y pertenencia a Bogotá ─── */
  const validIncidents = useMemo(
    () => incidents.filter((inc) => isValidCoord(inc.latitud, inc.longitud)),
    [incidents]
  );

  const bogotaIncidents = useMemo(
    () => validIncidents.filter((inc) => isWithinBogota(inc.latitud, inc.longitud)),
    [validIncidents]
  );

  const invalidCount      = incidents.length - validIncidents.length;
  const outsideBogotaCount = validIncidents.length - bogotaIncidents.length;

  /* ── Tipos únicos para selector ─── */
  const availableTypes = useMemo(() => {
    return Array.from(new Set(incidents.map((inc) => inc.type).filter(Boolean))).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [incidents]);

  /* ── Filtrado local (base: solo incidentes dentro de Bogotá) ─ */
  const filteredIncidents = useMemo(() => {
    return bogotaIncidents.filter((inc) => {
      if (statusFilter !== STATUS_ALL) {
        if (String(inc.estadoIncidente ?? "").toUpperCase() !== statusFilter) return false;
      }

      if (typeFilter !== TYPE_ALL) {
        if (inc.type !== typeFilter) return false;
      }

      if (periodFilter === PERIOD_WEEK) {
        if (!isWithinLastSevenDays(inc.reportedAt)) return false;
      }

      return true;
    });
  }, [bogotaIncidents, statusFilter, typeFilter, periodFilter]);

  /* ── Conteos derivados ─── */
  const pendingCount = useMemo(
    () => filteredIncidents.filter((inc) =>
      String(inc.estadoIncidente ?? "").toUpperCase() === "PENDIENTE"
    ).length,
    [filteredIncidents]
  );

  const attendedCount = useMemo(
    () => filteredIncidents.filter((inc) =>
      String(inc.estadoIncidente ?? "").toUpperCase() === "ATENDIDO"
    ).length,
    [filteredIncidents]
  );

  const hasActiveFilter = statusFilter !== STATUS_ALL || typeFilter !== TYPE_ALL || periodFilter !== PERIOD_ALL;

  function clearFilters() {
    setStatusFilter(STATUS_ALL);
    setTypeFilter(TYPE_ALL);
    setPeriodFilter(PERIOD_ALL);
  }

  function handleNavigateToDetail(incidentId) {
    navigate(`/reportes/${incidentId}`);
  }

  /* ── Render ─── */
  return (
    <div className="map-police">
      <Header />

      <main className="map-police__content">
        <div className="map-police__card">
          <header className="map-police__header">
            <h1 className="map-police__title">Mapa operativo</h1>
            <p className="map-police__subtitle">
              Visualiza y filtra incidentes reportados
            </p>
          </header>

          {/* ── Resumen ── */}
          {!loading && !error && (
            <div className="map-police__summary" aria-label="Resumen de incidentes">
              <div className="map-police__summary-item">
                <span className="map-police__summary-value">{filteredIncidents.length}</span>
                <span className="map-police__summary-label">Visibles</span>
              </div>
              <div className="map-police__summary-item map-police__summary-item--pending">
                <span className="map-police__summary-value">{pendingCount}</span>
                <span className="map-police__summary-label">Pendientes</span>
              </div>
              <div className="map-police__summary-item map-police__summary-item--attended">
                <span className="map-police__summary-value">{attendedCount}</span>
                <span className="map-police__summary-label">Atendidos</span>
              </div>
            </div>
          )}

          {/* ── Filtros ── */}
          {!loading && !error && (
            <div className="map-police__filters" role="group" aria-label="Filtros operativos">
              <div className="map-police__filter-group">
                <label htmlFor="filter-status" className="map-police__filter-label">
                  Estado
                </label>
                <select
                  id="filter-status"
                  className="map-police__filter-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value={STATUS_ALL}>Todos</option>
                  <option value="PENDIENTE">Pendientes</option>
                  <option value="ATENDIDO">Atendidos</option>
                </select>
              </div>

              <div className="map-police__filter-group">
                <label htmlFor="filter-type" className="map-police__filter-label">
                  Tipo
                </label>
                <select
                  id="filter-type"
                  className="map-police__filter-select"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value={TYPE_ALL}>Todos</option>
                  {availableTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="map-police__filter-group">
                <label htmlFor="filter-period" className="map-police__filter-label">
                  Periodo
                </label>
                <select
                  id="filter-period"
                  className="map-police__filter-select"
                  value={periodFilter}
                  onChange={(e) => setPeriodFilter(e.target.value)}
                >
                  <option value={PERIOD_ALL}>Todos</option>
                  <option value={PERIOD_WEEK}>Semana actual</option>
                </select>
              </div>

              {hasActiveFilter && (
                <button
                  type="button"
                  className="map-police__filter-clear"
                  onClick={clearFilters}
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          )}

          {/* ── Error de API (banda compacta; mapa permanece) ── */}
          {!loading && error && (
            <div className="map-police__error" role="alert">
              {error}
            </div>
          )}

          {/* ── Mapa (siempre renderizado) ── */}
          {!error && (
            <>
              <div className="map-police__map-wrapper">
                <MapContainer
                  center={BOGOTA_CENTER}
                  zoom={BOGOTA_ZOOM_INITIAL}
                  minZoom={BOGOTA_ZOOM_MIN}
                  maxZoom={BOGOTA_ZOOM_MAX}
                  maxBounds={BOGOTA_BOUNDS}
                  maxBoundsViscosity={1.0}
                  scrollWheelZoom
                  className="map-police__leaflet"
                >
                  <TileLayer
                    attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {!loading && (
                    <>
                      <BoundsController mappableIncidents={filteredIncidents} />

                      {filteredIncidents.map((incident) => (
                        <Marker
                          key={incident.id}
                          position={[Number(incident.latitud), Number(incident.longitud)]}
                          icon={buildMarkerIcon(incident.type, incident.estadoIncidente)}
                        >
                          <Popup maxWidth={260}>
                            <IncidentPopup
                              incident={incident}
                              onNavigate={handleNavigateToDetail}
                            />
                          </Popup>
                        </Marker>
                      ))}
                    </>
                  )}
                </MapContainer>

                {/* ── Overlay de carga ── */}
                {loading && (
                  <div className="map-police__map-overlay" role="status" aria-live="polite">
                    <span className="map-police__spinner" aria-hidden="true" />
                    <span>Cargando mapa e incidentes...</span>
                  </div>
                )}

                {/* ── Overlay de estado vacío ── */}
                {!loading && (() => {
                  if (incidents.length === 0) {
                    return (
                      <div className="map-police__map-overlay" role="status" aria-live="polite">
                        No hay incidentes disponibles para mostrar.
                      </div>
                    );
                  }
                  if (bogotaIncidents.length === 0) {
                    return (
                      <div className="map-police__map-overlay" role="status" aria-live="polite">
                        No hay incidentes ubicados en Bogotá.
                      </div>
                    );
                  }
                  if (filteredIncidents.length === 0) {
                    return (
                      <div className="map-police__map-overlay" role="status" aria-live="polite">
                        No hay incidentes que coincidan con los filtros actuales.
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>

              {/* ── Coordenadas inválidas ── */}
              {invalidCount > 0 && (
                <p className="map-police__invalid-notice" role="note">
                  {invalidCount === 1
                    ? "1 incidente no tiene una ubicación válida."
                    : `${invalidCount} incidentes no tienen una ubicación válida.`}
                </p>
              )}

              {/* ── Incidentes fuera de Bogotá ── */}
              {outsideBogotaCount > 0 && (
                <p className="map-police__outside-notice" role="note">
                  {outsideBogotaCount === 1
                    ? "1 incidente fue excluido porque está fuera del área de Bogotá."
                    : `${outsideBogotaCount} incidentes fueron excluidos porque están fuera del área de Bogotá.`}
                </p>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default MapPolice;

/*
 * Siguiente iteración (CAI):
 * - Añadir toggle de capa CAI sobre el mapa.
 * - Consumir GET /api/v1/cai para marcadores secundarios.
 * - Mostrar CAI más cercano al incidente seleccionado en el popup.
 */