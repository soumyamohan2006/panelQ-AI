import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, MapPin, Building2, FileText, Download, Upload,
  Sparkles, Briefcase, PlusCircle, Trash2, CheckCircle,
  Clock, XCircle, ChevronDown
} from 'lucide-react';
import styles from './JobHunter.module.css';

const API_BASE = import.meta.env.VITE_API_URL || 'https://panelq-ai-2.onrender.com';

// ── Types ──
interface Job { id: number; title: string; company: string; location: string; type: string; match?: number; }
interface AdminJob { _id: string; title: string; company: string; location: string; type: string; skills: string; description: string; applyLink: string; }
interface TrackerEntry { id: number; company: string; role: string; status: 'Applied' | 'Interview Scheduled' | 'Selected' | 'Rejected'; date: string; }

// ── Mock job data ──
const ALL_JOBS: Job[] = [
  { id: 1,  title: 'Frontend Developer',     company: 'Google',     location: 'Remote',        type: 'Full-time', match: 92 },
  { id: 2,  title: 'Backend Engineer',       company: 'Amazon',     location: 'Seattle, US',   type: 'Full-time', match: 88 },
  { id: 3,  title: 'Full Stack Developer',   company: 'Microsoft',  location: 'Bangalore, IN', type: 'Full-time', match: 85 },
  { id: 4,  title: 'React Developer',        company: 'Meta',       location: 'Remote',        type: 'Contract',  match: 90 },
  { id: 5,  title: 'Node.js Engineer',       company: 'Netflix',    location: 'Los Angeles',   type: 'Full-time', match: 80 },
  { id: 6,  title: 'DevOps Engineer',        company: 'Oracle',     location: 'Hyderabad, IN', type: 'Full-time', match: 74 },
  { id: 7,  title: 'ML Engineer',            company: 'OpenAI',     location: 'Remote',        type: 'Full-time', match: 70 },
  { id: 8,  title: 'iOS Developer',          company: 'Apple',      location: 'Cupertino, US', type: 'Full-time', match: 65 },
  { id: 9,  title: 'Data Engineer',          company: 'Spotify',    location: 'Remote',        type: 'Part-time', match: 78 },
  { id: 10, title: 'Cloud Architect',        company: 'AWS',        location: 'Remote',        type: 'Full-time', match: 82 },
];

const STATUS_ICONS = {
  'Applied':             <Clock size={14} />,
  'Interview Scheduled': <CheckCircle size={14} />,
  'Selected':            <CheckCircle size={14} />,
  'Rejected':            <XCircle size={14} />,
};

const STATUS_COLORS: Record<string, string> = {
  'Applied':             '#ff6a00',
  'Interview Scheduled': '#3b82f6',
  'Selected':            '#22c55e',
  'Rejected':            '#ef4444',
};

