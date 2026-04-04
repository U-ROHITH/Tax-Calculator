# TaxCalc Global — Agent Mission File v2

> Read this entire file before touching any code.
> After every milestone: git add -A → commit → push → update this file → continue.

---

## The Mission (Revised)

**This is not a basic tax calculator. It must replace a Chartered Accountant.**

Every computation a CA does for income tax filing must be available here:
- All income heads (salary, house property, business, capital gains, other sources)
- Every deduction under Chapter VI-A (India), every credit and schedule (US), all reliefs (UK)
- Capital gains with indexation, advance tax schedule, interest u/s 234A/B/C
- Results that look like a professional tax assessment report, not a student project

**UI standard:** MNC fintech grade. Think Wise, Monzo, Linear.app, Bloomberg Terminal.
- Zero emojis anywhere in the UI — use Lucide icons
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

### 🔲 M21 — Compare Page v2 + Final QA
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
