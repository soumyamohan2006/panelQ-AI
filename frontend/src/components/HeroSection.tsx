import { motion } from 'motion/react';
import { Play, ShieldCheck, Zap, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
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
            <button className="btn-outline" style={{ padding: '1.25rem 2.5rem', fontSize: '1.25rem' }}>
              Watch Demo
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
    </section>
  );
}
