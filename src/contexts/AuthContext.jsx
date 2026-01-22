import { createContext, useContext, useState } from 'react'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  // Authentication disabled - provide mock user
  const [user] = useState({
    id: 'mock-user-id',
    email: 'user@example.com',
  })
  const [session] = useState(null)
  const [loading] = useState(false)

  // Disabled authentication methods
  const signUp = async (email, password) => {
    return { data: null, error: null }
  }

  const signIn = async (email, password) => {
    return { data: null, error: null }
  }

  const signOut = async () => {
    return { error: null }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

