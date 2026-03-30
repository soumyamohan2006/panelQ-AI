import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import {
  Search, BookOpen, Monitor, BriefcaseBusiness, MapPin, Building2,
  Upload, FileText, Plus, Download, Sparkles, CheckCircle, XCircle, ExternalLink, Loader2
} from 'lucide-react';
import styles from './Dashboard.module.css';
import jStyles from './JobHunter.module.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

type Tab = 'jobs' | 'resume' | 'analyzer';

interface Job {
  id: number;
  title: string;
  company_name: string;
  candidate_required_location: string;
  job_type: string;
  tags: string[];
  url: string;
  company_logo: string;
  publication_date: string;
}

interface ResumeData {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  summary: string;
  education: { degree: string; school: string; year: string; gpa: string }[];
  skills: string;
  languages: string;
  frameworks: string;
  tools: string;
  databases: string;
  cloud: string;
  projects: { name: string; tech: string; link: string; desc: string }[];
  experience: { role: string; company: string; duration: string; location: string; desc: string }[];
  certifications: { name: string; issuer: string; year: string }[];
  achievements: string;
}


export default function JobHunter() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [tab, setTab] = useState<Tab>('jobs');

  // ── Job Search ──
  const [jobs, setJobs]           = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState('');
  const [roleQ, setRoleQ]         = useState('');
  const [locationQ, setLocationQ] = useState('');
  const [searched, setSearched]   = useState(false);

  const fetchJobs = async () => {
    setJobsLoading(true);
    setJobsError('');
    setSearched(true);
    try {
      const params = new URLSearchParams();
      if (roleQ.trim())     params.set('search', roleQ.trim());
      if (locationQ.trim()) params.set('location', locationQ.trim());
      const res = await fetch(`https://remotive.com/api/remote-jobs?${params}&limit=20`);
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch {
      setJobsError('Failed to fetch jobs. Please try again.');
    } finally {
      setJobsLoading(false);
    }
  };

  const handleJobSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  // ── Resume Builder ──
  const [resume, setResume] = useState<ResumeData>({
    name: '', email: '', phone: '', location: '', linkedin: '', github: '', portfolio: '', summary: '',
    education: [{ degree: '', school: '', year: '', gpa: '' }],
    skills: '', languages: '', frameworks: '', tools: '', databases: '', cloud: '',
    projects: [{ name: '', tech: '', link: '', desc: '' }],
    experience: [{ role: '', company: '', duration: '', location: '', desc: '' }],
    certifications: [{ name: '', issuer: '', year: '' }],
    achievements: '',
  });

  const updateResume = (key: keyof ResumeData, val: any) =>
    setResume(prev => ({ ...prev, [key]: val }));

  const handlePrint = () => window.print();

  // ── Resume Analyzer ──
  const fileRef = useRef<HTMLInputElement>(null);
  const [analyzing, setAnalyzing]   = useState(false);
  const [analysis, setAnalysis]     = useState<{ score: number; suggestions: string[]; missing: string[] } | null>(null);

  const handleAnalyze = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAnalyzing(true);
    setAnalysis(null);
    try {
      const text = await file.text();
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: `You are a professional resume reviewer. Analyze the resume text and respond ONLY with valid JSON in this exact format:
{"score": <number 0-100>, "suggestions": ["<tip1>","<tip2>","<tip3>"], "missing": ["<skill1>","<skill2>","<skill3>"]}`,
          messages: [{ role: 'user', content: `Resume:\n${text.slice(0, 3000)}` }],
        }),
      });
      const data = await res.json();
      const parsed = JSON.parse(data.reply.match(/\{[\s\S]*\}/)?.[0] || '{}');
      setAnalysis(parsed);
    } catch {
      setAnalysis({ score: 0, suggestions: ['Could not parse resume. Try a text-based PDF.'], missing: [] });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo} onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span className={styles.logoIcon}>⚡</span>
          <span className={styles.logoText}>PanelQ</span>
        </div>
        <nav className={styles.nav}>
          <a href="/preparation" className={styles.navItem}><BookOpen size={18} /> Preparation</a>
          <a href="/dashboard"   className={styles.navItem}><Monitor size={18} /> Mock Interview</a>
          <a href="/job-hunter"  className={`${styles.navItem} ${styles.activeItem}`}><BriefcaseBusiness size={18} /> Job Hunter</a>
        </nav>
      </aside>

      <div className={styles.main}>
        <header className={styles.header} />

        <section className={styles.content}>
          {/* Tab Bar */}
          <div className={jStyles.tabs}>
            {(['jobs','resume','analyzer'] as Tab[]).map(t => (
              <button key={t} className={`${jStyles.tab} ${tab === t ? jStyles.activeTab : ''}`} onClick={() => setTab(t)}>
                {t === 'jobs'     && <Search size={15} />}
                {t === 'resume'   && <FileText size={15} />}
                {t === 'analyzer' && <Sparkles size={15} />}
                {t === 'jobs' ? 'Job Search' : t === 'resume' ? 'Resume Builder' : 'Resume Analyzer'}
              </button>
            ))}
          </div>

          {/* ── JOB SEARCH ── */}
          {tab === 'jobs' && (
            <div>
              <form className={jStyles.filters} onSubmit={handleJobSearch}>
                <div className={jStyles.filterInput}>
                  <Search size={14} className={jStyles.filterIcon} />
                  <input placeholder="Role (e.g. React Developer, DevOps)" value={roleQ} onChange={e => setRoleQ(e.target.value)} />
                </div>
                <div className={jStyles.filterInput}>
                  <MapPin size={14} className={jStyles.filterIcon} />
                  <input placeholder="Location (e.g. Remote, USA, India)" value={locationQ} onChange={e => setLocationQ(e.target.value)} />
                </div>
                <button type="submit" className={jStyles.searchBtn} disabled={jobsLoading}>
                  {jobsLoading ? <Loader2 size={15} className={jStyles.spin} /> : <Search size={15} />}
                  {jobsLoading ? 'Searching...' : 'Search Jobs'}
                </button>
              </form>

              {!searched && (
                <div className={jStyles.emptyState}>
                  <BriefcaseBusiness size={48} className={jStyles.emptyIcon} />
                  <p>Search real job openings from companies worldwide</p>
                  <span>Powered by Remotive — live remote job listings</span>
                </div>
              )}

              {jobsError && <p className={jStyles.errorText}>{jobsError}</p>}

              {searched && !jobsLoading && jobs.length === 0 && !jobsError && (
                <p className={jStyles.resultCount}>No jobs found. Try a different search term.</p>
              )}

              {jobs.length > 0 && (
                <>
                  <p className={jStyles.resultCount}>{jobs.length} live job{jobs.length > 1 ? 's' : ''} found</p>
                  <div className={jStyles.jobGrid}>
                    {jobs.map(job => (
                      <div key={job.id} className={jStyles.jobCard}>
                        <div className={jStyles.jobTop}>
                          <div className={jStyles.jobCompanyRow}>
                            {job.company_logo
                              ? <img src={job.company_logo} alt={job.company_name} className={jStyles.companyLogo} />
                              : <div className={jStyles.companyLogoFallback}>{job.company_name.charAt(0)}</div>
                            }
                            <div>
                              <h3 className={jStyles.jobTitle}>{job.title}</h3>
                              <p className={jStyles.jobMeta}><Building2 size={12} /> {job.company_name}</p>
                            </div>
                          </div>
                          <span className={jStyles.jobType}>{job.job_type}</span>
                        </div>
                        {job.candidate_required_location && (
                          <p className={jStyles.jobLocation}><MapPin size={12} /> {job.candidate_required_location}</p>
                        )}
                        <div className={jStyles.skillTags}>
                          {job.tags.slice(0, 4).map(t => <span key={t} className={jStyles.skillTag}>{t}</span>)}
                        </div>
                        <a href={job.url} target="_blank" rel="noreferrer" className={jStyles.applyBtn}>
                          <ExternalLink size={14} /> Apply on {job.company_name}
                        </a>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── RESUME BUILDER ── */}
          {tab === 'resume' && (
            <div className={jStyles.resumeWrap}>
              <div className={jStyles.resumeForm}>
                <h2 className={jStyles.sectionTitle}>Personal Info</h2>
                <div className={jStyles.formGrid}>
                  <input className={jStyles.input} placeholder="Full Name"  value={resume.name}      onChange={e => updateResume('name', e.target.value)} />
                  <input className={jStyles.input} placeholder="Email"      value={resume.email}     onChange={e => updateResume('email', e.target.value)} />
                  <input className={jStyles.input} placeholder="Phone"      value={resume.phone}     onChange={e => updateResume('phone', e.target.value)} />
                  <input className={jStyles.input} placeholder="Location (City, Country)" value={resume.location} onChange={e => updateResume('location', e.target.value)} />
                  <input className={jStyles.input} placeholder="LinkedIn URL" value={resume.linkedin} onChange={e => updateResume('linkedin', e.target.value)} />
                  <input className={jStyles.input} placeholder="GitHub URL"   value={resume.github}   onChange={e => updateResume('github', e.target.value)} />
                  <input className={jStyles.input} placeholder="Portfolio / Website" value={resume.portfolio} onChange={e => updateResume('portfolio', e.target.value)} />
                </div>
                <textarea className={jStyles.textarea} placeholder="Professional Summary (2-3 lines about your IT background & goals)" rows={3}
                  value={resume.summary} onChange={e => updateResume('summary', e.target.value)} />

                <h2 className={jStyles.sectionTitle}>Technical Skills</h2>
                <div className={jStyles.formGrid}>
                  <input className={jStyles.input} placeholder="Languages (Python, Java, JS...)" value={resume.languages}  onChange={e => updateResume('languages', e.target.value)} />
                  <input className={jStyles.input} placeholder="Frameworks (React, Spring, Django...)" value={resume.frameworks} onChange={e => updateResume('frameworks', e.target.value)} />
                  <input className={jStyles.input} placeholder="Tools (Git, Docker, Jira...)"    value={resume.tools}      onChange={e => updateResume('tools', e.target.value)} />
                  <input className={jStyles.input} placeholder="Databases (MySQL, MongoDB...)"   value={resume.databases}  onChange={e => updateResume('databases', e.target.value)} />
                  <input className={jStyles.input} placeholder="Cloud (AWS, Azure, GCP...)"      value={resume.cloud}      onChange={e => updateResume('cloud', e.target.value)} />
                  <input className={jStyles.input} placeholder="Other Skills"                    value={resume.skills}     onChange={e => updateResume('skills', e.target.value)} />
                </div>

                <h2 className={jStyles.sectionTitle}>Experience
                  <button className={jStyles.addBtn} onClick={() => updateResume('experience', [...resume.experience, { role:'', company:'', duration:'', location:'', desc:'' }])}><Plus size={14}/></button>
                </h2>
                {resume.experience.map((ex, i) => (
                  <div key={i} className={jStyles.projectRow}>
                    <div className={jStyles.formGrid}>
                      <input className={jStyles.input} placeholder="Job Title"  value={ex.role}     onChange={e => { const a=[...resume.experience]; a[i].role=e.target.value;     updateResume('experience',a); }} />
                      <input className={jStyles.input} placeholder="Company"    value={ex.company}  onChange={e => { const a=[...resume.experience]; a[i].company=e.target.value;  updateResume('experience',a); }} />
                      <input className={jStyles.input} placeholder="Duration (e.g. Jan 2023 – Present)" value={ex.duration} onChange={e => { const a=[...resume.experience]; a[i].duration=e.target.value; updateResume('experience',a); }} />
                      <input className={jStyles.input} placeholder="Location / Remote" value={ex.location} onChange={e => { const a=[...resume.experience]; a[i].location=e.target.value; updateResume('experience',a); }} />
                    </div>
                    <textarea className={jStyles.textarea} placeholder="Key responsibilities & achievements (use bullet points with metrics e.g. Reduced load time by 40%)" rows={3} value={ex.desc} onChange={e => { const a=[...resume.experience]; a[i].desc=e.target.value; updateResume('experience',a); }} />
                  </div>
                ))}

                <h2 className={jStyles.sectionTitle}>Education
                  <button className={jStyles.addBtn} onClick={() => updateResume('education', [...resume.education, { degree:'', school:'', year:'', gpa:'' }])}><Plus size={14}/></button>
                </h2>
                {resume.education.map((ed, i) => (
                  <div key={i} className={jStyles.formGrid}>
                    <input className={jStyles.input} placeholder="Degree (B.Tech CSE...)" value={ed.degree} onChange={e => { const a=[...resume.education]; a[i].degree=e.target.value; updateResume('education',a); }} />
                    <input className={jStyles.input} placeholder="University / School"    value={ed.school} onChange={e => { const a=[...resume.education]; a[i].school=e.target.value; updateResume('education',a); }} />
                    <input className={jStyles.input} placeholder="Year (2020–2024)"        value={ed.year}   onChange={e => { const a=[...resume.education]; a[i].year=e.target.value;   updateResume('education',a); }} />
                    <input className={jStyles.input} placeholder="CGPA / Percentage"       value={ed.gpa}    onChange={e => { const a=[...resume.education]; a[i].gpa=e.target.value;    updateResume('education',a); }} />
                  </div>
                ))}

                <h2 className={jStyles.sectionTitle}>Projects
                  <button className={jStyles.addBtn} onClick={() => updateResume('projects', [...resume.projects, { name:'', tech:'', link:'', desc:'' }])}><Plus size={14}/></button>
                </h2>
                {resume.projects.map((p, i) => (
                  <div key={i} className={jStyles.projectRow}>
                    <div className={jStyles.formGrid}>
                      <input className={jStyles.input} placeholder="Project Name" value={p.name} onChange={e => { const a=[...resume.projects]; a[i].name=e.target.value; updateResume('projects',a); }} />
                      <input className={jStyles.input} placeholder="Tech Stack (React, Node, MongoDB)" value={p.tech} onChange={e => { const a=[...resume.projects]; a[i].tech=e.target.value; updateResume('projects',a); }} />
                      <input className={jStyles.input} placeholder="GitHub / Live Link" value={p.link} onChange={e => { const a=[...resume.projects]; a[i].link=e.target.value; updateResume('projects',a); }} />
                    </div>
                    <textarea className={jStyles.textarea} placeholder="What it does, your role, impact" rows={2} value={p.desc} onChange={e => { const a=[...resume.projects]; a[i].desc=e.target.value; updateResume('projects',a); }} />
                  </div>
                ))}

                <h2 className={jStyles.sectionTitle}>Certifications
                  <button className={jStyles.addBtn} onClick={() => updateResume('certifications', [...resume.certifications, { name:'', issuer:'', year:'' }])}><Plus size={14}/></button>
                </h2>
                {resume.certifications.map((c, i) => (
                  <div key={i} className={jStyles.formGrid}>
                    <input className={jStyles.input} placeholder="Certification Name (AWS SAA, CKAD...)" value={c.name}   onChange={e => { const a=[...resume.certifications]; a[i].name=e.target.value;   updateResume('certifications',a); }} />
                    <input className={jStyles.input} placeholder="Issuer (AWS, Google, Coursera...)"    value={c.issuer} onChange={e => { const a=[...resume.certifications]; a[i].issuer=e.target.value; updateResume('certifications',a); }} />
                    <input className={jStyles.input} placeholder="Year"                                 value={c.year}   onChange={e => { const a=[...resume.certifications]; a[i].year=e.target.value;   updateResume('certifications',a); }} />
                  </div>
                ))}

                <h2 className={jStyles.sectionTitle}>Achievements & Awards</h2>
                <textarea className={jStyles.textarea} placeholder="Hackathon wins, open source contributions, publications, competitive programming ranks..." rows={3}
                  value={resume.achievements} onChange={e => updateResume('achievements', e.target.value)} />

                <button className={jStyles.downloadBtn} onClick={handlePrint}><Download size={16}/> Download PDF</button>
              </div>

              {/* Preview — Standard Two-Column Template */}
              <div className={jStyles.resumePreview} id="resume-preview">
                {/* Left sidebar */}
                <div className={jStyles.previewSidebar}>
                  <div className={jStyles.previewAvatar}>{(resume.name || 'Y').charAt(0).toUpperCase()}</div>
                  <h1 className={jStyles.previewName}>{resume.name || 'Your Name'}</h1>

                  <div className={jStyles.previewSideSection}>Contact</div>
                  {resume.email    && <p className={jStyles.previewSideItem}>✉ {resume.email}</p>}
                  {resume.phone    && <p className={jStyles.previewSideItem}>📞 {resume.phone}</p>}
                  {resume.location && <p className={jStyles.previewSideItem}>📍 {resume.location}</p>}
                  {resume.linkedin && <p className={jStyles.previewSideItem}>🔗 {resume.linkedin}</p>}
                  {resume.github   && <p className={jStyles.previewSideItem}>💻 {resume.github}</p>}
                  {resume.portfolio&& <p className={jStyles.previewSideItem}>🌐 {resume.portfolio}</p>}

                  {(resume.languages||resume.frameworks||resume.tools||resume.databases||resume.cloud||resume.skills) && (
                    <>
                      <div className={jStyles.previewSideSection}>Technical Skills</div>
                      {resume.languages  && <><p className={jStyles.previewSkillLabel}>Languages</p>{resume.languages.split(',').map((s,i)=><span key={i} className={jStyles.previewSkillTag}>{s.trim()}</span>)}</>}
                      {resume.frameworks && <><p className={jStyles.previewSkillLabel}>Frameworks</p>{resume.frameworks.split(',').map((s,i)=><span key={i} className={jStyles.previewSkillTag}>{s.trim()}</span>)}</>}
                      {resume.tools      && <><p className={jStyles.previewSkillLabel}>Tools</p>{resume.tools.split(',').map((s,i)=><span key={i} className={jStyles.previewSkillTag}>{s.trim()}</span>)}</>}
                      {resume.databases  && <><p className={jStyles.previewSkillLabel}>Databases</p>{resume.databases.split(',').map((s,i)=><span key={i} className={jStyles.previewSkillTag}>{s.trim()}</span>)}</>}
                      {resume.cloud      && <><p className={jStyles.previewSkillLabel}>Cloud</p>{resume.cloud.split(',').map((s,i)=><span key={i} className={jStyles.previewSkillTag}>{s.trim()}</span>)}</>}
                      {resume.skills     && <><p className={jStyles.previewSkillLabel}>Other</p>{resume.skills.split(',').map((s,i)=><span key={i} className={jStyles.previewSkillTag}>{s.trim()}</span>)}</>}
                    </>
                  )}

                  {resume.certifications.some(c=>c.name) && (
                    <>
                      <div className={jStyles.previewSideSection}>Certifications</div>
                      {resume.certifications.map((c,i)=>c.name&&(
                        <p key={i} className={jStyles.previewSideItem}>🏅 {c.name}{c.issuer&&` · ${c.issuer}`}{c.year&&` (${c.year})`}</p>
                      ))}
                    </>
                  )}
                </div>

                {/* Right main content */}
                <div className={jStyles.previewMain}>
                  {resume.summary && (
                    <>
                      <div className={jStyles.previewMainSection}>Profile</div>
                      <p className={jStyles.previewMainText}>{resume.summary}</p>
                    </>
                  )}

                  {resume.experience.some(e => e.role) && (
                    <>
                      <div className={jStyles.previewMainSection}>Experience</div>
                      {resume.experience.map((e,i) => e.role && (
                        <div key={i} className={jStyles.previewEntry}>
                          <div className={jStyles.previewEntryHeader}>
                            <strong>{e.role}</strong>
                            {e.duration && <span className={jStyles.previewDuration}>{e.duration}</span>}
                          </div>
                          {e.company && <div className={jStyles.previewCompany}>{e.company}{e.location && ` · ${e.location}`}</div>}
                          {e.desc && <p className={jStyles.previewMainText}>{e.desc}</p>}
                        </div>
                      ))}
                    </>
                  )}

                  {resume.education.some(e => e.degree) && (
                    <>
                      <div className={jStyles.previewMainSection}>Education</div>
                      {resume.education.map((e,i) => e.degree && (
                        <div key={i} className={jStyles.previewEntry}>
                          <div className={jStyles.previewEntryHeader}>
                            <strong>{e.degree}</strong>
                            {e.year && <span className={jStyles.previewDuration}>{e.year}</span>}
                          </div>
                          {e.school && <div className={jStyles.previewCompany}>{e.school}{e.gpa && ` · ${e.gpa}`}</div>}
                        </div>
                      ))}
                    </>
                  )}

                  {resume.projects.some(p => p.name) && (
                    <>
                      <div className={jStyles.previewMainSection}>Projects</div>
                      {resume.projects.map((p,i) => p.name && (
                        <div key={i} className={jStyles.previewEntry}>
                          <div className={jStyles.previewEntryHeader}>
                            <strong className={jStyles.previewProjectName}>{p.name}</strong>
                            {p.link && <span className={jStyles.previewDuration}>{p.link}</span>}
                          </div>
                          {p.tech && <div className={jStyles.previewCompany}>{p.tech}</div>}
                          {p.desc && <p className={jStyles.previewMainText}>{p.desc}</p>}
                        </div>
                      ))}
                    </>
                  )}

                  {resume.achievements && (
                    <>
                      <div className={jStyles.previewMainSection}>Achievements</div>
                      <p className={jStyles.previewMainText}>{resume.achievements}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── RESUME ANALYZER ── */}
          {tab === 'analyzer' && (
            <div className={jStyles.analyzerWrap}>
              <div className={jStyles.uploadBox} onClick={() => fileRef.current?.click()}>
                <Upload size={36} className={jStyles.uploadIcon} />
                <p className={jStyles.uploadText}>Click to upload your resume (PDF / TXT)</p>
                <input ref={fileRef} type="file" accept=".pdf,.txt" style={{display:'none'}} onChange={handleAnalyze} />
              </div>

              {analyzing && <p className={jStyles.analyzing}><Sparkles size={16}/> Analyzing with AI...</p>}

              {analysis && (
                <div className={jStyles.analysisResult}>
                  <div className={jStyles.scoreWrap}>
                    <div className={jStyles.scoreCircle} style={{ background: `conic-gradient(#ff6a00 ${analysis.score * 3.6}deg, #222 0deg)` }}>
                      <span className={jStyles.scoreNum}>{analysis.score}</span>
                    </div>
                    <p className={jStyles.scoreLabel}>Resume Score</p>
                  </div>

                  <div className={jStyles.analysisGrid}>
                    <div className={jStyles.analysisCard}>
                      <h3><CheckCircle size={16} style={{color:'#22c55e'}}/> Suggestions</h3>
                      <ul>{analysis.suggestions?.map((s,i) => <li key={i}>{s}</li>)}</ul>
                    </div>
                    <div className={jStyles.analysisCard}>
                      <h3><XCircle size={16} style={{color:'#ef4444'}}/> Missing Skills</h3>
                      <div className={jStyles.missingTags}>
                        {analysis.missing?.map((s,i) => <span key={i} className={jStyles.missingTag}>{s}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </section>
      </div>
    </div>
  );
}
