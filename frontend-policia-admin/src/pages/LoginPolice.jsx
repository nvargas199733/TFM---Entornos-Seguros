import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { LockKeyhole } from "lucide-react";
import { getSession, login } from "../services/authService";
import "../styles/login-police.css";

function LoginPolice() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (getSession()) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login({ email: email.trim(), password });
      navigate(location.state?.from || "/", { replace: true });
    } catch (loginError) {
      if (loginError?.message === "Esta cuenta no tiene acceso al panel policial.") {
        setError(loginError.message);
      } else if (loginError?.status === 401 || loginError?.status === 403) {
        setError("Correo o contraseña incorrectos.");
      } else if (loginError?.status === 0) {
        setError("No fue posible conectar con el servicio de autenticación.");
      } else {
        setError("Ocurrió un error al iniciar sesión.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-police">
      <form className="login-police__form" onSubmit={handleSubmit}>
        <LockKeyhole className="login-police__icon" size={32} aria-hidden="true" />
        <h1>Panel policial</h1>

        <label htmlFor="police-email">Correo</label>
        <input
          id="police-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="police-password">Contraseña</label>
        <input
          id="police-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {error && <p className="login-police__error" role="alert">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>
      </form>
    </main>
  );
}

export default LoginPolice;