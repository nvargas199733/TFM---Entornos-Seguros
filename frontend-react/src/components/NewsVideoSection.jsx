import { useEffect, useState } from "react";
import policeVideo from "../assets/policia.mp4";
import wantedPeopleData from "../data/wantedPeopleData";

/*
  NewsVideoSection:
  Sección con video de fondo y carrusel automático.

  En este caso muestra personas ficticias buscadas
  por presuntos delitos.
*/
const wantedPeople = wantedPeopleData;
const NewsVideoSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  /*
    useEffect:
    Cambia automáticamente la persona mostrada
    cada 4 segundos.
  */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === wantedPeople.length - 1 ? 0 : prevIndex + 1,
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const person = wantedPeople[currentIndex];

  return (
    <section className="news-video">
      {/* Video de fondo */}
      <video className="news-video__background" autoPlay muted loop playsInline>
        <source src={policeVideo} type="video/mp4" />
      </video>

      {/* Capa oscura */}
      <div className="news-video__overlay"></div>

      {/* Contenido del carrusel */}
      <div className="news-video__content">
        <span className="news-video__tag">Personas buscadas</span>

        <article className="wanted-card">
          {/* FOTO */}
          <img
            src={person.photo}
            alt={person.names}
            className="wanted-card__image"
          />

          {/* INFORMACIÓN */}
          <div className="wanted-card__content">
            <h2 className="wanted-card__name">
              {person.names} {person.lastNames}
            </h2>

            <p className="wanted-card__alias">Alias: {person.alias}</p>

            <p className="wanted-card__detail">Edad: {person.age}</p>

            <p className="wanted-card__detail">
              Nacionalidad: {person.nationality}
            </p>

            <p className="wanted-card__detail">Recompensa: ${person.reward}</p>

            <p className="wanted-card__crimes">
              Delitos: {person.crimes.join(", ")}
            </p>
          </div>
        </article>
      </div>
    </section>
  );
};

export default NewsVideoSection;
