import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { analyzeFace, isCameraAvailable } from '../../utils/faceAnalyzer'
import { useUserPreferences } from '../../contexts/UserPreferencesContext'
import AnimatedCard from '../common/AnimatedCard'
import AnimatedButton from '../common/AnimatedButton'
import './ProductScanner.css'

const ProductScanner = () => {
  const { preferences, updatePreferences } = useUserPreferences()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  
  const [cameraActive, setCameraActive] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState(null)
  const [cameraAvailable, setCameraAvailable] = useState(false)

  useEffect(() => {
    // Check camera availability on mount
    isCameraAvailable().then(setCameraAvailable)
    
    return () => {
      // Cleanup: stop camera stream when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const startCamera = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user', // Front-facing camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
        
        // Ensure video plays - try multiple approaches for browser compatibility
        const playVideo = async () => {
          try {
            await videoRef.current.play()
          } catch (playErr) {
            console.error('Error playing video:', playErr)
            // Try again after a short delay
            setTimeout(() => {
              if (videoRef.current) {
                videoRef.current.play().catch(err => {
                  console.error('Retry play error:', err)
                })
              }
            }, 100)
          }
        }
        
        // Try to play immediately
        if (videoRef.current.readyState >= 2) {
          // Video is already loaded
          playVideo()
        } else {
          // Wait for metadata to load
          videoRef.current.onloadedmetadata = () => {
            playVideo()
          }
        }
      }
    } catch (err) {
      setError('Unable to access camera. Please ensure camera permissions are granted.')
      console.error('Camera error:', err)
      setCameraActive(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setCameraActive(false)
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const imageUrl = URL.createObjectURL(blob)
        setCapturedImage(imageUrl)
        stopCamera()
      }
    }, 'image/jpeg', 0.95)
  }

  const analyzeCapturedFace = async () => {
    if (!canvasRef.current) return

    setProcessing(true)
    setError(null)

    try {
      // Convert canvas to blob
      canvasRef.current.toBlob(async (blob) => {
        if (blob) {
          const result = await analyzeFace(blob)
          setAnalysis(result)
          setProcessing(false)
        }
      }, 'image/jpeg', 0.95)
    } catch (err) {
      setError('Failed to analyze face. Please try again.')
      console.error(err)
      setProcessing(false)
    }
  }

  const handleSaveSkinType = () => {
    if (analysis && analysis.skinType) {
      updatePreferences({ skin_type: analysis.skinType })
      alert(`Skin type "${analysis.skinType}" has been saved to your profile!`)
    }
  }

  const handleReset = () => {
    stopCamera()
    setCapturedImage(null)
    setAnalysis(null)
    setError(null)
    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }
  }

  const getSkinTypeColor = (skinType) => {
    const colors = {
      dry: '#FF9800',
      oily: '#4CAF50',
      combination: '#2196F3',
      normal: '#9C27B0',
      sensitive: '#F44336'
    }
    return colors[skinType] || '#666'
  }

  const getSkinTypeLabel = (skinType) => {
    return skinType ? skinType.charAt(0).toUpperCase() + skinType.slice(1) : ''
  }

  return (
    <div className="product-scanner">
      <div className="product-scanner-header">
        <h1>Face Analysis</h1>
        <p className="product-scanner-subtitle">
          Use your camera to analyze your face and determine your skin type
        </p>
      </div>

      {!analysis && (
        <AnimatedCard className="product-scanner-upload">
          {!cameraActive && !capturedImage && (
            <div className="product-scanner-camera-setup">
              {!cameraAvailable ? (
                <div className="product-scanner-error">
                  Camera is not available on this device.
                </div>
              ) : (
                <div className="product-scanner-placeholder">
                  <div className="product-scanner-icon">📷</div>
                  <p className="product-scanner-placeholder-text">
                    Ready to analyze your skin
                  </p>
                  <p className="product-scanner-placeholder-hint">
                    Click below to start your camera
                  </p>
                  <AnimatedButton
                    variant="primary"
                    onClick={startCamera}
                    className="product-scanner-start-button"
                  >
                    Start Camera
                  </AnimatedButton>
                </div>
              )}
            </div>
          )}

          {cameraActive && !capturedImage && (
            <div className="product-scanner-camera-view">
              <div className="product-scanner-video-container">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="product-scanner-video"
                />
                <div className="product-scanner-face-guide">
                  <div className="product-scanner-face-outline"></div>
                  <p>Position your face within the frame</p>
                </div>
              </div>
              <div className="product-scanner-camera-controls">
                <AnimatedButton
                  variant="secondary"
                  onClick={stopCamera}
                >
                  Cancel
                </AnimatedButton>
                <button
                  className="product-scanner-capture-button"
                  onClick={capturePhoto}
                  aria-label="Capture photo"
                >
                  <span className="product-scanner-capture-icon">📸</span>
                </button>
              </div>
            </div>
          )}

          {capturedImage && !processing && !analysis && (
            <div className="product-scanner-captured">
              <div className="product-scanner-captured-image">
                <img src={capturedImage} alt="Captured face" />
                <button
                  className="product-scanner-remove"
                  onClick={handleReset}
                >
                  ×
                </button>
              </div>
              <div className="product-scanner-captured-actions">
                <AnimatedButton
                  variant="secondary"
                  onClick={handleReset}
                >
                  Retake
                </AnimatedButton>
                <AnimatedButton
                  variant="primary"
                  onClick={analyzeCapturedFace}
                >
                  Analyze Skin Type
                </AnimatedButton>
              </div>
            </div>
          )}

          {processing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="product-scanner-processing"
            >
              <div className="product-scanner-spinner"></div>
              <p>Analyzing your skin type...</p>
              <p className="product-scanner-processing-hint">
                This may take a few seconds
              </p>
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

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

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
                  <h3>Your Face Analysis</h3>
                  <button onClick={handleReset} className="product-scanner-reset">
                    Analyze Again
                  </button>
                </div>
                <img src={analysis.imageUrl} alt="Analyzed face" />
                <div className="product-scanner-ocr-info">
                  <span className="product-scanner-ocr-method">
                    🤖 AI Analysis
                  </span>
                  <span className="product-scanner-ocr-confidence">
                    Confidence: {(analysis.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </AnimatedCard>

              {/* Analysis Side */}
              <AnimatedCard className="product-scanner-results-analysis">
                <div className="product-scanner-results-header">
                  <div>
                    <h3>Detected Skin Type</h3>
                    <p className="product-scanner-brand">
                      Based on facial analysis
                    </p>
                  </div>
                  <div 
                    className="product-scanner-match-score"
                    style={{ 
                      background: `${getSkinTypeColor(analysis.skinType)}20`,
                      border: `2px solid ${getSkinTypeColor(analysis.skinType)}`
                    }}
                  >
                    <div 
                      className="product-scanner-match-value"
                      style={{ color: getSkinTypeColor(analysis.skinType) }}
                    >
                      {getSkinTypeLabel(analysis.skinType)}
                    </div>
                    <div 
                      className="product-scanner-match-label"
                      style={{ color: getSkinTypeColor(analysis.skinType) }}
                    >
                      Skin Type
                    </div>
                  </div>
                </div>

                {/* Characteristics */}
                <div className="product-scanner-section">
                  <h4>Detected Characteristics</h4>
                  <ul className="product-scanner-characteristics">
                    {analysis.characteristics.map((char, idx) => (
                      <li key={idx}>{char}</li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="product-scanner-section product-scanner-section--success">
                  <h4>💡 Recommendations</h4>
                  <ul className="product-scanner-recommendations">
                    {analysis.recommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="product-scanner-actions">
                  <AnimatedButton
                    variant="primary"
                    onClick={handleSaveSkinType}
                    className="product-scanner-add-button"
                  >
                    Save to Profile
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
