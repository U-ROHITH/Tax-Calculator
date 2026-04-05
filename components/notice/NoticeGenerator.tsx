'use client';

import { useState, useRef, useCallback } from 'react';
import {
  FileText,
  Copy,
  Printer,
  AlertTriangle,
  ChevronDown,
  Check,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────

type NoticeTypeKey =
  | '143(1)'
  | '143(2)'
  | '148'
  | '148A'
  | '245'
  | '156'
  | '131'
  | '271'
  | '263'
  | 'other';

type Severity = 'Low' | 'Medium' | 'High';

interface NoticeTypeInfo {
  label: string;
  shortDesc: string;
  deadline: string;
  severity: Severity;
}

// ── Notice type metadata ───────────────────────────────────────────────────────

const NOTICE_TYPES: Record<NoticeTypeKey, NoticeTypeInfo> = {
  '143(1)': {
    label: 'Intimation u/s 143(1) — Demand / Refund adjustment',
    shortDesc: 'Automated intimation processing your return — may raise demand or adjust refund.',
    deadline: '30 days from date of intimation',
    severity: 'Low',
  },
  '143(2)': {
    label: 'Scrutiny Notice — Return selected for detailed assessment',
    shortDesc: 'Your return has been picked for detailed scrutiny by an Assessing Officer.',
    deadline: '30 days (or as specified in the notice)',
    severity: 'High',
  },
  '148': {
    label: 'Notice u/s 148 — Income escaped assessment',
    shortDesc: 'Department believes income has escaped assessment; re-opens an earlier year.',
    deadline: '30 days from date of notice',
    severity: 'High',
  },
  '148A': {
    label: 'Show Cause Notice before 148',
    shortDesc: 'Pre-notice inquiry — you must show cause why proceedings should not be initiated.',
    deadline: '7 days (or as specified)',
    severity: 'High',
  },
  '245': {
    label: 'Refund adjusted against old demand',
    shortDesc: 'Your pending refund is being adjusted against an outstanding tax demand.',
    deadline: '30 days to agree or dispute the adjustment',
    severity: 'Medium',
  },
  '156': {
    label: 'Notice of Demand (after assessment order)',
    shortDesc: 'Formal demand for payment of tax/interest/penalty after an assessment order.',
    deadline: '30 days from date of service',
    severity: 'High',
  },
  '131': {
    label: 'Summons for information / documents',
    shortDesc: 'Department requires you to appear or produce specific documents/information.',
    deadline: 'As stated in the summons',
    severity: 'Medium',
  },
  '271': {
    label: 'Penalty proceedings',
    shortDesc: 'Penalty may be levied for concealment of income or furnishing inaccurate particulars.',
    deadline: '30 days (or as stated)',
    severity: 'High',
  },
  '263': {
    label: 'Revision by CIT',
    shortDesc: 'Commissioner of Income Tax is revising an order believed to be erroneous or prejudicial.',
    deadline: '30 days from notice date',
    severity: 'High',
  },
  other: {
    label: 'Other / Not sure',
    shortDesc: 'Describe your notice in detail and the AI will identify it and guide you.',
    deadline: 'Refer to the notice',
    severity: 'Medium',
  },
};

// ── Common notices table ──────────────────────────────────────────────────────

const COMMON_NOTICES_TABLE = [
  {
    section: '143(1)',
    what: 'Automated intimation after return processing',
    deadline: '30 days',
    action: 'Check computation; pay demand or claim refund',
  },
  {
    section: '143(2)',
    what: 'Scrutiny — return selected for detailed review',
    deadline: '30 days',
    action: 'Compile all documents; strongly consider hiring a CA',
  },
  {
    section: '148',
    what: 'Re-opening of assessment for escaped income',
    deadline: '30 days',
    action: 'File return for that year; engage a CA immediately',
  },
  {
    section: '245',
    what: 'Refund adjusted against outstanding demand',
    deadline: '30 days',
    action: 'Verify demand; agree or dispute via ITD portal',
  },
  {
    section: '156',
    what: 'Demand notice after assessment order',
    deadline: '30 days',
    action: 'Pay or appeal (CIT(A)) within deadline',
  },
  {
    section: '271',
    what: 'Penalty proceedings for concealment',
    deadline: '30 days',
    action: 'Respond with explanation; engage a CA',
  },
];

const ASSESSMENT_YEARS = [
  'AY 2024-25',
  'AY 2023-24',
  'AY 2022-23',
  'AY 2021-22',
  'AY 2020-21',
];

const SEVERITY_STYLES: Record<Severity, string> = {
  Low: 'bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/30',
  Medium: 'bg-[var(--warning)]/10 text-[var(--warning)] border border-[var(--warning)]/30',
  High: 'bg-[var(--danger)]/10 text-[var(--danger)] border border-[var(--danger)]/30',
};

// ── Markdown renderer ─────────────────────────────────────────────────────────

function boldify(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-[var(--text-primary)]">$1</strong>');
}

function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  const nodes: React.ReactNode[] = [];
  let listItems: string[] = [];
  let key = 0;

  const flushList = () => {
    if (listItems.length === 0) return;
    nodes.push(
      <ul key={key++} className="mb-3 space-y-1 pl-4">
        {listItems.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm text-[var(--text-secondary)]">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-sm bg-[var(--text-muted)]" />
            <span dangerouslySetInnerHTML={{ __html: boldify(item) }} />
          </li>
        ))}
      </ul>,
    );
    listItems = [];
  };

  for (const raw of lines) {
    if (/^## /.test(raw)) {
      flushList();
      nodes.push(
        <h3 key={key++} className="mt-5 mb-1.5 text-sm font-bold text-[var(--text-primary)]">
          {raw.replace(/^## /, '')}
        </h3>,
      );
    } else if (/^### /.test(raw)) {
      flushList();
      nodes.push(
        <h4
          key={key++}
          className="mt-3 mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]"
        >
          {raw.replace(/^### /, '')}
        </h4>,
      );
    } else if (/^[-*] /.test(raw)) {
      listItems.push(raw.replace(/^[-*] /, ''));
    } else if (/^\d+\. /.test(raw)) {
      listItems.push(raw.replace(/^\d+\. /, ''));
    } else if (raw.trim() === '') {
      flushList();
    } else {
      flushList();
      nodes.push(
        <p
          key={key++}
          className="mb-2 text-sm text-[var(--text-secondary)]"
          dangerouslySetInnerHTML={{ __html: boldify(raw) }}
        />,
      );
    }
  }
  flushList();
  return nodes;
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[80, 60, 95, 50, 70, 40, 85, 55].map((w, i) => (
        <div
          key={i}
          className="h-3 rounded bg-[var(--surface-raised)]"
          style={{ width: `${w}%` }}
        />
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function NoticeGenerator() {
  const [noticeType, setNoticeType] = useState<NoticeTypeKey | ''>('');
  const [assessmentYear, setAssessmentYear] = useState('');
  const [taxpayerName, setTaxpayerName] = useState('');
  const [noticeDetails, setNoticeDetails] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const responseRef = useRef<HTMLDivElement>(null);

  const typeInfo = noticeType ? NOTICE_TYPES[noticeType] : null;
  const charCount = noticeDetails.length;
  const canGenerate = noticeType !== '' && noticeDetails.trim().length > 10;

  const handleGenerate = useCallback(async () => {
    if (!canGenerate) return;
    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/notice-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noticeType, noticeDetails, taxpayerName, assessmentYear }),
      });

      if (!res.ok || !res.body) throw new Error('Request failed');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setResponse(accumulated);
      }
    } catch {
      setResponse('## Error\nFailed to generate draft. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [canGenerate, noticeType, noticeDetails, taxpayerName, assessmentYear]);

  const extractDraftLetter = useCallback((): string => {
    const match = response.match(/## 4\. Draft Response Letter([\s\S]*?)(?=## 5\.|$)/);
    return match ? match[1].trim() : response;
  }, [response]);

  const handleCopy = useCallback(async () => {
    const text = extractDraftLetter();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [extractDraftLetter]);

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 py-8">
      {/* Page header */}
      <div className="mx-auto mb-8 max-w-6xl">
        <div className="flex items-center gap-3 mb-1">
          <FileText className="h-5 w-5 text-[var(--primary)]" />
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">
            IT Notice Response Generator
          </h1>
        </div>
        <p className="text-sm text-[var(--text-secondary)] ml-8">
          Describe the notice you received and get an AI-generated explanation with a structured draft response letter.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="mx-auto max-w-6xl flex flex-col lg:flex-row gap-6 items-start">

        {/* ── Left panel: form ─────────────────────────────────────────────── */}
        <div className="w-full lg:w-[480px] shrink-0 space-y-4">

          {/* Section 1: Notice Details */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              Notice Details
            </h2>

            {/* Notice type */}
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
                Notice Type <span className="text-[var(--danger)]">*</span>
              </label>
              <div className="relative">
                <select
                  value={noticeType}
                  onChange={(e) => setNoticeType(e.target.value as NoticeTypeKey | '')}
                  className="w-full appearance-none rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 pr-8 text-sm text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none"
                >
                  <option value="">Select notice type...</option>
                  {(Object.entries(NOTICE_TYPES) as [NoticeTypeKey, NoticeTypeInfo][]).map(
                    ([key, info]) => (
                      <option key={key} value={key}>
                        {info.label}
                      </option>
                    ),
                  )}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
              </div>
            </div>

            {/* Assessment Year */}
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
                Assessment Year
              </label>
              <div className="relative">
                <select
                  value={assessmentYear}
                  onChange={(e) => setAssessmentYear(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 pr-8 text-sm text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none"
                >
                  <option value="">Select assessment year...</option>
                  {ASSESSMENT_YEARS.map((ay) => (
                    <option key={ay} value={ay}>
                      {ay}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
              </div>
            </div>

            {/* Taxpayer name */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
                Your Name
              </label>
              <input
                type="text"
                value={taxpayerName}
                onChange={(e) => setTaxpayerName(e.target.value)}
                placeholder="Optional — used in draft letter"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none"
              />
            </div>
          </div>

          {/* Section 2: Situation description */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              Describe Your Situation
            </h2>
            <label className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
              What does the notice say? <span className="text-[var(--danger)]">*</span>
            </label>
            <textarea
              rows={6}
              value={noticeDetails}
              onChange={(e) => setNoticeDetails(e.target.value.slice(0, 1000))}
              placeholder={`E.g.: "I received a 143(1) notice saying my TDS credit of \u20b945,000 from Form 26AS doesn't match my return. I had claimed \u20b945,000 TDS from my employer but the notice shows only \u20b930,000 was credited."`}
              className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none"
            />
            <div className="mt-1.5 text-right text-xs text-[var(--text-muted)]">
              {charCount} / 1000 characters
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={!canGenerate || loading}
            className="w-full rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? 'Generating...' : 'Generate Response Draft'}
          </button>

          {/* Notice type info card — shown when a type is selected */}
          {typeInfo && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[var(--text-primary)]">
                  Section {noticeType}
                </span>
                <span
                  className={`rounded-md px-2 py-0.5 text-xs font-semibold ${SEVERITY_STYLES[typeInfo.severity]}`}
                >
                  {typeInfo.severity}
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">{typeInfo.shortDesc}</p>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-medium text-[var(--text-secondary)]">Typical deadline:</span>
                <span className="text-[var(--text-muted)]">{typeInfo.deadline}</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Right panel: results ─────────────────────────────────────────── */}
        <div className="w-full min-w-0 flex-1 space-y-4">

          {/* Disclaimer banner — always visible */}
          <div className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-4 py-3 flex gap-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--danger)]" />
            <p className="text-xs text-[var(--danger)]">
              <strong>Important:</strong> This is an AI-generated draft for guidance only. Do not submit without review by a qualified CA. Incorrect responses to IT notices can result in penalties.
            </p>
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <Skeleton />
            </div>
          )}

          {/* Generated response */}
          {!loading && response && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
              {/* Header row */}
              <div className="mb-4 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[var(--primary)]" />
                  <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                    Response Analysis
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-[var(--success)]" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    {copied ? 'Copied' : 'Copy Draft Letter'}
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    Print
                  </button>
                </div>
              </div>

              {/* Rendered markdown */}
              <div ref={responseRef}>
                {renderMarkdown(response)}
              </div>
            </div>
          )}

          {/* Empty state — common notices reference table */}
          {!loading && !response && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <h2 className="mb-4 text-sm font-semibold text-[var(--text-primary)]">
                Common IT Notices — Quick Reference
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      <th className="py-2 pr-4 text-left font-semibold text-[var(--text-muted)]">
                        Section
                      </th>
                      <th className="py-2 pr-4 text-left font-semibold text-[var(--text-muted)]">
                        What It Is
                      </th>
                      <th className="py-2 pr-4 text-left font-semibold text-[var(--text-muted)]">
                        Typical Deadline
                      </th>
                      <th className="py-2 text-left font-semibold text-[var(--text-muted)]">
                        Action Needed
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMMON_NOTICES_TABLE.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-[var(--border)] last:border-0"
                      >
                        <td className="py-2.5 pr-4 font-semibold text-[var(--primary)]">
                          {row.section}
                        </td>
                        <td className="py-2.5 pr-4 text-[var(--text-secondary)]">
                          {row.what}
                        </td>
                        <td className="py-2.5 pr-4 text-[var(--text-secondary)] whitespace-nowrap">
                          {row.deadline}
                        </td>
                        <td className="py-2.5 text-[var(--text-secondary)]">
                          {row.action}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3">
                <p className="text-xs text-[var(--text-muted)]">
                  Select a notice type and describe your situation on the left to generate a personalised explanation and draft response letter.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
