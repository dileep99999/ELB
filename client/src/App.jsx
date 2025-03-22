import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import BookingForm from './components/BookingForm'
import AdminLogin from './components/AdminLogin'
import Dashboard from './components/Dashboard'
import Analyze from './components/Analyze'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('elbsAuthToken')
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])
  
  // Prevent browser back button navigation
  useEffect(() => {
    const preventNavigation = (e) => {
      // Cancel the event
      e.preventDefault()
      // Chrome requires returnValue to be set
      e.returnValue = ''
    }
    
    // Add event listener for beforeunload
    window.addEventListener('beforeunload', preventNavigation)
    
    // Block browser history navigation
    window.history.pushState(null, null, location.pathname)
    const blockNavigation = () => {
      window.history.pushState(null, null, location.pathname)
    }
    window.addEventListener('popstate', blockNavigation)
    
    return () => {
      window.removeEventListener('beforeunload', preventNavigation)
      window.removeEventListener('popstate', blockNavigation)
    }
  }, [location])

  return (
    <Routes>
      <Route path="/" element={<BookingForm />} />
      <Route path="/admin" element={<AdminLogin setIsAuthenticated={setIsAuthenticated} />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Dashboard setIsAuthenticated={setIsAuthenticated} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/analyze" 
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Analyze setIsAuthenticated={setIsAuthenticated} />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App