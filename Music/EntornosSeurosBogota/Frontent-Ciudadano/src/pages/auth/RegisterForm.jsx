import "./RegisterForm.css";
import { useState } from "react";

function RegisterForm() {

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setError("");

    alert("Formulario enviado correctamente");
  };

  return (
    <main className="form-container">
      <section className="form-card">

        <img
          src="/Logo E.S.png"
          alt="Logo Entornos Seguros"
          className="form-logo"
        />

        <form className="register-form" onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Nombre completo"
            required
          />

          <input
            type="number"
            placeholder="Cédula"
            required
          />

          <input
            type="email"
            placeholder="Correo electrónico"
            required
          />

          <input
            type="number"
            placeholder="Celular"
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <label className="terms-box">
            <input type="checkbox" />

             <span>
                Declaro tener mas de 18 años y acepto los{" "}
                <a href="#">Términos y Condiciones</a>, la{" "}
                <a href="#">Política de Privacidad</a> y la{" "}
                <a href="#">guía comunitaria</a>
            </span>
            </label>

            {
            error && (
                <p className="password-error">
                {error}
                </p>
            )
            }

          <button type="submit">
            Registrarse
          </button>

        </form>

      </section>
    </main>
  );
}

export default RegisterForm;