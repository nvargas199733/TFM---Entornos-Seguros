/*
  ReportCard:
  Componente reutilizable para mostrar un reporte pendiente.

  Recibe:
  - report: información del incidente
  - onAttend: función que se ejecutará al presionar "Atender"
*/
import { Link } from "react-router-dom";
import {
  ShieldAlert,
  CarFront,
  Hammer,
  AlertTriangle,
  MapPin,
  Clock,
} from "lucide-react";

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

const getIncidentIcon = (type) => {
  switch (type) {
    case "Robo":
      return <ShieldAlert size={28} strokeWidth={2.3} />;

    case "Accidente":
      return <CarFront size={28} strokeWidth={2.3} />;

    case "Vandalismo":
      return <Hammer size={28} strokeWidth={2.3} />;

    default:
      return <AlertTriangle size={28} strokeWidth={2.3} />;
  }
};

const ReportCard = ({ report, onAttend }) => {
  const relativeTime = getRelativeTime(report.reportedAt);

  return (
    <article className="report-card">
      {/* Icono dinámico según tipo */}
      <div
        className={`report-card__icon report-card__icon--${report.type.toLowerCase()}`}
      >
        {getIncidentIcon(report.type)}
      </div>

      <div className="report-card__content">
        <h3 className="report-card__title">
          {report.type}: {report.description}
        </h3>

        <div className="report-card__details">
          <span className="report-card__detail">
            <MapPin size={14} />
            {report.location}
          </span>

          <span className="report-card__detail">
            <Clock size={14} />
            {relativeTime}
          </span>
        </div>
      </div>

      <Link className="report-card__button" to={`/reportes/${report.id}`}>
        Atender
      </Link>
    </article>
  );
};

export default ReportCard;