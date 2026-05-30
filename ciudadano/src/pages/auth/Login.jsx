import "./Login.css";
import { useNavigate } from "react-router-dom";


function Login() {
    const navigate = useNavigate();
  return (
    <main className="login-container">
      <section className="login-card">
        <img
          src="/Logo E.S.png"
          alt="Logo Entornos Seguros"
          className="login-logo"
        />

        <form className="login-form"
            onSubmit={(e) => {
                e.preventDefault();
                navigate("/menu");
            }}
            >
          <input
            type="email"
            placeholder="Correo electrónico"
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            required
          />

          <a href="#" className="forgot-password">
            ¿Olvidé mi contraseña?
          </a>

          <button type="submit">
            Iniciar sesión
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;