import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from './admin/AdminLayout'
import { OverviewPage } from './admin/pages/OverviewPage'
import { VerificationsPage } from './admin/pages/VerificationsPage'
import { DisputesPage } from './admin/pages/DisputesPage'
import { UserManagementPage } from './admin/pages/UserManagementPage'
import { AnalyticsPage } from './admin/pages/AnalyticsPage'
import { SettingsPage } from './admin/pages/SettingsPage'
import { CreateAdminPage } from './admin/pages/CreateAdminPage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { UserDashboardPage } from './pages/UserDashboardPage'
import { UnauthorizedPage } from './pages/UnauthorizedPage'
import { ProtectedRoute } from './components/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['User', 'Admin', 'SuperAdmin']}>
            <UserDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<OverviewPage />} />
        <Route path="dashboard" element={<Navigate to="/admin" replace />} />
        <Route path="verifications" element={<VerificationsPage />} />
        <Route path="disputes" element={<DisputesPage />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route
          path="create"
          element={
            <ProtectedRoute allowedRoles={['SuperAdmin']}>
              <CreateAdminPage />
            </ProtectedRoute>
          }
        />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
