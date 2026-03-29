import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, LogIn, UserPlus, LogOut, User as UserIcon, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isInterviewPage = location.pathname === '/interview';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav 
      className="nav" 
      style={isInterviewPage ? { background: '#000000', backdropFilter: 'none', borderBottom: '1px solid #333' } : {}}
    >
      <div className="nav-container">
        <Link to="/" className="flex items-center gap-2">
          <span className="logo">Panel<span className="logo-accent">Q</span></span>
        </Link>

        <div className="nav-links">
          <button
            onClick={() => navigate('/')}
            className="nav-link"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Home className="w-4 h-4" />
            Home
          </button>
          <Link to="/setup" className="nav-link">Interview</Link>
          <Link to="/dashboard" className="nav-link">Interview Room</Link>
          
          {!user ? (
            <>
              <Link to="/login" className="nav-link flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                <UserPlus className="w-4 h-4" />
                Register
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="flex items-center gap-2 nav-link">
                <UserIcon className="w-4 h-4" />
                {user.name}
              </Link>
              <button 
                onClick={handleLogout}
                className="nav-link"
                style={{ color: '#f87171' }}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
