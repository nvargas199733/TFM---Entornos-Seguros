import "./Register.css";
import { useNavigate } from "react-router-dom";


function Register() {
  const navigate = useNavigate();

  return (
    <main className="register-container">
      <section className="register-content">

        <h1 className="register-title">
          Bienvenido a Entornos Seguros
        </h1>

        <p className="register-subtitle">Registra y consulta tus reportes de seguridad.</p>

        <img
          src="/Logo E.S.png"
          alt="Logo Entornos Seguros"
          className="register-logo"
        />

        <button
          className="register-button login-button"
          type="button"
          onClick={() => navigate("/login")}
        >
          Iniciar sesión
        </button>

        <button
          className="register-button create-account"
          type="button"
          onClick={() => navigate("/registro")}
        >
          Crear una cuenta
        </button>

      </section>
    </main>
  );
}

export default Register;