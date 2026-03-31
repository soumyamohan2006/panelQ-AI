import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Shield, BarChart2, TrendingUp, Award,
  Clock, MessageSquare, Mic, Settings, LogOut, Trash2,
  Play, ChevronDown, ChevronUp, Eye
} from 'lucide-react';
import { useAuth } from './context/AuthContext';
import styles from './UserProfile.module.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface InterviewResult {
  _id: string;
  date: string;
  score: number;
  communicationScore: number;
  technicalScore: number;
  confidenceScore: number;
  feedback: string;
  answers: { questionText: string; answerText: string }[];
}

export default function UserProfile() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState<InterviewResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'history' | 'settings'>('history');
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwMsg, setPwMsg] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!user || !token) { navigate('/login'); return; }
    fetch(`${API_BASE}/api/results/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => { setResults(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user, token]);

  useEffect(() => {
    if (!chartRef.current || results.length === 0) return;
    const canvas = chartRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const sorted = [...results].reverse().slice(-10);
    const W = canvas.width, H = canvas.height;
    const pad = { top: 20, right: 20, bottom: 40, left: 40 };
    ctx.clearRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + ((H - pad.top - pad.bottom) / 4) * i;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
      ctx.fillStyle = '#555'; ctx.font = '11px sans-serif'; ctx.textAlign = 'right';
      ctx.fillText(String(100 - i * 25), pad.left - 6, y + 4);
    }

    const xStep = (W - pad.left - pad.right) / Math.max(sorted.length - 1, 1);
    const toY = (v: number) => pad.top + (1 - v / 100) * (H - pad.top - pad.bottom);

    // Line
    ctx.beginPath();
    ctx.strokeStyle = '#ff6a00';
    ctx.lineWidth = 2.5;
    sorted.forEach((r, i) => {
      const x = pad.left + i * xStep;
      i === 0 ? ctx.moveTo(x, toY(r.score)) : ctx.lineTo(x, toY(r.score));
    });
    ctx.stroke();

    // Dots + labels
    sorted.forEach((r, i) => {
      const x = pad.left + i * xStep;
      ctx.beginPath();
      ctx.arc(x, toY(r.score), 5, 0, Math.PI * 2);
      ctx.fillStyle = '#ff6a00'; ctx.fill();
      ctx.fillStyle = '#aaa'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(new Date(r.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }), x, H - 8);
    });
  }, [results]);

  const avg = results.length ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length) : 0;
  const highest = results.length ? Math.max(...results.map(r => r.score)) : 0;
  const latest = results[0]?.score ?? 0;
  const avgComm = results.length ? Math.round(results.reduce((s, r) => s + (r.communicationScore || 0), 0) / results.length) : 0;
  const avgTech = results.length ? Math.round(results.reduce((s, r) => s + (r.technicalScore || 0), 0) / results.length) : 0;
  const avgConf = results.length ? Math.round(results.reduce((s, r) => s + (r.confidenceScore || 0), 0) / results.length) : 0;

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.next !== pwForm.confirm) { setPwMsg('Passwords do not match.'); return; }
    setPwMsg('Password update is not yet connected to the backend.');
  };

  const handleDeleteAccount = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo} onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span className={styles.logoIcon}>⚡</span>
          <span className={styles.logoText}>PanelQ</span>
        </div>
        <nav className={styles.nav}>
          <a href="/dashboard" className={styles.navItem}>Dashboard</a>
          <a href="/profile" className={`${styles.navItem} ${styles.activeNav}`}>Profile</a>
          <a href="/preparation" className={styles.navItem}>Preparation</a>
        </nav>
        <button className={styles.logoutBtn} onClick={() => { logout(); navigate('/'); }}>
          <LogOut size={15} /> Sign Out
        </button>
      </aside>

      <main className={styles.main}>
        {/* Hero */}
        <div className={styles.hero}>
          <div className={styles.avatar}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className={styles.userName}>{user.name}</h1>
            <p className={styles.userEmail}><Mail size={14} /> {user.email}</p>
            <span className={styles.roleBadge}><Shield size={12} /> Student</span>
          </div>
        </div>

        {/* Performance Summary */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}><BarChart2 size={18} /> Performance Summary</h2>
          <div className={styles.statsGrid}>
            {[
              { label: 'Total Interviews', value: results.length, icon: <Clock size={20} /> },
              { label: 'Average Score', value: `${avg}%`, icon: <BarChart2 size={20} /> },
              { label: 'Highest Score', value: `${highest}%`, icon: <Award size={20} /> },
              { label: 'Latest Score', value: `${latest}%`, icon: <TrendingUp size={20} /> },
            ].map(s => (
              <div key={s.label} className={styles.statCard}>
                <div className={styles.statIcon}>{s.icon}</div>
                <div className={styles.statValue}>{loading ? '—' : s.value}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Skill Analysis */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}><User size={18} /> Skill Analysis</h2>
          <div className={styles.skillsGrid}>
            {[
              { label: 'Communication', value: avgComm },
              { label: 'Technical Knowledge', value: avgTech },
              { label: 'Confidence', value: avgConf },
            ].map(s => (
              <div key={s.label} className={styles.skillCard}>
                <div className={styles.skillHeader}>
                  <span>{s.label}</span>
                  <span className={styles.skillScore}>{loading ? '—' : `${s.value}%`}</span>
                </div>
                <div className={styles.skillBar}>
                  <div className={styles.skillFill} style={{ width: loading ? '0%' : `${s.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Progress Chart */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}><TrendingUp size={18} /> Progress Tracking</h2>
          {results.length < 2 ? (
            <p className={styles.empty}>Complete at least 2 interviews to see your progress chart.</p>
          ) : (
            <div className={styles.chartWrap}>
              <canvas ref={chartRef} width={700} height={220} className={styles.chart} />
            </div>
          )}
        </section>

        {/* Tabs: History / Settings */}
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${activeTab === 'history' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('history')}>
            <Clock size={15} /> Interview History
          </button>
          <button className={`${styles.tab} ${activeTab === 'settings' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('settings')}>
            <Settings size={15} /> Account Settings
          </button>
        </div>

        {/* Interview History */}
        {activeTab === 'history' && (
          <section className={styles.section}>
            {loading && <p className={styles.empty}>Loading…</p>}
            {!loading && results.length === 0 && (
              <p className={styles.empty}>No interviews yet. <a href="/dashboard">Start one!</a></p>
            )}
            {results.map(r => (
              <div key={r._id} className={styles.historyCard}>
                <div className={styles.historyRow}>
                  <div className={styles.historyMeta}>
                    <span className={styles.historyDate}>{new Date(r.date).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    <span className={styles.categoryBadge}>Mock Interview</span>
                  </div>
                  <div className={styles.historyRight}>
                    <span className={styles.scoreChip}>{r.score}%</span>
                    <button className={styles.viewBtn}
                      onClick={() => setExpandedId(expandedId === r._id ? null : r._id)}>
                      <Eye size={14} /> {expandedId === r._id ? 'Hide' : 'View Details'}
                      {expandedId === r._id ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                  </div>
                </div>

                {expandedId === r._id && (
                  <div className={styles.details}>
                    {/* Mini skill scores */}
                    <div className={styles.miniScores}>
                      {[['Communication', r.communicationScore], ['Technical', r.technicalScore], ['Confidence', r.confidenceScore]].map(([k, v]) => (
                        <span key={k} className={styles.miniScore}>{k}: <b>{v ?? '—'}%</b></span>
                      ))}
                    </div>

                    {/* AI Feedback */}
                    {r.feedback && (
                      <div className={styles.feedbackBox}>
                        <MessageSquare size={14} /> <span>{r.feedback}</span>
                      </div>
                    )}

                    {/* Answer Review */}
                    <h4 className={styles.subTitle}>Answer Review</h4>
                    {r.answers.map((a, i) => (
                      <div key={i} className={styles.qaBlock}>
                        <p className={styles.question}>Q{i + 1}: {a.questionText}</p>
                        <p className={styles.answer}>{a.answerText}</p>
                      </div>
                    ))}

                    {/* Voice Record placeholder */}
                    <div className={styles.voiceSection}>
                      <Mic size={15} />
                      <span>Voice recording not available for this session.</span>
                      <button className={styles.playBtn} disabled><Play size={13} /> Play</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Account Settings */}
        {activeTab === 'settings' && (
          <section className={styles.section}>
            <div className={styles.settingsGrid}>
              {/* Update Profile */}
              <div className={styles.settingsCard}>
                <h3 className={styles.settingsTitle}><User size={16} /> Update Profile</h3>
                <form className={styles.form} onSubmit={e => e.preventDefault()}>
                  <label>Name</label>
                  <input defaultValue={user.name} className={styles.input} />
                  <label>Email</label>
                  <input defaultValue={user.email} className={styles.input} type="email" />
                  <button className={styles.saveBtn} type="submit">Save Changes</button>
                </form>
              </div>

              {/* Change Password */}
              <div className={styles.settingsCard}>
                <h3 className={styles.settingsTitle}><Shield size={16} /> Change Password</h3>
                <form className={styles.form} onSubmit={handlePasswordChange}>
                  <label>Current Password</label>
                  <input type="password" className={styles.input} value={pwForm.current}
                    onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))} />
                  <label>New Password</label>
                  <input type="password" className={styles.input} value={pwForm.next}
                    onChange={e => setPwForm(p => ({ ...p, next: e.target.value }))} />
                  <label>Confirm Password</label>
                  <input type="password" className={styles.input} value={pwForm.confirm}
                    onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} />
                  {pwMsg && <p className={styles.msg}>{pwMsg}</p>}
                  <button className={styles.saveBtn} type="submit">Update Password</button>
                </form>
              </div>
            </div>

            {/* Danger Zone */}
            <div className={styles.dangerZone}>
              <h3 className={styles.dangerTitle}><Trash2 size={16} /> Danger Zone</h3>
              <p className={styles.dangerText}>Deleting your account is permanent and cannot be undone.</p>
              {!deleteConfirm ? (
                <button className={styles.deleteBtn} onClick={() => setDeleteConfirm(true)}>Delete Account</button>
              ) : (
                <div className={styles.confirmRow}>
                  <span>Are you sure?</span>
                  <button className={styles.deleteBtn} onClick={handleDeleteAccount}>Yes, Delete</button>
                  <button className={styles.cancelBtn} onClick={() => setDeleteConfirm(false)}>Cancel</button>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
