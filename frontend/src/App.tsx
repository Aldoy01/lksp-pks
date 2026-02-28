import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import AppShell from '@/components/layout/AppShell'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import MapPage from '@/pages/MapPage'
import InputDataPage from '@/pages/InputDataPage'
import SkorPage from '@/pages/SkorPage'
import AdminPage from '@/pages/AdminPage'

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { token, user } = useAuthStore()
  if (!token) return <Navigate to="/login" replace />
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

export default function App() {
  const { token } = useAuthStore()

  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="peta-risiko" element={<MapPage />} />
        <Route
          path="input-data"
          element={
            <ProtectedRoute roles={['Admin', 'Analis']}>
              <InputDataPage />
            </ProtectedRoute>
          }
        />
        <Route path="skor" element={<SkorPage />} />
        <Route
          path="admin"
          element={
            <ProtectedRoute roles={['Admin']}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
