import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Download } from 'lucide-react';
import styles from './Preparation.module.css';

const resources = [
  {
    id: 1,
    company: 'CST322 Module 3',
    category: 'Aptitude Test',
    description: 'Module 3 aptitude and reasoning questions used in technical screening rounds.',
    file: '/CST322Mod3 dA.pdf',
    filename: 'CST322_Module3.pdf',
    color: '#ff6a00',
  },
  {
    id: 2,
    company: 'CST322 Module 4',
    category: 'Aptitude Test',
    description: 'Module 4 problem-solving and analytical questions for interview preparation.',
    file: '/CST322Mod4.pdf',
    filename: 'CST322_Module4.pdf',
    color: '#e65c00',
  },
  {
    id: 3,
    company: 'Work Samples',
    category: 'Sample Questions',
    description: 'Real-world work sample questions and exercises from top company interviews.',
    file: '/R-WorkSamples (2).pdf',
    filename: 'Work_Samples.pdf',
    color: '#cc3700',
  },
  {
    id: 4,
    company: 'TCS NQT Ninja',
    category: 'Placement Paper',
    description: 'TCS NQT Ninja 2019-2020 placement paper with aptitude and reasoning questions.',
    file: '/TCS-NQT_NINJA_2019-2020_copy.pdf',
    filename: 'TCS_NQT_Ninja_2019-2020.pdf',
    color: '#3b82f6',
  },
  {
    id: 5,
    company: 'Infosys',
    category: 'Placement Paper',
    description: 'Infosys aptitude model papers for placement preparation and practice.',
    file: '/INFOSYS -APTITUDE-MODEL PAPERS_1473177928759_copy.pdf',
    filename: 'Infosys_Aptitude_Model_Papers.pdf',
    color: '#8b5cf6',
  },
  {
    id: 6,
    company: 'Cognizant',
    category: 'Placement Paper',
    description: 'Cognizant quantitative aptitude placement papers for interview preparation.',
    file: '/Cognizant-Quantitativ-Aptitude-Placement-Papers.pdf',
    filename: 'Cognizant_Aptitude_Papers.pdf',
    color: '#06b6d4',
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
