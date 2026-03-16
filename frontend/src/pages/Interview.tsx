import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, AlertCircle } from 'lucide-react';
import QuestionCard from '../components/QuestionCard';
import AnswerBox from '../components/AnswerBox';
import Timer from '../components/Timer';
import ProgressBar from '../components/ProgressBar';
import { useAuth } from '../context/AuthContext';

export default function Interview() {
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState<{ question: string; answer: string }[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const interviewType = location.state?.type || 'hr';

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/questions?type=${interviewType}`);
        const data = await response.json();
        setQuestions(data.questions);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, [interviewType]);

  const handleNext = async () => {
    const newAnswers = [...answers, { question: questions[currentStep], answer }];
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
      setAnswer('');
    } else {
      // Final submission
      setIsEvaluating(true);
      try {
        // Submit to backend for storage. 
        // Backend's interviewController will automatically perform AI evaluation if scores aren't provided.
        const response = await fetch('http://localhost:5000/api/interview/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            type: interviewType, 
            answers: newAnswers
          })
        });
        
        const data = await response.json();
        if (response.ok) {
          navigate('/result', { state: { result: data } });
        } else {
          throw new Error(data.message || 'Submission failed');
        }
      } catch (error) {
        console.error('Submission error:', error);
        alert('Failed to process your interview. Please try again.');
        setIsEvaluating(false);
      }
    }
  };

if (isLoading) {
    return (
      <div className="app-wrapper" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '3rem', height: '3rem', border: '3px solid rgba(249, 115, 22, 0.1)', borderTopColor: 'var(--accent)', borderRadius: '50%' }} className="animate-spin" />
        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>AI is generating your personalized questions...</p>
      </div>
    );
  }

  if (isEvaluating) {
    return (
      <div className="app-wrapper" style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{ width: '4rem', height: '4rem', border: '4px solid rgba(249, 115, 22, 0.1)', borderTopColor: 'var(--accent)', borderRadius: '50%', marginBottom: '2rem' }}
        />
        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>AI Evaluation in Progress</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', fontSize: '1.125rem', lineHeight: '1.6' }}>
          Our AI is analyzing your answers, communication style, and technical depth. This may take a few moments...
        </p>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
      <div className="grid" style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2.5rem',
        alignItems: 'start'
      }}>
        
        {/* Sidebar Info - Sticky on desktop */}
        <div style={{ 
          position: 'sticky', 
          top: '8rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          <div className="glass-card">
            <ProgressBar current={currentStep + 1} total={questions.length} />
          </div>
          
          <Timer duration={600} onTimeUp={() => navigate('/result')} />
          
          <div className="glass-card" style={{ 
            borderLeft: '4px solid var(--accent)', 
            background: 'rgba(249, 115, 22, 0.05)',
            padding: '1.5rem'
          }}>
            <div className="flex items-center gap-2" style={{ color: 'var(--accent)', marginBottom: '0.75rem' }}>
              <AlertCircle className="w-4 h-4" />
              <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Interview Tip</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Use the STAR method: Situation, Task, Action, and Result to structure your answers.
            </p>
          </div>
        </div>

        {/* Main Interview Area */}
        <div style={{ gridColumn: 'span 2', minWidth: 0 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <QuestionCard 
                question={questions[currentStep]} 
                number={currentStep + 1} 
                total={questions.length} 
              />
              
              <div style={{ marginTop: '2rem' }}>
                <AnswerBox 
                  value={answer} 
                  onChange={setAnswer} 
                  placeholder="Describe your experience here..."
                />
              </div>

              <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleNext}
                  disabled={answer.trim().length < 10}
                  className="btn-primary"
                  style={{ padding: '1.25rem 3rem', fontSize: '1.125rem' }}
                >
                  {currentStep === questions.length - 1 ? 'Finish Interview' : 'Next Question'}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
