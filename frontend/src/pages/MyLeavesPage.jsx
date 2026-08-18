import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../auth/useAuth.js'
import { leaveApi } from '../services/leaveApi.js'
import { getErrorMessage } from '../utils/errorUtils.js'

const initialForm = {
  leaveType: 'CASUAL',
  startDate: '',
  endDate: '',
  reason: '',
}

export function MyLeavesPage() {
  const { user } = useAuth()
  const [leaves, setLeaves] = useState([])
  const [formData, setFormData] = useState(initialForm)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadLeaves = useCallback(async () => {
    setErrorMessage('')
    try {
      const data = await leaveApi.getByEmployee(user.id)
      setLeaves(data)
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Failed to load leave applications.'))
    }
  }, [user.id])

  useEffect(() => {
    loadLeaves()
  }, [loadLeaves])

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
      await leaveApi.apply(user.id, formData)
      setFormData(initialForm)
      await loadLeaves()
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Failed to apply for leave.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <h1 className="h3 page-title">My Leaves</h1>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <div className="card mb-4">
        <div className="card-body">
          <h2 className="h5 mb-3">Apply for Leave</h2>
          <form onSubmit={onSubmit} className="row g-3">
            <div className="col-md-3">
              <select
                name="leaveType"
                className="form-select"
                value={formData.leaveType}
                onChange={onChange}
                required
              >
                <option value="CASUAL">CASUAL</option>
                <option value="SICK">SICK</option>
                <option value="EARNED">EARNED</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>
            <div className="col-md-3">
              <input
                name="startDate"
                type="date"
                className="form-control"
                value={formData.startDate}
                onChange={onChange}
                required
              />
            </div>
            <div className="col-md-3">
              <input
                name="endDate"
                type="date"
                className="form-control"
                value={formData.endDate}
                onChange={onChange}
                required
              />
            </div>
            <div className="col-md-3 d-grid">
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Apply'}
              </button>
            </div>
            <div className="col-12">
              <textarea
                name="reason"
                className="form-control"
                rows="2"
                placeholder="Reason"
                value={formData.reason}
                onChange={onChange}
                required
              />
            </div>
          </form>
        </div>
      </div>

      <div className="row g-3">
        {leaves.map((leave) => (
          <div className="col-md-6 col-lg-4" key={leave.id}>
            <div className="card card-hover h-100">
              <div className="card-body">
                <h5 className="card-title">{leave.leaveType}</h5>
                <p className="mb-1">
                  {leave.startDate} to {leave.endDate}
                </p>
                <p className="mb-2 text-muted">{leave.reason}</p>
                <span className="badge text-bg-secondary">{leave.status}</span>
                {leave.rejectionReason && (
                  <p className="mt-2 mb-0 text-danger small">Reason: {leave.rejectionReason}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
