import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AnimatedCard from '../components/common/AnimatedCard'
import AnimatedButton from '../components/common/AnimatedButton'
import './Checkin.css'

const Checkin = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    breakout: 0,
    irritation: 0,
    dryness: 0,
    redness: 0,
    triedSomethingNew: false
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSliderChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: parseInt(value)
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Save check-in data
    const checkinData = {
      ...formData,
      date: new Date().toISOString()
    }
    
    const existingCheckins = JSON.parse(localStorage.getItem('checkins') || '[]')
    existingCheckins.push(checkinData)
    localStorage.setItem('checkins', JSON.stringify(existingCheckins))

    setSubmitted(true)
    
    setTimeout(() => {
      navigate('/app/dashboard')
    }, 2000)
  }

  const getSliderLabel = (value) => {
    if (value === 0) return 'None'
    if (value === 1) return 'Mild'
    if (value === 2) return 'Moderate'
    return 'Severe'
  }

  if (submitted) {
    return (
      <div className="checkin">
        <div className="checkin-container">
          <AnimatedCard className="checkin-card checkin-card--success">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="checkin-success-icon">✓</div>
              <h2>Fingerprint Updated</h2>
              <p>Your check-in has been recorded and your ingredient fingerprint has been updated.</p>
            </motion.div>
          </AnimatedCard>
        </div>
      </div>
    )
  }

  return (
    <div className="checkin">
      <div className="checkin-container">
        <div className="checkin-header">
          <h1>Daily Check-in</h1>
          <p className="checkin-subtitle">How's your skin today? This takes less than 10 seconds.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <AnimatedCard className="checkin-card">
            <div className="checkin-sliders">
              <div className="checkin-slider-group">
                <label className="checkin-slider-label">
                  <span>Breakouts</span>
                  <span className="checkin-slider-value">{getSliderLabel(formData.breakout)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="3"
                  value={formData.breakout}
                  onChange={(e) => handleSliderChange('breakout', e.target.value)}
                  className="checkin-slider"
                />
                <div className="checkin-slider-labels">
                  <span>0</span>
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                </div>
              </div>

              <div className="checkin-slider-group">
                <label className="checkin-slider-label">
                  <span>Irritation</span>
                  <span className="checkin-slider-value">{getSliderLabel(formData.irritation)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="3"
                  value={formData.irritation}
                  onChange={(e) => handleSliderChange('irritation', e.target.value)}
                  className="checkin-slider"
                />
                <div className="checkin-slider-labels">
                  <span>0</span>
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                </div>
              </div>

              <div className="checkin-slider-group">
                <label className="checkin-slider-label">
                  <span>Dryness</span>
                  <span className="checkin-slider-value">{getSliderLabel(formData.dryness)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="3"
                  value={formData.dryness}
                  onChange={(e) => handleSliderChange('dryness', e.target.value)}
                  className="checkin-slider"
                />
                <div className="checkin-slider-labels">
                  <span>0</span>
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                </div>
              </div>

              <div className="checkin-slider-group">
                <label className="checkin-slider-label">
                  <span>Redness</span>
                  <span className="checkin-slider-value">{getSliderLabel(formData.redness)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="3"
                  value={formData.redness}
                  onChange={(e) => handleSliderChange('redness', e.target.value)}
                  className="checkin-slider"
                />
                <div className="checkin-slider-labels">
                  <span>0</span>
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                </div>
              </div>
            </div>

            <div className="checkin-toggle">
              <label className="checkin-toggle-label">
                <input
                  type="checkbox"
                  checked={formData.triedSomethingNew}
                  onChange={(e) => setFormData({ ...formData, triedSomethingNew: e.target.checked })}
                />
                <span>Tried something new today?</span>
              </label>
            </div>

            <div className="checkin-actions">
              <AnimatedButton type="submit" variant="primary" className="checkin-submit">
                Submit Check-in
              </AnimatedButton>
            </div>
          </AnimatedCard>
        </form>
      </div>
    </div>
  )
}

export default Checkin

