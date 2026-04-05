'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, Send, User, AlertTriangle, ChevronRight } from 'lucide-react';

// ---------- Types ----------

type Country = 'IN' | 'US' | 'UK' | 'ALL';
type Role = 'user' | 'assistant';

interface Message {
  role: Role;
  content: string;
}

interface SuggestedQuestion {
  text: string;
  countries: Country[];
}

// ---------- Constants ----------

const MAX_CHARS = 500;

const COUNTRY_OPTIONS: { value: Country; label: string; accentVar: string }[] = [
  { value: 'IN', label: 'India', accentVar: '--india' },
  { value: 'US', label: 'United States', accentVar: '--us' },
  { value: 'UK', label: 'United Kingdom', accentVar: '--uk' },
  { value: 'ALL', label: 'All Countries', accentVar: '--primary' },
];

const SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
  // India
  { text: 'What is the 87A rebate limit for FY 2025-26?', countries: ['IN'] },
  { text: 'Should I choose old or new tax regime?', countries: ['IN'] },
  { text: 'How is LTCG on equity taxed after Budget 2024?', countries: ['IN'] },
  { text: 'How does NPS 80CCD(1B) deduction work?', countries: ['IN'] },
  // US
  { text: 'How is self-employment tax calculated?', countries: ['US'] },
  { text: 'What is the QBI deduction?', countries: ['US'] },
  { text: 'Can I deduct home office expenses?', countries: ['US'] },
  // UK
  { text: 'What is the 60% tax trap?', countries: ['UK'] },
  { text: 'How does the Personal Allowance taper work?', countries: ['UK'] },
  // All
  { text: 'How are dividends taxed across India, US, and UK?', countries: ['ALL'] },
  { text: 'What is a tax treaty and how does it affect NRIs?', countries: ['ALL', 'IN'] },
];

// ---------- Markdown renderer ----------

function renderInline(text: string): React.ReactNode {
  const segments = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return segments.map((seg, i) => {
    if (seg.startsWith('**') && seg.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-[var(--text-primary)]">
          {seg.slice(2, -2)}
        </strong>
      );
    }
    if (seg.startsWith('`') && seg.endsWith('`')) {
      return (
        <code
          key={i}
          className="rounded px-1 py-0.5 text-[0.8em] font-mono bg-[var(--border)] text-[var(--text-primary)]"
        >
          {seg.slice(1, -1)}
        </code>
      );
    }
    return seg;
  });
}

function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n');
  const nodes: React.ReactNode[] = [];
  let key = 0;
  let bulletBuffer: string[] = [];

  const flushBullets = () => {
    if (bulletBuffer.length === 0) return;
    nodes.push(
      <ul key={key++} className="my-2 space-y-1 pl-0">
        {bulletBuffer.map((b, bi) => (
          <li key={bi} className="flex gap-2 text-sm leading-relaxed text-[var(--text-primary)]">
            <span
              className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: 'var(--text-muted)' }}
            />
            <span>{renderInline(b)}</span>
          </li>
        ))}
      </ul>
    );
    bulletBuffer = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (/^#{1,3}\s+/.test(line)) {
      flushBullets();
      const content = line.replace(/^#{1,3}\s+/, '');
      const isH1 = line.startsWith('# ');
      nodes.push(
        <p
          key={key++}
          className={[
            'font-semibold text-[var(--text-primary)]',
            isH1 ? 'text-base mt-4 mb-1.5' : 'text-sm mt-3 mb-1',
          ].join(' ')}
        >
          {renderInline(content)}
        </p>
      );
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      bulletBuffer.push(line.replace(/^[-*]\s+/, ''));
      continue;
    }

    flushBullets();

    if (line.trim() === '') {
      if (i > 0 && lines[i - 1].trim() !== '') {
        nodes.push(<div key={key++} className="h-2" />);
      }
      continue;
    }

    nodes.push(
      <p key={key++} className="text-sm leading-relaxed text-[var(--text-primary)]">
        {renderInline(line)}
      </p>
    );
  }

  flushBullets();
  return <>{nodes}</>;
}

