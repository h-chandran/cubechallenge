/**
 * Mock face analysis utility for skin type detection
 * In a real app, this would use ML models or API calls
 */

const SKIN_TYPES = ['dry', 'oily', 'combination', 'normal', 'sensitive']

/**
 * Analyze face image and determine skin type
 * @param {File|Blob} imageFile - The captured face image
 * @returns {Promise<Object>} Analysis result with skin type and details
 */
export const analyzeFace = async (imageFile) => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Mock analysis - in real app, this would use ML/API
  // For demo, randomly select a skin type with weighted probabilities
  const random = Math.random()
  let skinType
  
  if (random < 0.25) {
    skinType = 'combination'
  } else if (random < 0.45) {
    skinType = 'oily'
  } else if (random < 0.65) {
    skinType = 'normal'
  } else if (random < 0.85) {
    skinType = 'dry'
  } else {
    skinType = 'sensitive'
  }

  // Generate mock analysis details based on skin type
  const analysisDetails = {
    dry: {
      confidence: 0.87,
      characteristics: [
        'Low sebum production detected',
        'Fine lines visible in analysis',
        'Tight texture patterns observed',
        'Minimal pore visibility'
      ],
      recommendations: [
        'Use hydrating ingredients like hyaluronic acid',
        'Look for ceramide-rich products',
        'Avoid harsh exfoliants',
        'Consider oil-based moisturizers'
      ]
    },
    oily: {
      confidence: 0.82,
      characteristics: [
        'Higher sebum production detected',
        'Enlarged pores visible',
        'Shine patterns in T-zone',
        'Active sebaceous glands identified'
      ],
      recommendations: [
        'Use lightweight, non-comedogenic products',
        'Consider BHA for pore management',
        'Look for niacinamide to regulate oil',
        'Avoid heavy, oil-based products'
      ]
    },
    combination: {
      confidence: 0.79,
      characteristics: [
        'Mixed sebum distribution patterns',
        'T-zone shows higher activity',
        'Cheeks appear drier',
        'Variable pore size across face'
      ],
      recommendations: [
        'Use different products for different zones',
        'Balance hydration and oil control',
        'Consider multi-masking approach',
        'Look for balanced formulations'
      ]
    },
    normal: {
      confidence: 0.85,
      characteristics: [
        'Balanced sebum production',
        'Even skin texture',
        'Minimal visible concerns',
        'Well-hydrated appearance'
      ],
      recommendations: [
        'Maintain current routine',
        'Focus on prevention',
        'Use gentle, balanced products',
        'Consider antioxidant protection'
      ]
    },
    sensitive: {
      confidence: 0.88,
      characteristics: [
        'Visible redness patterns',
        'Thin skin barrier indicators',
        'Reactive texture patterns',
        'Potential inflammation markers'
      ],
      recommendations: [
        'Use fragrance-free products',
        'Avoid harsh actives initially',
        'Look for barrier-supporting ingredients',
        'Patch test all new products'
      ]
    }
  }

  const details = analysisDetails[skinType]

  return {
    success: true,
    skinType,
    confidence: details.confidence,
    characteristics: details.characteristics,
    recommendations: details.recommendations,
    imageUrl: URL.createObjectURL(imageFile),
    analysisDate: new Date().toISOString()
  }
}

/**
 * Check if camera is available
 */
export const isCameraAvailable = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices()
    return devices.some(device => device.kind === 'videoinput')
  } catch (error) {
    return false
  }
}

