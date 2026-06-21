import { Link } from 'react-router-dom'
import { pendingFactoryVerifications } from '../data/mockData'

export function VerificationsPage() {
  return (
    <>
      <header className="admin-page-header">
        <div>
          <h1>Factory Verifications</h1>
          <p className="admin-subtitle">
            Review submitted documents and approve or reject factory profiles per
            SRS compliance requirements.
          </p>
        </div>
      </header>

      <div className="admin-placeholder">
        <h2>Verification queue</h2>
        <p>
          This section extends the overview table with filters, batch actions,
          and full history. Quick link:{' '}
          <Link to="/admin" className="admin-link-doc" style={{ display: 'inline' }}>
            Back to overview
          </Link>
        </p>
        <p style={{ marginTop: '1rem' }}>
          Pending in queue: <strong>{pendingFactoryVerifications.length}</strong>{' '}
          (sample data)
        </p>
      </div>
    </>
  )
}
