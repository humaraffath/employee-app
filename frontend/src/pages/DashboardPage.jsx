import { useEffect, useState } from 'react'
import { StatCard } from '../components/StatCard.jsx'
import { useAuth } from '../auth/useAuth.js'
import { departmentApi } from '../services/departmentApi.js'
import { employeeApi } from '../services/employeeApi.js'
import { leaveApi } from '../services/leaveApi.js'
import { getErrorMessage } from '../utils/errorUtils.js'

export function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    departments: 0,
    employees: 0,
    myLeaves: 0,
    managerPendingLeaves: 0,
  })
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const loadStats = async () => {
      setErrorMessage('')
      try {
        const [departments, myLeaves] = await Promise.all([
          departmentApi.getAll(),
          leaveApi.getByEmployee(user.id),
        ])

        let employeesCount = 0
        let managerPendingLeaves = 0

        if (user.role === 'HR' || user.role === 'ADMIN') {
          const [employees, managerLeaves] = await Promise.all([
            employeeApi.getAll(),
            leaveApi.getManagerLeaves('PENDING'),
          ])
          employeesCount = employees.length
          managerPendingLeaves = managerLeaves.length
        }

        setStats({
          departments: departments.length,
          employees: employeesCount,
          myLeaves: myLeaves.length,
          managerPendingLeaves,
        })
      } catch (error) {
        setErrorMessage(getErrorMessage(error, 'Failed to load dashboard data.'))
      }
    }

    loadStats()
  }, [user.id, user.role])

  const isManager = user.role === 'HR' || user.role === 'ADMIN'

  return (
    <>
      <h1 className="h3 page-title">Welcome, {user.name}</h1>
      <div className="mb-3 text-muted">Role: {user.role}</div>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <div className="row g-3">
        <StatCard title="Departments" value={stats.departments} variant="primary" />
        <StatCard title="My Leave Applications" value={stats.myLeaves} variant="success" />
        {isManager && <StatCard title="Employees" value={stats.employees} variant="info" />}
        {isManager && (
          <StatCard title="Pending Approvals" value={stats.managerPendingLeaves} variant="warning" />
        )}
      </div>
    </>
  )
}
