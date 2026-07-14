import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";


function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate("/menu");
    } catch (serviceError) {
      setError(serviceError.message || "No se pudo iniciar sesión");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-container">
      <section className="login-card">
        <img
          src="/Logo E.S.png"
          alt="Logo Entornos Seguros"
          className="login-logo"
        />

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <a href="#" className="forgot-password">
            ¿Olvidé mi contraseña?
          </a>

          {error && <p className="password-error">{error}</p>}

          <button type="submit">
            {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;