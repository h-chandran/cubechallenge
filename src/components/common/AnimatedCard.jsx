import { motion } from 'framer-motion'
import './AnimatedCard.css'

const AnimatedCard = ({ children, className = '', delay = 0, ...props }) => {
  return (
    <motion.div
      className={`animated-card ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default AnimatedCard

