# TaxCalc Global — Agent Mission File v3

> Read this entire file before touching any code.
> After every milestone: git add -A → commit → push → update this file → continue.

---

## The Mission (v3 — Honest Scope)

**Correct positioning: "Know your tax before you meet your CA" — not replace them.**

A CA's value is 85% judgment, representation, planning — not formula execution.
What the app CAN cover beyond basic calculation:
- All formula-based computation for India/US/UK (DONE — M1–M21)
- Prospective what-if planning tools (build — M22)
- Multi-year loss carry-forward tracking (build — M23)
- Document checklist and AIS/26AS validation guidance (build — M24)
- Salary/income restructuring optimizer (build — M25)

**What the app CANNOT do (never claim otherwise):**
- Legal interpretation (circulars, CBDT notifications, case law, AAR rulings)
- Document review (Form 16, 26AS, AIS, bank statements, property docs)
- Notice handling and representation before AO, CIT(A), ITAT
- Fiduciary responsibility — CA is legally liable; app has a disclaimer
- GST, TDS filings, tax audit (3CA/3CB/3CD), ROC, FEMA/RBI
- Business complexity: transfer pricing, Section 50C, 56(2)(x), unlisted shares, 80-IAC

**UI standard:** MNC fintech grade. Think Wise, Monzo, Linear.app, Bloomberg Terminal.
- Zero emojis anywhere in the UI — use Lucide icons only
- Professional typography, proper information hierarchy
- Dark/light mode, animated charts, print-quality PDF

---

## GitHub

```bash
export GH_TOKEN="<token from owner — never write to file>"
git remote set-url origin "https://${GH_TOKEN}@github.com/U-ROHITH/Tax-Calculator.git"
git add -A && git commit -m "milestone: <desc>" && git push origin master
```

**Repo:** https://github.com/U-ROHITH/Tax-Calculator
**Project root:** `/home/prime/Tax/taxcalc-global`

---

## Current State (as of last push)

Basic version is complete and working. Now rebuilding to CA-replacement standard.

### Existing files worth keeping:
- `engine/types.ts` — extend, don't replace
- `engine/utils.ts` — keep, add helpers
- `config/slabs/*.json` — keep, will add more config files
- `engine/__tests__/*.test.ts` — 104 passing tests, keep all

### Files being completely rebuilt:
- All `components/` — world-class UI redesign
- All `app/` pages — comprehensive feature set
- `engine/india.ts`, `engine/us.ts`, `engine/uk.ts` — massive expansion

---

## Feature Specification — What Must Be Built

### INDIA — Complete Tax Assessment (ITR-grade)

**Income Heads:**
1. **Salary Income**
   - Basic + DA + HRA + Special Allowances + Bonus
   - Standard deduction ₹75,000 (new) / ₹50,000 (old)
   - HRA exemption (metro/non-metro, 3-way minimum)
   - LTA exemption (2 trips in 4-year block)
   - Professional tax deduction
   - Gratuity exemption (u/s 10(10))
   - Leave encashment exemption (u/s 10(10AA))
   - Perquisites (company car, ESOP vesting, accommodation)

2. **House Property Income**
   - Self-occupied: interest on home loan (max ₹2L deduction u/s 24(b))
   - Let-out: gross rent - 30% standard deduction - loan interest (unlimited)
   - Pre-construction interest (1/5th rule)
   - Loss from house property set-off (max ₹2L against salary)
   - Multiple properties

3. **Business/Profession Income**
   - Presumptive u/s 44AD (8%/6% of turnover, max ₹2Cr)
   - Presumptive u/s 44ADA (50% of gross receipts, max ₹75L for professionals)
   - Regular business income (revenue - expenses)

4. **Capital Gains**
   - STCG on equity/mutual funds: 20% (post-Jul 2024 Budget change: was 15%)
   - LTCG on equity: 12.5% above ₹1.25L exemption (was 10% above ₹1L)
   - STCG on debt/other: slab rate
   - LTCG on debt (post-Apr 2023): slab rate (indexation removed)
   - LTCG on property with indexation: 20% with CII indexation
   - LTCG on property without indexation: 12.5% (new option post-Budget 2024)
   - STT paid confirmation for equity CG rates

