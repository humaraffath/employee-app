import { useEffect, useState } from 'react'
import { departmentApi } from '../services/departmentApi.js'
import { employeeApi } from '../services/employeeApi.js'
import { getErrorMessage } from '../utils/errorUtils.js'

const initialForm = {
  name: '',
  email: '',
  password: '',
  phone: '',
  designation: '',
  joiningDate: '',
  role: 'EMPLOYEE',
  status: 'ACTIVE',
  leaveBalance: 12,
  departmentId: '',
}

export function EmployeesPage() {
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])
  const [formData, setFormData] = useState(initialForm)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadData = async () => {
    setErrorMessage('')
    try {
      const [employeeData, departmentData] = await Promise.all([employeeApi.getAll(), departmentApi.getAll()])
      setEmployees(employeeData)
      setDepartments(departmentData)
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Failed to load employees data.'))
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const onChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: name === 'leaveBalance' || name === 'departmentId' ? Number(value) : value,
    }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')

    try {
      await employeeApi.create(formData)
      setFormData(initialForm)
      await loadData()
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Failed to create employee.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <h1 className="h3 page-title">Employees</h1>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <div className="card mb-4">
        <div className="card-body">
          <h2 className="h5 mb-3">Add Employee</h2>
          <form onSubmit={onSubmit} className="row g-3">
            <div className="col-md-4">
              <input
                name="name"
                className="form-control"
                placeholder="Name"
                value={formData.name}
                onChange={onChange}
                required
              />
            </div>
            <div className="col-md-4">
              <input
                name="email"
                type="email"
                className="form-control"
                placeholder="Email"
                value={formData.email}
                onChange={onChange}
                required
              />
            </div>
            <div className="col-md-4">
              <input
                name="password"
                type="password"
                className="form-control"
                placeholder="Password"
                value={formData.password}
                onChange={onChange}
                required
              />
            </div>
            <div className="col-md-3">
              <input
                name="phone"
                className="form-control"
                placeholder="Phone"
                value={formData.phone}
                onChange={onChange}
              />
            </div>
            <div className="col-md-3">
              <input
                name="designation"
                className="form-control"
                placeholder="Designation"
                value={formData.designation}
                onChange={onChange}
              />
            </div>
            <div className="col-md-3">
              <input
                name="joiningDate"
                type="date"
                className="form-control"
                value={formData.joiningDate}
                onChange={onChange}
              />
            </div>
            <div className="col-md-3">
              <input
                name="leaveBalance"
                type="number"
                min="0"
                className="form-control"
                placeholder="Leave balance"
                value={formData.leaveBalance}
                onChange={onChange}
                required
              />
            </div>
            <div className="col-md-4">
              <select name="role" className="form-select" value={formData.role} onChange={onChange} required>
                <option value="EMPLOYEE">EMPLOYEE</option>
                <option value="HR">HR</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div className="col-md-4">
              <select name="status" className="form-select" value={formData.status} onChange={onChange} required>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="ON_LEAVE">ON_LEAVE</option>
                <option value="TERMINATED">TERMINATED</option>
              </select>
            </div>
            <div className="col-md-4">
              <select
                name="departmentId"
                className="form-select"
                value={formData.departmentId}
                onChange={onChange}
                required
              >
                <option value="">Select department</option>
                {departments.map((department) => (
                  <option value={department.id} key={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 d-grid d-md-flex justify-content-md-end">
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Create Employee'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="row g-3">
        {employees.map((employee) => (
          <div className="col-md-6 col-lg-4" key={employee.id}>
            <div className="card card-hover h-100">
              <div className="card-body">
                <h5 className="card-title">{employee.name}</h5>
                <div className="small text-muted mb-2">{employee.email}</div>
                <div className="d-flex flex-wrap gap-2 mb-2">
                  <span className="badge text-bg-primary">{employee.role}</span>
                  <span className="badge text-bg-secondary">{employee.status}</span>
                </div>
                <p className="mb-1">Department: {employee.departmentName || '-'}</p>
                <p className="mb-1">Designation: {employee.designation || '-'}</p>
                <p className="mb-0">Leave Balance: {employee.leaveBalance}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
