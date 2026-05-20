/*
  IncidentChart:
  Gráfico circular tipo dona para mostrar los incidentes por categoría.
*/

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const incidentData = [
  { name: "Robos", value: 54 },
  { name: "Accidentes", value: 38 },
  { name: "Vandalismo", value: 21 },
];

const colors = ["#0d4876", "#408d9c", "#7dd3fc"];

const total = incidentData.reduce((sum, item) => sum + item.value, 0);

const renderPercentLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

  return (
    <text x={x} y={y} fill="#ffffff" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={700}>
      {(percent * 100).toFixed(1)}%
    </text>
  );
};

const renderOuterLabel = ({ cx, cy, midAngle, outerRadius, name, value }) => {
  const radius = outerRadius + 1;
  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

  return (
    <text x={x} y={y} fill="#0d4876" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={12} fontWeight={600}>
      {name}: {value}
    </text>
  );
};

const IncidentChart = () => {
  return (
    <div className="incident-chart">
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={incidentData}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={3}
            label={renderPercentLabel}
            labelLine={false}
          >
            {incidentData.map((item, index) => (
              <Cell key={item.name} fill={colors[index]} />
            ))}
          </Pie>

          <Pie
            data={incidentData}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={95}
            outerRadius={95}
            fill="transparent"
            stroke="transparent"
            label={renderOuterLabel}
            labelLine
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export { total };
export default IncidentChart;