import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Code, Users, Heart, Play, Zap, Target, Trophy } from 'lucide-react';
import InterviewCard from './components/InterviewCard';

export default function SetupInterview() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleStart = () => {
    if (selectedType && selectedDifficulty)
      navigate('/interview', { state: { type: selectedType, difficulty: selectedDifficulty } });
  };

  const interviewTypes = [
    { id: 'technical', title: 'Technical Interview', description: 'Focuses on coding, algorithms, and system design questions tailored to your tech stack.', icon: Code },
    { id: 'hr', title: 'HR Interview', description: 'Behavioral and cultural fit questions to assess your soft skills and career goals.', icon: Users },
    { id: 'behavioral', title: 'Behavioral Interview', description: 'STAR method questions to evaluate how you handle real-world workplace situations.', icon: Heart },
  ];

  const difficulties = [
    { id: 'easy', label: 'Easy', desc: 'Beginner friendly', icon: <Zap size={20} />, color: '#22c55e' },
    { id: 'medium', label: 'Medium', desc: 'Moderate challenge', icon: <Target size={20} />, color: '#f59e0b' },
    { id: 'hard', label: 'Hard', desc: 'Expert level', icon: <Trophy size={20} />, color: '#ef4444' },
  ];

  return (
    <div className="setup-container">
      <div className="setup-header">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="step-indicator">
            <span style={{ width: '2rem', height: '1px', background: 'var(--accent)' }}></span>
            Step 01
          </div>
          <h1 className="setup-title">Choose your <br /><span className="gradient-text">Interview Path.</span></h1>
          <p className="setup-subtitle">Select a specialized track to begin your practice session. Our AI will tailor questions based on your selection.</p>
        </motion.div>
      </div>

      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {interviewTypes.map((type, index) => (
          <motion.div key={type.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}>
            <InterviewCard title={type.title} description={type.description} icon={type.icon} selected={selectedType === type.id} onClick={() => setSelectedType(type.id)} />
          </motion.div>
        ))}
      </div>

      {/* Difficulty Selection */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ marginBottom: '3rem' }}>
        <div className="step-indicator" style={{ marginBottom: '1.5rem' }}>
          <span style={{ width: '2rem', height: '1px', background: 'var(--accent)' }}></span>
          Step 02 — Difficulty Level
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {difficulties.map((d, i) => (
            <motion.button
              key={d.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.6 }}
              onClick={() => setSelectedDifficulty(d.id)}
              style={{
                padding: '1.25rem',
                background: selectedDifficulty === d.id ? `${d.color}22` : 'rgba(255,255,255,0.03)',
                border: `2px solid ${selectedDifficulty === d.id ? d.color : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '1rem',
                cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                transition: 'all 0.2s ease',
                color: selectedDifficulty === d.id ? d.color : '#aaa',
              }}
            >
              <span style={{ color: d.color }}>{d.icon}</span>
              <span style={{ fontWeight: 700, fontSize: '1rem' }}>{d.label}</span>
              <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{d.desc}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} style={{ display: 'flex', justifyContent: 'center', marginBottom: '6rem' }}>
        <button onClick={handleStart} disabled={!selectedType || !selectedDifficulty} className={`start-btn ${selectedType && selectedDifficulty ? 'btn-primary' : ''}`}>
          Start Session
          <Play className={`w-6 h-6 ${selectedType && selectedDifficulty ? 'fill-current' : ''}`} />
        </button>
      </motion.div>
    </div>
  );
}
