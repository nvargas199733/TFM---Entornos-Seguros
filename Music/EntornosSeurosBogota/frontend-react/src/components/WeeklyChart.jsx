/*
  WeeklyChart:
  Gráfico de barras para mostrar los incidentes registrados
  durante la semana actual.

  Usa Recharts para crear una visualización sencilla,
  clara y responsive.
*/

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* Datos simulados mientras el backend no esté conectado */
const weeklyData = [
  { day: "Lun", incidents: 4 },
  { day: "Mar", incidents: 7 },
  { day: "Mié", incidents: 5 },
  { day: "Jue", incidents: 6 },
  { day: "Vie", incidents: 8 },
  { day: "Sáb", incidents: 3 },
  { day: "Dom", incidents: 2 },
];

/* Total semanal calculado automáticamente */
const weeklyTotal = weeklyData.reduce((sum, item) => sum + item.incidents, 0);

const WeeklyChart = () => {
  return (
    <div className="weekly-chart">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={weeklyData}>
          <XAxis dataKey="day" />

          <YAxis />

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

export { weeklyTotal };

export default WeeklyChart;