import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { UserPreferencesProvider } from './contexts/UserPreferencesContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Navigation from './components/common/Navigation'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import SurveyWizard from './pages/onboarding/SurveyWizard'
import AddProducts from './pages/onboarding/AddProducts'
import Dashboard from './pages/Dashboard'
import Search from './pages/Search'
import ProductDetail from './pages/ProductDetail'
import RoutineBuilderPage from './pages/RoutineBuilderPage'
import Checkin from './pages/Checkin'
import Fingerprint from './pages/Fingerprint'
import Community from './pages/Community'
import Circle from './pages/Circle'
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
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Onboarding Routes */}
                <Route
                  path="/onboarding/survey"
                  element={
                    <ProtectedRoute>
                      <SurveyWizard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/onboarding/products"
                  element={
                    <ProtectedRoute>
                      <AddProducts />
                    </ProtectedRoute>
                  }
                />

                {/* Core App Routes */}
                <Route
                  path="/app/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/app/search"
                  element={
                    <ProtectedRoute>
                      <Search />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/app/product/:id"
                  element={
                    <ProtectedRoute>
                      <ProductDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/app/routine"
                  element={
                    <ProtectedRoute>
                      <RoutineBuilderPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/app/checkin"
                  element={
                    <ProtectedRoute>
                      <Checkin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/app/fingerprint"
                  element={
                    <ProtectedRoute>
                      <Fingerprint />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/app/community"
                  element={
                    <ProtectedRoute>
                      <Community />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/app/community/circle/:id"
                  element={
                    <ProtectedRoute>
                      <Circle />
                    </ProtectedRoute>
                  }
                />

                {/* Legacy routes for backward compatibility */}
                <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
                <Route path="/routine-builder" element={<Navigate to="/app/routine" replace />} />
                <Route path="/ingredient-checker" element={<Navigate to="/app/search" replace />} />
              </Routes>
            </main>
          </div>
        </UserPreferencesProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
