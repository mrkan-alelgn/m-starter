import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider.jsx'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'
import { LandingPage } from './pages/LandingPage.jsx'
import { DashboardLayout } from './pages/DashboardLayout.jsx'
import { DashboardHomePage } from './pages/DashboardHomePage.jsx'
import { WorkspaceTeamPage } from './pages/WorkspaceTeamPage.jsx'
import { SamplesTanStackTablePage } from './pages/SamplesTanStackTablePage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHomePage />} />
            <Route path="team" element={<WorkspaceTeamPage />} />
            <Route path="samples/table" element={<SamplesTanStackTablePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
