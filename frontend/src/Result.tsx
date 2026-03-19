import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import ResultCard from './components/ResultCard';
import { RotateCcw, Home } from 'lucide-react';

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    navigate('/');
    return null;
  }

  return (
    <div className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <ResultCard
          score={result.score}
          feedback={result.feedback}
          breakdown={{ communication: result.communicationScore, technical: result.technicalScore, confidence: result.confidenceScore }}
        />
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '3rem' }}>
          <button className="btn-outline" onClick={() => navigate('/setup')} style={{ padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
          <button className="btn-primary" onClick={() => navigate('/')} style={{ padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Home className="w-4 h-4" /> Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
