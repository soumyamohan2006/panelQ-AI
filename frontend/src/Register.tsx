import { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth } from './context/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      login(data.token, { id: data._id, name: data.name, email: data.email, isAdmin: data.isAdmin });
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem', maxWidth: '480px' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '3rem', borderRadius: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Create account</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Join PanelQ and start practicing</p>
        {error && <p style={{ color: '#f87171', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required
              style={{ width: '100%', padding: '0.875rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '0.75rem', color: 'white', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              style={{ width: '100%', padding: '0.875rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '0.75rem', color: 'white', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              style={{ width: '100%', padding: '0.875rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '0.75rem', color: 'white', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '1rem', fontSize: '1rem', marginTop: '0.5rem' }}>
            {loading ? 'Creating account...' : <><UserPlus className="w-4 h-4" /> Register</>}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent)' }}>Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
