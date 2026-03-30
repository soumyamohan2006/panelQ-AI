import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import SetupInterview from './SetupInterview';
import Interview from './Interview';
import Result from './Result';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './Dashboard';
import ChatInterview from './ChatInterview';
import Preparation from './Preparation';
import Profile from './Profile';
import ChangePassword from './ChangePassword';
import JobHunter from './JobHunter';

function Layout() {
  const location = useLocation();
  const showFooter = location.pathname === '/';
  return (
    <div className="app-wrapper">
      <Navbar />
      <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat-interview" element={<ChatInterview />} />
            <Route path="/preparation" element={<Preparation />} />
            <Route path="/login" element={<Login />} />
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
            <Route 
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/job-hunter" element={<JobHunter />} />
            <Route 
              path="/change-password"
              element={
                <ProtectedRoute>
                  <ChangePassword />
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
