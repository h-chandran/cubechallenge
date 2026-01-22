import { useState, useEffect } from 'react'
import { searchProducts, products } from '../../data/products'
import { analyzeRoutine } from '../../utils/ingredientAnalyzer'
import { FUNCTION_ORDER } from '../../data/ingredients'
import { useUserPreferences } from '../../contexts/UserPreferencesContext'
import AnimatedCard from '../common/AnimatedCard'
import AnimatedButton from '../common/AnimatedButton'
import AnimatedInput from '../common/AnimatedInput'
import { motion, AnimatePresence } from 'framer-motion'
import './RoutineBuilder.css'

const RoutineBuilder = () => {
  const [timeOfDay, setTimeOfDay] = useState('AM') // 'AM' or 'PM'
  const [routine, setRoutine] = useState({ AM: [], PM: [] })
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showProductPicker, setShowProductPicker] = useState(false)
  const [selectedFunction, setSelectedFunction] = useState(null)
  const [warnings, setWarnings] = useState([])
  const { preferences } = useUserPreferences()

  const functions = ['cleanser', 'toner', 'exfoliant', 'serum', 'treatment', 'moisturizer', 'SPF']

  useEffect(() => {
    if (searchQuery.length > 0) {
      const results = searchProducts(searchQuery)
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  useEffect(() => {
    // Check for conflicts in current routine
    const currentProducts = routine[timeOfDay]
    if (currentProducts.length > 1) {
      const analysis = analyzeRoutine(currentProducts, preferences || {})
      if (analysis.hasIssues) {
        const conflictWarnings = analysis.routineConflicts.map(conflict => ({
          type: 'conflict',
          message: `May be irritating together—consider alternating: ${conflict.product1} and ${conflict.product2}`
        }))
        setWarnings(conflictWarnings)
      } else {
        setWarnings([])
      }
    } else {
      setWarnings([])
    }
  }, [routine, timeOfDay, preferences])

  const handleFunctionClick = (func) => {
    setSelectedFunction(func)
    setShowProductPicker(true)
    setSearchQuery('')
  }

  const handleAddProduct = (product) => {
    const productWithFunction = {
      ...product,
      function: selectedFunction
    }
    
    setRoutine({
      ...routine,
      [timeOfDay]: [...routine[timeOfDay], productWithFunction]
    })
    
    setShowProductPicker(false)
    setSelectedFunction(null)
    setSearchQuery('')
  }

  const handleRemoveProduct = (index) => {
    setRoutine({
      ...routine,
      [timeOfDay]: routine[timeOfDay].filter((_, i) => i !== index)
    })
  }

  const handleAutoBuild = () => {
    const surveyData = JSON.parse(localStorage.getItem('survey_data') || '{}')
    const effortLevel = surveyData.effortLevel || '3-5 steps (moderate)'
    const concerns = surveyData.skinConcerns || []

    // Generate routine based on effort level
    let routineSize = 4
    if (effortLevel.includes('1-3')) routineSize = 3
    if (effortLevel.includes('5+')) routineSize = 6
    
    const autoRoutine = {
      AM: [
        { ...products[0], function: 'cleanser' },
        { ...products[2], function: 'serum' },
        { ...products[7], function: 'moisturizer' }
      ],
      PM: [
        { ...products[0], function: 'cleanser' },
        { ...products[2], function: 'serum' },
        { ...products[7], function: 'moisturizer' }
      ]
    }

    // Add products based on concerns
    if (concerns.includes('Acne')) {
      autoRoutine.PM.push({ ...products[1], function: 'treatment' })
    }
    if (concerns.includes('Fine lines') || concerns.includes('Wrinkles')) {
      autoRoutine.PM.push({ ...products[4], function: 'treatment' })
    }

    setRoutine(autoRoutine)
  }

  const getProductsByFunction = (func) => {
    return routine[timeOfDay].filter(p => p.function === func)
  }

  const sortedFunctions = functions.sort((a, b) => {
    const orderA = FUNCTION_ORDER[a] || 999
    const orderB = FUNCTION_ORDER[b] || 999
    return orderA - orderB
  })

  return (
    <div className="routine-builder">
      <div className="routine-builder-header">
        <h1>Routine Builder</h1>
        <p>Build your personalized skincare routine with ingredient compatibility checking</p>
      </div>

      {/* AM/PM Toggle */}
      <div className="routine-builder-toggle">
        <button
          className={`routine-builder-toggle-btn ${timeOfDay === 'AM' ? 'active' : ''}`}
          onClick={() => setTimeOfDay('AM')}
        >
          ☀️ AM Routine
        </button>
        <button
          className={`routine-builder-toggle-btn ${timeOfDay === 'PM' ? 'active' : ''}`}
          onClick={() => setTimeOfDay('PM')}
        >
          🌙 PM Routine
        </button>
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <AnimatedCard className="routine-builder-warning">
          <div className="routine-builder-warning-icon">⚠️</div>
          <div>
            {warnings.map((warning, idx) => (
              <p key={idx}>{warning.message}</p>
            ))}
          </div>
        </AnimatedCard>
      )}

      {/* Function Blocks */}
      <div className="routine-builder-functions">
        {sortedFunctions.map((func) => {
          const productsInFunction = getProductsByFunction(func)
          return (
            <AnimatedCard key={func} className="routine-builder-function-block">
              <div className="routine-builder-function-header">
                <h3 className="routine-builder-function-name">{func}</h3>
                <AnimatedButton
                  variant="outline"
                  onClick={() => handleFunctionClick(func)}
                  className="routine-builder-function-add"
                >
                  + Add Product
                </AnimatedButton>
              </div>
              {productsInFunction.length > 0 && (
                <div className="routine-builder-function-products">
                  {productsInFunction.map((product, idx) => {
                    const productIndex = routine[timeOfDay].findIndex(p => 
                      p.id === product.id && p.function === func
                    )
                    return (
                      <div key={idx} className="routine-builder-function-product">
                        <span>{product.name}</span>
                        <button
                          onClick={() => handleRemoveProduct(productIndex)}
                          className="routine-builder-function-remove"
                        >
                          ×
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </AnimatedCard>
          )
        })}
      </div>

      {/* Auto-build Button */}
      <div className="routine-builder-actions">
        <AnimatedButton variant="secondary" onClick={handleAutoBuild}>
          Auto-build Routine
        </AnimatedButton>
      </div>

      {/* Product Picker Modal */}
      <AnimatePresence>
        {showProductPicker && (
          <motion.div
            className="routine-builder-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowProductPicker(false)
              setSelectedFunction(null)
            }}
          >
            <motion.div
              className="routine-builder-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="routine-builder-modal-header">
                <h2>Add {selectedFunction}</h2>
                <button
                  className="routine-builder-modal-close"
                  onClick={() => {
                    setShowProductPicker(false)
                    setSelectedFunction(null)
                  }}
                >
                  ×
                </button>
              </div>
              <div className="routine-builder-modal-search">
                <AnimatedInput
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="routine-builder-modal-results">
                {searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <div
                      key={product.id}
                      className="routine-builder-modal-result"
                      onClick={() => handleAddProduct(product)}
                    >
                      <div>
                        <strong>{product.name}</strong>
                        <p>{product.brand} • {product.function}</p>
                      </div>
                      <button className="routine-builder-modal-add">+</button>
                    </div>
                  ))
                ) : (
                  <p className="routine-builder-modal-empty">Start typing to search...</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default RoutineBuilder
