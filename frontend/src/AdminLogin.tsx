import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Lock, Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from './context/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'https://panelq-ai-2.onrender.com';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      
      if (!data.isAdmin) {
        throw new Error('Admin access required. This account does not have admin privileges.');
      }
      
      login(data.token, { id: data._id, name: data.name, email: data.email, isAdmin: data.isAdmin });
      navigate('/admin');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        style={{ 
          width: '100%', 
          maxWidth: '500px',
          background: 'rgba(20, 20, 20, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 106, 0, 0.2)',
          borderRadius: '1.5rem',
          padding: '3rem',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Shield style={{ width: '32px', height: '32px', color: '#FF6A00' }} />
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'white', margin: 0 }}>Admin Portal</h1>
          </div>
          <p style={{ color: '#999', fontSize: '0.95rem', margin: 0 }}>Secure access for administrators only</p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(248, 113, 113, 0.1)',
              border: '1px solid rgba(248, 113, 113, 0.3)',
              borderRadius: '0.75rem',
              padding: '1rem',
              marginBottom: '1.5rem',
              color: '#fca5a5',
              fontSize: '0.9rem'
            }}
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Email Field */}
          <div>
            <label style={{ fontSize: '0.85rem', color: '#ccc', marginBottom: '0.5rem', display: 'block', fontWeight: '500' }}>
              Admin Email
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem 0.875rem 2.75rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 106, 0, 0.3)',
                  borderRadius: '0.75rem',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 106, 0, 0.6)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 106, 0, 0.3)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              />
              <Lock style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#FF6A00', opacity: 0.6 }} />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label style={{ fontSize: '0.85rem', color: '#ccc', marginBottom: '0.5rem', display: 'block', fontWeight: '500' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '0.875rem 2.75rem 0.875rem 2.75rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 106, 0, 0.3)',
                  borderRadius: '0.75rem',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 106, 0, 0.6)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 106, 0, 0.3)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              />
              <Lock style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#FF6A00', opacity: 0.6 }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#999', display: 'flex', alignItems: 'center' }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '1rem',
              background: loading ? 'rgba(255, 106, 0, 0.5)' : 'linear-gradient(135deg, #FF6A00 0%, #ff8533 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease',
              marginTop: '0.5rem',
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(255, 106, 0, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {loading ? (
              <>
                <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                Signing in...
              </>
            ) : (
              <>
                <LogIn style={{ width: '18px', height: '18px' }} />
                Sign In as Admin
              </>
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 106, 0, 0.1)', textAlign: 'center' }}>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>
            Not an admin? <Link to="/login" style={{ color: '#FF6A00', textDecoration: 'none', fontWeight: '600' }}>User Login</Link>
          </p>
          <p style={{ color: '#666', fontSize: '0.85rem', margin: 0 }}>
            <Link to="/" style={{ color: '#FF6A00', textDecoration: 'none' }}>Back to Home</Link>
          </p>
        </div>

        {/* Security Badge */}
        <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255, 106, 0, 0.05)', borderRadius: '0.75rem', border: '1px solid rgba(255, 106, 0, 0.1)', textAlign: 'center' }}>
          <p style={{ color: '#999', fontSize: '0.8rem', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Shield style={{ width: '14px', height: '14px', color: '#FF6A00' }} />
            Secure admin access only
          </p>
        </div>
      </motion.div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
