import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, BriefcaseBusiness, Monitor, Search
} from 'lucide-react';
import InterviewerCard from './components/InterviewerCard';
import styles from './Dashboard.module.css';

const interviewers = [
  { id: 1,  name: 'Standard Interviewer', subtitle: 'General Interview',      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=standard' },
  { id: 2,  name: 'Elon Musk',            subtitle: 'Tesla / SpaceX',         avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=elon' },
  { id: 3,  name: 'Donald Trump',         subtitle: 'The Trump Organization', avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=trump' },
  { id: 4,  name: 'Satya Nadella',        subtitle: 'Microsoft',              avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=satya' },
  { id: 5,  name: 'Mark Zuckerberg',      subtitle: 'Meta',                   avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=mark' },
  { id: 6,  name: 'Steve Jobs',           subtitle: 'Apple',                  avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=steve' },
  { id: 7,  name: 'Sam Altman',           subtitle: 'OpenAI',                 avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=sam' },
  { id: 8,  name: 'Mel Robbins',          subtitle: 'Motivational Speaker',   avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=mel' },
  { id: 9,  name: 'SWE — Amazon',         subtitle: 'Software Engineer',      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=amazon' },
  { id: 10, name: 'SWE — Oracle',         subtitle: 'Software Engineer',      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=oracle' },
  { id: 11, name: 'SWE — Microsoft',      subtitle: 'Software Engineer',      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=msft' },
];

export default function Dashboard() {
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
          <a href="/preparation" className={styles.navItem}><BookOpen size={18} /> Preparation</a>
          <a href="#" className={`${styles.navItem} ${styles.activeItem}`}><Monitor size={15} /> Mock Interview</a>
          <a href="/job-hunter" className={styles.navItem}><BriefcaseBusiness size={15} /> Job Hunter</a>
        </nav>
      </aside>

      <div className={styles.main}>
        <header className={styles.header}>
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
