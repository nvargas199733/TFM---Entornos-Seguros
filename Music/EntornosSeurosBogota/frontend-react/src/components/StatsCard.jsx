/*
  StatsCard:
  Componente reutilizable para mostrar estadísticas rápidas.

  Sirve para mostrar información resumida como:
  - cantidad total de incidentes
  - estadísticas semanales
  - barras visuales simples

  Props:
  - title: título de la tarjeta
  - value: número principal
  - description: texto descriptivo
  - items: lista de datos para mostrar barras
*/

const StatsCard = ({ title, value, description, items = [], chart }) => {
  return (
    <article className="stats-card">
      {/* Encabezado de la tarjeta */}
      <div className="stats-card__header">
        <h3 className="stats-card__title">{title}</h3>
        <span className="stats-card__value">{value}</span>
      </div>
      {/* Descripción breve */}
      <p className="stats-card__description">{description}</p>
      {chart && <div className="stats-card__chart">{chart}</div>}
      {/* Gráfico personalizado */}

      {/* Barras estadísticas */}
      {items.length > 0 && (
        <div className="stats-card__list">
          {items.map((item) => (
            <div className="stats-card__item" key={item.label}>
              <div className="stats-card__item-info">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>

              <div className="stats-card__bar">
                <div
                  className="stats-card__bar-fill"
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
};

export default StatsCard;
