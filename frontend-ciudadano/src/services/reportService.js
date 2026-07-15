const INCIDENT_API_BASE_URL =
	import.meta.env.VITE_INCIDENT_API_BASE_URL ||
	"http://localhost:8082/api/v1/incidents";

const AUTH_STORAGE_KEY = "entornos_auth";

function getSession() {
	const raw = localStorage.getItem(AUTH_STORAGE_KEY);
	if (!raw) return null;

	try {
		return JSON.parse(raw);
	} catch {
		localStorage.removeItem(AUTH_STORAGE_KEY);
		return null;
	}
}

function getAuthHeaders() {
	const session = getSession();
	const token = session?.token;

	return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path = "", options = {}) {
	const response = await fetch(`${INCIDENT_API_BASE_URL}${path}`, {
		headers: {
			"Content-Type": "application/json",
			...getAuthHeaders(),
			...(options.headers || {})
		},
		...options,
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
		idUsuario: incident.idUsuario,
		idTipoIncidente: incident.idTipoIncidente,
		type: incident.tipoIncidente,
		status: incident.estadoIncidente?.toLowerCase?.() || incident.estadoIncidente,
		reportedAt: incident.fechaReporte,
		updatedAt: incident.fechaActualizacion,
		description: incident.descripcion,
		location: incident.direccionReferencia || "Sin referencia",
		latitud: incident.latitud,
		longitud: incident.longitud,
		directionReference: incident.direccionReferencia,
		raw: incident,
	};
}

export function getCurrentSessionUser() {
	const session = getSession();
	return session?.user || null;
}

export async function fetchIncidentTypes() {
	return request("/catalogs/types");
}

export async function resolveIncidentTypeId(typeName) {
	const types = await fetchIncidentTypes();
	const matchedType = types.find((type) => type.nombre === typeName);

	if (!matchedType) {
		throw new Error(`No se encontró el tipo de incidente ${typeName}`);
	}

	return matchedType.id;
}

export async function createIncident(payload) {
	const incident = await request("", {
		method: "POST",
		body: JSON.stringify(payload),
	});

	return normalizeIncident(incident);
}

export async function fetchMyIncidents(idUsuario) {
	const incidents = await request(`?idUsuario=${encodeURIComponent(idUsuario)}`);
	return incidents.map(normalizeIncident);
}

export async function fetchIncidentById(id) {
	const incident = await request(`/${id}`);
	return normalizeIncident(incident);
}

export async function fetchIncidentHistory(id) {
	return request(`/${id}/history`);
}

export async function fetchIncidentStatuses() {
	return request("/catalogs/statuses");
}
