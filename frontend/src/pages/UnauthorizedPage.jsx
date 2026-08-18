import { Link } from 'react-router-dom'

export function UnauthorizedPage() {
  return (
    <div className="alert alert-warning">
      <h1 className="h4">Access denied</h1>
      <p className="mb-3">You do not have permission to view this page.</p>
      <Link className="btn btn-outline-primary btn-sm" to="/">
        Go to dashboard
      </Link>
    </div>
  )
}
