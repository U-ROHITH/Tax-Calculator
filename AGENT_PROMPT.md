# TaxCalc Global — Agent Mission File

> This file is the single source of truth for every Claude agent working on this project.
> Read it fully before touching any code. Update the "Work Log" section when you complete a milestone, then commit to GitHub.

---

## The Mission

Build **TaxCalc Global** — a free, client-side, multi-country income tax calculator that runs entirely in the browser with zero server costs. The goal is to generate revenue through Google AdSense and affiliate partnerships while helping users in India, the US, and the UK calculate their taxes accurately.

**Stack:** Next.js 15 (App Router) · TypeScript (strict) · Tailwind CSS v4 · shadcn/ui · Recharts · Framer Motion · Zustand · @react-pdf/renderer

**Full spec lives in:** `../Docs/TaxCalc_Global_SDD.docx` (extract with python3 + zipfile if you need to re-read it)

---

## GitHub Setup

The remote is already configured. To push, set the token in your shell (never write it to a file):

```bash
# One-time setup for the session:
export GH_TOKEN="<token from project owner>"
git remote set-url origin "https://${GH_TOKEN}@github.com/U-ROHITH/Tax-Calculator.git"

# After every milestone:
git add -A
git commit -m "milestone: <description>"
git push origin master
```

**Repo:** `https://github.com/U-ROHITH/Tax-Calculator`
**IMPORTANT:** Never write the token into any file — GitHub will block the push via secret scanning.

---

## Project Root

```
/home/prime/Tax/taxcalc-global/
```

---

## What Has Been Built (Completed Work Log)

### ✅ MILESTONE 1 — Project Scaffold
- Next.js 15 App Router project initialized at `/home/prime/Tax/taxcalc-global/`
- Dependencies installed: `framer-motion`, `recharts`, `zustand`, `@react-pdf/renderer`, `next-themes`, `next-sitemap`, `lucide-react`
- Dev deps: `vitest`, `@testing-library/react`, `@vitejs/plugin-react`, `jsdom`
- shadcn/ui initialized with `components.json` (new-york style)
- shadcn components added: `button`, `card`, `input`, `label`, `select`, `tabs`, `badge`, `separator`
- `vitest.config.ts` created by the India engine agent

### ✅ MILESTONE 2 — Type Definitions & Slab Configs
- `engine/types.ts` — All TypeScript interfaces: `TaxInput`, `IndiaInput`, `USInput`, `UKInput`, `TaxResult`, `TaxBreakdownItem`, `BracketDetail`, `SavingTip`
- `engine/utils.ts` — `calculateBracketTax()`, `formatCurrency()`, `clamp()`, `roundTo()`
- `config/slabs/india-fy2025-26.json` — India tax slabs (old + new regime, surcharge, cess, 87A rebate)
- `config/slabs/us-ty2025.json` — US federal brackets (all 4 filing statuses), FICA, state configs (CA, NY, TX, FL, WA)
- `config/slabs/uk-ty2025-26.json` — UK bands (England/Wales/NI + Scotland), NI, student loans, dividends
- `config/affiliates.json` — Affiliate links for Groww, Zerodha, PolicyBazaar, Fidelity, PensionBee
- `config/tips.json` — Tax saving tips keyed by country and trigger

### ✅ MILESTONE 3 — Tax Engines (all tests passing)
- `engine/india.ts` — `calculateIndiaTax(input: IndiaInput): TaxResult`
  - Old/new regime, standard deduction, HRA exemption, Chapter VI-A (80C/80D/80TTA/24/NPS), 87A rebate, surcharge with marginal relief, 4% cess, auto mode
  - **26/26 tests pass** in `engine/__tests__/india.test.ts`
- `engine/us.ts` — `calculateUSTax(input: USInput): TaxResult`
  - Federal brackets (all 4 filing statuses), FICA (SS + Medicare + Additional Medicare), SE tax with 50% deduction, state tax (CA/NY/TX/FL/WA)
  - **39/39 tests pass** in `engine/__tests__/us.test.ts`
