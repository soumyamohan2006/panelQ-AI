import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Code, Users, Heart, Play } from 'lucide-react';
import InterviewCard from './components/InterviewCard';

export default function SetupInterview() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleStart = () => {
    if (selectedType) navigate('/interview', { state: { type: selectedType } });
  };

  const interviewTypes = [
    { id: 'technical', title: 'Technical Interview', description: 'Focuses on coding, algorithms, and system design questions tailored to your tech stack.', icon: Code },
    { id: 'hr', title: 'HR Interview', description: 'Behavioral and cultural fit questions to assess your soft skills and career goals.', icon: Users },
    { id: 'behavioral', title: 'Behavioral Interview', description: 'STAR method questions to evaluate how you handle real-world workplace situations.', icon: Heart },
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

      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '6rem' }}>
        {interviewTypes.map((type, index) => (
          <motion.div key={type.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}>
            <InterviewCard title={type.title} description={type.description} icon={type.icon} selected={selectedType === type.id} onClick={() => setSelectedType(type.id)} />
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} style={{ display: 'flex', justifyContent: 'center' }}>
        <button onClick={handleStart} disabled={!selectedType} className={`start-btn ${selectedType ? 'btn-primary' : ''}`}>
          Start Session
          <Play className={`w-6 h-6 ${selectedType ? 'fill-current' : ''}`} />
        </button>
      </motion.div>
    </div>
  );
}
