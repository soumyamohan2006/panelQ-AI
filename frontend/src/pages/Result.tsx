import { motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RefreshCw, Home, Share2 } from 'lucide-react';
import ResultCard from '../components/ResultCard';

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const resultData = location.state?.result;

  if (!resultData) {
    return (
      <div className="app-wrapper" style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1.5rem' }}>No Result Found</h2>
        <button
          onClick={() => navigate('/setup')}
          className="btn-primary"
          style={{ padding: '1rem 2rem' }}
        >
          Start New Interview
        </button>
      </div>
    );
  }

  const result = {
    score: resultData.score,
    feedback: resultData.feedback,
    breakdown: {
      communication: resultData.communicationScore,
      technical: resultData.technicalScore,
      confidence: resultData.confidenceScore
    }
  };

  return (
    <div className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1rem' }}>Interview <span className="logo-accent">Complete!</span></h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem' }}>Here is your AI-generated performance analysis.</p>
        </motion.div>

        <ResultCard 
          score={result.score} 
          feedback={result.feedback} 
          breakdown={result.breakdown} 
        />

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginTop: '4rem' }}>
          <button
            onClick={() => navigate('/setup')}
            className="btn-primary"
            style={{ padding: '1.25rem 2.5rem', fontSize: '1.125rem' }}
          >
            <RefreshCw className="w-5 h-5" />
            Start New Interview
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn-outline"
            style={{ padding: '1.25rem 2.5rem', fontSize: '1.125rem' }}
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
          <button className="btn-outline" style={{ padding: '1.25rem 2.5rem', fontSize: '1.125rem' }}>
            <Share2 className="w-5 h-5" />
            Share Results
          </button>
        </div>
      </div>
    </div>
  );
}
