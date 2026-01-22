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
    
    // Simulate gradual confidence changes - increase from 40% to 80%
    // i goes from daysBack (oldest) to 0 (newest), so progressFactor = 1 (oldest) to 0 (newest)
    const progressFactor = i / daysBack // 1 = oldest, 0 = newest
    
    // Confidence increases linearly from 0.4 (40%) at oldest to 0.8 (80%) at newest
    const baseConfidence = 0.4 + ((1 - progressFactor) * 0.4) // 0.4 (oldest) to 0.8 (newest)
    
    const likelyWorks = baseLikelyWorks.map(item => ({
      ...item,
      confidence: baseConfidence
    }))
    
    const possibleTriggers = basePossibleTriggers.map(item => ({
      ...item,
      confidence: baseConfidence
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

    // Simulate check-in correlation - improving from 2-3 to 0-1
    // Start with higher values (2-3) at oldest and decrease to lower values (0-1) at newest
    // progressFactor = 1 (oldest) to 0 (newest)
    const baseBreakout = 2 + Math.floor(Math.random() * 2) // 2-3 for older dates
    const improvedBreakout = Math.floor(Math.random() * 2) // 0-1 for newer dates
    const breakout = progressFactor > 0.7 ? baseBreakout : improvedBreakout
    
    const baseIrritation = 2 + Math.floor(Math.random() * 2)
    const improvedIrritation = Math.floor(Math.random() * 2)
    const irritation = progressFactor > 0.6 ? baseIrritation : improvedIrritation
    
    const baseDryness = 2 + Math.floor(Math.random() * 2)
    const improvedDryness = Math.floor(Math.random() * 2)
    const dryness = progressFactor > 0.8 ? baseDryness : improvedDryness
    
    const baseRedness = 2 + Math.floor(Math.random() * 2)
    const improvedRedness = Math.floor(Math.random() * 2)
    const redness = progressFactor > 0.7 ? baseRedness : improvedRedness
    
    const checkinCorrelation = {
      breakout,
      irritation,
      dryness,
      redness
    }

    history.push({
      date: date.toISOString().split('T')[0],
      likelyWorks,
      possibleTriggers,
      discoveredIngredients,
      checkinCorrelation,
      overallConfidence: baseConfidence // Use the calculated base confidence (40% to 80%)
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

