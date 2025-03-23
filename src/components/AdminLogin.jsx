import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Container, Card, Form, Button, Alert } from 'react-bootstrap'
import { BsShieldLock, BsCalendarCheck } from 'react-icons/bs'
import api from '../utils/api'

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
      <nav className="navbar navbar-dark bg-primary">
        <Container>
          <span className="navbar-brand">
            <img src="/ELB/lt.png" alt="LT Logo" height="30" className="me-2" />
            Employee Lunch Booking System
          </span>
          <div className="d-flex">
            <Link className="btn btn-primary me-2" to="/">Back to Booking</Link>
          </div>
        </Container>
      </nav>

      <Container className="py-5">
        <Card className="shadow-sm mx-auto" style={{ maxWidth: '400px' }}>
          <Card.Body className="p-4">
            <div className="text-center mb-4">
              <BsShieldLock size={30} className="text-primary mb-2" />
              <h2 className="h4">Admin Login</h2>
              <p className="text-muted">Sign in to access the dashboard</p>
            </div>

            {error && (
              <Alert variant="danger" className="mb-3">
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

              <Form.Group className="mb-4">
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