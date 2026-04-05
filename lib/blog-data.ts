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
