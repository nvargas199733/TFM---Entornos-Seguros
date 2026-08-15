import { useEffect, useState } from "react";
import Header from "../components/Header";

import Footer from "../components/Footer";

import UserReportCard from "../components/UserReportCard";

import "../styles/user-report-detail.css";
import { useParams } from "react-router-dom";
import policeVideo from "../assets/policia.mp4";
import { fetchIncidentById, fetchIncidentEvidences } from "../services/policeApi";

/*
  UserReportDetail:
  Vista detalle del reporte realizado por un usuario.
*/

const UserReportDetail = () => {
  /* Reporte ficticio */
  const { id } = useParams();

  const [report, setReport] = useState(null);
  const [evidences, setEvidences] = useState([]);
  const [evidenceLoading, setEvidenceLoading] = useState(true);
  const [evidenceError, setEvidenceError] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadReport = async () => {
      try {
        setLoading(true);
        setError("");

        const incident = await fetchIncidentById(Number(id));

        if (active) {
          setReport(incident);
        }

        try {
          const nextEvidences = await fetchIncidentEvidences(Number(id));
          if (active) {
            setEvidences(Array.isArray(nextEvidences) ? nextEvidences : []);
          }
        } catch {
          if (active) {
            setEvidences([]);
            setEvidenceError("No fue posible cargar la evidencia del incidente.");
          }
        } finally {
          if (active) {
            setEvidenceLoading(false);
          }
        }
      } catch (loadError) {
        if (active) {
          setError(loadError.message || "No se pudo cargar el reporte");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadReport();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <p>Cargando reporte...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!report) {
    return <p>Reporte no encontrado.</p>;
  }

  return (
    <div className="user-report-detail">
      <Header />

      <main className="user-report-detail__content">
        <video
          className="user-report-detail__video"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={policeVideo} type="video/mp4" />
        </video>

        <div className="user-report-detail__video-overlay"></div>
        <div className="user-report-detail__overlay">
          <UserReportCard
            report={report}
            evidences={evidences}
            evidenceLoading={evidenceLoading}
            evidenceError={evidenceError}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserReportDetail;
