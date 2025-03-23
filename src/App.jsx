import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import BookingForm from './components/BookingForm'
import AdminLogin from './components/AdminLogin'
import Dashboard from './components/Dashboard'
import Analyze from './components/Analyze'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('elbsAuthToken')
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])

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
            <Analyze />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App