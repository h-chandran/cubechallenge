/**
 * Analyze check-in trends and progress
 */

export const getCheckinHistory = () => {
  try {
    const checkins = JSON.parse(localStorage.getItem('checkins') || '[]')
    return checkins.sort((a, b) => new Date(a.date) - new Date(b.date))
  } catch (error) {
    console.error('Error reading check-ins:', error)
    return []
  }
}

/**
 * Generate mock check-in data if none exists (for demo)
 */
export const generateMockCheckins = (days = 30) => {
  const checkins = []
  const today = new Date()
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    // Simulate improving trends
    const progressFactor = i / days // 0 = oldest, 1 = newest
    
    checkins.push({
      date: date.toISOString(),
      breakout: Math.max(0, Math.floor(Math.random() * 2) - (progressFactor > 0.7 ? 1 : 0)),
      irritation: Math.max(0, Math.floor(Math.random() * 2) - (progressFactor > 0.6 ? 1 : 0)),
      dryness: Math.max(0, Math.floor(Math.random() * 2) - (progressFactor > 0.8 ? 1 : 0)),
      redness: Math.max(0, Math.floor(Math.random() * 2) - (progressFactor > 0.7 ? 1 : 0)),
      triedSomethingNew: i % 7 === 0 // Every week
    })
  }
  
  return checkins
}

/**
 * Get check-in data for charts
 */
export const getCheckinChartData = () => {
  let checkins = getCheckinHistory()
  
  // If no check-ins, generate mock data for demo
  if (checkins.length === 0) {
    checkins = generateMockCheckins(30)
  }
  
  // Format for charts
  return checkins.map(checkin => ({
    date: new Date(checkin.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    fullDate: checkin.date,
    breakout: checkin.breakout || 0,
    irritation: checkin.irritation || 0,
    dryness: checkin.dryness || 0,
    redness: checkin.redness || 0,
    triedSomethingNew: checkin.triedSomethingNew || false
  }))
}

/**
 * Calculate trend analysis
 */
export const calculateTrends = (checkins) => {
  if (checkins.length < 2) {
    return {
      breakout: 'insufficient-data',
      irritation: 'insufficient-data',
      dryness: 'insufficient-data',
      redness: 'insufficient-data'
    }
  }

  const firstHalf = checkins.slice(0, Math.floor(checkins.length / 2))
  const secondHalf = checkins.slice(Math.floor(checkins.length / 2))

  const calculateAverage = (arr, field) => {
    const sum = arr.reduce((acc, item) => acc + (item[field] || 0), 0)
    return sum / arr.length
  }

  const getTrend = (field) => {
    const firstAvg = calculateAverage(firstHalf, field)
    const secondAvg = calculateAverage(secondHalf, field)
    const diff = secondAvg - firstAvg
    
    if (Math.abs(diff) < 0.1) return 'stable'
    if (diff < 0) return 'improving'
    return 'worsening'
  }

  return {
    breakout: getTrend('breakout'),
    irritation: getTrend('irritation'),
    dryness: getTrend('dryness'),
    redness: getTrend('redness')
  }
}

/**
 * Get overall progress summary
 */
export const getProgressSummary = (checkins) => {
  if (checkins.length === 0) {
    return {
      overallTrend: 'insufficient-data',
      mostImproved: null,
      daysSinceLastReaction: null,
      totalCheckins: 0
    }
  }

  const trends = calculateTrends(checkins)
  const improvingCount = Object.values(trends).filter(t => t === 'improving').length
  const worseningCount = Object.values(trends).filter(t => t === 'worsening').length

  let overallTrend = 'stable'
  if (improvingCount > worseningCount) {
    overallTrend = 'improving'
  } else if (worseningCount > improvingCount) {
    overallTrend = 'worsening'
  }

  // Find most improved concern
  const mostImproved = Object.entries(trends)
    .filter(([_, trend]) => trend === 'improving')
    .map(([concern, _]) => concern)[0] || null

  // Days since last negative reaction (score > 1)
  const lastReaction = checkins
    .slice()
    .reverse()
    .find(c => (c.breakout > 1 || c.irritation > 1 || c.dryness > 1 || c.redness > 1))
  
  let daysSinceLastReaction = null
  if (lastReaction) {
    const lastReactionDate = new Date(lastReaction.date)
    const today = new Date()
    daysSinceLastReaction = Math.floor((today - lastReactionDate) / (1000 * 60 * 60 * 24))
  }

  return {
    overallTrend,
    mostImproved,
    daysSinceLastReaction,
    totalCheckins: checkins.length
  }
}

