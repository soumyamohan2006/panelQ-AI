import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Wrench,
  BriefcaseBusiness, GraduationCap, Monitor, ChevronDown, ChevronRight, Search
} from 'lucide-react';
import InterviewerCard from './components/InterviewerCard';
import styles from './Dashboard.module.css';

const interviewers = [
  { id: 1,  name: 'Standard Interviewer', subtitle: 'General Interview',      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=standard' },
  { id: 2,  name: 'Elon Musk',            subtitle: 'Tesla / SpaceX',         avatar: '/elon.png' },
  { id: 3,  name: 'Donald Trump',         subtitle: 'The Trump Organization', avatar: '/trump.png' },
  { id: 4,  name: 'Satya Nadella',        subtitle: 'Microsoft',              avatar: '/satya.png' },
  { id: 5,  name: 'Mark Zuckerberg',      subtitle: 'Meta',                   avatar: '/suker.png' },
  { id: 6,  name: 'Steve Jobs',           subtitle: 'Apple',                  avatar: '/steve.png' },
  { id: 7,  name: 'Sam Altman',           subtitle: 'OpenAI',                 avatar: '/sam.png' },
  { id: 8,  name: 'Mel Robbins',          subtitle: 'Motivational Speaker',   avatar: '/mel.png' },
  { id: 9,  name: 'SWE — Amazon',         subtitle: 'Software Engineer',      avatar: '/swe-amazon.png' },
  { id: 10, name: 'SWE — Oracle',         subtitle: 'Software Engineer',      avatar: '/swe-oracle.png' },
  { id: 11, name: 'SWE — Microsoft',      subtitle: 'Software Engineer',      avatar: '/swe-microsoft.png' },
];

export default function Dashboard() {
  const [toolsOpen, setToolsOpen]   = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [search, setSearch]         = useState('');
  const navigate = useNavigate();

  const filtered = interviewers.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.subtitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo} onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span className={styles.logoIcon}>⚡</span>
          <span className={styles.logoText}>PanelQ</span>
        </div>

        <nav className={styles.nav}>
          <a href="/dashboard" className={styles.navItem}><LayoutDashboard size={18} /> Dashboard</a>
          <a href="/preparation" className={styles.navItem}><BookOpen size={18} /> Preparation</a>

          <button className={styles.navGroup} onClick={() => setToolsOpen(o => !o)}>
            <span className={styles.navGroupLeft}><Wrench size={18} /> Tools</span>
            {toolsOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          </button>
          {toolsOpen && (
            <div className={styles.subMenu}>
              <a href="#" className={`${styles.subItem} ${styles.activeItem}`}><Monitor size={15} /> Mock Interview</a>
              <a href="/job-hunter" className={styles.subItem}><BriefcaseBusiness size={15} /> Job Hunter</a>
            </div>
          )}

          <a href="#" className={styles.navItem}>
            <GraduationCap size={18} /> Education
            <span className={styles.badge}>Get Started</span>
          </a>
        </nav>
      </aside>

      <div className={styles.main}>
        <header className={styles.header}>
          <span className={styles.headerLogo}></span>
          <div className={styles.headerRight}>
          </div>
        </header>

        <section className={styles.content}>
          <div className={styles.contentHeader}>
            <div>
              <h1 className={styles.pageTitle}>Mock Interview</h1>
              <p className={styles.pageSubtitle}>Choose an interviewer and start practicing</p>
            </div>
            <div className={styles.searchWrapper}>
              <Search size={16} className={styles.searchIcon} />
              <input className={styles.searchInput} type="text" placeholder="Search interviewers..."
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className={styles.noResults}>No interviewers found for "{search}"</p>
          ) : (
            <div className={styles.grid}>
              {filtered.map(interviewer => (
                <InterviewerCard
                  key={interviewer.id}
                  {...interviewer}
                  selected={selectedId === interviewer.id}
                  onSelect={() => setSelectedId(interviewer.id)}
                  onStart={() => navigate('/chat-interview', { state: { interviewer } })}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
