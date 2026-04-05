'use client';

import { useState } from 'react';
import { PiggyBank, TrendingUp, Calendar, Target, Info } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type ReturnProfile = 'conservative' | 'moderate' | 'aggressive';
type IRAType = 'none' | 'traditional' | 'roth';
type TabId = 'india' | 'us';

// ─── Style tokens ─────────────────────────────────────────────────────────────

const INPUT_CLASS =
  'h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30';
const LABEL_CLASS = 'block text-xs font-medium text-[var(--text-secondary)] mb-1';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function futureValueAnnuity(pmt: number, r: number, n: number): number {
  if (r === 0) return pmt * n;
  return pmt * (Math.pow(1 + r, n) - 1) / r;
}

function fmtINR(n: number): string {
  if (n >= 1_00_00_000) return '\u20b9' + (n / 1_00_00_000).toFixed(2) + ' Cr';
  if (n >= 1_00_000) return '\u20b9' + (n / 1_00_000).toFixed(2) + ' L';
  return '\u20b9' + Math.round(n).toLocaleString('en-IN');
}

function fmtUSD(n: number): string {
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000) return '$' + (n / 1_000).toFixed(1) + 'K';
  return '$' + Math.round(n).toLocaleString('en-US');
}

function indiaReturnRate(profile: ReturnProfile): number {
  if (profile === 'conservative') return 0.07;
  if (profile === 'moderate') return 0.10;
  return 0.12;
}

function usReturnRate(profile: ReturnProfile): number {
  if (profile === 'conservative') return 0.06;
  if (profile === 'moderate') return 0.08;
  return 0.10;
}

// ─── India computation ────────────────────────────────────────────────────────

interface IndiaInputs {
  currentAge: number;
  retirementAge: number;
  monthlySalary: number;
  npsContribPct: number;
  employerNPSPct: number;
  ppfAnnual: number;
  epfPct: number;
  basicSalary: number;
  returnProfile: ReturnProfile;
  marginalRate: number;
}

interface IndiaResults {
  years: number;
  npsCorpus: number;
  ppfCorpus: number;
  epfCorpus: number;
  totalCorpus: number;
  monthlyIncome: number;
  realCorpus: number;
  realMonthlyIncome: number;
  annualTaxSaving: number;
  yearByYear: Array<{
    year: number;
    age: number;
    nps: number;
    ppf: number;
    epf: number;
    total: number;
  }>;
}

function computeIndia(inp: IndiaInputs): IndiaResults {
  const years = Math.max(0, inp.retirementAge - inp.currentAge);
  const rate = indiaReturnRate(inp.returnProfile);

  const npsMonthly =
    (inp.monthlySalary * inp.npsContribPct) / 100 +
    (inp.basicSalary * inp.employerNPSPct) / 100;
  const npsCorpus = futureValueAnnuity(npsMonthly, rate / 12, years * 12);

  const ppfCorpus = futureValueAnnuity(inp.ppfAnnual / 12, 0.071 / 12, years * 12);

  const epfEmployee = inp.basicSalary * (inp.epfPct / 100);
  const epfEmployer = Math.min(inp.basicSalary, 15000) * 0.0367;
  const epfMonthly = epfEmployee + epfEmployer;
  const epfCorpus = futureValueAnnuity(epfMonthly, 0.0815 / 12, years * 12);

  const totalCorpus = npsCorpus + ppfCorpus + epfCorpus;

  const inflation = 0.06;
  const realReturn = (1 + rate) / (1 + inflation) - 1;
  const monthlyIncome =
    totalCorpus > 0 && realReturn > 0
      ? (totalCorpus * (realReturn / 12)) /
        (1 - Math.pow(1 + realReturn / 12, -25 * 12))
      : totalCorpus / (25 * 12);

  const realCorpus = totalCorpus / Math.pow(1 + inflation, years);
  const realMonthlyIncome =
    realCorpus > 0 && realReturn > 0
      ? (realCorpus * (realReturn / 12)) /
        (1 - Math.pow(1 + realReturn / 12, -25 * 12))
      : realCorpus / (25 * 12);

  const npsAnnual = npsMonthly * 12;
  const epfEmployeeAnnual = epfEmployee * 12;
  const c80CContrib = Math.min(npsAnnual + epfEmployeeAnnual, 150000);
  const c80CD1B = Math.min(Math.max(0, npsAnnual - c80CContrib), 50000);
  const annualTaxSaving = (c80CContrib + c80CD1B) * inp.marginalRate;

  const yearByYear: IndiaResults['yearByYear'] = [];
  for (let y = 5; y <= years; y += 5) {
    const npsY = futureValueAnnuity(npsMonthly, rate / 12, y * 12);
    const ppfY = futureValueAnnuity(inp.ppfAnnual / 12, 0.071 / 12, y * 12);
    const epfY = futureValueAnnuity(epfMonthly, 0.0815 / 12, y * 12);
    yearByYear.push({ year: y, age: inp.currentAge + y, nps: npsY, ppf: ppfY, epf: epfY, total: npsY + ppfY + epfY });
  }

  return {
    years,
    npsCorpus,
    ppfCorpus,
    epfCorpus,
    totalCorpus,
    monthlyIncome,
    realCorpus,
    realMonthlyIncome,
    annualTaxSaving,
    yearByYear,
  };
}

