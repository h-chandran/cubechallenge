import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { mockOCR } from '../../utils/mockOCR'
import { analyzeProduct } from '../../utils/ingredientAnalyzer'
import { useUserPreferences } from '../../contexts/UserPreferencesContext'
import { getIngredientById } from '../../data/ingredients'
import AnimatedCard from '../common/AnimatedCard'
import AnimatedButton from '../common/AnimatedButton'
import './ProductScanner.css'

const ProductScanner = () => {
  const navigate = useNavigate()
  const { preferences } = useUserPreferences()
  const [uploadedImage, setUploadedImage] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileSelect = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    setError(null)
    setUploadedImage(URL.createObjectURL(file))
    setProcessing(true)
    setAnalysis(null)

    try {
      const ocrResult = await mockOCR(file)
      
      if (ocrResult.success) {
        const productAnalysis = analyzeProduct(ocrResult.product, preferences || {})
        setAnalysis({
          ...productAnalysis,
          ocrResult,
          imageUrl: URL.createObjectURL(file)
        })
      } else {
        setError('Failed to extract ingredients. Please try another image.')
      }
    } catch (err) {
      setError('An error occurred while processing the image.')
      console.error(err)
    } finally {
      setProcessing(false)
    }
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      const syntheticEvent = {
        target: { files: [file] }
      }
      handleFileSelect(syntheticEvent)
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const handleReset = () => {
    setUploadedImage(null)
    setAnalysis(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleAddToRoutine = () => {
    if (analysis && analysis.product) {
      // Store product in localStorage to pass to routine builder
      localStorage.setItem('scanned_product', JSON.stringify(analysis.product))
      navigate('/app/routine')
    }
  }

  const getMatchScore = () => {
    if (!analysis) return 0
    
    const likedCount = analysis.likedIngredients?.length || 0
    const conflictCount = analysis.conflicts?.length || 0
    const sensitivityCount = analysis.sensitivityWarnings?.length || 0
    const totalIngredients = analysis.ingredients?.length || 1
    
    let score = 50 // Base score
    score += (likedCount / totalIngredients) * 40 // Up to +40 for liked ingredients
    score -= conflictCount * 15 // -15 per conflict
    score -= sensitivityCount * 20 // -20 per sensitivity
    
    return Math.max(0, Math.min(100, Math.round(score)))
  }

  return (
    <div className="product-scanner">
      <div className="product-scanner-header">
        <h1>Product Scanner</h1>
        <p className="product-scanner-subtitle">
          Upload a product image to analyze ingredients and compatibility
        </p>
      </div>

      {!analysis && (
        <AnimatedCard className="product-scanner-upload">
          <div
            className="product-scanner-dropzone"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="product-scanner-input"
            />
            {uploadedImage ? (
              <div className="product-scanner-preview">
                <img src={uploadedImage} alt="Uploaded product" />
                <button 
                  className="product-scanner-remove"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleReset()
                  }}
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="product-scanner-placeholder">
                <div className="product-scanner-icon">📷</div>
                <p className="product-scanner-placeholder-text">
                  Click or drag an image here
                </p>
                <p className="product-scanner-placeholder-hint">
                  Upload a product photo to extract ingredients
                </p>
              </div>
            )}
          </div>

          {processing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="product-scanner-processing"
            >
              <div className="product-scanner-spinner"></div>
              <p>Processing image and extracting ingredients...</p>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="product-scanner-error"
            >
              {error}
            </motion.div>
          )}
        </AnimatedCard>
      )}

      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="product-scanner-results"
          >
            <div className="product-scanner-results-grid">
              {/* Image Side */}
              <AnimatedCard className="product-scanner-results-image">
                <div className="product-scanner-results-image-header">
                  <h3>Scanned Product</h3>
                  <button onClick={handleReset} className="product-scanner-reset">Scan Another</button>
                </div>
                <img src={analysis.imageUrl} alt="Scanned product" />
                <div className="product-scanner-ocr-info">
                  <span className="product-scanner-ocr-method">
                    {analysis.ocrResult.method === 'product-match' ? '🔍 Product Matched' : '📝 OCR Extracted'}
                  </span>
                  <span className="product-scanner-ocr-confidence">
                    Confidence: {(analysis.ocrResult.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </AnimatedCard>

              {/* Analysis Side */}
              <AnimatedCard className="product-scanner-results-analysis">
                <div className="product-scanner-results-header">
                  <div>
                    <h3>{analysis.product.name}</h3>
                    <p className="product-scanner-brand">{analysis.product.brand}</p>
                  </div>
                  <div className="product-scanner-match-score">
                    <div className="product-scanner-match-value">{getMatchScore()}%</div>
                    <div className="product-scanner-match-label">Match</div>
                  </div>
                </div>

                {/* Extracted Ingredients */}
                <div className="product-scanner-section">
                  <h4>Extracted Ingredients</h4>
                  <div className="product-scanner-ingredients">
                    {analysis.ingredients.map((ingId, idx) => {
                      const ing = getIngredientById(ingId)
                      const isLiked = analysis.likedIngredients?.some(li => li.ingredient === ingId)
                      const isSensitive = analysis.sensitivityWarnings?.some(sw => sw.ingredient === ingId)
                      
                      return (
                        <span
                          key={idx}
                          className={`product-scanner-ingredient ${
                            isLiked ? 'product-scanner-ingredient--liked' : ''
                          } ${
                            isSensitive ? 'product-scanner-ingredient--sensitive' : ''
                          }`}
                        >
                          {ing?.name || ingId}
                          {isLiked && ' ✓'}
                          {isSensitive && ' ⚠️'}
                        </span>
                      )
                    })}
                  </div>
                </div>

                {/* Compatibility Issues */}
                {analysis.hasIssues && (
                  <div className="product-scanner-section product-scanner-section--warning">
                    <h4>⚠️ Compatibility Issues</h4>
                    {analysis.conflicts?.length > 0 && (
                      <div className="product-scanner-issues">
                        {analysis.conflicts.map((conflict, idx) => (
                          <div key={idx} className="product-scanner-issue">
                            <strong>{conflict.ingredient1}</strong> + <strong>{conflict.ingredient2}</strong>
                            <p>{conflict.reason}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {analysis.sensitivityWarnings?.length > 0 && (
                      <div className="product-scanner-issues">
                        {analysis.sensitivityWarnings.map((warning, idx) => (
                          <div key={idx} className="product-scanner-issue">
                            <strong>{warning.name}</strong>
                            <p>{warning.reason}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Positive Matches */}
                {analysis.hasLikedIngredients && (
                  <div className="product-scanner-section product-scanner-section--success">
                    <h4>✅ Ingredients That Work For You</h4>
                    <div className="product-scanner-liked">
                      {analysis.likedIngredients.map((item, idx) => (
                        <span key={idx} className="product-scanner-liked-item">
                          {item.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="product-scanner-actions">
                  <AnimatedButton
                    variant="primary"
                    onClick={handleAddToRoutine}
                    className="product-scanner-add-button"
                  >
                    Add to Routine
                  </AnimatedButton>
                </div>
              </AnimatedCard>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProductScanner

