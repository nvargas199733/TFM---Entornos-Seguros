/*
  UserReportCard:
  Muestra el detalle del reporte ciudadano seleccionado.

  La información viene desde reportsData.js.
*/

import { useNavigate } from "react-router-dom";

const incidentIcons = {
  Robo: "🚨",
  Accidente: "🚗",
  Vandalismo: "🧱",
};

const UserReportCard = ({ report }) => {
  const navigate = useNavigate();
  const icon = incidentIcons[report.type] || "⚠️";

  return (
    <article className="user-report-card">
      <div className="user-report-card__header">
        <h2 className="user-report-card__title">Reporte de incidente</h2>
      </div>

      <section className="user-report-card__section">
        <h3>Datos del reportante</h3>
        <p>👤 {report.reporterName}</p>
        <p>🪪 {report.identification}</p>
        <p>📞 {report.phone}</p>
      </section>

      <section className="user-report-card__section">
        <h3>Tipo de incidente</h3>
        <p>
          {icon} {report.type}
        </p>
      </section>

      <section className="user-report-card__section">
        <h3>Ubicación del incidente</h3>
        <p>📍 {report.location}</p>
      </section>

      <section className="user-report-card__section">
        <h3>Descripción</h3>
        <p>{report.description}</p>
      </section>

      <section className="user-report-card__section">
        <h3>Evidencia</h3>

        <img
          src={report.evidenceImage}
          alt={`Evidencia del incidente: ${report.type}`}
          className="user-report-card__evidence"
        />
      </section>

      <button
        className="user-report-card__button"
        type="button"
        onClick={() => navigate(`/reportes/${report.id}/generar-informe`)}
      >
        Generar informe
      </button>
    </article>
  );
};

export default UserReportCard;
