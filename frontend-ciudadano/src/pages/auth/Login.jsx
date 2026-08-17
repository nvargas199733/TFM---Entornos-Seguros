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
          alt="Entornos Seguros"
          className="login-logo"
        />

        <form className="login-form" onSubmit={handleSubmit}>
          <h1>Bienvenido a Entornos Seguros</h1>
          <p className="login-subtitle">Inicia sesión para registrar y consultar tus reportes.</p>

          <label htmlFor="citizen-email">Correo electrónico</label>
          <input
            id="citizen-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="citizen-password">Contraseña</label>
          <input
            id="citizen-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && <p className="password-error" role="alert">{error}</p>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
          </button>

          <button className="login-register-button" type="button" onClick={() => navigate("/registro")}>
            Crear una cuenta
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;