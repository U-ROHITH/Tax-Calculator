export type Country = 'IN' | 'US' | 'UK';
export type IndiaRegime = 'old' | 'new';
export type USFilingStatus = 'single' | 'married_joint' | 'married_separate' | 'head_of_household';
export type UKRegion = 'england_wales_ni' | 'scotland';

export interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
  label?: string;
}

export interface HouseProperty {
  type: 'self_occupied' | 'let_out';
  annualRentReceived?: number;
  municipalTaxPaid?: number;
  homeLoanInterest?: number;
  preConstructionInterest?: number; // total amount; 1/5 per year deductible
  isFirstProperty?: boolean;
}

export interface CapitalGainEntry {
  assetType: 'equity_mf' | 'debt_mf' | 'property' | 'gold' | 'other';
  gainType: 'short' | 'long';
  amount: number;          // gain amount (already computed), OR computed from saleValue - cost
  saleValue?: number;      // for property: compute indexed cost if provided
  costOfAcquisition?: number;
  yearOfAcquisition?: number; // for CII indexation on property (e.g. 2015 means FY 2015-16)
  sttPaid?: boolean;       // for equity CG rates
  stampDutyValue?: number; // Section 50C: if saleValue < stampDutyValue, use stampDutyValue
}

export interface AdvanceTaxInstalment {
  dueDate: string;
  cumulativePercent: number;
  amount: number;
  dueBy: string;
}

export interface IndiaInput {
  country: 'IN';
  regime: 'old' | 'new' | 'auto';
  age?: 'below60' | '60to80' | 'above80';

  // --- SALARY INCOME ---
  basicSalary?: number;
  da?: number;              // Dearness Allowance
  hra?: number;             // HRA received
  specialAllowance?: number;
  lta?: number;             // LTA received (exempt subject to actual travel proof)
  otherAllowances?: number;
  bonus?: number;
  grossSalary?: number;     // specify directly if breakup not available
  grossIncome?: number;     // legacy alias for grossSalary

  // HRA details
  rentPaid?: number;
  metroCity?: boolean;

  // Professional tax (deductible up to ₹2,500 per law)
  professionalTax?: number;

  // Employer NPS (80CCD(2)) — deductible in both regimes
  employerNPS?: number;

  // --- HOUSE PROPERTY ---
  properties?: HouseProperty[];

  // Legacy single-property fields (for backward compatibility)
  homeLoanInterest?: number;

  // --- BUSINESS/PROFESSION ---
  businessType?: 'none' | '44AD' | '44ADA' | 'regular';
  turnover44AD?: number;           // for 44AD (≤ ₹2Cr)
  digitalReceipts44AD?: boolean;   // 6% if true; else 8%
  grossReceipts44ADA?: number;     // for 44ADA (≤ ₹75L)
  businessProfit?: number;         // for regular business / profession

  // --- CAPITAL GAINS ---
  capitalGains?: CapitalGainEntry[];

  // --- OTHER SOURCES ---
  savingsInterest?: number;
  fdInterest?: number;
  dividendIncome?: number;
  otherIncome?: number;
  agriculturalIncome?: number;  // exempt; noted but not added to taxable income
  lotteryWinnings?: number;     // 30% flat tax

  // --- DEDUCTIONS (Old Regime only, unless noted) ---
  section80C?: number;          // max ₹1,50,000 (includes 80CCC, 80CCD(1))
  section80CCC?: number;        // pension fund — sub-limit within 80C
  section80CCD1?: number;       // NPS self contribution — sub-limit within 80C
  section80CCD1B?: number;      // NPS additional over 80C, max ₹50,000
  section80D_self?: number;     // health insurance self+family
  section80D_parents?: number;  // health insurance parents
  section80D?: number;          // legacy combined 80D field
  section80DD?: number;         // dependent disability fixed deduction
  section80DD_severe?: boolean; // if true: ₹1,25,000; else ₹75,000
  section80DDB?: number;        // specified disease medical treatment
  section80E?: number;          // education loan interest (no limit, max 8 yrs)
  section80EEA?: number;        // affordable housing loan interest, max ₹1,50,000
  section80G?: number;          // donations with limit (50% of eligible)
  section80G_unlimited?: number; // 100% donations without limit
  section80GG?: number;         // rent without HRA (max ₹60,000/yr)
  section80TTA?: number;        // savings interest max ₹10,000 (below60/60to80)
  section80TTB?: number;        // senior citizen interest (FD+savings) max ₹50,000
  section80U?: boolean;         // self disability (₹75,000 fixed)
  section80U_severe?: boolean;  // if true: ₹1,25,000
  nps80CCD?: number;            // legacy NPS field (mapped to section80CCD1B)
  otherDeductions?: number;     // legacy misc deductions

  // --- ADVANCE TAX & TDS ---
  tdsDeducted?: number;         // TDS already deducted
  advanceTaxPaid?: number;      // advance tax paid during FY

  // --- ARREAR SALARY (Section 89(1)) ---
  arrearSalary?: number;           // arrear amount received this year
  arrearYear?: number;             // which previous year the arrear pertains to (numeric, e.g. 2022)
  arrearPertainingToYear?: string; // e.g. "FY 2022-23" (display label)

  // --- AMT u/s 115JC ---
  amtApplicable?: boolean;         // flag if AMT should be computed
  amtAdjustedIncome?: number;      // adjusted total income for AMT purposes

  // --- SECTION 56(2)(x) — gifts from non-relatives ---
  giftReceived?: number;        // total gift value received
  giftFromRelative?: boolean;   // if true, fully exempt

