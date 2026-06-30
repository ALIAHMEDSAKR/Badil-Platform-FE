import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from './admin/AdminLayout'
import { OverviewPage } from './admin/pages/OverviewPage'
import { VerificationsPage } from './admin/pages/VerificationsPage'
import { VerificationDetailPage } from './admin/pages/VerificationDetailPage'
import { DisputesPage } from './admin/pages/DisputesPage'
import { DisputeDetailPage } from './admin/pages/DisputeDetailPage'
import { UserManagementPage } from './admin/pages/UserManagementPage'
import { AnalyticsPage } from './admin/pages/AnalyticsPage'
import { SettingsPage } from './admin/pages/SettingsPage'
import { CreateAdminPage } from './admin/pages/CreateAdminPage'
import { HomePage } from './pages/HomePage'
import { LandingPage } from './pages/LandingPage'
import { ListingDetailPage } from './pages/ListingDetailPage'
import { RegisterPage } from './pages/RegisterPage'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { UnauthorizedPage } from './pages/UnauthorizedPage'
import { ProtectedRoute } from './components/ProtectedRoute'

// New Phase 4 Layouts and Pages
import { DashboardLayout } from './components/layout/DashboardLayout'
import { FactoryDashboard } from './pages/FactoryDashboard'
import { Marketplace } from './pages/Marketplace'
import { LoginPage } from './pages/LoginPage'

// Real implementations for newly built pages
import { MyListings } from './pages/MyListings'
import { NewListing } from './pages/NewListing'
import { Analytics } from './pages/Analytics'
import { Escrow } from './pages/Escrow'
import { Settings } from './pages/Settings'

// Inline placeholder for new layout routes that aren't built yet
const ComingSoon = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-400">
    <div className="w-16 h-16 mb-4 rounded-full bg-[#1a2e2e] flex items-center justify-center">
      <svg className="w-8 h-8 text-[#2dd4bf]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    </div>
    <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
    <p>This module is under construction.</p>
  </div>
);

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/listing/:id" element={<ListingDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Old dashboard redirect */}
      <Route path="/dashboard" element={<Navigate to="/app" replace />} />

      {/* Main App Routes */}
      <Route
        path="/app"
        element={
          <ProtectedRoute allowedRoles={['User', 'Admin', 'SuperAdmin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<FactoryDashboard />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="marketplace/:id" element={<ListingDetailPage />} />
        <Route path="listings" element={<MyListings />} />
        <Route path="listings/new" element={<NewListing />} />
        <Route path="listings/edit/:id" element={<NewListing />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="escrow" element={<Escrow />} />
        <Route path="settings" element={<Settings />} />
        <Route path="support" element={<ComingSoon title="Support" />} />
      </Route>

      {/* Admin Routes */}
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
        <Route path="verifications/:id" element={<VerificationDetailPage />} />
        <Route path="disputes" element={<DisputesPage />} />
        <Route path="disputes/:id" element={<DisputeDetailPage />} />
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
