import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProductCard from '../components/common/ProductCard'
import AnimatedInput from '../components/common/AnimatedInput'
import { products, searchProducts } from '../data/products'
import { ingredients } from '../data/ingredients'
import { useUserPreferences } from '../contexts/UserPreferencesContext'
import './Search.css'

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState([])
  const [fragranceFree, setFragranceFree] = useState(false)
  const { preferences } = useUserPreferences()

  useEffect(() => {
    if (searchQuery.length > 0) {
      const productResults = searchProducts(searchQuery)
      let filtered = productResults

      // Apply fragrance-free filter (mock - would check ingredients in real app)
      if (fragranceFree) {
        filtered = filtered.filter(p => 
          !p.name.toLowerCase().includes('fragrance') &&
          !p.name.toLowerCase().includes('perfume')
        )
      }

      // Calculate match scores
      const withScores = filtered.map(product => {
        let matchScore = 50 // base score
        const productIngredients = product.ingredients || []

        if (preferences) {
          const liked = preferences.liked_ingredients || []
          const disliked = preferences.disliked_ingredients || []
          const sensitivities = preferences.sensitivities || []

          // Increase score for liked ingredients
          const likedMatches = productIngredients.filter(ing => liked.includes(ing)).length
          matchScore += likedMatches * 15

          // Decrease score for disliked/sensitive ingredients
          const dislikedMatches = productIngredients.filter(ing => 
            disliked.includes(ing) || sensitivities.includes(ing)
          ).length
          matchScore -= dislikedMatches * 20

          matchScore = Math.max(0, Math.min(100, matchScore))
        }

        let reason = 'Standard match'
        if (matchScore >= 80) {
          reason = 'Contains ingredients that work well for you'
        } else if (matchScore >= 60) {
          reason = 'Generally compatible with your profile'
        } else if (matchScore < 40) {
          reason = 'May contain ingredients to avoid'
        }

        return {
          ...product,
          matchScore,
          reason
        }
      })

      setResults(withScores.sort((a, b) => b.matchScore - a.matchScore))
    } else {
      setResults([])
    }
  }, [searchQuery, fragranceFree, preferences])

  const handleAddToAM = (product) => {
    console.log('Add to AM:', product)
    alert(`Added ${product.name} to AM routine`)
  }

  const handleAddToPM = (product) => {
    console.log('Add to PM:', product)
    alert(`Added ${product.name} to PM routine`)
  }

  const handleSave = (product) => {
    console.log('Save:', product)
    alert(`Saved ${product.name}`)
  }

  return (
    <div className="search-page">
      <div className="search-page-header">
        <h1>Search Products</h1>
        <p className="search-page-subtitle">Find products that match your ingredient fingerprint</p>
      </div>

      <div className="search-page-controls">
        <div className="search-page-input-wrapper">
          <AnimatedInput
            label="Search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type product name, brand, or ingredient..."
            className="search-page-input"
          />
        </div>

        <div className="search-page-filters">
          <label className="search-page-filter">
            <input
              type="checkbox"
              checked={fragranceFree}
              onChange={(e) => setFragranceFree(e.target.checked)}
            />
            <span>Fragrance-free</span>
          </label>
        </div>
      </div>

      {searchQuery.length > 0 && (
        <div className="search-page-results">
          {results.length > 0 ? (
            <>
              <p className="search-page-results-count">
                Found {results.length} product{results.length !== 1 ? 's' : ''}
              </p>
              <div className="search-page-products">
                {results.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    matchScore={product.matchScore}
                    reason={product.reason}
                    onAddToAM={handleAddToAM}
                    onAddToPM={handleAddToPM}
                    onSave={handleSave}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="search-page-empty">
              <p>No products found matching "{searchQuery}"</p>
              <p className="search-page-empty-hint">Try a different search term</p>
            </div>
          )}
        </div>
      )}

      {searchQuery.length === 0 && (
        <div className="search-page-empty">
          <p>Start typing to search for products</p>
          <p className="search-page-empty-hint">Search by name, brand, or ingredient</p>
        </div>
      )}
    </div>
  )
}

export default Search