// ---------- Sub-components ----------

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-1 px-1">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="block h-1.5 w-1.5 rounded-full bg-[var(--text-muted)]"
          style={{
            animation: 'assistant-dot-bounce 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes assistant-dot-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

interface SidebarProps {
  country: Country;
  onCountryChange: (c: Country) => void;
  onQuestion: (q: string) => void;
  disabled: boolean;
}

function Sidebar({ country, onCountryChange, onQuestion, disabled }: SidebarProps) {
  const visibleQuestions = SUGGESTED_QUESTIONS.filter(
    q => country === 'ALL' || q.countries.includes(country) || q.countries.includes('ALL')
  );

  const accentVar = COUNTRY_OPTIONS.find(o => o.value === country)?.accentVar ?? '--primary';

  return (
    <aside
      className="flex flex-col border-r border-[var(--border)] bg-[var(--surface)] overflow-y-auto"
      style={{ width: '240px', minWidth: '240px' }}
    >
      {/* Sidebar header */}
      <div className="border-b border-[var(--border)] px-4 py-4">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-3">
          Tax Jurisdiction
        </p>
        <div className="flex flex-col gap-1">
          {COUNTRY_OPTIONS.map(opt => {
            const active = country === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onCountryChange(opt.value)}
                className={[
                  'flex items-center justify-between rounded-md px-3 py-2 text-xs transition-all duration-150 text-left',
                  active
                    ? 'font-semibold text-[var(--text-primary)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--surface-raised)]',
                ].join(' ')}
                style={
                  active
                    ? {
                        background: `color-mix(in srgb, var(${opt.accentVar}) 10%, transparent)`,
                        borderLeft: `2px solid var(${opt.accentVar})`,
                        paddingLeft: '10px',
                      }
                    : {}
                }
              >
                <span>{opt.label}</span>
                {active && <ChevronRight className="h-3 w-3" style={{ color: `var(${opt.accentVar})` }} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Suggested questions */}
      <div className="flex-1 px-4 py-4">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-3">
          Suggested Questions
        </p>
        <div className="flex flex-col gap-1.5">
          {visibleQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => !disabled && onQuestion(q.text)}
              disabled={disabled}
              className={[
                'group flex items-start gap-2 rounded-md px-3 py-2 text-left text-xs leading-relaxed transition-all duration-150',
                disabled
                  ? 'opacity-40 cursor-not-allowed text-[var(--text-muted)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)] cursor-pointer',
              ].join(' ')}
            >
              <span
                className="mt-1.5 h-1 w-1 shrink-0 rounded-full transition-colors"
                style={{ background: `var(${accentVar})`, opacity: 0.5 }}
              />
              {q.text}
            </button>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <div className="border-t border-[var(--border)] px-4 py-3">
        <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
          Powered by Google Gemini. Covers India, US &amp; UK tax law.
        </p>
      </div>
    </aside>
  );
}

// ---------- Main component ----------

export default function TaxAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState<Country>('IN');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const adjustTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 96) + 'px';
  }, []);

  const send = useCallback(
    async (text?: string) => {
      const query = (text ?? input).trim();
      if (!query || loading) return;

      const userMsg: Message = { role: 'user', content: query };
      const newMessages: Message[] = [...messages, userMsg];
      setMessages(newMessages);
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      setLoading(true);

      // Placeholder for streaming assistant message
      setMessages(m => [...m, { role: 'assistant', content: '' }]);

      try {
        const res = await fetch('/api/tax-assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: newMessages, country }),
        });

        if (!res.ok || !res.body) {
          const errData = await res.json().catch(() => ({ error: 'Request failed' }));
          throw new Error(errData.error ?? 'Request failed');
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          const snap = accumulated;
          setMessages(m => [...m.slice(0, -1), { role: 'assistant', content: snap }]);
        }
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : 'An error occurred. Please try again.';
        setMessages(m => [...m.slice(0, -1), { role: 'assistant', content: msg }]);
      }

      setLoading(false);
    },
    [input, loading, messages, country]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const isEmpty = messages.length === 0;
  const charsLeft = MAX_CHARS - input.length;
  const overLimit = charsLeft < 0;

  return (
    <div className="flex" style={{ height: 'calc(100vh - 3.5rem)' }}>
      {/* Left sidebar */}
      <Sidebar
        country={country}
        onCountryChange={c => setCountry(c)}
        onQuestion={q => send(q)}
        disabled={loading}
      />

      {/* Right: chat panel */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Disclaimer banner */}
        <div className="border-b border-[var(--border)] bg-[var(--surface)] px-5 py-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-[var(--warning)]" />
            <p className="text-xs text-[var(--text-secondary)]">
              AI-generated tax guidance. Verify with a qualified CA, CPA, or tax advisor before making decisions.
            </p>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {isEmpty ? (
            <EmptyState country={country} onQuestion={q => send(q)} disabled={loading} />
          ) : (
            <div className="mx-auto flex max-w-2xl flex-col gap-5">
              {messages.map((msg, i) => (
                <ChatMessage
                  key={i}
                  message={msg}
                  isStreaming={loading && i === messages.length - 1 && msg.role === 'assistant'}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="border-t border-[var(--border)] bg-[var(--surface)] px-5 py-3">
          <div className="mx-auto max-w-2xl">
            <div
              className={[
                'flex items-end gap-2 rounded-xl border bg-[var(--surface-raised)] px-3 py-2 transition-colors duration-150',
                overLimit
                  ? 'border-[var(--danger)]/60'
                  : 'border-[var(--border)] focus-within:border-[var(--primary)]/50',
              ].join(' ')}
            >
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={e => {
                  setInput(e.target.value);
                  adjustTextarea();
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask a tax question... (Enter to send, Shift+Enter for new line)"
                disabled={loading}
                maxLength={MAX_CHARS + 50} // allow slight overrun so counter is visible
                className="flex-1 resize-none bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none disabled:opacity-50 leading-6 py-0.5"
                style={{ maxHeight: '96px' }}
                aria-label="Tax question input"
              />
              <div className="flex flex-col items-end gap-1">
                <span
                  className={[
                    'text-[10px] tabular-nums',
                    overLimit ? 'text-[var(--danger)]' : charsLeft <= 80 ? 'text-[var(--warning)]' : 'text-[var(--text-muted)]',
                  ].join(' ')}
                >
                  {charsLeft}
                </span>
                <button
                  onClick={() => send()}
                  disabled={loading || !input.trim() || overLimit}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)] text-white transition-all duration-150 hover:bg-[var(--primary-hover)] disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <p className="mt-1.5 text-xs text-[var(--text-muted)]">
              Enter to send &middot; Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Chat message ----------

interface ChatMessageProps {
  message: Message;
  isStreaming: boolean;
}

function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end gap-2.5">
        <div className="max-w-[70%] rounded-xl rounded-br-sm bg-[var(--primary)] px-4 py-3">
          <p className="text-sm leading-relaxed text-white whitespace-pre-wrap">{message.content}</p>
        </div>
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-raised)]">
          <User className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start gap-2.5">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--primary)]/10">
        <Bot className="h-3.5 w-3.5 text-[var(--primary)]" />
      </div>
      <div className="max-w-[80%] rounded-xl rounded-bl-sm border border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-sm">
        {isStreaming && message.content === '' ? (
          <TypingIndicator />
        ) : (
          <div className="space-y-0.5">{renderMarkdown(message.content)}</div>
        )}
      </div>
    </div>
  );
}

// ---------- Empty state ----------

interface EmptyStateProps {
  country: Country;
  onQuestion: (q: string) => void;
  disabled: boolean;
}

function EmptyState({ country, onQuestion, disabled }: EmptyStateProps) {
  const countryLabel = COUNTRY_OPTIONS.find(o => o.value === country)?.label ?? 'Tax';

  const topQuestions = SUGGESTED_QUESTIONS.filter(
    q => country === 'ALL' || q.countries.includes(country) || q.countries.includes('ALL')
  ).slice(0, 4);

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center py-16 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)]">
        <Bot className="h-7 w-7 text-[var(--primary)]" />
      </div>
      <h2 className="mb-2 text-lg font-semibold text-[var(--text-primary)]">
        {countryLabel} Tax Assistant
      </h2>
      <p className="mb-8 max-w-md text-sm text-[var(--text-secondary)]">
        Ask any question about tax deductions, capital gains, filing, notices, and more. I cite actual tax sections.
      </p>

      <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
        {topQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => !disabled && onQuestion(q.text)}
            disabled={disabled}
            className={[
              'flex items-start gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-left text-xs leading-relaxed text-[var(--text-secondary)] transition-all duration-150',
              disabled
                ? 'opacity-40 cursor-not-allowed'
                : 'hover:border-[var(--primary)]/40 hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)] cursor-pointer',
            ].join(' ')}
          >
            <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--text-muted)]" />
            {q.text}
          </button>
        ))}
      </div>
    </div>
  );
}
