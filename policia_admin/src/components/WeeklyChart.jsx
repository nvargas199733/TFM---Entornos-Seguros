/*
  WeeklyChart:
  Gráfico de barras semanal.

  Recibe los reportes desde StatsPanel.jsx
  y calcula cuántos incidentes ocurrieron por día.
*/

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const WeeklyChart = ({ reports }) => {
  /*
    Creamos una estructura base para los 7 días.
  */
  const weeklyData = days.map((day) => ({
    day,
    incidents: 0,
  }));

  /*
    Recorremos los reportes recibidos y sumamos
    cada incidente en el día correspondiente.
  */
  reports.forEach((report) => {
    const reportDate = new Date(report.reportedAt);

    const dayIndex = reportDate.getDay();

    weeklyData[dayIndex].incidents += 1;
  });

  return (
    <div className="weekly-chart">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={weeklyData}>
          <XAxis dataKey="day" />

          <YAxis allowDecimals={false} />

          <Tooltip />

          <Bar
            dataKey="incidents"
            fill="#408d9c"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyChart;