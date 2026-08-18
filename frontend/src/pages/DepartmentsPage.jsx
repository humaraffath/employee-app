import { useEffect, useState } from 'react'
import { useAuth } from '../auth/useAuth.js'
import { departmentApi } from '../services/departmentApi.js'
import { getErrorMessage } from '../utils/errorUtils.js'

const initialForm = {
  name: '',
  description: '',
}

export function DepartmentsPage() {
  const { user } = useAuth()
  const [departments, setDepartments] = useState([])
  const [formData, setFormData] = useState(initialForm)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canManage = user.role === 'HR' || user.role === 'ADMIN'

  const loadDepartments = async () => {
    setErrorMessage('')
    try {
      const data = await departmentApi.getAll()
      setDepartments(data)
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Failed to load departments.'))
    }
  }

  useEffect(() => {
    loadDepartments()
  }, [])

  const onChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')
    try {
      await departmentApi.create(formData)
      setFormData(initialForm)
      await loadDepartments()
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Failed to create department.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <h1 className="h3 page-title">Departments</h1>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      {canManage && (
        <div className="card mb-4">
          <div className="card-body">
            <h2 className="h5">Create Department</h2>
            <form onSubmit={onSubmit} className="row g-3">
              <div className="col-md-5">
                <input
                  name="name"
                  className="form-control"
                  placeholder="Department name"
                  value={formData.name}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="col-md-5">
                <input
                  name="description"
                  className="form-control"
                  placeholder="Description"
                  value={formData.description}
                  onChange={onChange}
                />
              </div>
              <div className="col-md-2 d-grid">
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="row g-3">
        {departments.map((department) => (
          <div className="col-md-6 col-lg-4" key={department.id}>
            <div className="card card-hover h-100">
              <div className="card-body">
                <h5 className="card-title">{department.name}</h5>
                <p className="card-text text-muted mb-2">{department.description || 'No description'}</p>
                <span className="badge bg-light text-dark">ID: {department.id}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
