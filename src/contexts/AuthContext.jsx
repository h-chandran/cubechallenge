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
  // Load user from localStorage on mount
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('auth_user')
    return storedUser ? JSON.parse(storedUser) : null
  })
  const [session] = useState(null)
  const [loading] = useState(false)

  // Dummy credentials
  const DEMO_EMAIL = 'demo@gmail.com'
  const DEMO_PASSWORD = 'demo'

  const signUp = async (email, password) => {
    // For demo purposes, signup is disabled
    return { data: null, error: { message: 'Sign up is not available in demo mode' } }
  }

  const signIn = async (email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Validate credentials
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      const userData = {
        id: 'demo-user-id',
        email: DEMO_EMAIL,
      }
      setUser(userData)
      localStorage.setItem('auth_user', JSON.stringify(userData))
      return { data: { user: userData }, error: null }
    } else {
      return { 
        data: null, 
        error: { message: 'Invalid email or password' } 
      }
    }
  }

  const signOut = async () => {
    setUser(null)
    localStorage.removeItem('auth_user')
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

