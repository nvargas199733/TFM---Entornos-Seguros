//Este componente recibe propt que luego se reemplaza con la información enviada,
// sirve para reutilizar componentes
import { Link } from "react-router-dom";

const ActionCard = ({ title, icon, description, link }) => {
  return (
    <Link to={link} className="action-card__link">
      <article className="action-card">
        <div className="action-card__icon">{icon}</div>

        <h3 className="action-card__title">{title}</h3>

        <p className="action-card__description">{description}</p>
      </article>
    </Link>
  );
};

export default ActionCard;
