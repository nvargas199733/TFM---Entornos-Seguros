/*
  wantedPeopleData:
  Datos simulados de personas buscadas.

  Luego esta información vendrá desde el backend.
*/

const wantedPeopleData = [
  {
    id: 1,

    names: "Carlos",

    lastNames: "Medina",

    alias: "Alias Norte",

    age: 34,

    nationality: "Ecuatoriana",

    reward: 5000,

    crimes: [
      "Robo armado",
      "Asalto a locales comerciales",
    ],

    photo:
      "https://randomuser.me/api/portraits/men/32.jpg",
  },

  {
    id: 2,

    names: "Kevin",

    lastNames: "Gaibor Buenaño",

    alias: "Fénix 180",

    age: 28,

    nationality: "Colombiana",

    reward: 12000,

    crimes: [
      "Extorsión",
      "Microtráfico",
    ],

    photo:
      "https://randomuser.me/api/portraits/men/45.jpg",
  },

  {
    id: 3,

    names: "Andrés",

    lastNames: "Vera Castro",

    alias: "El Flaco",

    age: 39,

    nationality: "Peruana",

    reward: 8000,

    crimes: [
      "Secuestro",
      "Robo agravado",
    ],

    photo:
      "https://randomuser.me/api/portraits/men/18.jpg",
  },

  {
    id: 4,

    names: "Luis",

    lastNames: "Morales Díaz",

    alias: "El Mono",

    age: 31,

    nationality: "Ecuatoriana",

    reward: 15000,

    crimes: [
      "Tráfico de armas",
      "Asociación ilícita",
    ],

    photo:
      "https://randomuser.me/api/portraits/men/12.jpg",
  },

  {
    id: 5,

    names: "Jhon",

    lastNames: "Cedeño Paredes",

    alias: "Sombra",

    age: 26,

    nationality: "Venezolana",

    reward: 9500,

    crimes: [
      "Robo de vehículos",
      "Amenazas",
    ],

    photo:
      "https://randomuser.me/api/portraits/men/51.jpg",
  },
];

export default wantedPeopleData;