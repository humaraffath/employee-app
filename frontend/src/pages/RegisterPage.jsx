import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.js'
import { getErrorMessage } from '../utils/errorUtils.js'

const initialForm = {
  name: '',
  email: '',
  password: '',
  departmentId: '',
}

export function RegisterPage() {
  const [formData, setFormData] = useState(initialForm)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const onChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: name === 'departmentId' ? Number(value) : value,
    }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      await register(formData)
      navigate('/login', { replace: true })
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Registration failed. Please try again.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-4">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h2 className="h4 text-center mb-3">Create Account</h2>
            {errorMessage && <div className="alert alert-danger py-2">{errorMessage}</div>}
            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={onChange}
                  required
                />
              </div>
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
                  minLength={6}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="departmentId" className="form-label">
                  Department ID
                </label>
                <input
                  id="departmentId"
                  name="departmentId"
                  type="number"
                  min="1"
                  className="form-control"
                  value={formData.departmentId}
                  onChange={onChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                {isSubmitting ? 'Creating account...' : 'Register'}
              </button>
            </form>
            <p className="text-center small mt-3 mb-0">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
