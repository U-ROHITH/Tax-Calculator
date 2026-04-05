export interface BlogArticle {
  slug: string;
  title: string;
  description: string;
  date: string;
  country: 'IN' | 'US' | 'UK' | 'ALL';
  readingTime: number; // minutes
  content: string; // plain HTML — rendered with dangerouslySetInnerHTML
}

export const articles: BlogArticle[] = [
  {
    slug: 'old-vs-new-regime-india-2025',
    title: 'Old vs New Tax Regime India FY 2025-26 — Which is Better?',
    description:
      'A detailed comparison of the old and new income tax regimes for FY 2025-26, covering slabs, standard deduction, rebates, and when each regime wins.',
    date: '2025-04-01',
    country: 'IN',
    readingTime: 7,
    content: `
<h2>Background: Two Regimes, One Choice</h2>
<p>Since FY 2020-21, Indian taxpayers have had to choose between the <strong>Old Tax Regime</strong> (with deductions and exemptions) and the <strong>New Tax Regime</strong> (lower slab rates, fewer deductions). From FY 2023-24 onward, the New Regime became the <em>default</em> regime — you must explicitly opt into the old regime if you want it.</p>
<p>For FY 2025-26, the Finance Act 2025 retained the same structure with one notable update: the basic exemption limit in the new regime was raised to ₹4 lakh, and the 87A rebate was enhanced so that taxpayers with taxable income up to ₹12 lakh pay <em>zero tax</em> after applying the rebate (up from ₹7 lakh previously). This is a significant shift that makes the new regime even more attractive for the middle class.</p>

<h2>New Regime Tax Slabs (FY 2025-26)</h2>
<p>Under the new regime, the slab rates are:</p>
<ul>
  <li>Up to ₹4,00,000 — Nil</li>
  <li>₹4,00,001 to ₹8,00,000 — 5%</li>
  <li>₹8,00,001 to ₹12,00,000 — 10%</li>
  <li>₹12,00,001 to ₹16,00,000 — 15%</li>
  <li>₹16,00,001 to ₹20,00,000 — 20%</li>
  <li>₹20,00,001 to ₹24,00,000 — 25%</li>
  <li>Above ₹24,00,000 — 30%</li>
</ul>
<p>Additionally, a <strong>Section 87A rebate of ₹60,000</strong> is available in the new regime for taxable income up to ₹12 lakh. This means the effective tax on income up to ₹12 lakh is zero after the rebate. The standard deduction of <strong>₹75,000</strong> is available in the new regime for salaried employees and pensioners.</p>

<h2>Old Regime Tax Slabs (FY 2025-26)</h2>
<p>Under the old regime, the slabs remain:</p>
<ul>
  <li>Up to ₹2,50,000 — Nil</li>
  <li>₹2,50,001 to ₹5,00,000 — 5%</li>
  <li>₹5,00,001 to ₹10,00,000 — 20%</li>
  <li>Above ₹10,00,000 — 30%</li>
</ul>
<p>In the old regime, the Section 87A rebate is ₹12,500 and applies to taxable income up to ₹5 lakh. The standard deduction is ₹50,000 for salaried employees. Crucially, the old regime allows deductions under Chapter VI-A — including Section 80C (up to ₹1.5 lakh), Section 80D (health insurance), HRA exemption, LTA, home loan interest under Section 24(b), and many others.</p>

<h2>Key Deductions: Available Only in the Old Regime</h2>
<p>The following deductions and exemptions are <strong>not available</strong> in the new regime:</p>
<ul>
  <li><strong>Section 80C</strong> — PF, ELSS, PPF, LIC premium, home loan principal, tuition fees (up to ₹1.5 lakh)</li>
  <li><strong>Section 80D</strong> — Health insurance premiums (₹25,000 self + ₹25,000 parents; ₹50,000 for senior citizen parents)</li>
  <li><strong>HRA Exemption</strong> — Least of: actual HRA received, rent paid minus 10% of basic salary, or 50%/40% of basic for metro/non-metro</li>
  <li><strong>Section 24(b)</strong> — Home loan interest up to ₹2 lakh for self-occupied property</li>
  <li><strong>LTA</strong> — Leave Travel Allowance (twice in a block of 4 years)</li>
  <li><strong>Section 80TTA / 80TTB</strong> — Interest on savings account / FD for senior citizens</li>
  <li><strong>Section 80G</strong> — Donations to approved charitable organizations</li>
</ul>

<h2>When Does the Old Regime Win?</h2>
<p>The old regime is beneficial when you have <strong>substantial deductions</strong>. A rough threshold: if your total claimable deductions exceed ₹3.75 lakh to ₹4.25 lakh (depending on income level), the old regime typically saves more tax.</p>
<p><strong>Example — Old Regime wins:</strong> Gross salary ₹15 lakh. Rent paid in Delhi ₹25,000/month → HRA exemption ~₹1.5 lakh. 80C investments ₹1.5 lakh. 80D premium ₹25,000. Standard deduction ₹50,000. Total deductions: ~₹3.75 lakh. Taxable income: ₹11.25 lakh. Old regime tax ≈ ₹1,37,500 vs new regime tax (after standard deduction ₹75K) on ₹14.25 lakh ≈ ₹1,62,500. Old regime saves ~₹25,000.</p>
<p><strong>Typical candidates for old regime:</strong> Employees paying significant rent in metro cities, taxpayers maxing out 80C with ELSS/PPF, those paying health insurance premiums for themselves and parents, home loan holders claiming Section 24(b).</p>

<h2>When Does the New Regime Win?</h2>
<p>The new regime is better when you have <strong>few or no deductions</strong>, or when your income is below ₹12.75 lakh (salaried — ₹12L taxable + ₹75K standard deduction = ₹12.75L gross, zero tax after 87A rebate).</p>
<p><strong>Example — New Regime wins:</strong> Gross salary ₹10 lakh, no rent paid (company accommodation), minimal investments, no home loan. In the new regime: taxable income after ₹75K standard deduction = ₹9.25 lakh. Tax: 5% on ₹4L–₹8L = ₹20,000 + 10% on ₹8L–₹9.25L = ₹12,500. Total: ₹32,500. In the old regime with only ₹50K standard deduction and ₹1.5L 80C: taxable ₹8L. Tax: 20% on ₹3L = ₹60,000. New regime saves ₹27,500.</p>
<p><strong>Typical candidates for new regime:</strong> Young earners starting out without significant investments, freelancers and consultants with high expenses (who use presumptive taxation anyway), taxpayers earning below ₹12.75L (effectively zero tax), those without HRA (living in owned home or company quarters).</p>

<h2>The Decision Framework</h2>
<p>A practical approach: calculate your total deductions under the old regime. If they exceed approximately ₹3.75 lakh (₹4.25 lakh for incomes above ₹15 lakh), stick with the old regime. Otherwise, move to the new regime. Use TaxCalc Global's India calculator to compute both scenarios instantly with your actual numbers.</p>
<p>Note: salaried employees can switch between regimes every year. Business owners and professionals who opt out of the new regime can only switch back once in their lifetime.</p>
    `.trim(),
  },
  {
    slug: 'hra-exemption-calculation',
    title: 'How to Calculate HRA Exemption — 3 Methods with Examples',
    description:
      'Step-by-step guide to calculating HRA exemption under Section 10(13A) with worked examples for metro and non-metro cities, Form 12BB requirements, and PAN rules.',
    date: '2025-03-15',
    country: 'IN',
    readingTime: 6,
    content: `
<h2>What is HRA Exemption?</h2>
<p>House Rent Allowance (HRA) is a component of salary that many employers provide to cover employees' rental accommodation. Under Section 10(13A) of the Income Tax Act, a portion of HRA received is <strong>exempt from income tax</strong>, provided certain conditions are met — the most fundamental being that you must actually reside in rented accommodation and pay rent.</p>
<p>HRA exemption is available <strong>only under the old tax regime</strong>. If you opt for the new regime, the entire HRA received becomes fully taxable as part of your salary.</p>

<h2>The Three-Minimum Rule</h2>
<p>The HRA exemption is the <strong>least</strong> of the following three amounts:</p>
<ol>
  <li><strong>Actual HRA received</strong> from the employer during the year</li>
  <li><strong>Rent paid minus 10% of basic salary + DA</strong> (Dearness Allowance, if forming part of salary for retirement benefits)</li>
  <li><strong>50% of basic salary + DA</strong> for employees residing in metro cities (Delhi, Mumbai, Chennai, Kolkata), or <strong>40%</strong> for non-metro cities</li>
</ol>
<p>The amount computed above is exempt from tax. Any HRA received over and above this exempt amount is fully taxable.</p>

<h2>Worked Example — Metro City (Delhi)</h2>
<p>Consider an employee with the following salary structure (annual figures):</p>
<ul>
  <li>Basic salary: ₹6,00,000</li>
  <li>HRA received from employer: ₹2,40,000 (₹20,000/month)</li>
  <li>Actual rent paid: ₹3,00,000 (₹25,000/month)</li>
  <li>DA forming part of salary for retirement: Nil</li>
</ul>
<p>Calculating the three limits:</p>
<ol>
  <li>Actual HRA received: <strong>₹2,40,000</strong></li>
  <li>Rent paid minus 10% of basic: ₹3,00,000 − 10% × ₹6,00,000 = ₹3,00,000 − ₹60,000 = <strong>₹2,40,000</strong></li>
  <li>50% of basic (metro): 50% × ₹6,00,000 = <strong>₹3,00,000</strong></li>
</ol>
<p>The least of the three is ₹2,40,000. Therefore, the HRA exemption is <strong>₹2,40,000</strong> — the entire HRA received is exempt in this case.</p>

<h2>Worked Example — Non-Metro City (Pune)</h2>
<p>Same employee, same rent, same salary, but city is Pune (non-metro):</p>
<ol>
  <li>Actual HRA received: <strong>₹2,40,000</strong></li>
  <li>Rent paid minus 10% of basic: <strong>₹2,40,000</strong> (same as above)</li>
  <li>40% of basic (non-metro): 40% × ₹6,00,000 = <strong>₹2,40,000</strong></li>
</ol>
<p>All three limits coincide at ₹2,40,000 in this case. The exemption remains ₹2,40,000. However, if rent were lower — say ₹18,000/month (₹2,16,000/year):</p>
<ul>
  <li>Limit 2: ₹2,16,000 − ₹60,000 = ₹1,56,000</li>
  <li>Minimum becomes ₹1,56,000 — the taxable HRA would be ₹2,40,000 − ₹1,56,000 = ₹84,000</li>
</ul>

<h2>Higher Income Scenario — ₹10 Lakh Salary</h2>
<p>Employee with gross salary ₹10 lakh, basic ₹5 lakh, HRA ₹2 lakh, living in Mumbai paying ₹30,000/month rent:</p>
<ol>
  <li>Actual HRA: ₹2,00,000</li>
  <li>Rent − 10% basic: ₹3,60,000 − ₹50,000 = ₹3,10,000</li>
  <li>50% of basic (metro): ₹2,50,000</li>
</ol>
<p>Least = <strong>₹2,00,000</strong>. Entire HRA is exempt. This is common when employers provide modest HRA relative to market rents — the actual HRA cap becomes the binding constraint.</p>

<h2>Metro vs Non-Metro: Which Cities Qualify as Metro?</h2>
<p>For HRA purposes, only four cities are classified as <strong>metropolitan</strong> under Section 10(13A): Delhi, Mumbai, Chennai, and Kolkata. All other cities — including Bengaluru, Hyderabad, Pune, Ahmedabad, Jaipur — are non-metro, attracting the 40% limit. This is a common source of errors; many Bengaluru IT employees mistakenly claim 50% when they should claim 40%.</p>

<h2>Form 12BB — Submission to Employer</h2>
<p>To claim HRA exemption through your employer (TDS deduction), you must submit <strong>Form 12BB</strong> at the beginning of each financial year (April). The form requires:</p>
<ul>
  <li>Name and address of the landlord</li>
  <li>Amount of rent paid per month</li>
  <li>PAN of the landlord, if annual rent exceeds <strong>₹1,00,000</strong> (i.e., ₹8,333/month or more)</li>
</ul>
<p>If you don't provide Form 12BB, your employer will not account for HRA exemption while deducting TDS — you'll need to claim it yourself while filing your ITR.</p>

<h2>PAN Requirement for Landlord</h2>
<p>If your annual rent exceeds ₹1 lakh, you must furnish your landlord's PAN to your employer. If the landlord doesn't have a PAN, they must provide a declaration to that effect in Form 60. Failure to provide PAN/Form 60 will result in the employer not granting the HRA exemption for TDS purposes. Note that you can still claim it in your ITR, but you may receive a notice asking for evidence of rent payment and the landlord's PAN.</p>

<h2>Important Rules and Edge Cases</h2>
<ul>
  <li><strong>Self-owned property:</strong> You cannot claim HRA if you live in your own house. However, if you own a house in City A but work and rent in City B, you can claim both HRA (for the rented accommodation) and Section 24(b) deduction (for the home loan on the owned house).</li>
  <li><strong>Rent receipts:</strong> Maintain rent receipts for all months. Revenue-stamped receipts are required for monthly rent above ₹3,000 (though this threshold is archaic and many employers ask for all receipts).</li>
  <li><strong>Rent to family members:</strong> You can pay rent to a parent (not spouse) and claim HRA, provided the parent declares it as rental income. This is a legitimate planning tool.</li>
  <li><strong>No HRA from employer:</strong> Salaried individuals who do not receive HRA can claim deduction under Section 80GG (up to ₹60,000/year) subject to conditions.</li>
</ul>
    `.trim(),
  },
  {
    slug: 'ltcg-equity-budget-2024',
    title: 'LTCG Tax on Equity After Budget 2024 — What Changed',
    description:
      'Budget 2024 changed LTCG and STCG rates on equity effective July 23, 2024. Understand the new 12.5% LTCG rate, ₹1.25 lakh exemption, removal of indexation, and impact on equity mutual funds.',
    date: '2025-02-10',
    country: 'IN',
    readingTime: 7,
    content: `
<h2>The Budget 2024 Overhaul — A Summary</h2>
<p>The Union Budget 2024, presented on July 23, 2024, made sweeping changes to capital gains taxation on equity and equity mutual funds. The changes apply to <strong>transfers on or after July 23, 2024</strong> — transactions before that date are governed by the older rules. This split-year tax treatment has created complexity for investors who transacted in both periods of FY 2024-25.</p>

<h2>Before July 23, 2024 — The Old Rules</h2>
<p>Prior to Budget 2024, the capital gains tax structure on equity was:</p>
<ul>
  <li><strong>LTCG (Long-Term Capital Gains)</strong>: 10% on gains exceeding ₹1,00,000 per year (no indexation benefit). The holding period for equity shares and equity-oriented mutual funds was 12 months.</li>
  <li><strong>STCG (Short-Term Capital Gains)</strong>: 15% flat rate.</li>
  <li><strong>Grandfathering:</strong> Gains on equity acquired before January 31, 2018 were computed using the <em>higher</em> of actual cost or fair market value (highest price on NSE/BSE) as of January 31, 2018, effectively grandfathering all pre-2018 gains.</li>
  <li>Securities Transaction Tax (STT) was required to be paid on the sale — a mandatory condition to avail the concessional rates.</li>
</ul>

<h2>After July 23, 2024 — The New Rules</h2>
<p>Effective July 23, 2024, the capital gains structure on equity is:</p>
<ul>
  <li><strong>LTCG</strong>: <strong>12.5%</strong> on gains exceeding ₹1,25,000 per year (up from 10% and ₹1 lakh threshold).</li>
  <li><strong>STCG</strong>: <strong>20%</strong> flat rate (up from 15%).</li>
  <li><strong>No indexation</strong> — this was already unavailable for equity, but the removal was explicitly reconfirmed. (Note: indexation was removed for debt mutual funds from April 1, 2023; for equity it was never available.)</li>
  <li>The grandfathering clause for pre-January 31, 2018 acquisitions continues to apply for LTCG computation.</li>
  <li>STT requirement remains for concessional rates.</li>
</ul>

<h2>STT Requirement</h2>
<p>Securities Transaction Tax (STT) must be paid on the sale of equity shares and equity-oriented mutual fund units to avail the 12.5%/20% concessional rates. If shares are sold off-market (e.g., in a buyback or through private transfer), STT is not levied, and the applicable rate becomes 20% (long-term) or slab rate (short-term) under general capital gains rules. For exchange-listed transactions, STT is automatically charged by the exchange — no separate action required.</p>

<h2>What Counts as Equity-Oriented Fund?</h2>
<p>An equity-oriented mutual fund is one that invests at least <strong>65% of its corpus in equity shares</strong> of domestic companies. This includes:</p>
<ul>
  <li>Large-cap, mid-cap, small-cap funds</li>
  <li>Flexicap, multi-cap, sectoral funds</li>
  <li>Equity-Linked Savings Schemes (ELSS — though gains here are mostly long-term given the 3-year lock-in)</li>
  <li>Balanced Advantage Funds / Aggressive Hybrid Funds (typically ≥65% equity)</li>
</ul>
<p><strong>Not covered:</strong> Debt funds, liquid funds, money market funds, international funds (these invest in overseas equities but do not meet the 65% domestic equity threshold — taxed as debt).</p>

<h2>Debt Mutual Funds — Separate (Harsh) Regime</h2>
<p>Since April 1, 2023 (Budget 2023), gains from <strong>debt mutual funds</strong> are taxed at <strong>slab rates</strong> regardless of holding period. The earlier LTCG with indexation benefit (20% with indexation after 3 years) has been completely withdrawn. This applies to:</p>
<ul>
  <li>Pure debt funds (gilt, corporate bond, credit risk)</li>
  <li>International funds (irrespective of equity content)</li>
  <li>Gold ETFs and Fund-of-Funds</li>
  <li>Conservative hybrid funds (&lt;65% equity)</li>
</ul>

<h2>Practical Impact: FY 2024-25 Split Year</h2>
<p>For FY 2024-25, investors need to split their capital gains into two periods:</p>
<ul>
  <li><strong>April 1, 2024 to July 22, 2024</strong>: Old rates apply (LTCG 10% above ₹1L, STCG 15%)</li>
  <li><strong>July 23, 2024 to March 31, 2025</strong>: New rates apply (LTCG 12.5% above ₹1.25L, STCG 20%)</li>
</ul>
<p>The ₹1.25 lakh annual exemption is available for the full year (not pro-rated). Brokerage platforms like Zerodha, Groww, and Kuvera have updated their tax P&amp;L reports to reflect this split.</p>

<h2>LTCG Exemption and Set-Off</h2>
<p>The ₹1,25,000 LTCG exemption (Section 112A) applies to the <em>aggregate</em> of all equity LTCG — both direct equity and equity mutual funds. It cannot be set off against short-term capital losses. LTCG losses under Section 112A can only be set off against LTCG under the same section, and can be carried forward for 8 assessment years.</p>

<h2>Advance Tax Implications</h2>
<p>Capital gains are included in taxable income for advance tax purposes. If your LTCG from equity is substantial, you may need to pay advance tax in the relevant installment (especially the September 15 and March 15 installments). Failure to pay adequate advance tax attracts interest under Sections 234B and 234C.</p>

<h2>Key Takeaways</h2>
<ul>
  <li>LTCG on equity is now 12.5% above ₹1.25 lakh (vs. 10% above ₹1 lakh previously).</li>
  <li>STCG jumped from 15% to 20% — a significant 33% increase in the tax rate.</li>
  <li>The changes apply from July 23, 2024 onward; pre-July transactions use old rates.</li>
  <li>Debt mutual funds remain at slab rates with no LTCG benefit — no change from April 2023.</li>
  <li>Grandfathering of pre-January 31, 2018 cost continues under Section 112A.</li>
</ul>
    `.trim(),
  },
  {
    slug: 'us-freelancer-tax-guide-2025',
    title: 'US Freelancer Tax Guide 2025 — SE Tax, Quarterly Payments, QBI Deduction',
    description:
      'Complete guide to US freelancer taxes in 2025: self-employment tax calculation, quarterly estimated payment dates, QBI deduction, safe harbor rules, and retirement account options.',
    date: '2025-03-01',
    country: 'US',
    readingTime: 8,
    content: `
<h2>The Freelancer Tax Reality</h2>
<p>Freelancers in the United States face a fundamentally different tax situation from W-2 employees. When you're self-employed, you are both the employee and the employer — which means you pay both sides of FICA (Social Security and Medicare) taxes, you're responsible for your own quarterly tax payments, and you must track deductible business expenses meticulously. Understanding these rules is essential to avoiding underpayment penalties and optimizing your tax bill.</p>

<h2>Self-Employment (SE) Tax — The Foundation</h2>
<p>The self-employment tax rate is <strong>15.3%</strong>, composed of:</p>
<ul>
  <li>Social Security: 12.4% on net self-employment income up to the Social Security wage base ($176,100 for 2025)</li>
  <li>Medicare: 2.9% on all net self-employment income (no cap)</li>
  <li>Additional Medicare: 0.9% on net SE income above $200,000 (single) / $250,000 (married filing jointly)</li>
</ul>
<p>However, SE tax is not calculated on 100% of your net profit. The IRS applies a 92.35% multiplier, as it mirrors the employee-side only. The formula:</p>
<p><strong>SE Tax = Net SE Income × 0.9235 × 15.3%</strong></p>
<p>Example: Net SE income $80,000. SE Tax = $80,000 × 0.9235 × 0.153 = $11,308.</p>

<h2>Above-the-Line Deduction for SE Tax</h2>
<p>You can deduct <strong>50% of your SE tax</strong> as an above-the-line deduction on Form 1040, Schedule 1. This reduces your adjusted gross income (AGI) — not just your taxable income — which means it benefits you even if you take the standard deduction. In the example above: SE tax deduction = $11,308 / 2 = $5,654.</p>

<h2>QBI Deduction — Section 199A</h2>
<p>The Qualified Business Income (QBI) deduction, introduced by the Tax Cuts and Jobs Act (TCJA) and currently extended through 2025, allows eligible self-employed individuals to deduct <strong>up to 20% of their net qualified business income</strong>.</p>
<p>Key rules:</p>
<ul>
  <li>The deduction is 20% of QBI, but capped at 20% of (taxable income minus net capital gains)</li>
  <li>For most freelancers with income below the threshold ($197,300 single / $394,600 MFJ for 2025), the deduction is straightforward: 20% of net SE income after SE tax deduction</li>
  <li>Above the threshold, Specified Service Trades or Businesses (SSTBs) — including consultants, financial advisors, attorneys, health professionals — face phase-out of the deduction</li>
  <li>The deduction is a below-the-line deduction (reduces taxable income, not AGI)</li>
</ul>
<p>Example: Net SE income $80,000. SE tax deduction $5,654. QBI = $80,000 − $5,654 = $74,346. QBI deduction = $74,346 × 20% = $14,869. This is a powerful deduction — equivalent to dropping from the 22% bracket to an effective rate of about 17.6% on SE income.</p>

<h2>Quarterly Estimated Tax Payments — 2025 Dates</h2>
<p>As a freelancer, you are required to pay taxes throughout the year via estimated payments. The 2025 due dates are:</p>
<ul>
  <li><strong>Q1 (Jan 1 – Mar 31):</strong> April 15, 2025</li>
  <li><strong>Q2 (Apr 1 – May 31):</strong> June 16, 2025</li>
  <li><strong>Q3 (Jun 1 – Aug 31):</strong> September 15, 2025</li>
  <li><strong>Q4 (Sep 1 – Dec 31):</strong> January 15, 2026</li>
</ul>
<p>Use <strong>Form 1040-ES</strong> to calculate and submit payments. You can pay via IRS Direct Pay (free), EFTPS, or the IRS2Go app. State estimated taxes are separate — most states follow similar quarterly schedules.</p>

<h2>Safe Harbor Rules — Avoid Underpayment Penalties</h2>
<p>You avoid underpayment penalties (Section 6654) if you meet one of the following safe harbors:</p>
<ul>
  <li><strong>90% of current year tax:</strong> Pay at least 90% of your 2025 total tax liability through withholding and estimated payments</li>
  <li><strong>100% of prior year tax</strong> (110% if prior year AGI exceeded $150,000): Pay estimated taxes equal to 100% (or 110%) of your 2024 total tax liability</li>
</ul>
<p>The 100%/110% of prior year rule is often easier for freelancers with variable income — divide last year's total tax by 4 and pay that each quarter. Adjust upward if income is significantly higher.</p>

<h2>Key Business Deductions</h2>
<p>Legitimate business deductions reduce your net SE income — reducing both SE tax and income tax. Common deductions:</p>
<ul>
  <li>Home office (regular and exclusive use): Simplified method ($5/sq ft, max 300 sq ft) or actual expenses method</li>
  <li>Business-use portion of phone and internet</li>
  <li>Software subscriptions, equipment, office supplies</li>
  <li>Professional development: courses, books, conference fees</li>
  <li>Health insurance premiums (100% deductible as above-the-line adjustment if not eligible for employer coverage)</li>
  <li>Retirement plan contributions (see below)</li>
  <li>Travel, meals (50%), and business miles ($0.70/mile for 2025)</li>
</ul>

<h2>Retirement Accounts — Major Tax Shelter</h2>
<p>Self-employed individuals can make very large tax-deductible retirement contributions:</p>
<ul>
  <li><strong>SEP-IRA:</strong> Contribute up to 25% of net SE income (after SE tax deduction), maximum $69,000 for 2025. Entirely employer contribution. Simple to set up.</li>
  <li><strong>Solo 401(k):</strong> Employee contribution: $23,500 (plus $7,500 catch-up if age 50+). Employer contribution: 25% of net SE income. Combined max: $69,000 ($76,500 with catch-up). Best for high-income freelancers.</li>
  <li><strong>Traditional IRA:</strong> $7,000 ($8,000 if 50+). Deductibility phases out above $87,000 AGI (single) if covered by workplace plan — but self-employed with no workplace plan can always deduct.</li>
</ul>
<p>Retirement contributions reduce your AGI and taxable income, which in turn reduces your QBI deduction base — but the net tax saving from the contribution still exceeds the reduced QBI deduction for most taxpayers in the 22%+ brackets.</p>

<h2>State Taxes</h2>
<p>Don't forget state income taxes. California freelancers face up to 13.3% state income tax, New York up to 10.9%. States also have their own self-employment tax equivalents and quarterly payment requirements. If you work for clients in multiple states, nexus rules may create multistate filing obligations.</p>
    `.trim(),
  },
  {
    slug: 'uk-60-percent-tax-trap',
    title: 'UK 60% Tax Trap — The Personal Allowance Taper Explained',
    description:
      "Income between £100,000 and £125,140 is effectively taxed at 60% due to the Personal Allowance taper. Here's how it works and how to legally avoid it.",
    date: '2025-02-20',
    country: 'UK',
    readingTime: 6,
    content: `
<h2>The Hidden 60% Tax Rate</h2>
<p>Most UK taxpayers know about the 20%, 40%, and 45% income tax rates. What fewer realise is that there is an effective <strong>60% marginal tax rate</strong> that applies to income between £100,000 and £125,140. This arises not from a tax rate above 45%, but from the tapering away of the Personal Allowance — and it affects a growing number of professionals, senior employees, and self-employed individuals.</p>

<h2>How the Personal Allowance Taper Works</h2>
<p>The standard Personal Allowance (PA) for 2025-26 is <strong>£12,570</strong>. Every individual — regardless of income — is entitled to receive this much income tax-free.</p>
<p>However, under Section 35 of the Income Tax Act 2007, the PA is <strong>reduced by £1 for every £2 of adjusted net income above £100,000</strong>. This means:</p>
<ul>
  <li>At £100,000 income: PA = £12,570 (full)</li>
  <li>At £106,000 income: PA = £12,570 − (£6,000 / 2) = £12,570 − £3,000 = £9,570</li>
  <li>At £112,570 income: PA = £12,570 − (£12,570 / 2) = £12,570 − £6,285 = £6,285</li>
  <li>At £125,140 income: PA = £12,570 − (£25,140 / 2) = £12,570 − £12,570 = <strong>£0</strong></li>
</ul>
<p>Above £125,140, the PA is fully withdrawn and the standard 45% additional rate applies (40% higher rate below this for income in the £50,271–£125,140 band, which overlaps with the taper zone).</p>

<h2>Why It Becomes 60%</h2>
<p>In the taper zone (£100,000–£125,140), you are in the 40% higher rate band. For every additional £2 of income you earn, you:</p>
<ol>
  <li>Pay 40% income tax on that £2 = £0.80</li>
  <li>Lose £1 of Personal Allowance, which was sheltering income that is now taxed at 40% = £0.40</li>
</ol>
<p>Total tax on £2 of extra income = £0.80 + £0.40 = £1.20. Effective marginal rate = £1.20 / £2 = <strong>60%</strong>.</p>
<p>To put it concretely: earning £101,000 instead of £100,000 costs you approximately £600 in additional income tax (40% on the £1,000 extra earned = £400, plus 40% on the £500 of PA lost = £200). You keep only £400 out of £1,000 of additional gross income.</p>

<h2>Adjusted Net Income — What Goes In</h2>
<p>The PA taper is based on <strong>adjusted net income (ANI)</strong>, not gross income. ANI is calculated as:</p>
<p>Gross income − pension contributions (if paid gross, e.g., SIPP) − gift aid donations (grossed up) − trading losses − certain other reliefs</p>
<p>This is critically important: if you can reduce your ANI below £100,000, you recover your full Personal Allowance.</p>

<h2>Strategies to Avoid the 60% Trap</h2>
<h3>1. Pension Contributions</h3>
<p>Making additional pension contributions is the most effective strategy. Contributing to a SIPP (Self-Invested Personal Pension) or increasing workplace pension contributions reduces your ANI pound-for-pound.</p>
<p>Example: Gross income £120,000. Without action, effective rate on £100K–£120K is 60%. Contribute £20,000 to a SIPP — ANI drops to £100,000. You recover the full £12,570 PA and save approximately £4,000 in additional income tax. The pension contribution effectively costs you £8,000 net (£20,000 - £12,000 basic rate relief already added - £4,000 additional tax saving through PA recovery).</p>

<h3>2. Salary Sacrifice</h3>
<p>If employed, ask your employer about salary sacrifice arrangements for pension, cycle-to-work, or childcare vouchers. Salary sacrifice reduces your gross income directly, reducing both income tax and NI contributions.</p>

<h3>3. Gift Aid Donations</h3>
<p>Charitable donations under Gift Aid are grossed up and deducted from ANI. A £8,000 cash donation becomes £10,000 grossed up (basic rate tax relief added by charity), reducing your ANI by £10,000.</p>

<h3>4. Timing of Income</h3>
<p>Self-employed individuals or directors of their own companies have flexibility in timing bonuses, dividends, or invoicing. Deferring income to a year where it won't push you into the £100K–£125,140 band can be tax-efficient, subject to anti-avoidance rules.</p>

<h2>Scotland Has Separate Rates — But Same PA Taper</h2>
<p>Scotland has its own income tax bands (19%, 20%, 21%, 42%, 45%, 48% — the top rate is higher than rUK). However, the Personal Allowance and the PA taper are <strong>reserved matters</strong> — the £100,000 threshold and the taper mechanism apply equally to Scottish taxpayers. Scottish taxpayers in the £100K–£125,140 band face a different effective rate (as the higher rate is 42% not 40%), making the effective marginal rate approximately 63% rather than 60%.</p>

<h2>Marriage Allowance — Separate Mechanism</h2>
<p>The Marriage Allowance (transferring £1,260 of unused PA from a lower-earning to a higher-earning spouse/civil partner) is a separate mechanism from the PA taper. If one partner's income is below £12,570 and the other is a basic rate taxpayer (not higher rate), the transfer saves up to £252/year. This has no interaction with the £100,000 PA taper.</p>

<h2>Self-Assessment and P800</h2>
<p>If your income exceeds £100,000, you are <strong>required to file a Self Assessment tax return</strong> — even if all your income is PAYE. HMRC will not automatically reconcile the PA taper through your tax code accurately. File a return to ensure you correctly calculate the tax on taper-affected income and claim any reliefs (pension contributions, gift aid) that can reduce your ANI.</p>
    `.trim(),
  },
  {
    slug: 'itr-form-selection-guide',
    title: 'Which ITR Form to File? Complete Guide for FY 2025-26',
    description:
      'A complete guide to selecting the correct ITR form for FY 2025-26 — covering ITR-1 Sahaj, ITR-2, ITR-3, and ITR-4 Sugam with eligibility conditions and consequences of filing the wrong form.',
    date: '2025-04-01',
    country: 'IN',
    readingTime: 7,
    content: `
<h2>Why the Right ITR Form Matters</h2>
<p>Filing your income tax return in the <strong>wrong ITR form</strong> is treated as a <em>defective return</em> under Section 139(9) of the Income Tax Act. The Income Tax Department will issue a defective return notice giving you 15 days to file a revised return in the correct form. If you don't comply, your return is treated as not filed at all — attracting penalties, loss of carry-forward benefits, and potential interest under Section 234A/234B/234C. Getting this right from the start saves significant hassle.</p>

<h2>ITR-1 Sahaj — The Simplest Form</h2>
<h3>Who can use ITR-1?</h3>
<p>ITR-1 is designed for individuals with straightforward income profiles:</p>
<ul>
  <li>Income from <strong>salary or pension</strong></li>
  <li>Income from <strong>one house property</strong> (excluding loss carry-forward from previous years)</li>
  <li>Income from <strong>other sources</strong> (interest, dividends, family pension) — excluding lottery, race-horse, etc.</li>
  <li>Agricultural income up to <strong>₹5,000</strong></li>
  <li><strong>Total income up to ₹50 lakh</strong></li>
</ul>
<h3>Who CANNOT use ITR-1?</h3>
<ul>
  <li>Director in a company</li>
  <li>Holder of unlisted equity shares at any time during the year</li>
  <li>Anyone with foreign assets or foreign income, or a signatory to any foreign account</li>
  <li>Those with income from capital gains (any amount)</li>
  <li>Those with more than one house property</li>
  <li>Agricultural income above ₹5,000</li>
  <li>Individuals with deferred income tax or tax credit under Section 91/92</li>
  <li>Resident Not Ordinarily Resident (RNOR) or Non-Resident (NR)</li>
</ul>

<h2>ITR-2 — Salaried with Capital Gains or Multiple Properties</h2>
<h3>Who should use ITR-2?</h3>
<p>ITR-2 covers individuals and HUFs who do not have income from business or profession, but have more complex income profiles:</p>
<ul>
  <li>Income from <strong>capital gains</strong> (sale of equity, mutual funds, property, bonds — any amount)</li>
  <li>Income from <strong>more than one house property</strong></li>
  <li><strong>Foreign income</strong> or foreign assets (NRIs, returnees with overseas accounts)</li>
  <li>Agricultural income above ₹5,000</li>
  <li>Income over ₹50 lakh (even from salary alone)</li>
  <li>Directors (even if no other complex income)</li>
  <li>Holders of unlisted equity shares</li>
</ul>
<h3>Key schedules in ITR-2:</h3>
<p>Schedule CG (capital gains), Schedule FA (foreign assets), Schedule AL (assets and liabilities for income &gt;₹50 lakh). The capital gains schedule requires detailed transaction-level reporting — ISIN, acquisition date and cost, sale date and consideration, STT paid. Brokerage P&amp;L reports are essential inputs.</p>

<h2>ITR-3 — Business and Professional Income (Non-Presumptive)</h2>
<h3>Who should use ITR-3?</h3>
<p>ITR-3 is for individuals and HUFs with income from <strong>business or profession</strong> computed under the normal provisions (not presumptive). This includes:</p>
<ul>
  <li>Freelancers, consultants, and professionals who maintain books of accounts</li>
  <li>Proprietors of any trading, manufacturing, or service business</li>
  <li>Partners in a partnership firm (salary, interest, and share of profit from firm)</li>
  <li>Anyone with a combination of salary + business/professional income</li>
</ul>
<p>ITR-3 is the most comprehensive form — it includes all schedules from ITR-2, plus P&amp;L account (Schedule BP), balance sheet for businesses with turnover above ₹25 lakh, audit report details (3CA/3CB/3CD), GSTR reconciliation, and more. If your accounts are required to be audited under Section 44AB, the audit report reference must be mentioned in ITR-3.</p>

<h2>ITR-4 Sugam — Presumptive Taxation</h2>
<h3>Who can use ITR-4?</h3>
<p>ITR-4 is a simplified form for individuals, HUFs, and partnership firms (excluding LLPs) opting for presumptive taxation under:</p>
<ul>
  <li><strong>Section 44AD</strong>: Business income, turnover up to ₹3 crore (cash receipts ≤ 5%), presumptive income = 8% or 6% (for digital receipts) of turnover</li>
  <li><strong>Section 44ADA</strong>: Specified professionals (doctors, lawyers, architects, engineers, CAs, etc.), gross receipts up to ₹75 lakh, presumptive income = 50% of receipts</li>
  <li><strong>Section 44AE</strong>: Goods carriage owners, presumptive income per vehicle</li>
</ul>
<p>Total income (after presumptive computation) must not exceed ₹50 lakh.</p>
<h3>Who CANNOT use ITR-4?</h3>
<ul>
  <li>Anyone with capital gains (sale of property, equity, bonds)</li>
  <li>Those with foreign assets or foreign income</li>
  <li>Directors of companies</li>
  <li>Holders of unlisted equity shares</li>
  <li>If income exceeds ₹50 lakh</li>
</ul>

<h2>Quick Selection Matrix</h2>
<table>
  <thead>
    <tr>
      <th>Income Profile</th>
      <th>Correct Form</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Salary only, income &lt; ₹50L, one house</td><td>ITR-1</td></tr>
    <tr><td>Salary + equity sales / mutual fund redemptions</td><td>ITR-2</td></tr>
    <tr><td>Salary + freelance income (books maintained)</td><td>ITR-3</td></tr>
    <tr><td>Small business / professional, presumptive, &lt; ₹50L</td><td>ITR-4</td></tr>
    <tr><td>Director in company (any salary level)</td><td>ITR-2 or ITR-3</td></tr>
    <tr><td>NRI with Indian income</td><td>ITR-2 (no business) or ITR-3 (business)</td></tr>
    <tr><td>HRA claim, 80C, 80D (no other complexity)</td><td>ITR-1 (if otherwise eligible)</td></tr>
  </tbody>
</table>

<h2>Consequences of Wrong Form</h2>
<p>Filing in the wrong form constitutes a defective return under Section 139(9). HMRC — correction: the <strong>Income Tax Department</strong> — will issue a notice under Section 139(9) giving you 15 days to respond with a rectified return in the correct form. The rectified return can be filed as a revised return.</p>
<p>If you fail to respond within 15 days: the return is treated as if it was never filed. This means:</p>
<ul>
  <li>Losses (capital, business) cannot be carried forward</li>
  <li>Refunds may be delayed or disallowed</li>
  <li>Late filing fee under Section 234F (up to ₹5,000) may apply on the corrected return</li>
  <li>Interest under Section 234A if taxes were due and not paid</li>
</ul>

<h2>Filing Deadline (FY 2025-26)</h2>
<p>The due date for filing ITR for FY 2025-26 (AY 2026-27) for individuals not subject to tax audit is <strong>July 31, 2026</strong>. For those with audit requirements, the extended deadline is typically October 31, 2026 (subject to official notification). Belated returns can be filed up to December 31, 2026 with a late fee.</p>
    `.trim(),
  },
];
