import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { generateFingerprintHistory, getFingerprintEvents } from '../../utils/fingerprintHistory'
import AnimatedCard from '../common/AnimatedCard'
import './FingerprintTimeline.css'

const FingerprintTimeline = () => {
  const [timeRange, setTimeRange] = useState('60') // days
  const [selectedEvent, setSelectedEvent] = useState(null)

  const history = useMemo(() => {
    return generateFingerprintHistory(parseInt(timeRange))
  }, [timeRange])

  const events = useMemo(() => {
    return getFingerprintEvents(history)
  }, [history])

  // Prepare chart data
  const chartData = useMemo(() => {
    return history.map(snapshot => ({
      date: new Date(snapshot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: snapshot.date,
      overallConfidence: (snapshot.overallConfidence * 100).toFixed(1),
      breakout: snapshot.checkinCorrelation.breakout,
      irritation: snapshot.checkinCorrelation.irritation,
      dryness: snapshot.checkinCorrelation.dryness,
      redness: snapshot.checkinCorrelation.redness
    }))
  }, [history])

  // Get before/after comparison
  const comparison = useMemo(() => {
    if (history.length < 2) return null
    
    const first = history[0]
    const last = history[history.length - 1]
    
    return {
      before: {
        date: first.date,
        likelyWorksCount: first.likelyWorks.length,
        overallConfidence: first.overallConfidence
      },
      after: {
        date: last.date,
        likelyWorksCount: last.likelyWorks.length,
        overallConfidence: last.overallConfidence
      },
      improvement: ((last.overallConfidence - first.overallConfidence) * 100).toFixed(1)
    }
  }, [history])

  return (
    <AnimatedCard className="fingerprint-timeline">
      <div className="fingerprint-timeline-header">
        <h2>Fingerprint Evolution</h2>
        <p className="fingerprint-timeline-subtitle">
          Track how your ingredient fingerprint has evolved over time
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="fingerprint-timeline-controls">
        <label>Time Range:</label>
        <select 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
          className="fingerprint-timeline-select"
        >
          <option value="30">Last 30 days</option>
          <option value="60">Last 60 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {/* Before/After Comparison */}
      {comparison && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fingerprint-timeline-comparison"
        >
          <div className="fingerprint-timeline-comparison-item">
            <div className="fingerprint-timeline-comparison-label">Before</div>
            <div className="fingerprint-timeline-comparison-value">
              {new Date(comparison.before.date).toLocaleDateString()}
            </div>
            <div className="fingerprint-timeline-comparison-metric">
              Confidence: {(comparison.before.overallConfidence * 100).toFixed(0)}%
            </div>
          </div>
          <div className="fingerprint-timeline-comparison-arrow">→</div>
          <div className="fingerprint-timeline-comparison-item">
            <div className="fingerprint-timeline-comparison-label">After</div>
            <div className="fingerprint-timeline-comparison-value">
              {new Date(comparison.after.date).toLocaleDateString()}
            </div>
            <div className="fingerprint-timeline-comparison-metric">
              Confidence: {(comparison.after.overallConfidence * 100).toFixed(0)}%
            </div>
          </div>
          <div className="fingerprint-timeline-comparison-improvement">
            <span className="fingerprint-timeline-improvement-value">
              +{comparison.improvement}%
            </span>
            <span className="fingerprint-timeline-improvement-label">Improvement</span>
          </div>
        </motion.div>
      )}

      {/* Confidence Trend Chart */}
      <div className="fingerprint-timeline-chart">
        <h3>Overall Confidence Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
              </linearGradient>
            </defs>
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
              domain={[0, 100]}
              label={{ value: 'Confidence %', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #E0E0E0',
                borderRadius: '8px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="overallConfidence" 
              stroke="#4CAF50" 
              strokeWidth={2}
              fill="url(#confidenceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Key Events Timeline */}
      <div className="fingerprint-timeline-events">
        <h3>Key Events</h3>
        <div className="fingerprint-timeline-events-list">
          {events.length > 0 ? (
            events.map((event, idx) => (
              <motion.div
                key={idx}
                className="fingerprint-timeline-event"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedEvent(selectedEvent === idx ? null : idx)}
              >
                <div className="fingerprint-timeline-event-marker">
                  {event.type === 'discovery' && '🔍'}
                  {event.type === 'confidence-increase' && '📈'}
                </div>
                <div className="fingerprint-timeline-event-content">
                  <div className="fingerprint-timeline-event-date">
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="fingerprint-timeline-event-message">
                    {event.message}
                  </div>
                  {selectedEvent === idx && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="fingerprint-timeline-event-details"
                    >
                      <div>Ingredient: {event.ingredient}</div>
                      <div>Confidence: {(event.confidence * 100).toFixed(0)}%</div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="fingerprint-timeline-events-empty">
              No significant events yet. Keep logging check-ins to see your fingerprint evolve!
            </div>
          )}
        </div>
      </div>
    </AnimatedCard>
  )
}

export default FingerprintTimeline

