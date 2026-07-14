import "leaflet/dist/leaflet.css";
import "./CaiMap.css";

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  LocateFixed,
  MapPinned,
  Navigation,
  Phone,
  Shield,
  Star
} from "lucide-react";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap
} from "react-leaflet";

import L from "leaflet";

import {
  getAllCai,
  getNearestCai,
  resolveCaiImageUrl
} from "../../services/caiService";

import {
  BOGOTA_BOUNDS,
  BOGOTA_CENTER,
  FALLBACK_LOCATION,
  getCurrentLocation
} from "../../services/locationService";

const DEFAULT_CAI_PHOTO = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 420">
    <defs>
      <linearGradient id="sky" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#eaf7fb"/>
        <stop offset="1" stop-color="#ffffff"/>
      </linearGradient>
      <linearGradient id="brand" x1="0" x2="1">
        <stop offset="0" stop-color="#0d4876"/>
        <stop offset="1" stop-color="#408d9c"/>
      </linearGradient>
    </defs>

    <rect width="720" height="420" fill="url(#sky)"/>
    <path d="M0 335 C110 300 190 330 300 292 C430 247 520 295 720 250 L720 420 L0 420Z" fill="#d8eef3"/>

    <rect x="84" y="138" width="548" height="182" rx="20" fill="#ffffff"/>
    <rect x="84" y="138" width="548" height="54" rx="20" fill="url(#brand)"/>
    <rect x="84" y="176" width="548" height="16" fill="url(#brand)"/>

    <rect x="126" y="221" width="115" height="99" fill="#eef6fc"/>
    <rect x="282" y="221" width="115" height="99" fill="#eef6fc"/>
    <rect x="438" y="221" width="115" height="99" fill="#eef6fc"/>

    <rect x="326" y="249" width="62" height="71" rx="6" fill="#0d4876" opacity="0.9"/>

    <text x="136" y="173" font-family="Arial, sans-serif" font-size="38" font-weight="700" fill="#ffffff">
      CAI
    </text>

    <circle cx="508" cy="164" r="23" fill="#ffffff" opacity="0.95"/>
    <path d="M508 146 L526 154 L522 180 L508 187 L494 180 L490 154Z" fill="#408d9c"/>
  </svg>
`)}`;

function hasValidCoords(cai) {
  return Boolean(
    cai &&
    Number.isFinite(cai.latitud) &&
    Number.isFinite(cai.longitud)
  );
}

function areSameCai(first, second) {
  if (!first || !second) return false;
  return String(first.id) === String(second.id);
}

function getCaiImage(cai) {
  return resolveCaiImageUrl(cai?.fotoUrl) || DEFAULT_CAI_PHOTO;
}

