import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { getCheckinChartData, getProgressSummary, calculateTrends } from '../../utils/progressAnalyzer'
import AnimatedCard from '../common/AnimatedCard'
import './ProgressDashboard.css'

const ProgressDashboard = () => {
  const chartData = useMemo(() => getCheckinChartData(), [])
  const summary = useMemo(() => getProgressSummary(chartData), [chartData])
  const trends = useMemo(() => calculateTrends(chartData), [chartData])

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving':
        return '📈'
      case 'worsening':
        return '📉'
      case 'stable':
        return '➡️'
      default:
        return '❓'
    }
  }

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'improving':
        return '#4CAF50'
      case 'worsening':
        return '#F44336'
      case 'stable':
        return '#FF9800'
      default:
        return '#9E9E9E'
    }
  }

  const getTrendLabel = (trend) => {
    switch (trend) {
      case 'improving':
        return 'Improving'
      case 'worsening':
        return 'Worsening'
      case 'stable':
        return 'Stable'
      default:
        return 'Insufficient Data'
    }
  }

  if (chartData.length === 0) {
    return (
      <AnimatedCard className="progress-dashboard">
        <div className="progress-dashboard-header">
          <h2>Skin Progress</h2>
          <p className="progress-dashboard-subtitle">
            Start logging check-ins to see your progress over time
          </p>
        </div>
      </AnimatedCard>
    )
  }

  return (
    <AnimatedCard className="progress-dashboard">
      <div className="progress-dashboard-header">
        <h2>Skin Progress</h2>
        <p className="progress-dashboard-subtitle">
          Track your skin concerns over time
        </p>
      </div>

      {/* Summary Cards */}
      <div className="progress-dashboard-summary">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="progress-dashboard-summary-card"
          style={{ borderLeftColor: getTrendColor(summary.overallTrend) }}
        >
          <div className="progress-dashboard-summary-icon">
            {getTrendIcon(summary.overallTrend)}
          </div>
          <div className="progress-dashboard-summary-content">
            <div className="progress-dashboard-summary-label">Overall Trend</div>
            <div 
              className="progress-dashboard-summary-value"
              style={{ color: getTrendColor(summary.overallTrend) }}
            >
              {getTrendLabel(summary.overallTrend)}
            </div>
          </div>
        </motion.div>

        {summary.mostImproved && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="progress-dashboard-summary-card"
            style={{ borderLeftColor: '#4CAF50' }}
          >
            <div className="progress-dashboard-summary-icon">✨</div>
            <div className="progress-dashboard-summary-content">
              <div className="progress-dashboard-summary-label">Most Improved</div>
              <div className="progress-dashboard-summary-value" style={{ color: '#4CAF50' }}>
                {summary.mostImproved.charAt(0).toUpperCase() + summary.mostImproved.slice(1)}
              </div>
            </div>
          </motion.div>
        )}

        {summary.daysSinceLastReaction !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="progress-dashboard-summary-card"
            style={{ borderLeftColor: '#4CAF50' }}
          >
            <div className="progress-dashboard-summary-icon">🎉</div>
            <div className="progress-dashboard-summary-content">
              <div className="progress-dashboard-summary-label">Days Since Last Reaction</div>
              <div className="progress-dashboard-summary-value" style={{ color: '#4CAF50' }}>
                {summary.daysSinceLastReaction} days
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="progress-dashboard-summary-card"
          style={{ borderLeftColor: '#9E9E9E' }}
        >
          <div className="progress-dashboard-summary-icon">📊</div>
          <div className="progress-dashboard-summary-content">
            <div className="progress-dashboard-summary-label">Total Check-ins</div>
            <div className="progress-dashboard-summary-value" style={{ color: '#9E9E9E' }}>
              {summary.totalCheckins}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Trend Indicators */}
      <div className="progress-dashboard-trends">
        <h3>Individual Trends</h3>
        <div className="progress-dashboard-trends-grid">
          {Object.entries(trends).map(([concern, trend]) => (
            <div key={concern} className="progress-dashboard-trend-item">
              <div className="progress-dashboard-trend-label">
                {concern.charAt(0).toUpperCase() + concern.slice(1)}
              </div>
              <div 
                className="progress-dashboard-trend-value"
                style={{ color: getTrendColor(trend) }}
              >
                {getTrendIcon(trend)} {getTrendLabel(trend)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Time Series Chart */}
      <div className="progress-dashboard-chart">
        <h3>Progress Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
            <XAxis 
              dataKey="date" 
              stroke="#666"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              stroke="#666"
              tick={{ fontSize: 12 }}
              domain={[0, 3]}
              label={{ value: 'Severity', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #E0E0E0',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="breakout" 
              stroke="#F44336" 
              strokeWidth={2}
              name="Breakouts"
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="irritation" 
              stroke="#FF9800" 
              strokeWidth={2}
              name="Irritation"
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="dryness" 
              stroke="#4CAF50" 
              strokeWidth={2}
              name="Dryness"
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="redness" 
              stroke="#E91E63" 
              strokeWidth={2}
              name="Redness"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </AnimatedCard>
  )
}

export default ProgressDashboard

