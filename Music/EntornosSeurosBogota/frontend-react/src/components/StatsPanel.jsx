/*
  StatsPanel:
  Componente contenedor para agrupar las estadísticas del dashboard.

  Sirve para mantener juntas las tarjetas estadísticas del lado derecho,
  evitando que cada gráfico se comporte como una columna independiente.
*/

import StatsCard from "./StatsCard";
import IncidentChart, { total } from "./IncidentChart";
import WeeklyChart, { weeklyTotal } from "./WeeklyChart";

const StatsPanel = () => {
  return (
    <aside className="stats-panel">
      <StatsCard
        title="Total de incidentes"
        value={total}
        description="Resumen general de incidentes registrados en el sistema."
        chart={<IncidentChart />}
      />

      <StatsCard
        title="Semana actual"
        value={weeklyTotal}
        description="Actividad registrada durante los últimos siete días."
        chart={<WeeklyChart />}
      />
    </aside>
  );
};

export default StatsPanel;
