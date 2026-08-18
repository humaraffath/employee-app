import { useEffect, useState } from 'react'
import { leaveApi } from '../services/leaveApi.js'
import { getErrorMessage } from '../utils/errorUtils.js'

export function ManagerLeavesPage() {
  const [leaves, setLeaves] = useState([])
  const [statusFilter, setStatusFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const loadLeaves = async (status = '') => {
    setErrorMessage('')
    try {
      const data = await leaveApi.getManagerLeaves(status)
      setLeaves(data)
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Failed to load manager leaves.'))
    }
  }

  useEffect(() => {
    loadLeaves(statusFilter)
  }, [statusFilter])

  const onApprove = async (leaveId) => {
    setErrorMessage('')
    try {
      await leaveApi.approve(leaveId)
      await loadLeaves(statusFilter)
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Failed to approve leave.'))
    }
  }

  const onReject = async (leaveId) => {
    const rejectionReason = window.prompt('Enter rejection reason (optional):', '')
    if (rejectionReason === null) {
      return
    }

    setErrorMessage('')
    try {
      await leaveApi.reject(leaveId, rejectionReason)
      await loadLeaves(statusFilter)
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Failed to reject leave.'))
    }
  }

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="h3 page-title mb-0">Manager Leaves</h1>
        <select
          className="form-select"
          style={{ maxWidth: '220px' }}
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="">All statuses</option>
          <option value="PENDING">PENDING</option>
          <option value="APPROVED">APPROVED</option>
          <option value="REJECTED">REJECTED</option>
        </select>
      </div>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <div className="row g-3">
        {leaves.map((leave) => (
          <div className="col-md-6 col-lg-4" key={leave.id}>
            <div className="card card-hover h-100">
              <div className="card-body">
                <h5 className="card-title">{leave.employeeName}</h5>
                <p className="mb-1">Type: {leave.leaveType}</p>
                <p className="mb-1">
                  {leave.startDate} to {leave.endDate}
                </p>
                <p className="mb-2 text-muted">{leave.reason}</p>
                <span className="badge text-bg-secondary">{leave.status}</span>
                {leave.rejectionReason && (
                  <p className="mt-2 mb-0 text-danger small">Reason: {leave.rejectionReason}</p>
                )}
                {leave.status === 'PENDING' && (
                  <div className="mt-3 d-flex gap-2">
                    <button type="button" className="btn btn-success btn-sm" onClick={() => onApprove(leave.id)}>
                      Approve
                    </button>
                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => onReject(leave.id)}>
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
