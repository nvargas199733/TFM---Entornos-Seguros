import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatsCard from "./StatsCard";
import IncidentChart from "./IncidentChart";
import WeeklyChart from "./WeeklyChart";
import { fetchIncidents } from "../services/policeApi";
import { getSession } from "../services/authService";

const StatsPanel = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("TODOS");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [reportsWithFinalStatus, setReportsWithFinalStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const session = getSession();

    if (!session?.token) {
      setIsLoading(false);
      return () => {
        active = false;
      };
    }

    const loadStats = async () => {
      try {
        setIsLoading(true);
        setError("");

        const incidents = await fetchIncidents();

        if (active) {
          setReportsWithFinalStatus(incidents);
        }
      } catch (loadError) {
        if (active) {
          const status = loadError?.status;

          if (status === 401) {
            setError("No hay una sesión válida para consultar las estadísticas.");
            navigate("/login", { replace: true });
            return;
          }

          if (status === 403) {
            setError("No tienes permiso para consultar las estadísticas.");
            return;
          }

          if (status === 500) {
            setError("Ocurrió un error al consultar las estadísticas.");
            return;
          }

          if (loadError instanceof TypeError || loadError?.message === "Failed to fetch") {
            setError("No fue posible conectar con el servicio de incidentes.");
            return;
          }

          setError("Ocurrió un error al consultar las estadísticas.");
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
  }, [navigate]);

  const safeIncidents = Array.isArray(reportsWithFinalStatus)
    ? reportsWithFinalStatus
    : [];

  const availableStatuses = useMemo(() => {
    return Array.from(
      new Set(
        safeIncidents
          .map((incident) => String(incident.estadoIncidente ?? "").trim().toUpperCase())
          .filter(Boolean),
      ),
    ).sort((left, right) => left.localeCompare(right));
  }, [safeIncidents]);

  const filteredReports =
    statusFilter === "TODOS"
      ? safeIncidents
      : safeIncidents.filter(
          (incident) => String(incident.estadoIncidente ?? "").trim().toUpperCase() === statusFilter,
        );

  const availableTypes = useMemo(() => {
    return Array.from(
      new Set(safeIncidents.map((report) => report.type).filter(Boolean)),
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
    : [];

  const weeklyReports = weeklyFilteredReports.filter((report) => {
    const reportDate = new Date(report.reportedAt);
    const today = new Date();

    const differenceDays = (today - reportDate) / (1000 * 60 * 60 * 24);

    return differenceDays <= 7;
  });

  if (isLoading) {
    return <aside className="stats-panel"><p>Cargando estadísticas...</p></aside>;
  }

  if (error) {
    return <aside className="stats-panel"><p>{error}</p></aside>;
  }

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
                <option value="TODOS">Todos</option>
                {availableStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status === "PENDIENTE" ? "Pendientes" : status}
                  </option>
                ))}
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
