export const BOGOTA_CENTER = [4.6243, -74.0636];

export const BOGOTA_BOUNDS = [
  [4.47, -74.25],
  [4.83, -74.0]
];

export const FALLBACK_LOCATION = {
  lat: 4.6243,
  lng: -74.0636
};

export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocalización no disponible"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => reject(error),
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
}