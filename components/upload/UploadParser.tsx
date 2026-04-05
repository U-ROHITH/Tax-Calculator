'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  Info,
  Loader2,
} from 'lucide-react';

type UploadType = 'form16' | 'ais';

interface ExtractedFields {
  grossSalary: number | null;
  basicSalary: number | null;
  hra: number | null;
  standardDeduction: number | null;
  professionalTax: number | null;
  tdsDeducted: number | null;
  deduction80C: number | null;
  deduction80D: number | null;
  employerName: string | null;
  pan: string | null;
  assessmentYear: string | null;
}

const FIELD_META: { key: keyof ExtractedFields; label: string; isNumeric: boolean }[] = [
  { key: 'employerName', label: 'Employer Name', isNumeric: false },
  { key: 'pan', label: 'PAN', isNumeric: false },
  { key: 'assessmentYear', label: 'Assessment Year', isNumeric: false },
  { key: 'grossSalary', label: 'Gross Salary', isNumeric: true },
  { key: 'basicSalary', label: 'Basic Salary', isNumeric: true },
  { key: 'hra', label: 'HRA Received', isNumeric: true },
  { key: 'standardDeduction', label: 'Standard Deduction', isNumeric: true },
  { key: 'professionalTax', label: 'Professional Tax', isNumeric: true },
  { key: 'tdsDeducted', label: 'TDS Deducted', isNumeric: true },
  { key: 'deduction80C', label: '80C Deductions', isNumeric: true },
  { key: 'deduction80D', label: '80D Deductions', isNumeric: true },
];

function formatValue(val: number | string | null, isNumeric: boolean): string {
  if (val === null || val === undefined) return '—';
  if (isNumeric && typeof val === 'number') {
    return '₹' + val.toLocaleString('en-IN');
  }
  return String(val);
}

