export type BlogCategory =
  | 'India Tax'
  | 'US Tax'
  | 'UK Tax'
  | 'Planning'
  | 'Crypto Tax'
  | 'NRI';

export interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  country: 'IN' | 'US' | 'UK' | 'ALL';
  readTime: number; // minutes
  date: string; // ISO
  featured?: boolean;
  content: string; // HTML
  toc: { id: string; label: string }[];
  calculatorCta?: { label: string; href: string };
}

export const blogArticles: BlogArticle[] = [
  // ─── 1 ──────────────────────────────────────────────────────────────────────
  {
    slug: 'old-vs-new-regime-2025',
    title: 'Old vs New Tax Regime India FY 2025-26 — Complete Comparison',
    excerpt:
      'The Finance Act 2025 made the new regime default and extended the 87A rebate to ₹12 lakh. Here is the definitive slab-by-slab breakdown so you can choose with confidence.',
    category: 'India Tax',
    country: 'IN',
    readTime: 8,
    date: '2025-04-01',
    featured: true,
    calculatorCta: { label: 'Compare Both Regimes Instantly', href: '/in' },
    toc: [
      { id: 'background', label: 'Why Two Regimes Exist' },
      { id: 'new-slabs', label: 'New Regime Slabs 2025-26' },
      { id: 'old-slabs', label: 'Old Regime Slabs' },
      { id: 'deductions', label: 'Key Deductions (Old Only)' },
      { id: 'old-wins', label: 'When Old Regime Wins' },
      { id: 'new-wins', label: 'When New Regime Wins' },
      { id: 'decision', label: 'Decision Framework' },
    ],
    content: `
<h2 id="background">Why Two Regimes Exist</h2>
<p>Since FY 2020-21, India has run two parallel income-tax systems. The <strong>Old Regime</strong> preserves the legacy structure: higher slab rates offset by a rich menu of deductions and exemptions. The <strong>New Regime</strong> offers lower rates but strips away almost every deduction. From FY 2023-24, the new regime became the <em>default</em>. You must now make an explicit election to stay with the old one.</p>
<p>The Finance Act 2025 went further. It raised the new-regime basic exemption limit to ₹4 lakh and enlarged the Section 87A rebate so that any taxpayer with net taxable income up to ₹12 lakh pays zero income tax — effectively extending a significant middle-class benefit that was previously capped at ₹7 lakh. The standard deduction for salaried assessees in the new regime was also increased to ₹75,000, pushing the salary threshold at which zero tax applies to ₹12.75 lakh gross.</p>

<h2 id="new-slabs">New Regime Tax Slabs FY 2025-26</h2>
<table>
  <thead><tr><th>Taxable Income</th><th>Rate</th></tr></thead>
  <tbody>
    <tr><td>Up to ₹4,00,000</td><td>Nil</td></tr>
    <tr><td>₹4,00,001 – ₹8,00,000</td><td>5%</td></tr>
    <tr><td>₹8,00,001 – ₹12,00,000</td><td>10%</td></tr>
    <tr><td>₹12,00,001 – ₹16,00,000</td><td>15%</td></tr>
    <tr><td>₹16,00,001 – ₹20,00,000</td><td>20%</td></tr>
    <tr><td>₹20,00,001 – ₹24,00,000</td><td>25%</td></tr>
    <tr><td>Above ₹24,00,000</td><td>30%</td></tr>
  </tbody>
</table>
<p>Section 87A rebate of ₹60,000 wipes out tax entirely for net taxable income up to ₹12 lakh. A ₹75,000 standard deduction is available for salaried employees and pensioners.</p>

<h2 id="old-slabs">Old Regime Slabs</h2>
<table>
  <thead><tr><th>Taxable Income</th><th>Rate</th></tr></thead>
  <tbody>
    <tr><td>Up to ₹2,50,000</td><td>Nil</td></tr>
    <tr><td>₹2,50,001 – ₹5,00,000</td><td>5%</td></tr>
    <tr><td>₹5,00,001 – ₹10,00,000</td><td>20%</td></tr>
    <tr><td>Above ₹10,00,000</td><td>30%</td></tr>
  </tbody>
</table>
<p>The Section 87A rebate is ₹12,500, available up to ₹5 lakh taxable income. Standard deduction for salaried assessees is ₹50,000.</p>

<h2 id="deductions">Key Deductions Available Only in the Old Regime</h2>
<ul>
  <li><strong>Section 80C</strong> — PF, ELSS, PPF, LIC, home loan principal, school fees (up to ₹1.5 lakh)</li>
  <li><strong>Section 80D</strong> — Health insurance premiums: ₹25,000 self/family + ₹25,000 parents (₹50,000 for senior-citizen parents)</li>
  <li><strong>HRA Exemption (Section 10(13A))</strong> — Least of actual HRA, rent paid minus 10% of basic, or 50%/40% of basic for metro/non-metro</li>
  <li><strong>Section 24(b)</strong> — Home loan interest, up to ₹2 lakh for self-occupied property</li>
  <li><strong>LTA</strong> — Leave Travel Allowance for domestic travel, twice in a 4-year block</li>
  <li><strong>Section 80TTA / 80TTB</strong> — Savings account interest exemption / FD interest for senior citizens</li>
  <li><strong>Section 80G</strong> — Donations to approved charitable organizations</li>
  <li><strong>Section 80E</strong> — Education loan interest (no cap, entire interest deductible for 8 years)</li>
</ul>

<h2 id="old-wins">When the Old Regime Wins</h2>
<p>The old regime makes sense when your total eligible deductions are large enough to more than compensate for its higher slab rates. As a rule of thumb, if you can claim more than ₹3.75 lakh in deductions at income levels of ₹10–15 lakh, the old regime typically saves more tax.</p>
<p><strong>Example.</strong> Gross salary ₹15 lakh. HRA exemption in Delhi ₹1.5 lakh. Section 80C ₹1.5 lakh. Section 80D ₹25,000. Standard deduction ₹50,000. Total deductions: ₹3.75 lakh. Taxable income: ₹11.25 lakh. Old-regime tax: ~₹1,37,500 versus new-regime tax on ₹14.25 lakh (₹15L minus ₹75K standard deduction): ~₹1,62,500. Old regime saves ~₹25,000.</p>
<p>Candidates for the old regime: salaried employees paying rent in metro cities, those maximising 80C through ELSS and PPF, taxpayers paying health insurance for parents, and home-loan holders claiming Section 24(b) interest.</p>

<h2 id="new-wins">When the New Regime Wins</h2>
<p>The new regime wins when you have few or no deductions, or when your gross salary is at or below ₹12.75 lakh — in which case you pay zero income tax after the standard deduction and 87A rebate.</p>
<p><strong>Example.</strong> Gross salary ₹10 lakh, company accommodation (no HRA), minimal investments. New regime: taxable after ₹75K standard deduction = ₹9.25 lakh. Tax: 5% on ₹4L = ₹20,000 + 10% on ₹1.25L = ₹12,500. Total: ₹32,500. Old regime with only 80C of ₹1.5L: taxable ₹8L. Tax: 20% on ₹3L = ₹60,000. New regime saves ₹27,500.</p>
<p>Candidates for the new regime: early-career professionals without large commitments, freelancers on presumptive taxation, anyone earning below ₹12.75 lakh gross, and taxpayers without employer-paid HRA.</p>

<h2 id="decision">The Decision Framework</h2>
<p>Step 1: Total your old-regime deductions — 80C, 80D, HRA, Section 24(b), and others. Step 2: If that total exceeds roughly ₹3.75 lakh at income levels up to ₹15 lakh (or ₹4.25 lakh at higher incomes), the old regime wins. Otherwise, the new regime wins. Step 3: Compute both scenarios precisely with your actual numbers before making the election.</p>
<p>Salaried employees can switch between regimes at every filing. Business owners who opt out of the new regime can switch back only once in their lifetime — a structural asymmetry that merits careful thought before making that move.</p>
`,
  },

  // ─── 2 ──────────────────────────────────────────────────────────────────────
  {
    slug: 'hra-exemption-calculator',
    title: 'HRA Exemption: The 3-Method Formula with Examples',
    excerpt:
      'HRA exemption is calculated as the minimum of three amounts — not the maximum. Most taxpayers get this wrong and either over-claim or under-claim. Here is every formula, with metro vs non-metro examples.',
    category: 'India Tax',
    country: 'IN',
    readTime: 6,
    date: '2025-03-15',
    calculatorCta: { label: 'Calculate HRA Exemption', href: '/in' },
    toc: [
      { id: 'what-is-hra', label: 'What Is HRA Exemption' },
      { id: 'three-methods', label: 'The 3-Method Formula' },
      { id: 'metro-example', label: 'Metro City Example' },
      { id: 'non-metro-example', label: 'Non-Metro Example' },
      { id: 'partial-year', label: 'Partial-Year Rent' },
      { id: 'landlord-pan', label: 'Landlord PAN Rules' },
      { id: 'pitfalls', label: 'Common Pitfalls' },
    ],
    content: `
<h2 id="what-is-hra">What Is HRA Exemption</h2>
<p>If your employer includes a House Rent Allowance component in your salary and you pay rent for accommodation you do not own, you can claim an exemption on that HRA under Section 10(13A) of the Income Tax Act. This exemption is available <strong>only under the old tax regime</strong>. The new regime does not permit it.</p>
<p>The exemption is not simply the HRA amount your employer pays you. It is the <strong>minimum of three calculated amounts</strong>. Many taxpayers assume they can exempt the full HRA component — they cannot. The actual exemption is almost always lower.</p>

<h2 id="three-methods">The 3-Method Formula</h2>
<p>Exempt HRA = Minimum of:</p>
<ol>
  <li><strong>Actual HRA received</strong> from the employer during the year</li>
  <li><strong>Rent paid minus 10% of basic salary</strong> (Rent Paid − 10% × Basic)</li>
  <li><strong>50% of basic salary</strong> if the accommodation is in a metro city (Mumbai, Delhi, Chennai, Kolkata) — or <strong>40% of basic salary</strong> for all other cities</li>
</ol>
<p>Basic salary for this purpose typically means the basic pay component as defined in your CTC — it excludes DA in most private-sector structures unless DA forms part of retirement benefits. When in doubt, check your Form 16.</p>

<h2 id="metro-example">Metro City Example (Delhi)</h2>
<p>Assumptions: Basic salary ₹60,000/month. HRA received from employer ₹24,000/month. Rent paid ₹20,000/month. City: Delhi (metro).</p>
<table>
  <thead><tr><th>Method</th><th>Monthly</th><th>Annual</th></tr></thead>
  <tbody>
    <tr><td>Actual HRA received</td><td>₹24,000</td><td>₹2,88,000</td></tr>
    <tr><td>Rent paid − 10% of basic (₹20,000 − ₹6,000)</td><td>₹14,000</td><td>₹1,68,000</td></tr>
    <tr><td>50% of basic salary</td><td>₹30,000</td><td>₹3,60,000</td></tr>
  </tbody>
</table>
<p><strong>Exempt HRA = Minimum = ₹1,68,000.</strong> The remaining HRA (₹2,88,000 − ₹1,68,000 = ₹1,20,000) is taxable as salary income.</p>

<h2 id="non-metro-example">Non-Metro Example (Pune)</h2>
<p>Assumptions: Basic salary ₹80,000/month. HRA received ₹30,000/month. Rent paid ₹25,000/month. City: Pune (non-metro).</p>
<table>
  <thead><tr><th>Method</th><th>Monthly</th><th>Annual</th></tr></thead>
  <tbody>
    <tr><td>Actual HRA received</td><td>₹30,000</td><td>₹3,60,000</td></tr>
    <tr><td>Rent paid − 10% of basic (₹25,000 − ₹8,000)</td><td>₹17,000</td><td>₹2,04,000</td></tr>
    <tr><td>40% of basic salary</td><td>₹32,000</td><td>₹3,84,000</td></tr>
  </tbody>
</table>
<p><strong>Exempt HRA = Minimum = ₹2,04,000.</strong></p>

<h2 id="partial-year">Partial-Year Rent Situations</h2>
<p>If you moved cities mid-year, or were in company accommodation for part of the year and rented for the rest, you must calculate the exemption separately for each period. The Income Tax Department expects month-by-month consistency between rent receipts, Form 12BB declaration, and the HRA received. Do not apply annual averages across mixed periods.</p>
<p>If you paid zero rent for any month (for example, you lived in your own property), you cannot claim HRA exemption for that month regardless of how much HRA your employer paid you.</p>

<h2 id="landlord-pan">Landlord PAN Rules</h2>
<p>If the annual rent you pay to a single landlord exceeds <strong>₹1,00,000</strong> (i.e., more than ₹8,333/month), you must furnish the landlord's PAN to your employer in Form 12BB. If the landlord does not have a PAN, they must sign a declaration to that effect. Failure to provide this means your employer will not reflect the exemption in Form 16, and you will need to claim it in your ITR along with documentary evidence.</p>

<h2 id="pitfalls">Common Pitfalls</h2>
<ul>
  <li><strong>Paying rent to a spouse.</strong> The Income Tax Department and courts have consistently disallowed HRA claims where rent is paid to a spouse. The arrangement lacks commercial substance.</li>
  <li><strong>Owning property in the same city.</strong> If you own a house in the city where you work but claim rent is being paid elsewhere, the claim will be scrutinised. Owning property in a different city is generally fine.</li>
  <li><strong>Cash rent without receipts.</strong> All rent payments should be backed by stamped receipts or bank transfer records. Cash payments for amounts exceeding ₹8,333/month in particular are hard to defend without documentation.</li>
  <li><strong>Switching to the new regime and forgetting this disappears.</strong> If you elect the new tax regime, your HRA exemption drops to zero — even if you are paying the same rent. Model both scenarios before making the election.</li>
</ul>
`,
  },

  // ─── 3 ──────────────────────────────────────────────────────────────────────
  {
    slug: 'ltcg-budget-2024',
    title: 'LTCG Tax on Equity After Budget 2024 — What Changed and What It Means',
    excerpt:
      'Budget 2024 raised the LTCG rate on equity from 10% to 12.5% and removed the indexation benefit on debt funds. Here is a precise breakdown of what changed, what the grandfathering rules are, and how to plan around it.',
    category: 'India Tax',
    country: 'IN',
    readTime: 7,
    date: '2024-08-01',
    calculatorCta: { label: 'Calculate Capital Gains Tax', href: '/in' },
    toc: [
      { id: 'what-changed', label: 'What Budget 2024 Changed' },
      { id: 'equity-ltcg', label: 'Equity LTCG: New Rules' },
      { id: 'grandfathering', label: 'Grandfathering as of Jan 31 2018' },
      { id: 'stcg', label: 'STCG Rate Change' },
      { id: 'debt-funds', label: 'Debt Funds: Indexation Gone' },
      { id: 'planning', label: 'Tax-Efficient Planning Post-Budget' },
    ],
    content: `
<h2 id="what-changed">What Budget 2024 Changed</h2>
<p>The Union Budget 2024-25, presented on July 23, 2024, overhauled capital-gains taxation in ways not seen since the 2018 reintroduction of LTCG on equity. The key changes took effect from July 23, 2024 itself — not from April 1, 2025. This mid-year effective date creates a split within FY 2024-25 that requires careful attention when filing.</p>
<p>The major changes: (1) LTCG rate on listed equity, equity mutual funds, and business trusts raised from 10% to <strong>12.5%</strong>. (2) STCG rate on the same assets raised from 15% to <strong>20%</strong>. (3) The LTCG exemption threshold retained at ₹1.25 lakh per year. (4) Indexation benefit removed for <strong>all asset classes</strong> (including real estate) for transfers after July 23, 2024, with a partial rollback later restoring it for real estate acquired before July 23, 2024. (5) Holding period for certain unlisted assets reclassified.</p>

<h2 id="equity-ltcg">Equity LTCG: New Rules in Detail</h2>
<p>Equity shares listed on a recognised stock exchange, units of equity-oriented mutual funds, and units of business trusts attract LTCG tax when held for more than 12 months.</p>
<table>
  <thead><tr><th>Period of Transfer</th><th>LTCG Rate</th><th>Exemption Threshold</th></tr></thead>
  <tbody>
    <tr><td>April 1, 2024 – July 22, 2024</td><td>10%</td><td>₹1,00,000</td></tr>
    <tr><td>July 23, 2024 onwards</td><td>12.5%</td><td>₹1,25,000</td></tr>
  </tbody>
</table>
<p>For FY 2024-25 returns, you must split your equity disposals by the July 23 cutoff date and apply the appropriate rate to each tranche. Both exemptions apply proportionately within the year — you cannot claim ₹1.25 lakh on all gains if some were before July 23.</p>
<p>LTCG on equity is not subject to surcharge beyond 15%, even for taxpayers with income above ₹5 crore. This effectively caps the marginal LTCG rate at 14.375% (12.5% + 15% surcharge + 4% cess).</p>

<h2 id="grandfathering">Grandfathering as of January 31, 2018</h2>
<p>The grandfathering provision from the 2018 reintroduction continues to apply. For equity assets acquired <em>before</em> February 1, 2018, the cost of acquisition for LTCG purposes is the higher of the actual cost or the Fair Market Value (FMV) as of January 31, 2018.</p>
<p>FMV for listed shares is the highest quoted price on that date. For mutual fund units, it is the NAV as of January 31, 2018. This means gains that accrued before February 1, 2018 remain permanently tax-free — the new 12.5% rate applies only to appreciation after that date.</p>

<h2 id="stcg">STCG Rate Change</h2>
<p>Short-term capital gains on equity (held 12 months or less) are taxed at the special STCG rate under Section 111A. This rate was raised from 15% to <strong>20%</strong> for transfers on or after July 23, 2024. Unlike LTCG, STCG is subject to the full surcharge structure applicable to the taxpayer.</p>

<h2 id="debt-funds">Debt Funds: Indexation Benefit Permanently Removed</h2>
<p>From April 1, 2023, debt mutual funds (where equity exposure is below 35%) lost LTCG status entirely — all gains became taxable at slab rates regardless of holding period. Budget 2024 did not restore this. Debt fund gains remain fully taxable at your applicable income-tax slab rate, making them significantly less tax-efficient compared to their pre-2023 status.</p>
<p>For investors who continue to hold debt funds acquired before April 1, 2023: gains on those units acquired <em>before</em> April 1, 2023 were taxable at 20% with indexation. The Budget 2024 changes do not retrospectively alter this — those pre-April 2023 units retain their earlier treatment. Verify exact acquisition dates before assuming any specific treatment.</p>

<h2 id="planning">Tax-Efficient Planning Post-Budget</h2>
<p><strong>Harvest ₹1.25 lakh annually.</strong> The LTCG exemption of ₹1.25 lakh per financial year is use-it-or-lose-it. Selling equity positions with up to ₹1.25 lakh in unrealised long-term gains each year and repurchasing at the new higher cost base (tax-loss harvesting in reverse) is a structurally sound strategy.</p>
<p><strong>Review holding periods.</strong> The 5-percentage-point gap between STCG (20%) and LTCG (12.5%) makes crossing the 12-month holding threshold materially valuable — do not trigger short-term tax for modest liquidity needs when waiting a few weeks changes the outcome.</p>
<p><strong>Consider direct equity vs. mutual funds.</strong> Listed equity shares and mutual fund units are treated identically for LTCG purposes. However, mutual fund switching (even within the same fund house) constitutes a taxable disposal — active rebalancing within fund portfolios generates more taxable events than is commonly appreciated.</p>
`,
  },

  // ─── 4 ──────────────────────────────────────────────────────────────────────
  {
    slug: 'us-freelancer-tax-guide',
    title: 'US Freelancer Tax Guide 2025 — SE Tax, Quarterly Payments, QBI Deduction',
    excerpt:
      'Self-employment tax is 15.3% on top of income tax, but the QBI deduction can cut your bill by 20%. This guide covers everything a US freelancer needs: SE tax mechanics, quarterly payment deadlines, the home-office deduction, and retirement accounts that reduce AGI.',
    category: 'US Tax',
    country: 'US',
    readTime: 9,
    date: '2025-01-15',
    calculatorCta: { label: 'Estimate US Freelancer Tax', href: '/us' },
    toc: [
      { id: 'se-tax', label: 'Self-Employment Tax Mechanics' },
      { id: 'quarterly', label: 'Quarterly Estimated Payments' },
      { id: 'qbi', label: 'The QBI Deduction (Section 199A)' },
      { id: 'home-office', label: 'Home Office Deduction' },
      { id: 'retirement', label: 'Retirement Accounts to Lower AGI' },
      { id: 'common-mistakes', label: 'Most Common Freelancer Mistakes' },
    ],
    content: `
<h2 id="se-tax">Self-Employment Tax Mechanics</h2>
<p>As a freelancer — legally a sole proprietor unless you have elected another entity structure — you owe <strong>self-employment (SE) tax</strong> in addition to ordinary income tax. SE tax replaces the employer and employee shares of FICA (Social Security and Medicare) that W-2 employees and their employers split.</p>
<p>The SE tax rate is <strong>15.3%</strong> on net self-employment income up to the Social Security wage base ($176,100 for 2025). Above that base, only the Medicare portion (2.9%) applies — plus an Additional Medicare Tax (Net Investment Income Tax equivalent) of 0.9% on income above $200,000 (single) or $250,000 (married filing jointly).</p>
<p>Net SE income for tax purposes = gross freelance revenue minus deductible business expenses, multiplied by 0.9235. The 0.9235 factor exists because you deduct the "employer equivalent" half of SE tax before applying the rate — mirroring what employees do not pay directly.</p>
<p>You can then deduct <strong>one-half of SE tax</strong> as an above-the-line deduction when computing your adjusted gross income (AGI). This deduction does not reduce SE tax itself; it reduces the income on which ordinary income tax is calculated.</p>

<h2 id="quarterly">Quarterly Estimated Tax Payments</h2>
<p>Unlike W-2 employees who have withholding, freelancers must pay estimated taxes quarterly. Failure to do so results in an underpayment penalty calculated at the federal short-term interest rate plus 3%.</p>
<table>
  <thead><tr><th>Payment Quarter</th><th>Income Period</th><th>Due Date 2025</th></tr></thead>
  <tbody>
    <tr><td>Q1</td><td>Jan 1 – Mar 31</td><td>April 15, 2025</td></tr>
    <tr><td>Q2</td><td>Apr 1 – May 31</td><td>June 16, 2025</td></tr>
    <tr><td>Q3</td><td>Jun 1 – Aug 31</td><td>September 15, 2025</td></tr>
    <tr><td>Q4</td><td>Sep 1 – Dec 31</td><td>January 15, 2026</td></tr>
  </tbody>
</table>
<p>You avoid the underpayment penalty if you pay the lesser of: (a) 100% of last year's tax liability (110% if your prior-year AGI exceeded $150,000), or (b) 90% of the current year's actual tax. The "100% of prior-year tax" safe harbour is popular because it lets you make equal payments without forecasting variable freelance income month to month.</p>

<h2 id="qbi">The QBI Deduction (Section 199A)</h2>
<p>The Tax Cuts and Jobs Act of 2017 created the Qualified Business Income (QBI) deduction, available to pass-through entities including sole proprietors. You may deduct up to <strong>20% of qualified business income</strong> — potentially a substantial reduction in taxable income.</p>
<p>For 2025, the deduction phases out for Specified Service Trades or Businesses (SSTBs — which include law, consulting, financial services, and similar fields) once taxable income exceeds $197,300 (single) or $394,600 (joint). Above these thresholds, SSTBs lose the QBI deduction entirely. Non-SSTB freelancers (software developers, designers, writers, tradespeople) are subject to a different limitation based on W-2 wages and qualified property, but the complete phase-out does not apply.</p>
<p>The QBI deduction is not an above-the-line deduction — it reduces your taxable income but not your AGI. It is taken on line 13 of Schedule 1 (attached to Form 1040).</p>

<h2 id="home-office">Home Office Deduction</h2>
<p>If you use part of your home exclusively and regularly for business, you can deduct home-office expenses. There are two methods:</p>
<p><strong>Simplified method:</strong> $5 per square foot of dedicated office space, up to 300 square feet maximum. Maximum deduction: $1,500. No depreciation calculation required. Easier but often yields a smaller deduction.</p>
<p><strong>Regular method:</strong> Calculate the percentage of your home used for business (office square footage divided by total home square footage). Apply that percentage to actual home expenses: mortgage interest or rent, utilities, repairs, insurance, and depreciation. This method requires Form 8829 and can produce a significantly larger deduction for those in high-cost-of-living areas.</p>
<p>The exclusivity requirement is strict. A room you use partly for personal purposes does not qualify. A dedicated office in a spare bedroom qualifies; a desk in the living room does not.</p>

<h2 id="retirement">Retirement Accounts to Lower AGI</h2>
<p>Freelancers can shelter substantially more income through retirement accounts than W-2 employees. Contributions are deductible and reduce both ordinary income tax and, in certain structures, SE tax.</p>
<ul>
  <li><strong>SEP-IRA:</strong> Contribution limit 2025: 25% of net SE income, up to $70,000. The simplest structure — one account, no administration. Contributions are deductible on Schedule 1.</li>
  <li><strong>Solo 401(k):</strong> Employee deferral up to $23,500 ($31,000 if age 50+) plus employer contribution of 25% of net SE income, total capped at $70,000. More complex but allows higher total contributions at lower income levels.</li>
  <li><strong>SIMPLE IRA:</strong> Typically used when a freelancer has employees. Less flexible than a Solo 401(k) for self-employed individuals without staff.</li>
</ul>
<p>Contributing to a SEP-IRA or Solo 401(k) is one of the highest-leverage tax-reduction strategies available to a freelancer. At a 32% marginal rate, a $20,000 SEP-IRA contribution saves $6,400 in income tax and reduces the income used to calculate SE tax.</p>

<h2 id="common-mistakes">Most Common Freelancer Tax Mistakes</h2>
<ul>
  <li><strong>Not setting aside tax as you earn.</strong> A reasonable rule of thumb: reserve 25–30% of each invoice for federal and state tax.</li>
  <li><strong>Missing quarterly deadlines.</strong> Even one missed quarter accrues penalty. Set calendar reminders for the four due dates.</li>
  <li><strong>Deducting personal expenses.</strong> The IRS requires expenses to be "ordinary and necessary" for business. Partial-use items (phone, car) require documented business-use percentages.</li>
  <li><strong>Overlooking the SE tax deduction.</strong> The one-half SE tax deduction on Schedule SE reduces AGI. Many first-time freelancers miss it.</li>
  <li><strong>Not tracking mileage.</strong> If you drive for business, the standard mileage rate for 2025 is 70 cents per mile. A mileage log is required documentation.</li>
</ul>
`,
  },

  // ─── 5 ──────────────────────────────────────────────────────────────────────
  {
    slug: 'uk-60-percent-tax-trap',
    title: "UK's 60% Tax Trap: How the Personal Allowance Taper Destroys Wealth",
    excerpt:
      "Between £100,000 and £125,140, your effective marginal income tax rate is 60%. This is not a mistake — it's a deliberate feature of the Personal Allowance taper. Here is how it works and how pension contributions can neutralise it entirely.",
    category: 'UK Tax',
    country: 'UK',
    readTime: 7,
    date: '2025-02-10',
    calculatorCta: { label: 'Calculate UK Income Tax', href: '/uk' },
    toc: [
      { id: 'the-trap', label: 'The 60% Trap Explained' },
      { id: 'mechanics', label: 'How the Taper Works' },
      { id: 'worked-example', label: 'Worked Example' },
      { id: 'pension-fix', label: 'Pension Contributions as the Fix' },
      { id: 'salary-sacrifice', label: 'Salary Sacrifice' },
      { id: 'other-relief', label: 'Other Mitigation Strategies' },
    ],
    content: `
<h2 id="the-trap">The 60% Trap Explained</h2>
<p>The UK income tax system has a well-known quirk: between adjusted net income of £100,000 and £125,140, every £2 of income above £100,000 reduces your Personal Allowance by £1. Since the Personal Allowance (£12,570 for 2024-25) is taxed at 0% and its withdrawal makes that income taxable at 40%, the effective marginal rate is not 40% — it is <strong>60%</strong>.</p>
<p>By the time adjusted net income reaches £125,140, the full Personal Allowance is gone. Above that level, the rate returns to 45% (the additional rate band). The 60% zone is therefore a spike — a £25,140 window — but it can affect a substantial proportion of senior professionals, partners, and high-earning contractors who cross it unexpectedly due to bonuses, share vesting, or rental income.</p>

<h2 id="mechanics">How the Taper Works</h2>
<p>Personal Allowance for 2024-25: £12,570. This tapers at the rate of £1 lost for every £2 of adjusted net income above £100,000.</p>
<p>At £100,000: full Personal Allowance (£12,570) intact. At £106,000: allowance reduced by £3,000 → £9,570 remaining. At £112,570: allowance reduced by £6,285 → £6,285 remaining. At £125,140: allowance reduced by £12,570 → £0 remaining. Above £125,140: additional rate of 45% applies with no further taper.</p>
<p>The 60% effective rate arises because: every additional £1 of income is taxed at 40% (higher rate), and it simultaneously withdraws £0.50 of tax-free allowance, making that £0.50 newly taxable at 40% as well. Total tax on each additional £1: 40p (direct) + 20p (on the lost allowance, since the allowance shifts from 0% to 40%) = 60p.</p>

<h2 id="worked-example">Worked Example</h2>
<p>Consider two employees: one earning £100,000 and one earning £101,000.</p>
<table>
  <thead><tr><th>Item</th><th>£100,000 income</th><th>£101,000 income</th></tr></thead>
  <tbody>
    <tr><td>Personal Allowance</td><td>£12,570</td><td>£12,070 (reduced by £500)</td></tr>
    <tr><td>Basic rate band (20%)</td><td>£37,700</td><td>£37,700</td></tr>
    <tr><td>Higher rate (40%)</td><td>£49,730</td><td>£51,230</td></tr>
    <tr><td>Income tax payable</td><td>£27,432</td><td>£28,032</td></tr>
    <tr><td>Additional tax on £1,000</td><td>—</td><td>£600</td></tr>
  </tbody>
</table>
<p>The employee earning £1,000 more takes home £400 more — an effective retention rate of 40%, or equivalently a marginal tax rate of 60%.</p>

<h2 id="pension-fix">Pension Contributions as the Fix</h2>
<p>Pension contributions reduce your adjusted net income. A personal contribution to a registered pension scheme generates basic-rate tax relief at source (25% uplift on net contributions) and qualifies for higher-rate relief through your Self Assessment return. More importantly, it reduces adjusted net income — which is the figure that determines whether the Personal Allowance taper applies.</p>
<p>If your adjusted net income is £115,000, you are deep in the 60% zone. A gross pension contribution of £15,000 (i.e., you pay in £12,000 net and HMRC adds £3,000 in basic-rate relief) reduces your adjusted net income to £100,000 — entirely eliminating the taper. The effective return on this contribution is not merely the 40% higher-rate relief but 60% tax relief, since every pound contributed in the taper zone is shielded from the 60% marginal rate.</p>
<p>You can contribute up to your entire UK earnings (capped at £60,000 gross under the Annual Allowance for 2024-25). If you have unused Annual Allowance from the previous three tax years, you may be able to carry it forward.</p>

<h2 id="salary-sacrifice">Salary Sacrifice</h2>
<p>Salary sacrifice achieves the same economic result as personal contributions but by a different mechanism. You agree with your employer to reduce your contractual salary by the amount you wish to contribute to the pension. The employer contributes that amount directly. Because your contractual salary is lower, your adjusted net income is lower — without any additional-rate relief claim being required.</p>
<p>Salary sacrifice has the added benefit of reducing National Insurance Contributions (NICs) for both you and your employer, since NICs are calculated on the reduced salary. At 8% employee NICs and 13.8% employer NICs (2024-25), the saving is material. Some employers pass through their NIC saving as additional pension contribution — worth negotiating if you are restructuring compensation.</p>

<h2 id="other-relief">Other Mitigation Strategies</h2>
<ul>
  <li><strong>Gift Aid donations.</strong> Gift Aid donations are deducted from adjusted net income when calculating the Personal Allowance taper. A donation to a registered charity also generates basic-rate relief at source, with higher-rate relief claimable in Self Assessment.</li>
  <li><strong>Timing income.</strong> If you have discretion over when a bonus or consulting invoice is received (particularly for the self-employed), shifting income to bring a particular year below £100,000 is a legitimate planning tool.</li>
  <li><strong>Spousal transfer.</strong> Where a partner has unused allowances or a lower marginal rate, shifting income-generating assets — within capital-gains limits — can reduce adjusted net income in the taper zone.</li>
  <li><strong>Enterprise Investment Scheme (EIS).</strong> EIS investments reduce income tax liability directly (30% relief) and can defer capital gains. However, these carry substantial illiquidity and risk that must be weighed against the tax benefit.</li>
</ul>
`,
  },

  // ─── 6 ──────────────────────────────────────────────────────────────────────
  {
    slug: 'which-itr-form-to-file',
    title: 'Which ITR Form Should You File? Complete Guide for AY 2025-26',
    excerpt:
      'Filing in the wrong ITR form means your return is treated as defective — losses cannot be carried forward and refunds may be delayed. This guide maps every income profile to the correct form.',
    category: 'India Tax',
    country: 'IN',
    readTime: 6,
    date: '2025-06-01',
    calculatorCta: { label: 'File Your ITR Correctly', href: '/in' },
    toc: [
      { id: 'itr1', label: 'ITR-1 (Sahaj): Who Qualifies' },
      { id: 'itr2', label: 'ITR-2: Capital Gains and Foreign Assets' },
      { id: 'itr3', label: 'ITR-3: Business and Profession' },
      { id: 'itr4', label: 'ITR-4 (Sugam): Presumptive Taxation' },
      { id: 'matrix', label: 'Quick Selection Matrix' },
      { id: 'wrong-form', label: 'Consequences of Wrong Form' },
    ],
    content: `
<h2 id="itr1">ITR-1 (Sahaj): Who Qualifies</h2>
<p>ITR-1 is the simplest form, but it comes with strict eligibility conditions. You can use it only if <strong>all</strong> of the following apply:</p>
<ul>
  <li>You are a resident individual (not HUF, not NRI)</li>
  <li>Total income does not exceed ₹50 lakh during the year</li>
  <li>Income is from salary or pension, one house property, and other sources (interest, family pension, dividends) only</li>
  <li>Agricultural income does not exceed ₹5,000</li>
  <li>You are not a director of a company</li>
  <li>You do not hold unlisted equity shares</li>
  <li>You have no foreign assets or foreign income</li>
  <li>You have no capital gains of any kind</li>
  <li>You have no income taxable at special rates under Sections 115BB, 115BBE, etc.</li>
</ul>
<p>If you sold any equity mutual funds during the year — even if the gain was zero or a loss — you have a capital-gains event and cannot use ITR-1. Switch to ITR-2.</p>

<h2 id="itr2">ITR-2: Capital Gains and Foreign Assets</h2>
<p>ITR-2 is for individuals and HUFs who do not have income from business or profession. Use ITR-2 when you have:</p>
<ul>
  <li>Capital gains: equity shares, mutual fund units, property, bonds, or any other capital asset</li>
  <li>Income from more than one house property</li>
  <li>Foreign assets or foreign income</li>
  <li>Income above ₹50 lakh</li>
  <li>Director in any company (even if unlisted)</li>
  <li>Holder of unlisted equity shares</li>
  <li>NRI or RNOR with Indian-sourced income</li>
</ul>
<p>ITR-2 is also the correct form for salaried individuals who switched jobs mid-year and have Form 16 from two employers, or for those who received ESOPs that were exercised or sold during the year.</p>

<h2 id="itr3">ITR-3: Business and Profession</h2>
<p>ITR-3 is for individuals and HUFs earning income from a proprietary business or profession where books of accounts are maintained. Use it when:</p>
<ul>
  <li>You are a freelancer, consultant, or contractor and maintain proper books of accounts</li>
  <li>You are a partner in a firm (not the firm itself — the firm files separately)</li>
  <li>You have business income <em>and</em> capital gains in the same year</li>
  <li>Your professional receipts exceed ₹75 lakh (making you ineligible for presumptive Section 44ADA)</li>
  <li>Your business turnover exceeds ₹3 crore (ineligible for Section 44AD)</li>
  <li>You opted out of the presumptive scheme in a previous year (three-year lock-out applies)</li>
</ul>

<h2 id="itr4">ITR-4 (Sugam): Presumptive Taxation</h2>
<p>ITR-4 is for individuals, HUFs, and partnership firms (excluding LLPs) opting for presumptive taxation under Sections 44AD, 44ADA, or 44AE. Conditions:</p>
<ul>
  <li><strong>Section 44AD:</strong> Business income with turnover up to ₹3 crore (with 95%+ digital receipts threshold). Presumptive income = 8% of turnover (or 6% for digital receipts).</li>
  <li><strong>Section 44ADA:</strong> Specified professionals (doctors, lawyers, architects, CAs, engineers), gross receipts up to ₹75 lakh. Presumptive income = 50% of receipts.</li>
  <li><strong>Section 44AE:</strong> Goods carriage operators, per-vehicle presumptive income.</li>
</ul>
<p>Total income must not exceed ₹50 lakh to use ITR-4. Those with capital gains, foreign assets, or director status cannot use this form regardless of presumptive-scheme eligibility.</p>

<h2 id="matrix">Quick Selection Matrix</h2>
<table>
  <thead><tr><th>Income Profile</th><th>Correct Form</th></tr></thead>
  <tbody>
    <tr><td>Salary only, income below ₹50L, one house property</td><td>ITR-1</td></tr>
    <tr><td>Salary + equity or mutual fund sales</td><td>ITR-2</td></tr>
    <tr><td>Salary + rental from two properties</td><td>ITR-2</td></tr>
    <tr><td>Freelancer / consultant, books maintained</td><td>ITR-3</td></tr>
    <tr><td>Small business or professional, presumptive, income below ₹50L</td><td>ITR-4</td></tr>
    <tr><td>Director in any company</td><td>ITR-2 or ITR-3</td></tr>
    <tr><td>NRI with Indian salary or rental income</td><td>ITR-2</td></tr>
    <tr><td>Salary + ESOP exercise or sale</td><td>ITR-2 or ITR-3</td></tr>
    <tr><td>Partner in a firm</td><td>ITR-3</td></tr>
  </tbody>
</table>

<h2 id="wrong-form">Consequences of Filing in the Wrong Form</h2>
<p>Filing in the wrong form constitutes a defective return under Section 139(9). The Income Tax Department will issue a notice giving you <strong>15 days</strong> to respond with a corrected return in the proper form.</p>
<p>If you do not respond within 15 days, the return is treated as if it was never filed. The consequences:</p>
<ul>
  <li>Capital and business losses cannot be carried forward to future years</li>
  <li>Tax refunds may be delayed or disallowed pending rectification</li>
  <li>Late filing fee under Section 234F (up to ₹5,000) applies to the corrected return</li>
  <li>Interest under Section 234A if taxes were due and not paid on time</li>
</ul>
<p>The filing deadline for individuals not subject to tax audit for AY 2025-26 is <strong>July 31, 2025</strong>. Belated returns can be filed up to December 31, 2025 with a late fee.</p>
`,
  },

  // ─── 7 ──────────────────────────────────────────────────────────────────────
  {
    slug: 'nri-tax-guide-india-2025',
    title: 'NRI Tax Guide India 2025-26: What Income Is Taxable, DTAA Benefits, TDS Rates',
    excerpt:
      'As an NRI, only your India-sourced income is taxable in India. But the rules around TDS on FDs, capital gains, DTAA relief, and NRO/NRE accounts trip up even seasoned professionals. This guide covers every scenario.',
    category: 'NRI',
    country: 'IN',
    readTime: 9,
    date: '2025-04-05',
    featured: false,
    calculatorCta: { label: 'Calculate NRI Tax', href: '/in' },
    toc: [
      { id: 'residency', label: 'NRI Residency Rules (Sections 5, 6, 9)' },
      { id: 'taxable-income', label: 'What Income Is Taxable in India' },
      { id: 'tds-rates', label: 'TDS Rates for NRIs' },
      { id: 'dtaa', label: 'DTAA: What It Does and How to Claim Relief' },
      { id: 'form10f', label: 'Form 10F and Tax Residency Certificate' },
      { id: 'nro-nre', label: 'NRO vs NRE Account Tax Treatment' },
      { id: 'filing', label: 'When Must an NRI File ITR in India' },
    ],
    content: `
<h2 id="residency">NRI Residency Rules — Sections 5, 6, and 9</h2>
<p>Your tax liability in India as an NRI hinges entirely on your residential status, which the Income Tax Act determines purely on days of physical presence — not citizenship or visa type.</p>
<p><strong>Section 6</strong> defines residency. You are a <em>Resident</em> if you were in India for 182 days or more in the financial year, or 60 days or more in the year plus 365 days or more in the preceding four years. If neither condition is met, you are a <strong>Non-Resident Indian</strong> for that year.</p>
<p><strong>Section 5</strong> determines the scope of taxable income. A resident is taxed on global income. An NRI is taxed <strong>only on income received or deemed to accrue in India</strong>.</p>
<p><strong>Section 9</strong> defines what "accrues in India" means — salary for services rendered in India, business income from India, dividends from Indian companies, interest paid by Indian residents, royalties and fees for technical services paid by Indian parties, and capital gains on India-sited assets.</p>

<h2 id="taxable-income">What Income Is Taxable in India for an NRI</h2>
<ul>
  <li><strong>Salary from Indian employer:</strong> If you render services in India, the salary is taxable in India regardless of where it is paid. Salary for work done abroad is not taxable in India even if paid by an Indian company.</li>
  <li><strong>Rental income:</strong> Rent from any property situated in India is fully taxable. After a 30% standard deduction and deduction of interest on any home loan, the net amount is taxed at slab rates. TDS is 30% on gross rent if the tenant is an Indian resident paying a non-resident landlord.</li>
  <li><strong>FD interest in NRO accounts:</strong> Taxable in India at a flat 30% (plus surcharge and cess) with TDS deducted by the bank. There is no basic exemption limit for NRIs on this income.</li>
  <li><strong>Capital gains on Indian assets:</strong> Gains from sale of shares, mutual funds, or property in India are taxable in India. STCG on equity is 20% (post July 2024 Budget), LTCG on equity above ₹1.25 lakh is 12.5%. Property LTCG is 12.5% without indexation (post-July 2024). TDS is deducted at source by the buyer.</li>
  <li><strong>Dividends from Indian companies:</strong> Taxable in India at slab rates. TDS is 20% (or DTAA rate if lower, with documentation).</li>
</ul>
<p>Income credited to your NRE account from foreign sources is <strong>not taxable in India</strong>. Interest on NRE savings and fixed deposits is also fully exempt — this is the key advantage of the NRE structure.</p>

<h2 id="tds-rates">TDS Rates for NRIs</h2>
<table>
  <thead><tr><th>Income Type</th><th>TDS Rate</th></tr></thead>
  <tbody>
    <tr><td>NRO FD interest</td><td>30% + surcharge + cess</td></tr>
    <tr><td>Rental income</td><td>30%</td></tr>
    <tr><td>Dividend</td><td>20% (DTAA rate if applicable)</td></tr>
    <tr><td>LTCG on equity (above ₹1.25L)</td><td>12.5%</td></tr>
    <tr><td>STCG on equity</td><td>20%</td></tr>
    <tr><td>Property LTCG</td><td>12.5% (buyer deducts)</td></tr>
    <tr><td>Fees for technical services</td><td>10%</td></tr>
  </tbody>
</table>
<p>These are the statutory rates. Most DTAA agreements allow you to claim a lower rate — but you must submit documentation proactively before or at the time of deduction; you cannot recover excess TDS without filing an ITR and claiming a refund.</p>

<h2 id="dtaa">DTAA: What It Does and How to Claim Relief</h2>
<p>India has Double Taxation Avoidance Agreements with over 90 countries. A DTAA does one of two things: it either allocates exclusive taxing rights to one country (making the income exempt in the other), or it caps the withholding rate at a lower ceiling than the domestic rate.</p>
<p>For example, the India–USA DTAA caps dividend withholding at 15% for substantial holdings instead of India's domestic 20%. The India–UAE DTAA provides relief on capital gains. The India–UK DTAA covers pensions and government salaries.</p>
<p>To claim DTAA benefits, you must establish that you are a tax resident of the treaty partner country and that the income in question falls within the treaty's scope. You do this by providing <strong>Form 10F</strong> and a <strong>Tax Residency Certificate (TRC)</strong> to the payer before deduction.</p>

<h2 id="form10f">Form 10F and Tax Residency Certificate</h2>
<p>A <strong>Tax Residency Certificate</strong> is issued by the tax authority of the country where you are resident. In the USA, this is the IRS Form 6166. In the UK, it is a letter from HMRC. In the UAE, it is issued by the Federal Tax Authority.</p>
<p><strong>Form 10F</strong> is an Indian form (filed on the income tax e-filing portal) that the NRI self-certifies, attesting their residency details, treaty eligibility, and tax identification number in the foreign country. Since 2023, Form 10F must be filed electronically on the income tax portal — paper submission is no longer accepted.</p>
<p>Submit Form 10F plus the TRC to the Indian payer (bank, company, tenant) before the income is paid or credited. The payer will then deduct TDS at the DTAA rate rather than the domestic rate. Failure to submit these documents means TDS at the full Indian rate, and you must file an ITR to claim the refund.</p>

<h2 id="nro-nre">NRO vs NRE Account Tax Treatment</h2>
<table>
  <thead><tr><th>Feature</th><th>NRO Account</th><th>NRE Account</th></tr></thead>
  <tbody>
    <tr><td>Currency</td><td>Indian Rupees (INR)</td><td>Indian Rupees (INR)</td></tr>
    <tr><td>Source of funds</td><td>India-sourced income (rent, dividends)</td><td>Foreign earnings remitted to India</td></tr>
    <tr><td>Repatriability</td><td>Up to USD 1 million per year (after tax)</td><td>Fully repatriable, no cap</td></tr>
    <tr><td>Interest taxation</td><td>Taxable at 30% with TDS</td><td>Fully exempt</td></tr>
    <tr><td>Joint account</td><td>With another NRI or resident (on former/survivor basis)</td><td>With another NRI only</td></tr>
  </tbody>
</table>
<p>The practical implication: if you earn rent or dividends in India, those must go to your NRO account and will be subject to TDS. Do not route foreign salary into an NRO account — keep foreign earnings in NRE accounts to preserve full exemption on the interest earned.</p>

<h2 id="filing">When Must an NRI File an ITR in India</h2>
<p>An NRI must file an ITR in India if: (1) total India-sourced income exceeds the basic exemption limit of ₹2.5 lakh, (2) there is a tax refund to claim (from excess TDS), or (3) capital losses need to be carried forward. The correct form for most NRIs is <strong>ITR-2</strong>.</p>
<p>Even if all tax has been deducted at source and your Indian income is below the exemption limit, filing is still advisable if you want a formal record for future transactions — particularly for property sales and banking relationships in India.</p>
`,
  },

  // ─── 8 ──────────────────────────────────────────────────────────────────────
  {
    slug: 'nps-tax-saving-guide',
    title: 'How to Save Extra ₹15,600 Tax with NPS — Section 80CCD(1B) Guide',
    excerpt:
      'NPS offers a deduction that sits completely outside the ₹1.5 lakh 80C limit. At a 30% tax rate, the additional ₹50,000 deduction translates to ₹15,600 in hard cash saved. Here is exactly how it works.',
    category: 'India Tax',
    country: 'IN',
    readTime: 7,
    date: '2025-04-05',
    featured: false,
    calculatorCta: { label: 'Estimate NPS Tax Saving', href: '/in' },
    toc: [
      { id: 'what-is-80ccd1b', label: 'Section 80CCD(1B) Explained' },
      { id: 'tax-saving-by-bracket', label: 'Exact Saving by Tax Bracket' },
      { id: 'tier1-tier2', label: 'Tier 1 vs Tier 2 Accounts' },
      { id: 'employer-nps', label: 'Employer NPS — 80CCD(2): The Bigger Win' },
      { id: 'withdrawal', label: 'Lock-in and Withdrawal Rules' },
      { id: 'new-vs-old', label: 'NPS in New Regime vs Old Regime' },
    ],
    content: `
<h2 id="what-is-80ccd1b">Section 80CCD(1B) Explained</h2>
<p>Section 80CCD(1B) allows a deduction of up to <strong>₹50,000 per year</strong> for contributions made to the National Pension System (NPS) Tier 1 account. This deduction is <strong>in addition to</strong> — not within — the ₹1.5 lakh ceiling under Section 80C.</p>
<p>The combined ceiling most people think of as their "tax saving limit" is therefore ₹1.5 lakh (80C) + ₹50,000 (80CCD(1B)) = ₹2 lakh in total deductions, available <strong>only under the old tax regime</strong>. The new regime does not permit 80CCD(1B) individual contributions (though employer contributions under 80CCD(2) are available in the new regime — more on that below).</p>
<p>There is no minimum contribution requirement to claim this deduction. If you contribute ₹30,000 in a year, you claim ₹30,000. The maximum deduction is capped at the actual contribution or ₹50,000, whichever is lower.</p>

<h2 id="tax-saving-by-bracket">Exact Tax Saving by Bracket</h2>
<table>
  <thead><tr><th>Tax Bracket</th><th>Rate (incl. 4% cess)</th><th>Saving on ₹50,000</th></tr></thead>
  <tbody>
    <tr><td>₹5L–₹10L slab (old regime)</td><td>20.8%</td><td>₹10,400</td></tr>
    <tr><td>Above ₹10L slab (old regime)</td><td>31.2%</td><td>₹15,600</td></tr>
    <tr><td>Above ₹50L (10% surcharge)</td><td>34.32%</td><td>₹17,160</td></tr>
    <tr><td>Above ₹1Cr (15% surcharge)</td><td>35.88%</td><td>₹17,940</td></tr>
  </tbody>
</table>
<p>At the 30% slab, a ₹50,000 NPS investment saves ₹15,600 net — that is an immediate 31.2% return before your NPS corpus earns a single rupee of market return. No other investment offers this kind of guaranteed first-year return.</p>

<h2 id="tier1-tier2">Tier 1 vs Tier 2 Accounts</h2>
<p><strong>Tier 1</strong> is the core pension account. Contributions are locked in until you reach age 60. You can make partial withdrawals after 3 years for specific purposes (children's education, serious illness, home purchase). Tax deductions under 80CCD(1B) are available <em>only</em> on Tier 1 contributions. The corpus at maturity is subject to special tax rules: up to 60% can be withdrawn as a lump sum (40% is fully exempt, 20% taxable), and the remaining 40% must be annuitised (annuity income is taxable).</p>
<p><strong>Tier 2</strong> is a voluntary savings account with no lock-in. You can withdraw anytime. There is <strong>no tax deduction</strong> on Tier 2 contributions (except for Central Government employees under 80C with a 3-year lock-in). Tier 2 is essentially a low-cost mutual fund wrapper — useful for liquidity, not for tax saving.</p>
<p>You must have an active Tier 1 account to open a Tier 2 account. The PRAN (Permanent Retirement Account Number) is common to both.</p>

<h2 id="employer-nps">Employer NPS Contribution — 80CCD(2): The Bigger Win</h2>
<p>Section 80CCD(2) allows a deduction for your employer's contribution to your NPS account. This is available <strong>in both old and new regimes</strong> and has no fixed rupee cap. The deduction is limited to 10% of your basic salary and dearness allowance (14% for central government employees).</p>
<p>Consider the impact at ₹30 lakh CTC with ₹12 lakh basic: employer NPS of 10% = ₹1.2 lakh. In the 30% slab, this saves ₹37,440 in tax — more than double the 80CCD(1B) saving — and it is available even in the new regime.</p>
<p>If your employer offers NPS as part of CTC structuring, negotiating a higher employer NPS contribution (reducing other taxable components by an equivalent amount) is one of the most powerful legal tax optimisations available. The employer gets to deduct it as a business expense; you do not pay tax on it; and it grows in your retirement corpus.</p>

<h2 id="withdrawal">Lock-in and Withdrawal Rules</h2>
<p>NPS Tier 1 matures at age 60. If you joined after 65, the maturity is 3 years from the date of opening. On maturity: up to 60% can be withdrawn (40% exempt, 20% taxable as income in the year of withdrawal). The remaining 40% (minimum) must be used to purchase an annuity from an IRDAI-regulated annuity service provider. Annuity income is taxable at slab rates.</p>
<p>Premature exit (before 60) is allowed after 5 years — but only 20% can be taken as lump sum (taxable) and 80% must be annuitised. Death of the subscriber allows the nominee to withdraw the full corpus tax-free.</p>

<h2 id="new-vs-old">NPS in New Regime vs Old Regime</h2>
<p>Under the <strong>old regime</strong>, you can claim both 80CCD(1B) (₹50K on own contribution) and 80CCD(2) (employer contribution up to 10% of basic). Combined with 80C, this can reduce taxable income by ₹2 lakh or more.</p>
<p>Under the <strong>new regime</strong>, 80CCD(1B) is not available. However, 80CCD(2) is available — which means if your employer contributes to NPS on your behalf, you still get that deduction in the new regime. This makes employer NPS structuring attractive even for taxpayers who have opted for the new regime.</p>
`,
  },

  // ─── 9 ──────────────────────────────────────────────────────────────────────
  {
    slug: 'crypto-tax-india-2025',
    title: 'Crypto Tax India 2025: Section 115BBH, 30% Flat Rate, 1% TDS — Complete Guide',
    excerpt:
      'India taxes crypto at a flat 30% with no deductions, no loss set-off, and a 1% TDS on every sale. Airdrops, staking rewards, and NFT sales are all taxable events. Here is what you need to report and how.',
    category: 'Crypto Tax',
    country: 'IN',
    readTime: 8,
    date: '2025-04-05',
    featured: false,
    toc: [
      { id: 'section-115bbh', label: 'Section 115BBH: The 30% Rule' },
      { id: 'what-is-taxable', label: 'Every Taxable Event' },
      { id: 'tds-194s', label: '1% TDS Under Section 194S' },
      { id: 'no-setoff', label: 'No Loss Set-Off or Carry-Forward' },
      { id: 'schedule-vda', label: 'How to Report in ITR (Schedule VDA)' },
      { id: 'common-mistakes', label: 'Common Mistakes That Trigger Notices' },
    ],
    content: `
<h2 id="section-115bbh">Section 115BBH: The 30% Flat Rate</h2>
<p>From FY 2022-23 onwards, income from Virtual Digital Assets (VDAs) — which includes cryptocurrencies, NFTs, and other digital tokens — is taxed under <strong>Section 115BBH</strong> at a flat rate of <strong>30%</strong> plus applicable surcharge and 4% cess. At the 30% rate, the effective tax is 31.2%.</p>
<p>This rate applies regardless of your holding period. Whether you held Bitcoin for one day or five years, the gain is taxed at 30%. There is no distinction between short-term and long-term capital gains for VDAs. There is no basic exemption threshold — even a ₹1 gain is taxable at 30% (though practically, TDS captures it at source).</p>
<p>The only deduction allowed while computing VDA income is the <strong>cost of acquisition</strong> — the price you paid to acquire the asset. No other expenses (brokerage, exchange fees, electricity costs for mining) are deductible against VDA income. Mining income is taxable as income from other sources in the year the coins are received, and the fair market value on the date of receipt becomes your cost of acquisition for any future sale.</p>

<h2 id="what-is-taxable">Every Taxable Event</h2>
<ul>
  <li><strong>Sale of crypto for INR:</strong> Gain = Sale price minus cost of acquisition. Taxable at 30%.</li>
  <li><strong>Crypto-to-crypto swap:</strong> Each swap is a taxable event. The gain on the crypto you give up is taxable in the year of the swap, computed as the fair market value of what you received minus the cost of what you gave.</li>
  <li><strong>Crypto used to buy goods or services:</strong> Treated as a sale at the fair market value of the goods/services received.</li>
  <li><strong>Airdrop tokens:</strong> The fair market value of airdropped tokens on the date of receipt is taxable as income from other sources. This becomes your cost of acquisition for future gains computation.</li>
  <li><strong>Staking and yield farming rewards:</strong> Rewards received are taxable as income from other sources at fair market value on the date of receipt. Same treatment as airdrops — receipt is the taxable event, not the eventual sale.</li>
  <li><strong>NFT sales:</strong> NFTs are VDAs. Sale of an NFT minus cost of acquisition is taxed at 30%. Creation of an NFT and its first sale is taxable as business income or income from other sources depending on the facts.</li>
  <li><strong>Gifts of crypto:</strong> If you receive crypto as a gift from a non-relative and the value exceeds ₹50,000, it is taxable under Section 56(2)(x). Gifts from specified relatives are exempt.</li>
</ul>

<h2 id="tds-194s">1% TDS Under Section 194S</h2>
<p>Section 194S requires deduction of TDS at 1% on payments for transfer of VDAs. If you sell crypto on a recognised Indian exchange (like CoinDCX, Zebpay, WazirX) and your sales exceed ₹50,000 in a financial year (₹10,000 for non-specified persons), the exchange deducts 1% TDS from your proceeds and deposits it with the government.</p>
<p>This TDS is not the final tax — it is an advance tax credit. Your actual tax liability at 30% will be much higher than the 1% TDS. The TDS appears in your Form 26AS and can be claimed as a credit when you file your ITR. You must pay the balance 29% (approximately) either as advance tax during the year or as self-assessment tax before filing.</p>
<p>Peer-to-peer transactions: if you sell crypto directly to another individual and the consideration exceeds ₹10,000 (or ₹50,000 if the buyer is a specified person), the buyer is required to deduct 1% TDS. In practice, this is widely ignored — but non-compliance can attract penalties for the buyer and scrutiny for the seller.</p>

<h2 id="no-setoff">No Loss Set-Off or Carry-Forward</h2>
<p>This is the most punishing aspect of India's crypto tax regime. <strong>Losses from VDA transactions cannot be set off against any other income</strong> — not against salary, not against capital gains on stocks, not against business income. A loss on Bitcoin cannot even be set off against a gain on Ethereum. Each VDA is treated independently for loss purposes.</p>
<p>Furthermore, VDA losses cannot be <strong>carried forward</strong> to future years. A loss incurred in FY 2024-25 is simply gone — it provides no future tax benefit. This asymmetry means the tax system only participates in your gains, never your losses.</p>
<p>The practical implication: tax-loss harvesting strategies that work for equity or debt mutual funds do not work for crypto. If you are sitting on losses in one crypto and gains in another, you cannot net them off.</p>

<h2 id="schedule-vda">How to Report in ITR — Schedule VDA</h2>
<p>VDA income is reported in <strong>Schedule VDA</strong> in ITR-2 or ITR-3. For each transaction (or category of transactions), you report the date of acquisition, date of transfer, cost of acquisition, sale consideration, and resulting gain/loss. The schedule also requires disclosure of whether TDS was deducted under Section 194S.</p>
<p>You must report all VDA transactions, even if they resulted in a loss or zero gain. Non-disclosure is treated as concealment of income under Section 271(1)(c), which can attract penalties of 100-300% of the tax sought to be evaded.</p>
<p>Most Indian crypto exchanges provide a downloadable transaction history and some provide a computed P&L statement in ITR-compatible format. Download this before the ITR deadline and reconcile it with your 26AS TDS credits.</p>

<h2 id="common-mistakes">Common Mistakes That Trigger Notices</h2>
<ul>
  <li><strong>Not reporting airdrops and staking rewards:</strong> Many taxpayers only report buy-sell transactions and omit free tokens received. These show up as inflows on exchange statements and in AIS (Annual Information Statement), which the IT department now cross-checks against ITR data.</li>
  <li><strong>Reporting crypto gains under capital gains instead of Schedule VDA:</strong> VDAs have their own schedule and their own rate. Filing under Schedule CG results in wrong tax computation and a defective return.</li>
  <li><strong>Offsetting crypto losses against equity gains:</strong> A common error — not permitted under the current regime.</li>
  <li><strong>Ignoring foreign exchange transactions:</strong> Buying crypto on a foreign exchange using a credit card or remittance creates a VDA transaction that is still taxable in India on your global income (if you are a resident).</li>
  <li><strong>Not paying advance tax:</strong> If your estimated tax after TDS exceeds ₹10,000, you must pay advance tax in four instalments. Failure triggers interest under Sections 234B and 234C.</li>
</ul>
`,
  },

  // ─── 10 ─────────────────────────────────────────────────────────────────────
  {
    slug: 'india-vs-us-tax-comparison',
    title: 'India vs USA Tax Comparison: Where Do You Pay More?',
    excerpt:
      'The headline rates look similar, but the effective tax burden diverges sharply once you account for self-employment tax, healthcare costs, capital gains treatment, and social security. Here is the honest comparison.',
    category: 'India Tax',
    country: 'ALL',
    readTime: 8,
    date: '2025-04-05',
    featured: false,
    toc: [
      { id: 'headline-rates', label: 'Headline Rate Comparison' },
      { id: 'moderate-income', label: 'Moderate Income: ₹10L / $50K' },
      { id: 'high-income', label: 'High Income: ₹50L / $200K' },
      { id: 'self-employment', label: 'Self-Employment Tax: Where the US Hurts' },
      { id: 'capital-gains', label: 'Capital Gains: US 0% Bracket vs India 12.5%' },
      { id: 'hidden-costs', label: 'Healthcare: The Hidden Tax' },
      { id: 'verdict', label: 'The Verdict' },
    ],
    content: `
<h2 id="headline-rates">Headline Rate Comparison</h2>
<p>Both India and the USA have top marginal income tax rates in the 30-37% range. But marginal rates are the least useful number for comparison. The effective tax rate — what you actually pay as a percentage of your total income — tells a very different story across income levels.</p>
<table>
  <thead><tr><th>Metric</th><th>India (FY 2025-26)</th><th>USA (2025)</th></tr></thead>
  <tbody>
    <tr><td>Top federal/central rate</td><td>30% (+ surcharge)</td><td>37%</td></tr>
    <tr><td>Basic exemption / standard deduction</td><td>₹4L (new regime) / ₹2.5L (old)</td><td>$15,000 single / $30,000 MFJ</td></tr>
    <tr><td>Social security equivalent</td><td>EPF 12% employer + 12% employee</td><td>FICA 15.3% (6.2% SS + 1.45% Medicare, each side)</td></tr>
    <tr><td>State/local taxes</td><td>None on income</td><td>0-13% (California 13.3%)</td></tr>
    <tr><td>Capital gains on equity (long-term)</td><td>12.5% above ₹1.25L</td><td>0% / 15% / 20% based on income</td></tr>
  </tbody>
</table>

<h2 id="moderate-income">Moderate Income: ₹10 Lakh / $50,000</h2>
<p><strong>India (₹10 lakh gross, salaried, new regime):</strong> Standard deduction ₹75,000. Taxable income ₹9.25 lakh. Tax: 5% on ₹4L–₹8L = ₹20,000; 10% on ₹1.25L = ₹12,500. Total: ₹32,500 + 4% cess = ₹33,800. Effective rate: 3.4%.</p>
<p><strong>USA ($50,000, single, no other deductions):</strong> Standard deduction $15,000. Taxable: $35,000. Tax: 10% on $11,925 = $1,193; 12% on $23,075 = $2,769. Federal tax: ~$3,962. FICA on full $50,000: $3,825 (employee share). Total: $7,787. Effective rate including FICA: 15.6%.</p>
<p>At moderate income, India's tax burden is dramatically lower. The 87A rebate and generous slab structure mean most people earning under ₹12.75 lakh pay near-zero income tax in India. FICA equivalents (EPF) are different because EPF contributions go into a retirement account that you recover — unlike US FICA which is a pure tax on self-employed individuals.</p>

<h2 id="high-income">High Income: ₹50 Lakh / $200,000</h2>
<p><strong>India (₹50 lakh, old regime, with maximum deductions):</strong> Deductions: 80C ₹1.5L + 80D ₹75K + HRA ₹2L + 80CCD(1B) ₹50K + standard ₹50K = ₹5.25L. Taxable: ₹44.75L. Tax at 30%: ~₹11.3L + 10% surcharge on income above ₹50L (not applicable here). Effective rate: ~22.6%.</p>
<p><strong>USA ($200,000, single, California):</strong> Federal: ~$45,000 (effective ~22.5%). California state: ~$17,000 (effective ~8.5%). FICA: $13,025 (Social Security capped at $11,160 on $176,100 + Medicare on full amount). Total: ~$75,000. Effective rate: 37.5%.</p>
<p>At high income, the US becomes significantly more expensive — especially with state income taxes. A $200K earner in California faces a combined effective rate approaching 40%. An equivalent earner in India stays under 25% even in the old regime.</p>

<h2 id="self-employment">Self-Employment Tax: Where the US Hurts</h2>
<p>This is the biggest practical difference that freelancers and consultants need to understand. In India, a self-employed person pays income tax at slab rates. There is no separate "self-employment tax" — EPF contributions are voluntary for the self-employed.</p>
<p>In the USA, a self-employed person pays <strong>Self-Employment Tax of 15.3%</strong> on net self-employment income (up to the Social Security wage base for the 12.4% SS component, unlimited for the 2.9% Medicare component). This is in addition to federal and state income tax. A US freelancer earning $100,000 pays approximately $14,130 in SE tax alone before any income tax is calculated — and while they can deduct half of SE tax, the net burden is still ~$12,500.</p>
<p>India's structure (ITR-4 presumptive taxation at 44AD: 8% presumed profit, or actual books) is far more favourable for self-employed individuals at comparable income levels.</p>

<h2 id="capital-gains">Capital Gains: US 0% Bracket vs India 12.5%</h2>
<p>The US has a <strong>0% long-term capital gains rate</strong> for taxpayers with taxable income below $48,350 (single, 2025) or $96,700 (married filing jointly). This is a significant benefit for moderate-income investors — you can realise substantial long-term gains completely tax-free.</p>
<p>India taxes long-term equity gains (held over 1 year) at 12.5% on gains exceeding ₹1.25 lakh per year. For large equity portfolios, this is a real cost. On ₹20 lakh in LTCG, the Indian tax is ₹2.34 lakh. For a comparable amount in the US at moderate income, it could be zero.</p>
<p>However, India's equity gains rate of 12.5% is still lower than the US 20% rate (for high earners) plus the 3.8% Net Investment Income Tax, making India better at the top end.</p>

<h2 id="hidden-costs">Healthcare: The Hidden Tax</h2>
<p>Any honest India-US tax comparison must address healthcare. In India, government hospitals provide basic care at low or no cost. Private insurance for a family of four with reasonable coverage costs ₹30,000–₹60,000 per year and is partially deductible under 80D.</p>
<p>In the US, employer-sponsored health insurance often costs the employee $500–$1,500 per month in premiums ($6,000–$18,000/year), typically not fully deductible. Out-of-pocket maximums can reach $9,450 per person. Healthcare can add 8-15% of gross income to the true cost of living for many American households — a cost with no Indian equivalent at the same income level.</p>

<h2 id="verdict">The Verdict</h2>
<p>At most income levels, India's total tax burden (income tax + social security equivalent) is lower than the USA's when healthcare costs are excluded. When healthcare is included, the gap widens further in India's favour at moderate and middle incomes. At the highest income levels (₹2 crore+ / $500K+), US-friendly structures (like capital gains treatment in some states) can narrow the gap. But for the vast majority of working professionals, India is the lower-tax jurisdiction.</p>
`,
  },

  // ─── 11 ─────────────────────────────────────────────────────────────────────
  {
    slug: 'uk-cgt-guide-2025',
    title: 'UK Capital Gains Tax 2025-26: Rates, Annual Exempt Amount, What You Must Report',
    excerpt:
      'The UK annual exempt amount has been slashed from £12,300 to £3,000 and CGT rates on non-property assets rose in the October 2024 Budget. More people than ever need to report gains. Here is the complete picture.',
    category: 'UK Tax',
    country: 'UK',
    readTime: 7,
    date: '2025-04-05',
    featured: false,
    calculatorCta: { label: 'Calculate UK Capital Gains Tax', href: '/uk' },
    toc: [
      { id: 'annual-exempt', label: 'Annual Exempt Amount: £3,000' },
      { id: 'rates-2025', label: 'CGT Rates from October 2024' },
      { id: 'property', label: 'Residential Property: 18% / 24%' },
      { id: '30-day-rule', label: '30-Day Reporting Rule for Property' },
      { id: 'badr', label: 'Business Asset Disposal Relief' },
      { id: 'bed-and-isa', label: 'Bed-and-ISA Strategy' },
      { id: 'reporting', label: 'When and How to Report' },
    ],
    content: `
<h2 id="annual-exempt">Annual Exempt Amount: £3,000</h2>
<p>The CGT Annual Exempt Amount (AEA) has been progressively reduced from £12,300 in 2022-23 to £6,000 in 2023-24, and then to <strong>£3,000 for 2024-25 and 2025-26</strong>. This means gains up to £3,000 per tax year are free of CGT. Any gains above this threshold are added to your income and taxed at the applicable CGT rate.</p>
<p>The practical consequence: many more people now have a CGT liability. A modest investment account with £50,000 invested over several years could easily generate gains exceeding £3,000 in a single year of rebalancing. If you have not already moved investments into ISAs, this is now urgent.</p>
<p>Married couples and civil partners each have their own £3,000 AEA — so a couple can realise £6,000 in gains tax-free, or transfer assets between each other at no gain/no loss to optimise which partner uses their AEA first.</p>

<h2 id="rates-2025">CGT Rates from October 2024</h2>
<p>The October 2024 Autumn Budget raised CGT rates on non-property assets with effect from 30 October 2024. The previous 10%/20% structure became <strong>18%/24%</strong>:</p>
<table>
  <thead><tr><th>Asset Type</th><th>Basic Rate Taxpayer</th><th>Higher/Additional Rate Taxpayer</th></tr></thead>
  <tbody>
    <tr><td>Shares, funds, other assets</td><td>18%</td><td>24%</td></tr>
    <tr><td>Residential property</td><td>18%</td><td>24%</td></tr>
    <tr><td>Business assets (BADR)</td><td>10%</td><td>10%</td></tr>
    <tr><td>Carried interest</td><td>32%</td><td>32%</td></tr>
  </tbody>
</table>
<p>Note that residential property and other assets now have the same rates — previously, property was taxed at 18%/28%. Whether you are a basic or higher rate taxpayer is determined by adding your capital gains (above the AEA) to your income and seeing which band they fall into.</p>

<h2 id="property">Residential Property CGT</h2>
<p>Gains from the sale of residential property in the UK are subject to the same 18%/24% rates as other assets. However, there are important reliefs and reporting requirements that differ from other assets.</p>
<p><strong>Principal Private Residence (PPR) Relief:</strong> Your main home is fully exempt from CGT. If you have lived in the property as your main residence for the entire period of ownership (plus the final 9 months), there is no CGT whatsoever. If you only lived there for part of the ownership period, PPR relief is apportioned accordingly.</p>
<p><strong>Letting Relief:</strong> Where PPR applies and the property has been let, letting relief is available up to the lower of the PPR relief amount, the gain from letting, or £40,000. Since April 2020, letting relief is only available if the owner was in shared occupancy with the tenant — limiting its practical use.</p>

<h2 id="30-day-rule">30-Day Reporting Rule for Property</h2>
<p>When you sell UK residential property and a CGT liability arises, you must report and pay the tax within <strong>60 days</strong> of completion (the rules changed from 30 days to 60 days from October 2021). This is separate from your annual Self Assessment tax return.</p>
<p>You report through HMRC's online Capital Gains Tax service. Failure to report within 60 days incurs automatic penalties: £100 for up to 6 months late, rising to £300 or 5% of the tax due for longer delays, plus interest on unpaid tax from the 60-day deadline.</p>
<p>If the sale results in a loss or no gain (because of PPR relief), you do not need to report via the 60-day service, but you may want to note the loss for future offset on your Self Assessment return.</p>

<h2 id="badr">Business Asset Disposal Relief</h2>
<p>Business Asset Disposal Relief (BADR), formerly Entrepreneurs' Relief, taxes qualifying gains at <strong>10%</strong> up to a lifetime limit of £1 million. To qualify, you must have owned the business (or shares) for at least 2 years prior to disposal, held at least 5% of the ordinary share capital (for company shares), and been an employee or officer of the company.</p>
<p>The £1 million lifetime limit is per person, not per disposal. Once used, it is gone. Where gains exceed £1 million, the excess is taxed at the normal CGT rates. Given the October 2024 changes, the 10% BADR rate is now very attractive — 14 percentage points below the standard 24% rate for higher rate taxpayers.</p>

<h2 id="bed-and-isa">Bed-and-ISA Strategy</h2>
<p>The "bed-and-ISA" strategy involves selling holdings outside an ISA, crystallising a gain up to the £3,000 AEA, then immediately repurchasing the same holding inside a Stocks and Shares ISA. Future growth is then sheltered from CGT inside the ISA wrapper.</p>
<p>The ISA annual allowance is £20,000. You can bed-and-ISA up to £20,000 per year per person. For couples, £40,000 per year can be moved into ISAs. Given the current £3,000 AEA, it is often worth realising gains to the extent of the AEA each year and reinvesting in ISAs, rather than holding indefinitely and facing a large CGT bill on eventual disposal.</p>
<p>There is no "bed-and-breakfast" restriction for moving into ISAs — the anti-avoidance 30-day rule applies to repurchasing the same asset in the same account, not to ISA subscriptions.</p>

<h2 id="reporting">When and How to Report</h2>
<p>You must report CGT on your Self Assessment tax return if your gains exceed the £3,000 AEA, or if your total proceeds from disposals exceed £50,000 in the tax year (even if no net gain). The Self Assessment deadline is 31 January following the tax year end (5 April).</p>
<p>For property disposals with a CGT liability, additionally file the 60-day report as described above. The tax paid on the 60-day return is credited against your final Self Assessment liability — you are not double-taxed.</p>
`,
  },

  // ─── 12 ─────────────────────────────────────────────────────────────────────
  {
    slug: 'itr2-filing-guide',
    title: 'How to File ITR-2: Step-by-Step Guide for Capital Gains and Multiple Income Sources',
    excerpt:
      'ITR-2 is mandatory if you have capital gains from equity, property or mutual funds, more than one house, foreign assets, or are an NRI. Miss the right schedule and you will get a defective-return notice.',
    category: 'India Tax',
    country: 'IN',
    readTime: 9,
    date: '2025-04-05',
    featured: false,
    calculatorCta: { label: 'Estimate Capital Gains Tax', href: '/in' },
    toc: [
      { id: 'who-files-itr2', label: 'Who Must File ITR-2' },
      { id: 'schedule-cg', label: 'Schedule CG: Capital Gains' },
      { id: 'schedule-hp', label: 'Schedule HP: House Property' },
      { id: 'schedule-os', label: 'Schedule OS: Other Sources' },
      { id: 'schedule-fa', label: 'Schedule FA: Foreign Assets (Mandatory)' },
      { id: 'regime-choice', label: 'Choosing Your Regime in ITR-2' },
      { id: 'common-errors', label: 'Common Errors That Trigger Notices' },
    ],
    content: `
<h2 id="who-files-itr2">Who Must File ITR-2</h2>
<p>ITR-2 is the correct form if you have income from salary or pension <strong>plus</strong> any of the following: capital gains from shares, mutual funds, or property; income from more than one house property; foreign income or foreign assets; income exceeding ₹50 lakh; status as a director in any company; or you are an NRI with Indian-source income.</p>
<p>ITR-1 (Sahaj) is restricted to residents with only salary, one house property, and limited other income below ₹50 lakh — and no capital gains. If you sold even one equity share or one mutual fund unit during the year, ITR-1 is incorrect and you must use ITR-2.</p>
<p>ITR-2 cannot be used by individuals with business or professional income. If you have any income under the head "Profits and Gains of Business or Profession", you need ITR-3 (or ITR-4 for presumptive taxation).</p>

<h2 id="schedule-cg">Schedule CG: Capital Gains</h2>
<p>Schedule CG is the most complex schedule in ITR-2. It separates gains by holding period and asset type, as each combination carries a different tax rate:</p>
<ul>
  <li><strong>Short-Term Capital Gains (STCG) under Section 111A:</strong> Equity shares and equity-oriented mutual funds held 12 months or less. Tax rate: 20% (raised from 15% in the July 2024 Budget). Reported in Part B of Schedule CG.</li>
  <li><strong>Long-Term Capital Gains (LTCG) under Section 112A:</strong> Equity and equity-oriented MFs held over 12 months. Tax: 12.5% on gains exceeding ₹1.25 lakh. Report the gross gain, the exempt amount (up to ₹1.25L), and the taxable balance.</li>
  <li><strong>STCG under Section 112:</strong> Debt mutual funds, property held under 24 months, gold. Taxed at slab rates.</li>
  <li><strong>LTCG under Section 112:</strong> Property, gold, debt MFs held over 24 months. Taxed at 12.5% without indexation (post-July 2024 Budget for property).</li>
</ul>
<p>For each capital asset sold, you report the date of acquisition, date of sale, sale consideration, cost of acquisition (and indexed cost if applicable for pre-July 2024 property transactions), and the resulting gain or loss. Losses from one head can be set off against gains within the same head (STCL against STCG or LTCG; LTCL only against LTCG).</p>

<h2 id="schedule-hp">Schedule HP: House Property</h2>
<p>Schedule HP requires reporting for every house property you own. For each property, you declare: whether it is self-occupied, let-out, or deemed let-out (if you own more than two properties, all but two must be treated as deemed let-out at notional market rent).</p>
<p>For let-out properties: Gross rent received minus municipal taxes paid = Net Annual Value. Apply 30% standard deduction on Net Annual Value. Then deduct the actual interest on home loan (no cap for let-out property — only capped at ₹2 lakh for self-occupied). The resulting income (or loss) feeds into your total income computation.</p>
<p>House property loss can be set off against other income heads (salary, business) in the same year, but is capped at ₹2 lakh per year under the current rules. Excess loss can be carried forward for 8 years and set off against future house property income only.</p>

<h2 id="schedule-os">Schedule OS: Other Sources</h2>
<p>Schedule OS covers income not classifiable under salary, house property, business, or capital gains. This includes FD interest, savings account interest (above ₹10,000 taxable under 80TTA in old regime), dividends, winnings from lotteries or online games, and interest on income tax refunds from the department.</p>
<p>Dividends from Indian companies: taxable at slab rates. TDS of 10% is deducted by the company if dividends exceed ₹5,000 in a year. Report gross dividends in Schedule OS and claim the TDS in the TDS schedule.</p>
<p>Online gaming winnings: taxable at 30% under Section 115BBJ from FY 2023-24 onwards. TDS of 30% is deducted at source by the platform on winnings above ₹100. Reported separately in Schedule OS.</p>

<h2 id="schedule-fa">Schedule FA: Foreign Assets (Mandatory)</h2>
<p>Schedule FA (Foreign Assets) must be completed if you hold any foreign assets at any point during the year — even if the assets generated no income and no tax is payable. This is a mandatory disclosure requirement under the Black Money Act and the Foreign Exchange Management Act.</p>
<p>Foreign assets include: bank accounts outside India, equity in foreign companies (including ESOPs of foreign parent companies, even unvested), foreign mutual funds, foreign real estate, beneficial interests in foreign trusts, and foreign insurance policies. Even if your US-listed company ESOPs vested but you have not sold them, they must be reported in Schedule FA.</p>
<p>Non-disclosure of foreign assets is treated as concealment under the Black Money (Undisclosed Foreign Income and Assets) and Imposition of Tax Act, 2015, with severe penalties — flat tax of 30% on the asset value plus 90% penalty, regardless of whether any income was earned. This is why Schedule FA must never be skipped.</p>

<h2 id="regime-choice">Choosing Your Regime in ITR-2</h2>
<p>ITR-2 requires you to explicitly select whether you are filing under the old or new tax regime. Salaried individuals can switch between regimes each year. If you had a default employer deduction under the new regime but want to file under the old regime to claim HRA, 80C, and other deductions, you make that choice in the ITR.</p>
<p>The tax computation section of ITR-2 will compute tax under your selected regime. Make sure all claimed deductions are consistent with your regime choice — old-regime deductions entered in a new-regime return will be automatically disallowed.</p>

<h2 id="common-errors">Common Errors That Trigger Notices</h2>
<ul>
  <li><strong>Mismatch between Form 16 and ITR:</strong> The gross salary in Schedule S of ITR-2 must match Part B of Form 16 exactly. Discrepancies trigger automated notices under Section 143(1).</li>
  <li><strong>Dividend not reported:</strong> Indian companies report dividends paid to TRACES. These appear in your AIS. If your ITR shows zero dividend income but your AIS shows ₹20,000, you will receive a notice.</li>
  <li><strong>LTCG exemption applied incorrectly:</strong> The ₹1.25 lakh LTCG exemption applies to the total gains across all equity/MF transactions, not per security. Applying it per security results in over-claiming the exemption.</li>
  <li><strong>Not reporting scrip-by-scrip gains for unlisted shares:</strong> For unlisted shares, Schedule CG requires scrip-level reporting. Aggregated entry is insufficient.</li>
  <li><strong>Claiming 80C deductions in new regime:</strong> If you selected new regime but also entered 80C deductions, the ITR system flags this as an error before submission.</li>
</ul>
`,
  },

  // ─── 13 ─────────────────────────────────────────────────────────────────────
  {
    slug: 'advance-tax-guide',
    title: 'Advance Tax India: Who Pays, How Much, When — Avoid 234B/234C Interest',
    excerpt:
      'If your tax liability after TDS exceeds ₹10,000, you must pay advance tax in four instalments. Miss a deadline and Sections 234B and 234C charge interest at 1% per month. Here is exactly how to calculate and avoid penalties.',
    category: 'India Tax',
    country: 'IN',
    readTime: 7,
    date: '2025-04-05',
    featured: false,
    calculatorCta: { label: 'Calculate Advance Tax', href: '/in' },
    toc: [
      { id: 'who-must-pay', label: 'Who Must Pay Advance Tax' },
      { id: 'schedule', label: 'Payment Schedule: Four Instalments' },
      { id: 'calculation', label: 'How to Calculate Your Advance Tax' },
      { id: '234b-234c', label: 'Interest u/s 234B and 234C: Exact Formula' },
      { id: 'senior-citizens', label: 'Senior Citizens: Partial Exemption' },
      { id: 'payment', label: 'How to Pay Advance Tax Online' },
    ],
    content: `
<h2 id="who-must-pay">Who Must Pay Advance Tax</h2>
<p>Any taxpayer whose estimated income tax liability for the year (after deducting TDS already deducted or likely to be deducted) exceeds <strong>₹10,000</strong> must pay advance tax. This threshold applies to individuals, HUFs, firms, and companies alike.</p>
<p>The most common scenario requiring advance tax: salaried employees with significant interest income, dividend income, or capital gains where TDS is either not deducted or deducted at a lower rate. If your employer's TDS covers your entire liability, you may not need to pay additional advance tax — but if you have side income from freelancing, equity gains, or FD interest, that extra income creates an advance tax obligation.</p>
<p>The key principle is <em>pay as you earn</em>. The advance tax system requires you to estimate your income for the year and prepay tax in instalments, rather than paying everything at the time of filing.</p>

<h2 id="schedule">Payment Schedule: Four Instalments</h2>
<table>
  <thead><tr><th>Due Date</th><th>Cumulative Tax to Be Paid</th></tr></thead>
  <tbody>
    <tr><td>15 June</td><td>15% of estimated annual tax</td></tr>
    <tr><td>15 September</td><td>45% of estimated annual tax</td></tr>
    <tr><td>15 December</td><td>75% of estimated annual tax</td></tr>
    <tr><td>15 March</td><td>100% of estimated annual tax</td></tr>
  </tbody>
</table>
<p>These are cumulative, not marginal percentages. By 15 September you should have paid 45% total, not an additional 45%. If you missed the June instalment and paid nothing by September, you need to pay 45% by September 15 to avoid interest for that period.</p>
<p>For taxpayers electing the presumptive taxation scheme under Section 44AD or 44ADA, there is a simplified structure: pay the entire advance tax in a single instalment by <strong>15 March</strong> of the relevant financial year.</p>

<h2 id="calculation">How to Calculate Your Advance Tax</h2>
<p>Advance tax is computed on your estimated total income for the year. The process:</p>
<ol>
  <li>Estimate your total income for the year: salary, business income, capital gains (estimate based on transactions done so far), FD interest, dividends, and any other income.</li>
  <li>Deduct eligible deductions: standard deduction, 80C, 80D, HRA, NPS contributions, etc. (if you are in the old regime).</li>
  <li>Compute income tax on the estimated taxable income at applicable slab rates plus surcharge and cess.</li>
  <li>Subtract TDS already deducted or expected to be deducted during the year (check Form 26AS for year-to-date TDS).</li>
  <li>If the resulting net liability exceeds ₹10,000, advance tax is required. Pay the cumulative percentages by the respective deadlines.</li>
</ol>
<p>You are not penalised for estimating slightly high or low — the interest calculation accounts for timing differences, not the absolute amount. Revise your estimate after each quarter as more information becomes available.</p>

<h2 id="234b-234c">Interest u/s 234B and 234C: Exact Formula</h2>
<p><strong>Section 234B (Shortfall in advance tax paid):</strong> If you pay less than 90% of your assessed tax by 31 March, interest is charged at 1% per month (or part of a month) on the shortfall from 1 April of the assessment year until the date of payment or filing. Example: Tax liability ₹1 lakh. Advance tax paid by 31 March: ₹50,000 (50%, less than 90%). Shortfall: ₹50,000. Interest from 1 April: ₹50,000 × 1% × months until payment.</p>
<p><strong>Section 234C (Deferment of advance tax):</strong> Interest is charged separately for each instalment missed or underpaid, at 1% per month for 3 months (except the last instalment, which is 1% for 1 month only).</p>
<table>
  <thead><tr><th>Instalment</th><th>Shortfall</th><th>Interest Period</th><th>Rate</th></tr></thead>
  <tbody>
    <tr><td>June (15%)</td><td>Amount short of 15%</td><td>3 months</td><td>1%/month</td></tr>
    <tr><td>September (45%)</td><td>Amount short of 45%</td><td>3 months</td><td>1%/month</td></tr>
    <tr><td>December (75%)</td><td>Amount short of 75%</td><td>3 months</td><td>1%/month</td></tr>
    <tr><td>March (100%)</td><td>Amount short of 100%</td><td>1 month</td><td>1%/month</td></tr>
  </tbody>
</table>
<p>Note: If your total advance tax paid by 15 March equals at least 100% of the prior year's tax (Section 234C safe harbour), you are not subject to 234C interest — even if your actual current-year liability is higher. This safe-harbour provision is useful when income is volatile or hard to predict.</p>

<h2 id="senior-citizens">Senior Citizens: Partial Exemption</h2>
<p>Senior citizens (aged 60 or above) who are <strong>resident in India</strong> and do <strong>not</strong> have income from business or profession are fully exempt from paying advance tax. They can pay the entire tax liability as self-assessment tax at the time of filing without any Section 234B or 234C interest.</p>
<p>However, if a senior citizen has any income under the head "Profits and Gains of Business or Profession" — even small consultancy income — this exemption does not apply and they must pay advance tax on the same schedule as everyone else.</p>

<h2 id="payment">How to Pay Advance Tax Online</h2>
<p>Pay via the Income Tax e-filing portal (www.incometax.gov.in) under the "e-Pay Tax" section. Select Challan 280, Assessment Year (AY 2026-27 for FY 2025-26), and type of payment "Advance Tax (100)". Pay via net banking or debit card. The challan counterfoil with BSR code and challan serial number is your proof of payment — keep this for ITR filing where you enter these details in the Tax Payment schedule.</p>
`,
  },

  // ─── 14 ─────────────────────────────────────────────────────────────────────
  {
    slug: 'home-loan-tax-benefits',
    title: 'Home Loan Tax Benefits India: Section 24(b), 80C, 80EEA — Maximum Saving',
    excerpt:
      'A home loan can reduce your taxable income by up to ₹5 lakh per year through three different sections. But the rules for each differ significantly — here is how to claim every rupee you are entitled to.',
    category: 'India Tax',
    country: 'IN',
    readTime: 8,
    date: '2025-04-05',
    featured: false,
    calculatorCta: { label: 'Calculate Home Loan Tax Saving', href: '/in' },
    toc: [
      { id: '24b', label: 'Section 24(b): Interest Deduction' },
      { id: '80c-principal', label: 'Section 80C: Principal Repayment' },
      { id: '80eea', label: 'Section 80EEA: Affordable Housing Bonus' },
      { id: 'pre-emi', label: 'Pre-EMI Interest: The 1/5th Rule' },
      { id: 'joint-loan', label: 'Joint Home Loan: Double the Benefit' },
      { id: 'let-out', label: 'Let-Out Property: No Interest Cap' },
      { id: 'new-regime', label: 'Home Loan in the New Regime' },
    ],
    content: `
<h2 id="24b">Section 24(b): Interest Deduction</h2>
<p>Section 24(b) allows a deduction for interest paid on a loan taken for purchase, construction, repair, or renovation of a house property. The rules differ based on how you use the property:</p>
<p><strong>Self-occupied property:</strong> The deduction is capped at <strong>₹2 lakh per year</strong>. To claim this cap, the construction or purchase must be completed within 5 years of the end of the financial year in which the loan was taken. If construction takes longer than 5 years, the deduction is restricted to ₹30,000 only.</p>
<p><strong>Let-out or deemed let-out property:</strong> There is no upper cap on interest deduction under Section 24(b). The full interest paid is deductible. However, the resulting loss from house property can be set off against other income only up to ₹2 lakh per year — any excess is carried forward for 8 years.</p>
<p>The interest must be on a loan taken specifically for the property. Personal loans or credit cards used for home purchase do not qualify. The lender must be a bank, housing finance company, or similar institution. The borrower need not be the owner of the property — any co-borrower can claim 24(b) deduction proportionate to their interest payment.</p>

<h2 id="80c-principal">Section 80C: Principal Repayment</h2>
<p>The principal component of your home loan EMI qualifies for Section 80C deduction. This is within the overall ₹1.5 lakh cap along with PF, ELSS, PPF, LIC, and school fees. The deduction is available <strong>only under the old tax regime</strong>.</p>
<p>An important restriction: if you sell the house within 5 years of purchase (or 5 years from the end of the year in which the property was purchased), all 80C deductions previously claimed for principal repayment are reversed and added back to your income in the year of sale.</p>
<p>Additionally, stamp duty and registration charges paid at the time of property purchase are also eligible for Section 80C deduction in the year of payment — this is often overlooked. These charges can easily run to ₹1–3 lakh on a property purchase and provide useful 80C headroom.</p>

<h2 id="80eea">Section 80EEA: Affordable Housing Bonus</h2>
<p>Section 80EEA provides an additional deduction of up to <strong>₹1.5 lakh per year</strong> on home loan interest for qualifying affordable housing purchases. This is over and above the ₹2 lakh Section 24(b) deduction — bringing the total potential interest deduction to ₹3.5 lakh per year.</p>
<p>Eligibility criteria for 80EEA: the loan must have been sanctioned between April 2019 and March 2022 (this sunset clause has not been extended as of 2025); the stamp duty value of the property must not exceed ₹45 lakh; the taxpayer must not own any other residential property on the date of loan sanction.</p>
<p>If your loan was sanctioned before March 2022 and your property value meets the threshold, you can continue claiming 80EEA for the entire tenure of the loan — the sunset clause applies to new sanctions, not to ongoing loans.</p>

<h2 id="pre-emi">Pre-EMI Interest: The 1/5th Rule</h2>
<p>When you take a home loan for an under-construction property, the lender often disburses funds in stages and charges interest on the disbursed amount before possession (the "pre-EMI" or "pre-construction" period). Full EMI starts only from the month of possession.</p>
<p>This pre-construction interest is not deductible in the years it is paid. Instead, it is deductible in 5 equal instalments starting from the year of possession. Each instalment is one-fifth of the total pre-construction interest, and it is deductible as part of the Section 24(b) deduction in each of the 5 years.</p>
<p>Example: Pre-EMI interest paid over 3 years while under construction: ₹5 lakh total. From the year of possession, you deduct ₹1 lakh per year (₹5L ÷ 5) as part of your Section 24(b) deduction, in addition to the current year's interest. This continues for 5 years from possession.</p>

<h2 id="joint-loan">Joint Home Loan: Double the Benefit</h2>
<p>If you take a home loan jointly with a co-borrower (typically spouse, parent, or sibling), <strong>each co-borrower who is also a co-owner</strong> can independently claim the full Section 24(b) deduction (up to ₹2 lakh each) and Section 80C principal repayment deduction.</p>
<p>For a couple with combined income, this means total home loan tax benefits of up to ₹4 lakh per year on interest alone (₹2L + ₹2L) plus ₹3 lakh per year on principal (₹1.5L + ₹1.5L, subject to each person having 80C headroom) = potential ₹7 lakh annual deduction from a single joint home loan.</p>
<p>The co-borrower must be a co-owner in the property. Being only a loan co-borrower without property ownership does not entitle you to Section 24(b) or 80C deductions. Ensure the property sale deed reflects both names.</p>

<h2 id="let-out">Let-Out Property: No Interest Cap</h2>
<p>For properties that are rented out, the full interest paid on the home loan is deductible from rental income with no cap. If your interest exceeds the rental income (a common situation in the early years of a high-value property loan), the resulting loss can be set off against salary or business income in the same year, limited to ₹2 lakh. Any remaining loss is carried forward.</p>
<p>Strategic implication: investors who rent out mortgaged properties with high loan-to-value ratios may generate house property losses that offset their salary income, reducing overall tax liability. This remains one of the few legitimate mechanisms to create cross-head set-off in the old regime.</p>

<h2 id="new-regime">Home Loan in the New Regime</h2>
<p>Section 24(b) for self-occupied property is <strong>not available</strong> in the new tax regime. Section 80C principal repayment and 80EEA are also not available. For let-out property, Section 24(b) interest deduction remains available in the new regime (since it is treated as income computation, not a deduction). If you have a home loan on a self-occupied property, this is a significant argument for sticking with the old regime.</p>
`,
  },

  // ─── 15 ─────────────────────────────────────────────────────────────────────
  {
    slug: 'us-tax-brackets-2025',
    title: 'US Federal Tax Brackets 2025: Complete Guide with Examples',
    excerpt:
      'Seven brackets, four filing statuses, FICA on top, and the AMT waiting at high incomes. Most Americans misunderstand how marginal rates work. This guide explains it all with clear examples.',
    category: 'US Tax',
    country: 'US',
    readTime: 8,
    date: '2025-04-05',
    featured: false,
    calculatorCta: { label: 'Calculate US Federal Tax', href: '/us' },
    toc: [
      { id: 'how-brackets-work', label: 'How Marginal Brackets Actually Work' },
      { id: 'single-brackets', label: 'Single and MFS Brackets 2025' },
      { id: 'mfj-hoh', label: 'MFJ and Head of Household Brackets' },
      { id: 'standard-deduction', label: 'Standard Deduction 2025' },
      { id: 'fica', label: 'FICA: Social Security and Medicare' },
      { id: 'amt', label: 'AMT: Who Gets Hit and How to Check' },
      { id: 'effective-rate', label: 'Effective Rate Examples at $75K, $150K, $300K' },
    ],
    content: `
<h2 id="how-brackets-work">How Marginal Brackets Actually Work</h2>
<p>The single most widespread misconception about US income taxes is that your entire income is taxed at your "tax bracket." It is not. The US uses a <strong>progressive marginal rate system</strong>: only the income within each bracket is taxed at that bracket's rate. Your top marginal rate applies only to the last dollar you earned — not to all of your income.</p>
<p>Example: A single filer earning $100,000 in 2025 does not pay 22% on all $100,000. They pay 10% on the first $11,925, 12% on the next $36,550, and 22% on the remaining amount above $48,475. The $100,000 earner's effective federal income tax rate is approximately 17%, not 22%.</p>

<h2 id="single-brackets">Single and Married Filing Separately (MFS) Brackets 2025</h2>
<table>
  <thead><tr><th>Taxable Income</th><th>Tax Rate</th></tr></thead>
  <tbody>
    <tr><td>$0 – $11,925</td><td>10%</td></tr>
    <tr><td>$11,926 – $48,475</td><td>12%</td></tr>
    <tr><td>$48,476 – $103,350</td><td>22%</td></tr>
    <tr><td>$103,351 – $197,300</td><td>24%</td></tr>
    <tr><td>$197,301 – $250,525</td><td>32%</td></tr>
    <tr><td>$250,526 – $626,350</td><td>35%</td></tr>
    <tr><td>Over $626,350</td><td>37%</td></tr>
  </tbody>
</table>
<p>MFS uses the same brackets as Single. Note that MFS filers cannot claim many common deductions and credits, making it a disadvantageous status in most cases. It is used primarily in specific situations such as spouse with significant medical expenses or when legal separation of finances is required.</p>

<h2 id="mfj-hoh">Married Filing Jointly (MFJ) and Head of Household Brackets 2025</h2>
<table>
  <thead><tr><th>Taxable Income (MFJ)</th><th>Taxable Income (HoH)</th><th>Rate</th></tr></thead>
  <tbody>
    <tr><td>$0 – $23,850</td><td>$0 – $17,000</td><td>10%</td></tr>
    <tr><td>$23,851 – $96,950</td><td>$17,001 – $64,850</td><td>12%</td></tr>
    <tr><td>$96,951 – $206,700</td><td>$64,851 – $103,350</td><td>22%</td></tr>
    <tr><td>$206,701 – $394,600</td><td>$103,351 – $197,300</td><td>24%</td></tr>
    <tr><td>$394,601 – $501,050</td><td>$197,301 – $250,500</td><td>32%</td></tr>
    <tr><td>$501,051 – $751,600</td><td>$250,501 – $626,350</td><td>35%</td></tr>
    <tr><td>Over $751,600</td><td>Over $626,350</td><td>37%</td></tr>
  </tbody>
</table>
<p>MFJ brackets are approximately double the Single brackets — this is the "marriage bonus" for couples where one spouse earns significantly more than the other. The "marriage penalty" applies when both spouses earn similar high incomes, pushing combined income into higher brackets faster than if they filed separately.</p>

<h2 id="standard-deduction">Standard Deduction 2025</h2>
<table>
  <thead><tr><th>Filing Status</th><th>Standard Deduction</th></tr></thead>
  <tbody>
    <tr><td>Single</td><td>$15,000</td></tr>
    <tr><td>Married Filing Jointly</td><td>$30,000</td></tr>
    <tr><td>Married Filing Separately</td><td>$15,000</td></tr>
    <tr><td>Head of Household</td><td>$22,500</td></tr>
    <tr><td>Additional (age 65+ or blind, single)</td><td>+$2,000</td></tr>
    <tr><td>Additional (age 65+ or blind, MFJ per qualifying person)</td><td>+$1,600</td></tr>
  </tbody>
</table>
<p>The standard deduction reduces your Adjusted Gross Income (AGI) to arrive at taxable income. Roughly 90% of Americans take the standard deduction because it exceeds their itemised deductions. Itemising makes sense primarily when mortgage interest, state and local taxes (SALT, capped at $10,000), and charitable contributions combined exceed the standard deduction.</p>

<h2 id="fica">FICA: Social Security and Medicare</h2>
<p>FICA (Federal Insurance Contributions Act) taxes are separate from income tax and are calculated on gross wages, not taxable income. They are not affected by the standard deduction or itemised deductions.</p>
<ul>
  <li><strong>Social Security:</strong> 6.2% employee + 6.2% employer = 12.4% total. Applies to the first <strong>$176,100</strong> of wages in 2025. Self-employed pay the full 12.4%.</li>
  <li><strong>Medicare:</strong> 1.45% employee + 1.45% employer = 2.9% total. No income cap — applies to all wages. Self-employed pay the full 2.9%.</li>
  <li><strong>Additional Medicare Tax:</strong> 0.9% on wages above $200,000 (single) or $250,000 (MFJ). Employer does not match this additional amount.</li>
</ul>
<p>For an employee earning $100,000, FICA cost is 7.65% ($7,650) — entirely separate from income tax. For a self-employed person, the full 15.3% applies ($15,300), though half of SE tax is deductible when computing income tax.</p>

<h2 id="amt">AMT: Who Gets Hit and How to Check</h2>
<p>The Alternative Minimum Tax (AMT) is a parallel tax system designed to ensure high-income taxpayers pay at least a minimum amount of tax regardless of deductions. It recalculates your income tax under a different set of rules, then you pay the higher of regular tax or AMT.</p>
<p>AMT exemptions for 2025: $88,100 for Single, $137,000 for MFJ. The exemption phases out at higher incomes. AMT primarily affects people with large ISO (Incentive Stock Option) exercises, significant depreciation deductions, high state and local tax deductions, or many personal exemptions. If your income is below $200,000 and you do not have ISOs, you are unlikely to owe AMT.</p>
<p>To check: use Form 6251 or tax software. If Line 7 of Form 6251 (AMTI minus exemption) is zero, you are not subject to AMT. Key AMT preferences to watch: ISO exercise spreads are treated as AMT income even if you have not sold the shares.</p>

<h2 id="effective-rate">Effective Rate Examples</h2>
<table>
  <thead><tr><th>Income</th><th>Status</th><th>Taxable Income</th><th>Federal Income Tax</th><th>Effective Rate</th><th>Including FICA</th></tr></thead>
  <tbody>
    <tr><td>$75,000</td><td>Single</td><td>$60,000</td><td>~$8,760</td><td>11.7%</td><td>~19.4%</td></tr>
    <tr><td>$150,000</td><td>Single</td><td>$135,000</td><td>~$25,160</td><td>16.8%</td><td>~23.5%</td></tr>
    <tr><td>$300,000</td><td>MFJ</td><td>$270,000</td><td>~$54,000</td><td>18.0%</td><td>~22.4%</td></tr>
  </tbody>
</table>
<p>State income taxes add an additional 0–13% on top, depending on state. California (13.3%), New Jersey (10.75%), and New York (10.9% city + state) have the highest combined rates. States like Texas, Florida, Nevada, and Washington have no state income tax.</p>
`,
  },

  // ─── 16 ─────────────────────────────────────────────────────────────────────
  {
    slug: 'salary-restructuring-india',
    title: 'India Salary Restructuring: How to Reduce TDS by ₹40,000+ Legally',
    excerpt:
      'Your CTC is fixed, but how it is split across components dramatically changes your take-home pay. The right structure — with NPS employer contribution, food allowance, and HRA optimisation — can save ₹40,000 or more annually.',
    category: 'India Tax',
    country: 'IN',
    readTime: 8,
    date: '2025-04-05',
    featured: false,
    calculatorCta: { label: 'Model Your Salary Structure', href: '/in' },
    toc: [
      { id: 'why-structure-matters', label: 'Why Salary Structure Matters' },
      { id: 'optimal-split', label: 'Optimal CTC Split' },
      { id: 'food-allowance', label: 'Food Allowance: ₹26,400 Tax-Free' },
      { id: 'nps-employer', label: 'NPS Employer Contribution: The Biggest Lever' },
      { id: 'lta', label: 'LTA: Tax-Free Travel Twice in 4 Years' },
      { id: 'ask-hr', label: 'What to Ask Your HR (With Script)' },
      { id: 'new-vs-old-structure', label: 'Which Components Work in New Regime' },
    ],
    content: `
<h2 id="why-structure-matters">Why Salary Structure Matters</h2>
<p>Two employees at the same CTC can have very different take-home pay if their salary is structured differently. A poorly structured CTC puts everything into fully taxable gross salary. A well-structured CTC uses allowances and employer contributions that are either exempt from tax or come with special deductions.</p>
<p>The key insight: certain salary components are treated more favourably by the tax law than plain salary. Food allowances up to ₹2,200/month are exempt. Employer NPS contributions are deductible under 80CCD(2) with no rupee cap (only a percentage cap). LTA covers actual domestic travel costs tax-free. These are all legitimate, CBDT-sanctioned structures — not grey-area planning.</p>
<p>The catch: you need to negotiate these components with your employer at the time of joining or at appraisal. Most employers are willing to restructure — it costs them nothing (the total CTC stays the same) and improves your take-home, which aids retention.</p>

<h2 id="optimal-split">Optimal CTC Split</h2>
<p>For a ₹20 lakh CTC in a metro city, a tax-efficient structure might look like this:</p>
<table>
  <thead><tr><th>Component</th><th>Amount (Annual)</th><th>Tax Treatment</th></tr></thead>
  <tbody>
    <tr><td>Basic salary</td><td>₹8,00,000 (40% of CTC)</td><td>Fully taxable</td></tr>
    <tr><td>HRA (50% of basic in metro)</td><td>₹4,00,000</td><td>Exempt up to formula limit (Section 10(13A))</td></tr>
    <tr><td>Food allowance</td><td>₹26,400 (₹2,200/month)</td><td>Fully exempt</td></tr>
    <tr><td>LTA</td><td>₹50,000</td><td>Exempt on actual travel (twice in 4 years)</td></tr>
    <tr><td>NPS employer contribution (10% of basic)</td><td>₹80,000</td><td>Exempt under 80CCD(2) — no cap</td></tr>
    <tr><td>Special allowance / performance pay</td><td>₹6,43,600</td><td>Fully taxable</td></tr>
    <tr><td><strong>Total CTC</strong></td><td><strong>₹20,00,000</strong></td><td></td></tr>
  </tbody>
</table>
<p>Compare with a flat structure (₹20 lakh as pure gross salary): tax under old regime (after 80C and standard deduction) is approximately ₹3.3 lakh. With optimal structure, taxable salary is reduced by the exempt HRA, food allowance, and NPS contribution — potentially bringing tax below ₹2.5 lakh, saving over ₹80,000.</p>

<h2 id="food-allowance">Food Allowance: ₹26,400 Tax-Free</h2>
<p>Under a CBDT circular, food allowances paid to employees are exempt from tax up to <strong>₹50 per meal for two meals per working day</strong>. For a standard 22-working-day month, this works out to ₹2,200 per month or ₹26,400 per year — fully exempt from income tax.</p>
<p>This component is typically structured as a meal coupon (Sodexo, Zeta, etc.) or a food reimbursement. It requires evidence of use for food — most employers handle this through a meal card that can only be used at food outlets. There is no requirement to submit actual bills; the card restriction is sufficient documentation.</p>
<p>This is one of the simplest restructuring moves. The tax saving at 30% rate: ₹26,400 × 31.2% = ₹8,237 per year with zero additional investment or commitment.</p>

<h2 id="nps-employer">NPS Employer Contribution: The Biggest Lever</h2>
<p>Section 80CCD(2) allows a deduction for your employer's contribution to your NPS Tier 1 account, up to <strong>10% of your basic salary</strong> (14% for central government employees). This deduction is available in <em>both</em> old and new tax regimes, making it the most universally powerful restructuring tool.</p>
<p>At ₹8 lakh basic, the employer can contribute ₹80,000 to NPS. At the 30% tax rate, this saves ₹80,000 × 31.2% = ₹24,960 per year. The employer CTC stays unchanged — the ₹80,000 that would have gone to you as taxable special allowance now goes to your NPS retirement account instead.</p>
<p>The downside is lock-in: NPS Tier 1 contributions are locked until age 60 (with limited partial withdrawals). If you value liquidity, weigh this against the tax saving. For most salaried professionals in the 30% bracket with long time horizons, the NPS employer contribution is the best restructuring move available.</p>

<h2 id="lta">LTA: Tax-Free Travel Twice in 4 Years</h2>
<p>Leave Travel Allowance (LTA) is exempt from tax on actual domestic travel costs — flights, trains, or buses — for yourself and immediate family. The exemption can be claimed for two journeys within a block of 4 calendar years. The current block is 2022–2025.</p>
<p>LTA is available only under the old tax regime. The exempt amount is the actual fare (economy airfare for the shortest route, or actual train/bus fare). Accommodation, food, and other travel expenses are not covered. You submit bills to your employer, who adjusts TDS accordingly.</p>
<p>LTA must be part of your CTC structure in advance — you cannot claim it ad hoc. Ensure it is included as a named component in your appointment letter or salary annexure.</p>

<h2 id="ask-hr">What to Ask Your HR (With Script)</h2>
<p>Most HR teams are receptive to salary restructuring requests, especially at the time of appraisal or when joining. Here is a concise ask:</p>
<p><em>"I'd like to restructure my CTC to include the following tax-efficient components within the same total cost: (1) NPS employer contribution of 10% of basic under Section 80CCD(2), (2) meal allowance of ₹2,200/month as a meal card, (3) LTA of [amount] per year, and (4) HRA at 50% of basic. The total CTC remains unchanged. Can you check if these can be reflected in my revised salary structure?"</em></p>
<p>Large companies and those with flexible benefit plans handle this routinely. Smaller employers may need the specific section references — provide them Section 80CCD(2), the CBDT food allowance circular (Circular No. 15/2001), and Section 10(5) for LTA.</p>

<h2 id="new-vs-old-structure">Which Components Work in the New Regime</h2>
<table>
  <thead><tr><th>Component</th><th>Old Regime</th><th>New Regime</th></tr></thead>
  <tbody>
    <tr><td>NPS employer contribution (80CCD(2))</td><td>Exempt</td><td>Exempt</td></tr>
    <tr><td>Food allowance</td><td>Exempt</td><td>Exempt</td></tr>
    <tr><td>HRA exemption</td><td>Exempt</td><td>Not available</td></tr>
    <tr><td>LTA</td><td>Exempt</td><td>Not available</td></tr>
    <tr><td>Standard deduction</td><td>₹50,000</td><td>₹75,000</td></tr>
  </tbody>
</table>
<p>Even in the new regime, NPS employer contribution and food allowance remain powerful. HRA and LTA are lost — which is a key factor when deciding which regime to choose.</p>
`,
  },

  // ─── 17 ─────────────────────────────────────────────────────────────────────
  {
    slug: 'form-16-explained',
    title: 'Form 16 Explained: How to Read Part A and Part B for ITR Filing',
    excerpt:
      'Form 16 is your employer\'s TDS certificate, but it contains far more than just TDS figures. Part B has your full salary breakup, all exemptions claimed, and every deduction — everything you need to file ITR accurately.',
    category: 'India Tax',
    country: 'IN',
    readTime: 7,
    date: '2025-04-05',
    featured: false,
    calculatorCta: { label: 'File ITR with Form 16 Data', href: '/in' },
    toc: [
      { id: 'what-is-form16', label: 'What Is Form 16 and Who Issues It' },
      { id: 'part-a', label: 'Part A: TDS Summary from TRACES' },
      { id: 'part-b', label: 'Part B: Salary Breakup and Deductions' },
      { id: 'verify-26as', label: 'Verify Form 16 Against 26AS and AIS' },
      { id: 'no-form16', label: 'No Form 16? Still File by July 31' },
      { id: 'discrepancies', label: 'Common Discrepancies and How to Handle Them' },
    ],
    content: `
<h2 id="what-is-form16">What Is Form 16 and Who Issues It</h2>
<p>Form 16 is a TDS certificate issued by your employer under Section 203 of the Income Tax Act. It certifies the amount of TDS deducted from your salary and deposited with the government during the financial year. Every employer who deducts TDS on salary must issue Form 16 to each employee by <strong>June 15</strong> following the financial year end.</p>
<p>Form 16 has two parts: <strong>Part A</strong> is generated and downloaded by your employer from the TRACES portal (the government's TDS processing system) and bears a unique certificate number. <strong>Part B</strong> is prepared by your employer and contains the salary and deduction details. Both parts must be provided together — a Form 16 without Part A (the TRACES-generated portion) is not valid.</p>
<p>If your employer does not deduct TDS because your income is below the threshold, they are not required to issue Form 16. However, you may still have a tax liability and must file your ITR independently.</p>

<h2 id="part-a">Part A: TDS Summary from TRACES</h2>
<p>Part A is the authoritative TDS record. Key fields to check:</p>
<ul>
  <li><strong>Employer's TAN:</strong> The Tax Deduction Account Number of your employer. Verify this matches the TAN in your 26AS — any mismatch means the TDS may not be credited to your account.</li>
  <li><strong>Employee PAN:</strong> Verify your PAN is correct. If your employer had an incorrect PAN, TDS may have been deposited under a wrong account.</li>
  <li><strong>Quarter-wise TDS summary:</strong> The table shows TDS deducted in Q1 (April–June), Q2 (July–September), Q3 (October–December), and Q4 (January–March), and the corresponding dates of deposit. Check that all quarterly amounts add up to the total TDS shown in Part B.</li>
  <li><strong>TRACES certificate number:</strong> This unique number makes Part A tamper-evident. You can verify it on the TRACES portal (tdscpc.gov.in) to confirm authenticity.</li>
</ul>

<h2 id="part-b">Part B: Salary Breakup and Deductions</h2>
<p>Part B is the working document for your ITR. It shows:</p>
<ul>
  <li><strong>Gross salary:</strong> Your total CTC or taxable salary before exemptions. This is what goes into Schedule S (Salary) in your ITR.</li>
  <li><strong>Allowances exempt under Section 10:</strong> HRA exempt amount, LTA exempt amount, food allowance, and any other Section 10 exemptions your employer has accounted for. These reduce gross salary to arrive at income chargeable under the head salary.</li>
  <li><strong>Perquisites:</strong> Any taxable perquisites (company car, accommodation, ESOPs exercised) should appear here at their deemed value.</li>
  <li><strong>Deductions under Chapter VI-A:</strong> The deductions your employer factored in when computing TDS — typically 80C (if you submitted proofs), 80D, HRA-related calculations, NPS under 80CCD(1B). These are shown for reference but you are not bound by them in your ITR — you can claim additional deductions not submitted to your employer.</li>
  <li><strong>Tax on employment / professional tax:</strong> State-level professional tax deducted from salary (up to ₹2,500) appears as a deduction.</li>
  <li><strong>Net taxable salary:</strong> The amount after all exemptions and deductions, which should equal the basis on which TDS was computed.</li>
</ul>

<h2 id="verify-26as">Verify Form 16 Against 26AS and AIS</h2>
<p>Before using Form 16 figures in your ITR, reconcile them against two government sources:</p>
<p><strong>Form 26AS</strong> (available on the income tax e-filing portal under "View Tax Credit"): shows TDS deposited against your PAN by all deductors. The TDS from your employer in Part A of Form 16 must match 26AS exactly. If your employer deposited less than what Part A says, you will get a credit for only the actual deposit — contact your employer to rectify.</p>
<p><strong>Annual Information Statement (AIS)</strong> (also on the portal): a comprehensive statement of all financial information the IT department has about you — salary, TDS, bank interest, dividends, mutual fund transactions, property transactions, and more. Cross-check your Form 16 salary figure against the AIS salary entry. Discrepancies between your ITR and AIS will trigger automated notices under Section 143(1).</p>

<h2 id="no-form16">No Form 16? Still File by July 31</h2>
<p>If your employer has not issued Form 16 by June 15, you are not exempt from filing your ITR by July 31. Use your salary slips to construct the salary breakup. Use 26AS and AIS to confirm TDS deposited. File your ITR based on these sources.</p>
<p>You can also use the pre-filled ITR on the income tax portal — it pulls data from 26AS and AIS and pre-populates much of the salary, TDS, and income information. Review it carefully before submission, as the pre-filled data occasionally contains errors or merges figures incorrectly.</p>
<p>After filing without Form 16, if your employer subsequently issues it and the figures differ from what you filed, you can file a revised return before December 31 of the assessment year.</p>

<h2 id="discrepancies">Common Discrepancies and How to Handle Them</h2>
<ul>
  <li><strong>TDS in Form 16 does not match 26AS:</strong> This is the most serious discrepancy. It means your employer's TDS return (24Q) was filed with errors or the TDS was not deposited. Contact your employer's payroll or finance team immediately. Do not claim the mismatch amount in your ITR — claim only what appears in 26AS.</li>
  <li><strong>HRA exemption in Part B is higher than your actual eligibility:</strong> Your employer may have used incorrect rent figures or not followed the formula correctly. Recalculate using the three-method formula. Claim the correct lower amount in your ITR — over-claiming based on Form 16 is your responsibility, not your employer's.</li>
  <li><strong>Salary in AIS is higher than Part B of Form 16:</strong> Could indicate perquisites not included in Form 16, or an error in employer reporting. Investigate before filing. If AIS is correct and Form 16 is missing components, you must include the AIS figure in your ITR.</li>
  <li><strong>Old employer's Form 16 not received:</strong> If you changed jobs, your old employer must also issue Form 16. Chase them — you need both Form 16s to file correctly. Your 26AS will show TDS from both employers.</li>
</ul>
`,
  },

  // ─── 18 ─────────────────────────────────────────────────────────────────────
  {
    slug: 'tax-saving-last-minute',
    title: 'Last-Minute Tax Saving Before March 31: What You Can Still Do',
    excerpt:
      'March 31 is the hard deadline for most tax-saving investments. With days remaining, here is what you can still do — and what is genuinely too late — so you do not waste money on ineffective last-minute moves.',
    category: 'India Tax',
    country: 'IN',
    readTime: 7,
    date: '2025-04-05',
    featured: false,
    calculatorCta: { label: 'Check How Much Tax You Can Still Save', href: '/in' },
    toc: [
      { id: 'what-matters', label: 'What March 31 Deadline Actually Covers' },
      { id: 'emergency-80c', label: 'Emergency 80C Moves That Work' },
      { id: '80d-health', label: 'Health Insurance: 80D Before March 31' },
      { id: 'nps-last', label: 'NPS: ₹50K Deduction, Same-Day Processing' },
      { id: 'advance-tax-march', label: 'Advance Tax: March 15 Was the Last Instalment' },
      { id: 'too-late', label: 'What You Cannot Do Last Minute' },
      { id: 'next-year', label: 'Plan April to Avoid This Panic Next Year' },
    ],
    content: `
<h2 id="what-matters">What March 31 Deadline Actually Covers</h2>
<p>The March 31 deadline for tax-saving investments applies to <strong>investments and expenditures that must actually occur</strong> within the financial year (April 1 to March 31). Unlike the ITR filing deadline (July 31), you cannot retroactively make tax-saving investments after the financial year ends.</p>
<p>Everything in this article assumes you are filing under the old tax regime. If you are on the new regime, very few of these deductions are available — but NPS employer contribution (80CCD(2)) and the advance tax obligation still apply regardless of regime.</p>
<p>The key categories that have hard March 31 deadlines: Section 80C investments (ELSS, PPF, NPS, LIC premium), Section 80D health insurance premiums, Section 80CCD(1B) NPS contributions, and donation deductions under Section 80G.</p>

<h2 id="emergency-80c">Emergency 80C Moves That Work</h2>
<p>If you have unused 80C capacity as of late March, here are options that can be executed within 1–3 working days:</p>
<ul>
  <li><strong>ELSS mutual funds (lump sum):</strong> The most flexible 80C option. Buy through your bank app or mutual fund platform — units are allotted same day for most fund houses. The 3-year lock-in is the shortest among all 80C instruments. Do not invest in ELSS just for the tax deduction — choose funds with a good track record. Investment up to ₹1.5 lakh qualifies for 80C.</li>
  <li><strong>PPF contribution:</strong> If you have an existing PPF account, a top-up before March 31 qualifies for 80C. Annual maximum is ₹1.5 lakh (across all contributions in the year). Online transfer to your PPF account is instant if linked to your bank. If you do not have a PPF account, you cannot open and contribute in time — PPF accounts typically take a few days to activate.</li>
  <li><strong>NPS Tier 1 (own contribution):</strong> Contributes to both 80C (under 80CCD(1)) up to ₹1.5L and 80CCD(1B) up to ₹50K. Online contribution via D-CRA or your bank's NPS link is typically processed same day. The combined 80CCD(1) + 80CCD(1B) deduction can be up to ₹2 lakh total — all from NPS alone.</li>
  <li><strong>5-year bank FD:</strong> Qualifies for 80C but requires your bank to process it before March 31. Online booking is available with most major banks. Interest is taxable in each year — lower yield than ELSS over 5 years for most investors.</li>
</ul>
<p>Do not rush into poor investment decisions for tax saving. If you have already used your ₹1.5 lakh 80C, additional investments in the same instruments provide no further deduction.</p>

<h2 id="80d-health">Health Insurance: 80D Before March 31</h2>
<p>Section 80D allows deduction of health insurance premiums paid for yourself, spouse, children, and parents. The limits are:</p>
<ul>
  <li>₹25,000 for self and family (₹50,000 if you or spouse is a senior citizen)</li>
  <li>Additional ₹25,000 for parents (₹50,000 if parents are senior citizens)</li>
  <li>Maximum combined deduction: ₹1 lakh (if both self and parents are senior citizens)</li>
</ul>
<p>Health insurance premiums must be paid within the financial year. If your policy renewes in January, the premium paid in January qualifies for 80D in that financial year (FY 2024-25), not the next one. If your policy is due for renewal in April, paying early (before March 31) does not allow you to claim it for the current year — the deduction follows the payment date.</p>
<p>Preventive health check-up expenses up to ₹5,000 are deductible under 80D (within the overall limit). Cash payment is not allowed for insurance premiums — must be paid by cheque, NEFT, or card.</p>

<h2 id="nps-last">NPS: ₹50K Deduction, Same-Day Processing</h2>
<p>The 80CCD(1B) deduction of ₹50,000 (over and above 80C) is one of the easiest last-minute tax saving moves. Online NPS contributions via the eNPS platform (enps.nsdl.com), through your net banking, or your bank's NPS portal are typically processed same day or next working day.</p>
<p>Your NPS PRAN (Permanent Retirement Account Number) is required. If you do not have a PRAN, you can register and contribute online in the same session — though processing the new account may take 2–3 working days. If it is the last two days of March, do not attempt to open a new NPS account for a last-minute contribution.</p>
<p>At the 30% tax bracket, ₹50,000 into NPS saves ₹15,600 in tax immediately. Even accounting for the lock-in and the eventual tax on 20% of the corpus at withdrawal, the net after-tax return on this investment is compelling.</p>

<h2 id="advance-tax-march">Advance Tax: March 15 Was the Last Instalment</h2>
<p>The fourth and final advance tax instalment (100% of estimated annual tax) was due on <strong>March 15</strong>, not March 31. If you have not paid your advance tax and your net liability (after TDS) exceeds ₹10,000, you are already accruing interest under Sections 234B and 234C.</p>
<p>Even after March 15, you can pay the balance as self-assessment tax before filing your ITR. The 234C interest for deferment after the March 15 instalment is charged at 1% per month for 1 month on the shortfall. Additional 234B interest continues from April 1 of the assessment year until the date of actual payment. Pay self-assessment tax (Challan 280, Type 300) as soon as possible to stop the interest clock.</p>

<h2 id="too-late">What You Cannot Do Last Minute</h2>
<ul>
  <li><strong>HRA deduction:</strong> Requires actual rent paid for actual months. You cannot backdate a rent agreement or pay 12 months of rent in March and claim exemption — the exemption is computed monthly and must reflect actual rent paid in each month.</li>
  <li><strong>LTA:</strong> Requires actual domestic travel. You cannot buy a flight ticket and not travel, or travel on March 31 to claim LTA — the exemption requires genuine travel and original bills.</li>
  <li><strong>Home loan interest (Section 24(b)):</strong> Accrues throughout the year on actual EMI paid. Cannot be prepaid or manufactured at year-end.</li>
  <li><strong>Section 80EEA:</strong> The loan must have been sanctioned before March 2022. You cannot create a qualifying loan now.</li>
  <li><strong>Backdating investments:</strong> Never backdate ELSS, PPF, or any investment. Mutual fund platforms issue date-stamped NAV confirmations; banks issue dated receipts. Any backdating constitutes fraud under the Income Tax Act.</li>
</ul>

<h2 id="next-year">Plan April to Avoid This Panic Next Year</h2>
<p>The antidote to last-minute chaos is a April 1 start. In April of the new financial year: (1) Compute your expected gross income for the year; (2) Decide which tax regime you will use; (3) Set up monthly SIP in ELSS to spread 80C investment across 12 months instead of lumping in March; (4) Renew health insurance policy and note the renewal date; (5) Set an advance tax reminder for June 15, September 15, December 15, and March 15. Spreading investments removes the end-of-year liquidity crunch and avoids impulsive decisions driven by tax urgency rather than financial logic.</p>
`,
  },
];

// Derived helpers
export const CATEGORIES: BlogCategory[] = [
  'India Tax',
  'US Tax',
  'UK Tax',
  'Planning',
  'Crypto Tax',
  'NRI',
];

export const CATEGORY_COLORS: Record<BlogCategory, string> = {
  'India Tax': 'bg-[var(--india)]/10 text-[var(--india)] border border-[var(--india)]/20',
  'US Tax': 'bg-[var(--us)]/10 text-[var(--us)] border border-[var(--us)]/20',
  'UK Tax': 'bg-[var(--uk)]/10 text-[var(--uk)] border border-[var(--uk)]/20',
  'Planning': 'bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20',
  'Crypto Tax': 'bg-purple-500/10 text-purple-700 border border-purple-300 dark:text-purple-400 dark:border-purple-700',
  'NRI': 'bg-[var(--surface-raised)] text-[var(--text-secondary)] border border-[var(--border)]',
};

export function getRelatedArticles(current: BlogArticle, count = 3): BlogArticle[] {
  return blogArticles
    .filter(
      (a) =>
        a.slug !== current.slug &&
        (a.category === current.category || a.country === current.country),
    )
    .slice(0, count);
}
