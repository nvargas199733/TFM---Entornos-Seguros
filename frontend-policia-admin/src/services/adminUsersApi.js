import { clearSession, getSession } from "./authService";

const AUTH_BASE_URL =
  import.meta.env.VITE_AUTH_API_BASE_URL ||
  "http://localhost:8081/api/v1/auth";

const USERS_BASE_URL = AUTH_BASE_URL.replace(/\/auth\/?$/, "/users");

function getAdminAuthHeaders() {
  const session = getSession();
  const token = session?.token;
  if (typeof token !== "string" || !token.trim() || token === "null" || token === "undefined") {
    const error = new Error("No hay una sesión válida para consultar la gestión de usuarios.");
    error.status = 401;
    throw error;
  }

  const cleanToken = token.trim().replace(/^Bearer\s+/i, "");
  return {
    Authorization: `Bearer ${cleanToken}`,
    Accept: "application/json",
  };
}

async function request(path = "", options = {}) {
  let authHeaders = {};
  try {
    authHeaders = getAdminAuthHeaders();
  } catch (err) {
    if (err.status === 401) {
      clearSession();
    }
    throw err;
  }

  let response;
  const { headers: requestHeaders, ...restOptions } = options;

  try {
    response = await fetch(`${USERS_BASE_URL}${path}`, {
      ...restOptions,
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
        ...(requestHeaders || {}),
      },
    });
  } catch {
    const error = new Error("No fue posible conectar con el servicio de usuarios.");
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
    const message =
      typeof payload === "object" && payload !== null
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

function normalizeRole(role) {
  if (!role) return "";

  const upper = role.toUpperCase();

  if (upper === "USUARIO") return "usuario";
  if (upper === "ADMINISTRADOR") return "administrador";
  if (upper === "POLICIA" || upper === "POLICÍA") return "policia";

  return role.toLowerCase();
}

function denormalizeRole(role) {
  if (!role) return "USUARIO";

  const lower = role.toLowerCase();

  if (lower === "usuario") return "USUARIO";
  if (lower === "administrador") return "ADMINISTRADOR";
  if (lower === "policia" || lower === "policía") return "POLICIA";

  return role.toUpperCase();
}

function normalizeUser(user) {
  return {
    id: user.id,
    identification: user.cedula,
    fullName: user.fullName,
    phone: user.telefono,
    email: user.email,
    role: normalizeRole(user.role),
    active: user.activo,
    createdAt: user.fechaCreacion,
    raw: user,
  };
}

function toApiPayload(formData) {
  return {
    cedula: formData.identification,
    fullName: formData.fullName,
    telefono: formData.phone,
    email: formData.email,
    role: denormalizeRole(formData.role),
    password: formData.password,
  };
}

export async function fetchAdminUsers() {
  const users = await request();
  return users.map(normalizeUser);
}

export async function fetchAdminUserById(id) {
  const user = await request(`/${id}`);
  return normalizeUser(user);
}

export async function createAdminUser(formData) {
  const user = await request("", {
    method: "POST",
    body: JSON.stringify(toApiPayload(formData)),
  });

  return normalizeUser(user);
}

export async function updateAdminUser(id, formData) {
  const user = await request(`/${id}`, {
    method: "PUT",
    body: JSON.stringify(toApiPayload(formData)),
  });

  return normalizeUser(user);
}

export async function deleteAdminUser(id) {
  await request(`/${id}`, {
    method: "DELETE",
  });
}
