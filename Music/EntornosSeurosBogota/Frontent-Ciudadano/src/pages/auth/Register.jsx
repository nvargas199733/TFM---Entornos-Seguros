import "./Register.css";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    navigate("/registro");
  };

  return (
    <main className="register-container">
      <section className="register-content">

        <h1 className="register-title">
          Bienvenidos a:
        </h1>

        <img
          src="/Logo E.S.png"
          alt="Logo Entornos Seguros"
          className="register-logo"
        />

        <button 
        className="register-button create-account"
        onClick={() => navigate("/registro")}
        >
          Registrarse
        </button>

        <button className="register-button login-button">
          Inicio de sesión
        </button>

      </section>
    </main>
  );
}

export default Register;