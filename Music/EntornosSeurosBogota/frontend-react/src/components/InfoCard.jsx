/*
  InfoCard:
  Componente reutilizable para mostrar información institucional.

  En esta pantalla lo usaremos para secciones como:
  - Misión
  - Visión

  Props:
  - icon: ícono representativo
  - title: título de la tarjeta
  - description: texto descriptivo
*/

const InfoCard = ({ icon, title, description }) => {
  return (
    <article className="info-card">
      {/* Ícono visual de la tarjeta */}
      <div className="info-card__icon">{icon}</div>

      {/* Contenido textual */}
      <div className="info-card__content">
        <h3 className="info-card__title">{title}</h3>

        <p className="info-card__description">{description}</p>
      </div>
    </article>
  );
};

export default InfoCard;