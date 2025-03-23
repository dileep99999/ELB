import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Container, Card, Form, Button, Alert } from 'react-bootstrap'
import { BsShieldLock, BsCalendarCheck } from 'react-icons/bs'
import api from '../utils/api'
import API_BASE_URL from '../config/api'

const AdminLogin = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const response = await api.post('/api/auth/login', formData)
      
      // Store token and set authentication state
      localStorage.setItem('elbsAuthToken', response.data.token)
      setIsAuthenticated(true)
      
      // Redirect to dashboard
      navigate('/dashboard')
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid username or password')
      
      // Hide error after 3 seconds
      setTimeout(() => {
        setError('')
      }, 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <Container>
          <span className="navbar-brand">
            <img src="/lt.png" alt="LT Logo" height="30" className="me-2" />
            Employee Lunch Booking System
          </span>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {/* Booking form link removed */}
            </ul>
          </div>
        </Container>
      </nav>
      
      <Container className="py-5" style={{ maxWidth: '400px' }}>
        <Card>
        <Card.Header className="text-center py-3">
          <h4 className="mb-0">
            <BsShieldLock className="me-2" />
            Admin Login
          </h4>
        </Card.Header>
        <Card.Body className="p-4">
          {error && (
            <Alert variant="danger">
              {error}
            </Alert>
          )}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <div className="d-grid gap-2">
              <Button 
                type="submit" 
                variant="primary" 
                className="py-2"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </Form>
          
          <div className="text-center mt-3">
            {/* Back to Booking Form link removed as requested */}
          </div>
        </Card.Body>
      </Card>
    </Container>
    </>
  )
}

export default AdminLogin