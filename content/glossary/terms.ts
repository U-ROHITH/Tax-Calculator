export interface GlossaryTerm {
  term: string;
  shortDef: string;
  fullDef: string;
  country: 'IN' | 'US' | 'UK' | 'ALL';
  category: 'income' | 'deduction' | 'tax_type' | 'filing' | 'investment' | 'penalty';
  relatedTerms?: string[];
  seeAlso?: string;
}

export const terms: GlossaryTerm[] = [
  // ─── INDIA ───────────────────────────────────────────────────────────────────
  {
    term: 'Gross Total Income (GTI)',
    shortDef: 'Total income from all five heads before Chapter VI-A deductions are applied.',
    fullDef:
      'GTI is computed by aggregating income from five heads: Salaries, House Property, Capital Gains, Business/Profession, and Other Sources. For a salaried individual, GTI typically equals salary income plus any house property income, capital gains, and interest income. Deductions under Chapter VI-A (Sections 80C–80U) are subtracted from GTI to arrive at the final taxable income. GTI is the starting point for most tax-planning calculations.',
    country: 'IN',
    category: 'income',
    relatedTerms: ['Standard Deduction', 'Section 80C', 'Assessment Year (AY)'],
    seeAlso: 'Section 14',
  },
  {
    term: 'Assessment Year (AY)',
    shortDef: 'The year in which income earned in the previous financial year is assessed and tax is computed.',
    fullDef:
      'AY is always one year ahead of the Financial Year (FY) in which income is earned. For example, AY 2026-27 covers income earned during FY 2025-26 (April 1, 2025 to March 31, 2026). All tax returns, notices, and assessments reference the AY. When filing an ITR, taxpayers must select the correct AY to ensure credits and refunds are applied to the right year.',
    country: 'IN',
    category: 'filing',
    relatedTerms: ['Previous Year (FY)', 'ITR', 'Advance Tax'],
  },
  {
    term: 'Previous Year (FY)',
    shortDef: 'The financial year (April 1 – March 31) in which income is earned; income is taxed in the following Assessment Year.',
    fullDef:
      'India follows an April–March fiscal cycle. The year in which you earn income is called the Previous Year or Financial Year (FY). For instance, FY 2025-26 runs from April 1, 2025 to March 31, 2026. Tax on this income is computed and paid in AY 2026-27. The distinction between PY and AY is fundamental to understanding due dates for TDS, advance tax, and ITR filing.',
    country: 'IN',
    category: 'filing',
    relatedTerms: ['Assessment Year (AY)', 'TDS', 'Advance Tax'],
  },
  {
    term: 'Standard Deduction',
    shortDef: 'A flat deduction of ₹75,000 for salaried employees under the new regime (₹50,000 under the old regime); no documentation required.',
    fullDef:
      'Introduced in 2018, the Standard Deduction replaced the earlier transport and medical-reimbursement exemptions. Under the new tax regime for FY 2025-26, it is ₹75,000. Under the old regime it remains ₹50,000. It is available to all salaried employees and pensioners automatically — no bills or employer certification is needed. The deduction is applied against salary income before arriving at GTI.',
    country: 'IN',
    category: 'deduction',
    relatedTerms: ['Gross Total Income (GTI)', 'HRA Exemption', 'Section 80C'],
    seeAlso: 'Section 16(ia)',
  },
  {
    term: 'HRA Exemption',
    shortDef: 'Exemption on House Rent Allowance for employees paying rent; computed as the least of three limits.',
    fullDef:
      'The HRA exemption is the least of: (1) actual HRA received, (2) rent paid minus 10% of basic salary, or (3) 50% of basic salary for metro cities (40% for non-metros). It is available only under the old tax regime. If you live in your own house or do not pay rent, the entire HRA is taxable. To claim it, you need rent receipts; for annual rent above ₹1 lakh, the landlord\'s PAN is mandatory.',
    country: 'IN',
    category: 'deduction',
    relatedTerms: ['Standard Deduction', 'Gross Total Income (GTI)'],
    seeAlso: 'Section 10(13A)',
  },
  {
    term: 'TDS (Tax Deducted at Source)',
    shortDef: 'Tax deducted by the payer at the time of making a payment; credited against the recipient\'s final tax liability.',
    fullDef:
      'TDS is a withholding mechanism where the payer (employer, bank, tenant, etc.) deducts tax before remitting income to the recipient. Common examples: employers deduct TDS on salary, banks deduct 10% on FD interest above ₹40,000. The deductor deposits TDS with the government and issues Form 16/16A. Recipients can view all TDS credits in Form 26AS and claim them when filing their ITR to reduce the final tax payable or obtain a refund.',
    country: 'IN',
    category: 'tax_type',
    relatedTerms: ['Form 26AS', 'AIS (Annual Information Statement)', 'Advance Tax'],
    seeAlso: 'Section 192–206',
  },
  {
    term: 'Form 26AS',
    shortDef: 'Annual tax credit statement showing all TDS deducted, advance tax paid, and high-value transactions linked to your PAN.',
    fullDef:
      'Form 26AS is issued by the Income Tax Department and is accessible on the e-filing portal. It consolidates TDS deducted by all deductors (employers, banks, etc.), advance tax and self-assessment tax payments, and high-value financial transactions reported under Section 285BA. Before filing an ITR, taxpayers should reconcile Form 26AS with their own records to ensure no TDS credit is missed. It has been partially superseded by AIS, which contains more detailed information.',
    country: 'IN',
    category: 'filing',
    relatedTerms: ['TDS', 'AIS (Annual Information Statement)', 'ITR'],
  },
  {
    term: 'AIS (Annual Information Statement)',
    shortDef: 'An expanded version of Form 26AS that includes FD interest, dividends, property transactions, and foreign remittances.',
    fullDef:
      'Introduced in 2021, AIS aggregates financial data reported to the Income Tax Department from multiple sources: banks, registrars, mutual funds, and foreign exchange dealers. It covers salary, dividends, interest, mutual fund transactions, property purchases/sales, and foreign remittances. The AIS also shows a Taxpayer Information Summary (TIS) for quick review. Taxpayers can provide feedback on incorrect entries; the IT department uses AIS data to cross-verify ITR disclosures and issue notices.',
    country: 'IN',
    category: 'filing',
    relatedTerms: ['Form 26AS', 'TDS', 'ITR'],
  },
  {
    term: 'Advance Tax',
    shortDef: 'Tax paid in four instalments during the financial year when estimated tax liability exceeds ₹10,000.',
    fullDef:
      'If your total tax liability (after TDS) is expected to exceed ₹10,000, you must pay advance tax in instalments: 15% by June 15, 45% by September 15, 75% by December 15, and 100% by March 15. Failure to pay or shortfall results in interest under Sections 234B and 234C. Senior citizens without business income are exempt. Self-employed individuals, freelancers, and those with capital gains must actively calculate and pay advance tax.',
    country: 'IN',
    category: 'tax_type',
    relatedTerms: ['TDS', 'Assessment Year (AY)', 'ITR'],
    seeAlso: 'Section 208–234C',
  },
  {
    term: 'Section 87A Rebate',
    shortDef: 'A tax rebate of up to ₹25,000 for taxpayers with total income not exceeding ₹7 lakh under the new regime.',
    fullDef:
      'Section 87A provides a direct reduction from the tax payable (not from income). Under the new regime for FY 2025-26, the rebate is the lower of the computed tax or ₹25,000, making total income up to ₹7 lakh effectively tax-free. Under the old regime the threshold remains ₹5 lakh with a rebate of up to ₹12,500. The rebate is applied after computing tax on total income but before adding cess. It is not available on special-rate income such as LTCG on equity.',
    country: 'IN',
    category: 'deduction',
    relatedTerms: ['Gross Total Income (GTI)', 'LTCG', 'Surcharge'],
    seeAlso: 'Section 87A',
  },
  {
    term: 'Section 80C',
    shortDef: 'Deduction of up to ₹1.5 lakh for investments in PPF, ELSS, LIC, NSC, home loan principal, and tuition fees; old regime only.',
    fullDef:
      'Section 80C is the most widely used deduction in India. The aggregate limit is ₹1,50,000 per financial year across all eligible investments: Public Provident Fund (PPF), Equity Linked Saving Schemes (ELSS), life insurance premiums, National Savings Certificate (NSC), 5-year tax-saving FDs, home loan principal repayment, and children\'s tuition fees. The deduction is only available under the old tax regime; the new regime does not permit 80C claims. ELSS funds have a 3-year lock-in, making them the shortest lock-in option.',
    country: 'IN',
    category: 'deduction',
    relatedTerms: ['Section 80CCD(1B)', 'Standard Deduction', 'HUF'],
    seeAlso: 'Section 80C',
  },
  {
    term: 'Section 80CCD(1B)',
    shortDef: 'An additional ₹50,000 NPS deduction over and above the ₹1.5 lakh Section 80C cap; available under the old regime.',
    fullDef:
      'Section 80CCD(1B) allows an additional deduction of up to ₹50,000 for contributions made to the National Pension System (NPS) Tier-I account. This is separate from and in addition to the ₹1.5 lakh limit under Section 80C. Combined, a taxpayer in the old regime can claim up to ₹2 lakh purely from NPS-related deductions. The deduction is not available under the new tax regime. NPS withdrawals at retirement are partially taxable, so tax planning at both entry and exit stages is important.',
    country: 'IN',
    category: 'deduction',
    relatedTerms: ['Section 80C', 'Gross Total Income (GTI)'],
    seeAlso: 'Section 80CCD(1B)',
  },
  {
    term: 'LTCG (Long-Term Capital Gain)',
    shortDef: 'Profit from selling a capital asset held beyond the qualifying period; taxed at preferential rates.',
    fullDef:
      'The holding period threshold varies by asset class: listed equity shares and equity mutual funds require 12 months; immovable property and unlisted shares require 24 months; debt mutual funds (from April 2023) are taxed at slab rate regardless of holding. For listed equity/equity MFs, LTCG above ₹1.25 lakh per year is taxed at 12.5% (Finance Act 2024). For property, indexed LTCG is taxed at 12.5% without indexation benefit (post July 2024 Budget). Indexation using CII reduces the effective gain on property.',
    country: 'IN',
    category: 'tax_type',
    relatedTerms: ['STCG', 'CII', 'Section 50C'],
    seeAlso: 'Section 112A',
  },
  {
    term: 'STCG (Short-Term Capital Gain)',
    shortDef: 'Profit from selling a capital asset held for less than the qualifying period; generally taxed at higher rates.',
    fullDef:
      'STCG on listed equity shares and equity mutual funds (held < 12 months) is taxed at 20% (Finance Act 2024, earlier 15%). STCG on other assets — property, gold, debt funds — is taxed at the taxpayer\'s applicable income-tax slab rate. STCG is added to total income before applying slab rates for non-equity assets. Unlike LTCG, there is no threshold exemption for STCG on equity. Tax harvesting strategies often involve offsetting STCG with short-term capital losses.',
    country: 'IN',
    category: 'tax_type',
    relatedTerms: ['LTCG', 'CII', 'Gross Total Income (GTI)'],
    seeAlso: 'Section 111A',
  },
  {
    term: 'CII (Cost Inflation Index)',
    shortDef: 'CBDT-published index used to inflate the purchase cost of assets to compute real capital gains after adjusting for inflation.',
    fullDef:
      'CII is notified annually by the Central Board of Direct Taxes (CBDT). Indexed cost = Actual cost × (CII of sale year / CII of purchase year). For FY 2025-26, the CII is 376 (base year 2001-02 = 100). Indexation benefit applies to property and unlisted assets under the old rules but has been removed for property sold after July 23, 2024 — sellers must now choose between 12.5% without indexation or 20% with indexation for pre-2024 acquisitions (grandfathered). Debt mutual funds bought from April 2023 onwards cannot use indexation.',
    country: 'IN',
    category: 'investment',
    relatedTerms: ['LTCG', 'STCG', 'Section 50C'],
    seeAlso: 'Section 48',
  },
  {
    term: 'ITR (Income Tax Return)',
    shortDef: 'The form filed with the Income Tax Department declaring income, deductions, and tax paid for the year.',
    fullDef:
      'India has multiple ITR forms: ITR-1 (Sahaj) for salaried individuals with income up to ₹50 lakh; ITR-2 for individuals with capital gains or foreign income; ITR-3 for business/professional income; ITR-4 (Sugam) for presumptive income. The due date for non-audited individuals is July 31 of the AY. Belated returns can be filed up to December 31. Filing is done on the Income Tax e-filing portal (incometax.gov.in). A defective return notice under Section 139(9) is issued if the return is incomplete.',
    country: 'IN',
    category: 'filing',
    relatedTerms: ['Assessment Year (AY)', 'Advance Tax', 'TDS'],
    seeAlso: 'Section 139',
  },
  {
    term: 'Surcharge',
    shortDef: 'An additional levy on income tax for high-income taxpayers, ranging from 10% to 37% depending on income level.',
    fullDef:
      'Surcharge is computed on the base income tax (before cess). Rates for FY 2025-26: 10% if total income is ₹50 lakh–₹1 crore; 15% for ₹1–2 crore; 25% for ₹2–5 crore; 37% above ₹5 crore (only under old regime; capped at 25% under new regime). Surcharge applies in addition to the 4% health and education cess. Marginal Relief ensures that the increase in tax due to surcharge does not exceed the increase in income that triggers it.',
    country: 'IN',
    category: 'tax_type',
    relatedTerms: ['Marginal Relief', 'Section 87A Rebate', 'Gross Total Income (GTI)'],
  },
  {
    term: 'Marginal Relief',
    shortDef: 'A relief mechanism that prevents total tax outgo from exceeding the incremental income that triggers a higher surcharge slab.',
    fullDef:
      'Without Marginal Relief, earning ₹1 above the surcharge threshold could result in a disproportionately large increase in tax. For example, if income crosses ₹50 lakh, surcharge at 10% applies. Marginal Relief ensures that additional tax due to surcharge does not exceed the additional income above the threshold. The relief is computed automatically by the tax system and is relevant for incomes just above ₹50L, ₹1Cr, ₹2Cr, and ₹5Cr. It is especially important when planning year-end income recognition.',
    country: 'IN',
    category: 'tax_type',
    relatedTerms: ['Surcharge', 'Gross Total Income (GTI)'],
  },
  {
    term: 'Presumptive Taxation',
    shortDef: 'A simplified scheme for small businesses and professionals to declare a fixed percentage of turnover as profit without maintaining detailed books.',
    fullDef:
      'Under Section 44AD, businesses with turnover up to ₹3 crore (digital receipts threshold) can declare 6% (digital) or 8% (cash) of turnover as net profit. Under Section 44ADA, professionals (doctors, lawyers, CAs, etc.) with gross receipts up to ₹75 lakh can declare 50% as presumptive income. No books of accounts are required; deductions for business expenses cannot be separately claimed. If actual profit is lower than the deemed rate, regular audit rules apply. The scheme is available under both old and new regimes.',
    country: 'IN',
    category: 'income',
    relatedTerms: ['ITR', 'Advance Tax'],
    seeAlso: 'Section 44AD / 44ADA',
  },
  {
    term: 'HUF (Hindu Undivided Family)',
    shortDef: 'A separate legal and tax entity for Hindu families that receives its own basic exemption and can hold ancestral property.',
    fullDef:
      'An HUF is recognized as a distinct tax-paying entity under the Income Tax Act. It has its own PAN, can own assets, earn income, and claim the basic exemption limit (₹2.5 lakh under old regime). Income from ancestral property, inherited business, or gifts at marriage can be channelled into the HUF to split the tax burden across the family. The Karta (senior-most male or female member) manages the HUF. Partition of the HUF is taxable as a notional distribution. HUF deductions under 80C are separate from the individual member\'s limits.',
    country: 'IN',
    category: 'tax_type',
    relatedTerms: ['Section 80C', 'Clubbing of Income', 'Gross Total Income (GTI)'],
    seeAlso: 'Section 2(31)',
  },
  {
    term: 'Clubbing of Income',
    shortDef: 'A rule that adds income of a minor child or spouse to the transferor parent\'s income to prevent tax avoidance through income splitting.',
    fullDef:
      'When a taxpayer transfers assets or income to a spouse or minor child to reduce tax, the income is "clubbed" back into the transferor\'s income. Minor child income is clubbed with the higher-earning parent, but ₹1,500 per child is exempt. Exceptions exist if the child earns income through their own skill/talent. For spouses, income on assets transferred without adequate consideration is clubbed with the transferor. Clubbing does not apply to income from assets gifted to adult children.',
    country: 'IN',
    category: 'income',
    relatedTerms: ['HUF', 'Section 56(2)(x)', 'Gross Total Income (GTI)'],
    seeAlso: 'Section 60–65',
  },
  {
    term: 'Section 50C',
    shortDef: 'Deems the stamp duty value of immovable property as the sale consideration if the actual sale price is lower.',
    fullDef:
      'If a property is sold at a price lower than the stamp duty value (circle rate), the IT Department uses the stamp duty value as the deemed sale consideration for computing capital gains. This prevents underreporting of property transaction values. However, if the difference between the actual price and stamp duty value is within 10%, the actual price is accepted. Buyers face tax implications under Section 56(2)(x) if they purchase property below stamp duty value. These provisions together create a "deemed income" in both seller\'s and buyer\'s hands.',
    country: 'IN',
    category: 'income',
    relatedTerms: ['LTCG', 'CII', 'Section 56(2)(x)'],
    seeAlso: 'Section 50C',
  },
  {
    term: 'Section 56(2)(x)',
    shortDef: 'Gifts exceeding ₹50,000 received from non-relatives are taxable as income from other sources.',
    fullDef:
      'Under Section 56(2)(x), if an individual receives money or property (immovable or movable) from a non-relative whose aggregate value exceeds ₹50,000 in a financial year, the entire amount is taxable as "Income from Other Sources." Gifts from defined relatives (parents, siblings, spouse, lineal ascendants/descendants) are fully exempt. Gifts received on the occasion of marriage, through will, or from local authorities are also exempt. Property received below stamp duty value from non-relatives is taxed on the difference.',
    country: 'IN',
    category: 'income',
    relatedTerms: ['Section 50C', 'Clubbing of Income', 'Gross Total Income (GTI)'],
    seeAlso: 'Section 56(2)(x)',
  },
  {
    term: 'Form 16',
    shortDef: 'TDS certificate issued by an employer showing salary paid and tax deducted at source for the financial year.',
    fullDef:
      'Form 16 is a two-part certificate: Part A contains TDS deposited details (with TRACES-generated certificate number), and Part B contains a detailed salary breakup, exemptions, and deductions claimed. Employers must issue Form 16 by June 15 of the Assessment Year. It is the primary document needed for filing ITR-1. Salaried taxpayers should cross-check Form 16 with Form 26AS and AIS to ensure all figures are consistent before filing.',
    country: 'IN',
    category: 'filing',
    relatedTerms: ['TDS', 'Form 26AS', 'ITR'],
    seeAlso: 'Section 203',
  },

  // ─── UNITED STATES ───────────────────────────────────────────────────────────
  {
    term: 'AGI (Adjusted Gross Income)',
    shortDef: 'Gross income minus above-the-line deductions; the key figure used as the threshold for many phase-outs and credits.',
    fullDef:
      'AGI is calculated on Schedule 1 of Form 1040. Above-the-line deductions include contributions to traditional IRAs, student loan interest, half of self-employment tax, alimony paid (pre-2019 agreements), and contributions to HSAs and SEP-IRAs. AGI is the starting point for determining eligibility for itemized deductions, Roth IRA contribution limits, education credits, and EITC. Lowering AGI is one of the most effective tax-planning strategies because it cascades into multiple other benefits.',
    country: 'US',
    category: 'income',
    relatedTerms: ['MAGI', 'Standard Deduction (US)', 'QBI Deduction'],
  },
  {
    term: 'Standard Deduction (US)',
    shortDef: 'A flat amount deducted from AGI before computing tax; $15,000 for single filers and $30,000 for married filing jointly in 2025.',
    fullDef:
      'The Standard Deduction is available to all taxpayers who do not itemize. For 2025: $15,000 (Single/MFS), $30,000 (Married Filing Jointly), $22,500 (Head of Household). Additional amounts apply for taxpayers aged 65+ or legally blind. If itemized deductions (mortgage interest, state taxes up to $10,000, charitable contributions, medical expenses) exceed the standard deduction, itemizing saves more. Most taxpayers with straightforward finances benefit from the standard deduction due to the higher thresholds introduced by the Tax Cuts and Jobs Act 2017.',
    country: 'US',
    category: 'deduction',
    relatedTerms: ['AGI', 'AMT', 'EITC'],
  },
  {
    term: 'FICA',
    shortDef: 'Federal payroll taxes: Social Security (6.2% up to the wage base) and Medicare (1.45%) withheld from employee wages.',
    fullDef:
      'FICA stands for Federal Insurance Contributions Act. Employees pay 6.2% for Social Security on wages up to $176,100 (2025 wage base) and 1.45% for Medicare with no cap. Employers match these amounts. Self-employed individuals pay the full 15.3% as Self-Employment (SE) tax but may deduct half of SE tax as an above-the-line deduction. An additional 0.9% Medicare surtax applies to wages above $200,000 (single) / $250,000 (MFJ). FICA contributions fund Social Security and Medicare entitlement programs.',
    country: 'US',
    category: 'tax_type',
    relatedTerms: ['AGI', 'NIIT', 'SEP-IRA'],
  },
  {
    term: 'MAGI (Modified AGI)',
    shortDef: 'AGI with specific deductions added back; used to determine eligibility for Roth IRAs, NIIT, and ACA credits.',
    fullDef:
      'MAGI is AGI adjusted by adding back certain deductions: IRA deductions, student loan interest, excluded foreign earned income, and passive income losses. Different programs use different MAGI calculations, so the exact add-backs vary by purpose. For Roth IRA contributions in 2025: phase-out begins at $150,000 (single) and $236,000 (MFJ). For NIIT, the 3.8% surtax applies if MAGI exceeds $200,000/$250,000. For ACA premium tax credits, MAGI determines eligibility and subsidy amount based on percentage of the federal poverty line.',
    country: 'US',
    category: 'income',
    relatedTerms: ['AGI', 'NIIT', 'Roth IRA'],
  },
  {
    term: 'NIIT (Net Investment Income Tax)',
    shortDef: 'A 3.8% additional tax on investment income for high-income earners above the MAGI threshold.',
    fullDef:
      'The NIIT, established by the Affordable Care Act, applies 3.8% to the lesser of: net investment income (interest, dividends, capital gains, rental income, passive income) or the amount by which MAGI exceeds $200,000 (single) / $250,000 (MFJ) / $125,000 (MFS). Wages, active business income, and distributions from IRAs and retirement plans are excluded. NIIT is reported on Form 8960. Strategic tax-loss harvesting can reduce net investment income and minimize or eliminate NIIT.',
    country: 'US',
    category: 'tax_type',
    relatedTerms: ['MAGI', 'LTCG Rate (US)', 'AGI'],
  },
  {
    term: 'AMT (Alternative Minimum Tax)',
    shortDef: 'A parallel tax system that limits benefits from certain deductions; taxpayers pay the higher of regular tax or AMT.',
    fullDef:
      'AMT was designed to ensure high-income taxpayers pay a minimum level of tax regardless of deductions. It disallows or limits certain deductions (e.g., state and local taxes beyond the SALT cap, accelerated depreciation, ISO stock option spreads) and taxes income at 26% up to the AMT exemption amount and 28% above. For 2025, the exemption is $137,000 (single) / $220,200 (MFJ). The exemption phases out at higher income levels. AMT is particularly relevant for taxpayers with large ISO exercises, high SALT deductions, or significant depreciation deductions.',
    country: 'US',
    category: 'tax_type',
    relatedTerms: ['AGI', 'Standard Deduction (US)', 'QBI Deduction'],
    seeAlso: 'Form 6251',
  },
  {
    term: 'QBI Deduction',
    shortDef: 'A 20% deduction on qualified business income for pass-through entities, significantly reducing taxable income for the self-employed.',
    fullDef:
      'The Qualified Business Income (QBI) deduction under Section 199A allows eligible taxpayers (sole proprietors, S-corp shareholders, partners) to deduct up to 20% of QBI from a qualified trade or business. For high-income taxpayers, limitations apply: W-2 wage limits and unadjusted basis of qualified property thresholds kick in above $197,300 (single) / $394,600 (MFJ) for 2025. Specified Service Trades or Businesses (SSTBs) like law, accounting, and consulting phase out completely above the threshold. The deduction is not available for C-corporations.',
    country: 'US',
    category: 'deduction',
    relatedTerms: ['AGI', 'FICA', 'SEP-IRA'],
    seeAlso: 'Section 199A',
  },
  {
    term: 'LTCG Rate (US)',
    shortDef: 'Preferential capital gains tax rates of 0%, 15%, or 20% applying to assets held more than one year.',
    fullDef:
      'Long-term capital gains are taxed at 0% for taxpayers with taxable income below $48,350 (single) / $96,700 (MFJ) in 2025; 15% for income between those thresholds and $533,400 (single) / $600,050 (MFJ); and 20% above. High-income taxpayers may also owe the 3.8% NIIT on top, bringing the effective rate to 23.8%. These rates are substantially more favorable than ordinary income tax rates (up to 37%). Holding assets for more than one year to qualify for LTCG treatment is a foundational tax-planning strategy.',
    country: 'US',
    category: 'tax_type',
    relatedTerms: ['NIIT', 'AMT', 'AGI'],
  },
  {
    term: 'EITC (Earned Income Tax Credit)',
    shortDef: 'A refundable tax credit for low-to-moderate income workers; up to $7,830 with three or more qualifying children in 2025.',
    fullDef:
      'The Earned Income Tax Credit is one of the largest anti-poverty programs in the US tax code. It is refundable, meaning any amount exceeding tax owed is paid out as a refund. For 2025, the maximum credits are: $7,830 (3+ children), $6,960 (2 children), $4,213 (1 child), and $632 (no children). Income phase-outs apply. Investment income above $11,600 disqualifies taxpayers. EITC is claimed on Schedule EIC and requires a valid SSN. The IRS estimates that 20–25% of eligible taxpayers fail to claim it, leaving significant money unclaimed.',
    country: 'US',
    category: 'deduction',
    relatedTerms: ['AGI', 'Standard Deduction (US)', 'W-2'],
    seeAlso: 'Schedule EIC',
  },
  {
    term: 'W-2',
    shortDef: 'Employer-issued form showing annual wages paid and federal, state, and FICA taxes withheld; used to file Form 1040.',
    fullDef:
      'Employers must provide Form W-2 to employees by January 31. It reports wages, tips, and other compensation; federal and state income taxes withheld; Social Security and Medicare taxes withheld; and pre-tax benefit contributions (401k, HSA). Multiple W-2s are possible if you have more than one employer. If you receive a W-2 with errors, you can request a corrected W-2C. Amounts on the W-2 are reported on lines 1a through 4b of Form 1040. The W-2 is one of the most common documents reviewed by the IRS in matching programs.',
    country: 'US',
    category: 'filing',
    relatedTerms: ['FICA', 'AGI', '1099'],
  },
  {
    term: '1099',
    shortDef: 'A series of information returns for non-employee income, including freelance pay, dividends, interest, and retirement distributions.',
    fullDef:
      'The "1099 series" encompasses many forms: 1099-NEC (non-employee compensation, threshold $600); 1099-MISC (rent, royalties, other miscellaneous income); 1099-INT (bank interest); 1099-DIV (dividends); 1099-B (proceeds from broker transactions); 1099-R (retirement distributions). All 1099 income must be reported on Form 1040 whether or not you receive the form. The IRS matches 1099 data against tax returns in an automated underreporter program; unreported 1099 income typically results in a CP2000 notice.',
    country: 'US',
    category: 'filing',
    relatedTerms: ['W-2', 'AGI', 'QBI Deduction'],
  },
  {
    term: 'Form 1040-NR',
    shortDef: 'Tax return for non-resident aliens, including F-1 and J-1 visa holders who have not met the Substantial Presence Test.',
    fullDef:
      'Non-resident aliens file Form 1040-NR instead of the regular Form 1040. Non-residents are taxed only on US-source income. Students on F-1 visas are typically non-residents for their first 5 calendar years; J-1 scholars for the first 2 years. Treaty benefits (lower withholding rates, exemptions) must be claimed on Form 8833. Common non-resident income: wages from OPT/CPT employment, US bank interest (often exempt), US scholarships (often taxed at 14%). Spouses of non-residents must file separately unless both elect to be treated as resident aliens.',
    country: 'US',
    category: 'filing',
    relatedTerms: ['W-2', '1099', 'AGI'],
  },
  {
    term: 'Safe Harbor Rule',
    shortDef: 'A guideline that protects taxpayers from underpayment penalties by paying at least 100% of prior year\'s tax or 90% of the current year\'s liability.',
    fullDef:
      'To avoid the underpayment penalty under Section 6654, taxpayers must ensure their withholding and estimated tax payments cover: (1) 90% of current year\'s tax, or (2) 100% of prior year\'s tax (110% if prior-year AGI exceeded $150,000). Estimated tax payments are due four times a year: April 15, June 15, September 15, and January 15 of the following year. Meeting the safe harbor based on the prior year is simpler for those with unpredictable income (freelancers, investors). Failing safe harbor results in a penalty computed daily at the federal short-term rate plus 3%.',
    country: 'US',
    category: 'penalty',
    relatedTerms: ['AGI', 'FICA', 'EITC'],
    seeAlso: 'Section 6654',
  },
  {
    term: 'SEP-IRA',
    shortDef: 'A Simplified Employee Pension allowing self-employed individuals to contribute up to 25% of net earnings or $69,000 in 2025.',
    fullDef:
      'The SEP-IRA is one of the most generous retirement plans for self-employed individuals and small business owners. Contributions are limited to the lesser of 25% of net self-employment income (after the SE tax deduction) or $69,000 for 2025. Contributions are fully deductible as an above-the-line deduction on Form 1040, reducing both AGI and SE income. Contributions can be made up to the tax filing deadline including extensions. Investments grow tax-deferred; withdrawals in retirement are taxed as ordinary income. There is no Roth version of a SEP-IRA.',
    country: 'US',
    category: 'investment',
    relatedTerms: ['AGI', 'FICA', 'QBI Deduction'],
  },
  {
    term: 'Roth IRA',
    shortDef: 'A tax-advantaged retirement account funded with after-tax dollars; qualified withdrawals are completely tax-free.',
    fullDef:
      'Contributions to a Roth IRA are not deductible, but qualified distributions (after age 59½ with the account open at least 5 years) are entirely tax-free, including all growth. The 2025 contribution limit is $7,000 ($8,000 if age 50+). Eligibility phases out at MAGI of $150,000–$165,000 (single) and $236,000–$246,000 (MFJ). High-income taxpayers may use a "backdoor Roth" conversion. Roth accounts have no Required Minimum Distributions (RMDs), making them ideal for wealth transfer. Early withdrawals of earnings may be subject to income tax and a 10% penalty.',
    country: 'US',
    category: 'investment',
    relatedTerms: ['MAGI', 'AGI', 'SEP-IRA'],
  },
  {
    term: 'HSA (Health Savings Account)',
    shortDef: 'A triple-tax-advantaged account paired with a High Deductible Health Plan; contributions are deductible, growth is tax-free, and withdrawals for medical expenses are tax-free.',
    fullDef:
      'An HSA is available only to taxpayers enrolled in an HDHP. For 2025, contribution limits are $4,300 (self-only) and $8,550 (family), with a $1,000 catch-up for those 55+. Contributions are deductible above-the-line, grow tax-free, and are withdrawn tax-free for qualified medical expenses. After age 65, non-medical withdrawals are taxed as ordinary income (similar to a traditional IRA) without penalty. Unlike FSAs, HSA funds roll over indefinitely. Many financial planners treat the HSA as a "stealth IRA" for long-term retirement savings.',
    country: 'US',
    category: 'investment',
    relatedTerms: ['AGI', 'MAGI', 'Standard Deduction (US)'],
  },

  // ─── UNITED KINGDOM ──────────────────────────────────────────────────────────
  {
    term: 'Personal Allowance (PA)',
    shortDef: 'The amount of income an individual can earn tax-free each year; £12,570 for 2025-26, tapering above £100,000.',
    fullDef:
      'Every UK resident is entitled to the Personal Allowance of £12,570 (frozen until 2028). For income above £100,000, the PA reduces by £1 for every £2 of income over the threshold, meaning PA is fully withdrawn at £125,140. This creates an effective 60% marginal tax rate on income between £100,000 and £125,140 (40% income tax + 20% from lost PA). Pension contributions or Gift Aid donations can reduce income back below £100,000 and restore the PA. Non-UK residents may also qualify for PA under tax treaties.',
    country: 'UK',
    category: 'deduction',
    relatedTerms: ['PAYE', 'Self Assessment', 'Marriage Allowance'],
  },
  {
    term: 'Gift Aid',
    shortDef: 'A scheme that allows registered charities to reclaim basic-rate tax on donations made by UK taxpayers.',
    fullDef:
      'When a UK taxpayer donates to a registered charity using Gift Aid, the charity can reclaim 25p for every £1 donated (equivalent to the 20% basic-rate tax on the grossed-up donation). Higher-rate taxpayers (40%) and additional-rate taxpayers (45%) can claim the additional relief through Self Assessment — the difference between their marginal rate and the basic rate on the grossed-up donation. Gift Aid declarations must be signed by the donor. Donations to Gift Aid also allow taxpayers to extend their basic-rate band if they are higher-rate taxpayers.',
    country: 'UK',
    category: 'deduction',
    relatedTerms: ['Personal Allowance (PA)', 'Self Assessment', 'PAYE'],
  },
  {
    term: 'Self Assessment',
    shortDef: 'HMRC\'s system for taxpayers to self-report income and calculate tax; online returns are due by January 31 following the tax year.',
    fullDef:
      'Self Assessment is required for the self-employed, company directors, those with rental income, higher-rate taxpayers with investment income, and those earning over £100,000. The tax year runs April 6 to April 5. Paper returns are due October 31; online returns are due January 31 the following year. Tax owed is also due by January 31. HMRC may require Payments on Account for taxpayers with a prior-year liability over £1,000. Late filing attracts an automatic £100 penalty, with escalating penalties for further delays.',
    country: 'UK',
    category: 'filing',
    relatedTerms: ['Personal Allowance (PA)', 'Payments on Account', 'PAYE'],
  },
  {
    term: 'Marriage Allowance',
    shortDef: 'Allows one spouse to transfer up to £1,260 of unused Personal Allowance to the other spouse, saving up to £252 per year.',
    fullDef:
      'Marriage Allowance is available when one partner\'s income is below the Personal Allowance (£12,570) and the other pays income tax at the basic rate (20%). The lower-income partner transfers up to £1,260 of their unused PA to the higher-earning partner, reducing the latter\'s tax bill by up to £252. It cannot be applied if the higher earner pays 40% or 45% tax. Couples who have not claimed can back-claim for up to four prior tax years. Civil partners qualify on the same terms as married couples.',
    country: 'UK',
    category: 'deduction',
    relatedTerms: ['Personal Allowance (PA)', 'PAYE', 'Self Assessment'],
  },
  {
    term: 'Class 4 NI',
    shortDef: 'National Insurance contributions for the self-employed: 6% on profits between £12,570 and £50,270, and 2% above £50,270.',
    fullDef:
      'Class 4 NI is paid by self-employed individuals on trading profits. For 2025-26: 6% on profits between £12,570 (Lower Profits Limit) and £50,270 (Upper Profits Limit), then 2% on profits above. Class 4 NI is calculated as part of Self Assessment and paid alongside income tax by January 31. It is separate from Class 2 NI (flat weekly rate for state pension entitlement). Unlike Class 1 NI (employee) and the employer\'s secondary contribution, Class 4 does not confer any additional benefit entitlements beyond trading income recognition.',
    country: 'UK',
    category: 'tax_type',
    relatedTerms: ['Self Assessment', 'Personal Allowance (PA)', 'PAYE'],
  },
  {
    term: 'CGT Annual Exempt Amount',
    shortDef: 'The amount of capital gains that can be realised tax-free each year; £3,000 for individuals in 2025-26.',
    fullDef:
      'Capital Gains Tax (CGT) is only due on gains exceeding the Annual Exempt Amount of £3,000 (reduced from £12,300 in 2022-23 and £6,000 in 2023-24). Gains on residential property are taxed at 18% (basic rate) and 24% (higher rate). Gains on other assets are taxed at 10% and 20% (18%/24% from October 2024 Budget for carried interest). Unused CGT exempt amount cannot be carried forward. ISAs and pension wrappers shelter gains from CGT entirely. Spouses can transfer assets at no gain/no loss to utilise each other\'s Annual Exempt Amount.',
    country: 'UK',
    category: 'tax_type',
    relatedTerms: ['ISA', 'Personal Allowance (PA)', 'Self Assessment'],
  },
  {
    term: 'PAYE',
    shortDef: 'Pay As You Earn — the system under which employers deduct income tax and National Insurance from employee wages using a tax code.',
    fullDef:
      'PAYE is administered by HMRC and operates via a tax code system. The employer uses the tax code provided by HMRC to calculate the correct deduction each pay period. Real Time Information (RTI) requires employers to report payroll data to HMRC every pay run. Most employees with straightforward tax affairs will have all their tax settled through PAYE and need not file a Self Assessment return. Adjustments to tax codes can be triggered by HMRC for untaxed income, benefits in kind, or underpayments from prior years.',
    country: 'UK',
    category: 'tax_type',
    relatedTerms: ['Tax Code', 'Personal Allowance (PA)', 'Self Assessment'],
  },
  {
    term: 'Tax Code',
    shortDef: 'An HMRC-assigned code (e.g., 1257L) used by employers to calculate how much income tax to deduct under PAYE each pay period.',
    fullDef:
      'The most common tax code is 1257L, derived from the Personal Allowance (£12,570 → 1257) and "L" indicating standard PA. Other codes: BR (all income taxed at basic rate), D0 (all income at higher rate), K codes (where deductions exceed allowances, adding to taxable income), and M/N codes for Marriage Allowance transfers. HMRC issues updated tax codes automatically when circumstances change. Employees should check their P60 (annual earnings summary) to ensure the correct code was applied; incorrect codes lead to underpayments or overpayments.',
    country: 'UK',
    category: 'filing',
    relatedTerms: ['PAYE', 'Personal Allowance (PA)', 'Self Assessment'],
  },
  {
    term: 'ISA (Individual Savings Account)',
    shortDef: 'A tax-free savings and investment wrapper with a £20,000 annual limit; no tax on interest, dividends, or capital gains inside the ISA.',
    fullDef:
      'ISAs come in several types: Cash ISA (savings), Stocks and Shares ISA (investments), Lifetime ISA (property purchase/retirement, £4,000 limit with 25% government bonus), and Innovative Finance ISA (peer-to-peer lending). The overall annual subscription limit is £20,000. Income and gains within an ISA are completely sheltered from income tax and CGT — there is no need to declare them on a Self Assessment return. ISA funds can be inherited by a spouse/civil partner via an Additional Permitted Subscription without using their own allowance. Junior ISA limit is £9,000 per year per child.',
    country: 'UK',
    category: 'investment',
    relatedTerms: ['CGT Annual Exempt Amount', 'Personal Allowance (PA)', 'Gift Aid'],
  },
  {
    term: 'Payments on Account',
    shortDef: 'Advance payments of the following year\'s tax bill required by HMRC when a Self Assessment liability exceeds £1,000.',
    fullDef:
      'If your Self Assessment tax bill (excluding CGT and student loan repayments) exceeds £1,000, HMRC requires two Payments on Account: each is 50% of the prior year\'s liability. The first is due January 31 (alongside the balancing payment for the prior year); the second is due July 31. If your income falls, you can apply to reduce Payments on Account — but if you reduce them too much, interest is charged on the shortfall. A balancing payment (or refund) settles the difference once the return is filed. Payments on Account do not apply to CGT, which is always paid as a balancing payment.',
    country: 'UK',
    category: 'filing',
    relatedTerms: ['Self Assessment', 'Personal Allowance (PA)', 'PAYE'],
  },
  {
    term: 'Dividend Allowance',
    shortDef: 'The tax-free amount of dividend income each individual can receive annually; £500 for 2025-26.',
    fullDef:
      'The UK Dividend Allowance was reduced from £2,000 (2022-23) to £1,000 (2023-24) and further to £500 from April 2024. Dividends above the allowance are taxed at: 8.75% (basic rate), 33.75% (higher rate), or 39.35% (additional rate). Dividends within an ISA are fully exempt. Company directors who pay themselves through dividends use this allowance to minimise tax. Dividend income is stacked on top of other income, so it occupies the highest band of taxable income, which can push other income into higher bands.',
    country: 'UK',
    category: 'income',
    relatedTerms: ['ISA', 'Personal Allowance (PA)', 'CGT Annual Exempt Amount'],
  },
  {
    term: 'Inheritance Tax (IHT)',
    shortDef: 'A 40% tax on the estate of a deceased person above the nil-rate band of £325,000; with a residence nil-rate band of up to £175,000.',
    fullDef:
      'IHT is charged at 40% on the value of an estate exceeding £325,000 (nil-rate band, frozen until 2030). An additional residence nil-rate band (RNRB) of up to £175,000 applies when a main home is passed to direct descendants, bringing the effective threshold to £500,000 for a single person. Married couples can combine allowances for a combined £1 million threshold. Gifts made more than 7 years before death are fully exempt (Potentially Exempt Transfers). Gifts to charity reduce the estate; if more than 10% of the net estate is left to charity, the IHT rate drops to 36%.',
    country: 'UK',
    category: 'tax_type',
    relatedTerms: ['ISA', 'Gift Aid', 'Personal Allowance (PA)'],
  },
  {
    term: 'Making Tax Digital (MTD)',
    shortDef: 'HMRC\'s initiative requiring businesses and landlords to keep digital records and submit tax information quarterly using compatible software.',
    fullDef:
      'MTD for VAT is already mandatory for all VAT-registered businesses. MTD for Income Tax Self Assessment (ITSA) will apply from April 2026 to sole traders and landlords with income over £50,000, and from April 2027 for those with income over £30,000. Under MTD for ITSA, quarterly digital submissions replace the annual Self Assessment return for business and property income, with a final end-of-period statement and crystallisation declaration due January 31. Businesses must use HMRC-recognised software such as QuickBooks, Xero, or FreeAgent.',
    country: 'UK',
    category: 'filing',
    relatedTerms: ['Self Assessment', 'PAYE', 'Payments on Account'],
  },

  // ─── ALL / GLOBAL ────────────────────────────────────────────────────────────
  {
    term: 'Capital Gains Tax',
    shortDef: 'Tax levied on the profit from selling capital assets such as shares, property, and mutual funds.',
    fullDef:
      'Capital Gains Tax applies in India (LTCG/STCG), the US (short-term at ordinary rates, long-term at 0/15/20%), and the UK (10/18% basic rate; 20/24% higher rate). The tax is calculated on the difference between the sale price and the adjusted cost base (including purchase price, acquisition costs, and improvements). Each jurisdiction provides a mechanism to reduce gain: India uses CII for indexation; the US allows step-up in basis at death; the UK allows no/no gain transfers between spouses. Tax-loss harvesting is a strategy applicable in all three jurisdictions.',
    country: 'ALL',
    category: 'tax_type',
    relatedTerms: ['LTCG', 'STCG', 'LTCG Rate (US)', 'CGT Annual Exempt Amount', 'CII'],
  },
  {
    term: 'Double Taxation Agreement (DTA)',
    shortDef: 'A treaty between two countries that determines which country has the right to tax income and prevents the same income from being taxed twice.',
    fullDef:
      'DTAs (also called Double Tax Treaties or Tax Conventions) typically allocate taxing rights based on income type: employment income is usually taxed in the country of work; dividends, interest, and royalties are often shared between source and residence country with reduced withholding rates. India has DTAs with 95+ countries; the US has treaties with 65+ countries; the UK with 130+ countries. To claim treaty benefits, taxpayers typically file a tax residency certificate in the source country. Without DTAs, taxpayers may still claim unilateral foreign tax credits to offset double taxation.',
    country: 'ALL',
    category: 'tax_type',
    relatedTerms: ['AGI', 'ITR', 'Self Assessment'],
  },
  {
    term: 'Withholding Tax',
    shortDef: 'Tax deducted at source by the paying entity before remitting income to the recipient; common on dividends, interest, and royalties.',
    fullDef:
      'Withholding tax (called TDS in India) is a primary mechanism for tax collection at source. Rates vary by income type and tax treaty provisions: under the India-US DTA, dividend withholding is capped at 25% (15% for 10%+ shareholders); under the India-UK DTA, interest is capped at 15%. Recipients must report withheld amounts in their home country tax return and claim credit for taxes paid abroad. Failure to withhold correctly can expose the payer to penalties. In all three jurisdictions, the payer must file quarterly/annual withholding returns.',
    country: 'ALL',
    category: 'tax_type',
    relatedTerms: ['TDS', 'Double Taxation Agreement (DTA)', 'Form 26AS'],
  },
  {
    term: 'Tax Residency',
    shortDef: 'The jurisdiction in which an individual is considered a tax resident and is therefore liable to pay tax on worldwide income.',
    fullDef:
      'Tax residency rules differ across jurisdictions. India: resident if present 182+ days in the FY, or 60+ days and 365+ days in the preceding four years (additional NRI rules apply). US: resident if Green Card holder or meeting the Substantial Presence Test (183 days formula over 3 years). UK: resident under the Statutory Residence Test (SRT), with split-year treatment for arrivals and departures. Most countries tax residents on worldwide income, while non-residents are taxed only on domestic source income. Dual residency is resolved by the tie-breaker provisions in the applicable DTA.',
    country: 'ALL',
    category: 'filing',
    relatedTerms: ['Double Taxation Agreement (DTA)', 'ITR', 'Form 1040-NR'],
  },
  {
    term: 'Effective Tax Rate',
    shortDef: 'The average rate at which an individual\'s total income is taxed, calculated as total tax paid divided by total taxable income.',
    fullDef:
      'Unlike the marginal tax rate (which is the rate on the last rupee/dollar/pound earned), the effective tax rate reflects the actual overall tax burden. It is computed as: Total Tax / Total Income × 100. Progressive tax systems mean effective rates are always lower than the top marginal rate. For example, a US taxpayer in the 22% bracket may have an effective federal rate of 12–14% after standard deduction and lower rates on income in lower brackets. Comparing effective rates across countries is more meaningful than comparing top marginal rates for assessing real tax burden.',
    country: 'ALL',
    category: 'tax_type',
    relatedTerms: ['Surcharge', 'AGI', 'Gross Total Income (GTI)'],
  },
  {
    term: 'Tax Loss Harvesting',
    shortDef: 'Deliberately selling investments at a loss to offset capital gains and reduce the current year\'s tax liability.',
    fullDef:
      'Tax loss harvesting involves selling assets that have declined in value to realise a capital loss, which offsets capital gains from other assets. In India, short-term and long-term losses can offset gains of the same or longer term, and unused losses can be carried forward for 8 years. In the US, capital losses first offset capital gains; excess losses up to $3,000 can offset ordinary income, with the remainder carried forward indefinitely. In the UK, losses must first offset gains in the same year; remaining losses can be carried forward. Wash-sale rules in the US prevent repurchasing the same security within 30 days.',
    country: 'ALL',
    category: 'investment',
    relatedTerms: ['LTCG', 'STCG', 'LTCG Rate (US)', 'CGT Annual Exempt Amount'],
  },
  {
    term: 'Penalty for Late Filing',
    shortDef: 'A monetary penalty imposed by tax authorities when a taxpayer fails to file their tax return by the due date.',
    fullDef:
      'India: Late filing fee under Section 234F — ₹5,000 (₹1,000 if income ≤ ₹5 lakh). Additionally, interest under Section 234A at 1% per month on unpaid tax. US: Failure-to-file penalty is 5% of unpaid tax per month (maximum 25%); failure-to-pay is 0.5% per month. These two penalties combine for a maximum of 47.5%. UK: £100 immediate penalty; 5% of tax due after 3 months; daily £10 penalties after 3 months (up to 90 days); further surcharges at 6 and 12 months. In all jurisdictions, reasonable cause may provide grounds for penalty abatement.',
    country: 'ALL',
    category: 'penalty',
    relatedTerms: ['ITR', 'Safe Harbor Rule', 'Self Assessment'],
    seeAlso: 'Section 234F (IN)',
  },
];
