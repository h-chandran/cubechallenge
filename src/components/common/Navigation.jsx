import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import AnimatedButton from './AnimatedButton'
import './Navigation.css'

const Navigation = () => {
  const { user, signOut } = useAuth()
  const location = useLocation()

  const handleSignOut = async () => {
    await signOut()
  }

  const isActive = (path) => {
    return location.pathname === path ? 'active' : ''
  }

  // Don't show navigation on landing page or auth pages
  const isPublicPage = location.pathname === '/' || 
                       location.pathname === '/login' || 
                       location.pathname === '/signup'

  if (!user || isPublicPage) {
    return null
  }

  return (
    <nav className="navigation">
      <div className="navigation-container">
        <Link to="/app/dashboard" className="navigation-logo">
          <span className="logo-icon">🧴</span>
          <span className="logo-text">SkIntel</span>
        </Link>

        <div className="navigation-links">
          <Link to="/app/dashboard" className={`navigation-link ${isActive('/app/dashboard')}`}>
            Dashboard
          </Link>
          <Link to="/app/search" className={`navigation-link ${isActive('/app/search')}`}>
            Search
          </Link>
          <Link to="/app/routine" className={`navigation-link ${isActive('/app/routine')}`}>
            Routine
          </Link>
          <Link to="/app/community" className={`navigation-link ${isActive('/app/community')}`}>
            Community
          </Link>
          <Link to="/app/fingerprint" className={`navigation-link ${isActive('/app/fingerprint')}`}>
            Fingerprint
          </Link>
          <Link to="/app/scanner" className={`navigation-link ${isActive('/app/scanner')}`}>
            Scanner
          </Link>
        </div>

        <div className="navigation-actions">
          <AnimatedButton variant="outline" onClick={handleSignOut}>
            Sign Out
          </AnimatedButton>
        </div>
      </div>
    </nav>
  )
}

export default Navigation

