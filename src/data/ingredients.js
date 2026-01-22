// Mock ingredient database with compatibility rules and information

export const ingredients = [
  {
    id: 'niacinamide',
    name: 'Niacinamide',
    description: 'A form of vitamin B3 that helps reduce inflammation, minimize pores, and improve skin texture.',
    category: 'active',
    function: 'serum',
    commonSensitivities: ['Some users may experience mild irritation or redness'],
    conflicts: ['vitamin-c'], // Should not be applied immediately before/after
    compatibleWith: ['hyaluronic-acid', 'peptides', 'ceramides']
  },
  {
    id: 'vitamin-c',
    name: 'Vitamin C (L-Ascorbic Acid)',
    description: 'Powerful antioxidant that brightens skin, reduces hyperpigmentation, and protects against environmental damage.',
    category: 'active',
    function: 'serum',
    commonSensitivities: ['Can cause irritation when mixed with certain acids'],
    conflicts: ['niacinamide', 'aha', 'bha'], // Should not be mixed with AHAs/BHAs or applied immediately with niacinamide
    compatibleWith: ['hyaluronic-acid', 'peptides', 'vitamin-e']
  },
  {
    id: 'retinol',
    name: 'Retinol',
    description: 'Vitamin A derivative that promotes cell turnover, reduces fine lines, and improves skin texture.',
    category: 'active',
    function: 'serum',
    commonSensitivities: ['Can cause dryness, peeling, and sensitivity, especially when starting'],
    conflicts: ['aha', 'bha', 'vitamin-c'], // Should not be used with acids or vitamin C
    compatibleWith: ['hyaluronic-acid', 'ceramides', 'peptides']
  },
  {
    id: 'aha',
    name: 'Alpha Hydroxy Acids (AHA)',
    description: 'Chemical exfoliants like glycolic acid, lactic acid that remove dead skin cells.',
    category: 'exfoliant',
    function: 'exfoliant',
    commonSensitivities: ['Can cause irritation, especially for sensitive skin'],
    conflicts: ['vitamin-c', 'retinol', 'bha'], // Should not be mixed with vitamin C, retinol, or BHA
    compatibleWith: ['hyaluronic-acid', 'ceramides']
  },
  {
    id: 'bha',
    name: 'Beta Hydroxy Acid (BHA)',
    description: 'Salicylic acid that penetrates pores to exfoliate and reduce acne.',
    category: 'exfoliant',
    function: 'exfoliant',
    commonSensitivities: ['Can cause dryness and irritation'],
    conflicts: ['vitamin-c', 'retinol', 'aha'], // Should not be mixed with vitamin C, retinol, or AHA
    compatibleWith: ['hyaluronic-acid', 'ceramides']
  },
  {
    id: 'hyaluronic-acid',
    name: 'Hyaluronic Acid',
    description: 'Humectant that attracts and retains moisture in the skin.',
    category: 'hydrating',
    function: 'serum',
    commonSensitivities: ['Generally well-tolerated'],
    conflicts: [],
    compatibleWith: ['niacinamide', 'vitamin-c', 'retinol', 'peptides', 'ceramides']
  },
  {
    id: 'peptides',
    name: 'Peptides',
    description: 'Amino acid chains that support collagen production and skin repair.',
    category: 'active',
    function: 'serum',
    commonSensitivities: ['Generally well-tolerated'],
    conflicts: [],
    compatibleWith: ['niacinamide', 'vitamin-c', 'hyaluronic-acid', 'ceramides']
  },
  {
    id: 'ceramides',
    name: 'Ceramides',
    description: 'Lipids that strengthen the skin barrier and prevent moisture loss.',
    category: 'barrier',
    function: 'moisturizer',
    commonSensitivities: ['Generally well-tolerated'],
    conflicts: [],
    compatibleWith: ['niacinamide', 'hyaluronic-acid', 'peptides', 'retinol']
  },
  {
    id: 'vitamin-e',
    name: 'Vitamin E',
    description: 'Antioxidant that works synergistically with vitamin C to protect skin.',
    category: 'active',
    function: 'serum',
    commonSensitivities: ['Rare sensitivity'],
    conflicts: [],
    compatibleWith: ['vitamin-c', 'hyaluronic-acid']
  }
]

// Function to get ingredient by ID
export const getIngredientById = (id) => {
  return ingredients.find(ing => ing.id === id)
}

// Function to get ingredient by name (case-insensitive)
export const getIngredientByName = (name) => {
  return ingredients.find(ing => 
    ing.name.toLowerCase() === name.toLowerCase() ||
    ing.id.toLowerCase() === name.toLowerCase()
  )
}

// Function to search ingredients
export const searchIngredients = (query) => {
  const lowerQuery = query.toLowerCase()
  return ingredients.filter(ing => 
    ing.name.toLowerCase().includes(lowerQuery) ||
    ing.id.toLowerCase().includes(lowerQuery) ||
    ing.description.toLowerCase().includes(lowerQuery)
  )
}

// Product function order (for routine building)
export const FUNCTION_ORDER = {
  'cleanser': 1,
  'toner': 2,
  'exfoliant': 3,
  'serum': 4,
  'moisturizer': 5,
  'sunscreen': 6
}

