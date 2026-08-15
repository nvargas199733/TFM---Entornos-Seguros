import "./MyReports.css";
import "./ReportDetail.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, FileText, Flag } from "lucide-react";
import { fetchIncidentById, fetchIncidentEvidences, fetchIncidentHistory } from "../../services/reportService";
import { resolveIncidentTypeVisual } from "../../data/reportTypes";

function ReportDetail() {
	const { id } = useParams();
	const incidentId = Number(id);
	const navigate = useNavigate();
	const [report, setReport] = useState(null);
	const [history, setHistory] = useState([]);
	const [historyError, setHistoryError] = useState("");
	const [evidences, setEvidences] = useState([]);
	const [evidencesLoading, setEvidencesLoading] = useState(true);
	const [evidencesError, setEvidencesError] = useState("");
	const [failedEvidenceIds, setFailedEvidenceIds] = useState(new Set());
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [notFound, setNotFound] = useState(false);

	useEffect(() => {
		let active = true;

		if (!Number.isInteger(incidentId) || incidentId <= 0) {
			setNotFound(true);
			setLoading(false);
			setReport(null);
			setHistory([]);
			setHistoryError("");
			setEvidences([]);
			setEvidencesError("");
			setEvidencesLoading(false);
			return () => {
				active = false;
			};
		}

		const loadDetail = async () => {
			try {
				setLoading(true);
				setError("");
				setNotFound(false);
				setHistoryError("");
				setEvidencesError("");
				setEvidencesLoading(true);
				setFailedEvidenceIds(new Set());

				const incident = await fetchIncidentById(incidentId);

				if (!active) {
					return;
				}

				setReport(incident);

				try {
					const incidentHistory = await fetchIncidentHistory(incidentId);

					if (active) {
						setHistory(Array.isArray(incidentHistory) ? incidentHistory : []);
					}
				} catch (historyLoadError) {
					if (!active) {
						return;
					}

					setHistory([]);
					setHistoryError("No fue posible cargar el historial del incidente.");
				}

				try {
					const incidentEvidences = await fetchIncidentEvidences(incidentId);

					if (active) {
						setEvidences(Array.isArray(incidentEvidences) ? incidentEvidences : []);
					}
				} catch (evidenceLoadError) {
					if (!active) {
						return;
					}

					setEvidences([]);
					setEvidencesError("No fue posible cargar las evidencias del incidente.");
				} finally {
					if (active) {
						setEvidencesLoading(false);
					}
				}
			} catch (loadError) {
				if (active) {
					const status = loadError?.status;

					setReport(null);
					setHistory([]);
					setHistoryError("");
					setEvidences([]);
					setEvidencesError("");
					setEvidencesLoading(false);

					if (status === 404) {
						setNotFound(true);
						setError("");
						return;
					}

					if (status === 401) {
						setError("Tu sesión expiró. Inicia sesión nuevamente.");
						return;
					}

					if (status === 403) {
						setError("No tienes permiso para consultar este reporte.");
						return;
					}

					if (status === 500) {
						setError("Ocurrió un error al consultar el reporte.");
						return;
					}

					if (status === 0) {
						setError("No fue posible conectar con el servicio de reportes.");
						return;
					}

					setError("Ocurrió un error al consultar el reporte.");
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
	}, [incidentId]);

	const getBadgeType = (status) => {
		return status === "atendido" || status === "cerrado" ? "success" : "warning";
	};

	const formatDate = (value) => {
		if (!value) return "Fecha no disponible";

		const date = new Date(value);
		if (Number.isNaN(date.getTime())) {
			return "Fecha no disponible";
		}

		return date.toLocaleString("es-EC", {
			day: "2-digit",
			month: "long",
			year: "numeric",
			hour: "numeric",
			minute: "2-digit"
		});
	};

	if (loading) {
		return <main className="myreports-container"><section className="myreports-card">Cargando detalle...</section></main>;
	}

	if (error) {
		return <main className="myreports-container"><section className="myreports-card">{error}</section></main>;
	}

	if (notFound) {
		return <main className="myreports-container"><section className="myreports-card">El reporte solicitado no existe.</section></main>;
	}

	if (!report) {
		return <main className="myreports-container"><section className="myreports-card">Reporte no encontrado.</section></main>;
	}

	const badgeType = getBadgeType(report.status);
	const visual = resolveIncidentTypeVisual({ nombre: report.type });
	const TypeIcon = visual.Icon;

	return (
		<main className="myreports-container">
			<section className="myreports-card">
				<header className="myreports-header">
					<button
						className="myreports-icon-button"
						onClick={() => navigate("/mis-reportes")}
						type="button"
						aria-label="Volver a mis reportes"
					>
						<ArrowLeft size={30} aria-hidden="true" />
					</button>

					<h1>Detalle del reporte</h1>

					<button className="myreports-icon-button notification" onClick={() => navigate("/menu")} type="button" aria-label="Ir al menú">
						<Flag size={30} aria-hidden="true" />
					</button>
				</header>

				<section className="reports-list detail-reports-list">
					<article className="report-card detail-summary-card">
						<div className={`report-main-icon ${visual.colorClass}`}>
							<TypeIcon size={36} aria-hidden="true" />
						</div>

						<div className="report-info">
							<div className="detail-type-block">
								<span>Tipo de incidente</span>
								<p>{report.type || visual.displayTitle}</p>
							</div>

							<div className="report-row">
								<Calendar size={22} aria-hidden="true" />
								<div>
									<span>Fecha</span>
									<time dateTime={report.reportedAt || ""}>{formatDate(report.reportedAt)}</time>
								</div>
							</div>

							<div className="report-row">
								<MapPin size={22} aria-hidden="true" />
								<div>
									<span>Referencia</span>
									<p>{report.location}</p>
								</div>
							</div>

							<div className="report-row">
								<FileText size={22} aria-hidden="true" />
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

				<section className="reports-list detail-reports-list report-evidence-section">
					<article className="report-card report-evidence-card">
						<h2 className="report-evidence-title">Evidencias</h2>

						{evidencesLoading ? (
							<p className="report-evidence-message">Consultando evidencias...</p>
						) : evidencesError ? (
							<p className="report-evidence-message">{evidencesError}</p>
						) : evidences.length === 0 ? (
							<p className="report-evidence-message">No hay evidencia registrada para este incidente.</p>
						) : (
							<div className="report-evidence-grid">
								{evidences.map((evidence) => {
									const evidenceId = evidence.idEvidenciaIncidente;
									const imageFailed = failedEvidenceIds.has(evidenceId);

									return (
										<figure key={evidenceId} className="report-evidence-item">
											{evidence.tipoArchivo === "imagen" && !imageFailed ? (
												<img
													src={evidence.urlArchivo}
													alt={evidence.nombreArchivo || "Evidencia del incidente"}
													className="report-evidence-image"
													loading="lazy"
													onError={() => setFailedEvidenceIds((current) => new Set(current).add(evidenceId))}
												/>
											) : (
												<div className="report-evidence-unavailable">Vista previa no disponible</div>
											)}
											<figcaption>{evidence.nombreArchivo || "Evidencia remota"}</figcaption>
											{evidence.fechaCarga && <time dateTime={evidence.fechaCarga}>{formatDate(evidence.fechaCarga)}</time>}
											<a href={evidence.urlArchivo} target="_blank" rel="noopener noreferrer">Abrir evidencia</a>
										</figure>
									);
								})}
							</div>
						)}
					</article>
				</section>

				<section className="reports-list detail-reports-list detail-history-section">
					<article className="report-card detail-history-card">
						<div className="detail-history-content">
							<h2 className="detail-history-title">Historial del incidente</h2>

							{historyError ? (
								<p className="detail-history-empty">No fue posible cargar el historial del incidente.</p>
							) : history.length === 0 ? (
								<p className="detail-history-empty">Aún no hay cambios registrados para este incidente.</p>
							) : (
								<ol className="detail-timeline" aria-label="Eventos del historial del incidente">
									{history.map((entry, index) => {
										const historyBadgeType = getBadgeType(entry.estadoIncidente?.toLowerCase?.());

										return (
										<li key={entry.idHistorial} className="detail-timeline-item">
											<span className="detail-timeline-marker" aria-hidden="true"></span>
											{index < history.length - 1 && <span className="detail-timeline-line" aria-hidden="true"></span>}

											<div className="detail-timeline-content">
												<div className={`status-badge ${historyBadgeType}`}>
													<span className="status-dot"></span>
													{entry.estadoIncidente || "Sin estado"}
												</div>
												<p className="detail-timeline-observation">{entry.observacion || "Sin observación"}</p>
												<time className="detail-timeline-date" dateTime={entry.fechaCambio || ""}>{formatDate(entry.fechaCambio)}</time>
											</div>
										</li>
										);
									})}
								</ol>
							)}
						</div>
					</article>
				</section>
			</section>
		</main>
	);
}

export default ReportDetail;
