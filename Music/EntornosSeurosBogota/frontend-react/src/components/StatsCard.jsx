/*
  Componente reutilizable de estadísticas.

  Sirve para mostrar:
  - métricas
  - gráficos
  - información resumida
  dentro del dashboard policial.
*/

const StatsCard = ({ title, value, details }) => {
  return (

    <article className="stats-card">

      {/* Título de la tarjeta */}
      <h3 className="stats-card__title">
        {title}
      </h3>

      {/* Valor principal */}
      <div className="stats-card__value">
        {value}
      </div>

      {/* Información adicional */}
      <p className="stats-card__details">
        {details}
      </p>

    </article>

  );
};

export default StatsCard;