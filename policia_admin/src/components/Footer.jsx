/*
  Footer:
  Pie de página institucional del sistema.
*/

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer__content">

        {/* Información principal */}
        <div className="footer__section">

          <h3 className="footer__title">
            Entornos Seguros
          </h3>

          <p className="footer__text">
            Plataforma de seguridad ciudadana y monitoreo comunitario.
          </p>

        </div>


        {/* Contactos */}
        <div className="footer__section">

          <h4 className="footer__subtitle">
            Contacto
          </h4>

          <p className="footer__text">
            📞 +593 99 999 9999
          </p>

          <p className="footer__text">
            ✉ soporte@entornosseguros.ec
          </p>

        </div>


        {/* Dirección */}
        <div className="footer__section">

          <h4 className="footer__subtitle">
            Dirección
          </h4>

          <p className="footer__text">
            Bogotá, Colombia
          </p>

          <p className="footer__text">
            Centro de monitoreo y seguridad urbana.
          </p>

        </div>

      </div>


      {/* Parte inferior */}
      <div className="footer__bottom">

        © 2026 Entornos Seguros — Todos los derechos reservados.

      </div>

    </footer>
  );
};

export default Footer;