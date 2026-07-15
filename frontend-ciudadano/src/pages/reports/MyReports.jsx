import "./MyReports.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Calendar,
  MapPin,
  FileText,
  ChevronRight,
  Car,
  ShieldCheck,
  Flag
} from "lucide-react";
import { fetchMyIncidents, getCurrentSessionUser } from "../../services/reportService";

function MyReports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadReports = async () => {
      try {
        setLoading(true);
        setError("");

        const currentUser = getCurrentSessionUser();

        if (!currentUser?.id) {
          throw new Error("Debes iniciar sesión para ver tus reportes");
        }

        const incidents = await fetchMyIncidents(currentUser.id);

        if (active) {
          setReports(incidents);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError.message || "No se pudieron cargar los reportes");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadReports();

    return () => {
      active = false;
    };
  }, []);

  const getIcon = (tipo) => {
    if (tipo === "warning") return <Car size={36} />;
    if (tipo === "success") return <ShieldCheck size={36} />;
    return <Flag size={36} />;
  };

  const formatDate = (value) => {
    if (!value) return "Sin fecha";

    return new Date(value).toLocaleString("es-EC", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const badgeType = (status) => {
    return status === "atendido" || status === "cerrado" ? "success" : "warning";
  };

  if (loading) {
    return (
      <main className="myreports-container">
        <section className="myreports-card">Cargando reportes...</section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="myreports-container">
        <section className="myreports-card">{error}</section>
      </main>
    );
  }

  return (
    <main className="myreports-container">
      <section className="myreports-card">
        <header className="myreports-header">
          <button
            className="myreports-icon-button"
            onClick={() => navigate("/menu")}
          >
            <ArrowLeft size={30} />
          </button>

          <h1>Mis Reportes</h1>

          <button className="myreports-icon-button notification">
            <Bell size={30} />
            <span></span>
          </button>
        </header>

        <section className="reports-list">
          {reports.map((report) => (
            <article className="report-card" key={report.id}>
              <div className={`report-main-icon ${badgeType(report.status)}`}>
                {getIcon(badgeType(report.status))}
              </div>

              <div className="report-info">
                <div className="report-row">
                  <Calendar size={22} />
                  <div>
                    <span>Fecha</span>
                    <p>{formatDate(report.reportedAt)}</p>
                  </div>
                </div>

                <div className="report-row">
                  <MapPin size={22} />
                  <div>
                    <span>Referencia</span>
                    <p>{report.location}</p>
                  </div>
                </div>

                <div className="report-row">
                  <FileText size={22} />
                  <div>
                    <span>Descripción</span>
                    <p>{report.description}</p>
                  </div>
                </div>
              </div>

              <div className="report-status-area">
                <div className={`status-badge ${badgeType(report.status)}`}>
                  <span className="status-dot"></span>
                  {report.status}
                </div>

                <button
                  className="details-button"
                  onClick={() => navigate(`/mis-reportes/${report.id}`)}
                >
                  Más detalles
                  <ChevronRight size={22} />
                </button>
              </div>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}

export default MyReports;