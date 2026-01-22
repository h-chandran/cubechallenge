import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import { useAuth } from './AuthContext'

const UserPreferencesContext = createContext({})

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext)
  if (!context) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider')
  }
  return context
}

export const UserPreferencesProvider = ({ children }) => {
  const { user } = useAuth()
  const [preferences, setPreferences] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadPreferences()
    } else {
      setPreferences(null)
      setLoading(false)
    }
  }, [user])

  const loadPreferences = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "not found" - that's okay for new users
        console.error('Error loading preferences:', error)
      }

      if (data) {
        setPreferences(data)
      } else {
        // Create default preferences
        const defaultPrefs = {
          user_id: user.id,
          liked_ingredients: [],
          disliked_ingredients: [],
          sensitivities: [],
          skin_type: null,
        }
        setPreferences(defaultPrefs)
      }
    } catch (error) {
      console.error('Error loading preferences:', error)
    } finally {
      setLoading(false)
    }
  }

  const updatePreferences = async (updates) => {
    if (!user) return { error: 'Not authenticated' }

    try {
      const updatedPrefs = {
        ...preferences,
        ...updates,
        user_id: user.id,
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from('user_preferences')
        .upsert(updatedPrefs, {
          onConflict: 'user_id',
        })
        .select()
        .single()

      if (error) {
        console.error('Error updating preferences:', error)
        return { error }
      }

      setPreferences(data)
      return { data, error: null }
    } catch (error) {
      console.error('Error updating preferences:', error)
      return { error }
    }
  }

  const addLikedIngredient = async (ingredientId) => {
    const currentLiked = preferences?.liked_ingredients || []
    if (!currentLiked.includes(ingredientId)) {
      return await updatePreferences({
        liked_ingredients: [...currentLiked, ingredientId],
      })
    }
    return { error: null }
  }

  const removeLikedIngredient = async (ingredientId) => {
    const currentLiked = preferences?.liked_ingredients || []
    return await updatePreferences({
      liked_ingredients: currentLiked.filter(id => id !== ingredientId),
    })
  }

  const addSensitivity = async (ingredientId) => {
    const currentSensitivities = preferences?.sensitivities || []
    if (!currentSensitivities.includes(ingredientId)) {
      return await updatePreferences({
        sensitivities: [...currentSensitivities, ingredientId],
      })
    }
    return { error: null }
  }

  const removeSensitivity = async (ingredientId) => {
    const currentSensitivities = preferences?.sensitivities || []
    return await updatePreferences({
      sensitivities: currentSensitivities.filter(id => id !== ingredientId),
    })
  }

  const setSkinType = async (skinType) => {
    return await updatePreferences({ skin_type: skinType })
  }

  const value = {
    preferences,
    loading,
    updatePreferences,
    addLikedIngredient,
    removeLikedIngredient,
    addSensitivity,
    removeSensitivity,
    setSkinType,
    refreshPreferences: loadPreferences,
  }

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  )
}

