import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import OfficialReportForm from "../components/OfficialReportForm";
import ConfirmModal from "../components/ConfirmModal";
import reportsData from "../data/reportsData";
import currentPoliceData from "../data/currentPoliceData";

import policeVideo from "../assets/policia.mp4";

import "../styles/create-police-report.css";

const CreatePoliceReport = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  /*
    Buscamos el reporte ciudadano relacionado.
  */
  const userReport = reportsData.find((report) => report.id === Number(id));

  /*
    Estados del formulario.
  */
  const [officialDescription, setOfficialDescription] = useState("");

  const [actionsTaken, setActionsTaken] = useState("");

  const [hasInjured, setHasInjured] = useState("No");
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);

  /*
    Guardar informe oficial.
  */
  const handleSubmit = (event) => {
    event.preventDefault();

    setIsCloseModalOpen(true);
  };

  const confirmCloseIncident = () => {
    const newPoliceReport = {
      id: Date.now(),
      userReportId: userReport.id,
      policeId: currentPoliceData.id,
      policeName: `${currentPoliceData.names} ${currentPoliceData.lastNames}`,
      policeRank: currentPoliceData.rank,
      badgeNumber: currentPoliceData.badgeNumber,
      incidentType: userReport.type,
      hasInjured,
      officialDescription,
      actionsTaken,
      createdAt: new Date().toISOString(),
    };

    const savedReports =
      JSON.parse(localStorage.getItem("policeReports")) || [];

    localStorage.setItem(
      "policeReports",
      JSON.stringify([...savedReports, newPoliceReport]),
    );

    const attendedReports =
      JSON.parse(localStorage.getItem("attendedReports")) || [];

    localStorage.setItem(
      "attendedReports",
      JSON.stringify([...attendedReports, userReport.id]),
    );

    setIsCloseModalOpen(false);

    navigate("/reportes");
  };

  /*
    Validación.
  */
  if (!userReport) {
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
          userReport={userReport}
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
