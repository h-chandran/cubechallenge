import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AnimatedCard from '../../components/common/AnimatedCard'
import AnimatedButton from '../../components/common/AnimatedButton'
import AnimatedInput from '../../components/common/AnimatedInput'
import { products, searchProducts } from '../../data/products'
import './AddProducts.css'

const AddProducts = () => {
  const navigate = useNavigate()
  const [mode, setMode] = useState(null) // 'existing' or 'scratch'
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [userProducts, setUserProducts] = useState([])
  const [routine, setRoutine] = useState({ AM: [], PM: [] })

  useEffect(() => {
    if (searchQuery.length > 0) {
      const results = searchProducts(searchQuery)
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  const handleAddProduct = (product) => {
    // Show modal to select AM/PM and function
    const use = prompt('When do you use this? (AM, PM, or Both)')
    if (!use || !['AM', 'PM', 'Both'].includes(use)) return

    const functionType = prompt('What function? (cleanser, serum, moisturizer, SPF, treatment)')
    if (!functionType) return

    const productEntry = {
      ...product,
      use: use,
      function: functionType
    }

    setUserProducts([...userProducts, productEntry])
    
    if (use === 'AM' || use === 'Both') {
      setRoutine({ ...routine, AM: [...routine.AM, productEntry] })
    }
    if (use === 'PM' || use === 'Both') {
      setRoutine({ ...routine, PM: [...routine.PM, productEntry] })
    }

    setSearchQuery('')
    setSearchResults([])
  }

  const handleStartFromScratch = () => {
    // Get survey data to generate routine
    const surveyData = JSON.parse(localStorage.getItem('survey_data') || '{}')
    const effortLevel = surveyData.effortLevel || '3-5 steps (moderate)'
    const concerns = surveyData.skinConcerns || []

    // Generate starter routine based on effort level
    let routineSize = 4
    if (effortLevel.includes('1-3')) routineSize = 3
    if (effortLevel.includes('5+')) routineSize = 6

    const starterRoutine = {
      AM: [
        { ...products[0], use: 'AM', function: 'cleanser' }, // CeraVe Cleanser
        { ...products[2], use: 'AM', function: 'serum' }, // Celimax Ampoule
        { ...products[7], use: 'AM', function: 'moisturizer' } // Daily Moisturizer
      ],
      PM: [
        { ...products[0], use: 'PM', function: 'cleanser' },
        { ...products[2], use: 'PM', function: 'serum' },
        { ...products[7], use: 'PM', function: 'moisturizer' }
      ]
    }

    // Adjust based on concerns
    if (concerns.includes('Acne')) {
      starterRoutine.PM.push({ ...products[1], use: 'PM', function: 'treatment' })
    }
    if (concerns.includes('Fine lines') || concerns.includes('Wrinkles')) {
      starterRoutine.PM.push({ ...products[4], use: 'PM', function: 'treatment' })
    }

    setRoutine(starterRoutine)
    setUserProducts([...starterRoutine.AM, ...starterRoutine.PM])
  }

  const handleFinish = () => {
    // Save routine
    localStorage.setItem('user_routine', JSON.stringify(routine))
    localStorage.setItem('onboarding_complete', 'true')
    navigate('/app/dashboard')
  }

  if (!mode) {
    return (
      <div className="add-products">
        <div className="add-products-container">
          <AnimatedCard className="add-products-card">
            <h2 className="add-products-title">Let's Build Your Routine</h2>
            <p className="add-products-subtitle">Choose how you'd like to get started</p>

            <div className="add-products-options">
              <motion.button
                className="add-products-option"
                onClick={() => setMode('existing')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="add-products-option-icon">📦</div>
                <h3>I have products</h3>
                <p>Add the products you're already using</p>
              </motion.button>

              <motion.button
                className="add-products-option"
                onClick={() => {
                  handleStartFromScratch()
                  setMode('scratch')
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="add-products-option-icon">✨</div>
                <h3>Start me from scratch</h3>
                <p>We'll generate a starter routine for you</p>
              </motion.button>
            </div>
          </AnimatedCard>
        </div>
      </div>
    )
  }

  if (mode === 'scratch') {
    return (
      <div className="add-products">
        <div className="add-products-container">
          <AnimatedCard className="add-products-card">
            <h2 className="add-products-title">Your Starter Routine</h2>
            <p className="add-products-subtitle">Based on your survey, here's a routine to get you started</p>

            <div className="add-products-routine-preview">
              <div className="add-products-routine-section">
                <h3>AM Routine</h3>
                <ul>
                  {routine.AM.map((product, idx) => (
                    <li key={idx}>{product.name} ({product.function})</li>
                  ))}
                </ul>
              </div>
              <div className="add-products-routine-section">
                <h3>PM Routine</h3>
                <ul>
                  {routine.PM.map((product, idx) => (
                    <li key={idx}>{product.name} ({product.function})</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="add-products-actions">
              <AnimatedButton
                variant="primary"
                onClick={handleFinish}
                className="add-products-finish"
              >
                Use this routine
              </AnimatedButton>
              <AnimatedButton
                variant="outline"
                onClick={() => setMode('existing')}
              >
                I'd rather add my own products
              </AnimatedButton>
            </div>
          </AnimatedCard>
        </div>
      </div>
    )
  }

  return (
    <div className="add-products">
      <div className="add-products-container">
        <AnimatedCard className="add-products-card">
          <h2 className="add-products-title">Add Your Products</h2>
          <p className="add-products-subtitle">Search and add the products you're currently using</p>

          <div className="add-products-search">
            <AnimatedInput
              label="Search Products"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type product name or brand..."
            />

            {searchResults.length > 0 && (
              <div className="add-products-results">
                {searchResults.map((product) => (
                  <motion.div
                    key={product.id}
                    className="add-products-result-item"
                    onClick={() => handleAddProduct(product)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div>
                      <strong>{product.name}</strong>
                      <p>{product.brand} • {product.function}</p>
                    </div>
                    <button className="add-products-add-btn">+ Add</button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="add-products-routine-sidebar">
            <div className="add-products-routine-section">
              <h3>AM Routine ({routine.AM.length})</h3>
              {routine.AM.length > 0 ? (
                <ul>
                  {routine.AM.map((product, idx) => (
                    <li key={idx}>{product.name}</li>
                  ))}
                </ul>
              ) : (
                <p className="add-products-empty">No products yet</p>
              )}
            </div>
            <div className="add-products-routine-section">
              <h3>PM Routine ({routine.PM.length})</h3>
              {routine.PM.length > 0 ? (
                <ul>
                  {routine.PM.map((product, idx) => (
                    <li key={idx}>{product.name}</li>
                  ))}
                </ul>
              ) : (
                <p className="add-products-empty">No products yet</p>
              )}
            </div>
          </div>

          <div className="add-products-actions">
            <AnimatedButton
              variant="primary"
              onClick={handleFinish}
              disabled={userProducts.length === 0}
              className="add-products-finish"
            >
              Finish → Dashboard
            </AnimatedButton>
          </div>
        </AnimatedCard>
      </div>
    </div>
  )
}

export default AddProducts

