import { Link } from 'react-router-dom'
import { activeDisputes } from '../data/mockData'

export function DisputesPage() {
  return (
    <>
      <header className="admin-page-header">
        <div>
          <h1>Dispute Mediation</h1>
          <p className="admin-subtitle">
            Mediate inspection-period and escrow conflicts between buyers and
            sellers (SRS: transaction and dispute handling).
          </p>
        </div>
      </header>

      <div className="admin-placeholder">
        <h2>All active disputes</h2>
        <p>
          Central place for case assignment, SLA tracking, and resolution logs.
          Sample active cases: <strong>{activeDisputes.length}</strong>.{' '}
          <Link to="/admin" className="admin-link-doc" style={{ display: 'inline' }}>
            Dashboard queue
          </Link>
        </p>
      </div>
    </>
  )
}
