/*
  StatsPanel:
  Panel contenedor para las estadísticas del dashboard.

  Ahora calcula los datos directamente desde reportsData.js.
*/

import StatsCard from "./StatsCard";
import IncidentChart from "./IncidentChart";
import WeeklyChart from "./WeeklyChart";
import reportsData from "../data/reportsData";

const StatsPanel = () => {
  /*
    Total general de reportes registrados.
  */
  const totalReports = reportsData.length;

  /*
    Datos para el gráfico circular.
    Cuenta cuántos reportes existen por tipo de incidente.
  */
  const incidentData = [
    {
      name: "Robos",
      value: reportsData.filter((report) => report.type === "Robo").length,
    },
    {
      name: "Accidentes",
      value: reportsData.filter((report) => report.type === "Accidente").length,
    },
    {
      name: "Vandalismo",
      value: reportsData.filter((report) => report.type === "Vandalismo").length,
    },
  ];

  /*
    Reportes de los últimos 7 días.
    Esto servirá para el gráfico semanal.
  */
  const weeklyReports = reportsData.filter((report) => {
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
        chart={<IncidentChart data={incidentData} />}
      />

      <StatsCard
        title="Semana actual"
        value={weeklyReports.length}
        description="Actividad registrada durante los últimos siete días."
        chart={<WeeklyChart reports={weeklyReports} />}
      />
    </aside>
  );
};

export default StatsPanel;