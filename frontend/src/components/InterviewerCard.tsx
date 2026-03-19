import styles from './InterviewerCard.module.css';

interface InterviewerCardProps {
  name: string;
  subtitle: string;
  avatar: string;
  selected: boolean;
  onSelect: () => void;
  onStart: () => void;
}

export default function InterviewerCard({ name, subtitle, avatar, selected, onSelect, onStart }: InterviewerCardProps) {
  return (
    <div className={`${styles.card} ${selected ? styles.selected : ''}`} onClick={onSelect}>
      <img src={avatar} alt={name} className={styles.avatar} />
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.subtitle}>{subtitle}</p>
      <button
        className={styles.startBtn}
        onClick={(e) => { e.stopPropagation(); onStart(); }}
      >
        Start Interview
      </button>
    </div>
  );
}
