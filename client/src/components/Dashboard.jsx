import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Table, Button, Form, Spinner } from 'react-bootstrap'
import { BsCalendarCheck, BsBoxArrowRight, BsArrowClockwise, BsFileEarmarkPdf } from 'react-icons/bs'
import axios from 'axios'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import { Link } from 'react-router-dom'

const Dashboard = ({ setIsAuthenticated }) => {
  const [bookings, setBookings] = useState([])
  const [filterDate, setFilterDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalDepartments: 0,
    departments: []
  })

  useEffect(() => {
    // Set default filter date to today
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    setFilterDate(`${year}-${month}-${day}`)
    
    // Load bookings
    loadBookings(`${year}-${month}-${day}`)
  }, [])

  const loadBookings = async (date) => {
    setLoading(true)
    
    try {
      const token = localStorage.getItem('elbsAuthToken')
      
      const response = await axios.get(`/api/bookings?date=${date}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      setBookings(response.data.bookings)
      updateStatistics(response.data.bookings)
    } catch (error) {
      console.error('Error loading bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDateChange = (e) => {
    const newDate = e.target.value
    setFilterDate(newDate)
    loadBookings(newDate)
  }

  const handleRefresh = () => {
    loadBookings(filterDate)
  }

  const updateStatistics = (bookingData) => {
    // Calculate department statistics
    const departments = {}
    bookingData.forEach(booking => {
      if (departments[booking.deptCode]) {
        departments[booking.deptCode]++
      } else {
        departments[booking.deptCode] = 1
      }
    })
    
    setStats({
      totalBookings: bookingData.length,
      totalDepartments: Object.keys(departments).length,
      departments: Object.entries(departments)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
    })
  }

  const generatePDF = () => {
    const doc = new jsPDF()
    
    // Set title
    doc.setFontSize(16)
    doc.text(`Lunch Bookings - ${filterDate}`, 14, 20)
    
    if (bookings.length === 0) {
      doc.setFontSize(12)
      doc.text('No bookings found for this date.', 14, 40)
      doc.save(`lunch-bookings-${filterDate}.pdf`)
      return
    }
    
    // Prepare table data
    const tableColumn = ['Name', 'PS Number', 'Department', 'Sign']
    const tableRows = []
    
    bookings.forEach(booking => {
      // Create a single Sign column instead of separate date and time columns
      const tableRow = [
        booking.name,
        booking.psNumber,
        booking.deptCode,
        "" // Empty sign column for signature
      ]
      tableRows.push(tableRow)
    })
    
    // Generate table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { overflow: 'linebreak' },
      headStyles: { fillColor: [66, 133, 244] }
    })
    
    // Add statistics
    const finalY = doc.lastAutoTable.finalY + 10
    doc.setFontSize(14)
    doc.text('Booking Statistics', 14, finalY)
    doc.setFontSize(12)
    doc.text(`Total Bookings: ${stats.totalBookings}`, 14, finalY + 10)
    doc.text(`Total Departments: ${stats.totalDepartments}`, 14, finalY + 20)
    
    // Save PDF
    doc.save(`lunch-bookings-${filterDate}.pdf`)
  }

  const handleLogout = () => {
    localStorage.removeItem('elbsAuthToken')
    setIsAuthenticated(false)
    window.location.href = '/admin'
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <Container>
          <span className="navbar-brand">
            <img src="/src/assets/lt.png" alt="LT Logo" height="30" className="me-2" />
            ELBS Admin Dashboard
          </span>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link active" to="/dashboard">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/analyze">Analyze</Link>
              </li>
            </ul>
            <Button 
              variant="outline-light" 
              onClick={handleLogout}
            >
              <BsBoxArrowRight className="me-2" />
              Logout
            </Button>
          </div>
        </Container>
      </nav>

      <Container>
        <Row className="mb-4">
          <Col md={6}>
            <h2>Lunch Bookings</h2>
          </Col>
          <Col md={6} className="text-end">
            <div className="d-flex justify-content-end">
              <Form.Control
                type="date"
                value={filterDate}
                onChange={handleDateChange}
                className="me-2"
                style={{ width: 'auto' }}
              />
              <Button 
                variant="success" 
                className="me-2"
                onClick={generatePDF}
              >
                <BsFileEarmarkPdf className="me-1" /> Download PDF
              </Button>
              <Button 
                variant="primary"
                onClick={handleRefresh}
              >
                <BsArrowClockwise className="me-1" /> Refresh
              </Button>
            </div>
          </Col>
        </Row>

        <Card className="mb-4">
          <Card.Body>
            {loading ? (
              <div className="text-center my-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Loading bookings...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center my-5">
                <i className="bi bi-calendar-x" style={{ fontSize: '3rem' }}></i>
                <p className="mt-3">No bookings found for this date.</p>
              </div>
            ) : (
              <Table responsive striped hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>PS Number</th>
                    <th>Department</th>
                    <th>Date</th>
                    <th>Booking Time</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking, index) => {
                    const bookingDate = new Date(booking.bookingDate)
                    const formattedDate = `${bookingDate.getFullYear()}-${String(bookingDate.getMonth() + 1).padStart(2, '0')}-${String(bookingDate.getDate()).padStart(2, '0')}`
                    
                    const timestamp = new Date(booking.timestamp)
                    const formattedTime = timestamp.toLocaleTimeString()
                    
                    return (
                      <tr key={index}>
                        <td>{booking.name}</td>
                        <td>{booking.psNumber}</td>
                        <td>{booking.deptCode}</td>
                        <td>{formattedDate}</td>
                        <td>{formattedTime}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>

        <Row>
          <Col md={4}>
            <Card className="stats-card bg-primary text-white mb-4">
              <Card.Body className="text-center">
                <h5 className="card-title">Total Bookings</h5>
                <h2>{stats.totalBookings}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="stats-card bg-success text-white mb-4">
              <Card.Body className="text-center">
                <h5 className="card-title">Total Departments</h5>
                <h2>{stats.totalDepartments}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="stats-card mb-4">
              <Card.Body>
                <h5 className="card-title">Department Breakdown</h5>
                <ul className="list-group list-group-flush">
                  {stats.departments.map((dept, index) => (
                    <li 
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {dept.name}
                      <span className="badge bg-primary rounded-pill">{dept.count}</span>
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Dashboard