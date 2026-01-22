import { getIngredientById, getIngredientByName } from '../data/ingredients'

/**
 * Check if two ingredients are compatible
 * @param {string} ingredient1 - First ingredient ID or name
 * @param {string} ingredient2 - Second ingredient ID or name
 * @returns {Object} - { compatible: boolean, reason: string }
 */
export const checkCompatibility = (ingredient1, ingredient2) => {
  const ing1 = getIngredientById(ingredient1) || getIngredientByName(ingredient1)
  const ing2 = getIngredientById(ingredient2) || getIngredientByName(ingredient2)

  if (!ing1 || !ing2) {
    return { compatible: true, reason: 'Unknown ingredients' }
  }

  // Check if ingredient1 conflicts with ingredient2
  if (ing1.conflicts && ing1.conflicts.includes(ing2.id)) {
    return {
      compatible: false,
      reason: `${ing1.name} should not be used with ${ing2.name}. ${ing1.name} may reduce the efficacy of ${ing2.name} or cause irritation.`
    }
  }

  // Check if ingredient2 conflicts with ingredient1
  if (ing2.conflicts && ing2.conflicts.includes(ing1.id)) {
    return {
      compatible: false,
      reason: `${ing2.name} should not be used with ${ing1.name}. ${ing2.name} may reduce the efficacy of ${ing1.name} or cause irritation.`
    }
  }

  return { compatible: true, reason: 'Compatible ingredients' }
}

/**
 * Analyze a list of ingredients for conflicts
 * @param {string[]} ingredientList - Array of ingredient IDs or names
 * @returns {Object[]} - Array of conflict objects
 */
export const analyzeIngredientList = (ingredientList) => {
  const conflicts = []
  
  for (let i = 0; i < ingredientList.length; i++) {
    for (let j = i + 1; j < ingredientList.length; j++) {
      const compatibility = checkCompatibility(ingredientList[i], ingredientList[j])
      if (!compatibility.compatible) {
        conflicts.push({
          ingredient1: ingredientList[i],
          ingredient2: ingredientList[j],
          reason: compatibility.reason
        })
      }
    }
  }

  return conflicts
}

/**
 * Check ingredients against user sensitivities
 * @param {string[]} ingredientList - Array of ingredient IDs or names
 * @param {string[]} sensitivities - Array of ingredient IDs the user is sensitive to
 * @returns {Object[]} - Array of sensitivity warnings
 */
export const checkSensitivities = (ingredientList, sensitivities = []) => {
  const warnings = []

  ingredientList.forEach(ingredientId => {
    if (sensitivities.includes(ingredientId)) {
      const ingredient = getIngredientById(ingredientId) || getIngredientByName(ingredientId)
      warnings.push({
        ingredient: ingredientId,
        name: ingredient?.name || ingredientId,
        reason: 'You have marked this ingredient as causing sensitivity or allergies'
      })
    }
  })

  return warnings
}

/**
 * Check if ingredients are in user's liked list
 * @param {string[]} ingredientList - Array of ingredient IDs or names
 * @param {string[]} likedIngredients - Array of ingredient IDs the user likes
 * @returns {Object[]} - Array of liked ingredients
 */
export const checkLikedIngredients = (ingredientList, likedIngredients = []) => {
  const liked = []

  ingredientList.forEach(ingredientId => {
    if (likedIngredients.includes(ingredientId)) {
      const ingredient = getIngredientById(ingredientId) || getIngredientByName(ingredientId)
      liked.push({
        ingredient: ingredientId,
        name: ingredient?.name || ingredientId
      })
    }
  })

  return liked
}

/**
 * Analyze a product's ingredients
 * @param {Object} product - Product object with ingredients array
 * @param {Object} userPreferences - User preferences object
 * @returns {Object} - Analysis results
 */
export const analyzeProduct = (product, userPreferences = {}) => {
  const ingredients = product.ingredients || []
  
  const conflicts = analyzeIngredientList(ingredients)
  const sensitivityWarnings = checkSensitivities(ingredients, userPreferences.sensitivities || [])
  const likedIngredients = checkLikedIngredients(ingredients, userPreferences.liked_ingredients || [])

  return {
    product,
    ingredients,
    conflicts,
    sensitivityWarnings,
    likedIngredients,
    hasIssues: conflicts.length > 0 || sensitivityWarnings.length > 0,
    hasLikedIngredients: likedIngredients.length > 0
  }
}

/**
 * Analyze a routine (multiple products)
 * @param {Object[]} products - Array of product objects
 * @param {Object} userPreferences - User preferences object
 * @returns {Object} - Routine analysis results
 */
export const analyzeRoutine = (products, userPreferences = {}) => {
  const allIngredients = []
  const productAnalyses = []
  const routineConflicts = []

  // Analyze each product
  products.forEach(product => {
    const analysis = analyzeProduct(product, userPreferences)
    productAnalyses.push(analysis)
    allIngredients.push(...analysis.ingredients)
  })

  // Check for conflicts between products
  for (let i = 0; i < products.length; i++) {
    for (let j = i + 1; j < products.length; j++) {
      const product1 = products[i]
      const product2 = products[j]
      
      product1.ingredients?.forEach(ing1 => {
        product2.ingredients?.forEach(ing2 => {
          const compatibility = checkCompatibility(ing1, ing2)
          if (!compatibility.compatible) {
            routineConflicts.push({
              product1: product1.name,
              product2: product2.name,
              ingredient1: ing1,
              ingredient2: ing2,
              reason: compatibility.reason
            })
          }
        })
      })
    }
  }

  // Check for sensitivities across all products
  const allSensitivityWarnings = checkSensitivities(allIngredients, userPreferences.sensitivities || [])
  const allLikedIngredients = checkLikedIngredients(allIngredients, userPreferences.liked_ingredients || [])

  return {
    products,
    productAnalyses,
    routineConflicts,
    allSensitivityWarnings,
    allLikedIngredients,
    hasIssues: routineConflicts.length > 0 || allSensitivityWarnings.length > 0
  }
}

