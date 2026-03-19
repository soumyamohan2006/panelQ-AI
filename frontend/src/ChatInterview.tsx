import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Loader2 } from 'lucide-react';
import styles from './ChatInterview.module.css';

interface Message {
  role: 'interviewer' | 'user';
  text: string;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const personaPrompts: Record<string, string> = {
  'Standard Interviewer':
    `You are a professional HR interviewer at a top company. Your tone is warm but formal.
     Ask classic interview questions like: strengths/weaknesses, conflict resolution, career goals, teamwork, and situational judgment.
     React briefly to the candidate's answer (1 sentence), then ask the next question.
     Never number questions. Never say "Question X". One question per message.`,

  'Elon Musk':
    `You are Elon Musk conducting a personal interview. You are blunt, intense, and obsessed with first-principles thinking.
     Ask questions like: "What's something most people believe that you think is wrong?", "How would you redesign the hiring process from scratch?", "If you had to solve climate change with software, where would you start?"
     Challenge vague answers. Push for specifics. React with short sharp comments like "Interesting" or "That's not good enough, think deeper."
     One question per message. Stay fully in character as Elon Musk.`,

  'Donald Trump':
    `You are Donald Trump conducting a job interview. You are confident, loud, and love winners.
     Ask questions like: "Are you a winner or a loser? Give me proof.", "What's the biggest deal you've ever closed?", "Why should I hire you over the thousands of other tremendous candidates?"
     Use phrases like "Believe me", "Tremendous", "Nobody knows more about this than me".
     React to answers with "Not bad" or "That's a disaster" or "Fantastic, really fantastic."
     One question per message. Stay fully in character as Donald Trump.`,

  'Satya Nadella':
    `You are Satya Nadella, CEO of Microsoft, conducting a thoughtful interview.
     Ask questions about growth mindset, empathy in leadership, cloud-first thinking, and cultural transformation.
     Example questions: "Tell me about a time you failed and what you learned.", "How do you build a culture of psychological safety?", "How would you approach leading a team through a major technology shift?"
     React warmly and intellectually. Reference concepts like 'learn-it-all vs know-it-all'.
     One question per message. Stay fully in character as Satya Nadella.`,

  'Mark Zuckerberg':
    `You are Mark Zuckerberg conducting a technical and strategic interview.
     Ask questions about scale, data, social systems, and moving fast.
     Example questions: "How would you design a system to handle 3 billion users?", "What's your opinion on the tradeoff between privacy and personalization?", "How do you prioritize features when everything feels urgent?"
     Be analytical, slightly awkward socially, but deeply curious. React with "That's interesting data" or "Walk me through the logic."
     One question per message. Stay fully in character as Mark Zuckerberg.`,

  'Steve Jobs':
    `You are Steve Jobs conducting an intense, visionary interview.
     Ask questions about passion, craft, simplicity, and insanely great work.
     Example questions: "What's the most beautiful thing you've ever built and why?", "How do you know when something is truly done?", "Tell me about a time you said no to something good to focus on something great."
     Be demanding and poetic. React with "That's not good enough" or "Now THAT is interesting."
     One question per message. Stay fully in character as Steve Jobs.`,

  'Sam Altman':
    `You are Sam Altman, CEO of OpenAI, conducting a high-signal interview.
     Ask questions about AI, ambitious thinking, startups, and long-term impact.
     Example questions: "What do you think AI will look like in 10 years and how are you preparing?", "What's a contrarian belief you hold about the future of technology?", "If you were starting a company today, what problem would you solve and why?"
     Be calm, curious, and intellectually rigorous. React with "That's a good point" or "I'd push back on that a bit."
     One question per message. Stay fully in character as Sam Altman.`,

  'Mel Robbins':
    `You are Mel Robbins conducting a motivational and behavioral interview.
     Ask questions about habits, confidence, taking action, and overcoming fear.
     Example questions: "Tell me about a moment you almost gave up — what made you push through?", "What's one habit that has changed your life?", "How do you handle self-doubt when it shows up at work?"
     Be energetic, encouraging, and direct. React with "I love that!" or "That's so real, keep going."
     One question per message. Stay fully in character as Mel Robbins.`,

  'SWE — Amazon':
    `You are a Senior Software Engineer at Amazon conducting a technical interview using Amazon Leadership Principles.
     Ask questions about system design, coding, scalability, and leadership principles like ownership, bias for action, and customer obsession.
     Example questions: "Design a URL shortener that handles 100M requests/day.", "Tell me about a time you took ownership of a failing project.", "How would you design Amazon's recommendation engine?"
     Be precise and structured. Ask follow-up probes like "What's the time complexity?" or "How would this scale?"
     One question per message. Stay fully in character as an Amazon SWE interviewer.`,

  'SWE — Oracle':
    `You are a Senior Software Engineer at Oracle conducting a technical interview.
     Focus on databases, Java, enterprise architecture, and problem-solving.
     Example questions: "Explain the difference between clustered and non-clustered indexes.", "How would you optimize a slow SQL query on a 500M row table?", "Design a multi-tenant SaaS database schema."
     Be methodical and detail-oriented. React with "Good, now what if the dataset is 10x larger?" or "Walk me through your indexing strategy."
     One question per message. Stay fully in character as an Oracle SWE interviewer.`,

  'SWE — Microsoft':
    `You are a Senior Software Engineer at Microsoft conducting a technical interview.
     Focus on algorithms, data structures, Azure cloud, and collaborative engineering.
     Example questions: "Implement a LRU cache from scratch.", "How would you architect a real-time collaborative document editor like Word Online?", "Tell me about a time you disagreed with a technical decision and how you handled it."
     Be collaborative and thorough. React with "Interesting approach, what are the tradeoffs?" or "Can you think of an edge case?"
     One question per message. Stay fully in character as a Microsoft SWE interviewer.`,
};

export default function ChatInterview() {
  const location = useLocation();
  const navigate = useNavigate();
  const { interviewer } = location.state as { interviewer: { name: string; subtitle: string; avatar: string } };

  const [messages, setMessages]         = useState<Message[]>([]);
  const [input, setInput]               = useState('');
  const [loading, setLoading]           = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [finished, setFinished]         = useState(false);
  const bottomRef                       = useRef<HTMLDivElement>(null);
  const hasStarted                      = useRef(false);
  const MAX_QUESTIONS                   = 6;

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    askNextQuestion([], true);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const buildHistory = (msgs: Message[]) =>
    msgs.map(m => ({ role: m.role === 'interviewer' ? 'assistant' : 'user', content: m.text }));

  const askNextQuestion = async (history: Message[], isOpening = false) => {
    setLoading(true);
    const persona = personaPrompts[interviewer.name] || personaPrompts['Standard Interviewer'];
    const systemPrompt = `${persona}

RULES YOU MUST FOLLOW:
- You are conducting a mock interview with exactly ${MAX_QUESTIONS} questions total.
- ${isOpening
      ? 'Start with a short in-character greeting (1-2 sentences), then immediately ask your first interview question.'
      : "Give a very brief in-character reaction to the candidate's last answer (1 sentence max), then ask your next interview question."}
- NEVER number questions. NEVER say "Question X of Y".
- NEVER break character.
- Keep each message concise: reaction + one question only.
- Questions must feel like they genuinely come from this specific person's personality and domain.`;

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemPrompt, messages: buildHistory(history) }),
      });
      const data = await res.json();
      const reply = data.reply || 'Thank you for your answer. Let me think of the next question...';
      setMessages(prev => [...prev, { role: 'interviewer', text: reply }]);
      setQuestionCount(prev => prev + 1);
    } catch {
      setMessages(prev => [...prev, { role: 'interviewer', text: 'Sorry, I had trouble connecting. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading || finished) return;
    const userMsg: Message = { role: 'user', text: input.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');

    if (questionCount >= MAX_QUESTIONS) {
      setFinished(true);
      setMessages(prev => [...prev, {
        role: 'interviewer',
        text: `That wraps up our interview! You answered all ${MAX_QUESTIONS} questions. Great job! I'll now prepare your evaluation.`,
      }]);
      return;
    }
    await askNextQuestion(updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={18} /> Back
        </button>
        <div className={styles.interviewerInfo}>
          <img src={interviewer.avatar} alt={interviewer.name} className={styles.headerAvatar} />
          <div>
            <p className={styles.headerName}>{interviewer.name}</p>
            <p className={styles.headerSub}>{interviewer.subtitle}</p>
          </div>
        </div>
        <div className={styles.progress}>
          <span className={styles.progressText}>{Math.min(questionCount, MAX_QUESTIONS)} / {MAX_QUESTIONS} Questions</span>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${(Math.min(questionCount, MAX_QUESTIONS) / MAX_QUESTIONS) * 100}%` }} />
          </div>
        </div>
      </header>

      <div className={styles.chatArea}>
        {messages.map((msg, i) => (
          <div key={i} className={`${styles.msgRow} ${msg.role === 'user' ? styles.userRow : styles.interviewerRow}`}>
            {msg.role === 'interviewer' && (
              <img src={interviewer.avatar} alt={interviewer.name} className={styles.msgAvatar} />
            )}
            <div className={`${styles.bubble} ${msg.role === 'user' ? styles.userBubble : styles.interviewerBubble}`}>
              {msg.text}
            </div>
            {msg.role === 'user' && <div className={styles.userAvatar}>You</div>}
          </div>
        ))}

        {loading && (
          <div className={`${styles.msgRow} ${styles.interviewerRow}`}>
            <img src={interviewer.avatar} alt={interviewer.name} className={styles.msgAvatar} />
            <div className={`${styles.bubble} ${styles.interviewerBubble} ${styles.typingBubble}`}>
              <Loader2 size={16} className={styles.spinner} />
              <span>{interviewer.name} is typing...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className={styles.inputArea}>
        {finished ? (
          <button className={styles.finishBtn} onClick={() => navigate('/')}>View Results →</button>
        ) : (
          <>
            <textarea className={styles.input} placeholder="Type your answer... (Enter to send)"
              value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} rows={2} disabled={loading} />
            <button className={styles.sendBtn} onClick={handleSend} disabled={!input.trim() || loading}>
              <Send size={18} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
