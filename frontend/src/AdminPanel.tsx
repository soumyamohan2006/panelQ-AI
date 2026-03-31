import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, Users, Briefcase, TrendingUp, FileText, Bell, Settings,
  Plus, Edit2, Trash2, Eye, LogOut, ChevronDown, Search, Download,
  Mail, Key, Sliders
} from 'lucide-react';
import styles from './AdminPanel.module.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
});

interface User { _id: string; name: string; email: string; status: string; interviewCount: number; createdAt: string; }
interface Interview { _id: string; userId: { name: string; email: string }; score: number; date: string; }
interface Job { _id: string; title: string; company: string; location: string; type: string; skills: string; description: string; applyLink: string; }

export default function AdminPanel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);

  // Dashboard
  const [stats, setStats] = useState({ totalUsers: 0, totalInterviews: 0, totalJobs: 0, avgScore: 0, userGrowth: [], interviewTrend: [] });

  // Users
  const [users, setUsers] = useState<User[]>([]);
  const [searchUser, setSearchUser] = useState('');

  // Interviews
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [filterScore, setFilterScore] = useState('');
  const [filterDate, setFilterDate] = useState('');

  // Jobs
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobForm, setJobForm] = useState({ title: '', company: '', location: '', type: 'Full-time', skills: '', description: '', applyLink: '' });
  const [editingJob, setEditingJob] = useState<string | null>(null);

  // Analytics
  const [analytics, setAnalytics] = useState({ scoreDistribution: [], avgComm: 0, avgTech: 0, avgConf: 0 });

  // Notifications
  const [notifMsg, setNotifMsg] = useState('');

  // Settings
  const [settings, setSettings] = useState({ groqKey: '', speechKey: '', maxInterviews: 10 });

  const chartRef = useRef<HTMLCanvasElement>(null);

  // Fetch Dashboard Stats
  useEffect(() => {
    if (activeTab === 'dashboard') {
      setLoading(true);
      fetch(`${API_BASE}/api/admin/stats`, { headers: authHeaders() })
        .then(r => r.json())
        .then(data => { setStats(data); setLoading(false); drawCharts(data); })
        .catch(() => setLoading(false));
    }
  }, [activeTab]);

  // Fetch Users
  useEffect(() => {
    if (activeTab === 'users') {
      setLoading(true);
      fetch(`${API_BASE}/api/admin/users`, { headers: authHeaders() })
        .then(r => r.json())
        .then(data => { setUsers(Array.isArray(data) ? data : []); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [activeTab]);

  // Fetch Interviews
  useEffect(() => {
    if (activeTab === 'interviews') {
      setLoading(true);
      let url = `${API_BASE}/api/admin/interviews`;
      if (filterScore) url += `?minScore=${filterScore}`;
      if (filterDate) url += `${filterScore ? '&' : '?'}date=${filterDate}`;
      fetch(url, { headers: authHeaders() })
        .then(r => r.json())
        .then(data => { setInterviews(Array.isArray(data) ? data : []); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [activeTab, filterScore, filterDate]);

  // Fetch Jobs
  useEffect(() => {
    if (activeTab === 'jobs') {
      setLoading(true);
      fetch(`${API_BASE}/api/admin/jobs`, { headers: authHeaders() })
        .then(r => r.json())
        .then(data => { setJobs(Array.isArray(data) ? data : []); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [activeTab]);

  // Fetch Analytics
  useEffect(() => {
    if (activeTab === 'analytics') {
      setLoading(true);
      fetch(`${API_BASE}/api/admin/analytics`, { headers: authHeaders() })
        .then(r => r.json())
        .then(data => { setAnalytics(data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [activeTab]);

  const drawCharts = (data: any) => {
    if (!chartRef.current) return;
    const canvas = chartRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // User growth chart
    const pad = 40;
    const chartW = W / 2 - pad;
    const chartH = H - 2 * pad;

    // Draw user growth
    ctx.fillStyle = '#111';
    ctx.fillRect(pad, pad, chartW, chartH);
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1;
    ctx.strokeRect(pad, pad, chartW, chartH);

    ctx.fillStyle = '#ff6a00';
    ctx.font = '12px sans-serif';
    ctx.fillText('User Growth (7 days)', pad + 8, pad - 8);

    const maxUsers = Math.max(...data.userGrowth.map((d: any) => d.count), 1);
    data.userGrowth.forEach((d: any, i: number) => {
      const x = pad + (i / 6) * chartW;
      const barH = (d.count / maxUsers) * (chartH - 20);
      ctx.fillStyle = '#ff6a00';
      ctx.fillRect(x + 4, pad + chartH - 20 - barH, chartW / 7 - 8, barH);
      ctx.fillStyle = '#666';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(d.day, x + chartW / 14, pad + chartH + 8);
    });

    // Draw interview trend
    ctx.fillStyle = '#111';
    ctx.fillRect(pad + chartW + pad, pad, chartW, chartH);
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1;
    ctx.strokeRect(pad + chartW + pad, pad, chartW, chartH);

    ctx.fillStyle = '#ff6a00';
    ctx.font = '12px sans-serif';
    ctx.fillText('Interview Avg Score (7 days)', pad + chartW + pad + 8, pad - 8);

    ctx.beginPath();
    ctx.strokeStyle = '#ff6a00';
    ctx.lineWidth = 2;
    data.interviewTrend.forEach((d: any, i: number) => {
      const x = pad + chartW + pad + (i / 6) * chartW;
      const y = pad + chartH - 20 - (d.avg / 100) * (chartH - 20);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    data.interviewTrend.forEach((d: any, i: number) => {
      const x = pad + chartW + pad + (i / 6) * chartW;
      const y = pad + chartH - 20 - (d.avg / 100) * (chartH - 20);
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#ff6a00';
      ctx.fill();
    });
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    await fetch(`${API_BASE}/api/admin/users/${id}`, { method: 'DELETE', headers: authHeaders() });
    setUsers(users.filter(u => u._id !== id));
  };

  const blockUser = async (id: string) => {
    await fetch(`${API_BASE}/api/admin/users/${id}/block`, { method: 'PATCH', headers: authHeaders() });
    setUsers(users.map(u => u._id === id ? { ...u, status: u.status === 'Active' ? 'Blocked' : 'Active' } : u));
  };

  const saveJob = async () => {
    if (!jobForm.title || !jobForm.company) { alert('Fill required fields'); return; }
    if (editingJob) {
      await fetch(`${API_BASE}/api/admin/jobs/${editingJob}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(jobForm) });
      setJobs(jobs.map(j => j._id === editingJob ? { ...j, ...jobForm } : j));
      setEditingJob(null);
    } else {
      const res = await fetch(`${API_BASE}/api/admin/jobs`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(jobForm) });
      const newJob = await res.json();
      setJobs([newJob, ...jobs]);
    }
    setJobForm({ title: '', company: '', location: '', type: 'Full-time', skills: '', description: '', applyLink: '' });
  };

  const deleteJob = async (id: string) => {
    if (!confirm('Delete this job?')) return;
    await fetch(`${API_BASE}/api/admin/jobs/${id}`, { method: 'DELETE', headers: authHeaders() });
    setJobs(jobs.filter(j => j._id !== id));
  };

  const editJob = (job: Job) => {
    setJobForm(job);
    setEditingJob(job._id);
  };

  const sendNotification = async () => {
    if (!notifMsg.trim()) return;
    alert(`Notification sent: "${notifMsg}"`);
    setNotifMsg('');
  };

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchUser.toLowerCase()) || u.email.toLowerCase().includes(searchUser.toLowerCase()));

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span>⚡ PanelQ Admin</span>
        </div>
        <nav className={styles.nav}>
          {[
            { id: 'dashboard', label: '📊 Dashboard', icon: <BarChart3 size={18} /> },
            { id: 'users', label: '👥 Users', icon: <Users size={18} /> },
            { id: 'interviews', label: '🎤 Interviews', icon: <Eye size={18} /> },
            { id: 'jobs', label: '💼 Jobs', icon: <Briefcase size={18} /> },
            { id: 'analytics', label: '📈 Analytics', icon: <TrendingUp size={18} /> },
            { id: 'reports', label: '📄 Reports', icon: <FileText size={18} /> },
            { id: 'notifications', label: '🔔 Notifications', icon: <Bell size={18} /> },
            { id: 'settings', label: '⚙️ Settings', icon: <Settings size={18} /> },
          ].map(item => (
            <button key={item.id} className={`${styles.navBtn} ${activeTab === item.id ? styles.activeNav : ''}`}
              onClick={() => setActiveTab(item.id)}>
              {item.label}
            </button>
          ))}
        </nav>
        <button className={styles.logoutBtn} onClick={() => navigate('/')}>
          <LogOut size={16} /> Logout
        </button>
      </aside>

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Admin Panel</h1>
          <span className={styles.time}>{new Date().toLocaleString()}</span>
        </div>

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <section className={styles.section}>
            <h2>Dashboard Overview</h2>
            <div className={styles.statsGrid}>
              {[
                { label: 'Total Users', value: stats.totalUsers, icon: '👥' },
                { label: 'Total Interviews', value: stats.totalInterviews, icon: '🎤' },
                { label: 'Total Jobs', value: stats.totalJobs, icon: '💼' },
                { label: 'Avg Score', value: `${stats.avgScore}%`, icon: '⭐' },
              ].map((s, i) => (
                <div key={i} className={styles.statCard}>
                  <span className={styles.statIcon}>{s.icon}</span>
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>
            <div className={styles.chartContainer}>
              <canvas ref={chartRef} width={1000} height={300} className={styles.chart} />
            </div>
          </section>
        )}

        {/* User Management */}
        {activeTab === 'users' && (
          <section className={styles.section}>
            <h2>User Management</h2>
            <div className={styles.searchBar}>
              <Search size={16} />
              <input placeholder="Search users..." value={searchUser} onChange={e => setSearchUser(e.target.value)} />
            </div>
            <div className={styles.table}>
              <div className={styles.tableHeader}>
                <span>Name</span><span>Email</span><span>Status</span><span>Interviews</span><span>Joined</span><span>Actions</span>
              </div>
              {filteredUsers.map(u => (
                <div key={u._id} className={styles.tableRow}>
                  <span>{u.name}</span>
                  <span>{u.email}</span>
                  <span className={`${styles.badge} ${u.status === 'Active' ? styles.badgeGreen : styles.badgeRed}`}>{u.status}</span>
                  <span>{u.interviewCount}</span>
                  <span>{new Date(u.createdAt).toLocaleDateString()}</span>
                  <div className={styles.actions}>
                    <button onClick={() => blockUser(u._id)} className={styles.btnSmall}>{u.status === 'Active' ? 'Block' : 'Unblock'}</button>
                    <button onClick={() => deleteUser(u._id)} className={`${styles.btnSmall} ${styles.btnDanger}`}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Interview Monitoring */}
        {activeTab === 'interviews' && (
          <section className={styles.section}>
            <h2>Interview Monitoring</h2>
            <div className={styles.filterRow}>
              <input type="number" placeholder="Min Score" value={filterScore} onChange={e => setFilterScore(e.target.value)} className={styles.filterInput} />
              <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className={styles.filterInput} />
            </div>
            <div className={styles.table}>
              <div className={styles.tableHeader}>
                <span>User</span><span>Email</span><span>Score</span><span>Date</span>
              </div>
              {interviews.map(i => (
                <div key={i._id} className={styles.tableRow}>
                  <span>{i.userId.name}</span>
                  <span>{i.userId.email}</span>
                  <span className={styles.score}>{i.score}%</span>
                  <span>{new Date(i.date).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Job Management */}
        {activeTab === 'jobs' && (
          <section className={styles.section}>
            <h2>Job Management</h2>
            <div className={styles.formCard}>
              <h3>{editingJob ? 'Edit Job' : 'Add New Job'}</h3>
              <div className={styles.formGrid}>
                <input placeholder="Job Title *" value={jobForm.title} onChange={e => setJobForm({ ...jobForm, title: e.target.value })} />
                <input placeholder="Company *" value={jobForm.company} onChange={e => setJobForm({ ...jobForm, company: e.target.value })} />
                <input placeholder="Location" value={jobForm.location} onChange={e => setJobForm({ ...jobForm, location: e.target.value })} />
                <select value={jobForm.type} onChange={e => setJobForm({ ...jobForm, type: e.target.value })}>
                  <option>Full-time</option><option>Part-time</option><option>Internship</option><option>Contract</option>
                </select>
                <input placeholder="Required Skills" value={jobForm.skills} onChange={e => setJobForm({ ...jobForm, skills: e.target.value })} />
                <input placeholder="Apply Link (URL)" value={jobForm.applyLink} onChange={e => setJobForm({ ...jobForm, applyLink: e.target.value })} />
              </div>
              <textarea placeholder="Description" value={jobForm.description} onChange={e => setJobForm({ ...jobForm, description: e.target.value })} rows={3} />
              <div className={styles.formActions}>
                <button onClick={saveJob} className={styles.btnPrimary}>{editingJob ? 'Update Job' : 'Add Job'}</button>
                {editingJob && <button onClick={() => { setEditingJob(null); setJobForm({ title: '', company: '', location: '', type: 'Full-time', skills: '', description: '', applyLink: '' }); }} className={styles.btnSecondary}>Cancel</button>}
              </div>
            </div>
            <div className={styles.table}>
              <div className={styles.tableHeader}>
                <span>Title</span><span>Company</span><span>Location</span><span>Type</span><span>Actions</span>
              </div>
              {jobs.map(j => (
                <div key={j._id} className={styles.tableRow}>
                  <span>{j.title}</span>
                  <span>{j.company}</span>
                  <span>{j.location}</span>
                  <span className={styles.badge}>{j.type}</span>
                  <div className={styles.actions}>
                    <button onClick={() => editJob(j)} className={styles.btnSmall}><Edit2 size={14} /></button>
                    <button onClick={() => deleteJob(j._id)} className={`${styles.btnSmall} ${styles.btnDanger}`}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Analytics */}
        {activeTab === 'analytics' && (
          <section className={styles.section}>
            <h2>Analytics</h2>
            <div className={styles.analyticsGrid}>
              <div className={styles.analyticsCard}>
                <h3>Score Distribution</h3>
                {analytics.scoreDistribution.map((b: any, i: number) => (
                  <div key={i} className={styles.barItem}>
                    <span>{b.label}</span>
                    <div className={styles.bar}>
                      <div className={styles.barFill} style={{ width: `${(b.count / Math.max(...analytics.scoreDistribution.map((x: any) => x.count), 1)) * 100}%` }} />
                    </div>
                    <span>{b.count}</span>
                  </div>
                ))}
              </div>
              <div className={styles.analyticsCard}>
                <h3>Average Skill Scores</h3>
                <div className={styles.skillItem}>
                  <span>Communication</span>
                  <span className={styles.skillScore}>{analytics.avgComm}%</span>
                </div>
                <div className={styles.skillItem}>
                  <span>Technical</span>
                  <span className={styles.skillScore}>{analytics.avgTech}%</span>
                </div>
                <div className={styles.skillItem}>
                  <span>Confidence</span>
                  <span className={styles.skillScore}>{analytics.avgConf}%</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Reports */}
        {activeTab === 'reports' && (
          <section className={styles.section}>
            <h2>Reports</h2>
            <div className={styles.reportGrid}>
              {[
                { name: 'User Report', type: 'CSV' },
                { name: 'Interview Report', type: 'PDF' },
                { name: 'Job Analytics', type: 'CSV' },
              ].map((r, i) => (
                <div key={i} className={styles.reportCard}>
                  <FileText size={32} />
                  <h3>{r.name}</h3>
                  <button className={styles.btnSmall}><Download size={14} /> {r.type}</button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Notifications */}
        {activeTab === 'notifications' && (
          <section className={styles.section}>
            <h2>Send Notifications</h2>
            <div className={styles.notifCard}>
              <textarea placeholder="Enter announcement message..." value={notifMsg} onChange={e => setNotifMsg(e.target.value)} rows={4} />
              <button onClick={sendNotification} className={styles.btnPrimary}><Mail size={16} /> Send to All Users</button>
            </div>
          </section>
        )}

        {/* Settings */}
        {activeTab === 'settings' && (
          <section className={styles.section}>
            <h2>Settings</h2>
            <div className={styles.settingsGrid}>
              <div className={styles.settingCard}>
                <h3><Key size={16} /> API Keys</h3>
                <label>Groq AI Key</label>
                <input type="password" placeholder="Enter Groq API key" value={settings.groqKey} onChange={e => setSettings({ ...settings, groqKey: e.target.value })} />
                <label>Speech-to-Text Key</label>
                <input type="password" placeholder="Enter Speech API key" value={settings.speechKey} onChange={e => setSettings({ ...settings, speechKey: e.target.value })} />
              </div>
              <div className={styles.settingCard}>
                <h3><Sliders size={16} /> Interview Settings</h3>
                <label>Max Interviews per User</label>
                <input type="number" value={settings.maxInterviews} onChange={e => setSettings({ ...settings, maxInterviews: Number(e.target.value) })} />
              </div>
            </div>
            <button className={styles.btnPrimary}>Save Settings</button>
          </section>
        )}
      </main>
    </div>
  );
}
