import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { Dashboard } from './pages/dashboard/Dashboard';
import { VehicleList } from './pages/dashboard/VehicleList';
import { VehicleDetail } from './pages/dashboard/VehicleDetail';
import { VehicleForm } from './pages/dashboard/VehicleForm';
import { UserManagement } from './pages/admin/UserManagement';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';
import { DashboardLayout } from './components/layouts/DashboardLayout';
import { useAuthSync } from './hooks/useAuthSync';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {

  useAuthSync();

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />

        {/* Check Authentication for Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* User Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['USER', 'ADMIN']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/vehicles" element={<VehicleList />} />
            <Route path="/vehicles/:id" element={<VehicleDetail />} />
          </Route>
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/vehicles/new" element={<VehicleForm />} />
            <Route path="/vehicles/:id/edit" element={<VehicleForm />} />

            <Route path="/admin/users" element={<UserManagement />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App
