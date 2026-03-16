import { useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();
  const isInterviewPage = location.pathname === '/interview';

  if (isInterviewPage) return null;

  return (
    <footer className="footer">
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
          <div className="flex items-center gap-2">
            <span className="logo">Panel<span className="logo-accent">Q</span></span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="nav-link">Privacy</a>
            <a href="#" className="nav-link">Terms</a>
            <a href="#" className="nav-link">Contact</a>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            © 2026 PanelQ AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
