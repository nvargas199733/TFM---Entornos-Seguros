import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import OfficialReportForm from "../components/OfficialReportForm";
import ConfirmModal from "../components/ConfirmModal";
import {
  createPoliceReport,
  fetchIncidentById,
  fetchPoliceReportsByIncident,
  resolveIncidentStatusId,
  updateIncidentStatus,
} from "../services/policeApi";
import { getSession } from "../services/authService";

import policeVideo from "../assets/policia.mp4";

import "../styles/create-police-report.css";

function buildStatusObservation(report) {
  return Number.isInteger(Number(report?.id))
    ? `Atención policial finalizada. Informe oficial #${Number(report.id)} registrado.`
    : "Atención policial finalizada e informe oficial registrado.";
}

const CreatePoliceReport = () => {
  const { id } = useParams();
  const incidentId = Number(id);

  const navigate = useNavigate();
  const policeUser = getSession()?.user;

  /*
    Estados del formulario.
  */
  const [officialDescription, setOfficialDescription] = useState("");

  const [actionsTaken, setActionsTaken] = useState("");

  const [hasInjured, setHasInjured] = useState("No");
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [userReport, setUserReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createdReport, setCreatedReport] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    if (!Number.isInteger(incidentId) || incidentId <= 0) {
      setError("El incidente solicitado no existe.");
      setLoading(false);
      return () => {
        active = false;
      };
    }

    const loadIncident = async () => {
      try {
        setLoading(true);
        setError("");

        const incident = await fetchIncidentById(incidentId);
        const existingReports = await fetchPoliceReportsByIncident(incidentId);

        if (active) {
          setUserReport(incident);
          if (existingReports.length > 0) {
            setCreatedReport(existingReports[0]);
            setError("Ya existe un informe policial para este incidente.");
          }
        }
      } catch (loadError) {
        if (active) {
          setError(loadError.message || "No se pudo cargar el incidente");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadIncident();

    return () => {
      active = false;
    };
  }, [incidentId]);

  /*
    Guardar informe oficial.
  */
  const handleSubmit = (event) => {
    event.preventDefault();

    setIsCloseModalOpen(true);
  };

  const confirmCloseIncident = async () => {
    if (submitting || !userReport || !policeUser?.id) {
      return;
    }

    let reportCreatedThisAttempt = false;

    try {
      setSubmitting(true);
      setError("");

      const attendedStatusId = await resolveIncidentStatusId("ATENDIDO");
      let report = createdReport;

      if (!report) {
        report = await createPoliceReport({
          idIncidente: userReport.id,
          idUsuarioPolicia: Number(policeUser.id),
          huboHeridos: hasInjured === "Sí",
          descripcionAtencion: `Descripción oficial: ${officialDescription}\n\nAcciones tomadas: ${actionsTaken}`,
        });
        reportCreatedThisAttempt = true;
        setCreatedReport(report);
      }

      await updateIncidentStatus(userReport.id, {
        idEstadoIncidente: attendedStatusId,
        idUsuarioResponsable: Number(policeUser.id),
        observacion: buildStatusObservation(report),
      });

      setIsCloseModalOpen(false);
      navigate("/reportes");
    } catch (saveError) {
      const status = saveError?.status;

      if (status === 400) {
        setError("Revisa la información del informe.");
      } else if (status === 401) {
        setError("Tu sesión expiró. Inicia sesión nuevamente.");
      } else if (status === 403) {
        setError("No tienes permiso para realizar esta operación.");
      } else if (status === 404) {
        setError("El incidente solicitado no existe.");
      } else if (status === 409) {
        setError("Ya existe un informe policial para este incidente.");
      } else if (status === 415) {
        setError("El formato enviado al servicio de informes no es válido.");
      } else if (status === 0) {
        setError("No fue posible conectar con el servicio de informes.");
      } else {
        setError(createdReport || reportCreatedThisAttempt
          ? "El informe fue registrado, pero no fue posible actualizar el estado del incidente."
          : "Ocurrió un error al registrar el informe.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const displayReport = useMemo(() => userReport, [userReport]);

  /*
    Validación.
  */
  if (loading) {
    return <p>Buscando incidente...</p>;
  }

  if (error && !userReport) {
    return <p>{error}</p>;
  }

  if (!displayReport) {
    return <p>Reporte no encontrado.</p>;
  }

  if (!policeUser) {
    return <p>Tu sesión expiró. Inicia sesión nuevamente.</p>;
  }

  return (
    <div className="create-police-report">
      <ConfirmModal
        isOpen={isCloseModalOpen}
        title="Confirmar cierre de incidente"
        message="¿Deseas finalizar este incidente? Al confirmar, se guardará el informe oficial y el reporte dejará de aparecer como pendiente."
        confirmText="Finalizar incidente"
        cancelText="Cancelar"
        onConfirm={confirmCloseIncident}
        onCancel={() => setIsCloseModalOpen(false)}
      />
      <Header />

      <main className="create-police-report__content">
        {/* Video fondo */}
        <video
          className="create-police-report__video"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={policeVideo} type="video/mp4" />
        </video>

        {/* Overlay */}
        <div className="create-police-report__overlay"></div>

        {/* Formulario oficial */}
        <OfficialReportForm
          userReport={displayReport}
          policeUser={policeUser}
          officialDescription={officialDescription}
          setOfficialDescription={setOfficialDescription}
          actionsTaken={actionsTaken}
          setActionsTaken={setActionsTaken}
          hasInjured={hasInjured}
          setHasInjured={setHasInjured}
          handleSubmit={handleSubmit}
          submitting={submitting}
          error={error}
        />
      </main>

      <Footer />
    </div>
  );
};

export default CreatePoliceReport;
