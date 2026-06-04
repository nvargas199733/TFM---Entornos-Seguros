import { useParams } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import UserReportCard from "../components/UserReportCard";
import OfficialReportView from "../components/OfficialReportView";

import reportsData from "../data/reportsData";

import "../styles/admin-incident-detail.css";

const AdminIncidentDetail = () => {
  const { id } = useParams();

  const adminLinks = [
    { label: "Inicio", path: "/admin" },
    { label: "Crear usuario", path: "/admin/crear-usuario" },
    { label: "Gestión de usuarios", path: "/admin/gestion-usuarios" },
    { label: "Incidentes", path: "/admin/incidentes" },
  ];

  const userReport = reportsData.find((report) => report.id === Number(id));

  const policeReports = JSON.parse(localStorage.getItem("policeReports")) || [];

  const policeReport = policeReports.find(
    (report) => report.userReportId === Number(id),
  );

  if (!userReport) {
    return <p>Incidente no encontrado.</p>;
  }

  return (
    <div className="admin-incident-detail">
      <Header navLinks={adminLinks} />

      <main className="admin-incident-detail__content">
        <h1 className="admin-incident-detail__title">Detalle del incidente</h1>

        <section className="admin-incident-detail__grid">
          <UserReportCard report={userReport} showGenerateButton={false} />

          <OfficialReportView policeReport={policeReport} />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AdminIncidentDetail;