5. **Other Sources**
   - Interest income (savings/FD/bonds)
   - Dividend income (fully taxable at slab)
   - Winning from lottery/games (30% flat + cess)
   - Agricultural income (exempt but added for surcharge calculation)
   - Gifts received (taxable above ₹50K from non-relatives)

**Deductions — Old Regime (Chapter VI-A):**
- 80C: PPF/ELSS/LIC/EPF/NSC/Tuition (max ₹1.5L)
- 80CCC: Pension fund contribution (within 80C limit)
- 80CCD(1): NPS (within 80C limit)
- 80CCD(1B): Additional NPS (max ₹50K, over and above 80C)
- 80CCD(2): Employer NPS contribution (max 10% of salary, no cap for govt employees 14%)
- 80D: Health insurance (₹25K self/family, ₹50K senior; ₹5K preventive health checkup)
- 80DD: Dependent with disability (₹75K/₹1.25L)
- 80DDB: Medical treatment of specified diseases (₹40K/₹1L)
- 80E: Education loan interest (8 years, no limit)
- 80EEA: Home loan interest for affordable housing (max ₹1.5L, additional to 24b)
- 80G: Donations (50%/100% with/without limit)
- 80GG: Rent paid (no HRA; max ₹60K/year)
- 80TTA: Savings interest (max ₹10K; not for senior citizens)
- 80TTB: Senior citizen interest (max ₹50K FD+savings)
- 80U: Self with disability (₹75K/₹1.25L)

**Advanced Calculations:**
- Section 87A rebate (correctly implemented)
- Surcharge with marginal relief (all thresholds)
- AMT u/s 115JC (18.5% of adjusted total income for certain taxpayers)
- Relief u/s 89(1) for arrear salary
- Advance tax schedule (15%/45%/75%/100% by Jun/Sep/Dec/Mar)
- Interest u/s 234B (default in advance tax payment)
- Interest u/s 234C (deferred advance tax)
- TDS deducted (show remaining tax payable)
- Which ITR form to file (ITR-1/2/3/4)

---

### US — Complete Form 1040 Simulation

**Income Sources:**
- W-2 wages
- Self-employment / 1099-NEC income
- Business income (Schedule C)
- Rental income (Schedule E)
- Capital gains (Schedule D): STCG (ordinary rates), LTCG (0%/15%/20%)
- Qualified dividends (same as LTCG rates)
- Social Security benefits (0%/50%/85% taxable)
- Interest income
- IRA distributions
- Pension/annuity income

**Above-the-Line Deductions (Adjustments to Income):**
- Student loan interest (max $2,500)
- Educator expenses ($300)
- Self-employed health insurance
- Self-employed SEP/SIMPLE/qualified plan contributions
- Alimony paid (pre-2019 agreements)
- IRA deduction (traditional IRA, income limits apply)
- 50% SE tax deduction
- HSA deduction

**Standard vs Itemized Deductions:**
- Standard: $15,000 single / $30,000 MFJ / $22,500 HoH (2025)
- Itemized: mortgage interest, SALT (capped $10K), charitable, medical (>7.5% AGI), casualty losses

**Tax Credits:**
- Child Tax Credit ($2,000/child under 17)
- Additional Child Tax Credit (refundable portion)
- Child & Dependent Care Credit (20-35% of $3K-$6K expenses)
- Earned Income Tax Credit (EITC) — full table implementation
- American Opportunity Credit ($2,500/year, 4 years)
- Lifetime Learning Credit ($2,000, 20% of $10K)
- Saver's Credit (10-50% of retirement contributions)
- EV/Plug-in Vehicle Credit