  // --- ESOP ---
  esopPerquisite?: number;      // (FMV on exercise - exercise price) × shares — taxed as salary
  esopSubsequentGain?: {
    gainType: 'short' | 'long';
    amount: number;             // sale price - FMV on exercise date
  }[];

  // --- CLUBBING OF MINOR CHILD INCOME ---
  minorChildIncome?: number;    // total income of all minor children; ₹1,500/child exempt

  // --- SECTION 80-IAC (startup tax holiday) ---
  section80IAC?: number;        // eligible profit deduction (100% for 3 of first 10 years)
}

export interface USCapitalGain {
  type: 'short' | 'long';
  amount: number;
  assetType?: 'stock' | 'real_estate' | 'collectible' | 'other';
}

export interface TaxCredit {
  name: string;
  amount: number;
  refundable: boolean;
}

export interface USInput {
  country: 'US';
  grossIncome: number;
  filingStatus: USFilingStatus;
  state?: string;
  useStandardDeduction: boolean;
  itemizedDeductions?: number;
  w2Employee: boolean;
  selfEmploymentIncome?: number;
  dependents?: number;
  // Extended income
  capitalGains?: USCapitalGain[];
  qualifiedDividends?: number;
  ordinaryDividends?: number;
  rentalIncome?: number;
  rentalExpenses?: number;
  socialSecurityBenefits?: number;
  iraDistributions?: number;
  pensionIncome?: number;
  otherIncome?: number;
  // Adjustments
  studentLoanInterest?: number;
  educatorExpenses?: number;
  hsaContribution?: number;
  iraContribution?: number;
  sepContribution?: number;
  selfEmployedHealthInsurance?: number;
  // Deductions
  mortgageInterest?: number;
  saltDeductions?: number;
  charitableContributions?: number;
  // Credits
  childrenUnder17?: number;
  dependentCareExpenses?: number;
  educationExpenses?: number;
  retirementContributions?: number;
  isStudent?: boolean;
  hasQBI?: boolean;
  qbiAmount?: number;
  age?: number;
  spouseAge?: number;
  blindTaxpayer?: boolean;
  blindSpouse?: boolean;
}

export interface UKInput {
  country: 'UK';
  grossIncome: number;
  region: UKRegion;
  pensionContribution?: number;
  studentLoan?: 'plan1' | 'plan2' | 'plan4' | 'plan5' | 'postgrad' | 'none';
  dividendIncome?: number;
  blindPersonAllowance?: boolean;
  // Extended
  selfEmploymentIncome?: number;
  rentalIncome?: number;
  savingsInterest?: number;
  capitalGainProperty?: number;
  capitalGainOther?: number;
  marriageAllowance?: 'none' | 'transferring' | 'receiving';
  tradingAllowance?: boolean;
  childBenefit?: number;
}

export type TaxInput = IndiaInput | USInput | UKInput;

export interface TaxBreakdownItem {
  label: string;
  amount: number;
  rate?: number;
  color?: string;
}

export interface BracketDetail {
  bracket: TaxBracket;
  taxableInThisBracket: number;
  taxInThisBracket: number;
}

export interface SavingTip {
  id: string;
  title: string;
  description: string;
  potentialSaving: number;
  affiliateLink?: string;
  country: Country;
}

export interface TaxResult {
  country: Country;
  grossIncome: number;
  totalTax: number;
  effectiveRate: number;
  marginalRate: number;
  netIncome: number;
  monthlyTakeHome: number;
  breakdown: TaxBreakdownItem[];
  bracketDetails: BracketDetail[];
  tips: SavingTip[];
  currency: string;
  regime?: IndiaRegime;
  alternateResult?: TaxResult;

  // Extended India fields
  advanceTaxSchedule?: AdvanceTaxInstalment[];
  itrFormRecommended?: 'ITR-1' | 'ITR-2' | 'ITR-3' | 'ITR-4';
  interestU234B?: number;
  interestU234C?: number;
  totalTaxPayable?: number;  // after TDS/advance tax

  // Income component breakdown (informational)
  salaryIncome?: number;
  housePropertyIncome?: number;
  businessIncome?: number;
  capitalGainsTax?: number;
  totalDeductions?: number;
  grossTotalIncome?: number;
  taxableIncome?: number;

  // India specific — 89(1) and AMT
  relief89?: number;         // tax relief computed u/s 89(1) for arrear salary
  amtLiability?: number;    // AMT u/s 115JC (India) or AMT (US) if higher than regular tax

  // US specific
  agi?: number;              // Adjusted Gross Income
  credits?: TaxCredit[];    // list of credits applied
  // AGI decomposition (for AGI waterfall display)
  seDeduction?: number;
  retirementDeduction?: number;
  studentLoanDeduction?: number;
  deductionUsed?: number;   // standard or itemized deduction amount
  qbiDeduction?: number;
  // State tax detail
  stateTax?: number;
  stateName?: string;
  stateRate?: number;       // effective state rate
  stateTaxableIncome?: number;

  // UK specific
  niBreakdown?: { label: string; rate: number; on: string; amount: number }[];
  studentLoanDetail?: { plan: string; threshold: number; rate: number; repayment: number };
}

export interface CarryForwardLoss {
  id: string;
  type: 'business' | 'ltcg' | 'stcg' | 'house_property' | 'depreciation';
  yearOfLoss: string;      // "FY 2022-23"
  originalAmount: number;
  remainingBalance: number;
  expiryFY: string;        // "FY 2030-31" or "Never" for depreciation
  setOffThisYear?: number; // computed
}

export interface CarryForwardSummary {
  totalBFLoss: number;
  totalSetOffThisYear: number;
  taxSavedThisYear: number;
  lossesExpiringSoon: CarryForwardLoss[]; // expiring within 2 years
  updatedLosses: CarryForwardLoss[];
}
