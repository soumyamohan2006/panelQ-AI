import { motion } from 'motion/react';

interface QuestionCardProps {
  question: string;
  number: number;
  total: number;
}

export default function QuestionCard({ question, number, total }: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      key={number}
      className="glass-card p-8 rounded-2xl mb-6"
    >
      <div className="flex items-center gap-3" style={{ marginBottom: '1.5rem' }}>
        <span style={{ 
          padding: '0.375rem 1rem', 
          background: 'rgba(249, 115, 22, 0.1)', 
          color: 'var(--accent)', 
          fontSize: '0.75rem', 
          fontWeight: '700', 
          borderRadius: '9999px', 
          textTransform: 'uppercase', 
          letterSpacing: '0.1em' 
        }}>
          Question {number} of {total}
        </span>
      </div>
      <h2 style={{ 
        fontSize: '2.25rem', 
        fontWeight: '800', 
        color: 'white', 
        lineHeight: '1.2',
        letterSpacing: '-0.02em'
      }}>
        {question}
      </h2>
    </motion.div>
  );
}
