const OfficialReportView = ({ policeReport }) => {
  if (!policeReport) {
    return (
      <article className="official-report-view official-report-view--empty">
        <h2>Informe oficial</h2>
        <p>Este incidente aún no cuenta con informe policial.</p>
      </article>
    );
  }

  return (
    <article className="official-report-view">
      <h2>Informe oficial</h2>

      <p><strong>Policía:</strong> {policeReport.policeName}</p>
      <p><strong>Rango:</strong> {policeReport.policeRank}</p>
      <p><strong>Placa:</strong> {policeReport.badgeNumber}</p>
      <p><strong>Tipo:</strong> {policeReport.incidentType}</p>
      <p><strong>¿Hubo heridos?:</strong> {policeReport.hasInjured}</p>
      <p><strong>Fecha de atención:</strong> {new Date(policeReport.createdAt).toLocaleString()}</p>

      <h3>Descripción oficial</h3>
      <p>{policeReport.officialDescription}</p>

      <h3>Acciones tomadas</h3>
      <p>{policeReport.actionsTaken}</p>
    </article>
  );
};

export default OfficialReportView;