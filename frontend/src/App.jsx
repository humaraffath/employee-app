import { Navigate, Route, Routes } from 'react-router-dom'
import { AppNavbar } from './components/AppNavbar.jsx'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'
import { ChatPage } from './pages/ChatPage.jsx'
import { DashboardPage } from './pages/DashboardPage.jsx'
import { DepartmentsPage } from './pages/DepartmentsPage.jsx'
import { EmployeesPage } from './pages/EmployeesPage.jsx'
import { LoginPage } from './pages/LoginPage.jsx'
import { ManagementPage } from './pages/ManagementPage.jsx'
import { ManagerLeavesPage } from './pages/ManagerLeavesPage.jsx'
import { MyLeavesPage } from './pages/MyLeavesPage.jsx'
import { RegisterPage } from './pages/RegisterPage.jsx'
import { UnauthorizedPage } from './pages/UnauthorizedPage.jsx'

function App() {
  return (
    <>
      <AppNavbar />
      <main className="container py-4">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/departments"
            element={
              <ProtectedRoute>
                <DepartmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <ProtectedRoute roles={['HR', 'ADMIN']}>
                <EmployeesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-leaves"
            element={
              <ProtectedRoute>
                <MyLeavesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager-leaves"
            element={
              <ProtectedRoute roles={['HR', 'ADMIN']}>
                <ManagerLeavesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/management"
            element={
              <ProtectedRoute roles={['HR', 'ADMIN']}>
                <ManagementPage />
              </ProtectedRoute>
            }
          />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  )
}

export default App
