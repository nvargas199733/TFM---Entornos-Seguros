import "./RegisterForm.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/authService";

function RegisterForm() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [cedula, setCedula] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function splitFullName(value) {
    const normalized = value.trim().replace(/\s+/g, " ");
    const parts = normalized.split(" ");

    if (parts.length < 2) {
      return { nombres: normalized, apellidos: "-" };
    }

    const middle = Math.ceil(parts.length / 2);
    return {
      nombres: parts.slice(0, middle).join(" "),
      apellidos: parts.slice(middle).join(" ")
    };
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setError("");
    setIsSubmitting(true);

    const { nombres, apellidos } = splitFullName(fullName);

    try {
      await register({
        cedula,
        nombres,
        apellidos,
        telefono,
        email,
        password
      });

      navigate("/menu");
    } catch (serviceError) {
      setError(serviceError.message || "No se pudo completar el registro");
    } finally {
      setIsSubmitting(false);
    }
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
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Cédula"
            value={cedula}
            onChange={(event) => setCedula(event.target.value.replace(/\D/g, ""))}
            required
          />

          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <input
            type="text"
            name="celular"
            placeholder="Celular"
            pattern="[0-9]{10}"
            inputMode="numeric"
            maxLength="10"
            minLength="10"
            value={telefono}
            onChange={(event) =>
              setTelefono(event.target.value.replace(/\D/g, "").slice(0, 10))
            }
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
            {isSubmitting ? "Registrando..." : "Registrarse"}
          </button>

        </form>

      </section>
    </main>
  );
}

export default RegisterForm;