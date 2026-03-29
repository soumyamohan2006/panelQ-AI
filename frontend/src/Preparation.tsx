import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Download } from 'lucide-react';
import styles from './Preparation.module.css';

const resources = [
  {
    id: 1,
    company: 'Cognizant',
    category: 'Quantitative Aptitude',
    description: 'Comprehensive quantitative aptitude placement papers with solutions for Cognizant interviews.',
    file: '/Cognizant-Quantitativ-Aptitude-Placement-Papers.pdf',
    filename: 'Cognizant-Quantitative-Aptitude-Placement-Papers.pdf',
    color: '#ff6a00',
  },
  {
    id: 2,
    company: 'Infosys',
    category: 'Aptitude Model Papers',
    description: 'Infosys aptitude model papers covering logical reasoning, quantitative aptitude, and verbal ability.',
    file: '/INFOSYS -APTITUDE-MODEL PAPERS.pdf',
    filename: 'INFOSYS-APTITUDE-MODEL-PAPERS.pdf',
    color: '#e65c00',
  },
  {
    id: 3,
    company: 'TCS NQT',
    category: 'Ninja Test Papers',
    description: 'TCS NQT Ninja test papers from 2019-2020 with comprehensive aptitude and coding questions.',
    file: '/TCS-NQT_NINJA_2019-2020.pdf',
    filename: 'TCS-NQT_NINJA_2019-2020.pdf',
    color: '#cc3700',
  },
];

export default function Preparation() {
  const navigate = useNavigate();

  const handleDownload = (file: string, filename: string) => {
    const a = document.createElement('a');
    a.href = file;
    a.download = filename;
    a.click();
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={18} /> Back
        </button>
        <div>
          <h1 className={styles.title}>Preparation Resources</h1>
          <p className={styles.subtitle}>Download aptitude test papers and practice materials</p>
        </div>
      </header>

      <div className={styles.grid}>
        {resources.map(r => (
          <div key={r.id} className={styles.card}>
            <div className={styles.cardTop}>
              <div className={styles.iconWrap} style={{ background: `${r.color}22` }}>
                <FileText size={32} style={{ color: r.color }} />
              </div>
              <span className={styles.category} style={{ color: r.color, borderColor: `${r.color}44` }}>
                {r.category}
              </span>
            </div>
            <h2 className={styles.company}>{r.company}</h2>
            <p className={styles.description}>{r.description}</p>
            <button
              className={styles.downloadBtn}
              style={{ background: `linear-gradient(135deg, ${r.color}, #cc3700)` }}
              onClick={() => handleDownload(r.file, r.filename)}
            >
              <Download size={16} /> Download PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
