// Mock product database with ingredients

export const products = [
  {
    id: 'product-1',
    name: 'CeraVe Foaming Facial Cleanser',
    brand: 'CeraVe',
    function: 'cleanser',
    ingredients: ['hyaluronic-acid', 'ceramides'],
    description: 'Gentle foaming cleanser for normal to oily skin'
  },
  {
    id: 'product-2',
    name: 'The Ordinary Niacinamide 10% + Zinc 1%',
    brand: 'The Ordinary',
    function: 'serum',
    ingredients: ['niacinamide'],
    description: 'High-strength niacinamide serum for blemish-prone skin'
  },
  {
    id: 'product-3',
    name: 'Celimax Noni Ampoule',
    brand: 'Celimax',
    function: 'serum',
    ingredients: ['hyaluronic-acid', 'peptides'],
    description: 'Korean skincare ampoule with noni extract'
  },
  {
    id: 'product-4',
    name: 'Vitamin C Brightening Serum',
    brand: 'Generic',
    function: 'serum',
    ingredients: ['vitamin-c', 'vitamin-e'],
    description: 'Brightening serum with vitamin C and E'
  },
  {
    id: 'product-5',
    name: 'Retinol Night Serum',
    brand: 'Generic',
    function: 'serum',
    ingredients: ['retinol', 'hyaluronic-acid'],
    description: 'Anti-aging retinol serum for nighttime use'
  },
  {
    id: 'product-6',
    name: 'AHA Exfoliating Toner',
    brand: 'Generic',
    function: 'exfoliant',
    ingredients: ['aha'],
    description: 'Chemical exfoliant with alpha hydroxy acids'
  },
  {
    id: 'product-7',
    name: 'BHA Salicylic Acid Treatment',
    brand: 'Generic',
    function: 'exfoliant',
    ingredients: ['bha'],
    description: 'Acne treatment with salicylic acid'
  },
  {
    id: 'product-8',
    name: 'Daily Moisturizer',
    brand: 'Generic',
    function: 'moisturizer',
    ingredients: ['ceramides', 'hyaluronic-acid'],
    description: 'Hydrating daily moisturizer'
  }
]

// Function to get product by ID
export const getProductById = (id) => {
  return products.find(p => p.id === id)
}

// Function to search products
export const searchProducts = (query) => {
  const lowerQuery = query.toLowerCase()
  return products.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.brand.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery)
  )
}

