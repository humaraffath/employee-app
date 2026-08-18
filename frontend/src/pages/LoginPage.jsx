import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.js'
import { getErrorMessage } from '../utils/errorUtils.js'

const initialForm = {
  email: '',
  password: '',
}

export function LoginPage() {
  const [formData, setFormData] = useState(initialForm)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectPath = location.state?.from?.pathname ?? '/'

  const onChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      await login(formData)
      navigate(redirectPath, { replace: true })
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Login failed. Please try again.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-4">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h2 className="h4 text-center mb-3">Employee App Login</h2>
            {errorMessage && <div className="alert alert-danger py-2">{errorMessage}</div>}
            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-control"
                  value={formData.email}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-control"
                  value={formData.password}
                  onChange={onChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'Login'}
              </button>
            </form>
            <p className="text-center small mt-3 mb-0">
              New user? <Link to="/register">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
