import { useState } from "react";
import { useNavigate } from "react-router-dom";
import reportsData from "../data/reportsData";

/*
  AdminIncidentsPanel:
  Muestra la relación entre reportes ciudadanos e informes oficiales policiales.
*/

const AdminIncidentsPanel = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("Todos");

  const policeReports = JSON.parse(localStorage.getItem("policeReports")) || [];

  const incidents = reportsData.map((userReport) => {
    const policeReport = policeReports.find(
      (report) => report.userReportId === userReport.id,
    );

    return {
      ...userReport,
      policeReport,
      finalStatus: policeReport ? "atendido" : userReport.status,
    };
  });

  const filteredIncidents =
    statusFilter === "Todos"
      ? incidents
      : incidents.filter((incident) => incident.finalStatus === statusFilter);

  return (
    <section className="admin-incidents-panel">
      <h1 className="admin-incidents-panel__title">Gestión de incidentes</h1>

      <p className="admin-incidents-panel__description">
        Consulta los reportes ciudadanos y verifica si cuentan con informe
        oficial generado por el policía responsable.
      </p>

      <div className="admin-incidents-panel__toolbar">
        <select
          className="admin-incidents-panel__filter"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="Todos">Todos</option>
          <option value="pendiente">Pendientes</option>
          <option value="atendido">Atendidos</option>
        </select>
      </div>

      <div className="admin-incidents-panel__list">
        {filteredIncidents.map((incident) => (
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
            </div>

            <div className="admin-incident-card__official">
              {incident.policeReport ? (
                <>
                  <p>
                    <strong>Policía:</strong> {incident.policeReport.policeName}
                  </p>

                  <p>
                    <strong>Placa:</strong> {incident.policeReport.badgeNumber}
                  </p>

                  <p>
                    <strong>Atendido:</strong>{" "}
                    {new Date(incident.policeReport.createdAt).toLocaleString()}
                  </p>

                  <p>
                    <strong>Acciones:</strong>{" "}
                    {incident.policeReport.actionsTaken}
                  </p>
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
    </section>
  );
};

export default AdminIncidentsPanel;
