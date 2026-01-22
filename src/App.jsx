import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { UserPreferencesProvider } from './contexts/UserPreferencesContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Navigation from './components/common/Navigation'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import IngredientCheckerPage from './pages/IngredientCheckerPage'
import RoutineBuilderPage from './pages/RoutineBuilderPage'
import Profile from './pages/Profile'
import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserPreferencesProvider>
          <div className="App">
            <Navigation />
            <main className="main-content">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ingredient-checker"
                  element={
                    <ProtectedRoute>
                      <IngredientCheckerPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/routine-builder"
                  element={
                    <ProtectedRoute>
                      <RoutineBuilderPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
          </div>
        </UserPreferencesProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
