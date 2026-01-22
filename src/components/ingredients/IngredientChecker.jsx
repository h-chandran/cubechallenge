import { useState } from 'react'
import { searchProducts, getProductById } from '../../data/products'
import { analyzeProduct } from '../../utils/ingredientAnalyzer'
import { useUserPreferences } from '../../contexts/UserPreferencesContext'
import AnimatedCard from '../common/AnimatedCard'
import AnimatedButton from '../common/AnimatedButton'
import AnimatedInput from '../common/AnimatedInput'
import './IngredientChecker.css'

const IngredientChecker = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
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

  const handleProductSelect = (product) => {
    setSelectedProduct(product)
    const productAnalysis = analyzeProduct(product, preferences || {})
    setAnalysis(productAnalysis)
  }

  const handleIngredientClick = (ingredientId) => {
    // Could navigate to ingredient detail page or show more info
    console.log('Ingredient clicked:', ingredientId)
  }

  return (
    <div className="ingredient-checker">
      <div className="ingredient-checker-header">
        <h2>Ingredient Checker</h2>
        <p>Search for products and analyze their ingredients</p>
      </div>

      <AnimatedCard className="search-section">
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
                onClick={() => handleProductSelect(product)}
              >
                <div className="product-result-name">{product.name}</div>
                <div className="product-result-brand">{product.brand}</div>
                <div className="product-result-function">{product.function}</div>
              </div>
            ))}
          </div>
        )}
      </AnimatedCard>

      {analysis && (
        <AnimatedCard className="analysis-section" delay={0.2}>
          <h3>{analysis.product.name}</h3>
          <p className="product-brand">{analysis.product.brand}</p>

          {analysis.hasLikedIngredients && (
            <div className="analysis-section-positive">
              <h4>✓ Ingredients You Like</h4>
              <div className="ingredient-tags">
                {analysis.likedIngredients.map((ing) => (
                  <span key={ing.ingredient} className="tag tag-positive">
                    {ing.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {analysis.hasIssues && (
            <div className="analysis-section-warnings">
              {analysis.conflicts.length > 0 && (
                <div className="warning-group">
                  <h4>⚠ Ingredient Conflicts</h4>
                  {analysis.conflicts.map((conflict, idx) => (
                    <div key={idx} className="warning-item">
                      {conflict.reason}
                    </div>
                  ))}
                </div>
              )}

              {analysis.sensitivityWarnings.length > 0 && (
                <div className="warning-group">
                  <h4>⚠ Sensitivity Warnings</h4>
                  {analysis.sensitivityWarnings.map((warning, idx) => (
                    <div key={idx} className="warning-item warning-item-error">
                      {warning.reason}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="analysis-section-ingredients">
            <h4>All Ingredients</h4>
            <div className="ingredient-tags">
              {analysis.ingredients.map((ingId) => (
                <span
                  key={ingId}
                  className="tag tag-default"
                  onClick={() => handleIngredientClick(ingId)}
                >
                  {ingId}
                </span>
              ))}
            </div>
          </div>

          {!analysis.hasIssues && !analysis.hasLikedIngredients && (
            <div className="analysis-section-neutral">
              <p>No issues detected with this product's ingredients.</p>
            </div>
          )}
        </AnimatedCard>
      )}
    </div>
  )
}

export default IngredientChecker

