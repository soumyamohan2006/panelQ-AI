import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, MapPin, Building2, FileText, Download, Upload,
  Sparkles, Briefcase, PlusCircle, Trash2, CheckCircle,
  Clock, XCircle, ChevronDown
} from 'lucide-react';
import styles from './JobHunter.module.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ── Types ──
interface Job { id: number; title: string; company: string; location: string; type: string; match?: number; }
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
  body { font-family: 'Georgia', serif; color: #1a1a1a; background: #fff; padding: 48px 56px; font-size: 13px; line-height: 1.6; }
  h1 { font-size: 26px; font-weight: 700; letter-spacing: -0.5px; color: #111; }
  .contact { font-size: 12px; color: #555; margin-top: 4px; display: flex; gap: 16px; flex-wrap: wrap; }
  .divider { border: none; border-top: 2px solid #111; margin: 14px 0 10px; }
  .thin { border-top: 1px solid #ddd; margin: 8px 0; }
  h2 { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #111; margin-bottom: 8px; }
  .summary { font-size: 13px; color: #444; margin-bottom: 4px; }
  .entry { margin-bottom: 10px; }
  .entry-header { display: flex; justify-content: space-between; align-items: baseline; }
  .entry-title { font-weight: 700; font-size: 13px; }
  .entry-sub { font-size: 12px; color: #555; }
  .entry-date { font-size: 12px; color: #777; white-space: nowrap; }
  .points { margin-top: 4px; padding-left: 16px; }
  .points li { font-size: 12.5px; color: #333; margin-bottom: 2px; }
  .skills-wrap { display: flex; flex-wrap: wrap; gap: 6px; }
  .skill-tag { background: #f0f0f0; border-radius: 4px; padding: 2px 10px; font-size: 12px; color: #333; }
  .cert { font-size: 12.5px; color: #444; }
  @media print { body { padding: 32px 40px; } }
</style></head><body>
<h1>${resume.name || 'Your Name'}</h1>
<div class="contact">
  ${resume.email ? `<span>✉ ${resume.email}</span>` : ''}
  ${resume.phone ? `<span>📞 ${resume.phone}</span>` : ''}
  ${resume.location ? `<span>📍 ${resume.location}</span>` : ''}
  ${resume.linkedin ? `<span>🔗 ${resume.linkedin}</span>` : ''}
</div>
<hr class="divider"/>
${resume.summary ? `<h2>Professional Summary</h2><p class="summary">${resume.summary}</p><hr class="thin"/>` : ''}
${resume.experience.some(e => e.role) ? `
<h2>Experience</h2>
${resume.experience.filter(e => e.role).map(e => `
<div class="entry">
  <div class="entry-header"><span class="entry-title">${e.role}</span><span class="entry-date">${e.duration}</span></div>
  <div class="entry-sub">${e.company}</div>
  ${e.points ? `<ul class="points">${e.points.split('\n').filter(Boolean).map(p => `<li>${p.replace(/^[-•]\s*/,'')}</li>`).join('')}</ul>` : ''}
</div>`).join('')}<hr class="thin"/>` : ''}
${resume.education.some(e => e.degree) ? `
<h2>Education</h2>
${resume.education.filter(e => e.degree).map(e => `
<div class="entry">
  <div class="entry-header"><span class="entry-title">${e.degree}</span><span class="entry-date">${e.year}</span></div>
  <div class="entry-sub">${e.school}${e.gpa ? ` &nbsp;|&nbsp; GPA: ${e.gpa}` : ''}</div>
</div>`).join('')}<hr class="thin"/>` : ''}
${resume.projects.some(p => p.name) ? `
<h2>Projects</h2>
${resume.projects.filter(p => p.name).map(p => `
<div class="entry">
  <div class="entry-header"><span class="entry-title">${p.name}</span><span class="entry-sub">${p.tech}</span></div>
  <p style="font-size:12.5px;color:#444;margin-top:3px">${p.desc}</p>
</div>`).join('')}<hr class="thin"/>` : ''}
${resume.skills ? `<h2>Skills</h2><div class="skills-wrap">${resume.skills.split(',').map(s => `<span class="skill-tag">${s.trim()}</span>`).join('')}</div><hr class="thin"/>` : ''}
${resume.certifications ? `<h2>Certifications</h2><p class="cert">${resume.certifications}</p>` : ''}
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
                  {/* Header */}
                  <div className={styles.pvHeader}>
                    <h1 className={styles.pvName}>{resume.name || 'Your Name'}</h1>
                    <div className={styles.pvContact}>
                      {resume.email    && <span>✉ {resume.email}</span>}
                      {resume.phone    && <span>📞 {resume.phone}</span>}
                      {resume.location && <span>📍 {resume.location}</span>}
                      {resume.linkedin && <span>🔗 {resume.linkedin}</span>}
                    </div>
                  </div>
                  <hr className={styles.pvDivider} />

                  {/* Summary */}
                  {resume.summary && (
                    <div className={styles.pvSection}>
                      <h2 className={styles.pvSectionTitle}>Professional Summary</h2>
                      <p className={styles.pvText}>{resume.summary}</p>
                    </div>
                  )}

                  {/* Experience */}
                  {resume.experience.some(e => e.role) && (
                    <div className={styles.pvSection}>
                      <h2 className={styles.pvSectionTitle}>Experience</h2>
                      {resume.experience.filter(e => e.role).map((ex, i) => (
                        <div key={i} className={styles.pvEntry}>
                          <div className={styles.pvEntryHeader}>
                            <span className={styles.pvEntryTitle}>{ex.role}</span>
                            <span className={styles.pvEntryDate}>{ex.duration}</span>
                          </div>
                          <span className={styles.pvEntrySub}>{ex.company}</span>
                          {ex.points && (
                            <ul className={styles.pvPoints}>
                              {ex.points.split('\n').filter(Boolean).map((pt, j) => (
                                <li key={j}>{pt.replace(/^[-•]\s*/, '')}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Education */}
                  {resume.education.some(e => e.degree) && (
                    <div className={styles.pvSection}>
                      <h2 className={styles.pvSectionTitle}>Education</h2>
                      {resume.education.filter(e => e.degree).map((ed, i) => (
                        <div key={i} className={styles.pvEntry}>
                          <div className={styles.pvEntryHeader}>
                            <span className={styles.pvEntryTitle}>{ed.degree}</span>
                            <span className={styles.pvEntryDate}>{ed.year}</span>
                          </div>
                          <span className={styles.pvEntrySub}>{ed.school}{ed.gpa ? ` | GPA: ${ed.gpa}` : ''}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Projects */}
                  {resume.projects.some(p => p.name) && (
                    <div className={styles.pvSection}>
                      <h2 className={styles.pvSectionTitle}>Projects</h2>
                      {resume.projects.filter(p => p.name).map((p, i) => (
                        <div key={i} className={styles.pvEntry}>
                          <div className={styles.pvEntryHeader}>
                            <span className={styles.pvEntryTitle}>{p.name}</span>
                            <span className={styles.pvEntrySub}>{p.tech}</span>
                          </div>
                          {p.desc && <p className={styles.pvText}>{p.desc}</p>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Skills */}
                  {resume.skills && (
                    <div className={styles.pvSection}>
                      <h2 className={styles.pvSectionTitle}>Skills</h2>
                      <div className={styles.pvSkills}>
                        {resume.skills.split(',').map((s, i) => (
                          <span key={i} className={styles.pvSkillTag}>{s.trim()}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Certifications */}
                  {resume.certifications && (
                    <div className={styles.pvSection}>
                      <h2 className={styles.pvSectionTitle}>Certifications</h2>
                      <p className={styles.pvText}>{resume.certifications}</p>
                    </div>
                  )}
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
            <p className={styles.sectionSub}>Based on your interview performance and skills</p>
            <div className={styles.jobGrid}>
              {[...ALL_JOBS].sort((a, b) => (b.match || 0) - (a.match || 0)).map(job => (
                <div key={job.id} className={styles.jobCard}>
                  <div className={styles.jobTop}>
                    <div>
                      <h3 className={styles.jobTitle}>{job.title}</h3>
                      <p className={styles.jobMeta}><Building2 size={13} /> {job.company}</p>
                      <p className={styles.jobMeta}><MapPin size={13} /> {job.location}</p>
                    </div>
                    <div className={styles.matchBadge} style={{ background: (job.match || 0) >= 85 ? 'rgba(34,197,94,0.15)' : 'rgba(255,106,0,0.15)', color: (job.match || 0) >= 85 ? '#22c55e' : '#ff6a00' }}>
                      {job.match}% match
                    </div>
                  </div>
                  <span className={styles.typeBadge}>{job.type}</span>
                  <button className={styles.applyBtn} onClick={() => {
                    setTracker(t => [...t, { id: Date.now(), company: job.company, role: job.title, status: 'Applied', date: new Date().toISOString().split('T')[0] }]);
                    setActiveSection('tracker');
                  }}>Apply & Track</button>
                </div>
              ))}
            </div>
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
