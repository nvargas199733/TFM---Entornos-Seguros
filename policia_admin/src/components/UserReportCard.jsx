/*
  UserReportCard:
  Muestra el detalle del reporte ciudadano seleccionado.

  La información viene desde reportsData.js.
*/

import { useNavigate } from "react-router-dom";
import {
  User,
  IdCard,
  Phone,
  CalendarDays,
  ShieldAlert,
  CarFront,
  Hammer,
  AlertTriangle,
  MapPin,
} from "lucide-react";

const getIncidentIcon = (type) => {
  switch (type) {
    case "Robo":
      return <ShieldAlert size={16} />;

    case "Accidente":
      return <CarFront size={16} />;

    case "Vandalismo":
      return <Hammer size={16} />;

    default:
      return <AlertTriangle size={16} />;
  }
};

const UserReportCard = ({ report, showGenerateButton = true }) => {
  const navigate = useNavigate();

  return (
    <article className="user-report-card">
      <div className="user-report-card__header">
        <h2 className="user-report-card__title">
          Reporte de incidente
        </h2>
      </div>

      <section className="user-report-card__section">
        <h3>Datos del reportante</h3>

        <p>
          <User size={15} />
          {report.reporterName}
        </p>

        <p>
          <IdCard size={15} />
          {report.identification}
        </p>

        <p>
          <Phone size={15} />
          {report.phone}
        </p>

        <p>
          <CalendarDays size={15} />
          {new Date(report.reportedAt).toLocaleString("es-EC")}
        </p>
      </section>

      <section className="user-report-card__section">
        <h3>Tipo de incidente</h3>

        <p>
          {getIncidentIcon(report.type)}
          {report.type}
        </p>
      </section>

      <section className="user-report-card__section">
        <h3>Ubicación del incidente</h3>

        <p>
          <MapPin size={15} />
          {report.location}
        </p>
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

      {showGenerateButton && (
        <button
          className="user-report-card__button"
          type="button"
          onClick={() =>
            navigate(`/reportes/${report.id}/generar-informe`)
          }
        >
          Generar informe
        </button>
      )}
    </article>
  );
};

export default UserReportCard;