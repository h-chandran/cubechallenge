import { products } from '../data/products'
import { ingredients } from '../data/ingredients'

/**
 * Mock OCR function that simulates extracting ingredients from an image
 * @param {File} imageFile - The uploaded image file
 * @returns {Promise<Object>} - Promise resolving to extracted product data
 */
export const mockOCR = async (imageFile) => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500))

  // Try to match filename to known products
  const fileName = imageFile.name.toLowerCase()
  
  // Check if filename contains product name or brand
  const matchedProduct = products.find(product => {
    const productName = product.name.toLowerCase()
    const brandName = product.brand.toLowerCase()
    return fileName.includes(productName) || 
           fileName.includes(brandName) ||
           productName.includes(fileName.split('.')[0]) ||
           brandName.includes(fileName.split('.')[0])
  })

  if (matchedProduct) {
    // Return matched product's ingredients
    return {
      success: true,
      product: matchedProduct,
      ingredients: matchedProduct.ingredients || [],
      confidence: 0.95,
      method: 'product-match'
    }
  }

  // If no match, return random ingredients for demo
  const randomIngredients = ingredients
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * 4) + 2)
    .map(ing => ing.id)

  return {
    success: true,
    product: {
      name: 'Detected Product',
      brand: 'Unknown',
      function: 'serum',
      ingredients: randomIngredients
    },
    ingredients: randomIngredients,
    confidence: 0.75,
    method: 'ocr-simulation'
  }
}

/**
 * Extract product name from filename
 */
export const extractProductName = (fileName) => {
  // Remove extension
  const nameWithoutExt = fileName.split('.')[0]
  // Replace underscores and hyphens with spaces
  return nameWithoutExt.replace(/[_-]/g, ' ').trim()
}

