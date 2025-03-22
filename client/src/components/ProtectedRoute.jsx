import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/admin" />
  }
  
  return children
}

export default ProtectedRoute