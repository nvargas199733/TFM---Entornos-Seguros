const AUTH_API_BASE_URL =
  import.meta.env.VITE_AUTH_API_BASE_URL ||
  "http://localhost:8081/api/v1/auth";

const AUTH_STORAGE_KEY = "entornos_auth";
const ALLOWED_ROLES = new Set(["POLICIA", "ADMIN"]);

function normalizeRole(role) {
  return String(role || "").trim().toUpperCase();
}

export function getSession() {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    const session = JSON.parse(raw);
    const token = session?.token;
    const user = session?.user;
    const role = normalizeRole(user?.role);

    if (typeof token !== "string" || !token.trim() || !user?.id || !ALLOWED_ROLES.has(role)) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }

    return { ...session, user: { ...user, role } };
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function setSession(session) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export async function login(credentials) {
  let response;

  try {
    response = await fetch(`${AUTH_API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password
      })
    });
  } catch (cause) {
    const error = new Error("No fue posible conectar con el servicio de autenticación.");
    error.status = 0;
    throw error;
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const error = new Error(payload?.message || "Ocurrió un error al iniciar sesión.");
    error.status = response.status;
    throw error;
  }

  const role = normalizeRole(payload?.user?.role);
  if (
    typeof payload?.token !== "string" ||
    !payload.token.trim() ||
    !payload?.user?.id ||
    !ALLOWED_ROLES.has(role)
  ) {
    clearSession();
    const error = new Error("Esta cuenta no tiene acceso al panel policial.");
    error.status = 403;
    throw error;
  }

  const session = { ...payload, user: { ...payload.user, role } };
  setSession(session);
  return session;
}