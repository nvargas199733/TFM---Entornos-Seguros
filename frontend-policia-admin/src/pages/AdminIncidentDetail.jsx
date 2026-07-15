import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import UserReportCard from "../components/UserReportCard";
import OfficialReportView from "../components/OfficialReportView";
import currentPoliceData from "../data/currentPoliceData";
import { fetchIncidentById, fetchPoliceReportsByIncident } from "../services/policeApi";

import "../styles/admin-incident-detail.css";

const AdminIncidentDetail = () => {
  const { id } = useParams();

  const adminLinks = [
    { label: "Inicio", path: "/admin" },
    { label: "Crear usuario", path: "/admin/crear-usuario" },
    { label: "Gestión de usuarios", path: "/admin/gestion-usuarios" },
    { label: "Incidentes", path: "/admin/incidentes" },
  ];

  const [userReport, setUserReport] = useState(null);
  const [policeReport, setPoliceReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadDetail = async () => {
      try {
        setLoading(true);
        setError("");

        const incident = await fetchIncidentById(Number(id));
        const policeReports = await fetchPoliceReportsByIncident(Number(id));

        if (active) {
          setUserReport(incident);
          setPoliceReport(policeReports[0] || null);
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

    loadDetail();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <p>Cargando incidente...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!userReport) {
    return <p>Incidente no encontrado.</p>;
  }

  const policeReportView = policeReport
    ? {
        policeName: `${currentPoliceData.names} ${currentPoliceData.lastNames}`,
        policeRank: currentPoliceData.rank,
        badgeNumber: currentPoliceData.badgeNumber,
        incidentType: userReport.type,
        hasInjured: policeReport.huboHeridos,
        createdAt: policeReport.createdAt,
        officialDescription: policeReport.officialDescription,
        actionsTaken: policeReport.actionsTaken,
      }
    : null;

  return (
    <div className="admin-incident-detail">
      <Header navLinks={adminLinks} />

      <main className="admin-incident-detail__content">
        <h1 className="admin-incident-detail__title">Detalle del incidente</h1>

        <section className="admin-incident-detail__grid">
          <UserReportCard report={userReport} showGenerateButton={false} />

          <OfficialReportView policeReport={policeReportView} />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AdminIncidentDetail;
