import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, UserPlus, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
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
          <Link to="/" className="nav-link">Home</Link>
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
              {isAdmin && (
                <button
                  onClick={() => navigate('/admin')}
                  style={{
                    background: 'rgba(255,106,0,0.15)', border: '1px solid rgba(255,106,0,0.4)',
                    borderRadius: '0.5rem', padding: '6px 14px',
                    color: '#FF6A00', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600,
                  }}
                >
                  ⚡ Admin Panel
                </button>
              )}
              <button
                onClick={() => navigate('/profile')}
                title="View Profile"
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '999px', padding: '6px 14px 6px 8px',
                  color: '#f0f0f0', cursor: 'pointer', transition: 'background 0.2s',
                  fontSize: '0.875rem', fontWeight: 500,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(249,115,22,0.15)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
              >
                <span style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#ff6a00,#cc3700)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: 800, color: '#fff', flexShrink: 0,
                }}>
                  {user.name.charAt(0).toUpperCase()}
                </span>
                {user.name}
              </button>
              <button
                onClick={handleLogout}
                className="nav-link"
                style={{ color: '#f87171', display: 'flex', alignItems: 'center', gap: '6px' }}
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
