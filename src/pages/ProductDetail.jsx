import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import AnimatedCard from '../components/common/AnimatedCard'
import AnimatedButton from '../components/common/AnimatedButton'
import { products, getProductById } from '../data/products'
import { ingredients, getIngredientById } from '../data/ingredients'
import { useUserPreferences } from '../contexts/UserPreferencesContext'
import { mockCircles } from '../data/mockData'
import './ProductDetail.css'

const ProductDetail = () => {
  const { id } = useParams()
  const product = getProductById(id)
  const { preferences } = useUserPreferences()

  if (!product) {
    return (
      <div className="product-detail">
        <div className="product-detail-error">
          <h2>Product not found</h2>
          <Link to="/app/search">Back to Search</Link>
        </div>
      </div>
    )
  }

  // Calculate match score
  let matchScore = 50
  let reasons = []
  const productIngredients = product.ingredients || []

  if (preferences) {
    const liked = preferences.liked_ingredients || []
    const disliked = preferences.disliked_ingredients || []
    const sensitivities = preferences.sensitivities || []

    const likedMatches = productIngredients.filter(ing => liked.includes(ing))
    const dislikedMatches = productIngredients.filter(ing => 
      disliked.includes(ing) || sensitivities.includes(ing)
    )

    matchScore += likedMatches.length * 15
    matchScore -= dislikedMatches.length * 20
    matchScore = Math.max(0, Math.min(100, matchScore))

    if (likedMatches.length > 0) {
      reasons.push(`Contains ${likedMatches.length} ingredient(s) that work well for you`)
    }
    if (dislikedMatches.length > 0) {
      reasons.push(`Contains ${dislikedMatches.length} ingredient(s) to be cautious about`)
    }
  }

  if (reasons.length === 0) {
    reasons.push('Standard compatibility')
  }

  // Get top matching circle
  const topCircle = mockCircles[0]

  // Categorize ingredients
  const ingredientDetails = productIngredients.map(ingId => {
    const ing = getIngredientById(ingId)
    let status = 'neutral'
    if (preferences) {
      if (preferences.liked_ingredients?.includes(ingId)) status = 'liked'
      if (preferences.disliked_ingredients?.includes(ingId)) status = 'disliked'
      if (preferences.sensitivities?.includes(ingId)) status = 'sensitive'
    }
    return { ...ing, status }
  })

  const handleAddToAM = () => {
    alert(`Added ${product.name} to AM routine`)
  }

  const handleAddToPM = () => {
    alert(`Added ${product.name} to PM routine`)
  }

  return (
    <div className="product-detail">
      <div className="product-detail-container">
        <div className="product-detail-header">
          <h1>{product.name}</h1>
          <p className="product-detail-brand">{product.brand}</p>
        </div>

        {/* Match Score */}
        <AnimatedCard className="product-detail-match">
          <div className="product-detail-match-score">
            <span className="product-detail-match-value">{matchScore}</span>
            <span className="product-detail-match-label">For-You Match</span>
          </div>
          <div className="product-detail-match-reasons">
            {reasons.map((reason, idx) => (
              <p key={idx} className="product-detail-match-reason">{reason}</p>
            ))}
          </div>
        </AnimatedCard>

        {/* Where it fits */}
        <AnimatedCard className="product-detail-section">
          <h2>Where it fits</h2>
          <div className="product-detail-function">
            <span className="product-detail-function-badge">{product.function}</span>
            <p className="product-detail-function-guidance">
              Use in your {product.function} step. Can be used in both AM and PM routines.
            </p>
          </div>
        </AnimatedCard>

        {/* Ingredient Breakdown */}
        <AnimatedCard className="product-detail-section">
          <h2>Ingredient Breakdown</h2>
          <div className="product-detail-ingredients">
            {ingredientDetails.map((ing, idx) => (
              <div
                key={idx}
                className={`product-detail-ingredient product-detail-ingredient--${ing.status}`}
              >
                <div className="product-detail-ingredient-header">
                  <span className="product-detail-ingredient-name">{ing?.name || ing.id}</span>
                  {ing.status === 'liked' && <span className="product-detail-ingredient-badge">✅ Your like</span>}
                  {ing.status === 'disliked' && <span className="product-detail-ingredient-badge product-detail-ingredient-badge--warning">⚠️ Your avoid</span>}
                  {ing.status === 'sensitive' && <span className="product-detail-ingredient-badge product-detail-ingredient-badge--error">⛔ Sensitivity</span>}
                </div>
                {ing?.description && (
                  <p className="product-detail-ingredient-desc">{ing.description}</p>
                )}
              </div>
            ))}
          </div>
        </AnimatedCard>

        {/* People like you */}
        {topCircle && (
          <AnimatedCard className="product-detail-section">
            <h2>People like you</h2>
            <p className="product-detail-circle-summary">
              In the <Link to={`/app/community/circle/${topCircle.id}`}>{topCircle.name}</Link> circle, 
              {topCircle.topLikedIngredients.some(ing => productIngredients.includes(ing)) 
                ? ' this product aligns with commonly liked ingredients.'
                : ' members have similar ingredient preferences to you.'}
            </p>
          </AnimatedCard>
        )}

        {/* Actions */}
        <div className="product-detail-actions">
          <AnimatedButton variant="primary" onClick={handleAddToAM} className="product-detail-action">
            Add to AM
          </AnimatedButton>
          <AnimatedButton variant="primary" onClick={handleAddToPM} className="product-detail-action">
            Add to PM
          </AnimatedButton>
        </div>

        {/* Where to buy */}
        <AnimatedCard className="product-detail-section product-detail-buy">
          <h2>Where to buy</h2>
          <div className="product-detail-buy-links">
            <a href="#" className="product-detail-buy-link" target="_blank" rel="noopener noreferrer">
              Olive Young
            </a>
            <a href="#" className="product-detail-buy-link" target="_blank" rel="noopener noreferrer">
              YesStyle
            </a>
            <a href="#" className="product-detail-buy-link" target="_blank" rel="noopener noreferrer">
              Amazon
            </a>
          </div>
        </AnimatedCard>
      </div>
    </div>
  )
}

export default ProductDetail

