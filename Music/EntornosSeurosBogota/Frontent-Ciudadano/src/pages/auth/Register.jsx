import "./Register.css";

function Register() {
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

        <button className="register-button create-account">
          Registrarse
        </button>

        <button className="register-button login-button">
          Inicio de sesión
        </button>

        <label className="terms-box">
          <input type="checkbox" />

          <span>
            Declaro tener mas de 18 años y acepto los{" "}
            <a href="#">Términos y Condiciones</a>, la{" "}
            <a href="#">Política de Privacidad</a> y la{" "}
            <a href="#">guía comunitaria</a>
          </span>
        </label>

      </section>
    </main>
  );
}

export default Register;