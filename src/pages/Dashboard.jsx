import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AnimatedCard from '../components/common/AnimatedCard'
import AnimatedButton from '../components/common/AnimatedButton'
import './Dashboard.css'

const Dashboard = () => {
  const { user } = useAuth()

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome to SkIntel</h1>
        <p className="dashboard-subtitle">
          Your personalized ingredient-centric skincare companion
        </p>
      </div>

      <div className="dashboard-grid">
        <AnimatedCard className="dashboard-card" delay={0.1}>
          <div className="dashboard-card-icon">🔍</div>
          <h3>Ingredient Checker</h3>
          <p>Analyze product ingredients for compatibility, sensitivities, and conflicts</p>
          <Link to="/ingredient-checker">
            <AnimatedButton variant="primary" className="dashboard-card-button">
              Check Ingredients
            </AnimatedButton>
          </Link>
        </AnimatedCard>

        <AnimatedCard className="dashboard-card" delay={0.2}>
          <div className="dashboard-card-icon">✨</div>
          <h3>Routine Builder</h3>
          <p>Build your personalized skincare routine with automatic compatibility checking</p>
          <Link to="/routine-builder">
            <AnimatedButton variant="primary" className="dashboard-card-button">
              Build Routine
            </AnimatedButton>
          </Link>
        </AnimatedCard>

        <AnimatedCard className="dashboard-card" delay={0.3}>
          <div className="dashboard-card-icon">👤</div>
          <h3>Profile & Preferences</h3>
          <p>Manage your ingredient preferences, sensitivities, and skin type</p>
          <Link to="/profile">
            <AnimatedButton variant="secondary" className="dashboard-card-button">
              View Profile
            </AnimatedButton>
          </Link>
        </AnimatedCard>
      </div>

      <AnimatedCard className="dashboard-info" delay={0.4}>
        <h3>About SkIntel</h3>
        <p>
          SkIntel is an ingredient-centric skincare app that helps you understand how ingredients
          interact with each other and your skin. Unlike traditional skin-type based approaches,
          we focus on what your skin actually likes and doesn't like at the ingredient level.
        </p>
        <ul className="dashboard-features">
          <li>✓ Ingredient compatibility checking</li>
          <li>✓ Personalized sensitivity tracking</li>
          <li>✓ Function-based routine organization</li>
          <li>✓ Conflict detection and warnings</li>
        </ul>
      </AnimatedCard>
    </div>
  )
}

export default Dashboard