**Special Taxes:**
- Alternative Minimum Tax (AMT) — Form 6251 simplified
- Net Investment Income Tax (NIIT) — 3.8% on lesser of NII or MAGI above threshold
- Additional Medicare Tax (0.9%)
- SE Tax (Schedule SE)
- Kiddie Tax (simplified)

**All 50 States + DC:** Full bracket implementation for top 15 states by population. At minimum: CA, NY, TX, FL, WA, IL, PA, OH, GA, NC, MI, NJ, VA, AZ, MA.

**QBI Deduction (Section 199A):**
- 20% of qualified business income
- W-2 wage limit applies above $197,300 (single) / $394,600 (MFJ) — phase in

---

### UK — Complete Self Assessment Simulation

**Income Sources:**
- Employment income (PAYE)
- Self-employment profits
- Partnership income
- Rental income (property income)
- Savings income (interest)
- Dividend income
- Pension income
- Capital gains

**Income Tax:**
- England/Wales/NI: PA→20%→40%→45%
- Scotland: 6-tier bands (19%→20%→21%→42%→45%→48%)
- Personal Allowance taper (£100K-£125,140, 60% effective rate)
- Marriage Allowance transfer (£1,260)
- Blind Person's Allowance (£3,070)

**National Insurance:**
- Class 1 employee: 8% on £12,570-£50,270, 2% above
- Class 2 (self-employed): £3.45/week if profits > £12,570
- Class 4 (self-employed): 9% on £12,570-£50,270, 2% above

**Capital Gains Tax:**
- Annual exempt amount: £3,000
- Residential property: 18%/28% (basic/higher rate taxpayer — updated 2024)
- Other assets: 10%/20%
- Entrepreneurs' Relief (Business Asset Disposal Relief): 10% up to £1M lifetime
- Share identification (30-day rule, section 104 pool)

**Reliefs & Allowances:**
- ISA allowance: £20,000 (not taxable, just for awareness)
- Pension Annual Allowance: £60,000 (tapered above £260K)
- Personal Savings Allowance: £1,000 (basic) / £500 (higher)
- Dividend Allowance: £500
- Trading Allowance: £1,000
- Property Allowance: £1,000
- Rent-a-Room Relief: £7,500

**Special Calculations:**
- Child Benefit High Income Tax Charge (1% per £200 above £60K, clawback at £80K)
- High Income Child Benefit Charge
- High Income Earner pension tapered annual allowance (tapering from £260K)
- Pension carry-forward (unused allowance from last 3 years)
- Student loan repayments (all plans)

---

## UI Design System — MNC Grade

**Aesthetic:** Professional financial terminal. Not a colorful app — a tool.
Reference: Linear.app navigation + Wise dashboard numbers + Bloomberg data density.

**Typography:**
- Font: `Inter` (via next/font/google)
- Numbers: `tabular-nums` feature, monospace feel for financial figures
- Heading scale: 32/24/20/16/14/12px

**Colors (CSS variables):**
```
Light: bg #FAFAFA, surface #FFFFFF, border #E4E4E7, text #09090B, muted #71717A
Dark:  bg #09090B, surface #141414, border #27272A, text #FAFAFA, muted #A1A1AA
Accent (primary): #2563EB (blue-600)
India: #E67E22 (amber, professional)
US:   #2563EB (blue, corporate)
UK:   #C0392B (crimson, formal)
Success: #16A34A | Warning: #D97706 | Danger: #DC2626
```

**Component style:**
- Cards: `rounded-xl border bg-surface shadow-sm` — clean, no gradients on cards
- Inputs: `rounded-lg border bg-background h-10 px-3 text-sm` — dense, professional
- Buttons: solid primary or ghost — no rounded-full pills anywhere
- Tables: proper thead/tbody, striped rows, sticky header
- Numbers: always right-aligned, formatted with thousands separator

**Layout:**
- Max width 1440px
- 3-panel layout on desktop: sidebar nav (240px) + form (480px) + results (fill)
- Collapsible form sections with chevron icons
- Sticky results panel that updates as you type
- Print/PDF button fixed in results panel

**No emojis anywhere.** Use Lucide React icons only.

