import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { motion } from 'motion/react';
import { Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ChangePassword() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [show, setShow] = useState({ oldPassword: false, newPassword: false, confirmPassword: false });
  const toggleShow = (key: keyof typeof show) => setShow(prev => ({ ...prev, [key]: !prev[key] }));

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (form.newPassword !== form.confirmPassword) {
      setMessage('New password and confirm password do not match');
      return;
    }

    if (form.newPassword.length < 6) {
      setMessage('New password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: form.oldPassword,
          newPassword: form.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password changed successfully!');
        setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => navigate('/profile'), 2000);
      } else {
        setMessage(data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage('Error changing password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#0d0d0d', minHeight: '100vh', color: 'white', fontFamily: 'Segoe UI, sans-serif' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '2rem' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <button
              onClick={() => navigate('/profile')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ff6a00',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <ArrowLeft className="w-5 h-5" /> Back to Profile
            </button>
          </div>

          <div style={{
            background: 'rgba(20,20,20,0.9)',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            border: '1px solid #333'
          }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem', textAlign: 'center' }}>Change Password</h1>
            <p style={{ color: '#aaa', marginBottom: '1.5rem', textAlign: 'center' }}>Enter your current password and choose a new one</p>

            {message && (
              <div style={{
                padding: '1rem',
                marginBottom: '1rem',
                borderRadius: '0.5rem',
                background: message.includes('successfully') ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                color: message.includes('successfully') ? '#22c55e' : '#ef4444',
                border: `1px solid ${message.includes('successfully') ? '#22c55e' : '#ef4444'}`
              }}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ position: 'relative' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Current Password</label>
                <input
                  type={show.oldPassword ? 'text' : 'password'}
                  value={form.oldPassword}
                  onChange={e => handleChange('oldPassword', e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.75rem 2.5rem 0.75rem 0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid #555', borderRadius: '0.5rem', color: 'white', boxSizing: 'border-box' }}
                />
                <button type="button" onClick={() => toggleShow('oldPassword')} style={{ position: 'absolute', bottom: '0.75rem', right: '0.75rem', background: 'transparent', border: 'none', color: '#ccc', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                  {show.oldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>New Password</label>
                <input
                  type={show.newPassword ? 'text' : 'password'}
                  value={form.newPassword}
                  onChange={e => handleChange('newPassword', e.target.value)}
                  required
                  minLength={6}
                  style={{ width: '100%', padding: '0.75rem 2.5rem 0.75rem 0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid #555', borderRadius: '0.5rem', color: 'white', boxSizing: 'border-box' }}
                />
                <button type="button" onClick={() => toggleShow('newPassword')} style={{ position: 'absolute', bottom: '0.75rem', right: '0.75rem', background: 'transparent', border: 'none', color: '#ccc', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                  {show.newPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Confirm New Password</label>
                <input
                  type={show.confirmPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={e => handleChange('confirmPassword', e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.75rem 2.5rem 0.75rem 0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid #555', borderRadius: '0.5rem', color: 'white', boxSizing: 'border-box' }}
                />
                <button type="button" onClick={() => toggleShow('confirmPassword')} style={{ position: 'absolute', bottom: '0.75rem', right: '0.75rem', background: 'transparent', border: 'none', color: '#ccc', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                  {show.confirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #ff6a00, #cc3700)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '700',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'transform 0.2s',
                  opacity: loading ? 0.7 : 1
                }}
                onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => !loading && (e.currentTarget.style.transform = 'scale(1)')}
              >
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}