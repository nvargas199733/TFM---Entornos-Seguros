import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import OfficialReportForm from "../components/OfficialReportForm";
import ConfirmModal from "../components/ConfirmModal";
import currentPoliceData from "../data/currentPoliceData";
import {
  fetchIncidentById,
  finalizePoliceAttention,
  resolveIncidentStatusId,
} from "../services/policeApi";

import policeVideo from "../assets/policia.mp4";

import "../styles/create-police-report.css";

const CreatePoliceReport = () => {
  const { id } = useParams();

  const navigate = useNavigate();

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

  useEffect(() => {
    let active = true;

    const loadIncident = async () => {
      try {
        setLoading(true);
        setError("");

        const incident = await fetchIncidentById(Number(id));

        if (active) {
          setUserReport(incident);
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
  }, [id]);

  /*
    Guardar informe oficial.
  */
  const handleSubmit = (event) => {
    event.preventDefault();

    setIsCloseModalOpen(true);
  };

  const confirmCloseIncident = () => {
    const finalize = async () => {
      try {
        const attendedStatusId = await resolveIncidentStatusId("ATENDIDO");

        await finalizePoliceAttention({
          idIncidente: userReport.id,
          idUsuarioPolicia: currentPoliceData.id,
          huboHeridos: hasInjured === "Sí",
          descripcionAtencion: `Descripcion oficial: ${officialDescription}\n\nAcciones tomadas: ${actionsTaken}`,
          idEstadoAtendido: attendedStatusId,
          idEstadoResponsable: currentPoliceData.id,
          observacion: "Informe policial registrado desde frontend policial",
        });

        setIsCloseModalOpen(false);
        navigate("/reportes");
      } catch (saveError) {
        setError(saveError.message || "No se pudo guardar el informe policial");
      }
    };

    finalize();
  };

  const displayReport = useMemo(() => userReport, [userReport]);

  /*
    Validación.
  */
  if (loading) {
    return <p>Buscando incidente...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!displayReport) {
    return <p>Reporte no encontrado.</p>;
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
          currentPoliceData={currentPoliceData}
          officialDescription={officialDescription}
          setOfficialDescription={setOfficialDescription}
          actionsTaken={actionsTaken}
          setActionsTaken={setActionsTaken}
          hasInjured={hasInjured}
          setHasInjured={setHasInjured}
          handleSubmit={handleSubmit}
        />
      </main>

      <Footer />
    </div>
  );
};

export default CreatePoliceReport;
