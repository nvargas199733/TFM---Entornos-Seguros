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

      </section>
    </main>
  );
}

export default Register;