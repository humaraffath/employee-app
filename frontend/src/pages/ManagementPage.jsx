import { Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.js'

export function ManagementPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const managementLinks = [
    {
      to: '/departments',
      title: 'Departments',
      description: 'Create and manage departments.',
    },
    ...(isAdmin
      ? [
          {
            to: '/employees',
            title: 'Employees',
            description: 'Manage employee profiles, roles, and status.',
          },
          {
            to: '/manager-leaves',
            title: 'Leave Approvals',
            description: 'Review and approve pending leave applications.',
          },
          {
            to: '/my-leaves',
            title: 'Leaves',
            description: 'View your leave applications.',
          },
          {
            to: '/rag-upload',
            title: 'RAG Upload',
            description: 'Upload PDF files for RAG knowledge.',
          },
        ]
      : []),
  ]

  return (
    <div className="row justify-content-center">
      <div className="col-lg-9">
        <div className="mb-3">
          <h1 className="h3 page-title mb-1">Management</h1>
          <p className="text-muted mb-0">Minimal admin workspace.</p>
        </div>
        <div className="row g-3">
          {managementLinks.map((item) => (
            <div key={item.to} className="col-md-6">
              <div className="card h-100 card-hover">
                <div className="card-body d-flex flex-column">
                  <h2 className="h5 card-title">{item.title}</h2>
                  <p className="card-text mb-4">{item.description}</p>
                  <div className="mt-auto">
                    <Link to={item.to} className="btn btn-outline-light btn-sm">
                      Open
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
