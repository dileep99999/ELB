import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Table, Spinner, Button } from 'react-bootstrap'
import { BsCalendarCheck, BsBoxArrowRight } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const Analyze = ({ setIsAuthenticated }) => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalBookings: 0,
    todayBookings: 0,
    departments: []
  })
  
  useEffect(() => {
    loadStatistics()
  }, [])
  
  const loadStatistics = async () => {
    setLoading(true)
    
    try {
      const token = localStorage.getItem('elbsAuthToken')
      
      const response = await axios.get('/api/bookings/stats', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      setStats(response.data)
    } catch (error) {
      console.error('Error loading statistics:', error)
    } finally {
      setLoading(false)
    }
  }
  
  // Prepare data for pie chart
  const pieData = {
    labels: stats.departments.map(dept => dept._id),
    datasets: [
      {
        data: stats.departments.map(dept => dept.count),
        backgroundColor: [
          '#4285F4', // Blue
          '#34A853', // Green
          '#FBBC05', // Yellow
          '#EA4335', // Red
          '#8F00FF', // Purple
          '#00FFFF', // Cyan
          '#FF00FF', // Magenta
          '#FF8000', // Orange
          '#00FF00', // Lime
          '#FF0080'  // Pink
        ],
        borderWidth: 1,
      },
    ],
  }
  
  // Prepare data for bar chart
  const barData = {
    labels: stats.departments.map(dept => dept._id),
    datasets: [
      {
        label: 'Number of Bookings',
        data: stats.departments.map(dept => dept.count),
        backgroundColor: '#4285F4',
      },
    ],
  }
  
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Department Booking Distribution',
      },
    },
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
                <Link className="nav-link" to="/dashboard">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" to="/analyze">Analyze</Link>
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
      <h2 className="mb-4">Booking Analytics</h2>
      
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading analytics...</p>
        </div>
      ) : (
        <>
          <Row className="mb-4">
            <Col md={6}>
              <Card className="stats-card bg-primary text-white mb-4">
                <Card.Body className="text-center">
                  <h5 className="card-title">Total Bookings</h5>
                  <h2>{stats.totalBookings}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="stats-card bg-success text-white mb-4">
                <Card.Body className="text-center">
                  <h5 className="card-title">Today's Bookings</h5>
                  <h2>{stats.todayBookings}</h2>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <Row>
            <Col md={6}>
              <Card className="mb-4">
                <Card.Body>
                  <h5 className="card-title mb-4">Department Distribution</h5>
                  <div style={{ height: '300px' }}>
                    <Pie data={pieData} options={{ maintainAspectRatio: false }} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="mb-4">
                <Card.Body>
                  <h5 className="card-title mb-4">Booking by Department</h5>
                  <div style={{ height: '300px' }}>
                    <Bar options={barOptions} data={barData} height={300} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <Card>
            <Card.Body>
              <h5 className="card-title mb-3">Department Breakdown</h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Number of Bookings</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.departments.map((dept, index) => {
                    const percentage = ((dept.count / stats.totalBookings) * 100).toFixed(2)
                    return (
                      <tr key={index}>
                        <td>{dept._id}</td>
                        <td>{dept.count}</td>
                        <td>{percentage}%</td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </>
      )}
    </Container>
    </div>
  )
}

export default Analyze