- `engine/uk.ts` — `calculateUKTax(input: UKInput): TaxResult`
  - Personal Allowance taper (60% trap), England/Wales/Scotland bands, National Insurance, student loan (5 plans), dividend tax, pension contribution
  - **39/39 tests pass** in `engine/__tests__/uk.test.ts`

### ✅ MILESTONE 4 — Zustand Store + Formatters
- `store/calculatorStore.ts` — Zustand store with `country`, `input`, `result`, `isCalculating` state
- `lib/formatters.ts` — `formatByCurrency()`, `formatPercent()`, `formatNumber()`

### ✅ MILESTONE 5 — Shared Components & Layout
- `app/globals.css` — Full design system with CSS variables for light/dark mode (colors from SDD §6.2)
- `app/layout.tsx` — Root layout with Inter font, metadata, AdSense script hook, Header + Footer
- `components/shared/Header.tsx` — Sticky header with nav links (IN/US/UK/Compare) + flag emojis
- `components/shared/Footer.tsx` — Footer with disclaimers, links, copyright

### ✅ MILESTONE 6 — Landing Page
- `app/page.tsx` — Hero section, 3 country cards (India/US/UK with features list), "How it works" 3-step, trust signals, compare CTA

### ✅ MILESTONE 7 — Calculator Forms
- `components/calculator/IndiaForm.tsx` — Regime toggle (old/new/auto), age selector, HRA section (expandable), Chapter VI-A deductions (expandable), live calculation on 300ms debounce
- `components/calculator/USForm.tsx` — Filing status, state dropdown, W-2/SE toggle, standard vs itemized deductions, live calculation
- `components/calculator/UKForm.tsx` — Region toggle, pension input, student loan dropdown, dividend income, BPA checkbox, 60% trap warning banner
- `components/calculator/CalculatorLayout.tsx` — Two-column desktop layout (form left, results right), mobile stacked

### ✅ MILESTONE 8 — Results Dashboard & Charts
- `components/results/ResultsDashboard.tsx` — Summary cards (gross/tax/net/effective rate), marginal rate badge, regime badge, full breakdown table
- `components/results/TaxBreakdownChart.tsx` — Recharts donut pie chart of tax components
- `components/results/BracketWaterfall.tsx` — Recharts bar chart showing tax per bracket
- `components/results/MonthlyBreakdown.tsx` — Annual/monthly/weekly/daily take-home table
- `components/results/RegimeComparison.tsx` — India old vs new side-by-side comparison card with savings highlight
- `components/results/SavingTips.tsx` — Contextual tips with affiliate CTA buttons

### ✅ MILESTONE 9 — Route Pages + Comparison + PDF + Monetization
- `app/in/page.tsx`, `app/us/page.tsx`, `app/uk/page.tsx` — Server components with SEO metadata, each renders its client Calculator component
- `components/calculator/IndiaCalculator.tsx`, `USCalculator.tsx`, `UKCalculator.tsx` — Client components managing state, rendering form + ResultsDashboard
- `app/compare/page.tsx` + `components/calculator/CompareCalculator.tsx` — Side-by-side comparison of all 3 countries, horizontal bar chart, insight callouts
- `lib/pdf.tsx` — `generateTaxPDF(result, premium)` using @react-pdf/renderer, downloads client-side
- `components/monetization/AdBanner.tsx` — AdSense wrapper, shows placeholder in dev when NEXT_PUBLIC_ADSENSE_ID not set
- `components/monetization/AffiliateCard.tsx` — Styled affiliate CTA card
- `lib/utils.ts` — `cn()` utility for shadcn
- PDF download button added to ResultsDashboard
- **Pushed to GitHub ✓**

---

## What Still Needs To Be Done

