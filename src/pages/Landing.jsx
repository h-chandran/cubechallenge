import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import AnimatedButton from '../components/common/AnimatedButton'
import AnimatedCard from '../components/common/AnimatedCard'
import './Landing.css'

const Landing = () => {
  return (
    <div className="landing">
      <div className="landing-hero">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="landing-hero-content"
        >
          <h1 className="landing-headline">
            Your Ingredient Fingerprint. Your Perfect Routine. People Like You.
          </h1>
          <p className="landing-subhead">
            Discover what your skin actually likes at the ingredient level. Build routines that work. 
            Connect with people who share your unique skin profile.
          </p>
          <Link to="/signup">
            <AnimatedButton variant="primary" className="landing-cta">
              Take the 2-minute survey
            </AnimatedButton>
          </Link>
        </motion.div>
      </div>

      <div className="landing-pillars">
        <AnimatedCard className="landing-pillar" delay={0.1}>
          <div className="landing-pillar-icon">🔬</div>
          <h3>Ingredient Fingerprint</h3>
          <p>
            We learn what ingredients work for your skin through your routine and check-ins. 
            No guessing—just data-driven insights.
          </p>
        </AnimatedCard>

        <AnimatedCard className="landing-pillar" delay={0.2}>
          <div className="landing-pillar-icon">✨</div>
          <h3>Smart Routine Logic</h3>
          <p>
            Build routines that respect ingredient compatibility, proper ordering, 
            and your personal preferences. No more conflicting products.
          </p>
        </AnimatedCard>

        <AnimatedCard className="landing-pillar" delay={0.3}>
          <div className="landing-pillar-icon">👥</div>
          <h3>Similarity Circles</h3>
          <p>
            Connect with people who share your ingredient fingerprint. 
            See what works for them, share your experiences, and learn together.
          </p>
        </AnimatedCard>
      </div>

      <footer className="landing-footer">
        <div className="landing-footer-content">
          <Link to="/privacy" className="landing-footer-link">Privacy Policy</Link>
          <span className="landing-footer-separator">•</span>
          <Link to="/disclaimer" className="landing-footer-link">Disclaimer</Link>
          <span className="landing-footer-separator">•</span>
          <Link to="/terms" className="landing-footer-link">Terms of Service</Link>
        </div>
        <p className="landing-footer-note">
          SkIntel is for informational purposes only. Consult a dermatologist for medical advice.
        </p>
      </footer>
    </div>
  )
}

export default Landing

