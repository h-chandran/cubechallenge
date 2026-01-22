import { motion } from 'framer-motion'
import './InsightCard.css'

const InsightCard = ({ insight, onFeedback }) => {
  const getConfidenceBadge = (confidence) => {
    const badges = {
      high: { label: 'High Confidence', color: 'success' },
      medium: { label: 'Medium Confidence', color: 'warning' },
      low: { label: 'Low Confidence', color: 'info' }
    }
    return badges[confidence] || badges.medium
  }

  const badge = getConfidenceBadge(insight.confidence)

  return (
    <motion.div
      className="insight-card"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="insight-card-header">
        <h4 className="insight-card-title">Latest Insight</h4>
        <span className={`insight-card-badge insight-card-badge--${badge.color}`}>
          {badge.label}
        </span>
      </div>

      <p className="insight-card-message">{insight.message}</p>

      {insight.reason && (
        <p className="insight-card-reason">{insight.reason}</p>
      )}

      {onFeedback && (
        <div className="insight-card-feedback">
          <button
            className="insight-card-feedback-btn insight-card-feedback-btn--correct"
            onClick={() => onFeedback('correct')}
          >
            ✓ Correct
          </button>
          <button
            className="insight-card-feedback-btn insight-card-feedback-btn--incorrect"
            onClick={() => onFeedback('incorrect')}
          >
            ✗ Incorrect
          </button>
        </div>
      )}
    </motion.div>
  )
}

export default InsightCard

