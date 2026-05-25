

/*
  reportsData:
  Datos simulados de reportes ciudadanos.

  Preparado para futura conexión con backend/API.
*/

const reportsData = [
  {
    id: 1,
    type: "Robo",
    status: "pendiente",
    reportedAt: "2026-05-17T14:35:00",
    description: "Robo a una persona en la vía pública.",
    location: "Av. Las Américas",
    reporterName: "Juan Pérez",
    identification: "0987654321",
    phone: "0987123456",
    evidenceImage:
      "https://images.unsplash.com/photo-1518770660439-4636190af475",
  },

  {
    id: 2,
    type: "Accidente",
    status: "pendiente",
    reportedAt: "2026-05-17T13:50:00",
    description: "Choque entre dos vehículos particulares.",
    location: "Av. Centenario",
    reporterName: "María González",
    identification: "0912345678",
    phone: "0991234567",
    evidenceImage:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
  },

  {
    id: 3,
    type: "Vandalismo",
    status: "pendiente",
    reportedAt: "2026-05-17T12:15:00",
    description: "Daños a señalización pública.",
    location: "Av. Quito",
    reporterName: "Carlos Medina",
    identification: "0923456789",
    phone: "0987654321",
    evidenceImage:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
  },

  {
    id: 4,
    type: "Robo",
    status: "atendido",
    reportedAt: "2026-05-16T19:40:00",
    description: "Intento de robo en local comercial.",
    location: "Calle Bolívar",
    reporterName: "Andrea López",
    identification: "0934567890",
    phone: "0998765432",
    evidenceImage:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a",
  },

  {
    id: 5,
    type: "Accidente",
    status: "pendiente",
    reportedAt: "2026-05-16T18:10:00",
    description: "Motociclista perdió el control del vehículo.",
    location: "Av. Colón",
    reporterName: "Pedro Zambrano",
    identification: "0945678901",
    phone: "0976543210",
    evidenceImage:
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d",
  },

  {
    id: 6,
    type: "Vandalismo",
    status: "pendiente",
    reportedAt: "2026-05-16T15:20:00",
    description: "Grafitis en edificio público.",
    location: "Parque Central",
    reporterName: "Sofía Herrera",
    identification: "0956789012",
    phone: "0965432109",
    evidenceImage:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
  },

  {
    id: 7,
    type: "Robo",
    status: "pendiente",
    reportedAt: "2026-05-15T21:15:00",
    description: "Robo de celular en parada de buses.",
    location: "Terminal Terrestre",
    reporterName: "Luis Andrade",
    identification: "0967890123",
    phone: "0954321098",
    evidenceImage:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f",
  },

  {
    id: 8,
    type: "Accidente",
    status: "atendido",
    reportedAt: "2026-05-15T18:40:00",
    description: "Vehículo impactó un poste eléctrico.",
    location: "Av. García Moreno",
    reporterName: "Valentina Ruiz",
    identification: "0978901234",
    phone: "0943210987",
    evidenceImage:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7",
  },

  {
    id: 9,
    type: "Vandalismo",
    status: "pendiente",
    reportedAt: "2026-05-15T11:30:00",
    description: "Daños a juegos infantiles del parque.",
    location: "Parque del Norte",
    reporterName: "Kevin Morales",
    identification: "0989012345",
    phone: "0932109876",
    evidenceImage:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  },

  {
    id: 10,
    type: "Robo",
    status: "pendiente",
    reportedAt: "2026-05-14T20:50:00",
    description: "Sustracción de cartera en centro comercial.",
    location: "Mall del Río",
    reporterName: "Camila Torres",
    identification: "0990123456",
    phone: "0921098765",
    evidenceImage:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a",
  },

  {
    id: 11,
    type: "Accidente",
    status: "pendiente",
    reportedAt: "2026-05-14T14:15:00",
    description: "Colisión leve entre taxis.",
    location: "Av. 9 de Octubre",
    reporterName: "Jorge Cedeño",
    identification: "0911223344",
    phone: "0912345678",
    evidenceImage:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
  },

  {
    id: 12,
    type: "Vandalismo",
    status: "atendido",
    reportedAt: "2026-05-13T17:25:00",
    description: "Rotura de luminarias públicas.",
    location: "Ciudadela Universitaria",
    reporterName: "Daniela Vega",
    identification: "0922334455",
    phone: "0999988776",
    evidenceImage:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
  },

  {
    id: 13,
    type: "Robo",
    status: "pendiente",
    reportedAt: "2026-05-13T10:40:00",
    description: "Asalto a repartidor de domicilio.",
    location: "Av. Principal",
    reporterName: "Miguel Castro",
    identification: "0933445566",
    phone: "0988877665",
    evidenceImage:
      "https://images.unsplash.com/photo-1518770660439-4636190af475",
  },

  {
    id: 14,
    type: "Accidente",
    status: "pendiente",
    reportedAt: "2026-05-12T16:55:00",
    description: "Caída de motociclista en curva.",
    location: "Vía Milagro",
    reporterName: "Paula Mendoza",
    identification: "0944556677",
    phone: "0977766554",
    evidenceImage:
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d",
  },

  {
    id: 15,
    type: "Vandalismo",
    status: "pendiente",
    reportedAt: "2026-05-12T12:45:00",
    description: "Daños a parada de buses.",
    location: "Av. Universitaria",
    reporterName: "Andrés Flores",
    identification: "0955667788",
    phone: "0966655443",
    evidenceImage:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
  },

  {
    id: 16,
    type: "Robo",
    status: "pendiente",
    reportedAt: "2026-05-11T21:10:00",
    description: "Robo de bicicleta en zona residencial.",
    location: "Cdla. Los Almendros",
    reporterName: "Fernanda León",
    identification: "0966778899",
    phone: "0955544332",
    evidenceImage:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f",
  },

  {
    id: 17,
    type: "Accidente",
    status: "atendido",
    reportedAt: "2026-05-11T09:35:00",
    description: "Vehículo se salió de la vía.",
    location: "Autopista Norte",
    reporterName: "Ricardo Salazar",
    identification: "0977889900",
    phone: "0944433221",
    evidenceImage:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7",
  },

  {
    id: 18,
    type: "Vandalismo",
    status: "pendiente",
    reportedAt: "2026-05-10T20:05:00",
    description: "Destrucción de cámaras comunitarias.",
    location: "Barrio Central",
    reporterName: "Lucía Paredes",
    identification: "0988990011",
    phone: "0933322110",
    evidenceImage:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  },

  {
    id: 19,
    type: "Robo",
    status: "pendiente",
    reportedAt: "2026-05-10T15:25:00",
    description: "Robo de accesorios de vehículo.",
    location: "Av. Río Amazonas",
    reporterName: "David Molina",
    identification: "0999001122",
    phone: "0922211009",
    evidenceImage:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a",
  },

  {
    id: 20,
    type: "Accidente",
    status: "pendiente",
    reportedAt: "2026-05-09T11:50:00",
    description: "Choque entre motocicleta y automóvil.",
    location: "Redondel Norte",
    reporterName: "Gabriela Ríos",
    identification: "0910112233",
    phone: "0911100098",
    evidenceImage:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
  },

    {
    id: 21,
    type: "Robo",
    status: "pendiente",
    reportedAt: "2026-05-25T09:20:00",
    description: "Robo de celular en zona comercial.",
    location: "Av. Principal",
    reporterName: "Mateo Aguilar",
    identification: "0912233445",
    phone: "0991122334",
    evidenceImage:
      "https://images.unsplash.com/photo-1518770660439-4636190af475",
  },

  {
    id: 22,
    type: "Accidente",
    status: "pendiente",
    reportedAt: "2026-05-24T16:45:00",
    description: "Choque leve entre automóvil y motocicleta.",
    location: "Av. Universitaria",
    reporterName: "Camila Herrera",
    identification: "0923344556",
    phone: "0982233445",
    evidenceImage:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
  },

  {
    id: 23,
    type: "Vandalismo",
    status: "pendiente",
    reportedAt: "2026-05-24T11:30:00",
    description: "Daños a una parada de transporte público.",
    location: "Calle Central",
    reporterName: "José Zambrano",
    identification: "0934455667",
    phone: "0973344556",
    evidenceImage:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
  },

  {
    id: 24,
    type: "Robo",
    status: "atendido",
    reportedAt: "2026-05-23T18:10:00",
    description: "Intento de robo en local de comida.",
    location: "Malecón",
    reporterName: "Daniela Torres",
    identification: "0945566778",
    phone: "0964455667",
    evidenceImage:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a",
  },

  {
    id: 25,
    type: "Accidente",
    status: "pendiente",
    reportedAt: "2026-05-22T08:55:00",
    description: "Vehículo detenido por falla mecánica en vía principal.",
    location: "Av. Los Chirijos",
    reporterName: "Ricardo Ponce",
    identification: "0956677889",
    phone: "0955566778",
    evidenceImage:
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d",
  },

  {
    id: 26,
    type: "Vandalismo",
    status: "pendiente",
    reportedAt: "2026-05-21T20:25:00",
    description: "Pintura no autorizada en muro comunitario.",
    location: "Barrio Norte",
    reporterName: "Valeria León",
    identification: "0967788990",
    phone: "0946677889",
    evidenceImage:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
  },
];

export default reportsData;