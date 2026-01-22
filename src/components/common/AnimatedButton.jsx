import { motion } from 'framer-motion'
import './AnimatedButton.css'

const AnimatedButton = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  onClick,
  disabled = false,
  type = 'button',
  ...props 
}) => {
  return (
    <motion.button
      type={type}
      className={`animated-button animated-button--${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default AnimatedButton

