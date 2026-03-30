import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, AlertCircle, Home } from 'lucide-react';
import QuestionCard from './components/QuestionCard';
import AnswerBox from './components/AnswerBox';
import Timer from './components/Timer';
import ProgressBar from './components/ProgressBar';
import { useAuth } from './context/AuthContext';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Interview() {
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState<{ question: string; answer: string }[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const interviewType = location.state?.type || location.state?.interviewType || 'technical';

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/questions`, { params: { type: interviewType } });
      setQuestions(response.data.questions);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (currentStep < questions.length - 1) {
      setAnswers(prev => [...prev, { question: questions[currentStep], answer }]);
      setCurrentStep(prev => prev + 1);
      setAnswer('');
    } else {
      // Submit final answer and navigate to results
      const finalAnswers = [...answers, { question: questions[currentStep], answer }];
      setIsEvaluating(true);

      try {
        const response = await axios.post(`${API_BASE}/api/interview/submit`, {
          interviewType,
          answers: finalAnswers,
          userId: user?.id
        });

        // Update user stats
        await axios.put(`${API_BASE}/api/profile/stats`, {
          userId: user?.id,
          interviewType
        });

        navigate('/result', { state: { result: response.data, interviewType } });
      } catch (error) {
        console.error('Error submitting interview:', error);
        setIsEvaluating(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="app-wrapper" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '3rem', height: '3rem', border: '3px solid rgba(249, 115, 22, 0.1)', borderTopColor: 'var(--accent)', borderRadius: '50%' }} className="animate-spin" />
        <p style={{ color: 'var(--text-secondary)', marginTop: '1.5rem', fontSize: '1.125rem' }}>
          Preparing your interview questions...
        </p>
      </div>
    );
  }

  if (isEvaluating) {
    return (
      <div className="app-wrapper" style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
        <div style={{ width: '3rem', height: '3rem', border: '3px solid rgba(249, 115, 22, 0.1)', borderTopColor: 'var(--accent)', borderRadius: '50%' }} className="animate-spin" />
        <h2 style={{ color: 'white', marginTop: '1.5rem', fontSize: '1.5rem', fontWeight: '700' }}>
          Evaluating Your Performance
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', fontSize: '1.125rem', lineHeight: '1.6' }}>
          Our AI is analyzing your answers, communication style, and technical depth...
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Navigation Header */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'rgba(13, 13, 13, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '1rem 2rem',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#ff6a00',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 106, 0, 0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <Home className="w-4 h-4" />
          Home
        </button>

        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0, color: 'white' }}>
            {interviewType === 'hr' ? 'HR Interview' : interviewType === 'technical' ? 'Technical Interview' : 'Interview'}
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#aaa', margin: 0 }}>
            Question {currentStep + 1} of {questions.length}
          </p>
        </div>

        <div style={{ width: '80px' }}></div> {/* Spacer for centering */}
      </div>

      <div className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
          <div style={{ position: 'sticky', top: '8rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-card">
              <ProgressBar current={currentStep + 1} total={questions.length} />
            </div>
            <Timer duration={600} onTimeUp={() => navigate('/result')} />
            <div className="glass-card" style={{ borderLeft: '4px solid var(--accent)', background: 'rgba(249, 115, 22, 0.05)', padding: '1.5rem' }}>
              <div className="flex items-center gap-2" style={{ color: 'var(--accent)', marginBottom: '0.75rem' }}>
                <AlertCircle className="w-4 h-4" />
                <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Interview Tip</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Use the STAR method: Situation, Task, Action, and Result to structure your answers.
              </p>
            </div>
          </div>

          <div style={{ gridColumn: 'span 2', minWidth: 0 }}>
            <QuestionCard question={questions[currentStep]} number={currentStep + 1} total={questions.length} />
            <div style={{ marginTop: '2rem' }}>
              <AnswerBox value={answer} onChange={setAnswer} placeholder="Describe your experience here..." />
            </div>
            <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={handleNext} disabled={answer.trim().length < 10} className="btn-primary" style={{ padding: '1.25rem 3rem', fontSize: '1.125rem' }}>
                {currentStep === questions.length - 1 ? 'Finish Interview' : 'Next Question'}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
