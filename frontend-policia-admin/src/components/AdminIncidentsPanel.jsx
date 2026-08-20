import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "./Pagination";
import { fetchIncidents, fetchPoliceReportsByIncident } from "../services/policeApi";
/*
  AdminIncidentsPanel:
  Muestra la relación entre reportes ciudadanos e informes oficiales policiales.
*/

const AdminIncidentsPanel = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [timeFilter, setTimeFilter] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const incidentsPerPage = 5;

  useEffect(() => {
    let active = true;

    const loadIncidents = async () => {
      try {
        setLoading(true);
        setError("");

        const backendIncidents = await fetchIncidents();
        const incidentsWithReports = await Promise.all(
          backendIncidents.map(async (incident) => {
            const policeReports = await fetchPoliceReportsByIncident(incident.id);

            return {
              ...incident,
              policeReport: policeReports[0] || null,
              finalStatus: incident.status,
            };
          }),
        );

        if (active) {
          setIncidents(incidentsWithReports);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError.message || "No se pudieron cargar los incidentes");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadIncidents();

    return () => {
      active = false;
    };
  }, []);

  const now = new Date();

  const incidentsByStatus =
    statusFilter === "Todos"
      ? incidents
      : incidents.filter((incident) => incident.finalStatus === statusFilter);

  const incidentsByTime = incidentsByStatus.filter((incident) => {
    const reportDate = new Date(incident.reportedAt);
    const differenceHours = (now - reportDate) / (1000 * 60 * 60);

    if (timeFilter === "24h") return differenceHours <= 24;
    if (timeFilter === "semana") return differenceHours <= 24 * 7;
    if (timeFilter === "mes") return differenceHours <= 24 * 30;

    return true;
  });

  const filteredIncidents = [...incidentsByTime].sort(
    (a, b) => new Date(b.reportedAt) - new Date(a.reportedAt),
  );
  const totalPages = Math.ceil(filteredIncidents.length / incidentsPerPage);

  const startIndex = (currentPage - 1) * incidentsPerPage;

  const paginatedIncidents = filteredIncidents.slice(
    startIndex,
    startIndex + incidentsPerPage,
  );

  if (loading) {
    return <section className="admin-incidents-panel">Cargando incidentes...</section>;
  }

  if (error) {
    return <section className="admin-incidents-panel">{error}</section>;
  }

  return (
    <section className="admin-incidents-panel">
      <h1 className="admin-incidents-panel__title">Gestión de incidentes</h1>

      <p className="admin-incidents-panel__description">
        Consulta los reportes ciudadanos y verifica si cuentan con informe
        oficial generado por el policía responsable.
      </p>

      <div className="admin-incidents-panel__toolbar">
        <p className="admin-incidents-panel__count">
          {filteredIncidents.length} reportes encontrados
        </p>

        <select
          className="admin-incidents-panel__filter"
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="Todos">Todos</option>
          <option value="pendiente">Pendientes</option>
          <option value="atendido">Atendidos</option>
        </select>

        <select
          className="admin-incidents-panel__filter"
          value={timeFilter}
          onChange={(event) => {
            setTimeFilter(event.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="24h">Últimas 24 horas</option>
          <option value="semana">Última semana</option>
          <option value="mes">Último mes</option>
          <option value="todos">Todos</option>
        </select>
      </div>

      <div className="admin-incidents-panel__list">
        {paginatedIncidents.map((incident) => (
          <article className="admin-incident-card" key={incident.id}>
            <div>
              <span
                className={`admin-incident-card__status admin-incident-card__status--${incident.finalStatus}`}
              >
                {incident.finalStatus}
              </span>

              <h2 className="admin-incident-card__title">
                {incident.type} - {incident.location}
              </h2>

              <p className="admin-incident-card__text">
                <strong>Reporte ciudadano:</strong> {incident.description}
              </p>

              <p className="admin-incident-card__text">
                <strong>Reportado por:</strong> {incident.reporterName}
              </p>
              <p className="admin-incident-card__text">
                <strong>Fecha del reporte:</strong>{" "}
                {new Date(incident.reportedAt).toLocaleString("es-EC")}
              </p>
            </div>

            <div className="admin-incident-card__official">
              {incident.policeReport ? (
                <>
                  <p>
                    <strong>Atendido:</strong>{" "}
                    {new Date(incident.policeReport.createdAt).toLocaleString("es-EC")}
                  </p>

                  <p>
                    <strong>¿Heridos?:</strong>{" "}
                    {incident.policeReport.huboHeridos}
                  </p>

                  {incident.policeReport.officialDescription && (
                    <p>
                      <strong>Descripción:</strong>{" "}
                      {incident.policeReport.officialDescription.length > 120
                        ? `${incident.policeReport.officialDescription.slice(0, 120).trimEnd()}…`
                        : incident.policeReport.officialDescription}
                    </p>
                  )}

                  {!incident.policeReport.officialDescription &&
                    incident.policeReport.actionsTaken && (
                      <p>
                        <strong>Acciones:</strong>{" "}
                        {incident.policeReport.actionsTaken.length > 120
                          ? `${incident.policeReport.actionsTaken.slice(0, 120).trimEnd()}…`
                          : incident.policeReport.actionsTaken}
                      </p>
                    )}
                </>
              ) : (
                <p className="admin-incident-card__pending">
                  Sin informe policial generado.
                </p>
              )}
            </div>
            <button
              type="button"
              className="admin-incident-card__detail-button"
              onClick={() => navigate(`/admin/incidentes/${incident.id}`)}
            >
              Ver detalle
            </button>
          </article>
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(newPage) => {
          setCurrentPage(newPage);
        }}
      />
    </section>
  );
};

export default AdminIncidentsPanel;
