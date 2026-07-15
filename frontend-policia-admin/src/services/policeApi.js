const INCIDENT_API_BASE_URL =
	import.meta.env.VITE_INCIDENT_API_BASE_URL ||
	"http://localhost:8082/api/v1/incidents";

const POLICE_REPORT_API_BASE_URL =
	import.meta.env.VITE_POLICE_REPORT_API_BASE_URL ||
	"http://localhost:8083/api/v1/police-reports";

const DEFAULT_EVIDENCE_IMAGE =
	"https://images.unsplash.com/photo-1516321318423-f06f85e504b3";

async function request(baseUrl, path = "", options = {}) {
	const response = await fetch(`${baseUrl}${path}`, {
		headers: {
			"Content-Type": "application/json",
			...(options.headers || {})
		},
		...options
	});

	let payload = null;

	try {
		payload = await response.json();
	} catch {
		payload = null;
	}

	if (!response.ok) {
		const message = payload?.message || `Error ${response.status}: ${response.statusText}`;
		throw new Error(message);
	}

	return payload;
}

function normalizeIncident(incident) {
	if (!incident) return null;

	return {
		id: incident.idIncidente,
		type: incident.tipoIncidente,
		status: incident.estadoIncidente?.toLowerCase?.() || incident.estadoIncidente,
		reportedAt: incident.fechaReporte,
		description: incident.descripcion,
		location: incident.direccionReferencia || "Sin referencia",
		reporterName: `Usuario ${incident.idUsuario}`,
		identification: `ID ${incident.idUsuario}`,
		phone: "No disponible",
		evidenceImage: DEFAULT_EVIDENCE_IMAGE,
		idUsuario: incident.idUsuario,
		idTipoIncidente: incident.idTipoIncidente,
		idEstadoIncidente: incident.idEstadoIncidente,
		fechaActualizacion: incident.fechaActualizacion,
		latitud: incident.latitud,
		longitud: incident.longitud,
		direccionReferencia: incident.direccionReferencia,
		raw: incident
	};
}

function normalizePoliceReport(report) {
	if (!report) return null;

	return {
		id: report.idReportePolicial,
		userReportId: report.idIncidente,
		policeId: report.idUsuarioPolicia,
		huboHeridos: report.huboHeridos ? "Sí" : "No",
		officialDescription: report.descripcionAtencion,
		actionsTaken: report.descripcionAtencion,
		createdAt: report.fechaReporte,
		updatedAt: report.fechaActualizacion,
		raw: report
	};
}

export async function fetchIncidents() {
	const incidents = await request(INCIDENT_API_BASE_URL);
	return incidents.map(normalizeIncident);
}

export async function fetchIncidentById(id) {
	const incident = await request(INCIDENT_API_BASE_URL, `/${id}`);
	return normalizeIncident(incident);
}

export async function fetchIncidentStatuses() {
	return request(INCIDENT_API_BASE_URL, "/catalogs/statuses");
}

export async function fetchPoliceReportsByIncident(idIncidente) {
	const reports = await request(POLICE_REPORT_API_BASE_URL, `/by-incident/${idIncidente}`);
	return reports.map(normalizePoliceReport);
}

export async function createPoliceReport(payload) {
	const report = await request(POLICE_REPORT_API_BASE_URL, "", {
		method: "POST",
		body: JSON.stringify(payload)
	});

	return normalizePoliceReport(report);
}

export async function updateIncidentStatus(idIncidente, payload) {
	const incident = await request(INCIDENT_API_BASE_URL, `/${idIncidente}/status`, {
		method: "PATCH",
		body: JSON.stringify(payload)
	});

	return normalizeIncident(incident);
}

export async function finalizePoliceAttention({
	idIncidente,
	idUsuarioPolicia,
	huboHeridos,
	descripcionAtencion,
	idEstadoAtendido,
	idEstadoResponsable,
	observacion = "Informe policial registrado"
}) {
	const createdReport = await createPoliceReport({
		idIncidente,
		idUsuarioPolicia,
		huboHeridos,
		descripcionAtencion
	});

	if (idEstadoAtendido) {
		await updateIncidentStatus(idIncidente, {
			idEstadoIncidente: idEstadoAtendido,
			idUsuarioResponsable: idEstadoResponsable || idUsuarioPolicia,
			observacion
		});
	}

	return createdReport;
}

export async function resolveIncidentStatusId(statusName) {
	const statuses = await fetchIncidentStatuses();
	const match = statuses.find((status) => status.nombre?.toUpperCase() === statusName.toUpperCase());

	if (!match) {
		throw new Error(`No se encontro el estado ${statusName}`);
	}

	return match.id;
}