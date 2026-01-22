import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AnimatedCard from '../components/common/AnimatedCard'
import AnimatedButton from '../components/common/AnimatedButton'
import ProductCard from '../components/common/ProductCard'
import CircleCard from '../components/common/CircleCard'
import InsightCard from '../components/common/InsightCard'
import { mockUserInsights, mockRecommendedProducts, mockCircles } from '../data/mockData'
import { products, getProductById } from '../data/products'
import './Dashboard.css'

const Dashboard = () => {
  const { user } = useAuth()

  const handleAddToAM = (product) => {
    // Add to AM routine logic
    console.log('Add to AM:', product)
    alert(`Added ${product.name} to AM routine`)
  }

  const handleAddToPM = (product) => {
    // Add to PM routine logic
    console.log('Add to PM:', product)
    alert(`Added ${product.name} to PM routine`)
  }

  const recommendedProductsWithData = mockRecommendedProducts.map(rec => ({
    ...rec,
    product: getProductById(rec.productId)
  })).filter(rec => rec.product)

  const userCircles = mockCircles.slice(0, 3)

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back!</h1>
        <p className="dashboard-subtitle">Your personalized skincare hub</p>
      </div>

      {/* Today Actions */}
      <div className="dashboard-section">
        <h2 className="dashboard-section-title">Today's Actions</h2>
        <div className="dashboard-actions">
          <Link to="/app/checkin">
            <AnimatedCard className="dashboard-action-card">
              <div className="dashboard-action-icon">☀️</div>
              <h3>Log AM Routine</h3>
              <p>Track your morning products</p>
            </AnimatedCard>
          </Link>
          <Link to="/app/checkin">
            <AnimatedCard className="dashboard-action-card">
              <div className="dashboard-action-icon">🌙</div>
              <h3>Log PM Routine</h3>
              <p>Track your evening products</p>
            </AnimatedCard>
          </Link>
          <Link to="/app/checkin">
            <AnimatedCard className="dashboard-action-card">
              <div className="dashboard-action-icon">📊</div>
              <h3>Daily Check-in</h3>
              <p>How's your skin today?</p>
            </AnimatedCard>
          </Link>
        </div>
      </div>

      {/* Latest Insight */}
      <div className="dashboard-section">
        <h2 className="dashboard-section-title">Your Latest Insight</h2>
        <InsightCard 
          insight={{
            message: mockUserInsights.latestInsight.message,
            confidence: mockUserInsights.latestInsight.confidence,
            reason: 'Based on your recent check-ins and product usage'
          }}
        />
      </div>

      {/* Ingredient Insights */}
      <div className="dashboard-section">
        <h2 className="dashboard-section-title">Your Ingredient Profile</h2>
        <div className="dashboard-ingredients">
          <div className="dashboard-ingredient-group">
            <h3>✅ Likely Works</h3>
            {mockUserInsights.likelyWorks.map((item, idx) => (
              <div key={idx} className="dashboard-ingredient-item">
                <span className="dashboard-ingredient-name">{item.ingredient}</span>
                <span className={`dashboard-ingredient-confidence dashboard-ingredient-confidence--${item.confidence}`}>
                  {item.confidence} confidence
                </span>
              </div>
            ))}
          </div>
          <div className="dashboard-ingredient-group">
            <h3>⚠️ Possible Trigger</h3>
            {mockUserInsights.possibleTriggers.map((item, idx) => (
              <div key={idx} className="dashboard-ingredient-item">
                <span className="dashboard-ingredient-name">{item.ingredient}</span>
                <span className={`dashboard-ingredient-confidence dashboard-ingredient-confidence--${item.confidence}`}>
                  {item.confidence} confidence
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Your Circles */}
      <div className="dashboard-section">
        <h2 className="dashboard-section-title">Your Circles</h2>
        <div className="dashboard-circles">
          {userCircles.map((circle) => (
            <CircleCard key={circle.id} circle={circle} />
          ))}
        </div>
        <Link to="/app/community">
          <AnimatedButton variant="outline" className="dashboard-view-all">
            View All Circles
          </AnimatedButton>
        </Link>
      </div>

      {/* Recommended Products */}
      <div className="dashboard-section">
        <h2 className="dashboard-section-title">Recommended for You</h2>
        <div className="dashboard-products">
          {recommendedProductsWithData.map((rec) => (
            <ProductCard
              key={rec.productId}
              product={rec.product}
              matchScore={rec.matchScore}
              reason={rec.reason}
              onAddToAM={handleAddToAM}
              onAddToPM={handleAddToPM}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
