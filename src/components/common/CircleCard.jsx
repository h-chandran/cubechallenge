import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import './CircleCard.css'

const CircleCard = ({ circle }) => {
  return (
    <motion.div
      className="circle-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/app/community/circle/${circle.id}`} className="circle-card-link">
        <div className="circle-card-header">
          <h4 className="circle-card-name">{circle.name}</h4>
          <div className="circle-card-match">
            <span className="circle-card-match-value">{circle.matchPercentage}%</span>
            <span className="circle-card-match-label">match</span>
          </div>
        </div>

        <p className="circle-card-description">{circle.description}</p>

        <div className="circle-card-overlap">
          <div className="circle-card-overlap-section">
            <span className="circle-card-overlap-label">Top liked:</span>
            <div className="circle-card-ingredients">
              {circle.topLikedIngredients.slice(0, 3).map((ing, idx) => (
                <span key={idx} className="circle-card-ingredient circle-card-ingredient--liked">
                  {ing}
                </span>
              ))}
            </div>
          </div>
          <div className="circle-card-overlap-section">
            <span className="circle-card-overlap-label">Top avoided:</span>
            <div className="circle-card-ingredients">
              {circle.topDislikedIngredients.slice(0, 3).map((ing, idx) => (
                <span key={idx} className="circle-card-ingredient circle-card-ingredient--disliked">
                  {ing}
                </span>
              ))}
            </div>
          </div>
        </div>

        {circle.newPostsCount > 0 && (
          <div className="circle-card-badge">
            {circle.newPostsCount} new posts
          </div>
        )}
      </Link>
    </motion.div>
  )
}

export default CircleCard

