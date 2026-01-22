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

  if (!user) {
    return null
  }

  return (
    <nav className="navigation">
      <div className="navigation-container">
        <Link to="/dashboard" className="navigation-logo">
          <span className="logo-icon">🧴</span>
          <span className="logo-text">SkIntel</span>
        </Link>

        <div className="navigation-links">
          <Link to="/dashboard" className={`navigation-link ${isActive('/dashboard')}`}>
            Dashboard
          </Link>
          <Link to="/ingredient-checker" className={`navigation-link ${isActive('/ingredient-checker')}`}>
            Ingredient Checker
          </Link>
          <Link to="/routine-builder" className={`navigation-link ${isActive('/routine-builder')}`}>
            Routine Builder
          </Link>
          <Link to="/profile" className={`navigation-link ${isActive('/profile')}`}>
            Profile
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

