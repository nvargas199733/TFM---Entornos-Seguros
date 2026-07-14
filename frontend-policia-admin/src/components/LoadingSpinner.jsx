import "../styles/loading-spinner.css";

const LoadingSpinner = ({ message = "Cargando..." }) => {
  return (
    <div className="loading-spinner">
      <div className="loading-spinner__circle"></div>
      <p>{message}</p>
    </div>
  );
};

export default LoadingSpinner;