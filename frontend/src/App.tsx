

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
import Positions from './pages/dashboard/churchadmindashboard/positions/Positions';
import Services from './pages/dashboard/churchadmindashboard/services/Services';
import Attendance from './pages/dashboard/churchadmindashboard/attendance/Attandance';
import Events from './pages/dashboard/churchadmindashboard/events/Events';
import AdminAnnouncements from './pages/dashboard/churchadmindashboard/announcements/Announcements';
import PrayerRequests from './pages/dashboard/churchadmindashboard/prayer/PrayerRequests';
import Giving from './pages/dashboard/churchadmindashboard/giving/Giving';
import Expenses from './pages/dashboard/churchadmindashboard/expenses/Expenses';
import Pledges from './pages/dashboard/churchadmindashboard/pledges/Pledges';
import Visitors from './pages/dashboard/churchadmindashboard/visitors/Visitors';
import Groups from './pages/dashboard/churchadmindashboard/groups/Groups';
import Sermons from './pages/dashboard/churchadmindashboard/sermons/Sermons';
import Reports from './pages/dashboard/churchadmindashboard/reports/Reports';
import Analytics from './pages/dashboard/churchadmindashboard/analytics/Analytics';
import Documents from './pages/dashboard/churchadmindashboard/documents/Documents';
import Settings from './pages/dashboard/churchadmindashboard/settings/Settings';
import ChurchMemberDashboard from './pages/dashboard/churchmemberdashboard/ChurchMemberDashboard';
import ChurchMemberDashboardOverview from './pages/dashboard/churchmemberdashboard/dashboard/ChurchMemberDashboardOverview';
import MemberAnnouncements from './pages/dashboard/churchmemberdashboard/announcements/Announcements';
import MemberEvents from './pages/dashboard/churchmemberdashboard/events/Events';
import MemberSermons from './pages/dashboard/churchmemberdashboard/sermons/Sermons';
import MemberServices from './pages/dashboard/churchmemberdashboard/services/Services';
import MemberPrayerRequests from './pages/dashboard/churchmemberdashboard/prayer/PrayerRequests';
import MemberGroups from './pages/dashboard/churchmemberdashboard/groups/Groups';
import MemberAttendance from './pages/dashboard/churchmemberdashboard/attendance/MyAttendance';
import MyGiving from './pages/dashboard/churchmemberdashboard/giving/MyGiving';
import MemberExpenses from './pages/dashboard/churchmemberdashboard/expenses/MyExpenses';
import MyLeadership from './pages/dashboard/churchmemberdashboard/leadership/MyLeadership';
import MyPledges from './pages/dashboard/churchmemberdashboard/pledges/MyPledges';
import MemberVisitors from './pages/dashboard/churchmemberdashboard/visitors/Visitors';
import MemberPositions from './pages/dashboard/churchmemberdashboard/positions/Positions';
import MemberAnalytics from './pages/dashboard/churchmemberdashboard/analytics/Analytics';
import MemberReports from './pages/dashboard/churchmemberdashboard/reports/Reports';
import MemberDocuments from './pages/dashboard/churchmemberdashboard/documents/Documents';
import MemberProfile from './pages/dashboard/churchmemberdashboard/profile/MemberProfile';
import Chatbot from './components/chatbot/Chatbot';

function App() {
  const token = useSelector((state: any) => state.user.token);
  const userRole = useSelector((state: any) => state.user.user?.role);
  const isAuthenticated = !!token;
  const isChurchAdmin = isAuthenticated && userRole === 'church_admin';
  const isChurchMember = isAuthenticated && ['church_member', 'pastor', 'elder', 'treasurer', 'secretary'].includes(userRole);

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
          element={isChurchAdmin ? <ChurchAdminDashboard /> : <Navigate to="/" />}
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ChurchAdminDashboardOverview />} />
          <Route path="members" element={<Members />} />
          <Route path="leaders" element={<Leaders />} />
          <Route path="positions" element={<Positions />} />
          <Route path="services" element={<Services />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="events" element={<Events />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          <Route path="prayer" element={<PrayerRequests />} />
          <Route path="giving" element={<Giving />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="pledges" element={<Pledges />} />
          <Route path="visitors" element={<Visitors />} />
          <Route path="groups" element={<Groups />} />
          <Route path="sermons" element={<Sermons />} />
          <Route path="reports" element={<Reports />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="documents" element={<Documents />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route 
          path="/dashboard/member" 
          element={isChurchMember ? <ChurchMemberDashboard /> : <Navigate to="/" />}
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ChurchMemberDashboardOverview />} />
          <Route path="announcements" element={<MemberAnnouncements />} />
          <Route path="events" element={<MemberEvents />} />
          <Route path="sermons" element={<MemberSermons />} />
          <Route path="services" element={<MemberServices />} />
          <Route path="prayer" element={<MemberPrayerRequests />} />
          <Route path="groups" element={<MemberGroups />} />
          <Route path="attendance" element={<MemberAttendance />} />
          <Route path="giving" element={<MyGiving />} />
          <Route path="expenses" element={<MemberExpenses />} />
          <Route path="pledges" element={<MyPledges />} />
          <Route path="visitors" element={<MemberVisitors />} />
          <Route path="positions" element={<MemberPositions />} />
          <Route path="leadership" element={<MyLeadership />} />
          <Route path="analytics" element={<MemberAnalytics />} />
          <Route path="reports" element={<MemberReports />} />
          <Route path="documents" element={<MemberDocuments />} />
          <Route path="profile" element={<MemberProfile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      <Chatbot />
    </Router>
  );
}

export default App;