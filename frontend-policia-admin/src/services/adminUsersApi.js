const AUTH_BASE_URL =
  import.meta.env.VITE_AUTH_API_BASE_URL ||
  "http://localhost:8081/api/v1/auth";

const USERS_BASE_URL = AUTH_BASE_URL.replace(/\/auth\/?$/, "/users");

async function request(path = "", options = {}) {
  const response = await fetch(`${USERS_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
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
    throw new Error(payload?.message || `Error ${response.status}: ${response.statusText}`);
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
