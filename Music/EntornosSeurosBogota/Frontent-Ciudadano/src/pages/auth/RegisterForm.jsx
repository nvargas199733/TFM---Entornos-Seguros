import "./RegisterForm.css";

function RegisterForm() {
  return (
    <main className="form-container">
      <section className="form-card">

        <img
          src="/Logo E.S.png"
          alt="Logo Entornos Seguros"
          className="form-logo"
        />

        <form className="register-form">

          <input
            type="text"
            placeholder="Nombre completo"
          />

          <input
            type="text"
            placeholder="Cédula"
          />

          <input
            type="email"
            placeholder="Correo electrónico"
          />

          <input
            type="tel"
            placeholder="Celular"
          />

          <input
            type="password"
            placeholder="Contraseña"
          />

          <input
            type="password"
            placeholder="Confirmar contraseña"
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

          <button type="submit">
            Registrarse
          </button>

        </form>

      </section>
    </main>
  );
}

export default RegisterForm;