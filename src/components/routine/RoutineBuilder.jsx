import { useState } from 'react'
import { searchProducts } from '../../data/products'
import { analyzeRoutine } from '../../utils/ingredientAnalyzer'
import { FUNCTION_ORDER } from '../../data/ingredients'
import { useUserPreferences } from '../../contexts/UserPreferencesContext'
import AnimatedCard from '../common/AnimatedCard'
import AnimatedButton from '../common/AnimatedButton'
import AnimatedInput from '../common/AnimatedInput'
import './RoutineBuilder.css'

const RoutineBuilder = () => {
  const [routineProducts, setRoutineProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [analysis, setAnalysis] = useState(null)
  const { preferences } = useUserPreferences()

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const results = searchProducts(searchQuery)
    setSearchResults(results)
  }

  const addProductToRoutine = (product) => {
    setRoutineProducts([...routineProducts, product])
    setSearchQuery('')
    setSearchResults([])
    updateAnalysis([...routineProducts, product])
  }

  const removeProductFromRoutine = (index) => {
    const updated = routineProducts.filter((_, i) => i !== index)
    setRoutineProducts(updated)
    updateAnalysis(updated)
  }

  const updateAnalysis = (products) => {
    if (products.length > 0) {
      const routineAnalysis = analyzeRoutine(products, preferences || {})
      setAnalysis(routineAnalysis)
    } else {
      setAnalysis(null)
    }
  }

  const sortRoutineByFunction = (products) => {
    return [...products].sort((a, b) => {
      const orderA = FUNCTION_ORDER[a.function] || 999
      const orderB = FUNCTION_ORDER[b.function] || 999
      return orderA - orderB
    })
  }

  const sortedRoutine = sortRoutineByFunction(routineProducts)

  return (
    <div className="routine-builder">
      <div className="routine-builder-header">
        <h2>Routine Builder</h2>
        <p>Build your personalized skincare routine with ingredient compatibility checking</p>
      </div>

      <div className="routine-builder-content">
        <div className="routine-builder-left">
          <AnimatedCard className="search-section">
            <h3>Add Products</h3>
            <div className="search-input-group">
              <AnimatedInput
                placeholder="Search for a product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <AnimatedButton onClick={handleSearch} variant="primary">
                Search
              </AnimatedButton>
            </div>

            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    className="product-result-item"
                    onClick={() => addProductToRoutine(product)}
                  >
                    <div className="product-result-name">{product.name}</div>
                    <div className="product-result-brand">{product.brand}</div>
                    <div className="product-result-function">{product.function}</div>
                  </div>
                ))}
              </div>
            )}
          </AnimatedCard>

          <AnimatedCard className="routine-section" delay={0.1}>
            <h3>Your Routine</h3>
            {sortedRoutine.length === 0 ? (
              <p className="empty-routine">No products in your routine yet. Search and add products above.</p>
            ) : (
              <div className="routine-steps">
                {sortedRoutine.map((product, index) => {
                  const originalIndex = routineProducts.indexOf(product)
                  return (
                    <div key={`${product.id}-${originalIndex}`} className="routine-step">
                      <div className="routine-step-header">
                        <div className="routine-step-info">
                          <span className="routine-step-number">{index + 1}</span>
                          <div>
                            <div className="routine-step-name">{product.name}</div>
                            <div className="routine-step-meta">
                              <span className="routine-step-function">{product.function}</span>
                              <span className="routine-step-brand">{product.brand}</span>
                            </div>
                          </div>
                        </div>
                        <AnimatedButton
                          variant="outline"
                          onClick={() => removeProductFromRoutine(originalIndex)}
                          className="remove-button"
                        >
                          Remove
                        </AnimatedButton>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </AnimatedCard>
        </div>

        <div className="routine-builder-right">
          {analysis && (
            <AnimatedCard className="analysis-panel" delay={0.2}>
              <h3>Routine Analysis</h3>

              {analysis.hasIssues && (
                <div className="analysis-warnings">
                  {analysis.routineConflicts.length > 0 && (
                    <div className="warning-group">
                      <h4>⚠ Product Conflicts</h4>
                      {analysis.routineConflicts.map((conflict, idx) => (
                        <div key={idx} className="warning-item">
                          <strong>{conflict.product1}</strong> and <strong>{conflict.product2}</strong>
                          <br />
                          {conflict.reason}
                        </div>
                      ))}
                    </div>
                  )}

                  {analysis.allSensitivityWarnings.length > 0 && (
                    <div className="warning-group">
                      <h4>⚠ Sensitivity Warnings</h4>
                      {analysis.allSensitivityWarnings.map((warning, idx) => (
                        <div key={idx} className="warning-item warning-item-error">
                          {warning.reason}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {analysis.allLikedIngredients.length > 0 && (
                <div className="analysis-positive">
                  <h4>✓ Ingredients You Like</h4>
                  <div className="ingredient-tags">
                    {analysis.allLikedIngredients.map((ing) => (
                      <span key={ing.ingredient} className="tag tag-positive">
                        {ing.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {!analysis.hasIssues && sortedRoutine.length > 0 && (
                <div className="analysis-success">
                  <p>✓ Your routine looks good! No ingredient conflicts detected.</p>
                </div>
              )}

              {sortedRoutine.length === 0 && (
                <div className="analysis-empty">
                  <p>Add products to your routine to see analysis.</p>
                </div>
              )}
            </AnimatedCard>
          )}
        </div>
      </div>
    </div>
  )
}

export default RoutineBuilder

