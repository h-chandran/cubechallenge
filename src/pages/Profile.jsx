import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useUserPreferences } from '../contexts/UserPreferencesContext'
import { searchIngredients } from '../data/ingredients'
import AnimatedCard from '../components/common/AnimatedCard'
import AnimatedButton from '../components/common/AnimatedButton'
import AnimatedInput from '../components/common/AnimatedInput'
import './Profile.css'

const Profile = () => {
  const { user, signOut } = useAuth()
  const { preferences, loading, addLikedIngredient, removeLikedIngredient, addSensitivity, removeSensitivity, setSkinType } = useUserPreferences()
  const [ingredientSearch, setIngredientSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [activeTab, setActiveTab] = useState('preferences')

  const skinTypes = ['oily', 'dry', 'combo', 'normal']

  useEffect(() => {
    if (ingredientSearch.trim()) {
      const results = searchIngredients(ingredientSearch)
      setSearchResults(results.slice(0, 5))
    } else {
      setSearchResults([])
    }
  }, [ingredientSearch])

  const handleAddLiked = async (ingredientId) => {
    await addLikedIngredient(ingredientId)
    setIngredientSearch('')
    setSearchResults([])
  }

  const handleAddSensitivity = async (ingredientId) => {
    await addSensitivity(ingredientId)
    setIngredientSearch('')
    setSearchResults([])
  }

  const handleSkinTypeChange = async (skinType) => {
    await setSkinType(skinType)
  }

  const handleSignOut = async () => {
    await signOut()
  }

  if (loading) {
    return (
      <div className="profile-loading">
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="profile">
      <div className="profile-header">
        <h1>Profile & Preferences</h1>
        <p>Manage your ingredient preferences and skin information</p>
      </div>

      <div className="profile-content">
        <AnimatedCard className="profile-info-card">
          <h3>Account Information</h3>
          <div className="profile-info-item">
            <span className="profile-info-label">Email:</span>
            <span className="profile-info-value">{user?.email}</span>
          </div>
          <AnimatedButton variant="outline" onClick={handleSignOut} className="sign-out-button">
            Sign Out
          </AnimatedButton>
        </AnimatedCard>

        <AnimatedCard className="profile-preferences-card" delay={0.1}>
          <div className="profile-tabs">
            <button
              className={`profile-tab ${activeTab === 'preferences' ? 'active' : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              Preferences
            </button>
            <button
              className={`profile-tab ${activeTab === 'skin-type' ? 'active' : ''}`}
              onClick={() => setActiveTab('skin-type')}
            >
              Skin Type
            </button>
          </div>

          {activeTab === 'preferences' && (
            <div className="preferences-content">
              <div className="preference-section">
                <h4>Liked Ingredients</h4>
                <p className="section-description">Ingredients that work well for your skin</p>
                
                <AnimatedInput
                  placeholder="Search for an ingredient..."
                  value={ingredientSearch}
                  onChange={(e) => setIngredientSearch(e.target.value)}
                />

                {searchResults.length > 0 && (
                  <div className="ingredient-search-results">
                    {searchResults.map((ing) => {
                      const isLiked = preferences?.liked_ingredients?.includes(ing.id)
                      const isSensitive = preferences?.sensitivities?.includes(ing.id)
                      return (
                        <div key={ing.id} className="ingredient-search-item">
                          <div>
                            <div className="ingredient-search-name">{ing.name}</div>
                            <div className="ingredient-search-desc">{ing.description}</div>
                          </div>
                          <div className="ingredient-search-actions">
                            {!isLiked && !isSensitive && (
                              <>
                                <AnimatedButton
                                  variant="secondary"
                                  onClick={() => handleAddLiked(ing.id)}
                                  className="small-button"
                                >
                                  Like
                                </AnimatedButton>
                                <AnimatedButton
                                  variant="outline"
                                  onClick={() => handleAddSensitivity(ing.id)}
                                  className="small-button"
                                >
                                  Sensitive
                                </AnimatedButton>
                              </>
                            )}
                            {isLiked && <span className="tag tag-positive">Liked</span>}
                            {isSensitive && <span className="tag tag-negative">Sensitive</span>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {preferences?.liked_ingredients?.length > 0 && (
                  <div className="preference-list">
                    <h5>Your Liked Ingredients</h5>
                    <div className="ingredient-tags">
                      {preferences.liked_ingredients.map((ingId) => (
                        <span key={ingId} className="tag tag-positive">
                          {ingId}
                          <button
                            className="tag-remove"
                            onClick={() => removeLikedIngredient(ingId)}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="preference-section">
                <h4>Sensitivities & Allergies</h4>
                <p className="section-description">Ingredients that cause reactions</p>

                {preferences?.sensitivities?.length > 0 && (
                  <div className="preference-list">
                    <div className="ingredient-tags">
                      {preferences.sensitivities.map((ingId) => (
                        <span key={ingId} className="tag tag-negative">
                          {ingId}
                          <button
                            className="tag-remove"
                            onClick={() => removeSensitivity(ingId)}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'skin-type' && (
            <div className="skin-type-content">
              <h4>Your Skin Type</h4>
              <p className="section-description">Select your primary skin type</p>
              <div className="skin-type-options">
                {skinTypes.map((type) => (
                  <button
                    key={type}
                    className={`skin-type-button ${
                      preferences?.skin_type === type ? 'active' : ''
                    }`}
                    onClick={() => handleSkinTypeChange(type)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
              {preferences?.skin_type && (
                <p className="skin-type-selected">
                  Current: <strong>{preferences.skin_type}</strong>
                </p>
              )}
            </div>
          )}
        </AnimatedCard>
      </div>
    </div>
  )
}

export default Profile

