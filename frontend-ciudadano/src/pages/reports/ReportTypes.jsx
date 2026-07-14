import "./ReportTypes.css";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  ShieldAlert,
  PersonStanding,
  Car,
  House,
  UserSearch
} from "lucide-react";

function ReportTypes() {
  const navigate = useNavigate();

  const reportTypes = [
    {
      title: "Emergencia de Seguridad",
      description: "Situaciones que ponen en riesgo la seguridad.",
      icon: <ShieldAlert size={34} />,
      color: "blue"
    },
    {
      title: "Robo a persona",
      description: "Robo o hurto a personas en la vía pública.",
      icon: <PersonStanding size={34} />,
      color: "sky"
    },
    {
      title: "Robo de vehículo",
      description: "Robo o hurto de automóviles, motos u otros vehículos.",
      icon: <Car size={34} />,
      color: "red"
    },
    {
      title: "Robo a casa",
      description: "Robo o hurto en viviendas o residencias.",
      icon: <House size={34} />,
      color: "green"
    },
    {
      title: "Actividad sospechosa",
      description: "Comportamientos o situaciones inusuales.",
      icon: <UserSearch size={34} />,
      color: "teal"
    }
  ];

  return (
    <main className="report-types-container">
      <section className="report-types-card">
        <header className="report-types-header">
          <button
            className="report-types-back"
            onClick={() => navigate("/menu")}
          >
            <ArrowLeft size={30} />
          </button>

          <h1>Clasificar reporte</h1>
        </header>

        <section className="report-types-content">
          <h2>Selecciona el tipo de reporte</h2>
          <div className="title-line"></div>

          <div className="report-type-list">
            {reportTypes.map((item, index) => (
                <button
                    key={index}
                    className="report-type-item"
                    onClick={() =>
                        navigate("/generar-reporte", {
                        state: {
                            title: item.title,
                            color: item.color
                        }
                        })
                    }
                >
                <div className={`report-type-icon ${item.color}`}>
                  {item.icon}
                </div>

                <div className="report-type-text">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>

                <ChevronRight size={28} className="report-type-arrow" />
              </button>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

export default ReportTypes;