export default function UploadParser() {
  const [uploadType, setUploadType] = useState<UploadType>('form16');
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [extracted, setExtracted] = useState<ExtractedFields | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<Set<string>>(new Set());
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-check fields that are found
  useEffect(() => {
    if (extracted) {
      const foundKeys = FIELD_META
        .filter(({ key }) => extracted[key] !== null)
        .map(({ key }) => key);
      setConfirmed(new Set(foundKeys));
    }
  }, [extracted]);

  const handleFile = useCallback((f: File) => {
    if (!f.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF files are accepted.');
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError('File exceeds 5MB limit.');
      return;
    }
    setFile(f);
    setError(null);
    setExtracted(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile],
  );

  const handleParse = async () => {
    if (!file) return;
    setParsing(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/parse-pdf', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Failed to parse PDF.');
        return;
      }
      setExtracted(json.extracted as ExtractedFields);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setParsing(false);
    }
  };

  const toggleConfirm = (key: string) => {
    setConfirmed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const confirmedEntries = extracted
    ? FIELD_META.filter(({ key }) => confirmed.has(key) && extracted[key] !== null)
    : [];

  const handlePrefill = () => {
    if (!extracted) return;
    const values: Record<string, number | string> = {};
    for (const { key, isNumeric } of FIELD_META) {
      if (!confirmed.has(key) || extracted[key] === null) continue;
      const val = extracted[key];
      if (isNumeric && typeof val === 'number') {
        // Map extracted keys to IndiaForm field names
        if (key === 'deduction80C') values['section80C'] = val;
        else if (key === 'deduction80D') values['section80D_self'] = val;
        else values[key] = val;
      }
    }
    const payload = { timestamp: Date.now(), values };
    localStorage.setItem('taxcalc_prefill', JSON.stringify(payload));
    window.open('/in', '_blank');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl" style={{ color: 'var(--text-primary)' }}>
          Upload Form 16 / AIS
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Auto-extract salary, TDS, and deductions — pre-fill the India tax calculator instantly.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* ── Left Panel ── */}
        <div className="space-y-5">

          {/* Document Type Selector */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Document Type
            </p>
            <div className="grid grid-cols-2 gap-3">
              {/* Form 16 card */}
              <button
                type="button"
                onClick={() => setUploadType('form16')}
                className={`rounded-xl p-4 text-left transition-colors border-l-4 ${
                  uploadType === 'form16' ? 'border border-[var(--india)]' : 'border border-[var(--border)]'
                }`}
                style={{
                  background: uploadType === 'form16' ? 'var(--surface-raised)' : 'var(--surface)',
                  borderLeftColor: 'var(--india)',
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-4 w-4" style={{ color: 'var(--india)' }} />
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Form 16</span>
                  {uploadType === 'form16' && (
                    <CheckCircle2 className="h-3.5 w-3.5 ml-auto" style={{ color: 'var(--india)' }} />
                  )}
                </div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Salary TDS certificate from employer. Part A + Part B.
                </p>
              </button>

              {/* AIS / 26AS card */}
              <button
                type="button"
                onClick={() => setUploadType('ais')}
                className={`rounded-xl p-4 text-left transition-colors border-l-4 ${
                  uploadType === 'ais' ? 'border border-[var(--primary)]' : 'border border-[var(--border)]'
                }`}
                style={{
                  background: uploadType === 'ais' ? 'var(--surface-raised)' : 'var(--surface)',
                  borderLeftColor: 'var(--primary)',
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-4 w-4" style={{ color: 'var(--primary)' }} />
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>AIS / 26AS</span>
                  {uploadType === 'ais' && (
                    <CheckCircle2 className="h-3.5 w-3.5 ml-auto" style={{ color: 'var(--primary)' }} />
                  )}
                </div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Annual Information Statement from IT portal.
                </p>
              </button>
            </div>
          </div>

          {/* Dropzone */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Upload PDF
            </p>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors"
              style={{
                borderColor: dragOver ? 'var(--primary)' : 'var(--border)',
                background: dragOver ? 'var(--surface-raised)' : 'var(--surface)',
              }}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8" style={{ color: 'var(--primary)' }} />
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{file.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {(file.size / 1024).toFixed(1)} KB — click to change
                  </p>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFile(null); setExtracted(null); setError(null); }}
                    className="flex items-center gap-1 text-xs mt-1 px-2 py-1 rounded-lg border transition-colors"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                  >
                    <X className="h-3 w-3" /> Remove
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8" style={{ color: 'var(--text-muted)' }} />
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    Drag &amp; drop your PDF here
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    or click to browse — PDF only, max 5 MB
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-2 flex items-center gap-2 text-xs px-3 py-2 rounded-lg" style={{ background: 'color-mix(in srgb, var(--danger) 10%, transparent)', color: 'var(--danger)' }}>
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="button"
              disabled={!file || parsing}
              onClick={handleParse}
              className="mt-3 w-full h-10 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-opacity disabled:opacity-40"
              style={{ background: 'var(--primary)', color: '#fff' }}
            >
              {parsing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Parsing…
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  Parse Document
                </>
              )}
            </button>
          </div>

          {/* Extracted Fields Table */}
          {extracted && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Extracted Fields
              </p>
              <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ background: 'var(--surface-raised)' }}>
                      <th className="text-left px-3 py-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>Field</th>
                      <th className="text-right px-3 py-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>Value</th>
                      <th className="text-center px-3 py-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>Status</th>
                      <th className="text-center px-3 py-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>Use</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FIELD_META.map(({ key, label, isNumeric }, i) => {
                      const val = extracted[key];
                      const found = val !== null;
                      return (
                        <tr
                          key={key}
                          style={{ background: i % 2 === 0 ? 'var(--surface)' : 'var(--surface-raised)', borderTop: '1px solid var(--border)' }}
                        >
                          <td className="px-3 py-2.5" style={{ color: 'var(--text-primary)' }}>{label}</td>
                          <td className={`px-3 py-2.5 text-right num font-medium ${found ? '' : ''}`} style={{ color: found ? 'var(--success)' : 'var(--text-muted)' }}>
                            {formatValue(val, isNumeric)}
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            {found ? (
                              <span className="inline-flex items-center gap-1" style={{ color: 'var(--success)' }}>
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Found
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1" style={{ color: 'var(--warning)' }}>
                                <AlertCircle className="h-3.5 w-3.5" />
                                Not detected
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            <input
                              type="checkbox"
                              checked={confirmed.has(key)}
                              disabled={!found}
                              onChange={() => toggleConfirm(key)}
                              className="rounded"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Limitations Notice */}
          <div className="rounded-xl border p-4 space-y-2" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
            <div className="flex items-center gap-2 mb-1">
              <Info className="h-4 w-4 shrink-0" style={{ color: 'var(--text-muted)' }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Supported Formats</span>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Form 16 formats vary by employer. Common formats (Traces, TallyPrime, SAP, Keka, Darwinbox) are supported.
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              For best results, use the original PDF from your employer, not a scanned copy.
            </p>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="space-y-5">

          {/* Pre-fill Summary */}
          {extracted ? (
            <div className="rounded-xl border p-5 space-y-4" style={{ borderColor: 'var(--india)', background: 'var(--surface)' }}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" style={{ color: 'var(--india)' }} />
                <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Ready to pre-fill India Calculator
                </h2>
              </div>

              {confirmedEntries.length === 0 ? (
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  No fields confirmed. Check the boxes in the table to select fields.
                </p>
              ) : (
                <ul className="space-y-2">
                  {confirmedEntries.map(({ key, label, isNumeric }) => (
                    <li key={key} className="flex items-center justify-between text-xs">
                      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                      <span className="num font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {formatValue(extracted[key], isNumeric)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <button
                type="button"
                disabled={confirmedEntries.length === 0}
                onClick={handlePrefill}
                className="w-full h-10 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-opacity disabled:opacity-40"
                style={{ background: 'var(--india)', color: '#fff' }}
              >
                Open India Calculator with these values
                <ArrowRight className="h-4 w-4" />
              </button>

              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                The India calculator will auto-load these values if you open it within 10 minutes.
              </p>
            </div>
          ) : (
            <div
              className="rounded-xl border-2 border-dashed flex flex-col items-center justify-center min-h-64 p-8 text-center"
              style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
            >
              <FileText className="h-10 w-10 mb-3" style={{ color: 'var(--text-muted)' }} />
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Upload and parse a PDF to see extracted fields here
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                Confirmed fields will be pre-filled in the India calculator
              </p>
            </div>
          )}

          {/* Disclaimer */}
          <div
            className="rounded-xl border p-4"
            style={{
              background: 'color-mix(in srgb, var(--warning) 10%, transparent)',
              borderColor: 'color-mix(in srgb, var(--warning) 30%, transparent)',
            }}
          >
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: 'var(--warning)' }} />
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                <span className="font-semibold">Important:</span> PDF parsing uses pattern matching and may not detect
                all fields correctly. Always verify extracted values against your original Form 16 before filing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
