import { motion } from 'framer-motion'
import AnimatedButton from './AnimatedButton'
import './ProductCard.css'

const ProductCard = ({ 
  product, 
  matchScore, 
  reason, 
  onAddToAM, 
  onAddToPM, 
  onSave,
  showActions = true 
}) => {
  const getMatchColor = (score) => {
    if (score >= 80) return 'high'
    if (score >= 60) return 'medium'
    return 'low'
  }

  return (
    <motion.div
      className="product-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="product-card-header">
        <div className="product-card-info">
          <h4 className="product-card-name">{product.name}</h4>
          <p className="product-card-brand">{product.brand}</p>
        </div>
        {matchScore !== undefined && (
          <div className={`product-card-score product-card-score--${getMatchColor(matchScore)}`}>
            <span className="product-card-score-value">{matchScore}</span>
            <span className="product-card-score-label">match</span>
          </div>
        )}
      </div>

      {reason && (
        <p className="product-card-reason">{reason}</p>
      )}

      <p className="product-card-description">{product.description}</p>

      {showActions && (
        <div className="product-card-actions">
          {onAddToAM && (
            <AnimatedButton
              variant="outline"
              className="product-card-action"
              onClick={() => onAddToAM(product)}
            >
              Add to AM
            </AnimatedButton>
          )}
          {onAddToPM && (
            <AnimatedButton
              variant="outline"
              className="product-card-action"
              onClick={() => onAddToPM(product)}
            >
              Add to PM
            </AnimatedButton>
          )}
          {onSave && (
            <AnimatedButton
              variant="secondary"
              className="product-card-action"
              onClick={() => onSave(product)}
            >
              Save
            </AnimatedButton>
          )}
        </div>
      )}
    </motion.div>
  )
}

export default ProductCard

