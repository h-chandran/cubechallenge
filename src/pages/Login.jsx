import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AnimatedCard from '../components/common/AnimatedCard'
import AnimatedButton from '../components/common/AnimatedButton'
import AnimatedInput from '../components/common/AnimatedInput'
import './Auth.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agreedToDisclaimer, setAgreedToDisclaimer] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!agreedToDisclaimer) {
      setError('Please agree to the disclaimer to continue')
      return
    }

    setLoading(true)

    try {
      const { error } = await signIn(email, password)
      if (error) {
        setError(error.message)
      } else {
        // Check if user has completed onboarding
        const hasCompletedOnboarding = localStorage.getItem('onboarding_complete')
        if (!hasCompletedOnboarding) {
          navigate('/onboarding/survey')
        } else {
          navigate('/app/dashboard')
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <AnimatedCard className="auth-card">
        <h1 className="auth-title">Welcome to SkIntel</h1>
        <p className="auth-subtitle">Sign in to your account</p>

        {error && (
          <div className="auth-error">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <AnimatedInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />

          <AnimatedInput
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

          <label className="auth-checkbox">
            <input
              type="checkbox"
              checked={agreedToDisclaimer}
              onChange={(e) => setAgreedToDisclaimer(e.target.checked)}
              required
            />
            <span>I agree to the <Link to="/disclaimer" target="_blank">disclaimer</Link> and understand this is for informational purposes only</span>
          </label>

          <AnimatedButton
            type="submit"
            variant="primary"
            disabled={loading}
            className="auth-submit-button"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </AnimatedButton>
        </form>

        <p className="auth-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </AnimatedCard>
    </div>
  )
}

export default Login

