import type { Metadata } from 'next';
import TaxCalendar from '@/components/calendar/TaxCalendar';

export const metadata: Metadata = {
  title: 'Tax Calendar 2025-26 — India, US, UK Deadlines | TaxCalc Global',
  description:
    'All important tax deadlines for India FY 2025-26, US Tax Year 2025, and UK 2025-26. ITR filing, advance tax, quarterly estimates, self-assessment dates.',
};

export default function CalendarPage() {
  return <TaxCalendar />;
}
