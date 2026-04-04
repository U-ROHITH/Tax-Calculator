'use client';

import { useState } from 'react';
import SalaryOptimizer from './SalaryOptimizer';
import LTCGTiming from './LTCGTiming';
import NPSOptimizer from './NPSOptimizer';
import HUFSplitting from './HUFSplitting';

const TABS = [
  { id: 'salary', label: 'Salary Optimizer' },
  { id: 'ltcg', label: 'LTCG Timing' },
  { id: 'nps', label: 'NPS Calculator' },
  { id: 'huf', label: 'HUF Splitting' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function PlanningTools() {
  const [activeTab, setActiveTab] = useState<TabId>('salary');

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
          Tax Planning Tools — India
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Model future decisions before making them. Know your tax before you meet your CA.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--border)] gap-1 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={[
              'shrink-0 px-4 py-2.5 text-sm transition-colors duration-100 -mb-px',
              activeTab === tab.id
                ? 'border-b-2 border-[var(--primary)] text-[var(--text-primary)] font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] border-b-2 border-transparent',
            ].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-6">
        {activeTab === 'salary' && <SalaryOptimizer />}
        {activeTab === 'ltcg' && <LTCGTiming />}
        {activeTab === 'nps' && <NPSOptimizer />}
        {activeTab === 'huf' && <HUFSplitting />}
      </div>
    </div>
  );
}