export default function JobHunter() {
  const navigate = useNavigate();

  // ── Job Search ──
  const [role, setRole]         = useState('');
  const [location, setLocation] = useState('');
  const [company, setCompany]   = useState('');
  const [searched, setSearched] = useState(false);

  const filteredJobs = ALL_JOBS.filter(j =>
    (!role     || j.title.toLowerCase().includes(role.toLowerCase())) &&
    (!location || j.location.toLowerCase().includes(location.toLowerCase())) &&
    (!company  || j.company.toLowerCase().includes(company.toLowerCase()))
  );

  // ── Resume Builder ──
  const builderFileRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState('');

  const handleImportResume = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true); setImportMsg('');
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const text = ev.target?.result as string;
      try {
        const res = await fetch(`${API_BASE}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemPrompt: `You are a resume parser. Extract information from the resume text and respond ONLY with valid JSON in this exact format:
{"name":"","email":"","phone":"","location":"","linkedin":"","summary":"","skills":"","certifications":"","education":[{"degree":"","school":"","year":"","gpa":""}],"experience":[{"role":"","company":"","duration":"","points":""}],"projects":[{"name":"","tech":"","desc":""}]}`,
            messages: [{ role: 'user', content: `Parse this resume:\n\n${text.slice(0, 4000)}` }],
          }),
        });
        const data = await res.json();
        const parsed = JSON.parse(data.reply.replace(/```json|```/g, '').trim());
        setResume({
          name: parsed.name || '',
          email: parsed.email || '',
          phone: parsed.phone || '',
          location: parsed.location || '',
          linkedin: parsed.linkedin || '',
          summary: parsed.summary || '',
          skills: parsed.skills || '',
          certifications: parsed.certifications || '',
          education: parsed.education?.length ? parsed.education : [{ degree: '', school: '', year: '', gpa: '' }],
          experience: parsed.experience?.length ? parsed.experience : [{ role: '', company: '', duration: '', points: '' }],
          projects: parsed.projects?.length ? parsed.projects : [{ name: '', tech: '', desc: '' }],
        });
        setImportMsg('✅ Resume imported! Review and edit the fields below.');
      } catch {
        setImportMsg('❌ Could not parse resume. Please fill in manually.');
      }
      setImporting(false);
    };
    reader.readAsText(file);
  };

  const [resume, setResume] = useState({
    name: '', email: '', phone: '', location: '', linkedin: '', summary: '',
    education: [{ degree: '', school: '', year: '', gpa: '' }],
    experience: [{ role: '', company: '', duration: '', points: '' }],
    skills: '',
    projects: [{ name: '', tech: '', desc: '' }],
    certifications: '',
  });

  const addEducation   = () => setResume(r => ({ ...r, education:   [...r.education,   { degree: '', school: '', year: '', gpa: '' }] }));
  const addExperience  = () => setResume(r => ({ ...r, experience:  [...r.experience,  { role: '', company: '', duration: '', points: '' }] }));
  const addProject     = () => setResume(r => ({ ...r, projects:    [...r.projects,    { name: '', tech: '', desc: '' }] }));

  const removeEducation  = (i: number) => setResume(r => ({ ...r, education:  r.education.filter((_,x)  => x !== i) }));
  const removeExperience = (i: number) => setResume(r => ({ ...r, experience: r.experience.filter((_,x) => x !== i) }));
  const removeProject    = (i: number) => setResume(r => ({ ...r, projects:   r.projects.filter((_,x)   => x !== i) }));

  const downloadResume = () => {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: Arial, sans-serif; color: #222; background: #fff; font-size: 13px; line-height: 1.5; }
  
  /* Header */
  .header { background: #e8f4fd; padding: 28px 40px 20px; text-align: center; }
  .header h1 { font-size: 32px; font-weight: 700; color: #1a6fa8; letter-spacing: 0.5px; }
  .header .title { font-size: 15px; color: #444; margin: 4px 0 12px; }
  .contact { display: flex; justify-content: center; gap: 18px; flex-wrap: wrap; font-size: 12px; color: #333; }
  .contact span { display: flex; align-items: center; gap: 4px; }

  /* Body */
  .body { display: flex; min-height: calc(100vh - 120px); }

  /* Left sidebar */
  .sidebar { width: 260px; min-width: 260px; padding: 24px 20px; border-right: 1px solid #e0e0e0; }
  .sidebar-section { margin-bottom: 24px; }
  .sidebar-title { font-size: 15px; font-weight: 700; color: #1a6fa8; border-bottom: 2px solid #1a6fa8; padding-bottom: 4px; margin-bottom: 12px; }
  .skill-item { display: flex; justify-content: space-between; align-items: flex-start; padding: 6px 0; border-bottom: 1px solid #e8e8e8; font-size: 12.5px; }
  .skill-level { color: #555; font-size: 12px; white-space: nowrap; margin-left: 8px; }

  /* Right content */
  .content { flex: 1; padding: 24px 32px; }
  .section { margin-bottom: 22px; }
  .section-title { font-size: 15px; font-weight: 700; color: #1a6fa8; border-bottom: 2px solid #1a6fa8; padding-bottom: 4px; margin-bottom: 12px; }
  .summary-text { font-size: 12.5px; color: #333; line-height: 1.6; }

  /* Education */
  .edu-entry { margin-bottom: 12px; }
  .edu-degree { font-size: 14px; font-weight: 700; color: #111; }
  .edu-school { font-size: 12.5px; color: #444; display: flex; align-items: center; gap: 6px; margin: 2px 0 6px; }
  .edu-points { padding-left: 16px; }
  .edu-points li { font-size: 12px; color: #333; margin-bottom: 3px; }

  /* Experience */
  .exp-entry { margin-bottom: 14px; }
  .exp-header { display: flex; justify-content: space-between; align-items: baseline; }
  .exp-role { font-size: 13px; font-weight: 700; color: #111; }
  .exp-duration { font-size: 11.5px; color: #777; }
  .exp-company { font-size: 12px; color: #555; margin: 2px 0 5px; }
  .exp-points { padding-left: 16px; }
  .exp-points li { font-size: 12px; color: #333; margin-bottom: 3px; }

  /* Projects */
  .proj-entry { margin-bottom: 14px; }
  .proj-name { font-size: 13px; font-weight: 700; color: #111; }
  .proj-link { font-size: 11.5px; color: #1a6fa8; text-decoration: underline; display: block; margin: 2px 0; }
  .proj-tech { font-size: 11.5px; color: #666; margin-bottom: 4px; }
  .proj-desc { font-size: 12px; color: #333; line-height: 1.5; }

  /* Certifications */
  .cert-text { font-size: 12.5px; color: #333; }

  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style></head><body>

<!-- Header -->
<div class="header">
  <h1>${resume.name || 'Your Name'}</h1>
  ${resume.summary ? `<div class="title">${resume.summary.split('.')[0]}</div>` : ''}
  <div class="contact">
    ${resume.phone    ? `<span>📞 ${resume.phone}</span>` : ''}
    ${resume.email    ? `<span>✉ ${resume.email}</span>` : ''}
    ${resume.location ? `<span>📍 ${resume.location}</span>` : ''}
    ${resume.linkedin ? `<span>🔗 ${resume.linkedin}</span>` : ''}
  </div>
</div>

<!-- Body -->
<div class="body">

  <!-- Left Sidebar: Skills -->
  <div class="sidebar">
    ${resume.skills ? `
    <div class="sidebar-section">
      <div class="sidebar-title">Skills</div>
      ${resume.skills.split(',').map(s => `
        <div class="skill-item">
          <span>${s.trim()}</span>
          <span class="skill-level">Skillful</span>
        </div>
      `).join('')}
    </div>` : ''}

    ${resume.certifications ? `
    <div class="sidebar-section">
      <div class="sidebar-title">Certifications</div>
      <p class="cert-text">${resume.certifications}</p>
    </div>` : ''}
  </div>

  <!-- Right Content -->
  <div class="content">

    ${resume.summary ? `
    <div class="section">
      <div class="section-title">Summary</div>
      <p class="summary-text">${resume.summary}</p>
    </div>` : ''}

    ${resume.education.some(e => e.degree) ? `
    <div class="section">
      <div class="section-title">Education</div>
      ${resume.education.filter(e => e.degree).map(e => `
        <div class="edu-entry">
          <div class="edu-degree">${e.degree}</div>
          <div class="edu-school">${e.school}${e.gpa ? ` &nbsp;|&nbsp; GPA: ${e.gpa}` : ''}${e.year ? ` &nbsp;|&nbsp; ${e.year}` : ''}</div>
        </div>
      `).join('')}
    </div>` : ''}

    ${resume.experience.some(e => e.role) ? `
    <div class="section">
      <div class="section-title">Experience</div>
      ${resume.experience.filter(e => e.role).map(e => `
        <div class="exp-entry">
          <div class="exp-header">
            <span class="exp-role">${e.role}</span>
            <span class="exp-duration">${e.duration}</span>
          </div>
          <div class="exp-company">${e.company}</div>
          ${e.points ? `<ul class="exp-points">${e.points.split('\n').filter(Boolean).map(p => `<li>${p.replace(/^[-•]\s*/,'')}</li>`).join('')}</ul>` : ''}
        </div>
      `).join('')}
    </div>` : ''}

    ${resume.projects.some(p => p.name) ? `
    <div class="section">
      <div class="section-title">Projects</div>
      ${resume.projects.filter(p => p.name).map(p => `
        <div class="proj-entry">
          <div class="proj-name">${p.name}</div>
          ${p.tech ? `<div class="proj-tech">${p.tech}</div>` : ''}
          ${p.desc ? `<p class="proj-desc">${p.desc}</p>` : ''}
        </div>
      `).join('')}
    </div>` : ''}

  </div>
</div>
</body></html>`;
    const w = window.open('', '_blank')!;
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); }, 400);
  };

  // ── Resume Analyzer ──
  const fileRef = useRef<HTMLInputElement>(null);
  const [resumeText, setResumeText]     = useState('');
  const [analyzing, setAnalyzing]       = useState(false);
  const [analysis, setAnalysis]         = useState<{ score: number; suggestions: string[]; missing: string[] } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setResumeText(ev.target?.result as string);
    reader.readAsText(file);
  };

  const analyzeResume = async () => {
    if (!resumeText.trim()) return;
    setAnalyzing(true); setAnalysis(null);
    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: `You are an expert resume reviewer. Analyze the resume and respond ONLY with valid JSON in this exact format:
{"score": <number 0-100>, "suggestions": ["tip1","tip2","tip3"], "missing": ["skill1","skill2","skill3"]}`,
          messages: [{ role: 'user', content: `Analyze this resume:\n\n${resumeText.slice(0, 3000)}` }],
        }),
      });
      const data = await res.json();
      const parsed = JSON.parse(data.reply.replace(/```json|```/g, '').trim());
      setAnalysis(parsed);
    } catch {
      setAnalysis({ score: 0, suggestions: ['Could not analyze. Try pasting plain text.'], missing: [] });
    }
    setAnalyzing(false);
  };

  // ── Tracker ──
  const [tracker, setTracker] = useState<TrackerEntry[]>([
    { id: 1, company: 'Google',    role: 'Frontend Developer', status: 'Interview Scheduled', date: '2024-12-01' },
    { id: 2, company: 'Amazon',    role: 'Backend Engineer',   status: 'Applied',             date: '2024-12-03' },
    { id: 3, company: 'Microsoft', role: 'Full Stack Dev',     status: 'Selected',            date: '2024-11-28' },
  ]);
  const [newEntry, setNewEntry] = useState({ company: '', role: '', status: 'Applied' as TrackerEntry['status'], date: '' });

  const addEntry = () => {
    if (!newEntry.company || !newEntry.role) return;
    setTracker(t => [...t, { ...newEntry, id: Date.now() }]);
    setNewEntry({ company: '', role: '', status: 'Applied', date: '' });
  };

  const [activeSection, setActiveSection] = useState<string>('search');

  const [adminJobs, setAdminJobs] = useState<AdminJob[]>([]);
  useEffect(() => {
    fetch(`${API_BASE}/api/jobs`)
      .then(r => r.json())
      .then(data => setAdminJobs(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const sections = [
    { id: 'search',    label: '🔍 Job Search' },
    { id: 'builder',   label: '📄 Resume Builder' },
    { id: 'analyzer',  label: '📊 Resume Analyzer' },
    { id: 'recommend', label: '🎯 Recommendations' },
    { id: 'tracker',   label: '📝 App Tracker' },
  ];

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
          <a href="/preparation" className={styles.navItem}>Preparation</a>
          <a href="/job-hunter" className={`${styles.navItem} ${styles.activeNav}`}>Job Hunter</a>
        </nav>
        <div className={styles.sectionNav}>
          {sections.map(s => (
            <button key={s.id}
              className={`${styles.sectionBtn} ${activeSection === s.id ? styles.activeSectionBtn : ''}`}
              onClick={() => setActiveSection(s.id)}>
              {s.label}
            </button>
          ))}
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.topBar}>
          <h1 className={styles.pageTitle}>Job Hunter</h1>
          <p className={styles.pageSubtitle}>Search jobs, build your resume, and track applications</p>
        </div>

        {/* ── 1. Job Search ── */}
        {activeSection === 'search' && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}><Search size={18} /> Job Search</h2>
            <div className={styles.filterRow}>
              <div className={styles.filterInput}>
                <Search size={15} className={styles.filterIcon} />
                <input placeholder="Role (e.g. Frontend)" value={role}
                  onChange={e => setRole(e.target.value)} className={styles.input} />
              </div>
              <div className={styles.filterInput}>
                <MapPin size={15} className={styles.filterIcon} />
                <input placeholder="Location" value={location}
                  onChange={e => setLocation(e.target.value)} className={styles.input} />
              </div>
              <div className={styles.filterInput}>
                <Building2 size={15} className={styles.filterIcon} />
                <input placeholder="Company" value={company}
                  onChange={e => setCompany(e.target.value)} className={styles.input} />
              </div>
              <button className={styles.searchBtn} onClick={() => setSearched(true)}>Search</button>
            </div>

            {(searched || role || location || company) && (
              <div className={styles.jobGrid}>
                {filteredJobs.length === 0 ? (
                  <p className={styles.empty}>No jobs found. Try different filters.</p>
                ) : filteredJobs.map(job => (
                  <div key={job.id} className={styles.jobCard}>
                    <div className={styles.jobTop}>
                      <div>
                        <h3 className={styles.jobTitle}>{job.title}</h3>
                        <p className={styles.jobMeta}><Building2 size={13} /> {job.company}</p>
                        <p className={styles.jobMeta}><MapPin size={13} /> {job.location}</p>
                      </div>
                      {job.match && (
                        <div className={styles.matchBadge} style={{ background: job.match >= 85 ? 'rgba(34,197,94,0.15)' : 'rgba(255,106,0,0.15)', color: job.match >= 85 ? '#22c55e' : '#ff6a00' }}>
                          {job.match}% match
                        </div>
                      )}
                    </div>
                    <span className={styles.typeBadge}>{job.type}</span>
                    <button className={styles.applyBtn} onClick={() => {
                      setTracker(t => [...t, { id: Date.now(), company: job.company, role: job.title, status: 'Applied', date: new Date().toISOString().split('T')[0] }]);
                      alert(`Applied to ${job.title} at ${job.company}! Added to tracker.`);
                    }}>Apply & Track</button>
                  </div>
                ))}
              </div>
            )}

            {!searched && !role && !location && !company && (
              <div className={styles.emptyState}>
                <Search size={48} className={styles.emptyIcon} />
                <p>Enter a role, location, or company to search jobs</p>
              </div>
            )}
          </section>
        )}

        {/* ── 2. Resume Builder ── */}
        {activeSection === 'builder' && (
          <section className={styles.section} style={{ maxWidth: '100%' }}>
            <h2 className={styles.sectionTitle}><FileText size={18} /> Resume Builder</h2>
            <p className={styles.sectionSub}>Fill in your details — live preview updates on the right</p>

            {/* Upload existing resume */}
            <div style={{ marginBottom: '1.5rem', padding: '1.25rem', background: 'rgba(255,106,0,0.06)', border: '1px dashed rgba(255,106,0,0.4)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Upload size={20} style={{ color: '#FF6A00', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ color: '#fff', fontWeight: 600, margin: 0, fontSize: '0.95rem' }}>Import Existing Resume</p>
                <p style={{ color: '#aaa', margin: 0, fontSize: '0.82rem' }}>Upload your resume (.txt) and AI will auto-fill all fields</p>
              </div>
              <input ref={builderFileRef} type="file" accept=".txt" style={{ display: 'none' }} onChange={handleImportResume} />
              <button
                onClick={() => builderFileRef.current?.click()}
                disabled={importing}
                style={{ padding: '0.6rem 1.25rem', background: 'linear-gradient(135deg,#FF6A00,#cc3700)', color: 'white', border: 'none', borderRadius: '0.6rem', fontWeight: 600, cursor: importing ? 'not-allowed' : 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Upload size={14} /> {importing ? 'Importing...' : 'Upload & Auto-fill'}
              </button>
              {importMsg && <p style={{ width: '100%', margin: 0, fontSize: '0.85rem', color: importMsg.includes('✅') ? '#22c55e' : '#f87171' }}>{importMsg}</p>}
            </div>

            <div className={styles.resumeLayout}>
              {/* ── LEFT: Form ── */}
              <div className={styles.resumeForm}>

                {/* Personal Info */}
                <div className={styles.formSection}>
                  <h3 className={styles.formSectionTitle}>Personal Info</h3>
                  <div className={styles.formRow}>
                    <input className={styles.field} placeholder="Full Name *" value={resume.name}
                      onChange={e => setResume(r => ({ ...r, name: e.target.value }))} />
                    <input className={styles.field} placeholder="Email *" value={resume.email}
                      onChange={e => setResume(r => ({ ...r, email: e.target.value }))} />
                  </div>
                  <div className={styles.formRow}>
                    <input className={styles.field} placeholder="Phone" value={resume.phone}
                      onChange={e => setResume(r => ({ ...r, phone: e.target.value }))} />
                    <input className={styles.field} placeholder="Location (City, Country)" value={resume.location}
                      onChange={e => setResume(r => ({ ...r, location: e.target.value }))} />
                  </div>
                  <input className={styles.field} placeholder="LinkedIn / Portfolio URL" value={resume.linkedin}
                    onChange={e => setResume(r => ({ ...r, linkedin: e.target.value }))} />
                  <textarea className={styles.textarea} rows={3} placeholder="Professional Summary (2-3 lines about yourself)"
                    value={resume.summary} onChange={e => setResume(r => ({ ...r, summary: e.target.value }))} />
                </div>

                {/* Experience */}
                <div className={styles.formSection}>
                  <div className={styles.formSectionHeader}>
                    <h3 className={styles.formSectionTitle}>Work Experience</h3>
                    <button className={styles.addBtn} onClick={addExperience}><PlusCircle size={14} /> Add</button>
                  </div>
                  {resume.experience.map((ex, i) => (
                    <div key={i} className={styles.entryGroup}>
                      <div className={styles.entryGroupHeader}>
                        <span className={styles.entryNum}>#{i + 1}</span>
                        <button className={styles.removeBtn} onClick={() => removeExperience(i)}><Trash2 size={13} /></button>
                      </div>
                      <div className={styles.formRow}>
                        <input className={styles.field} placeholder="Job Title" value={ex.role}
                          onChange={e => setResume(r => { const a = [...r.experience]; a[i].role = e.target.value; return { ...r, experience: a }; })} />
                        <input className={styles.field} placeholder="Company" value={ex.company}
                          onChange={e => setResume(r => { const a = [...r.experience]; a[i].company = e.target.value; return { ...r, experience: a }; })} />
                      </div>
                      <input className={styles.field} placeholder="Duration (e.g. Jan 2023 – Present)" value={ex.duration}
                        onChange={e => setResume(r => { const a = [...r.experience]; a[i].duration = e.target.value; return { ...r, experience: a }; })} />
                      <textarea className={styles.textarea} rows={3}
                        placeholder="Key responsibilities (one per line, start with - or •)"
                        value={ex.points}
                        onChange={e => setResume(r => { const a = [...r.experience]; a[i].points = e.target.value; return { ...r, experience: a }; })} />
                    </div>
                  ))}
                </div>

                {/* Education */}
                <div className={styles.formSection}>
                  <div className={styles.formSectionHeader}>
                    <h3 className={styles.formSectionTitle}>Education</h3>
                    <button className={styles.addBtn} onClick={addEducation}><PlusCircle size={14} /> Add</button>
                  </div>
                  {resume.education.map((ed, i) => (
                    <div key={i} className={styles.entryGroup}>
                      <div className={styles.entryGroupHeader}>
                        <span className={styles.entryNum}>#{i + 1}</span>
                        <button className={styles.removeBtn} onClick={() => removeEducation(i)}><Trash2 size={13} /></button>
                      </div>
                      <div className={styles.formRow}>
                        <input className={styles.field} placeholder="Degree / Course" value={ed.degree}
                          onChange={e => setResume(r => { const a = [...r.education]; a[i].degree = e.target.value; return { ...r, education: a }; })} />
                        <input className={styles.field} placeholder="School / University" value={ed.school}
                          onChange={e => setResume(r => { const a = [...r.education]; a[i].school = e.target.value; return { ...r, education: a }; })} />
                      </div>
                      <div className={styles.formRow}>
                        <input className={styles.field} placeholder="Year (e.g. 2020 – 2024)" value={ed.year}
                          onChange={e => setResume(r => { const a = [...r.education]; a[i].year = e.target.value; return { ...r, education: a }; })} />
                        <input className={styles.field} placeholder="GPA (optional)" value={ed.gpa}
                          onChange={e => setResume(r => { const a = [...r.education]; a[i].gpa = e.target.value; return { ...r, education: a }; })} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Projects */}
                <div className={styles.formSection}>
                  <div className={styles.formSectionHeader}>
                    <h3 className={styles.formSectionTitle}>Projects</h3>
                    <button className={styles.addBtn} onClick={addProject}><PlusCircle size={14} /> Add</button>
                  </div>
                  {resume.projects.map((p, i) => (
                    <div key={i} className={styles.entryGroup}>
                      <div className={styles.entryGroupHeader}>
                        <span className={styles.entryNum}>#{i + 1}</span>
                        <button className={styles.removeBtn} onClick={() => removeProject(i)}><Trash2 size={13} /></button>
                      </div>
                      <div className={styles.formRow}>
                        <input className={styles.field} placeholder="Project Name" value={p.name}
                          onChange={e => setResume(r => { const a = [...r.projects]; a[i].name = e.target.value; return { ...r, projects: a }; })} />
                        <input className={styles.field} placeholder="Tech Stack" value={p.tech}
                          onChange={e => setResume(r => { const a = [...r.projects]; a[i].tech = e.target.value; return { ...r, projects: a }; })} />
                      </div>
                      <textarea className={styles.textarea} rows={2} placeholder="Brief description"
                        value={p.desc}
                        onChange={e => setResume(r => { const a = [...r.projects]; a[i].desc = e.target.value; return { ...r, projects: a }; })} />
                    </div>
                  ))}
                </div>

                {/* Skills & Certs */}
                <div className={styles.formSection}>
                  <h3 className={styles.formSectionTitle}>Skills</h3>
                  <textarea className={styles.textarea} rows={2}
                    placeholder="Comma separated: React, Node.js, MongoDB, TypeScript, AWS..."
                    value={resume.skills} onChange={e => setResume(r => ({ ...r, skills: e.target.value }))} />
                  <h3 className={styles.formSectionTitle} style={{ marginTop: 12 }}>Certifications</h3>
                  <textarea className={styles.textarea} rows={2}
                    placeholder="e.g. AWS Certified Developer, Google Cloud Associate..."
                    value={resume.certifications} onChange={e => setResume(r => ({ ...r, certifications: e.target.value }))} />
                </div>

                <button className={styles.downloadBtn} onClick={downloadResume}>
                  <Download size={16} /> Download as PDF
                </button>
              </div>

              {/* ── RIGHT: Live Preview ── */}
              <div className={styles.resumePreview}>
                <div className={styles.previewLabel}>Live Preview</div>
                <div className={styles.previewDoc}>
                  {/* Blue Header */}
                  <div style={{ background: '#e8f4fd', padding: '16px 20px', textAlign: 'center', marginBottom: '0' }}>
                    <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1a6fa8', margin: 0 }}>{resume.name || 'Your Name'}</h1>
                    {resume.summary && <p style={{ fontSize: '11px', color: '#444', margin: '3px 0 8px' }}>{resume.summary.split('.')[0]}</p>}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '10px', color: '#333' }}>
                      {resume.phone    && <span>📞 {resume.phone}</span>}
                      {resume.email    && <span>✉ {resume.email}</span>}
                      {resume.location && <span>📍 {resume.location}</span>}
                      {resume.linkedin && <span>🔗 {resume.linkedin}</span>}
                    </div>
                  </div>

                  {/* Two column body */}
                  <div style={{ display: 'flex', minHeight: '400px' }}>
                    {/* Left sidebar */}
                    <div style={{ width: '140px', minWidth: '140px', padding: '12px 10px', borderRight: '1px solid #e0e0e0' }}>
                      {resume.skills && (
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ fontSize: '11px', fontWeight: 700, color: '#1a6fa8', borderBottom: '1.5px solid #1a6fa8', paddingBottom: '2px', marginBottom: '6px' }}>Skills</div>
                          {resume.skills.split(',').map((s, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid #eee', fontSize: '10px' }}>
                              <span>{s.trim()}</span>
                              <span style={{ color: '#777' }}>Skillful</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {resume.certifications && (
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 700, color: '#1a6fa8', borderBottom: '1.5px solid #1a6fa8', paddingBottom: '2px', marginBottom: '6px' }}>Certifications</div>
                          <p style={{ fontSize: '10px', color: '#333' }}>{resume.certifications}</p>
                        </div>
                      )}
                    </div>

                    {/* Right content */}
                    <div style={{ flex: 1, padding: '12px 14px' }}>
                      {resume.summary && (
                        <div style={{ marginBottom: '10px' }}>
                          <div style={{ fontSize: '11px', fontWeight: 700, color: '#1a6fa8', borderBottom: '1.5px solid #1a6fa8', paddingBottom: '2px', marginBottom: '6px' }}>Summary</div>
                          <p style={{ fontSize: '10px', color: '#333', lineHeight: 1.5 }}>{resume.summary}</p>
                        </div>
                      )}
                      {resume.education.some(e => e.degree) && (
                        <div style={{ marginBottom: '10px' }}>
                          <div style={{ fontSize: '11px', fontWeight: 700, color: '#1a6fa8', borderBottom: '1.5px solid #1a6fa8', paddingBottom: '2px', marginBottom: '6px' }}>Education</div>
                          {resume.education.filter(e => e.degree).map((ed, i) => (
                            <div key={i} style={{ marginBottom: '6px' }}>
                              <div style={{ fontSize: '11px', fontWeight: 700 }}>{ed.degree}</div>
                              <div style={{ fontSize: '10px', color: '#555' }}>{ed.school}{ed.year ? ` | ${ed.year}` : ''}</div>
                            </div>
                          ))}
                        </div>
                      )}
                      {resume.experience.some(e => e.role) && (
                        <div style={{ marginBottom: '10px' }}>
                          <div style={{ fontSize: '11px', fontWeight: 700, color: '#1a6fa8', borderBottom: '1.5px solid #1a6fa8', paddingBottom: '2px', marginBottom: '6px' }}>Experience</div>
                          {resume.experience.filter(e => e.role).map((ex, i) => (
                            <div key={i} style={{ marginBottom: '6px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '11px', fontWeight: 700 }}>{ex.role}</span>
                                <span style={{ fontSize: '10px', color: '#777' }}>{ex.duration}</span>
                              </div>
                              <div style={{ fontSize: '10px', color: '#555' }}>{ex.company}</div>
                            </div>
                          ))}
                        </div>
                      )}
                      {resume.projects.some(p => p.name) && (
                        <div style={{ marginBottom: '10px' }}>
                          <div style={{ fontSize: '11px', fontWeight: 700, color: '#1a6fa8', borderBottom: '1.5px solid #1a6fa8', paddingBottom: '2px', marginBottom: '6px' }}>Projects</div>
                          {resume.projects.filter(p => p.name).map((p, i) => (
                            <div key={i} style={{ marginBottom: '6px' }}>
                              <div style={{ fontSize: '11px', fontWeight: 700 }}>{p.name}</div>
                              {p.tech && <div style={{ fontSize: '10px', color: '#1a6fa8' }}>{p.tech}</div>}
                              {p.desc && <p style={{ fontSize: '10px', color: '#333' }}>{p.desc}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── 3. Resume Analyzer ── */}
        {activeSection === 'analyzer' && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}><Sparkles size={18} /> Resume Analyzer (AI)</h2>
            <div className={styles.analyzerBox}>
              <div className={styles.uploadArea} onClick={() => fileRef.current?.click()}>
                <Upload size={32} className={styles.uploadIcon} />
                <p>Click to upload resume (.txt / .pdf text)</p>
                <span>or paste text below</span>
                <input ref={fileRef} type="file" accept=".txt,.pdf" style={{ display: 'none' }} onChange={handleFileUpload} />
              </div>
              <textarea className={styles.textarea} rows={8} placeholder="Or paste your resume text here..."
                value={resumeText} onChange={e => setResumeText(e.target.value)} />
              <button className={styles.analyzeBtn} onClick={analyzeResume} disabled={analyzing || !resumeText.trim()}>
                {analyzing ? 'Analyzing...' : <><Sparkles size={15} /> Analyze with AI</>}
              </button>

              {analysis && (
                <div className={styles.analysisResult}>
                  {/* Score */}
                  <div className={styles.scoreCircleWrap}>
                    <div className={styles.scoreCircle} style={{ background: `conic-gradient(#ff6a00 ${analysis.score * 3.6}deg, #1e1e1e 0deg)` }}>
                      <div className={styles.scoreInner}>{analysis.score}<span>%</span></div>
                    </div>
                    <p className={styles.scoreLabel}>Resume Score</p>
                  </div>

                  <div className={styles.analysisCards}>
                    <div className={styles.analysisCard}>
                      <h4>💡 Suggestions</h4>
                      <ul>{analysis.suggestions.map((s, i) => <li key={i}>{s}</li>)}</ul>
                    </div>
                    <div className={styles.analysisCard}>
                      <h4>⚠️ Missing Skills</h4>
                      <div className={styles.missingTags}>
                        {analysis.missing.map((m, i) => <span key={i} className={styles.missingTag}>{m}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── 4. Job Recommendations ── */}
        {activeSection === 'recommend' && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}><Briefcase size={18} /> Job Recommendations</h2>
            <p className={styles.sectionSub}>Latest jobs posted by admin</p>
            {adminJobs.length === 0 ? (
              <div className={styles.emptyState}>
                <Briefcase size={48} className={styles.emptyIcon} />
                <p>No job recommendations available yet. Check back soon!</p>
              </div>
            ) : (
              <div className={styles.jobGrid}>
                {adminJobs.map(job => (
                  <div key={job._id} className={styles.jobCard}>
                    <div className={styles.jobTop}>
                      <div>
                        <h3 className={styles.jobTitle}>{job.title}</h3>
                        <p className={styles.jobMeta}><Building2 size={13} /> {job.company}</p>
                        <p className={styles.jobMeta}><MapPin size={13} /> {job.location}</p>
                      </div>
                    </div>
                    {job.description && <p style={{ fontSize: '0.82rem', color: '#aaa', margin: '0.5rem 0' }}>{job.description.slice(0, 100)}{job.description.length > 100 ? '...' : ''}</p>}
                    {job.skills && <p style={{ fontSize: '0.8rem', color: '#FF6A00', marginBottom: '0.5rem' }}>🛠 {job.skills}</p>}
                    <span className={styles.typeBadge}>{job.type}</span>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                      {job.applyLink && (
                        <a href={job.applyLink} target="_blank" rel="noreferrer" className={styles.applyBtn} style={{ textDecoration: 'none', textAlign: 'center' }}>Apply Now</a>
                      )}
                      <button className={styles.applyBtn} style={{ background: 'rgba(255,106,0,0.15)', color: '#FF6A00' }} onClick={() => {
                        setTracker(t => [...t, { id: Date.now(), company: job.company, role: job.title, status: 'Applied', date: new Date().toISOString().split('T')[0] }]);
                        setActiveSection('tracker');
                      }}>Track</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── 5. Application Tracker ── */}
        {activeSection === 'tracker' && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}><Briefcase size={18} /> Application Tracker</h2>

            {/* Add new entry */}
            <div className={styles.trackerForm}>
              <input className={styles.field} placeholder="Company" value={newEntry.company}
                onChange={e => setNewEntry(n => ({ ...n, company: e.target.value }))} />
              <input className={styles.field} placeholder="Role" value={newEntry.role}
                onChange={e => setNewEntry(n => ({ ...n, role: e.target.value }))} />
              <div className={styles.selectWrap}>
                <select className={styles.select} value={newEntry.status}
                  onChange={e => setNewEntry(n => ({ ...n, status: e.target.value as TrackerEntry['status'] }))}>
                  <option>Applied</option>
                  <option>Interview Scheduled</option>
                  <option>Selected</option>
                  <option>Rejected</option>
                </select>
                <ChevronDown size={14} className={styles.selectIcon} />
              </div>
              <input className={styles.field} type="date" value={newEntry.date}
                onChange={e => setNewEntry(n => ({ ...n, date: e.target.value }))} />
              <button className={styles.addEntryBtn} onClick={addEntry}><PlusCircle size={15} /> Add</button>
            </div>

            {/* Status summary */}
            <div className={styles.statusSummary}>
              {(['Applied', 'Interview Scheduled', 'Selected', 'Rejected'] as const).map(s => (
                <div key={s} className={styles.statusCard} style={{ borderColor: STATUS_COLORS[s] + '44' }}>
                  <span style={{ color: STATUS_COLORS[s] }}>{STATUS_ICONS[s]}</span>
                  <span className={styles.statusCount}>{tracker.filter(t => t.status === s).length}</span>
                  <span className={styles.statusLabel}>{s}</span>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className={styles.trackerTable}>
              <div className={styles.tableHeader}>
                <span>Company</span><span>Role</span><span>Status</span><span>Date</span><span></span>
              </div>
              {tracker.map(t => (
                <div key={t.id} className={styles.tableRow}>
                  <span className={styles.tdCompany}>{t.company}</span>
                  <span className={styles.tdRole}>{t.role}</span>
                  <span className={styles.tdStatus} style={{ color: STATUS_COLORS[t.status], background: STATUS_COLORS[t.status] + '18' }}>
                    {STATUS_ICONS[t.status]} {t.status}
                  </span>
                  <span className={styles.tdDate}>{t.date}</span>
                  <button className={styles.deleteBtn} onClick={() => setTracker(tr => tr.filter(x => x.id !== t.id))}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {tracker.length === 0 && <p className={styles.empty}>No applications tracked yet.</p>}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
