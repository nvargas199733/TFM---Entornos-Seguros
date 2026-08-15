import { Car, House, PersonStanding, ShieldAlert, UserSearch } from "lucide-react";

const VISUALS_BY_KEY = {
	actividad_sospechosa: {
		key: "actividad_sospechosa",
		Icon: UserSearch,
		colorClass: "teal",
		displayTitle: "Actividad sospechosa",
		description: "Comportamientos o situaciones inusuales"
	},
	emergencia_seguridad: {
		key: "emergencia_seguridad",
		Icon: ShieldAlert,
		colorClass: "blue",
		displayTitle: "Emergencia de Seguridad",
		description: "Situaciones que ponen en riesgo la seguridad"
	},
	robo_casa: {
		key: "robo_casa",
		Icon: House,
		colorClass: "green",
		displayTitle: "Robo a casa",
		description: "Robo o hurto en viviendas"
	},
	robo_persona: {
		key: "robo_persona",
		Icon: PersonStanding,
		colorClass: "sky",
		displayTitle: "Robo a persona",
		description: "Robo o hurto a personas"
	},
	robo_vehiculo: {
		key: "robo_vehiculo",
		Icon: Car,
		colorClass: "red",
		displayTitle: "Robo de vehiculo",
		description: "Robo o hurto de vehiculo"
	}
};

const FALLBACK_VISUAL = {
	key: "desconocido",
	Icon: ShieldAlert,
	colorClass: "neutral",
	displayTitle: "Tipo de incidente",
	description: "Tipo no clasificado visualmente"
};

function normalizeTypeName(value) {
	return String(value || "")
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.trim()
		.replace(/\s+/g, " ");
}

function resolveVisualKeyByName(name) {
	const normalized = normalizeTypeName(name);

	if (normalized === "emergencia de seguridad") return "emergencia_seguridad";
	if (normalized === "robo a persona") return "robo_persona";
	if (normalized === "robo de vehiculo") return "robo_vehiculo";
	if (normalized === "robo a casa") return "robo_casa";
	if (normalized === "actividad sospechosa") return "actividad_sospechosa";

	// TODO: replace name normalization fallback when backend exposes a stable code/slug for type visuals.
	return null;
}

export function resolveIncidentTypeVisual(type) {
	const keyFromState = type?.visualKey;
	if (keyFromState && VISUALS_BY_KEY[keyFromState]) {
		return VISUALS_BY_KEY[keyFromState];
	}

	const keyFromName = resolveVisualKeyByName(type?.nombre || type?.nombreTipo || type?.type);
	if (keyFromName && VISUALS_BY_KEY[keyFromName]) {
		return VISUALS_BY_KEY[keyFromName];
	}

	return FALLBACK_VISUAL;
}

export function toIncidentTypeNavigationState(type) {
	const visual = resolveIncidentTypeVisual(type);

	return {
		idTipoIncidente: Number(type.idTipoIncidente),
		nombreTipo: type.nombre,
		visualKey: visual.key
	};
}
