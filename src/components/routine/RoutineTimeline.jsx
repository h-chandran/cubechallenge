import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { FUNCTION_ORDER } from '../../data/ingredients'
import AnimatedCard from '../common/AnimatedCard'
import './RoutineTimeline.css'

const RoutineTimeline = ({ routine, timeOfDay }) => {
  const timelineData = useMemo(() => {
    if (!routine || !routine[timeOfDay] || routine[timeOfDay].length === 0) {
      return []
    }

    // Sort products by function order
    const sortedProducts = [...routine[timeOfDay]].sort((a, b) => {
      const orderA = FUNCTION_ORDER[a.function] || 999
      const orderB = FUNCTION_ORDER[b.function] || 999
      return orderA - orderB
    })

    // Add wait times between steps
    const timeline = []
    sortedProducts.forEach((product, idx) => {
      timeline.push({
        product,
        step: idx + 1,
        waitTime: idx === 0 ? 0 : (product.function === 'serum' || product.function === 'treatment' ? 2 : 1)
      })
    })

    return timeline
  }, [routine, timeOfDay])

  const getFunctionColor = (func) => {
    const colors = {
      cleanser: '#4CAF50',
      toner: '#66BB6A',
      exfoliant: '#FF9800',
      serum: '#4CAF50',
      treatment: '#9C27B0',
      moisturizer: '#4DB6AC',
      SPF: '#FFC107'
    }
    return colors[func] || '#9E9E9E'
  }

  const getFunctionIcon = (func) => {
    const icons = {
      cleanser: '🧼',
      toner: '💧',
      exfoliant: '✨',
      serum: '💉',
      treatment: '⚡',
      moisturizer: '🧴',
      SPF: '☀️'
    }
    return icons[func] || '📦'
  }

  if (timelineData.length === 0) {
    return (
      <AnimatedCard className="routine-timeline">
        <div className="routine-timeline-header">
          <h3>Routine Timeline</h3>
          <p className="routine-timeline-subtitle">Add products to see your routine timeline</p>
        </div>
      </AnimatedCard>
    )
  }

  return (
    <AnimatedCard className="routine-timeline">
      <div className="routine-timeline-header">
        <h3>{timeOfDay} Routine Timeline</h3>
        <p className="routine-timeline-subtitle">
          Step-by-step application guide
        </p>
      </div>

      <div className="routine-timeline-steps">
        {timelineData.map((item, idx) => (
          <motion.div
            key={idx}
            className="routine-timeline-step"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="routine-timeline-step-number">{item.step}</div>
            <div className="routine-timeline-step-content">
              <div className="routine-timeline-step-header">
                <div className="routine-timeline-step-function">
                  <span
                    className="routine-timeline-step-icon"
                    style={{ backgroundColor: getFunctionColor(item.product.function) }}
                  >
                    {getFunctionIcon(item.product.function)}
                  </span>
                  <div>
                    <h4 className="routine-timeline-step-product">{item.product.name}</h4>
                    <span className="routine-timeline-step-function-name">{item.product.function}</span>
                  </div>
                </div>
              </div>
              {item.waitTime > 0 && idx > 0 && (
                <div className="routine-timeline-wait">
                  ⏱️ Wait {item.waitTime} minute{item.waitTime > 1 ? 's' : ''} before next step
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="routine-timeline-total">
        <span>Total Steps: {timelineData.length}</span>
        <span>Estimated Time: {timelineData.reduce((acc, item) => acc + item.waitTime, 0)} minutes</span>
      </div>
    </AnimatedCard>
  )
}

export default RoutineTimeline