---

## Completed Milestones

- ✅ M1: Scaffold + deps
- ✅ M2: Types + slab configs
- ✅ M3: Tax engines v1 (104 tests)
- ✅ M4: Store + formatters
- ✅ M5-M8: Basic UI + components
- ✅ M9: Route pages + comparison + PDF
- ✅ M10: Build fixes
- ✅ M11: SEO + sitemap
- ✅ M12: Dark mode + Framer Motion

---

## What To Build Next (v2 — CA Replacement)

### ✅ M13 — Design System Rebuild (DONE)
- `globals.css`: full CSS token system (light/dark), `grid-pattern`, `.num` class, smooth transitions
- `Header`: BarChart3 logo, active underline nav, Sun/Moon dark mode toggle, mobile-responsive
- `Footer`: minimal professional, disclaimer, logo
- `layout.tsx`: Inter font, metadata, AdSense hook
- `page.tsx`: hero with grid-pattern, stats bar, country cards with left-border accent, no emojis
- **Pushed ✓**

### ✅ M14 — India Engine v2 (DONE)
- All income heads: salary, house property, business (44AD/44ADA/regular), capital gains, other sources
- All Chapter VI-A deductions (80C through 80U, 80TTB for seniors)
- Capital gains: equity STCG 20%, LTCG 12.5% above ₹1.25L, debt at slab, property with CII indexation
- ITR form recommendation, advance tax schedule, TDS reconciliation
- **Tests: 137/137 pass ✓ | Pushed ✓**

### ✅ M15 — US Engine v2 (DONE)
- All 15 states + DC with flat/progressive brackets
- Capital gains (LTCG at preferential rates), NIIT 3.8%, AMT (simplified)
- Credits: Child Tax Credit, EITC, Dependent Care, Education (AOTC/LLC), Saver's Credit
- QBI deduction (Section 199A), Social Security taxation
- **Tests included | Pushed ✓**

### ✅ M16 — UK Engine v2 (DONE)
- Capital gains: residential property 18%/28%, other 10%/20%, £3K annual exempt
- Marriage Allowance, Child Benefit High Income Charge
- Extended income: self-employment, rental, savings interest
- **Tests included | Pushed ✓**

### ✅ M17-M19 — Comprehensive Form UIs (DONE)
- **IndiaForm v2**: 8 sections — Regime/Age, Salary (with HRA), House Property, Business, Capital Gains (7 types), Other Sources, Chapter VI-A (all deductions), TDS/Advance Tax
- **USForm v2**: 5 sections — Filing Info, Additional Income, Deductions, Above-the-line Adjustments, Credits
- **UKForm v2**: 5 sections — Employment, 60% trap warning, Pension, Additional Income, Capital Gains, Reliefs
- All forms: collapsible sections, `Field` + `SegmentControl` components, professional dense inputs, zero emojis
- **Pushed ✓**

### ✅ M20 — Results Panel v2 (DONE)
- Section-based collapsible layout with Lucide icons
- Full tax computation table (GTI → deductions → taxable income → components)
- Advance Tax Schedule table (India)
- ITR form recommendation + tax still payable (India)
- PDF download button
- Animated KPI cards with Framer Motion stagger
- **Pushed ✓**

### ✅ M21 — Compare Page v2 + Final QA (DONE)
- CompareCalculator rebuilt: no emojis, CSS token system, Lucide icons
- Country cards with left-border accent, rank badges (TrendingUp/Down), full comparison table
- Recharts horizontal bar chart with CSS variable colors
- All 157 tests pass · clean `next build` exit 0
- **Pushed ✓**

### [ARCHIVED] 🔲 M21 — Compare Page v2 (old placeholder)
Replace all existing UI components with the MNC-grade design system above.
- New `app/globals.css` (token-based, light+dark)
- New `components/ui/` primitives (Input, Select, Card, Badge, Tabs, Button, Table)
- New Header (no emojis, clean nav, dark mode toggle with Sun/Moon icon)
- New Footer (legal, minimal)
- Sidebar layout for calculator pages
- Push after done

