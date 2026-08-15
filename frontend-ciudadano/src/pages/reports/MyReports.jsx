import "./MyReports.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Calendar,
  MapPin,
  FileText,
  ChevronRight
} from "lucide-react";
import { fetchMyIncidents, getCurrentSessionUser } from "../../services/reportService";
import { resolveIncidentTypeVisual } from "../../data/reportTypes";

function MyReports() {
  const navigate = useNavigate();
  const currentUserId = getCurrentSessionUser()?.id;
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadReports = async () => {
      try {
        setLoading(true);
        setError("");

        const userId = currentUserId;

        if (!userId && userId !== 0) {
          throw new Error("Tu sesión no permite consultar los reportes. Inicia sesión nuevamente.");
        }

        const nextIncidents = await fetchMyIncidents(userId);

        if (active) {
          setIncidents(nextIncidents);
        }
      } catch (loadError) {
        if (active) {
          const status = loadError?.status;
          setIncidents([]);

          if (status === 401) {
            setError("Tu sesión expiró. Inicia sesión nuevamente.");
            return;
          }

          if (status === 403) {
            setError("No tienes permiso para consultar estos reportes.");
            return;
          }

          if (status === 500) {
            setError("Ocurrió un error al consultar los reportes.");
            return;
          }

          if (status === 0) {
            setError("No fue posible conectar con el servicio de reportes.");
            return;
          }

          if (loadError?.message === "Tu sesión no permite consultar los reportes. Inicia sesión nuevamente.") {
            setError("Tu sesión expiró. Inicia sesión nuevamente.");
            return;
          }

          setError("Ocurrió un error al consultar los reportes.");
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
  }, [currentUserId]);

  const formatDate = (value) => {
    if (!value) return "Fecha no disponible";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "Fecha no disponible";
    }

    return date.toLocaleString("es-EC", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "numeric",
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
                onClick={() => navigate("/tipos-reporte")}
              >
                Crear un reporte
              </button>
            </div>
          </div>
        ) : (
          <section className="reports-list">
            {incidents.map((report) => {
              const visual = resolveIncidentTypeVisual({ nombre: report.type });
              const TypeIcon = visual.Icon;

              return (
                <article className="report-card" key={report.id}>
                  <div className={`report-main-icon ${visual.colorClass}`}>
                    <TypeIcon size={36} />
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
              );
            })}
          </section>
        )}
      </section>
    </main>
  );
}

export default MyReports;