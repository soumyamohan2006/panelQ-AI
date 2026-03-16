import HeroSection from '../components/HeroSection';

export default function Home() {
  return (
    <main style={{ minHeight: '100vh' }}>
      <HeroSection />
      
      {/* Social Proof / Stats */}
      <section style={{ padding: '8rem 0', borderTop: '1px solid var(--border)', background: 'rgba(255,255,255,0.01)' }}>
        <div className="container">
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', textAlign: 'center' }}>
            <div className="stat-item">
              <div className="stat-value" style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--accent)', marginBottom: '0.5rem' }}>50k+</div>
              <div className="stat-label" style={{ color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.875rem' }}>Interviews Done</div>
            </div>
            <div className="stat-item">
              <div className="stat-value" style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--accent)', marginBottom: '0.5rem' }}>98%</div>
              <div className="stat-label" style={{ color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.875rem' }}>Success Rate</div>
            </div>
            <div className="stat-item">
              <div className="stat-value" style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--accent)', marginBottom: '0.5rem' }}>200+</div>
              <div className="stat-label" style={{ color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.875rem' }}>Expert Questions</div>
            </div>
            <div className="stat-item">
              <div className="stat-value" style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--accent)', marginBottom: '0.5rem' }}>24/7</div>
              <div className="stat-label" style={{ color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.875rem' }}>AI Availability</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
