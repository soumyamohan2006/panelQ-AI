import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, ShieldCheck, Zap, Target, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <section className="hero">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="badge">
            AI-Powered Interview Prep
          </span>
          <h1 className="hero-title">
            Practice Interviews. <br />
            <span className="gradient-text">Improve Confidence.</span>
          </h1>
          <p className="hero-subtitle">
            Master your next job interview with PanelQ. Our AI interviewer provides real-time feedback, behavioral analysis, and technical evaluation to help you land your dream role.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <Link to="/setup" className="btn-primary" style={{ padding: '1.25rem 2.5rem', fontSize: '1.25rem' }}>
              Start Interview
              <Play className="w-6 h-6 fill-current" />
            </Link>
            <button className="btn-outline" style={{ padding: '1.25rem 2.5rem', fontSize: '1.25rem' }} onClick={() => setShowDemo(true)}>
              <Play className="w-5 h-5" /> Watch Demo
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="feature-grid"
        >
          {[
            { icon: Zap, title: "Instant Feedback", desc: "Get detailed AI analysis of your answers immediately after your session." },
            { icon: ShieldCheck, title: "Realistic Scenarios", desc: "Practice with questions tailored to specific industries and roles." },
            { icon: Target, title: "Skill Tracking", desc: "Monitor your progress over time and identify areas for improvement." }
          ].map((feature, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon-wrapper">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>{feature.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6' }}>{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Demo Video Modal */}
      <AnimatePresence>
        {showDemo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDemo(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 1000,
              background: 'rgba(0,0,0,0.85)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '1rem',
            }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={e => e.stopPropagation()}
              style={{
                position: 'relative',
                width: '100%', maxWidth: '900px',
                background: '#111',
                borderRadius: '1.25rem',
                overflow: 'hidden',
                border: '1px solid rgba(255,106,0,0.3)',
                boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
              }}
            >
              {/* Modal Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>🎬 PanelQ Demo</span>
                <button
                  onClick={() => setShowDemo(false)}
                  style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}
                >
                  <X size={16} />
                </button>
              </div>
              {/* Video */}
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                <video
                  src="/demo.mp4"
                  controls
                  autoPlay
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#000' }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
