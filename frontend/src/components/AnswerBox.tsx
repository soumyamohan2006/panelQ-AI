import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Square } from 'lucide-react';

interface AnswerBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function AnswerBox({ value, onChange, placeholder }: AnswerBoxProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const interimRef = useRef('');

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) setSupported(true);
  }, []);

  const startRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    const baseText = value;
    interimRef.current = '';

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript + ' ';
        } else {
          interim = transcript;
        }
      }
      if (final) interimRef.current += final;
      onChange(baseText + (baseText && interimRef.current ? ' ' : '') + interimRef.current + interim);
    };

    recognition.onerror = () => stopRecording();
    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Type your answer here or use the mic...'}
        style={{
          width: '100%',
          height: '16rem',
          padding: '1.5rem',
          paddingBottom: '3.5rem',
          background: isRecording ? 'rgba(249, 115, 22, 0.04)' : 'rgba(255, 255, 255, 0.03)',
          border: `1px solid ${isRecording ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: '1.5rem',
          color: 'white',
          fontSize: '1.125rem',
          lineHeight: '1.6',
          outline: 'none',
          transition: 'all 0.3s ease',
          resize: 'none',
        }}
        onFocus={(e) => { if (!isRecording) e.target.style.borderColor = 'var(--accent)'; }}
        onBlur={(e) => { if (!isRecording) e.target.style.borderColor = 'var(--border)'; }}
      />

      <div style={{ position: 'absolute', bottom: '1rem', left: '1.25rem', right: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Mic button */}
        {supported && (
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              border: `1px solid ${isRecording ? 'var(--accent)' : 'var(--border)'}`,
              background: isRecording ? 'rgba(249, 115, 22, 0.15)' : 'rgba(255,255,255,0.04)',
              color: isRecording ? 'var(--accent)' : 'var(--text-secondary)',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {isRecording ? (
              <>
                <Square className="w-3 h-3" style={{ fill: 'currentColor' }} />
                Stop Recording
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', animation: 'pulse 1s infinite' }} />
              </>
            ) : (
              <>
                <Mic className="w-3 h-3" />
                Record Answer
              </>
            )}
          </button>
        )}

        {!supported && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
            <MicOff className="w-3 h-3" />
            Voice not supported in this browser
          </div>
        )}

        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
          {value.length} chars
        </span>
      </div>
    </div>
  );
}
