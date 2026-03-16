interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-end" style={{ marginBottom: '1rem' }}>
        <div className="flex flex-col">
          <span style={{ 
            fontSize: '0.625rem', 
            fontWeight: '800', 
            color: 'var(--accent)', 
            textTransform: 'uppercase', 
            letterSpacing: '0.2em',
            marginBottom: '0.25rem'
          }}>
            Current Progress
          </span>
          <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'white' }}>
            {current} <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>/ {total}</span>
          </span>
        </div>
        <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'white', fontVariantNumeric: 'tabular-nums' }}>
          {Math.round(percentage)}%
        </span>
      </div>
      <div style={{ height: '0.5rem', width: '100%', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '9999px', overflow: 'hidden' }}>
        <div
          style={{ 
            height: '100%', 
            background: 'var(--accent)', 
            width: `${percentage}%`,
            transition: 'all 0.8s cubic-bezier(0.65, 0, 0.35, 1)',
            boxShadow: '0 0 20px rgba(249, 115, 22, 0.3)'
          }}
        />
      </div>
    </div>
  );
}
