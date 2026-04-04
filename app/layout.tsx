import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'TaxCalc Global — Free Income Tax Calculator for India, US & UK',
    template: '%s | TaxCalc Global',
  },
  description:
    'Free multi-country income tax calculator for India (FY 2025-26), United States (TY 2025), and United Kingdom (TY 2025-26). Instant results, no signup required.',
  keywords: [
    'income tax calculator',
    'tax calculator India',
    'tax calculator US',
    'tax calculator UK',
    'FY 2025-26',
    'old regime new regime',
  ],
  authors: [{ name: 'TaxCalc Global' }],
  openGraph: {
    type: 'website',
    siteName: 'TaxCalc Global',
    title: 'TaxCalc Global — Free Income Tax Calculator',
    description:
      'Calculate taxes for India, US, and UK instantly. Compare regimes, view breakdowns, download PDF.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TaxCalc Global — Free Income Tax Calculator',
    description: 'Calculate taxes for India, US, and UK instantly.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-[var(--background)] text-[var(--text-primary)]">
        {adsenseId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
