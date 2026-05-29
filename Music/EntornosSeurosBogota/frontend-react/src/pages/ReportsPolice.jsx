import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ReportCard from "../components/ReportCard";
import reportsData from "../data/reportsData";
import bannerImage from "../assets/banner-police.png";
import "../styles/reports-police.css";
import HeroBanner from "../components/HeroBanner";
import Pagination from "../components/Pagination";

/*
  ReportsPolice:
  Vista donde el rol Policía puede ver reportes pendientes.

  Por ahora usa datos ficticios.
  Luego se conectará al backend para mostrar reportes reales
  generados desde el rol Usuario.
*/

const ReportsPolice = () => {
  const [filter, setFilter] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 5;
  const attendedReports =
    JSON.parse(localStorage.getItem("attendedReports")) || [];

  /*
  Primero mostramos solo reportes:
  - con status pendiente
  - que no estén registrados como atendidos en localStorage
*/
  const pendingReports = reportsData.filter(
    (report) =>
      report.status === "pendiente" && !attendedReports.includes(report.id),
  );

  /*
  Luego aplicamos filtro por tipo.
*/
  const filteredReports =
    filter === "Todos"
      ? pendingReports
      : pendingReports.filter((report) => report.type === filter);

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
