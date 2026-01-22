import { motion } from 'framer-motion'
import { useState } from 'react'
import './AnimatedInput.css'

const AnimatedInput = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder,
  error,
  className = '',
  ...props 
}) => {
  const [focused, setFocused] = useState(false)

  return (
    <div className={`animated-input-container ${className}`}>
      {label && (
        <label className="animated-input-label">{label}</label>
      )}
      <motion.input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`animated-input ${error ? 'animated-input--error' : ''}`}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        animate={{
          borderColor: focused 
            ? (error ? 'var(--error-color)' : 'var(--accent-blue)')
            : (error ? 'var(--error-color)' : 'var(--border-color)')
        }}
        transition={{ duration: 0.2 }}
        {...props}
      />
      {error && (
        <motion.span
          className="animated-input-error"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.span>
      )}
    </div>
  )
}

export default AnimatedInput