### 🔲 M14 — India Engine v2
Expand `engine/india.ts` to cover all income heads and deductions above.
Add `engine/__tests__/india-v2.test.ts` with comprehensive scenarios.
Push after done.

### 🔲 M15 — US Engine v2
Expand `engine/us.ts`: all 15 states, capital gains, NIIT, AMT (simplified), credits table, QBI.
Push after done.

### 🔲 M16 — UK Engine v2
Expand `engine/uk.ts`: CGT, Class 2/4 NI, marriage allowance, child benefit charge, property allowance.
Push after done.

### 🔲 M17 — India Form UI v2
Multi-section form covering all income heads.
Collapsible sections: Salary | House Property | Business | Capital Gains | Other Sources | Deductions.
Push after done.

### 🔲 M18 — US Form UI v2
Multi-section: Income | Adjustments | Deductions | Credits | Special Taxes.
Push after done.

### 🔲 M19 — UK Form UI v2
Multi-section: Employment | Self-Employment | Property | Capital Gains | Reliefs.
Push after done.

### 🔲 M20 — Results Panel v2
Professional tax assessment report layout:
- Income summary table (all heads)
- Deductions breakdown table
- Tax computation table (step-by-step like actual assessment order)
- Final tax liability with components
- Advance tax schedule (India)
- ITR form recommendation (India)
- Multi-page PDF export (professional quality)
Push after done.

### 🔲 M21 — Compare Page v2 + Final Build
Updated comparison page. Full `npm run build` clean. All tests pass. Push. Done.

---

## v3 — Bridging the CA Gap (What To Build Next)

These milestones add features that genuinely differentiate from a basic calculator.
All pages must use the existing CSS token design system (--surface, --border, --text-primary, etc.)
No emojis. Lucide icons only. After every milestone: commit + push.

---

### ✅ M22 — DONE
- **Pushed ✓**

### ~~🔲 M22 — What-If Tax Planning Tools (app/plan page)~~

**Route:** `/plan`  
**Purpose:** Let user model future decisions before making them — closest we can get to a CA's prospective planning.

**Features to build:**

#### India — Salary Restructuring Optimizer
- Input: Current CTC (total cost to company)
- Compute optimal component split: Basic + DA + HRA (40%/50% of basic) + LTA (2 trips/4yr block) + Professional Tax (₹2,500) + NPS employer (10% of basic) + Food Allowance (₹26,400/yr exempt) + remaining as special allowance
- Show: current tax vs restructured tax vs potential saving
- Key rule: HRA exemption = min(actual HRA, rent paid - 10% of basic, 50%/40% of basic for metro/non-metro)

#### India — LTCG Timing Optimizer
- Input: Asset purchase date, purchase price, current sale price
- Show: tax if sold before April 1 (current FY) vs after April 1 (next FY)
- Highlight 2-year LTCG threshold for property
- Show CII indexation benefit for property

#### India — NPS Optimization Tool
- Input: Current 80C investments, salary
- Show: additional NPS 80CCD(1B) ₹50K saving + employer NPS 80CCD(2) headroom
- Calculate exact tax saving at current marginal rate

#### India — HUF Tax Splitting Tool (informational)
- Input: Total family income
- Show: How routing ₹X through an HUF (which gets its own basic exemption) could reduce overall family tax
- Disclaimer: "Consult a CA to set up HUF legally"

**UI:** 4 tabs on `/plan` page. Each tab = a planning tool. Results panel on the right (same pattern as calculator pages).

---

### 🔲 M23 — Multi-Year Loss Carry-Forward Tracker (app/carryforward page)

**Route:** `/carryforward`  
**Purpose:** Track losses from prior years that reduce this year's tax — something the app is currently stateless about.

**Features:**

