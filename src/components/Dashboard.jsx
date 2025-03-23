<nav className="navbar navbar-dark bg-primary mb-4">
  <Container>
    <span className="navbar-brand">
      <img src="/ELB/lt.png" alt="LT Logo" height="30" className="me-2" />
      ELBS Admin Dashboard
    </span>
    <div className="d-flex">
      <Link className="btn btn-primary me-2" to="/dashboard">Dashboard</Link>
      <Link className="btn btn-primary me-2" to="/analyze">Analyze</Link>
      <Button
        variant="outline-light"
        onClick={handleLogout}
        className="d-flex align-items-center"
      >
        <BsBoxArrowRight className="me-1" /> Logout
      </Button>
    </div>
  </Container>
</nav> 