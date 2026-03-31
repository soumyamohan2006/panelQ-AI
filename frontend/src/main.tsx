import { StrictMode, Component, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '2rem', color: 'white', background: '#0a0a0a', minHeight: '100vh' }}>
          <h2 style={{ color: '#f97316' }}>App crashed</h2>
          <pre style={{ marginTop: '1rem', color: '#f87171', fontSize: '0.85rem', whiteSpace: 'pre-wrap' }}>
            {(this.state.error as Error).message}
            {(this.state.error as Error).stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
