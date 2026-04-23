import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './Home';
import Login from './Login';
import AdminLogin from './AdminLogin';
import Register from './Register';
import SetupInterview from './SetupInterview';
import Interview from './Interview';
import Result from './Result';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Dashboard from './Dashboard';
import ChatInterview from './ChatInterview';
import Preparation from './Preparation';
import UserProfile from './UserProfile';
import JobHunter from './JobHunter';
import AdminPanel from './AdminPanel';

function Layout() {
  const location = useLocation();
  const showFooter = location.pathname === '/';
  const hideNav = ['/profile', '/dashboard', '/chat-interview', '/preparation', '/job-hunter', '/admin', '/admin-login'].includes(location.pathname);
  return (
    <div className="app-wrapper">
      {!hideNav && <Navbar />}
      <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/chat-interview" element={<ProtectedRoute><ChatInterview /></ProtectedRoute>} />
            <Route path="/preparation" element={<ProtectedRoute><Preparation /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path="/job-hunter" element={<ProtectedRoute><JobHunter /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route 
              path="/setup" 
              element={
                <ProtectedRoute>
                  <SetupInterview />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/interview" 
              element={
                <ProtectedRoute>
                  <Interview />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/result" 
              element={
                <ProtectedRoute>
                  <Result />
                </ProtectedRoute>
              } 
            />
      </Routes>
      {showFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout />
      </Router>
    </AuthProvider>
  );
}
