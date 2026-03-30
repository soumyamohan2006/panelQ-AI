import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { motion } from 'motion/react';
import { User, Mail, Phone, MapPin, Briefcase, Award, TrendingUp, Settings, Edit, Lock, Bell, ArrowLeft, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, token, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    role: '',
    skills: '',
    avatar: '',
    gender: 'male',
    resume: '',
  });
  const [resumeUploading, setResumeUploading] = useState(false);


  useEffect(() => {
    fetchProfile();

    // Refresh profile data when user returns to the tab
    const handleFocus = () => {
      fetchProfile();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setProfileData(data);
      setForm({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        location: data.location || '',
        role: data.role || '',
        skills: data.skills?.join(', ') || '',
        avatar: data.avatar || '',
        gender: data.gender || 'male',
        resume: data.resume || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF resume');
      return;
    }

    setResumeUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch('http://localhost:5000/api/user/upload-resume', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to upload resume');
      }
      const data = await response.json();
      setForm(prev => ({ ...prev, resume: data.resume }));
      setProfileData(prev => prev ? { ...prev, resume: data.resume } : prev);
      alert('Resume uploaded successfully');
    } catch (error) {
      console.error('Resume upload error:', error);
      alert('Failed to upload resume');
    } finally {
      setResumeUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          location: form.location,
          role: form.role,
          skills: form.skills.split(',').map(s => s.trim()),
          avatar: form.avatar,
          gender: form.gender,
          resume: form.resume,
        }),
      });
      if (response.ok) {
        await fetchProfile();
        setIsEditing(false);
        alert('Profile updated successfully');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', color: 'white' }}>Loading...</div>;
  }

  if (!profileData) {
    return <div style={{ padding: '2rem', color: 'white' }}>No profile available. Please log in.</div>;
  }

  const skills = profileData.skills || [];



  if (isEditing) {
    return (
      <div style={{ background: '#0d0d0d', minHeight: '100vh', color: 'white', fontFamily: 'Segoe UI, sans-serif' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', paddingTop: '6rem' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <button
                onClick={() => setIsEditing(false)}
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
              <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' }}>Edit Profile</h1>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Full Name</label>
                  <input type="text" value={form.name} onChange={e => handleChange('name', e.target.value)} required
                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid #555', borderRadius: '0.5rem', color: 'white' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Email</label>
                  <input type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} required
                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid #555', borderRadius: '0.5rem', color: 'white' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Phone</label>
                  <input type="tel" value={form.phone} onChange={e => handleChange('phone', e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid #555', borderRadius: '0.5rem', color: 'white' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Location</label>
                  <input type="text" value={form.location} onChange={e => handleChange('location', e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid #555', borderRadius: '0.5rem', color: 'white' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Role</label>
                  <input type="text" value={form.role} onChange={e => handleChange('role', e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid #555', borderRadius: '0.5rem', color: 'white' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Skills (comma-separated)</label>
                  <input type="text" value={form.skills} onChange={e => handleChange('skills', e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid #555', borderRadius: '0.5rem', color: 'white' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Gender</label>
                  <select value={form.gender} onChange={e => handleChange('gender', e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid #555', borderRadius: '0.5rem', color: 'white' }}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Resume (PDF)</label>
                  <input type="file" accept="application/pdf"
                    onChange={handleResumeUpload}
                    style={{ width: '100%', padding: '0.75rem 0.5rem', color: 'white', background: 'rgba(255,255,255,0.05)', border: '1px solid #555', borderRadius: '0.5rem' }}
                  />
                  <div style={{ marginTop: '0.5rem', color: '#aaa', fontSize: '0.85rem' }}>
                    {form.resume ? (
                      <a href={form.resume} target="_blank" rel="noreferrer" style={{ color: '#ffb347' }}>
                        View uploaded resume
                      </a>
                    ) : 'No resume uploaded yet (PDF only).'}
                  </div>
                  {resumeUploading && <div style={{ color: '#ffb347', marginTop: '0.5rem' }}>Uploading resume...</div>}
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" style={{
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #ff6a00, #cc3700)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    flex: 1
                  }}>Save Changes</button>
                  <button type="button" onClick={() => setIsEditing(false)} style={{
                    padding: '0.75rem 1.5rem',
                    background: 'transparent',
                    color: '#ff6a00',
                    border: '2px solid #ff6a00',
                    borderRadius: '0.5rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    flex: 1
                  }}>Cancel</button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#0d0d0d', minHeight: '100vh', color: 'white', fontFamily: 'Segoe UI, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', paddingTop: '6rem' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0 }}>{profileData.name}</h1>
              <p style={{ color: '#aaa', margin: 0 }}>{profileData.role || 'No role set'}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Basic Information */}
              <div style={{
                background: 'rgba(20,20,20,0.9)',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                border: '1px solid #333'
              }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User className="w-5 h-5" /> Basic Information
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <User className="w-5 h-5" style={{ color: '#ff6a00' }} />
                    <div>
                      <div style={{ fontWeight: '600' }}>{profileData.name}</div>
                      <div style={{ color: '#aaa', fontSize: '0.9rem' }}>Full Name</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Mail className="w-5 h-5" style={{ color: '#ff6a00' }} />
                    <div>
                      <div style={{ fontWeight: '600' }}>{profileData.email}</div>
                      <div style={{ color: '#aaa', fontSize: '0.9rem' }}>Email</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <User className="w-5 h-5" style={{ color: '#ff6a00' }} />
                    <div>
                      <div style={{ fontWeight: '600' }}>{profileData.gender?.charAt(0)?.toUpperCase() + profileData.gender?.slice(1) || 'Not set'}</div>
                      <div style={{ color: '#aaa', fontSize: '0.9rem' }}>Gender</div>
                    </div>
                  </div>
                  {profileData.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <Phone className="w-5 h-5" style={{ color: '#ff6a00' }} />
                      <div>
                        <div style={{ fontWeight: '600' }}>{profileData.phone}</div>
                        <div style={{ color: '#aaa', fontSize: '0.9rem' }}>Phone</div>
                      </div>
                    </div>
                  )}
                  {profileData.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <MapPin className="w-5 h-5" style={{ color: '#ff6a00' }} />
                      <div>
                        <div style={{ fontWeight: '600' }}>{profileData.location}</div>
                        <div style={{ color: '#aaa', fontSize: '0.9rem' }}>Location</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Professional Details */}
              <div style={{
                background: 'rgba(20,20,20,0.9)',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                border: '1px solid #333'
              }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Briefcase className="w-5 h-5" /> Professional Details
                </h2>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Role</div>
                  <div style={{ color: '#aaa' }}>{profileData.role || 'Not specified'}</div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Resume</div>
                  {profileData.resume ? (
                    <a href={profileData.resume} target="_blank" rel="noreferrer" style={{ color: '#ffb347' }}>
                      View uploaded resume (PDF)
                    </a>
                  ) : (
                    <div style={{ color: '#aaa' }}>No resume uploaded.</div>
                  )}
                </div>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Skills</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {skills.map((skill: string, i: number) => (
                      <span key={i} style={{
                        padding: '0.25rem 0.75rem',
                        background: 'linear-gradient(135deg, #ff6a00, #cc3700)',
                        color: 'white',
                        borderRadius: '1rem',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Interview Progress */}
              <div style={{
                background: 'rgba(20,20,20,0.9)',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                border: '1px solid #333'
              }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingUp className="w-5 h-5" /> Interview Progress
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem' }}>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#ff6a00' }}>{profileData.interviewStats?.totalInterviews || 0}</div>
                    <div style={{ color: '#aaa' }}>Interviews Attended</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem' }}>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#ff6a00' }}>{profileData.interviewStats?.averageScore || 0}%</div>
                    <div style={{ color: '#aaa' }}>Average Score</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#ff6a00' }}>{profileData.interviewStats?.strongAreas?.join(', ') || 'None'}</div>
                    <div style={{ color: '#aaa' }}>Strong Areas</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#ff6a00' }}>{profileData.interviewStats?.weakAreas?.join(', ') || 'None'}</div>
                    <div style={{ color: '#aaa' }}>Areas to Improve</div>
                  </div>
                </div>
              </div>

              {/* Activity Section */}
              <div style={{
                background: 'rgba(20,20,20,0.9)',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                border: '1px solid #333'
              }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>Recent Activity</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem' }}>
                    <div style={{ fontWeight: '700' }}>Recent Interview</div>
                    <div style={{ color: '#aaa', fontSize: '0.9rem' }}>Score: {profileData.interviewStats?.averageScore || 0}% | Keep practicing!</div>
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div style={{
                background: 'rgba(20,20,20,0.9)',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                border: '1px solid #333'
              }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Settings className="w-5 h-5" /> Settings
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <button onClick={fetchProfile} disabled={loading} style={{
                    padding: '0.75rem 1.5rem',
                    background: 'transparent',
                    color: '#666',
                    border: '2px solid #666',
                    borderRadius: '0.5rem',
                    fontWeight: '700',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    opacity: loading ? 0.6 : 1
                  }} onMouseEnter={(e) => !loading && (e.currentTarget.style.borderColor = '#ff6a00', e.currentTarget.style.color = '#ff6a00')} onMouseLeave={(e) => !loading && (e.currentTarget.style.borderColor = '#666', e.currentTarget.style.color = '#666')}>
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} style={{ display: 'inline', marginRight: '0.5rem' }} /> Refresh Stats
                  </button>
                  <button onClick={() => setIsEditing(true)} style={{
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #ff6a00, #cc3700)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'transform 0.2s'
                  }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                    <Edit className="w-4 h-4" style={{ display: 'inline', marginRight: '0.5rem' }} /> Edit Profile
                  </button>
                  <button onClick={() => navigate('/change-password')} style={{
                    padding: '0.75rem 1.5rem',
                    background: 'transparent',
                    color: '#ff6a00',
                    border: '2px solid #ff6a00',
                    borderRadius: '0.5rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,106,0,0.1)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <Lock className="w-4 h-4" style={{ display: 'inline', marginRight: '0.5rem' }} /> Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
