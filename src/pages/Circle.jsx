import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import AnimatedCard from '../components/common/AnimatedCard'
import ProductCard from '../components/common/ProductCard'
import { getCircleById, getPostsByCircle, getTopProductsByCircle } from '../data/mockData'
import { products, getProductById } from '../data/products'
import './Circle.css'

const Circle = () => {
  const { id } = useParams()
  const circle = getCircleById(id)
  const posts = getPostsByCircle(id)
  const topProducts = getTopProductsByCircle(id)

  if (!circle) {
    return (
      <div className="circle-page">
        <div className="circle-page-error">
          <h2>Circle not found</h2>
          <Link to="/app/community">Back to Community</Link>
        </div>
      </div>
    )
  }

  const handleAddToAM = (product) => {
    console.log('Add to AM:', product)
  }

  const handleAddToPM = (product) => {
    console.log('Add to PM:', product)
  }

  return (
    <div className="circle-page">
      <div className="circle-page-container">
        {/* Circle Summary */}
        <AnimatedCard className="circle-page-summary">
          <div className="circle-page-header">
            <h1>{circle.name}</h1>
            <div className="circle-page-match">
              <span className="circle-page-match-value">{circle.matchPercentage}%</span>
              <span className="circle-page-match-label">match</span>
            </div>
          </div>
          <p className="circle-page-description">{circle.description}</p>

          <div className="circle-page-stats">
            <div className="circle-page-stat">
              <span className="circle-page-stat-value">{circle.memberCount.toLocaleString()}</span>
              <span className="circle-page-stat-label">Members</span>
            </div>
            <div className="circle-page-stat">
              <span className="circle-page-stat-value">{circle.newPostsCount}</span>
              <span className="circle-page-stat-label">New Posts</span>
            </div>
          </div>
        </AnimatedCard>

        {/* Why You're Here */}
        <AnimatedCard className="circle-page-section">
          <h2>Why You're Here</h2>
          <p className="circle-page-overlap">
            You match this circle because you share similar ingredient preferences. 
            You both like <strong>{circle.topLikedIngredients.slice(0, 2).join(' and ')}</strong> and 
            tend to avoid <strong>{circle.topDislikedIngredients.slice(0, 2).join(' and ')}</strong>.
          </p>
        </AnimatedCard>

        {/* Circle Insights */}
        <div className="circle-page-insights">
          <AnimatedCard className="circle-page-insight">
            <h3>Skin Type Distribution</h3>
            <div className="circle-page-distribution">
              {Object.entries(circle.skinTypeDistribution).map(([type, percent]) => (
                <div key={type} className="circle-page-distribution-item">
                  <div className="circle-page-distribution-bar">
                    <div 
                      className="circle-page-distribution-fill"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="circle-page-distribution-label">
                    <span>{type}</span>
                    <span>{percent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedCard>

          <AnimatedCard className="circle-page-insight">
            <h3>Top Liked Ingredients</h3>
            <div className="circle-page-ingredients">
              {circle.topLikedIngredients.map((ing, idx) => (
                <span key={idx} className="circle-page-ingredient circle-page-ingredient--liked">
                  {ing}
                </span>
              ))}
            </div>
          </AnimatedCard>

          <AnimatedCard className="circle-page-insight">
            <h3>Top Disliked Ingredients</h3>
            <div className="circle-page-ingredients">
              {circle.topDislikedIngredients.map((ing, idx) => (
                <span key={idx} className="circle-page-ingredient circle-page-ingredient--disliked">
                  {ing}
                </span>
              ))}
            </div>
          </AnimatedCard>

          <AnimatedCard className="circle-page-insight">
            <h3>Top Concerns</h3>
            <div className="circle-page-concerns">
              {circle.topConcerns.map((concern, idx) => (
                <span key={idx} className="circle-page-concern">
                  {concern}
                </span>
              ))}
            </div>
          </AnimatedCard>
        </div>

        {/* Top Products */}
        <div className="circle-page-section-full">
          <h2>Top Products in This Circle</h2>
          <div className="circle-page-products">
            {topProducts.map((topProduct) => {
              const product = getProductById(topProduct.productId)
              if (!product) return null
              return (
                <ProductCard
                  key={topProduct.productId}
                  product={product}
                  matchScore={85}
                  reason={topProduct.reason}
                  onAddToAM={handleAddToAM}
                  onAddToPM={handleAddToPM}
                />
              )
            })}
          </div>
        </div>

        {/* Posts Feed */}
        <div className="circle-page-section-full">
          <h2>Recent Posts</h2>
          <div className="circle-page-posts">
            {posts.map((post) => (
              <AnimatedCard key={post.id} className="circle-page-post">
                <div className="circle-page-post-header">
                  <span className="circle-page-post-author">{post.author}</span>
                  <span className="circle-page-post-date">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="circle-page-post-title">{post.title}</h3>
                <p className="circle-page-post-content">{post.content}</p>
                <div className="circle-page-post-footer">
                  <span className="circle-page-post-likes">👍 {post.likes}</span>
                  <span className="circle-page-post-comments">💬 {post.comments}</span>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Circle

