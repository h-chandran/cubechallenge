// Mock data for MVP - circles, posts, user insights, etc.

export const mockCircles = [
  {
    id: 'circle-1',
    name: 'Sensitive Skin Warriors',
    description: 'People with sensitive, reactive skin who share similar ingredient experiences',
    matchPercentage: 87,
    topLikedIngredients: ['ceramides', 'hyaluronic-acid', 'peptides'],
    topDislikedIngredients: ['aha', 'bha', 'retinol'],
    topConcerns: ['irritation', 'redness', 'dryness'],
    skinTypeDistribution: {
      'sensitive': 45,
      'dry': 30,
      'combination': 15,
      'oily': 10
    },
    memberCount: 1247,
    newPostsCount: 12
  },
  {
    id: 'circle-2',
    name: 'Acne-Focused Routine Builders',
    description: 'Building routines to manage breakouts and prevent future acne',
    matchPercentage: 72,
    topLikedIngredients: ['niacinamide', 'bha', 'hyaluronic-acid'],
    topDislikedIngredients: ['vitamin-c', 'aha'],
    topConcerns: ['breakouts', 'oiliness', 'pores'],
    skinTypeDistribution: {
      'oily': 50,
      'combination': 30,
      'sensitive': 15,
      'dry': 5
    },
    memberCount: 892,
    newPostsCount: 8
  },
  {
    id: 'circle-3',
    name: 'Anti-Aging Enthusiasts',
    description: 'Focused on fine lines, wrinkles, and maintaining youthful skin',
    matchPercentage: 65,
    topLikedIngredients: ['retinol', 'peptides', 'vitamin-c'],
    topDislikedIngredients: ['bha'],
    topConcerns: ['fine-lines', 'wrinkles', 'firmness'],
    skinTypeDistribution: {
      'dry': 40,
      'combination': 35,
      'normal': 20,
      'oily': 5
    },
    memberCount: 654,
    newPostsCount: 5
  }
]

export const mockPosts = [
  {
    id: 'post-1',
    circleId: 'circle-1',
    author: 'Sarah M.',
    title: 'Ceramides saved my barrier!',
    content: 'After months of irritation, switching to ceramide-heavy products made such a difference. My skin feels so much stronger now.',
    likes: 23,
    comments: 5,
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'post-2',
    circleId: 'circle-1',
    author: 'Mike T.',
    title: 'Avoiding retinol was the right call',
    content: 'Tried retinol once and my sensitive skin did NOT like it. Sticking with gentler actives now.',
    likes: 18,
    comments: 3,
    createdAt: '2024-01-14T15:20:00Z'
  },
  {
    id: 'post-3',
    circleId: 'circle-2',
    author: 'Alex K.',
    title: 'Niacinamide + BHA combo works!',
    content: 'Using niacinamide in the AM and BHA at night has really helped control my breakouts without over-drying.',
    likes: 31,
    comments: 8,
    createdAt: '2024-01-15T09:15:00Z'
  }
]

export const mockTopProducts = [
  {
    productId: 'product-1',
    circleId: 'circle-1',
    upvotes: 89,
    reason: 'Gentle, barrier-supporting ingredients'
  },
  {
    productId: 'product-3',
    circleId: 'circle-1',
    upvotes: 67,
    reason: 'Hydrating without irritation'
  },
  {
    productId: 'product-2',
    circleId: 'circle-2',
    upvotes: 112,
    reason: 'Effective for blemish control'
  }
]

export const mockUserInsights = {
  latestInsight: {
    type: 'ingredient-match',
    message: 'Ceramides show strong positive correlation with your skin',
    confidence: 'high',
    date: '2024-01-15'
  },
  likelyWorks: [
    {
      ingredient: 'ceramides',
      confidence: 'high',
      reason: 'Consistent positive responses across 8+ products'
    },
    {
      ingredient: 'hyaluronic-acid',
      confidence: 'medium',
      reason: 'Positive responses in 5 products, no negative reactions'
    }
  ],
  possibleTriggers: [
    {
      ingredient: 'aha',
      confidence: 'medium',
      reason: 'Mild irritation reported in 2 products containing AHA'
    }
  ]
}

export const mockRecommendedProducts = [
  {
    productId: 'product-1',
    matchScore: 92,
    reason: 'Contains ceramides and hyaluronic acid - both work well for you'
  },
  {
    productId: 'product-3',
    matchScore: 88,
    reason: 'Peptides and hyaluronic acid align with your preferences'
  },
  {
    productId: 'product-8',
    matchScore: 85,
    reason: 'Barrier-supporting ingredients match your profile'
  },
  {
    productId: 'product-2',
    matchScore: 75,
    reason: 'Niacinamide generally works, but monitor for sensitivity'
  }
]

// Helper functions
export const getCircleById = (id) => {
  return mockCircles.find(c => c.id === id)
}

export const getPostsByCircle = (circleId) => {
  return mockPosts.filter(p => p.circleId === circleId)
}

export const getTopProductsByCircle = (circleId) => {
  return mockTopProducts
    .filter(p => p.circleId === circleId)
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 10)
}