### ✅ MILESTONE 10 — Fix Build TypeScript Errors
- Fixed Recharts `formatter` type errors in `BracketWaterfall.tsx`, `TaxBreakdownChart.tsx`, `CompareCalculator.tsx`
- Used `(value: unknown) => ...` pattern for all Recharts formatters
- **Pushed to GitHub ✓**

### ✅ MILESTONE 11 — SEO + Sitemap
`npm run build` currently fails with Recharts Tooltip/Label formatter type errors in `CompareCalculator.tsx`. Fix them and get a clean build.

Errors to fix:
- `formatter` prop on `<Tooltip>` — use `(v: unknown) => ...` not typed `number`
- `formatter` on `<Bar label>` — same, use `(v: unknown) => \`${v}%\``

After fixing, run `npm run build` until it exits 0. Then push to GitHub.

### 🔲 MILESTONE 11 — SEO & Performance
- `generateMetadata()` for each route with keywords from SDD §10.1
- JSON-LD `FAQPage` structured data per country
- `next-sitemap.config.js` setup
- `robots.txt`
- Open Graph images in `public/og/`
- Run `npm run build` cleanly with 0 errors

### ✅ MILESTONE 11 — SEO + Sitemap
- JSON-LD FAQPage structured data in `/in`, `/us`, `/uk` pages (3 questions each)
- `next-sitemap.config.js` — auto-generates `sitemap.xml` + `robots.txt` on build
- All routes: `/`, `/in`, `/us`, `/uk`, `/compare` building as static pages
- **Pushed to GitHub ✓**

### ✅ MILESTONE 12 — Final Polish — COMPLETE
- Dark mode toggle in Header (persists in localStorage, respects OS preference)
- Framer Motion: results dashboard fades+slides in, summary cards stagger in with delay
- **104/104 tests pass**
- **Clean production build**
- **Pushed to GitHub ✓**

---

## 🎉 PROJECT COMPLETE

All milestones done. The app is fully built and pushed.
To deploy: connect `https://github.com/U-ROHITH/Tax-Calculator` to Vercel (free tier), set `NEXT_PUBLIC_SITE_URL` env var, it will auto-deploy on every push.

Optional next steps (Phase 2 from SDD §15):
- Add Google AdSense publisher ID via `NEXT_PUBLIC_ADSENSE_ID` env var
- Add affiliate links to real programs (Groww, Zerodha, PolicyBazaar)
- Add 10 more US states
- Add capital gains calculator

---

## Critical Implementation Notes

1. **All engine functions are pure** — no side effects, no DOM, no fetch. Import dynamically in client components: `const { calculateIndiaTax } = await import('@/engine/india')`

2. **India 87A rebate** — new regime: income ≤ ₹12,75,000 → tax-free. Old: ≤ ₹5,00,000. Many online calculators get this wrong.

3. **UK 60% effective band** — personal allowance tapers between £100K–£125,140. The tip and warning banner must fire for income in this range.

4. **Marginal relief (India)** — surcharge can't make net income lower than what it would be at the threshold. The engine handles this but tests should verify.

5. **SE tax (US)** — self-employed pay double FICA but deduct 50% of SE tax from AGI. The deduction must be computed before federal bracket tax.

6. **Dynamic UK brackets** — because personal allowance is computed at runtime, the UK engine builds its TaxBracket array dynamically per calculation, not from static config.

---

## Commit Message Convention

```
milestone: scaffold + deps installed
milestone: tax engines complete (104 tests pass)
milestone: UI components complete
milestone: route pages wired
milestone: comparison page done
milestone: PDF export
milestone: SEO + production build clean
```

---

## How to Run

```bash
cd /home/prime/Tax/taxcalc-global
npm run dev          # dev server on localhost:3000
npm run test         # run all 104 vitest tests
npm run build        # production build
```

---

*Last updated by: Claude Sonnet 4.6 (session 2026-04-04)*
*Work completed through: MILESTONE 8*
*Next agent should start at: MILESTONE 9*
