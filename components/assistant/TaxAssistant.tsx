'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Loader2, AlertTriangle } from 'lucide-react';

type Message = { role: 'user' | 'assistant'; content: string };

const SUGGESTED_QUESTIONS = [
  'Can I claim both HRA and home loan interest deductions?',
  'What is the difference between old and new tax regime in India?',
  'How is LTCG on equity mutual funds taxed after Budget 2024?',
  'My employer gave me ESOPs. When do I pay tax on them?',
  'What is the 60% tax trap in the UK?',
  'Can I deduct home office expenses in the US?',
  'What documents do I need if I get a Section 143(1) notice?',
  'How does the NPS 80CCD(1B) deduction work?',
];

const COUNTRY_OPTIONS: { value: 'IN' | 'US' | 'UK' | 'ALL'; label: string; shortLabel: string }[] = [
  { value: 'IN', label: 'India', shortLabel: 'India' },
  { value: 'US', label: 'United States', shortLabel: 'US' },
  { value: 'UK', label: 'United Kingdom', shortLabel: 'UK' },
  { value: 'ALL', label: 'All Countries', shortLabel: 'All' },
];

function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  const nodes: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Heading lines: # heading
    if (/^#{1,3}\s+/.test(line)) {
      const content = line.replace(/^#{1,3}\s+/, '');
      nodes.push(
        <p key={key++} className="font-semibold text-sm mt-3 mb-1 text-[var(--text-primary)]">
          {renderInline(content)}
        </p>
      );
      continue;
    }

    // Empty line — spacer
    if (line.trim() === '') {
      if (i > 0 && lines[i - 1].trim() !== '') {
        nodes.push(<br key={key++} />);
      }
      continue;
    }

    // Bullet lines
    if (/^[-*]\s+/.test(line)) {
      const content = line.replace(/^[-*]\s+/, '');
      nodes.push(
        <p key={key++} className="flex gap-1.5 text-sm leading-relaxed">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--text-muted)]" />
          <span>{renderInline(content)}</span>
        </p>
      );
      continue;
    }

    // Normal paragraph line
    nodes.push(
      <p key={key++} className="text-sm leading-relaxed">
        {renderInline(line)}
      </p>
    );
  }

  return nodes;
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default function TaxAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState<'IN' | 'US' | 'UK' | 'ALL'>('IN');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const adjustTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const lineHeight = 24;
    const maxHeight = lineHeight * 4 + 16;
    el.style.height = Math.min(el.scrollHeight, maxHeight) + 'px';
  };

  const send = async (text?: string) => {
    const query = text ?? input;
    if (!query.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: query };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setLoading(true);

    // Add empty assistant message for streaming
    setMessages(m => [...m, { role: 'assistant', content: '' }]);

    try {
      const res = await fetch('/api/tax-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, country }),
      });

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let full = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value);
        setMessages(m => [...m.slice(0, -1), { role: 'assistant', content: full }]);
      }
    } catch {
      setMessages(m => [
        ...m.slice(0, -1),
        { role: 'assistant', content: 'Sorry, there was an error processing your request. Please try again.' },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 3.5rem)' }}>
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)]/10">
              <Bot className="h-4 w-4 text-[var(--primary)]" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-[var(--text-primary)] leading-none">Tax Assistant</h1>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Powered by Claude — India, US, UK</p>
            </div>
          </div>

          {/* Country selector */}
          <div className="flex gap-1 rounded-lg border border-[var(--border)] bg-[var(--background)] p-0.5">
            {COUNTRY_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setCountry(opt.value)}
                className={[
                  'flex-1 rounded-md px-2 py-1.5 text-xs transition-all duration-150',
                  country === opt.value
                    ? 'bg-[var(--surface-raised)] border border-[var(--border)] font-semibold text-[var(--text-primary)] shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]',
                ].join(' ')}
              >
                <span className="hidden sm:inline">{opt.label}</span>
                <span className="sm:hidden">{opt.shortLabel}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="border-b border-[var(--border)] bg-[var(--surface)] px-4 py-2">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-start gap-2 rounded-lg border border-[var(--warning)]/30 bg-[var(--warning)]/10 px-4 py-2">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--warning)]" />
            <p className="text-xs text-[var(--text-secondary)]">
              AI responses are for informational purposes only and do not constitute professional tax advice.
              Verify all information with a qualified CA, CPA, or tax advisor.
            </p>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto max-w-3xl">
          {isEmpty ? (
            /* Welcome state */
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)]">
                <Bot className="h-7 w-7 text-[var(--primary)]" />
              </div>
              <h2 className="mb-2 text-lg font-semibold text-[var(--text-primary)]">
                Ask me anything about tax
              </h2>
              <p className="mb-8 max-w-md text-sm text-[var(--text-secondary)]">
                I can explain tax sections, deductions, capital gains rules, notices, and more across India, US, and UK.
              </p>

              {/* Suggested questions */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 w-full max-w-2xl">
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => send(q)}
                    className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-left text-xs text-[var(--text-secondary)] transition-all duration-150 hover:border-[var(--primary)]/40 hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Message list */
            <div className="flex flex-col gap-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={['flex', msg.role === 'user' ? 'justify-end' : 'justify-start'].join(' ')}
                >
                  {msg.role === 'assistant' && (
                    <div className="mr-2 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[var(--primary)]/10">
                      <Bot className="h-3.5 w-3.5 text-[var(--primary)]" />
                    </div>
                  )}
                  <div
                    className={
                      msg.role === 'user'
                        ? 'bg-[var(--primary)] text-white rounded-xl rounded-br-sm px-4 py-3 max-w-[75%] ml-auto'
                        : 'bg-[var(--surface-raised)] border border-[var(--border)] rounded-xl rounded-bl-sm px-4 py-3 max-w-[80%]'
                    }
                  >
                    {msg.role === 'user' ? (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    ) : msg.content === '' && loading ? (
                      <div className="flex items-center gap-2 py-1">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--text-muted)]" />
                        <span className="text-xs text-[var(--text-muted)]">Thinking...</span>
                      </div>
                    ) : (
                      <div className="space-y-1 text-[var(--text-primary)]">
                        {renderMarkdown(msg.content)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Suggested questions strip (shown after first message but empty) - not needed per spec */}

      {/* Input bar */}
      <div className="border-t border-[var(--border)] bg-[var(--surface)] px-4 py-3">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-end gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-3 py-2 focus-within:border-[var(--primary)]/50 transition-colors">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={e => { setInput(e.target.value); adjustTextarea(); }}
              onKeyDown={handleKeyDown}
              placeholder="Ask a tax question... (Enter to send, Shift+Enter for new line)"
              disabled={loading}
              className="flex-1 resize-none bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none disabled:opacity-60 leading-6 py-0.5"
              style={{ maxHeight: '6rem' }}
            />
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)] text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              {loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
          <p className="mt-1.5 text-center text-xs text-[var(--text-muted)]">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
