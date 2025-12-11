import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { Dashboard } from './pages/dashboard/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './components/layouts/DashboardLayout';

function App() {

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* User Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['USER', 'ADMIN']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
