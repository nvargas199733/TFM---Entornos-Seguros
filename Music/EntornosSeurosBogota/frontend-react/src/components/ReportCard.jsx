/*
  ReportCard:
  Componente reutilizable para mostrar un reporte pendiente.

  Recibe:
  - report: información del incidente
  - onAttend: función que se ejecutará al presionar "Atender"
*/
import { Link } from "react-router-dom";

const getRelativeTime = (dateString) => {
  const reportDate = new Date(dateString);

  const now = new Date();

  const differenceMinutes = Math.floor((now - reportDate) / (1000 * 60));

  if (differenceMinutes < 60) {
    return `Hace ${differenceMinutes} min.`;
  }

  const differenceHours = Math.floor(differenceMinutes / 60);

  if (differenceHours < 24) {
    return `Hace ${differenceHours} hora${differenceHours > 1 ? "s" : ""}.`;
  }

  const differenceDays = Math.floor(differenceHours / 24);

  return `Hace ${differenceDays} día${differenceDays > 1 ? "s" : ""}.`;
};

const incidentIcons = {
  Robo: "🚨",
  Accidente: "🚗",
  Vandalismo: "🧱",
};

const ReportCard = ({ report, onAttend }) => {
  const relativeTime = getRelativeTime(report.reportedAt);
  const icon = incidentIcons[report.type] || "⚠️";

  return (
    <article className="report-card">
      {/* Ícono dinámico según el tipo de incidente */}
      <div className="report-card__icon">{icon}</div>

      <div className="report-card__content">
        <h3 className="report-card__title">
          {report.type}: {report.description}
        </h3>

        <div className="report-card__details">
          <span>📍 {report.location}</span>
          <span>🕒 {relativeTime}</span>
        </div>
      </div>

      <Link className="report-card__button" to={`/reportes/${report.id}`}>
        Atender
      </Link>
    </article>
  );
};

export default ReportCard;
