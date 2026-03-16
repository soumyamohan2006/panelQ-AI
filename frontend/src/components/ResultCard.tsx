import { motion } from 'motion/react';
import { Award, CheckCircle2, TrendingUp, MessageSquare } from 'lucide-react';

interface ResultCardProps {
  score: number;
  feedback: string;
  breakdown: {
    communication: number;
    technical: number;
    confidence: number;
  };
}

export default function ResultCard({ score, feedback, breakdown }: ResultCardProps) {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card"
        style={{ borderRadius: '2.5rem', overflow: 'hidden', border: '1px solid var(--border)' }}
      >
        <div style={{ 
          background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)', 
          padding: '5rem 2rem', 
          textAlign: 'center', 
          position: 'relative',
          borderBottom: '1px solid var(--border)'
        }}>
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, transparent 70%)',
            filter: 'blur(40px)',
            zIndex: 0
          }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              color: 'var(--accent)', 
              fontSize: '0.75rem', 
              fontWeight: '800', 
              textTransform: 'uppercase', 
              letterSpacing: '0.3em',
              marginBottom: '2rem'
            }}>
              <Award className="w-4 h-4" />
              Final Assessment
            </div>
            
            <div style={{ 
              fontSize: '10rem', 
              fontWeight: '900', 
              color: 'white', 
              lineHeight: '0.8', 
              letterSpacing: '-0.05em',
              marginBottom: '1rem'
            }}>
              {score}
            </div>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
              Overall Performance Score
            </p>
          </div>
        </div>

        <div style={{ padding: '4rem' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1.5fr', 
            gap: '4rem',
            alignItems: 'start'
          }}>
            {/* Left Column: Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {[
                { label: "Communication", value: breakdown.communication, icon: MessageSquare },
                { label: "Technical", value: breakdown.technical, icon: CheckCircle2 },
                { label: "Confidence", value: breakdown.confidence, icon: TrendingUp }
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>
                        {item.label}
                      </span>
                    </div>
                    <span style={{ fontSize: '1rem', fontWeight: '800', color: 'white' }}>{item.value}%</span>
                  </div>
                  <div style={{ height: '4px', width: '100%', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        height: '100%', 
                        background: 'white', 
                        width: `${item.value}%`,
                        transition: 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
                        transitionDelay: `${i * 0.2}s`
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Feedback */}
            <div style={{ 
              padding: '2.5rem', 
              background: 'rgba(255, 255, 255, 0.02)', 
              borderRadius: '2rem',
              border: '1px solid var(--border)'
            }}>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '800', 
                color: 'white', 
                marginBottom: '1.5rem',
                letterSpacing: '-0.02em'
              }}>
                Expert Insights
              </h3>
              <p style={{ 
                fontSize: '1.125rem', 
                color: 'var(--text-secondary)', 
                lineHeight: '1.7',
                fontStyle: 'italic'
              }}>
                "{feedback}"
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
