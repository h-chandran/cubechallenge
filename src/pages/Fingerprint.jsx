import { useState } from 'react'
import { motion } from 'framer-motion'
import AnimatedCard from '../components/common/AnimatedCard'
import { useUserPreferences } from '../contexts/UserPreferencesContext'
import { ingredients, getIngredientById } from '../data/ingredients'
import { mockUserInsights } from '../data/mockData'
import './Fingerprint.css'

const Fingerprint = () => {
  const { preferences } = useUserPreferences()
  const [expandedIngredient, setExpandedIngredient] = useState(null)

  const likelyWorks = mockUserInsights.likelyWorks.map(item => ({
    ...item,
    ingredientData: getIngredientById(item.ingredient)
  }))

  const possibleTriggers = mockUserInsights.possibleTriggers.map(item => ({
    ...item,
    ingredientData: getIngredientById(item.ingredient)
  }))

  // Get avoids (high confidence only) - mock data
  const avoids = preferences?.disliked_ingredients?.filter(ing => {
    // In real app, would check confidence level
    return true
  }).map(ingId => ({
    ingredient: ingId,
    confidence: 'high',
    reason: 'Consistent negative reactions reported',
    ingredientData: getIngredientById(ingId)
  })) || []

  const toggleExpand = (ingredient) => {
    setExpandedIngredient(expandedIngredient === ingredient ? null : ingredient)
  }

  const getConfidenceBadge = (confidence) => {
    const badges = {
      high: { label: 'High Confidence', color: 'success' },
      medium: { label: 'Medium Confidence', color: 'warning' },
      low: { label: 'Low Confidence', color: 'info' }
    }
    return badges[confidence] || badges.medium
  }

  return (
    <div className="fingerprint">
      <div className="fingerprint-header">
        <h1>Your Ingredient Fingerprint</h1>
        <p className="fingerprint-subtitle">
          Personalized ingredient profile based on your routine and check-ins
        </p>
      </div>

      {/* Likely Works */}
      <div className="fingerprint-section">
        <h2 className="fingerprint-section-title">
          <span className="fingerprint-section-icon">✅</span>
          Likely Works
        </h2>
        <div className="fingerprint-ingredients">
          {likelyWorks.map((item, idx) => {
            const badge = getConfidenceBadge(item.confidence)
            return (
              <AnimatedCard key={idx} className="fingerprint-ingredient-card">
                <div className="fingerprint-ingredient-header">
                  <div>
                    <h3 className="fingerprint-ingredient-name">
                      {item.ingredientData?.name || item.ingredient}
                    </h3>
                    <span className={`fingerprint-confidence-badge fingerprint-confidence-badge--${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>
                  <button
                    className="fingerprint-expand-btn"
                    onClick={() => toggleExpand(`likely-${idx}`)}
                  >
                    {expandedIngredient === `likely-${idx}` ? '−' : '+'}
                  </button>
                </div>
                {expandedIngredient === `likely-${idx}` && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="fingerprint-ingredient-details"
                  >
                    <p className="fingerprint-ingredient-reason">{item.reason}</p>
                    {item.ingredientData?.description && (
                      <p className="fingerprint-ingredient-desc">{item.ingredientData.description}</p>
                    )}
                  </motion.div>
                )}
              </AnimatedCard>
            )
          })}
        </div>
      </div>

      {/* Suspects */}
      <div className="fingerprint-section">
        <h2 className="fingerprint-section-title">
          <span className="fingerprint-section-icon">⚠️</span>
          Suspects
        </h2>
        <div className="fingerprint-ingredients">
          {possibleTriggers.map((item, idx) => {
            const badge = getConfidenceBadge(item.confidence)
            return (
              <AnimatedCard key={idx} className="fingerprint-ingredient-card">
                <div className="fingerprint-ingredient-header">
                  <div>
                    <h3 className="fingerprint-ingredient-name">
                      {item.ingredientData?.name || item.ingredient}
                    </h3>
                    <span className={`fingerprint-confidence-badge fingerprint-confidence-badge--${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>
                  <button
                    className="fingerprint-expand-btn"
                    onClick={() => toggleExpand(`suspect-${idx}`)}
                  >
                    {expandedIngredient === `suspect-${idx}` ? '−' : '+'}
                  </button>
                </div>
                {expandedIngredient === `suspect-${idx}` && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="fingerprint-ingredient-details"
                  >
                    <p className="fingerprint-ingredient-reason">{item.reason}</p>
                    {item.ingredientData?.description && (
                      <p className="fingerprint-ingredient-desc">{item.ingredientData.description}</p>
                    )}
                  </motion.div>
                )}
              </AnimatedCard>
            )
          })}
        </div>
      </div>

      {/* Avoids (High Confidence Only) */}
      {avoids.length > 0 && (
        <div className="fingerprint-section">
          <h2 className="fingerprint-section-title">
            <span className="fingerprint-section-icon">⛔</span>
            Avoid (High Confidence)
          </h2>
          <div className="fingerprint-ingredients">
            {avoids.map((item, idx) => (
              <AnimatedCard key={idx} className="fingerprint-ingredient-card">
                <div className="fingerprint-ingredient-header">
                  <div>
                    <h3 className="fingerprint-ingredient-name">
                      {item.ingredientData?.name || item.ingredient}
                    </h3>
                    <span className="fingerprint-confidence-badge fingerprint-confidence-badge--success">
                      High Confidence
                    </span>
                  </div>
                  <button
                    className="fingerprint-expand-btn"
                    onClick={() => toggleExpand(`avoid-${idx}`)}
                  >
                    {expandedIngredient === `avoid-${idx}` ? '−' : '+'}
                  </button>
                </div>
                {expandedIngredient === `avoid-${idx}` && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="fingerprint-ingredient-details"
                  >
                    <p className="fingerprint-ingredient-reason">{item.reason}</p>
                    {item.ingredientData?.description && (
                      <p className="fingerprint-ingredient-desc">{item.ingredientData.description}</p>
                    )}
                  </motion.div>
                )}
              </AnimatedCard>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Fingerprint

