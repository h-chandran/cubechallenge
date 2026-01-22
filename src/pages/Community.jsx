import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import CircleCard from '../components/common/CircleCard'
import { mockCircles } from '../data/mockData'
import './Community.css'

const Community = () => {
  return (
    <div className="community">
      <div className="community-header">
        <h1>Community Hub</h1>
        <p className="community-subtitle">
          Connect with people who share your ingredient fingerprint
        </p>
      </div>

      <div className="community-circles">
        {mockCircles.map((circle, idx) => (
          <motion.div
            key={circle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <CircleCard circle={circle} />
          </motion.div>
        ))}
      </div>

      <div className="community-info">
        <h2>How Circles Work</h2>
        <p>
          Circles are communities of people with similar ingredient fingerprints. 
          We match you based on which ingredients work well for you and which ones to avoid. 
          Share experiences, discover products, and learn from others who understand your skin.
        </p>
      </div>
    </div>
  )
}

export default Community