// ─── India Tab ────────────────────────────────────────────────────────────────

function IndiaTab() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [monthlySalary, setMonthlySalary] = useState(100000);
  const [basicSalary, setBasicSalary] = useState(40000);
  const [npsContribPct, setNpsContribPct] = useState(10);
  const [employerNPSPct, setEmployerNPSPct] = useState(10);
  const [ppfAnnual, setPpfAnnual] = useState(150000);
  const [epfPct, setEpfPct] = useState(12);
  const [returnProfile, setReturnProfile] = useState<ReturnProfile>('moderate');
  const [marginalRate, setMarginalRate] = useState(0.30);

  const res = computeIndia({
    currentAge,
    retirementAge,
    monthlySalary,
    basicSalary,
    npsContribPct,
    employerNPSPct,
    ppfAnnual,
    epfPct,
    returnProfile,
    marginalRate,
  });

  const total = res.totalCorpus || 1;
  const npsW = (res.npsCorpus / total) * 100;
  const ppfW = (res.ppfCorpus / total) * 100;
  const epfW = (res.epfCorpus / total) * 100;

  return (
    <div className="space-y-8">
      {/* Inputs */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="mb-5 text-base font-semibold text-[var(--text-primary)]">Your Details</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={LABEL_CLASS}>Current Age</label>
            <input
              type="number"
              min={18}
              max={60}
              value={currentAge}
              onChange={(e) => setCurrentAge(Number(e.target.value))}
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>Retirement Age</label>
            <input
              type="number"
              min={50}
              max={75}
              value={retirementAge}
              onChange={(e) => setRetirementAge(Number(e.target.value))}
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>Monthly Salary (₹)</label>
            <input
              type="number"
              min={0}
              value={monthlySalary}
              onChange={(e) => setMonthlySalary(Number(e.target.value))}
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>Basic Salary / month (₹)</label>
            <input
              type="number"
              min={0}
              value={basicSalary}
              onChange={(e) => setBasicSalary(Number(e.target.value))}
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>
              Your NPS Contribution (% of salary) — {npsContribPct}%
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={npsContribPct}
              onChange={(e) => setNpsContribPct(Number(e.target.value))}
              className="w-full accent-[var(--primary)]"
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>
              Employer NPS (% of basic) — {employerNPSPct}%
            </label>
            <input
              type="range"
              min={0}
              max={14}
              value={employerNPSPct}
              onChange={(e) => setEmployerNPSPct(Number(e.target.value))}
              className="w-full accent-[var(--primary)]"
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>PPF Annual Contribution (₹, max ₹1,50,000)</label>
            <input
              type="number"
              min={500}
              max={150000}
              value={ppfAnnual}
              onChange={(e) => setPpfAnnual(Math.min(150000, Number(e.target.value)))}
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>EPF Contribution (% of basic) — {epfPct}%</label>
            <input
              type="number"
              min={0}
              max={100}
              value={epfPct}
              onChange={(e) => setEpfPct(Number(e.target.value))}
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>Marginal Tax Rate</label>
            <select
              value={marginalRate}
              onChange={(e) => setMarginalRate(Number(e.target.value))}
              className={INPUT_CLASS}
            >
              <option value={0.05}>5%</option>
              <option value={0.10}>10%</option>
              <option value={0.15}>15%</option>
              <option value={0.20}>20%</option>
              <option value={0.30}>30%</option>
            </select>
          </div>
        </div>

        {/* Return profile segmented control */}
        <div className="mt-5">
          <label className={LABEL_CLASS}>Expected Return Profile</label>
          <div className="mt-1 flex rounded-lg border border-[var(--border)] overflow-hidden w-fit">
            {(
              [
                { id: 'conservative' as const, label: 'Conservative (7%)' },
                { id: 'moderate' as const, label: 'Moderate (10%)' },
                { id: 'aggressive' as const, label: 'Aggressive (12%)' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                onClick={() => setReturnProfile(opt.id)}
                className={[
                  'px-4 py-2 text-sm transition-colors duration-100',
                  returnProfile === opt.id
                    ? 'bg-[var(--primary)] text-white font-semibold'
                    : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-raised)]',
                ].join(' ')}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] p-3 text-xs text-[var(--text-muted)]">
          <Info size={14} className="mt-0.5 shrink-0 text-[var(--india)]" />
          <span>
            Inflation assumed at <strong>6%</strong> (RBI long-run target). PPF guaranteed at{' '}
            <strong>7.1%</strong> p.a. EPF interest rate <strong>8.15%</strong> (FY 2023-24). Real
            returns and monthly income are calculated using inflation-adjusted figures.
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'NPS Corpus', value: res.npsCorpus, color: 'var(--primary)' },
          { label: 'PPF Corpus', value: res.ppfCorpus, color: '#D97706' },
          { label: 'EPF Corpus', value: res.epfCorpus, color: 'var(--success)' },
          { label: 'Total Corpus', value: res.totalCorpus, color: 'var(--text-primary)' },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <p className="text-xs text-[var(--text-muted)]">{card.label}</p>
            <p className="num mt-1 text-lg font-bold" style={{ color: card.color }}>
              {fmtINR(card.value)}
            </p>
          </div>
        ))}
      </div>

      {/* Corpus breakdown bar */}
      {res.totalCorpus > 0 && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h3 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
            Corpus Breakdown
          </h3>
          <div className="flex h-6 w-full overflow-hidden rounded-lg">
            <div
              style={{ width: `${npsW}%`, background: 'var(--primary)' }}
              title={`NPS: ${npsW.toFixed(1)}%`}
            />
            <div
              style={{ width: `${ppfW}%`, background: '#D97706' }}
              title={`PPF: ${ppfW.toFixed(1)}%`}
            />
            <div
              style={{ width: `${epfW}%`, background: 'var(--success)' }}
              title={`EPF: ${epfW.toFixed(1)}%`}
            />
          </div>
          <div className="mt-2 flex gap-4 text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-3 rounded-sm" style={{ background: 'var(--primary)' }} />
              NPS {npsW.toFixed(1)}%
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-3 rounded-sm" style={{ background: '#D97706' }} />
              PPF {ppfW.toFixed(1)}%
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-3 rounded-sm" style={{ background: 'var(--success)' }} />
              EPF {epfW.toFixed(1)}%
            </span>
          </div>
        </div>
      )}

      {/* Monthly income */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h3 className="mb-4 text-sm font-semibold text-[var(--text-primary)]">
          Income at Retirement
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            {
              label: 'Total Corpus at Retirement',
              value: fmtINR(res.totalCorpus),
              sub: 'Nominal future value',
            },
            {
              label: 'Monthly Income (25yr drawdown)',
              value: fmtINR(res.monthlyIncome),
              sub: 'Nominal, inflation-adjusted return',
            },
            {
              label: "Corpus in Today's Rupees",
              value: fmtINR(res.realCorpus),
              sub: 'Purchasing power at 6% inflation',
            },
            {
              label: "Monthly Income (Today's Value)",
              value: fmtINR(res.realMonthlyIncome),
              sub: 'Real income equivalent',
            },
          ].map((row) => (
            <div
              key={row.label}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] p-3"
            >
              <p className="text-xs text-[var(--text-muted)]">{row.label}</p>
              <p className="num mt-0.5 text-base font-bold text-[var(--text-primary)]">
                {row.value}
              </p>
              <p className="mt-0.5 text-xs text-[var(--text-muted)]">{row.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tax saving */}
      {res.annualTaxSaving > 0 && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 flex items-center gap-3">
          <Target size={20} className="shrink-0 text-[var(--success)]" />
          <p className="text-sm text-[var(--text-secondary)]">
            You save{' '}
            <strong className="num text-[var(--success)]">{fmtINR(res.annualTaxSaving)}</strong>{' '}
            per year in tax through NPS and EPF contributions (80C + 80CCD(1B) at{' '}
            {(marginalRate * 100).toFixed(0)}% slab).
          </p>
        </div>
      )}

      {/* Year-by-year table */}
      {res.yearByYear.length > 0 && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h3 className="mb-4 text-sm font-semibold text-[var(--text-primary)]">
            Growth Projection (every 5 years)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-xs text-[var(--text-muted)]">
                  <th className="pb-2 text-left">Year</th>
                  <th className="pb-2 text-left">Age</th>
                  <th className="pb-2 text-right">NPS</th>
                  <th className="pb-2 text-right">PPF</th>
                  <th className="pb-2 text-right">EPF</th>
                  <th className="pb-2 text-right font-semibold text-[var(--text-primary)]">Total</th>
                </tr>
              </thead>
              <tbody>
                {res.yearByYear.map((row) => (
                  <tr
                    key={row.year}
                    className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-raised)]"
                  >
                    <td className="py-2 num text-[var(--text-secondary)]">{row.year}</td>
                    <td className="py-2 num text-[var(--text-secondary)]">{row.age}</td>
                    <td className="py-2 num text-right text-[var(--primary)]">{fmtINR(row.nps)}</td>
                    <td className="py-2 num text-right" style={{ color: '#D97706' }}>{fmtINR(row.ppf)}</td>
                    <td className="py-2 num text-right text-[var(--success)]">{fmtINR(row.epf)}</td>
                    <td className="py-2 num text-right font-semibold text-[var(--text-primary)]">
                      {fmtINR(row.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── US computation ───────────────────────────────────────────────────────────

interface USInputs {
  currentAge: number;
  retirementAge: number;
  annualSalary: number;
  contrib401kPct: number;
  matchPct: number;
  iraType: IRAType;
  iraContrib: number;
  returnProfile: ReturnProfile;
  marginalRate: number;
}

interface USResults {
  years: number;
  corpus401k: number;
  corpusIRA: number;
  totalCorpus: number;
  monthlyIncome: number;
  annualTaxSaving: number;
  yearByYear: Array<{
    year: number;
    age: number;
    k401: number;
    ira: number;
    total: number;
  }>;
}

function computeUS(inp: USInputs): USResults {
  const years = Math.max(0, inp.retirementAge - inp.currentAge);
  const rate = usReturnRate(inp.returnProfile);

  const contrib401k = Math.min(
    (inp.annualSalary * inp.contrib401kPct) / 100,
    23500
  );
  const matchCapped = Math.min(inp.contrib401kPct / 100, inp.matchPct / 100);
  const match401k = inp.annualSalary * matchCapped;
  const total401kMonthly = (contrib401k + match401k) / 12;
  const corpus401k = futureValueAnnuity(total401kMonthly, rate / 12, years * 12);

  const corpusIRA = futureValueAnnuity(inp.iraContrib / 12, rate / 12, years * 12);

  const totalCorpus = corpus401k + corpusIRA;
  const monthlyIncome =
    totalCorpus > 0 && rate > 0
      ? (totalCorpus * (rate / 12)) / (1 - Math.pow(1 + rate / 12, -20 * 12))
      : totalCorpus / (20 * 12);

  const annualTaxSaving =
    (contrib401k + (inp.iraType === 'traditional' ? inp.iraContrib : 0)) * inp.marginalRate;

  const yearByYear: USResults['yearByYear'] = [];
  for (let y = 5; y <= years; y += 5) {
    const k = futureValueAnnuity(total401kMonthly, rate / 12, y * 12);
    const ira = futureValueAnnuity(inp.iraContrib / 12, rate / 12, y * 12);
    yearByYear.push({ year: y, age: inp.currentAge + y, k401: k, ira, total: k + ira });
  }

  return { years, corpus401k, corpusIRA, totalCorpus, monthlyIncome, annualTaxSaving, yearByYear };
}

// ─── US Tab ───────────────────────────────────────────────────────────────────

function USTab() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [annualSalary, setAnnualSalary] = useState(100000);
  const [contrib401kPct, setContrib401kPct] = useState(10);
  const [matchPct, setMatchPct] = useState(3);
  const [iraType, setIraType] = useState<IRAType>('traditional');
  const [iraContrib, setIraContrib] = useState(7000);
  const [returnProfile, setReturnProfile] = useState<ReturnProfile>('moderate');
  const [marginalRate, setMarginalRate] = useState(0.24);

  const res = computeUS({
    currentAge,
    retirementAge,
    annualSalary,
    contrib401kPct,
    matchPct,
    iraType,
    iraContrib,
    returnProfile,
    marginalRate,
  });

  const total = res.totalCorpus || 1;
  const k401W = (res.corpus401k / total) * 100;
  const iraW = (res.corpusIRA / total) * 100;

  const effectiveContrib = Math.min((annualSalary * contrib401kPct) / 100, 23500);

  return (
    <div className="space-y-8">
      {/* Inputs */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="mb-5 text-base font-semibold text-[var(--text-primary)]">Your Details</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={LABEL_CLASS}>Current Age</label>
            <input
              type="number"
              min={18}
              max={60}
              value={currentAge}
              onChange={(e) => setCurrentAge(Number(e.target.value))}
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>Retirement Age</label>
            <input
              type="number"
              min={50}
              max={80}
              value={retirementAge}
              onChange={(e) => setRetirementAge(Number(e.target.value))}
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>Annual Salary ($)</label>
            <input
              type="number"
              min={0}
              value={annualSalary}
              onChange={(e) => setAnnualSalary(Number(e.target.value))}
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>
              401(k) Contribution — {contrib401kPct}% of salary
              <span className="ml-1 text-[var(--text-muted)]">
                (effective {fmtUSD(effectiveContrib)}/yr, IRS max $23,500)
              </span>
            </label>
            <input
              type="range"
              min={0}
              max={30}
              step={0.5}
              value={contrib401kPct}
              onChange={(e) => setContrib401kPct(Number(e.target.value))}
              className="w-full accent-[var(--us)]"
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>
              Employer Match — {matchPct}% (up to {matchPct}% of salary)
            </label>
            <input
              type="range"
              min={0}
              max={10}
              step={0.5}
              value={matchPct}
              onChange={(e) => setMatchPct(Number(e.target.value))}
              className="w-full accent-[var(--us)]"
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>IRA Type</label>
            <select
              value={iraType}
              onChange={(e) => setIraType(e.target.value as IRAType)}
              className={INPUT_CLASS}
            >
              <option value="none">None</option>
              <option value="traditional">Traditional IRA</option>
              <option value="roth">Roth IRA</option>
            </select>
          </div>
          {iraType !== 'none' && (
            <div>
              <label className={LABEL_CLASS}>
                IRA Annual Contribution ($, 2025 limit: $7,000 / $8,000 age 50+)
              </label>
              <input
                type="number"
                min={0}
                max={currentAge >= 50 ? 8000 : 7000}
                value={iraContrib}
                onChange={(e) =>
                  setIraContrib(Math.min(currentAge >= 50 ? 8000 : 7000, Number(e.target.value)))
                }
                className={INPUT_CLASS}
              />
            </div>
          )}
          <div>
            <label className={LABEL_CLASS}>Marginal Federal Tax Rate</label>
            <select
              value={marginalRate}
              onChange={(e) => setMarginalRate(Number(e.target.value))}
              className={INPUT_CLASS}
            >
              <option value={0.10}>10%</option>
              <option value={0.12}>12%</option>
              <option value={0.22}>22%</option>
              <option value={0.24}>24%</option>
              <option value={0.32}>32%</option>
              <option value={0.35}>35%</option>
              <option value={0.37}>37%</option>
            </select>
          </div>
        </div>

        {/* Return profile */}
        <div className="mt-5">
          <label className={LABEL_CLASS}>Expected Return Profile</label>
          <div className="mt-1 flex rounded-lg border border-[var(--border)] overflow-hidden w-fit">
            {(
              [
                { id: 'conservative' as const, label: 'Conservative (6%)' },
                { id: 'moderate' as const, label: 'Moderate (8%)' },
                { id: 'aggressive' as const, label: 'Aggressive (10%)' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                onClick={() => setReturnProfile(opt.id)}
                className={[
                  'px-4 py-2 text-sm transition-colors duration-100',
                  returnProfile === opt.id
                    ? 'bg-[var(--us)] text-white font-semibold'
                    : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-raised)]',
                ].join(' ')}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {iraType !== 'none' && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] p-3 text-xs text-[var(--text-muted)]">
            <Info size={14} className="mt-0.5 shrink-0 text-[var(--us)]" />
            <span>
              {iraType === 'traditional'
                ? 'Traditional 401(k)/IRA contributions reduce your AGI now but are taxed on withdrawal.'
                : 'Roth contributions are after-tax — qualified withdrawals at retirement are completely tax-free.'}
            </span>
          </div>
        )}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: '401(k) Corpus', value: res.corpus401k, color: 'var(--us)' },
          { label: 'IRA Corpus', value: res.corpusIRA, color: 'var(--success)' },
          { label: 'Total Corpus', value: res.totalCorpus, color: 'var(--text-primary)' },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <p className="text-xs text-[var(--text-muted)]">{card.label}</p>
            <p className="num mt-1 text-lg font-bold" style={{ color: card.color }}>
              {fmtUSD(card.value)}
            </p>
          </div>
        ))}
      </div>

      {/* Breakdown bar */}
      {res.totalCorpus > 0 && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h3 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
            Corpus Breakdown
          </h3>
          <div className="flex h-6 w-full overflow-hidden rounded-lg">
            <div
              style={{ width: `${k401W}%`, background: 'var(--us)' }}
              title={`401(k): ${k401W.toFixed(1)}%`}
            />
            <div
              style={{ width: `${iraW}%`, background: 'var(--success)' }}
              title={`IRA: ${iraW.toFixed(1)}%`}
            />
          </div>
          <div className="mt-2 flex gap-4 text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-3 rounded-sm" style={{ background: 'var(--us)' }} />
              401(k) {k401W.toFixed(1)}%
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-3 rounded-sm" style={{ background: 'var(--success)' }} />
              IRA {iraW.toFixed(1)}%
            </span>
          </div>
        </div>
      )}

      {/* Monthly income */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h3 className="mb-4 text-sm font-semibold text-[var(--text-primary)]">
          Income at Retirement
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            {
              label: 'Total Corpus at Retirement',
              value: fmtUSD(res.totalCorpus),
              sub: 'Nominal future value',
            },
            {
              label: 'Monthly Income (20yr drawdown)',
              value: fmtUSD(res.monthlyIncome),
              sub: 'Using expected return rate',
            },
          ].map((row) => (
            <div
              key={row.label}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] p-3"
            >
              <p className="text-xs text-[var(--text-muted)]">{row.label}</p>
              <p className="num mt-0.5 text-base font-bold text-[var(--text-primary)]">
                {row.value}
              </p>
              <p className="mt-0.5 text-xs text-[var(--text-muted)]">{row.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tax saving */}
      {res.annualTaxSaving > 0 && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 flex items-center gap-3">
          <Target size={20} className="shrink-0 text-[var(--success)]" />
          <p className="text-sm text-[var(--text-secondary)]">
            You save{' '}
            <strong className="num text-[var(--success)]">{fmtUSD(res.annualTaxSaving)}</strong>{' '}
            per year in federal tax through pre-tax 401(k)
            {iraType === 'traditional' ? ' and Traditional IRA' : ''} contributions (
            {(marginalRate * 100).toFixed(0)}% bracket).
          </p>
        </div>
      )}

      {/* Year-by-year table */}
      {res.yearByYear.length > 0 && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h3 className="mb-4 text-sm font-semibold text-[var(--text-primary)]">
            Growth Projection (every 5 years)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-xs text-[var(--text-muted)]">
                  <th className="pb-2 text-left">Year</th>
                  <th className="pb-2 text-left">Age</th>
                  <th className="pb-2 text-right">401(k)</th>
                  <th className="pb-2 text-right">IRA</th>
                  <th className="pb-2 text-right font-semibold text-[var(--text-primary)]">Total</th>
                </tr>
              </thead>
              <tbody>
                {res.yearByYear.map((row) => (
                  <tr
                    key={row.year}
                    className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-raised)]"
                  >
                    <td className="py-2 num text-[var(--text-secondary)]">{row.year}</td>
                    <td className="py-2 num text-[var(--text-secondary)]">{row.age}</td>
                    <td className="py-2 num text-right text-[var(--us)]">{fmtUSD(row.k401)}</td>
                    <td className="py-2 num text-right text-[var(--success)]">{fmtUSD(row.ira)}</td>
                    <td className="py-2 num text-right font-semibold text-[var(--text-primary)]">
                      {fmtUSD(row.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const TABS: Array<{ id: TabId; label: string }> = [
  { id: 'india', label: 'India' },
  { id: 'us', label: 'United States' },
];

export default function RetirementCalculator() {
  const [activeTab, setActiveTab] = useState<TabId>('india');

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <PiggyBank size={24} className="text-[var(--primary)]" />
          <h1 className="text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
            Retirement Planning Calculator
          </h1>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">
          Project your retirement corpus with NPS, PPF, EPF (India) or 401(k), IRA (US).
          See corpus at retirement and estimated monthly income.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--border)] gap-1 overflow-x-auto mb-8">
        {TABS.map((tab) => {
          const accent = tab.id === 'india' ? 'var(--india)' : 'var(--us)';
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={[
                'shrink-0 px-5 py-2.5 text-sm transition-colors duration-100 -mb-px flex items-center gap-2',
                activeTab === tab.id
                  ? 'border-b-2 text-[var(--text-primary)] font-semibold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] border-b-2 border-transparent',
              ].join(' ')}
              style={activeTab === tab.id ? { borderBottomColor: accent } : undefined}
            >
              {tab.id === 'india' && (
                <TrendingUp size={14} style={{ color: 'var(--india)' }} />
              )}
              {tab.id === 'us' && (
                <Calendar size={14} style={{ color: 'var(--us)' }} />
              )}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === 'india' && <IndiaTab />}
      {activeTab === 'us' && <USTab />}
    </div>
  );
}
