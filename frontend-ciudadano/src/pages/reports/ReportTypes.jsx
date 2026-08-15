import "./ReportTypes.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { fetchIncidentTypes } from "../../services/reportService";
import { resolveIncidentTypeVisual, toIncidentTypeNavigationState } from "../../data/reportTypes";

function ReportTypes() {
  const navigate = useNavigate();
  const [reportTypes, setReportTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadReportTypes = async () => {
      try {
        setLoading(true);
        setError("");
        const types = await fetchIncidentTypes();

        if (active) {
          setReportTypes(types);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError.message || "No se pudieron cargar los tipos de incidente.");
          setReportTypes([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadReportTypes();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="report-types-container">
      <section className="report-types-card">
        <header className="report-types-header">
          <button
            className="report-types-back"
            onClick={() => navigate("/menu")}
            type="button"
          >
            <ArrowLeft size={30} />
          </button>

          <h1>Clasificar reporte</h1>
        </header>

        <section className="report-types-content">
          <h2>Selecciona el tipo de reporte</h2>
          <div className="title-line"></div>

          {loading ? (
            <p className="report-types-message">Cargando tipos de incidente...</p>
          ) : error ? (
            <p className="report-types-message">{error}</p>
          ) : reportTypes.length === 0 ? (
            <p className="report-types-message">No hay tipos de incidente disponibles en este momento.</p>
          ) : (
            <div className="report-type-list">
              {reportTypes.map((item) => {
                const visual = resolveIncidentTypeVisual(item);
                const TypeIcon = visual.Icon;

                return (
                  <button
                    key={item.idTipoIncidente}
                    className="report-type-item"
                    type="button"
                    onClick={() =>
                      navigate("/generar-reporte", {
                        state: {
                          selectedType: toIncidentTypeNavigationState(item)
                        }
                      })
                    }
                  >
                    <div className={`report-type-icon ${visual.colorClass}`}>
                      <TypeIcon size={34} />
                    </div>

                    <div className="report-type-text">
                      <h3>{item.nombre}</h3>
                      <p>{visual.description || item.descripcion}</p>
                    </div>

                    <ChevronRight size={28} className="report-type-arrow" />
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default ReportTypes;