function buildGoogleMapsUrl(cai, userLocation) {
  const destination = hasValidCoords(cai)
    ? `${cai.latitud},${cai.longitud}`
    : `${cai.direccion}, ${cai.localidad}, Bogotá, Colombia`;

  const params = new URLSearchParams({
    api: "1",
    destination,
    travelmode: "driving"
  });

  if (userLocation?.lat && userLocation?.lng) {
    params.set("origin", `${userLocation.lat},${userLocation.lng}`);
  }

  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

function openRoute(cai, userLocation) {
  if (!cai) return;

  window.open(
    buildGoogleMapsUrl(cai, userLocation),
    "_blank",
    "noopener,noreferrer"
  );
}

const caiIcon = L.divIcon({
  className: "cai-marker cai-marker--default",
  html: `
    <span class="cai-marker__pin">
      <span class="cai-marker__shield"></span>
    </span>
  `,
  iconSize: [42, 52],
  iconAnchor: [21, 46],
  popupAnchor: [0, -42]
});

const selectedCaiIcon = L.divIcon({
  className: "cai-marker cai-marker--selected",
  html: `
    <span class="cai-marker__pulse"></span>
    <span class="cai-marker__pin">
      <span class="cai-marker__shield"></span>
    </span>
  `,
  iconSize: [50, 60],
  iconAnchor: [25, 53],
  popupAnchor: [0, -50]
});

const userIcon = L.divIcon({
  className: "user-location-marker",
  html: `
    <span class="user-location-marker__pulse"></span>
    <span class="user-location-marker__dot"></span>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 17]
});

function LoadingBox({ text = "Cargando..." }) {
  return (
    <div className="cai-loading" role="status" aria-live="polite">
      <span className="cai-loading__circle" aria-hidden="true" />
      <span>{text}</span>
    </div>
  );
}

function CaiPopup({ cai, isSelected, isNearest, userLocation, onRoute }) {
  return (
    <article className="cai-popup">
      <img
        src={getCaiImage(cai)}
        alt={`Imagen de ${cai.nombre}`}
        className="cai-popup__image"
      />

      <div className="cai-popup__content">
        <div className="cai-popup__badges">
          {isSelected && <span>Seleccionado</span>}
          {isNearest && <span>Más cercano</span>}
        </div>

        <h3>{cai.nombre}</h3>
        <p>{cai.direccion}</p>
        <p>{cai.telefono || "Sin teléfono"}</p>
        <p>{cai.localidad}</p>

        <button type="button" onClick={() => onRoute(cai, userLocation)}>
          Cómo llegar
        </button>
      </div>
    </article>
  );
}

function LocateButton({ userLocation }) {
  const map = useMap();

  function centerMap() {
    const target = userLocation || FALLBACK_LOCATION;

    map.flyTo([target.lat, target.lng], userLocation ? 15 : 13, {
      duration: 0.8
    });
  }

  return (
    <button
      type="button"
      className="cai-map__locate-button"
      onClick={centerMap}
      aria-label="Centrar mapa en mi ubicación"
      title="Centrar mapa"
    >
      <LocateFixed size={30} />
    </button>
  );
}

function SelectedCaiController({ selectedCai }) {
  const map = useMap();

  useEffect(() => {
    if (!hasValidCoords(selectedCai)) return;

    map.flyTo([selectedCai.latitud, selectedCai.longitud], 15, {
      duration: 0.8
    });
  }, [map, selectedCai?.id]);

  return null;
}

function CaiMapView({
  caiList,
  nearestCai,
  selectedCai,
  userLocation,
  onSelectCai,
  onRoute
}) {
  const safeCaiList = useMemo(
    () => caiList.filter(hasValidCoords),
    [caiList]
  );

  const safeSelected = hasValidCoords(selectedCai) ? selectedCai : null;
  const safeNearest = hasValidCoords(nearestCai) ? nearestCai : null;

  const selectedIsInList = safeSelected
    ? safeCaiList.some((cai) => areSameCai(cai, safeSelected))
    : false;

  return (
    <MapContainer
      center={BOGOTA_CENTER}
      zoom={12}
      minZoom={11}
      maxZoom={18}
      maxBounds={BOGOTA_BOUNDS}
      maxBoundsViscosity={1}
      scrollWheelZoom
      className="cai-map"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <SelectedCaiController selectedCai={safeSelected} />
      <LocateButton userLocation={userLocation} />

      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>Tu ubicación actual</Popup>
        </Marker>
      )}

      {safeCaiList.map((cai) => {
        const isSelected = areSameCai(cai, safeSelected);
        const isNearest = areSameCai(cai, safeNearest);

        return (
          <Marker
            key={cai.id}
            position={[cai.latitud, cai.longitud]}
            icon={isSelected || isNearest ? selectedCaiIcon : caiIcon}
            eventHandlers={{
              click: () => onSelectCai(cai),
              popupopen: () => onSelectCai(cai)
            }}
          >
            <Popup maxWidth={280}>
              <CaiPopup
                cai={cai}
                isSelected={isSelected}
                isNearest={isNearest}
                userLocation={userLocation}
                onRoute={onRoute}
              />
            </Popup>
          </Marker>
        );
      })}

      {safeSelected && !selectedIsInList && (
        <Marker
          position={[safeSelected.latitud, safeSelected.longitud]}
          icon={selectedCaiIcon}
          eventHandlers={{
            click: () => onSelectCai(safeSelected),
            popupopen: () => onSelectCai(safeSelected)
          }}
        >
          <Popup maxWidth={280}>
            <CaiPopup
              cai={safeSelected}
              isSelected
              isNearest={areSameCai(safeSelected, safeNearest)}
              userLocation={userLocation}
              onRoute={onRoute}
            />
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

function CaiInfoCard({
  cai,
  nearestCai,
  isLoading,
  errorMessage,
  geoMessage,
  userLocation,
  onRoute
}) {
  const isNearest = areSameCai(cai, nearestCai);

  return (
    <aside className="cai-info-card">
      <div className="cai-info-card__top">
        <div className="cai-info-card__badge-icon">
          <Shield size={28} />
        </div>

        <div className="cai-info-card__title-group">
          <div className="cai-info-card__eyebrow-row">
            <span>{isNearest ? "CAI más cercano" : "CAI seleccionado"}</span>

            {isNearest && (
              <span className="cai-recommended-pill">
                <Star size={16} fill="currentColor" />
                Recomendado
              </span>
            )}
          </div>

          <h2>{cai?.nombre || "Selecciona un CAI"}</h2>
        </div>
      </div>

      {geoMessage && <p className="cai-info-card__note">{geoMessage}</p>}

      {isLoading && <LoadingBox text="Buscando CAI más cercano..." />}

      {!isLoading && errorMessage && (
        <p className="cai-info-card__error">{errorMessage}</p>
      )}

      {!isLoading && !errorMessage && !cai && (
        <p className="cai-info-card__empty">
          Toca un punto del mapa para ver la información del CAI.
        </p>
      )}

      {!isLoading && !errorMessage && cai && (
        <>
          <div className="cai-info-card__body">
            <div className="cai-info-card__details">
              <h3>{cai.nombre}</h3>

              <div className="cai-detail-line">
                <MapPinned size={22} />
                <span>{cai.direccion}</span>
              </div>

              <div className="cai-detail-line">
                <Phone size={22} />
                <span>{cai.telefono || "Sin teléfono"}</span>
              </div>

              <div className="cai-detail-line">
                <Building2 size={22} />
                <span>Localidad: {cai.localidad}</span>
              </div>
            </div>

            <img
              src={getCaiImage(cai)}
              alt={`Imagen de ${cai.nombre}`}
              className="cai-info-card__photo"
            />
          </div>

          <button
            type="button"
            className="cai-route-button"
            onClick={() => onRoute(cai, userLocation)}
          >
            <Navigation size={24} />
            Cómo llegar
          </button>
        </>
      )}
    </aside>
  );
}

function CaiStatusBar({ userLocation, isRealtime }) {
  return (
    <section className="cai-status-bar">
      <div className="cai-status-bar__location">
        <div className="cai-status-bar__pin">
          <MapPinned size={24} />
        </div>

        <div>
          <h3>{userLocation ? "Ubicación detectada" : "Ubicación aproximada"}</h3>
          <p>
            {userLocation
              ? "Usando tu ubicación actual"
              : "Usando el centro de Bogotá como referencia"}
          </p>
        </div>
      </div>

      <div className="cai-status-bar__realtime">
        <span className={isRealtime ? "is-active" : ""} />
        En tiempo real
      </div>
    </section>
  );
}

function CaiMap() {
  const navigate = useNavigate();

  const userSelectedRef = useRef(false);

  const [caiList, setCaiList] = useState([]);
  const [nearestCai, setNearestCai] = useState(null);
  const [selectedCai, setSelectedCai] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const [isLoadingCai, setIsLoadingCai] = useState(true);
  const [isLoadingNearest, setIsLoadingNearest] = useState(true);

  const [caiError, setCaiError] = useState(null);
  const [nearestError, setNearestError] = useState(null);
  const [geoMessage, setGeoMessage] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadCaiList() {
      setIsLoadingCai(true);
      setCaiError(null);

      try {
        const data = await getAllCai();

        if (!active) return;

        setCaiList(data);

        if (!userSelectedRef.current && data.length > 0) {
          setSelectedCai(data[0]);
        }
      } catch (error) {
        console.error("Error cargando CAI:", error);

        if (active) {
          setCaiError(
            "No se pudo cargar el listado de CAI. Verifica que el backend Java esté ejecutándose en http://localhost:8081."
          );
        }
      } finally {
        if (active) {
          setIsLoadingCai(false);
        }
      }
    }

    loadCaiList();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadNearest(coords) {
      setIsLoadingNearest(true);
      setNearestError(null);

      try {
        const data = await getNearestCai(coords.lat, coords.lng);

        if (!active) return;

        setNearestCai(data);

        if (!userSelectedRef.current) {
          setSelectedCai(data);
        }
      } catch (error) {
        console.error("Error obteniendo CAI cercano:", error);

        if (active) {
          setNearestError(
            "No se pudo obtener el CAI más cercano. Puedes seleccionar manualmente cualquier CAI del mapa."
          );

          setNearestCai(null);
        }
      } finally {
        if (active) {
          setIsLoadingNearest(false);
        }
      }
    }

    async function loadUserLocation() {
      try {
        const coords = await getCurrentLocation();

        if (!active) return;

        setUserLocation(coords);
        setGeoMessage(null);
        loadNearest(coords);
      } catch (error) {
        if (!active) return;

        const permissionDenied = error?.code === 1;

        setUserLocation(null);

        setGeoMessage(
          permissionDenied
            ? "Permiso de ubicación denegado. Se usará el centro de Bogotá como referencia."
            : "No se pudo obtener tu ubicación. Se usará el centro de Bogotá como referencia."
        );

        loadNearest(FALLBACK_LOCATION);
      }
    }

    loadUserLocation();

    return () => {
      active = false;
    };
  }, []);

  function handleSelectCai(cai) {
    userSelectedRef.current = true;
    setSelectedCai(cai);
  }

  function handleRoute(cai) {
    openRoute(cai, userLocation);
  }

  return (
    <main className="cai-page">
      <section className="cai-page__card">
        <header className="cai-page__header">
          <button
            className="cai-back-button"
            onClick={() => navigate("/menu")}
            aria-label="Volver al menú"
          >
            <ArrowLeft size={34} />
          </button>

          <div className="cai-page__title-block">
            <h1>Mapa de los CAI</h1>
          </div>

        </header>

        <section className="cai-summary-card">
          <div className="cai-summary-card__icon">
            <MapPinned size={34} />
          </div>

          <div className="cai-summary-card__text">
            <h2>CAI en Bogotá</h2>
            <p>Puntos de atención policial en la ciudad</p>
          </div>

          <div className="cai-summary-card__counter">
            {isLoadingCai ? "..." : `${caiList.length} CAI`}
          </div>
        </section>

        {caiError && <div className="cai-alert">{caiError}</div>}

        {!isLoadingCai && caiList.length === 0 && !caiError && (
          <div className="cai-alert">No hay CAI para mostrar.</div>
        )}

        <section className="cai-map-panel" aria-label="Mapa interactivo de CAI">
          {isLoadingCai ? (
            <div className="cai-map-placeholder">
              <LoadingBox text="Cargando mapa de CAI..." />
            </div>
          ) : (
            <CaiMapView
              caiList={caiList}
              nearestCai={nearestCai}
              selectedCai={selectedCai}
              userLocation={userLocation}
              onSelectCai={handleSelectCai}
              onRoute={openRoute}
            />
          )}
        </section>

        <CaiInfoCard
          cai={selectedCai}
          nearestCai={nearestCai}
          isLoading={isLoadingNearest && !selectedCai}
          errorMessage={!selectedCai ? nearestError : null}
          geoMessage={geoMessage}
          userLocation={userLocation}
          onRoute={handleRoute}
        />

        <CaiStatusBar userLocation={userLocation} isRealtime={!isLoadingCai} />
      </section>
    </main>
  );
}

export default CaiMap;