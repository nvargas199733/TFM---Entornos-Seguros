import "./MyReports.css";
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

function MyReports() {
  const navigate = useNavigate();

  const reports = [
    {
      id: 1,
      fecha: "20 mayo 2025 - 09:30 a.m.",
      localidad: "Engativá",
      descripcion:
        "Se presenta un grupo de personas consumiendo sustancias en el parque y causando disturbios.",
      estado: "Patrulla en camino",
      tipo: "warning"
    },
    {
      id: 2,
      fecha: "18 mayo 2025 - 04:15 p.m.",
      localidad: "Suba",
      descripcion:
        "Robo de bicicleta en vía pública cerca del centro comercial.",
      estado: "Atendido el incidente",
      tipo: "success"
    },
    {
      id: 3,
      fecha: "15 mayo 2025 - 11:20 a.m.",
      localidad: "Teusaquillo",
      descripcion:
        "Vehículo mal estacionado bloqueando la entrada del garaje.",
      estado: "Finalizado",
      tipo: "finished"
    }
  ];

  const getIcon = (tipo) => {
    if (tipo === "warning") return <Car size={36} />;
    if (tipo === "success") return <ShieldCheck size={36} />;
    return <Flag size={36} />;
  };

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
              <div className={`report-main-icon ${report.tipo}`}>
                {getIcon(report.tipo)}
              </div>

              <div className="report-info">
                <div className="report-row">
                  <Calendar size={22} />
                  <div>
                    <span>Fecha</span>
                    <p>{report.fecha}</p>
                  </div>
                </div>

                <div className="report-row">
                  <MapPin size={22} />
                  <div>
                    <span>Localidad</span>
                    <p>{report.localidad}</p>
                  </div>
                </div>

                <div className="report-row">
                  <FileText size={22} />
                  <div>
                    <span>Descripción</span>
                    <p>{report.descripcion}</p>
                  </div>
                </div>
              </div>

              <div className="report-status-area">
                <div className={`status-badge ${report.tipo}`}>
                  <span className="status-dot"></span>
                  {report.estado}
                </div>

                <button
                  className="details-button"
                  onClick={() => alert(`Detalle del reporte ${report.id}`)}
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