import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Container, Card, Form, Button, Alert } from 'react-bootstrap'
import { BsCalendarCheck } from 'react-icons/bs'
import axios from 'axios'
import API_BASE_URL from '../config/api'

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    psNumber: '',
    deptCode: '',
    bookingDate: ''
  })
  const [alert, setAlert] = useState({ show: false, variant: '', message: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Set min date to today
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    
    // Set default date based on current time
    // If it's after 10 AM, set default to tomorrow, otherwise today
    const currentHour = today.getHours()
    
    if (currentHour >= 10) {
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      const tomorrowYear = tomorrow.getFullYear()
      const tomorrowMonth = String(tomorrow.getMonth() + 1).padStart(2, '0')
      const tomorrowDay = String(tomorrow.getDate()).padStart(2, '0')
      
      setFormData(prev => ({
        ...prev,
        bookingDate: `${tomorrowYear}-${tomorrowMonth}-${tomorrowDay}`
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        bookingDate: `${year}-${month}-${day}`
      }))
    }
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/bookings`, formData)
      
      // Show success message
      setAlert({
        show: true,
        variant: 'success',
        message: 'Your lunch booking has been confirmed!'
      })
      
      // Reset form
      setFormData({
        name: '',
        psNumber: '',
        deptCode: '',
        bookingDate: formData.bookingDate // Keep the date
      })
      
      // Hide alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false, variant: '', message: '' })
      }, 3000)
    } catch (error) {
      // Show error message
      setAlert({
        show: true,
        variant: 'danger',
        message: error.response?.data?.message || 'Error: Unable to book lunch. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <Container>
          <span className="navbar-brand">
            <img src="/src/assets/lt.png" alt="LT Logo" height="30" className="me-2" />
            Employee Lunch Booking System
          </span>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {/* Admin login link removed */}
            </ul>
          </div>
        </Container>
      </nav>
      
      <Container className="py-5" style={{ maxWidth: '600px' }}>
      <Card>
        <Card.Header className="text-center py-3">
          <h4 className="mb-0">
            <BsCalendarCheck className="me-2" />
            Lunch Booking Form
          </h4>
        </Card.Header>
        <Card.Body className="p-4">
          {alert.show && (
            <Alert variant={alert.variant}>
              {alert.message}
            </Alert>
          )}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>PS Number</Form.Label>
              <Form.Control
                type="text"
                name="psNumber"
                value={formData.psNumber}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Department Code</Form.Label>
              <Form.Control
                type="text"
                name="deptCode"
                value={formData.deptCode}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Booking Date</Form.Label>
              <Form.Control
                type="date"
                name="bookingDate"
                value={formData.bookingDate}
                onChange={handleChange}
                required
              />
              <Form.Text className="text-muted">
                {new Date().getHours() >= 10 
                  ? "Bookings after 10 AM are for the next day."
                  : "Bookings before 10 AM are for today."}
              </Form.Text>
            </Form.Group>
            
            <div className="d-grid gap-2">
              <Button 
                type="submit" 
                variant="primary" 
                className="py-2"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Book Lunch'}
              </Button>
            </div>
          </Form>
          
          <div className="text-center mt-3">
            {/* Admin link removed to avoid duplication with the navbar link */}
          </div>
        </Card.Body>
      </Card>
    </Container>
    </>
  )
}

export default BookingForm