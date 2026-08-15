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
	try {
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
			const message = payload?.message || payload?.error || `Error ${response.status}: ${response.statusText}`;
			const error = new Error(message);
			error.status = response.status;
			throw error;
		}

		return payload;
	} catch (error) {
		if (error instanceof TypeError || error.message === "Failed to fetch") {
			const networkError = new Error("No fue posible conectar con el servicio de reportes.");
			networkError.status = 0;
			throw networkError;
		}

		throw error;
	}
}

function normalizeIncident(incident) {
	if (!incident) return null;

	return {
		id: incident.idIncidente,
		idIncidente: incident.idIncidente,
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
	const result = await request("/catalogs/types");
	const types = Array.isArray(result)
		? result
		: Array.isArray(result?.content)
			? result.content
			: [];

	return types
		.filter((type) => type && (type.estadoActivo === true || type.estadoActivo === "true"))
		.map((type) => ({
			...type,
			idTipoIncidente: Number(type.idTipoIncidente),
			estadoActivo: type.estadoActivo === true || type.estadoActivo === "true"
		}));
}

export async function resolveIncidentTypeId(typeName) {
	const types = await fetchIncidentTypes();
	const matchedType = types.find((type) => type.nombre === typeName);

	if (!matchedType) {
		throw new Error(`No se encontró el tipo de incidente ${typeName}`);
	}

	return matchedType.idTipoIncidente;
}

export async function createIncident(payload) {
	const incident = await request("", {
		method: "POST",
		body: JSON.stringify(payload),
	});

	return normalizeIncident(incident);
}

export async function fetchMyIncidents(idUsuario) {
	if (!idUsuario && idUsuario !== 0) {
		throw new Error("No se recibió un identificador de usuario válido.");
	}

	const result = await request(`?idUsuario=${encodeURIComponent(idUsuario)}`);
	const incidents = Array.isArray(result)
		? result
		: Array.isArray(result?.content)
			? result.content
			: null;

	if (!Array.isArray(incidents)) {
		throw new Error("Ocurrió un error al consultar tus reportes.");
	}

	return incidents.map(normalizeIncident).filter(Boolean);
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

export async function addIncidentEvidence(idIncidente, payload) {
	return request(`/${idIncidente}/evidences`, {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

export async function fetchIncidentEvidences(idIncidente) {
	return request(`/${idIncidente}/evidences`);
}
