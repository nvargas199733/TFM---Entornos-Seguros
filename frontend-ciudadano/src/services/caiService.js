const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

function getFirstAvailableValue(source, keys, fallback = "") {
  for (const key of keys) {
    const value = source?.[key];

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return fallback;
}

function normalizeNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function normalizeId(cai) {
  const id = getFirstAvailableValue(cai, [
    "id",
    "codigo",
    "code",
    "caiId",
    "cai_id"
  ]);

  if (id) return id;

  const name = getFirstAvailableValue(cai, ["nombre", "name"], "CAI");
  const lat = getFirstAvailableValue(cai, ["latitud", "latitude", "lat"], "");
  const lng = getFirstAvailableValue(cai, ["longitud", "longitude", "lng"], "");

  return `${name}-${lat}-${lng}`;
}

export function normalizeCai(cai) {
  return {
    id: normalizeId(cai),

    codigo: getFirstAvailableValue(cai, ["codigo", "code"], ""),

    nombre: getFirstAvailableValue(
      cai,
      ["nombre", "name"],
      "CAI sin nombre"
    ),

    direccion: getFirstAvailableValue(
      cai,
      ["direccion", "address", "ubicacion", "location"],
      "Sin dirección registrada"
    ),

    telefono: getFirstAvailableValue(
      cai,
      ["telefono", "phone", "celular"],
      "Sin teléfono"
    ),

    localidad: getFirstAvailableValue(
      cai,
      ["localidad", "locality", "zona", "zone"],
      "Sin localidad"
    ),

    latitud: normalizeNumber(
      getFirstAvailableValue(cai, ["latitud", "latitude", "lat"])
    ),

    longitud: normalizeNumber(
      getFirstAvailableValue(cai, ["longitud", "longitude", "lng"])
    ),

    fotoUrl: getFirstAvailableValue(
      cai,
      [
        "fotoUrl",
        "foto_url",
        "photoUrl",
        "photo_url",
        "imagenUrl",
        "imagen_url",
        "imageUrl",
        "image_url",
        "foto",
        "imagen"
      ],
      ""
    )
  };
}

function normalizeListResponse(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.items)) return data.items;

  return [];
}

async function requestJson(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export async function getAllCai() {
  const data = await requestJson("/api/v1/cai");
  return normalizeListResponse(data).map(normalizeCai);
}

export async function getNearestCai(lat, lng) {
  const params = new URLSearchParams({
    lat: String(lat),
    lng: String(lng)
  });

  const data = await requestJson(`/api/v1/cai/nearest?${params.toString()}`);
  return normalizeCai(data);
}

export function resolveCaiImageUrl(fotoUrl) {
  if (!fotoUrl) return "";

  if (
    fotoUrl.startsWith("http://") ||
    fotoUrl.startsWith("https://") ||
    fotoUrl.startsWith("data:") ||
    fotoUrl.startsWith("blob:")
  ) {
    return fotoUrl;
  }

  return `${API_BASE_URL}${fotoUrl.startsWith("/") ? "" : "/"}${fotoUrl}`;
}