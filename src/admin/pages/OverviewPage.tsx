import { useState, useEffect } from 'react';
import {
  Users,
  Shield,
  AlertTriangle,
  Timer,
  Filter,
  Download,
  FileText,
  Check,
  X,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import type { AdminDashboardDto } from '../../types/auth';
import {
  pendingFactoryVerifications,
  activeDisputes,
  highPriorityCount,
} from '../data/mockData';

export function OverviewPage() {
  const [dashboard, setDashboard] = useState<AdminDashboardDto | null>(null);
  const [dashLoading, setDashLoading] = useState(true);
  const [dashError, setDashError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function fetchDashboard() {
      try {
        const data = await adminApi.getDashboard();
        if (!cancelled) setDashboard(data);
      } catch {
        if (!cancelled) setDashError('Failed to load dashboard statistics.');
      } finally {
        if (!cancelled) setDashLoading(false);
      }
    }
    fetchDashboard();
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <header className="admin-page-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="admin-subtitle">
            Platform overview, pending verifications, and active disputes.
          </p>
        </div>
        <div className="admin-header-actions">
          <button type="button" className="admin-btn">
            <Filter size={16} strokeWidth={2} aria-hidden />
            Filters
          </button>
          <button type="button" className="admin-btn admin-btn--primary">
            <Download size={16} strokeWidth={2} aria-hidden />
            Export Report
          </button>
        </div>
      </header>

      {/* ── KPI Stats from API ─────────────────────────────────────── */}
      <section className="admin-kpi-grid" aria-label="Key metrics">
        <article className="admin-kpi-card">
          <div className="admin-kpi-card__icon">
            <Users size={20} strokeWidth={2} />
          </div>
          <p className="admin-kpi-card__label">Total Users</p>
          <p className="admin-kpi-card__value">
            {dashLoading ? '—' : dashError ? '!' : dashboard?.totalUsers ?? 0}
          </p>
        </article>
        <article className="admin-kpi-card">
          <div
            className="admin-kpi-card__icon"
            style={{
              color: 'var(--admin-blue)',
              background: 'var(--admin-blue-dim)',
            }}
          >
            <Shield size={20} strokeWidth={2} />
          </div>
          <p className="admin-kpi-card__label">Total Admins</p>
          <p className="admin-kpi-card__value">
            {dashLoading ? '—' : dashError ? '!' : dashboard?.totalAdmins ?? 0}
          </p>
        </article>
        <article className="admin-kpi-card">
          <div
            className="admin-kpi-card__icon"
            style={{
              color: 'var(--admin-coral)',
              background: 'var(--admin-coral-dim)',
            }}
          >
            <AlertTriangle size={20} strokeWidth={2} />
          </div>
          <p className="admin-kpi-card__label">Active Disputes</p>
          <p className="admin-kpi-card__value">{activeDisputes.length}</p>
        </article>
        <article className="admin-kpi-card">
          <div className="admin-kpi-card__icon">
            <Timer size={20} strokeWidth={2} />
          </div>
          <p className="admin-kpi-card__label">Pending Verifications</p>
          <p className="admin-kpi-card__value">{pendingFactoryVerifications.length}</p>
        </article>
      </section>

      {dashError && (
        <div className="admin-form-message admin-form-message--error" style={{ marginBottom: '1rem' }}>
          <AlertTriangle size={16} />
          <span>{dashError}</span>
        </div>
      )}

      {/* ── Pending Factory Verifications (mock) ───────────────────── */}
      <section className="admin-panel" aria-labelledby="pending-factory-title">
        <div className="admin-panel__head">
          <h2 id="pending-factory-title">Pending Factory Verifications</h2>
          <div className="admin-panel__head-actions">
            <button type="button" className="admin-btn admin-btn--ghost">
              View All History
            </button>
          </div>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Factory Name</th>
                <th>Industry Type</th>
                <th>Submitted Doc</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingFactoryVerifications.map((row) => (
                <tr key={row.id}>
                  <td>
                    <p className="admin-cell-title">{row.factoryName}</p>
                    <p className="admin-cell-sub">{row.id}</p>
                  </td>
                  <td>{row.industry}</td>
                  <td>
                    <a href="#doc" className="admin-link-doc">
                      <FileText size={14} strokeWidth={2} aria-hidden />
                      {row.documentName}
                    </a>
                  </td>
                  <td>{row.submittedAt}</td>
                  <td>
                    <span
                      className={
                        row.status === 'Pending'
                          ? 'admin-pill admin-pill--pending'
                          : 'admin-pill admin-pill--reviewing'
                      }
                    >
                      {row.status}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions-row">
                      <button
                        type="button"
                        className="admin-icon-btn"
                        title="Approve"
                        aria-label={`Approve ${row.factoryName}`}
                      >
                        <Check size={18} strokeWidth={2.5} />
                      </button>
                      <button
                        type="button"
                        className="admin-icon-btn admin-icon-btn--danger"
                        title="Reject"
                        aria-label={`Reject ${row.factoryName}`}
                      >
                        <X size={18} strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Active Disputes (mock) ─────────────────────────────────── */}
      <section className="admin-panel" aria-labelledby="disputes-queue-title">
        <div className="admin-panel__head">
          <h2 id="disputes-queue-title">Active Disputes Queue</h2>
          <div className="admin-panel__head-actions">
            <span className="admin-badge admin-badge--coral">
              HIGH PRIORITY: {highPriorityCount}
            </span>
          </div>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Dispute ID</th>
                <th>Parties Involved</th>
                <th>Issue Type</th>
                <th>Value</th>
                <th>Priority</th>
                <th>Resolution</th>
              </tr>
            </thead>
            <tbody>
              {activeDisputes.map((d) => (
                <tr key={d.id}>
                  <td>
                    <p className="admin-cell-title">{d.id}</p>
                    <p className="admin-cell-sub">Opened: {d.openedAgo} ago</p>
                  </td>
                  <td>
                    <div className="admin-parties">
                      <span>{d.partyA}</span>
                      <ArrowRight className="admin-arrow" aria-hidden />
                      <span>{d.partyB}</span>
                    </div>
                  </td>
                  <td>{d.issueType}</td>
                  <td>{d.value}</td>
                  <td>
                    <span
                      className={
                        d.priority === 'CRITICAL'
                          ? 'admin-pill admin-pill--critical'
                          : d.priority === 'HIGH'
                            ? 'admin-pill admin-pill--high'
                            : 'admin-pill admin-pill--medium'
                      }
                    >
                      {d.priority}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions-row">
                      <button
                        type="button"
                        className="admin-btn admin-btn--primary admin-btn--sm"
                      >
                        <Shield size={14} strokeWidth={2} aria-hidden />
                        Mediate
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn--dark admin-btn--sm"
                      >
                        <MessageSquare size={14} strokeWidth={2} aria-hidden />
                        Review Chat
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
