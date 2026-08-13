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
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadReports = async () => {
      try {
        setLoading(true);
        setError("");

        const currentUser = getCurrentSessionUser();
        const userId = currentUser?.id;

        if (!userId && userId !== 0) {
          throw new Error("Tu sesión no permite consultar los reportes. Inicia sesión nuevamente.");
        }

        const nextIncidents = await fetchMyIncidents(userId);

        if (active) {
          setIncidents(nextIncidents);
        }
      } catch (loadError) {
        if (active) {
          setIncidents([]);
          setError(
            loadError?.message === "No fue posible conectar con el servicio de reportes."
              ? "No fue posible conectar con el servicio de reportes."
              : loadError?.message === "Tu sesión no permite consultar los reportes. Inicia sesión nuevamente."
                ? "Tu sesión no permite consultar los reportes. Inicia sesión nuevamente."
                : loadError?.message === "Ocurrió un error al consultar tus reportes."
                  ? "Ocurrió un error al consultar tus reportes."
                  : "Ocurrió un error al consultar tus reportes."
          );
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
        <section className="myreports-card">
          <header className="myreports-header">
            <button
              className="myreports-icon-button"
              onClick={() => navigate("/menu")}
              type="button"
              aria-label="Volver al menú"
            >
              <ArrowLeft size={30} />
            </button>

            <h1>Mis Reportes</h1>

            <button className="myreports-icon-button notification" type="button" aria-label="Notificaciones">
              <Bell size={30} />
              <span></span>
            </button>
          </header>

          <div className="myreports-empty-state myreports-empty-state--loading">
            <p>Consultando tus reportes...</p>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="myreports-container">
        <section className="myreports-card">
          <header className="myreports-header">
            <button
              className="myreports-icon-button"
              onClick={() => navigate("/menu")}
              type="button"
              aria-label="Volver al menú"
            >
              <ArrowLeft size={30} />
            </button>

            <h1>Mis Reportes</h1>

            <button className="myreports-icon-button notification" type="button" aria-label="Notificaciones">
              <Bell size={30} />
              <span></span>
            </button>
          </header>

          <div className="myreports-empty-state">
            <p className="myreports-empty-state__message">{error}</p>
          </div>
        </section>
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
            type="button"
            aria-label="Volver al menú"
          >
            <ArrowLeft size={30} />
          </button>

          <h1>Mis Reportes</h1>

          <button className="myreports-icon-button notification" type="button" aria-label="Notificaciones">
            <Bell size={30} />
            <span></span>
          </button>
        </header>

        {incidents.length === 0 ? (
          <div className="myreports-empty-state" role="status" aria-live="polite">
            <div className="myreports-empty-state__content">
              <h2>Aún no tienes reportes registrados</h2>
              <p>Cuando registres un incidente, podrás consultar aquí su estado y seguimiento.</p>
              <button
                className="myreports-create-button"
                type="button"
                onClick={() => navigate("/generar-reporte")}
              >
                Crear un reporte
              </button>
            </div>
          </div>
        ) : (
          <section className="reports-list">
            {incidents.map((report) => (
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
                    type="button"
                  >
                    Más detalles
                    <ChevronRight size={22} />
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </section>
    </main>
  );
}

export default MyReports;