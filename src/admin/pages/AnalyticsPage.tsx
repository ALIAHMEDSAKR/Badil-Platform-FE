export function AnalyticsPage() {
  return (
    <>
      <header className="admin-page-header">
        <div>
          <h1>Analytics &amp; Compliance</h1>
          <p className="admin-subtitle">
            CO₂ impact, waste diverted, transaction volumes, and exportable
            government compliance reports (SRS §3.6).
          </p>
        </div>
      </header>

      <div className="admin-placeholder">
        <h2>Reports dashboard</h2>
        <p>
          Add charts and downloadable PDFs when backend reporting endpoints are
          available. MVP metrics: factory performance, active offers, completed
          deals.
        </p>
      </div>
    </>
  )
}
