/*
  UserReportCard:
  Muestra el detalle del reporte ciudadano seleccionado.

  La información viene desde reportsData.js.
*/

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  IdCard,
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

const UserReportCard = ({
  report,
  evidences = [],
  evidenceLoading = false,
  evidenceError = "",
  showGenerateButton = true
}) => {
  const navigate = useNavigate();
  const [failedEvidenceIds, setFailedEvidenceIds] = useState(new Set());

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

        {evidenceLoading ? (
          <p>Consultando evidencias...</p>
        ) : evidenceError ? (
          <p>{evidenceError}</p>
        ) : evidences.length === 0 ? (
          <p>No hay evidencia registrada para este incidente.</p>
        ) : (
          <div className="user-report-card__evidence-list">
            {evidences.map((evidence) => {
              const evidenceId = evidence.idEvidenciaIncidente;
              const imageFailed = failedEvidenceIds.has(evidenceId);

              return (
                <figure key={evidenceId} className="user-report-card__evidence-item">
                  {imageFailed ? (
                    <div className="user-report-card__evidence-unavailable">Imagen no disponible</div>
                  ) : (
                    <img
                      src={evidence.urlArchivo}
                      alt={evidence.nombreArchivo || "Evidencia del incidente"}
                      className="user-report-card__evidence"
                      loading="lazy"
                      onError={() => setFailedEvidenceIds((current) => new Set(current).add(evidenceId))}
                    />
                  )}
                  <figcaption>{evidence.nombreArchivo || "Evidencia remota"}</figcaption>
                  <a href={evidence.urlArchivo} target="_blank" rel="noopener noreferrer">Abrir evidencia</a>
                </figure>
              );
            })}
          </div>
        )}
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