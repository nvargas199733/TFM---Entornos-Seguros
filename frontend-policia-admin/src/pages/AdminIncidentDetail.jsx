import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import UserReportCard from "../components/UserReportCard";
import OfficialReportView from "../components/OfficialReportView";
import { fetchIncidentById, fetchIncidentEvidences, fetchPoliceReportsByIncident } from "../services/policeApi";
import { fetchAdminUserById } from "../services/adminUsersApi";

import "../styles/user-report-detail.css";
import "../styles/admin-incident-detail.css";

const AdminIncidentDetail = () => {
  const { id } = useParams();

  const adminLinks = [
    { label: "Inicio", path: "/admin" },
    { label: "Crear usuario", path: "/admin/crear-usuario" },
    { label: "Gestión de usuario", path: "/admin/gestion-usuarios" },
    { label: "Incidentes", path: "/admin/incidentes" },
  ];

  const [userReport, setUserReport]               = useState(null);
  const [policeReport, setPoliceReport]           = useState(null);
  const [evidences, setEvidences]                 = useState([]);
  const [evidenceLoading, setEvidenceLoading]     = useState(true);
  const [evidenceError, setEvidenceError]         = useState("");
  const [loading, setLoading]                     = useState(true);
  const [error, setError]                         = useState("");

  /* ── Personal policial ── */
  const [policeUser, setPoliceUser]               = useState(null);
  const [policeUserLoading, setPoliceUserLoading] = useState(false);
  const [policeUserError, setPoliceUserError]     = useState("");

  /* ── Reportante ── */
  const [reporter, setReporter]                   = useState(null);
  const [reporterLoading, setReporterLoading]     = useState(false);
  const [reporterError, setReporterError]         = useState("");

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

        /* Evidencias: fallo no bloquea las tarjetas principales */
        try {
          const nextEvidences = await fetchIncidentEvidences(Number(id));
          if (active) {
            setEvidences(Array.isArray(nextEvidences) ? nextEvidences : []);
          }
        } catch {
          if (active) {
            setEvidences([]);
            setEvidenceError("No fue posible cargar las evidencias del incidente.");
          }
        } finally {
          if (active) {
            setEvidenceLoading(false);
          }
        }

        /* Consultar reportante cuando tengamos incident.idUsuario */
        const reporterId = incident?.idUsuario;
        if (active && reporterId && Number.isInteger(Number(reporterId)) && Number(reporterId) > 0) {
          setReporterLoading(true);
          fetchAdminUserById(reporterId)
            .then((user) => { if (active) setReporter(user); })
            .catch(() => { if (active) setReporterError("No fue posible cargar los datos del reportante."); })
            .finally(() => { if (active) setReporterLoading(false); });
        }

        /* Consultar personal policial cuando tengamos el informe */
        const policeId = policeReports[0]?.policeId;
        if (active && policeId && Number.isInteger(Number(policeId)) && Number(policeId) > 0) {
          setPoliceUserLoading(true);
          fetchAdminUserById(policeId)
            .then((user) => { if (active) setPoliceUser(user); })
            .catch(() => { if (active) setPoliceUserError("No fue posible cargar los datos del personal responsable."); })
            .finally(() => { if (active) setPoliceUserLoading(false); });
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

    return () => { active = false; };
  }, [id]);

  if (loading) {
    return <p role="status">Cargando incidente...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (!userReport) {
    return <p>Incidente no encontrado.</p>;
  }

  /* ── Preparar prop para OfficialReportView ── */
  const policeReportView = policeReport
    ? {
        reportId: policeReport.id,
        hasInjured: policeReport.huboHeridos,
        createdAt: policeReport.createdAt,
        officialDescription: policeReport.officialDescription,
        actionsTaken: policeReport.actionsTaken,
        policeUserLoading,
        policeUserError,
        policeUser,
      }
    : null;

  return (
    <div className="admin-incident-detail">
      <Header navLinks={adminLinks} />

      <main className="admin-incident-detail__content">
        <h1 className="admin-incident-detail__title">Detalle del incidente</h1>

        <section className="admin-incident-detail__grid">
          <UserReportCard
            report={userReport}
            evidences={evidences}
            evidenceLoading={evidenceLoading}
            evidenceError={evidenceError}
            showGenerateButton={false}
            reporter={reporter}
            reporterLoading={reporterLoading}
            reporterError={reporterError}
          />

          <OfficialReportView policeReport={policeReportView} />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AdminIncidentDetail;
