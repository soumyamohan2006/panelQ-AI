import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface InterviewCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  selected: boolean;
  onClick: () => void;
}

export default function InterviewCard({ title, description, icon: Icon, selected, onClick }: InterviewCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`interview-card ${selected ? 'selected' : ''}`}
    >
      <div className="card-icon-box">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="card-title">{title}</h3>
      <p className="card-description">{description}</p>
    </motion.button>
  );
}
