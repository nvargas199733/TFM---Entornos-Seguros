import { useEffect, useMemo, useState } from "react";
import StatsCard from "./StatsCard";
import IncidentChart from "./IncidentChart";
import WeeklyChart from "./WeeklyChart";
import { fetchIncidents, fetchPoliceReportsByIncident } from "../services/policeApi";

const StatsPanel = () => {
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [reportsWithFinalStatus, setReportsWithFinalStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadStats = async () => {
      try {
        setIsLoading(true);
        setError("");

        const incidents = await fetchIncidents();
        const enriched = await Promise.all(
          incidents.map(async (incident) => {
            const policeReports = await fetchPoliceReportsByIncident(incident.id);

            return {
              ...incident,
              finalStatus: policeReports.length > 0 ? "atendido" : incident.status,
            };
          }),
        );

        if (active) {
          setReportsWithFinalStatus(enriched);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError.message || "No se pudieron cargar estadísticas");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadStats();

    return () => {
      active = false;
    };
  }, []);

  const filteredReports =
    statusFilter === "Todos"
      ? reportsWithFinalStatus
      : reportsWithFinalStatus.filter(
          (report) => report.finalStatus === statusFilter,
        );

  const availableTypes = useMemo(() => {
    return Array.from(
      new Set(reportsWithFinalStatus.map((report) => report.type).filter(Boolean)),
    ).sort((a, b) => a.localeCompare(b));
  }, [reportsWithFinalStatus]);

  const weeklyFilteredReports =
    typeFilter === "Todos"
      ? filteredReports
      : filteredReports.filter((report) => report.type === typeFilter);

  const totalReports = filteredReports.length;

  const incidentData = availableTypes.length > 0
    ? availableTypes.map((type) => ({
        name: type,
        value: filteredReports.filter((report) => report.type === type).length,
      }))
    : [
        { name: "Sin datos", value: 1 },
      ];

  const weeklyReports = weeklyFilteredReports.filter((report) => {
    const reportDate = new Date(report.reportedAt);
    const today = new Date();

    const differenceDays = (today - reportDate) / (1000 * 60 * 60 * 24);

    return differenceDays <= 7;
  });

  return (
    <aside className="stats-panel">
      {isLoading && <p>Cargando estadísticas...</p>}
      {error && <p>{error}</p>}

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
                {availableTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
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
