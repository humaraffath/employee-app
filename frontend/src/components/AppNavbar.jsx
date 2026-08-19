import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.js'

export function AppNavbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const isManager = user?.role === 'HR' || user?.role === 'ADMIN'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <NavLink className="navbar-brand fw-semibold" to={isAuthenticated ? '/' : '/login'}>
          Employee App
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#main-nav"
          aria-controls="main-nav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="main-nav">
          {isAuthenticated ? (
            <>
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <NavLink className="nav-link" to="/">
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/ai-chat">
                    Chat
                  </NavLink>
                </li>
                {isManager && (
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/management">
                      Manage
                    </NavLink>
                  </li>
                )}
              </ul>
              <div className="d-flex align-items-center gap-3">
                <span className="text-white-50 small">
                  {user?.name} ({user?.role})
                </span>
                <button type="button" className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink className="nav-link" to="/login">
                  Login
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/register">
                  Register
                </NavLink>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  )
}
