import "../styles/official-report-form.css";

const OfficialReportForm = ({
  userReport,
  policeUser,
  officialDescription,
  setOfficialDescription,
  actionsTaken,
  setActionsTaken,
  hasInjured,
  setHasInjured,
  handleSubmit,
  submitting,
  error,
}) => {
  return (
    <form className="official-report" onSubmit={handleSubmit}>
      <h1 className="official-report__title">Informe oficial</h1>

      <section className="official-report__section">
        <p>
          <strong>Referencia del incidente:</strong> {userReport.id}
        </p>
      </section>

      <section className="official-report__section">
        <h2>Datos del policía</h2>
        <p>
          <strong>Nombre:</strong> {policeUser.fullName}
        </p>
        <p>
          <strong>Correo:</strong> {policeUser.email}
        </p>
      </section>

      <section className="official-report__section">
        <h2>Datos del incidente</h2>
        <p>
          <strong>Tipo de incidente:</strong> {userReport.type}
        </p>
        <p>
          <strong>Ubicación:</strong> {userReport.location}
        </p>

        <label className="official-report__label">
          ¿Hubo heridos?
          <select
            value={hasInjured}
            onChange={(event) => setHasInjured(event.target.value)}
          >
            <option value="No">No</option>
            <option value="Sí">Sí</option>
          </select>
        </label>
      </section>

      <section className="official-report__section">
        <label className="official-report__label">
          Descripción oficial
          <textarea
            value={officialDescription}
            onChange={(event) => setOfficialDescription(event.target.value)}
            placeholder="Describe oficialmente el incidente..."
            required
          />
        </label>
      </section>

      <section className="official-report__section">
        <label className="official-report__label">
          Acciones tomadas
          <textarea
            value={actionsTaken}
            onChange={(event) => setActionsTaken(event.target.value)}
            placeholder="Describe las acciones tomadas..."
            required
          />
        </label>
      </section>

      {error && <div className="official-report__error" role="alert">{error}</div>}

      <button className="official-report__button" type="submit" disabled={submitting}>
        {submitting ? "Enviando..." : "Enviar y finalizar"}
      </button>
    </form>
  );
};

export default OfficialReportForm;