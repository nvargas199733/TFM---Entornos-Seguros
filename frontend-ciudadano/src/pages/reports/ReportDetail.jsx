import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, FileText, Flag, ShieldCheck, Car } from "lucide-react";
import { fetchIncidentById, fetchIncidentHistory } from "../../services/reportService";

function ReportDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [report, setReport] = useState(null);
	const [history, setHistory] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		let active = true;

		const loadDetail = async () => {
			try {
				setLoading(true);
				setError("");

				const [incident, incidentHistory] = await Promise.all([
					fetchIncidentById(id),
					fetchIncidentHistory(id),
				]);

				if (active) {
					setReport(incident);
					setHistory(incidentHistory || []);
				}
			} catch (loadError) {
				if (active) {
					setError(loadError.message || "No se pudo cargar el detalle del reporte");
				}
			} finally {
				if (active) {
					setLoading(false);
				}
			}
		};

		loadDetail();

		return () => {
			active = false;
		};
	}, [id]);

	const getBadgeType = (status) => {
		return status === "atendido" || status === "cerrado" ? "success" : "warning";
	};

	const getIcon = (tipo) => {
		if (tipo === "success") return <ShieldCheck size={36} />;
		if (tipo === "warning") return <Car size={36} />;
		return <Flag size={36} />;
	};

	if (loading) {
		return <main className="myreports-container"><section className="myreports-card">Cargando detalle...</section></main>;
	}

	if (error) {
		return <main className="myreports-container"><section className="myreports-card">{error}</section></main>;
	}

	if (!report) {
		return <main className="myreports-container"><section className="myreports-card">Reporte no encontrado.</section></main>;
	}

	const badgeType = getBadgeType(report.status);

	return (
		<main className="myreports-container">
			<section className="myreports-card">
				<header className="myreports-header">
					<button
						className="myreports-icon-button"
						onClick={() => navigate("/mis-reportes")}
					>
						<ArrowLeft size={30} />
					</button>

					<h1>Detalle del reporte</h1>

					<button className="myreports-icon-button notification" onClick={() => navigate("/menu")}>
						<Flag size={30} />
					</button>
				</header>

				<section className="reports-list">
					<article className="report-card">
						<div className={`report-main-icon ${badgeType}`}>
							{getIcon(badgeType)}
						</div>

						<div className="report-info">
							<div className="report-row">
								<Calendar size={22} />
								<div>
									<span>Fecha</span>
									<p>{new Date(report.reportedAt).toLocaleString("es-EC")}</p>
								</div>
							</div>

							<div className="report-row">
								<MapPin size={22} />
								<div>
									<span>Referencia</span>
									<p>{report.location}</p>
								</div>
							</div>

							<div className="report-row">
								<FileText size={22} />
								<div>
									<span>Descripción</span>
									<p>{report.description}</p>
								</div>
							</div>
						</div>

						<div className="report-status-area">
							<div className={`status-badge ${badgeType}`}>
								<span className="status-dot"></span>
								{report.status}
							</div>
						</div>
					</article>
				</section>

				<section className="reports-list" style={{ marginTop: 24 }}>
					<article className="report-card" style={{ alignItems: "flex-start" }}>
						<div className="report-info" style={{ width: "100%" }}>
							<h2>Historial del incidente</h2>
							{history.length === 0 ? (
								<p>No hay cambios de estado registrados todavía.</p>
							) : (
								history.map((entry) => (
									<div key={entry.id} className="report-row" style={{ alignItems: "flex-start" }}>
										<div>
											<span>{entry.estadoIncidente}</span>
											<p>{entry.observacion || "Sin observación"}</p>
											<small>{new Date(entry.fechaCambio).toLocaleString("es-EC")}</small>
										</div>
									</div>
								))
							)}
						</div>
					</article>
				</section>
			</section>
		</main>
	);
}

export default ReportDetail;
