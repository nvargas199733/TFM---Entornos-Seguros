/*
  StatsPanel:
  Panel contenedor para las estadísticas del dashboard.

  Ahora calcula los datos directamente desde reportsData.js.
*/
import { useState } from "react";
import StatsCard from "./StatsCard";
import IncidentChart from "./IncidentChart";
import WeeklyChart from "./WeeklyChart";
import reportsData from "../data/reportsData";

const StatsPanel = () => {
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const policeReports = JSON.parse(localStorage.getItem("policeReports")) || [];

  const reportsWithFinalStatus = reportsData.map((report) => {
    const hasPoliceReport = policeReports.some(
      (policeReport) => policeReport.userReportId === report.id,
    );

    return {
      ...report,
      finalStatus: hasPoliceReport ? "atendido" : report.status,
    };
  });
  const filteredReports =
    statusFilter === "Todos"
      ? reportsWithFinalStatus
      : reportsWithFinalStatus.filter(
          (report) => report.finalStatus === statusFilter,
        );
  const weeklyFilteredReports =
    typeFilter === "Todos"
      ? filteredReports
      : filteredReports.filter((report) => report.type === typeFilter);
  /*
    Total general de reportes registrados.
  */
  const totalReports = filteredReports.length;

  const incidentData = [
    {
      name: "Robos",
      value: filteredReports.filter((report) => report.type === "Robo").length,
    },
    {
      name: "Accidentes",
      value: filteredReports.filter((report) => report.type === "Accidente")
        .length,
    },
    {
      name: "Vandalismo",
      value: filteredReports.filter((report) => report.type === "Vandalismo")
        .length,
    },
  ];

  /*
    Reportes de los últimos 7 días.
    Esto servirá para el gráfico semanal.
  */
  const weeklyReports = weeklyFilteredReports.filter((report) => {
    const reportDate = new Date(report.reportedAt);
    const today = new Date();

    const differenceDays = (today - reportDate) / (1000 * 60 * 60 * 24);

    return differenceDays <= 7;
  });

  return (
    <aside className="stats-panel">
      <StatsCard
        title="Total de incidentes"
        value={totalReports}
        description="Resumen general de incidentes registrados en el sistema."
        chart={
          <>
            <div className="stats-panel__filter">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="Todos">Todos</option>
                <option value="pendiente">Pendientes</option>
                <option value="atendido">Atendidos</option>
              </select>
            </div>

            <IncidentChart data={incidentData} />
          </>
        }
      />

      <StatsCard
        title="Semana actual"
        value={weeklyReports.length}
        description="Actividad registrada durante los últimos siete días."
        chart={
          <>
            <div className="stats-panel__filter">
              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
              >
                <option value="Todos">Todos</option>
                <option value="Robo">Robos</option>
                <option value="Accidente">Accidentes</option>
                <option value="Vandalismo">Vandalismo</option>
              </select>
            </div>

            <WeeklyChart reports={weeklyReports} />
          </>
        }
      />
    </aside>
  );
};

export default StatsPanel;
