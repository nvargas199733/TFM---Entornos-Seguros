const AUTH_API_BASE_URL =
	import.meta.env.VITE_AUTH_API_BASE_URL ||
	"http://localhost:8081/api/v1/auth";

const AUTH_STORAGE_KEY = "entornos_auth";

function parseErrorMessage(payload, fallback) {
	if (!payload) return fallback;
	if (typeof payload === "string") return payload;
	if (typeof payload.message === "string" && payload.message.trim()) {
		return payload.message;
	}
	return fallback;
}

async function request(path, options = {}) {
	const response = await fetch(`${AUTH_API_BASE_URL}${path}`, {
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
		throw new Error(
			parseErrorMessage(payload, `Error ${response.status}: ${response.statusText}`)
		);
	}

	return payload;
}

function saveSession(authResponse) {
	localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authResponse));
}

export function getSession() {
	const raw = localStorage.getItem(AUTH_STORAGE_KEY);
	if (!raw) return null;

	try {
		return JSON.parse(raw);
	} catch {
		localStorage.removeItem(AUTH_STORAGE_KEY);
		return null;
	}
}

export function clearSession() {
	localStorage.removeItem(AUTH_STORAGE_KEY);
}

export async function login(credentials) {
	const authResponse = await request("/login", {
		method: "POST",
		body: JSON.stringify(credentials)
	});

	saveSession(authResponse);
	return authResponse;
}

export async function register(payload) {
	const authResponse = await request("/register", {
		method: "POST",
		body: JSON.stringify(payload)
	});

	saveSession(authResponse);
	return authResponse;
}

export async function getMe() {
	const session = getSession();
	const token = session?.token;

	if (!token) {
		throw new Error("No hay sesión activa");
	}

	return request("/me", {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
}
