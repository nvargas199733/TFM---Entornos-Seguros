const OfficialReportView = ({ policeReport }) => {
  if (!policeReport) {
    return (
      <article className="official-report-view official-report-view--empty">
        <h2>Informe oficial</h2>
        <p>Este incidente aún no cuenta con informe policial.</p>
      </article>
    );
  }

  const {
    reportId,
    hasInjured,
    createdAt,
    officialDescription,
    actionsTaken,
    policeUserLoading,
    policeUserError,
    policeUser,
  } = policeReport;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleString("es-EC")
    : "Fecha no disponible";

  return (
    <article className="official-report-view">
      <h2>Informe oficial</h2>

      {/* ── 1. Identificación del informe ── */}
      <section className="official-report-view__section">
        <h3 className="official-report-view__section-title">Identificación</h3>
        {reportId && (
          <p>
            <strong>Informe #:</strong> {reportId}
          </p>
        )}
        <p>
          <strong>Fecha de atención:</strong> {formattedDate}
        </p>
        <p>
          <strong>¿Hubo heridos?:</strong> {hasInjured}
        </p>
      </section>

      {/* ── 2. Personal responsable ── */}
      <section className="official-report-view__section">
        <h3 className="official-report-view__section-title">Personal responsable</h3>

        {policeUserLoading && (
          <p role="status" className="official-report-view__info-loading">
            Consultando datos del personal responsable...
          </p>
        )}

        {!policeUserLoading && policeUserError && (
          <p role="alert" className="official-report-view__info-error">
            {policeUserError}
          </p>
        )}

        {!policeUserLoading && !policeUserError && policeUser && (
          <>
            <p>
              <strong>Nombre:</strong> {policeUser.fullName}
            </p>
            {policeUser.email && (
              <p>
                <strong>Correo:</strong> {policeUser.email}
              </p>
            )}
            <p>
              <strong>Rol:</strong> Policía
            </p>
          </>
        )}
      </section>

      {/* ── 3. Descripción oficial ── */}
      {officialDescription && (
        <section className="official-report-view__section">
          <h3 className="official-report-view__section-title">Descripción oficial</h3>
          <p className="official-report-view__text">{officialDescription}</p>
        </section>
      )}

      {/* ── 4. Acciones tomadas ── */}
      {actionsTaken && (
        <section className="official-report-view__section">
          <h3 className="official-report-view__section-title">Acciones tomadas</h3>
          <p className="official-report-view__text">{actionsTaken}</p>
        </section>
      )}

      {/* Fallback: contenido sin etiquetas (informes anteriores) */}
      {!officialDescription && !actionsTaken && (
        <section className="official-report-view__section">
          <h3 className="official-report-view__section-title">Descripción de la atención</h3>
          <p className="official-report-view__text">Sin contenido registrado.</p>
        </section>
      )}
    </article>
  );
};

export default OfficialReportView;