import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { checkCompatibility } from '../../utils/ingredientAnalyzer'
import AnimatedCard from '../common/AnimatedCard'
import './CompatibilityMatrix.css'

const CompatibilityMatrix = ({ products, onCellClick }) => {
  const matrixData = useMemo(() => {
    if (!products || products.length === 0) return { cells: [], ingredients: [] }

    // Get all unique ingredients from all products
    const allIngredients = new Set()
    products.forEach(product => {
      product.ingredients?.forEach(ing => allIngredients.add(ing))
    })

    const ingredients = Array.from(allIngredients)
    const cells = []

    // Create matrix cells
    for (let i = 0; i < ingredients.length; i++) {
      for (let j = i + 1; j < ingredients.length; j++) {
        const ing1 = ingredients[i]
        const ing2 = ingredients[j]
        const compatibility = checkCompatibility(ing1, ing2)
        
        // Find which products contain these ingredients
        const productsWithIng1 = products.filter(p => p.ingredients?.includes(ing1))
        const productsWithIng2 = products.filter(p => p.ingredients?.includes(ing2))

        cells.push({
          ing1,
          ing2,
          compatible: compatibility.compatible,
          reason: compatibility.reason,
          products1: productsWithIng1.map(p => p.name),
          products2: productsWithIng2.map(p => p.name)
        })
      }
    }

    return { cells, ingredients }
  }, [products])

  const getCellStatus = (cell) => {
    if (!cell.compatible) return 'conflict'
    return 'compatible'
  }

  const getCellColor = (cell) => {
    if (!cell.compatible) return '#F44336' // Red
    return '#4CAF50' // Green
  }

  if (products.length === 0) {
    return (
      <AnimatedCard className="compatibility-matrix">
        <div className="compatibility-matrix-header">
          <h3>Compatibility Matrix</h3>
          <p className="compatibility-matrix-subtitle">Add products to see ingredient compatibility</p>
        </div>
      </AnimatedCard>
    )
  }

  return (
    <AnimatedCard className="compatibility-matrix">
      <div className="compatibility-matrix-header">
        <h3>Compatibility Matrix</h3>
        <p className="compatibility-matrix-subtitle">
          Ingredient compatibility across your routine
        </p>
      </div>

      <div className="compatibility-matrix-grid">
        <div className="compatibility-matrix-row">
          <div className="compatibility-matrix-corner"></div>
          {matrixData.ingredients.map((ing, idx) => (
            <div key={idx} className="compatibility-matrix-header-cell">
              {ing.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </div>
          ))}
        </div>

        {matrixData.ingredients.map((ing1, rowIdx) => (
          <div key={rowIdx} className="compatibility-matrix-row">
            <div className="compatibility-matrix-header-cell">
              {ing1.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </div>
            {matrixData.ingredients.map((ing2, colIdx) => {
              if (rowIdx === colIdx) {
                return <div key={colIdx} className="compatibility-matrix-cell compatibility-matrix-cell--diagonal"></div>
              }

              // Find the cell for this pair
              const cell = matrixData.cells.find(
                c => (c.ing1 === ing1 && c.ing2 === ing2) || (c.ing1 === ing2 && c.ing2 === ing1)
              )

              if (!cell) {
                return <div key={colIdx} className="compatibility-matrix-cell"></div>
              }

              const status = getCellStatus(cell)
              const color = getCellColor(cell)

              return (
                <motion.div
                  key={colIdx}
                  className={`compatibility-matrix-cell compatibility-matrix-cell--${status}`}
                  style={{ backgroundColor: color }}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => onCellClick && onCellClick(cell)}
                  title={cell.reason}
                >
                  {status === 'conflict' ? '⚠️' : '✓'}
                </motion.div>
              )
            })}
          </div>
        ))}
      </div>

      <div className="compatibility-matrix-legend">
        <div className="compatibility-matrix-legend-item">
          <div className="compatibility-matrix-legend-color" style={{ backgroundColor: '#4CAF50' }}></div>
          <span>Compatible</span>
        </div>
        <div className="compatibility-matrix-legend-item">
          <div className="compatibility-matrix-legend-color" style={{ backgroundColor: '#F44336' }}></div>
          <span>Conflict</span>
        </div>
      </div>
    </AnimatedCard>
  )
}

export default CompatibilityMatrix

