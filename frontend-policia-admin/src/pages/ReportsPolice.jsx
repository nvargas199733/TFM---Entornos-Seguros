import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ReportCard from "../components/ReportCard";
import bannerImage from "../assets/banner-police.png";
import "../styles/reports-police.css";
import HeroBanner from "../components/HeroBanner";
import Pagination from "../components/Pagination";
import { fetchIncidents } from "../services/policeApi";

/*
  ReportsPolice:
  Vista donde el rol Policía puede ver reportes pendientes.

  Por ahora usa datos ficticios.
  Luego se conectará al backend para mostrar reportes reales
  generados desde el rol Usuario.
*/

const ReportsPolice = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("Todos");
  const [timeFilter, setTimeFilter] = useState("mes");
  const [currentPage, setCurrentPage] = useState(1);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const reportsPerPage = 5;

  useEffect(() => {
    let active = true;

    const loadReports = async () => {
      try {
        setLoading(true);
        setError("");

        const incidents = await fetchIncidents();

        if (active) {
          setReports(
            incidents.filter(
              (incident) => String(incident.estadoIncidente || "").toUpperCase() === "PENDIENTE",
            ),
          );
        }
      } catch (loadError) {
        if (active) {
          const status = loadError?.status;

          if (status === 401) {
            setError("No hay una sesión válida para consultar los reportes.");
            navigate("/login", { replace: true });
            return;
          }

          if (status === 403) {
            setError("No tienes permiso para consultar los reportes.");
            return;
          }

          if (status === 500) {
            setError("Ocurrió un error al consultar los reportes.");
            return;
          }

          if (loadError instanceof TypeError || loadError?.message === "Failed to fetch") {
            setError("No fue posible conectar con el servicio de incidentes.");
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
  }, [navigate]);

  const now = new Date();

  const reportsByTime = reports.filter((report) => {
    const reportDate = new Date(report.reportedAt);
    const differenceHours = (now - reportDate) / (1000 * 60 * 60);

    if (timeFilter === "24h") {
      return differenceHours <= 24;
    }

    if (timeFilter === "semana") {
      return differenceHours <= 24 * 7;
    }

    return differenceHours <= 24 * 30;
  });

  const reportsByType =
    filter === "Todos"
      ? reportsByTime
      : reportsByTime.filter((report) => report.type === filter);

  const filteredReports = [...reportsByType].sort(
    (a, b) => new Date(b.reportedAt) - new Date(a.reportedAt)
  );

  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  const startIndex = (currentPage - 1) * reportsPerPage;

  const paginatedReports = filteredReports.slice(
    startIndex,
    startIndex + reportsPerPage,
  );

  return (
    <div className="reports-police">
      <Header />

      <main className="reports-police__content">
        <HeroBanner
          title="Reportes pendientes"
          description="Visualiza y filtra los incidentes ciudadanos que aún requieren atención policial."
          backgroundImage={bannerImage}
        />

        <section className="reports-police__panel">
          {loading && <p className="reports-police__count">Cargando reportes...</p>}

          {error && <p className="reports-police__count">{error}</p>}

          <div className="reports-police__toolbar">
            <p className="reports-police__count">
              {filteredReports.length} reportes pendientes
            </p>

            <select
              className="reports-police__filter"
              value={filter}
              onChange={(event) => {
                setFilter(event.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="Todos">Todos</option>
              <option value="Robo">Robo</option>
              <option value="Accidente">Accidente</option>
              <option value="Vandalismo">Vandalismo</option>
            </select>
            <select
              className="reports-police__filter"
              value={timeFilter}
              onChange={(event) => {
                setTimeFilter(event.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="24h">Últimas 24 horas</option>
              <option value="semana">Última semana</option>
              <option value="mes">Último mes</option>
            </select>
          </div>

          <div className="reports-police__list">
            {paginatedReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ReportsPolice;
