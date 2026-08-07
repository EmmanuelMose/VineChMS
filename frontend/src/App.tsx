import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login/Login';
import Register from './pages/auth/Register/Register';
import VerifyUser from './pages/auth/VerifyUser/VerifyUser';
import ForgotPassword from './pages/auth/ForgotPassword/ForgotPassword';
import VerifyResetCode from './pages/auth/VerifyResetCode/VerifyResetCode';
import ResetPassword from './pages/auth/ResetPassword/ResetPassword';
import ChurchAdminDashboard from './pages/dashboard/churchadmindashboard/ChurchAdminDashboard';
import ChurchAdminDashboardOverview from './pages/dashboard/churchadmindashboard/dashboard/ChurchAdminDashboardOverview';
import Members from './pages/dashboard/churchadmindashboard/members/Members';
import Leaders from './pages/dashboard/churchadmindashboard/leaders/Leaders';
import Services from './pages/dashboard/churchadmindashboard/services/Services';
import Attendance from './pages/dashboard/churchadmindashboard/attendance/Attandance';
import Events from './pages/dashboard/churchadmindashboard/events/Events';
import Announcements from './pages/dashboard/churchadmindashboard/announcements/Announcements';
import PrayerRequests from './pages/dashboard/churchadmindashboard/prayer/PrayerRequests';
import Settings from './pages/dashboard/churchadmindashboard/settings/Settings';

function App() {
  const token = useSelector((state: any) => state.user.token);
  const userRole = useSelector((state: any) => state.user.user?.role);
  const isAuthenticated = !!token;
  const isChurchAdmin = isAuthenticated && userRole === 'church_admin';

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/verify-user" element={<VerifyUser />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/verify-reset-code" element={<VerifyResetCode />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        
        <Route 
          path="/dashboard/church-admin" 
          element={isChurchAdmin ? <ChurchAdminDashboard /> : <Navigate to="/auth/login" />}
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ChurchAdminDashboardOverview />} />
          <Route path="members" element={<Members />} />
          <Route path="leaders" element={<Leaders />} />
          <Route path="services" element={<Services />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="events" element={<Events />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="prayer" element={<PrayerRequests />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;