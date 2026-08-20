const INCIDENT_API_BASE_URL =
	import.meta.env.VITE_INCIDENT_API_BASE_URL ||
	"http://localhost:8082/api/v1/incidents";

const POLICE_REPORT_API_BASE_URL =
	import.meta.env.VITE_POLICE_REPORT_API_BASE_URL ||
	"http://localhost:8083/api/v1/police-reports";

import { clearSession, getSession } from "./authService";

function getIncidentAuthHeaders() {
	const token = getSession()?.token;
	if (typeof token !== "string" || !token.trim()) {
		const error = new Error("No hay una sesión válida para consultar los reportes.");
		error.status = 401;
		throw error;
	}

	return { Authorization: `Bearer ${token}` };
}

async function request(baseUrl, path = "", options = {}) {
	let response;
	const { headers: requestHeaders, ...requestOptions } = options;

	try {
		response = await fetch(`${baseUrl}${path}`, {
			...requestOptions,
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json",
				...(requestHeaders || {})
			}
		});
	} catch {
		const error = new Error("No fue posible conectar con el servicio de informes.");
		error.status = 0;
		throw error;
	}

	const contentType = response.headers.get("Content-Type") || "";
	let payload = null;

	try {
		payload = contentType.includes("application/json")
			? await response.json()
			: await response.text();
	} catch {
		payload = null;
	}

	if (!response.ok) {
		const message = typeof payload === "object" && payload !== null
			? payload.message
			: payload || `Error ${response.status}: ${response.statusText}`;
		const error = new Error(message);
		error.status = response.status;

		if (response.status === 401) {
			clearSession();
		}

		throw error;
	}

	return payload;
}

function normalizeIncident(incident) {
	if (!incident) return null;

	return {
		id: incident.idIncidente,
		type: incident.tipoIncidente,
		estadoIncidente: incident.estadoIncidente,
		status: incident.estadoIncidente?.toLowerCase?.() || incident.estadoIncidente,
		reportedAt: incident.fechaReporte,
		description: incident.descripcion,
		location: incident.direccionReferencia || "Sin referencia",
		reporterName: `Reportante #${incident.idUsuario}`,
		identification: `ID ${incident.idUsuario}`,
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

/**
 * Separa descripcionAtencion (campo del backend) en secciones independientes.
 * Tolera ausencia de etiquetas, valor null/undefined, diferencias de capitalización
 * y saltos de línea variables.
 *
 * @returns {{ officialDescription: string, actionsTaken: string }}
 */
export function parsePoliceReportDescription(value) {
	if (!value || typeof value !== "string") {
		return { officialDescription: "", actionsTaken: "" };
	}

	const normalized = value.replace(/\r\n/g, "\n").trim();

	// Buscar "Descripción oficial:" y "Acciones tomadas:" de forma insensible
	const descMatch = normalized.match(
		/[Dd]escripci[oó]n\s+oficial\s*:\s*([\s\S]*?)(?=\n{1,}\s*[Aa]cciones\s+tomadas\s*:|$)/
	);
	const actMatch = normalized.match(
		/[Aa]cciones\s+tomadas\s*:\s*([\s\S]*)$/
	);

	const officialDescription = descMatch ? descMatch[1].trim() : "";
	const actionsTaken = actMatch ? actMatch[1].trim() : "";

	// Si no se encontró ninguna etiqueta, todo el texto es la descripción general
	if (!officialDescription && !actionsTaken) {
		return { officialDescription: normalized, actionsTaken: "" };
	}

	return { officialDescription, actionsTaken };
}

function normalizePoliceReport(report) {
	if (!report) return null;

	const { officialDescription, actionsTaken } = parsePoliceReportDescription(
		report.descripcionAtencion
	);

	return {
		id: report.idReportePolicial,
		userReportId: report.idIncidente,
		policeId: report.idUsuarioPolicia,
		huboHeridos: report.huboHeridos ? "Sí" : "No",
		officialDescription,
		actionsTaken,
		createdAt: report.fechaReporte,
		updatedAt: report.fechaActualizacion,
		raw: report
	};
}


export async function fetchIncidents() {
	const incidents = await request(INCIDENT_API_BASE_URL, "", {
		headers: getIncidentAuthHeaders()
	});
	return incidents.map(normalizeIncident);
}

export async function fetchIncidentById(id) {
	const incident = await request(INCIDENT_API_BASE_URL, `/${id}`, {
		headers: getIncidentAuthHeaders()
	});
	return normalizeIncident(incident);
}

export async function fetchIncidentStatuses() {
	return request(INCIDENT_API_BASE_URL, "/catalogs/statuses", {
		headers: getIncidentAuthHeaders()
	});
}

export async function fetchIncidentEvidences(id) {
	return request(INCIDENT_API_BASE_URL, `/${id}/evidences`, {
		headers: getIncidentAuthHeaders()
	});
}

export async function fetchPoliceReportsByIncident(idIncidente) {
	const reports = await request(POLICE_REPORT_API_BASE_URL, `/by-incident/${idIncidente}`, {
		headers: getIncidentAuthHeaders()
	});
	return reports.map(normalizePoliceReport);
}

export async function createPoliceReport(payload) {
	const report = await request(POLICE_REPORT_API_BASE_URL, "", {
		method: "POST",
		headers: getIncidentAuthHeaders(),
		body: JSON.stringify(payload)
	});

	return normalizePoliceReport(report);
}

export async function updateIncidentStatus(idIncidente, payload) {
	const incident = await request(INCIDENT_API_BASE_URL, `/${idIncidente}/status`, {
		method: "PATCH",
		headers: getIncidentAuthHeaders(),
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

	return match.idEstadoIncidente;
}