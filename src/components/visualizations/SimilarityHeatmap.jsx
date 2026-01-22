import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useUserPreferences } from '../../contexts/UserPreferencesContext'
import { mockUserInsights } from '../../data/mockData'
import { ingredients, getIngredientById } from '../../data/ingredients'
import AnimatedCard from '../common/AnimatedCard'
import './SimilarityHeatmap.css'

const SimilarityHeatmap = ({ circle }) => {
  const { preferences } = useUserPreferences()
  const [hoveredCell, setHoveredCell] = useState(null)

  // Calculate ingredient overlap
  const overlapData = useMemo(() => {
    // Get user's ingredient preferences
    const userLiked = mockUserInsights.likelyWorks.map(item => item.ingredient)
    const userDisliked = preferences?.disliked_ingredients || []
    const userSuspects = mockUserInsights.possibleTriggers.map(item => item.ingredient)

    // Get circle's ingredient preferences
    const circleLiked = circle.topLikedIngredients || []
    const circleDisliked = circle.topDislikedIngredients || []

    // Calculate overlap for each ingredient
    const allIngredients = [...new Set([...userLiked, ...circleLiked, ...userDisliked, ...circleDisliked])]
    
    const overlap = allIngredients.map(ingId => {
      const userStatus = userLiked.includes(ingId) ? 'liked' : 
                        userDisliked.includes(ingId) ? 'disliked' :
                        userSuspects.includes(ingId) ? 'suspect' : 'neutral'
      
      const circleStatus = circleLiked.includes(ingId) ? 'liked' :
                          circleDisliked.includes(ingId) ? 'disliked' : 'neutral'

      // Calculate overlap percentage
      let overlapPercent = 0
      if (userStatus === 'liked' && circleStatus === 'liked') {
        overlapPercent = 1.0 // 100% match
      } else if (userStatus === 'disliked' && circleStatus === 'disliked') {
        overlapPercent = 0.9 // 90% match (both avoid)
      } else if (userStatus === 'liked' && circleStatus === 'neutral') {
        overlapPercent = 0.3 // 30% (user likes, circle neutral)
      } else if (userStatus === 'neutral' && circleStatus === 'liked') {
        overlapPercent = 0.3 // 30% (circle likes, user neutral)
      } else if (userStatus === 'disliked' && circleStatus === 'liked') {
        overlapPercent = -0.5 // Conflict (user dislikes, circle likes)
      } else if (userStatus === 'liked' && circleStatus === 'disliked') {
        overlapPercent = -0.5 // Conflict (user likes, circle dislikes)
      }

      return {
        ingredient: ingId,
        ingredientData: getIngredientById(ingId),
        userStatus,
        circleStatus,
        overlapPercent
      }
    }).filter(item => item.overlapPercent !== 0) // Only show ingredients with some relationship

    // Sort by overlap percentage (highest first)
    return overlap.sort((a, b) => b.overlapPercent - a.overlapPercent)
  }, [circle, preferences])

  const getCellColor = (overlapPercent) => {
    if (overlapPercent >= 0.8) return '#4CAF50' // Green - strong match
    if (overlapPercent >= 0.5) return '#8BC34A' // Light green - good match
    if (overlapPercent >= 0.3) return '#FFC107' // Yellow - partial match
    if (overlapPercent > 0) return '#FFE082' // Light yellow - weak match
    if (overlapPercent < 0) return '#F44336' // Red - conflict
    return '#E0E0E0' // Gray - neutral
  }

  const getCellIntensity = (overlapPercent) => {
    return Math.min(1, Math.abs(overlapPercent))
  }

  return (
    <AnimatedCard className="similarity-heatmap">
      <div className="similarity-heatmap-header">
        <h2>Ingredient Similarity Heatmap</h2>
        <p className="similarity-heatmap-subtitle">
          Compare your ingredient preferences with this circle
        </p>
      </div>

      <div className="similarity-heatmap-grid">
        <div className="similarity-heatmap-row similarity-heatmap-header-row">
          <div className="similarity-heatmap-corner"></div>
          <div className="similarity-heatmap-header-cell">You</div>
          <div className="similarity-heatmap-header-cell">Circle Average</div>
        </div>

        {overlapData.map((item, idx) => {
          const userColor = item.userStatus === 'liked' ? '#4CAF50' :
                           item.userStatus === 'disliked' ? '#F44336' :
                           item.userStatus === 'suspect' ? '#FF9800' : '#9E9E9E'
          
          const circleColor = item.circleStatus === 'liked' ? '#4CAF50' :
                             item.circleStatus === 'disliked' ? '#F44336' : '#9E9E9E'

          const cellColor = getCellColor(item.overlapPercent)
          const cellIntensity = getCellIntensity(item.overlapPercent)

          return (
            <motion.div
              key={idx}
              className="similarity-heatmap-row"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              onMouseEnter={() => setHoveredCell(idx)}
              onMouseLeave={() => setHoveredCell(null)}
            >
              <div className="similarity-heatmap-label-cell">
                {item.ingredientData?.name || item.ingredient}
              </div>
              <div 
                className="similarity-heatmap-cell"
                style={{ 
                  backgroundColor: userColor,
                  opacity: 0.7
                }}
                title={`You: ${item.userStatus}`}
              >
                {item.userStatus === 'liked' && '✓'}
                {item.userStatus === 'disliked' && '✗'}
                {item.userStatus === 'suspect' && '⚠'}
              </div>
              <div 
                className="similarity-heatmap-cell"
                style={{ 
                  backgroundColor: circleColor,
                  opacity: 0.7
                }}
                title={`Circle: ${item.circleStatus}`}
              >
                {item.circleStatus === 'liked' && '✓'}
                {item.circleStatus === 'disliked' && '✗'}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Overlap Summary */}
      <div className="similarity-heatmap-summary">
        <div className="similarity-heatmap-summary-item">
          <span className="similarity-heatmap-summary-label">Strong Matches:</span>
          <span className="similarity-heatmap-summary-value">
            {overlapData.filter(item => item.overlapPercent >= 0.8).length}
          </span>
        </div>
        <div className="similarity-heatmap-summary-item">
          <span className="similarity-heatmap-summary-label">Conflicts:</span>
          <span className="similarity-heatmap-summary-value similarity-heatmap-summary-value--conflict">
            {overlapData.filter(item => item.overlapPercent < 0).length}
          </span>
        </div>
        <div className="similarity-heatmap-summary-item">
          <span className="similarity-heatmap-summary-label">Overall Similarity:</span>
          <span className="similarity-heatmap-summary-value">
            {circle.matchPercentage}%
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="similarity-heatmap-legend">
        <div className="similarity-heatmap-legend-section">
          <h4>User Status:</h4>
          <div className="similarity-heatmap-legend-items">
            <div className="similarity-heatmap-legend-item">
              <div className="similarity-heatmap-legend-color" style={{ backgroundColor: '#4CAF50' }}></div>
              <span>Liked</span>
            </div>
            <div className="similarity-heatmap-legend-item">
              <div className="similarity-heatmap-legend-color" style={{ backgroundColor: '#F44336' }}></div>
              <span>Disliked</span>
            </div>
            <div className="similarity-heatmap-legend-item">
              <div className="similarity-heatmap-legend-color" style={{ backgroundColor: '#FF9800' }}></div>
              <span>Suspect</span>
            </div>
            <div className="similarity-heatmap-legend-item">
              <div className="similarity-heatmap-legend-color" style={{ backgroundColor: '#9E9E9E' }}></div>
              <span>Neutral</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredCell !== null && overlapData[hoveredCell] && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="similarity-heatmap-tooltip"
        >
          <div className="similarity-heatmap-tooltip-ingredient">
            {overlapData[hoveredCell].ingredientData?.name || overlapData[hoveredCell].ingredient}
          </div>
          <div className="similarity-heatmap-tooltip-details">
            <div>You: {overlapData[hoveredCell].userStatus}</div>
            <div>Circle: {overlapData[hoveredCell].circleStatus}</div>
            <div>Overlap: {(overlapData[hoveredCell].overlapPercent * 100).toFixed(0)}%</div>
          </div>
        </motion.div>
      )}
    </AnimatedCard>
  )
}

export default SimilarityHeatmap

