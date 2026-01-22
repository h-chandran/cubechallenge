import { mockUserInsights } from '../data/mockData'

/**
 * Generate mock historical fingerprint data
 * @param {number} daysBack - Number of days to generate history for
 * @returns {Array} Array of fingerprint snapshots
 */
export const generateFingerprintHistory = (daysBack = 60) => {
  const history = []
  const today = new Date()
  
  // Base ingredients from current insights
  const baseLikelyWorks = mockUserInsights.likelyWorks.map(item => ({
    ingredient: item.ingredient,
    confidence: item.confidence === 'high' ? 0.9 : item.confidence === 'medium' ? 0.7 : 0.5
  }))
  
  const basePossibleTriggers = mockUserInsights.possibleTriggers.map(item => ({
    ingredient: item.ingredient,
    confidence: item.confidence === 'high' ? 0.9 : item.confidence === 'medium' ? 0.7 : 0.5
  }))

  // Generate data for each day going back
  for (let i = daysBack; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    // Simulate gradual confidence changes
    const progressFactor = i / daysBack // 0 = oldest, 1 = newest
    
    const likelyWorks = baseLikelyWorks.map(item => ({
      ...item,
      confidence: Math.max(0.3, item.confidence * (0.5 + progressFactor * 0.5))
    }))
    
    const possibleTriggers = basePossibleTriggers.map(item => ({
      ...item,
      confidence: Math.max(0.3, item.confidence * (0.5 + progressFactor * 0.5))
    }))

    // Add some variation - occasionally discover new ingredients
    let discoveredIngredients = []
    if (i === daysBack - 30) {
      // Discovered ceramides 30 days ago
      discoveredIngredients.push({
        ingredient: 'ceramides',
        type: 'discovery',
        confidence: 0.6
      })
    }
    if (i === daysBack - 15) {
      // Discovered hyaluronic-acid 15 days ago
      discoveredIngredients.push({
        ingredient: 'hyaluronic-acid',
        type: 'discovery',
        confidence: 0.5
      })
    }

    // Simulate check-in correlation
    const checkinCorrelation = {
      breakout: Math.max(0, Math.floor(Math.random() * 2) - (progressFactor > 0.7 ? 1 : 0)),
      irritation: Math.max(0, Math.floor(Math.random() * 2) - (progressFactor > 0.6 ? 1 : 0)),
      dryness: Math.max(0, Math.floor(Math.random() * 2) - (progressFactor > 0.8 ? 1 : 0)),
      redness: Math.max(0, Math.floor(Math.random() * 2) - (progressFactor > 0.7 ? 1 : 0))
    }

    history.push({
      date: date.toISOString().split('T')[0],
      likelyWorks,
      possibleTriggers,
      discoveredIngredients,
      checkinCorrelation,
      overallConfidence: likelyWorks.reduce((sum, item) => sum + item.confidence, 0) / likelyWorks.length
    })
  }

  return history
}

/**
 * Get fingerprint evolution events (discoveries, status changes)
 */
export const getFingerprintEvents = (history) => {
  const events = []
  
  history.forEach((snapshot, idx) => {
    // Check for new discoveries
    snapshot.discoveredIngredients?.forEach(discovery => {
      events.push({
        date: snapshot.date,
        type: 'discovery',
        ingredient: discovery.ingredient,
        confidence: discovery.confidence,
        message: `Discovered ${discovery.ingredient} works for your skin`
      })
    })

    // Check for confidence milestones
    if (idx > 0) {
      const prev = history[idx - 1]
      snapshot.likelyWorks.forEach(item => {
        const prevItem = prev.likelyWorks.find(i => i.ingredient === item.ingredient)
        if (prevItem) {
          const confidenceDiff = item.confidence - prevItem.confidence
          if (confidenceDiff > 0.15) {
            events.push({
              date: snapshot.date,
              type: 'confidence-increase',
              ingredient: item.ingredient,
              confidence: item.confidence,
              message: `${item.ingredient} confidence increased significantly`
            })
          }
        }
      })
    }
  })

  return events.sort((a, b) => new Date(a.date) - new Date(b.date))
}