#### Types to add to engine/types.ts:
```ts
export interface CarryForwardLoss {
  type: 'business' | 'ltcg' | 'stcg' | 'house_property' | 'depreciation';
  amount: number;
  yearOfLoss: string; // "FY 2022-23"
  expiryYear: string; // "FY 2030-31" (8yr for business; indefinite for depreciation)
  remainingBalance: number;
}
```

#### Logic:
- Business loss: max 8 years, can only set off against business income
- Unabsorbed depreciation: indefinite, set off against any income
- LTCG loss: 8 years, only against LTCG
- STCG loss: 8 years, against LTCG or STCG
- House property loss: already capped at ₹2L/yr — show cumulative BF loss

#### UI:
- Form to enter BF losses (year, type, amount)
- Table showing each loss with expiry, remaining balance, this-year setoff
- How much tax is saved this year due to BF losses
- Warning when a loss is expiring next year

---

### 🔲 M24 — Document Checklist & AIS/26AS Validator (app/checklist page)

**Route:** `/checklist`  
**Purpose:** Based on user's income profile, tell them exactly what documents to collect — closes the "document review" gap.

**Features:**

#### Smart Checklist Generator
- User selects: income sources (salary / house property / business / capital gains / other)
- App outputs: exact list of documents needed for each
  - Salary → Form 16 Part A+B, Form 12BA, Pay slips, Rent receipts (if HRA), LTA travel bills
  - House Property → Loan statement (interest certificate), Municipal tax receipt, Rent agreement
  - Capital Gains (equity) → Consolidated account statement, broker capital gains report
  - Capital Gains (property) → Sale deed, purchase deed, stamp duty receipt, CII table
  - Business → P&L, Balance sheet, GST returns, bank statements, investment proof
  - FD/Interest → Bank TDS certificate (Form 16A), FD maturity receipts

#### AIS/26AS Cross-Check Guide
- Input: what you reported vs what might appear in AIS
- Common mismatches to warn about:
  - Interest income in AIS that users forget to report
  - Dividend income (companies report to IT dept)
  - Property purchase/sale transactions (SFT reporting by registrar)
  - High-value cash transactions
- Show: "These items appear in AIS automatically — if you miss them, you'll get a notice"

#### ITR Form Guide
- Based on income sources entered, show which ITR form to file
- Explain what each form is and what happens if you file the wrong one
- Already computed in India engine (itrFormRecommended) — surface it clearly here

**UI:** Step-by-step wizard. Select income sources → generate checklist → download as PDF.

---

### 🔲 M25 — India Advanced: Section 50C / 56(2)(x) / Unlisted Shares (engine additions)

**Purpose:** Cover business-client complexity that's currently missing from the India engine.

#### Section 50C (Property sale below stamp duty value)
- If sale consideration < stamp duty value → deemed sale consideration = stamp duty value
- Add `stampDutyValue` field to `CapitalGainEntry` for property type
- Compute: if saleValue < stampDutyValue → use stampDutyValue for capital gains
- Show warning: "Stamp duty value exceeds sale price — taxed on ₹X not ₹Y"

#### Section 56(2)(x) — Gift Tax
- If gift received from non-relative > ₹50,000 → fully taxable as "other sources"
- Add `giftReceived` and `giftFromRelative` fields to IndiaInput
- Show breakdown: exempt vs taxable portion

#### Unlisted Shares Capital Gains
- STCG (held < 24 months): slab rate
- LTCG (held ≥ 24 months): 12.5% without indexation (post-Budget 2024)
- Add `assetType: 'unlisted_shares'` to CapitalGainEntry

#### Startup / Section 80-IAC
- Tax holiday for eligible startups (100% deduction for 3 consecutive years out of first 10)
- Add `section80IAC?: number` deduction to IndiaInput

**Add tests for each new scenario.**

---

## Commit Convention

```
milestone: M13 — design system rebuild
milestone: M14 — India engine v2 (all income heads + deductions)
```

## Run Commands
```bash
cd /home/prime/Tax/taxcalc-global
npm run dev        # dev on :3000
npm run test       # vitest (must stay green)
npm run build      # must exit 0 after every milestone
```
