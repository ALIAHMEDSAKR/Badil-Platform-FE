import { Link } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import './home.css'

interface PlaceholderPageProps {
  title: string
  description: string
  actionLabel?: string
  actionTo?: string
}

export function PlaceholderPage({
  title,
  description,
  actionLabel = 'Back to Marketplace',
  actionTo = '/',
}: PlaceholderPageProps) {
  return (
    <div className="home-app">
      <Sidebar />
      <div className="home-main">
        <div className="home-content">
          <div className="home-placeholder">
            <h1 className="home-placeholder__title">{title}</h1>
            <p className="home-placeholder__desc">{description}</p>
            <Link to={actionTo} className="home-sidebar__cta">
              {actionLabel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
