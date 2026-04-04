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

export interface IndiaInput {
  country: 'IN';
  grossIncome: number;
  regime: IndiaRegime | 'auto';
  hra?: number;
  rentPaid?: number;
  metroCity?: boolean;
  basicSalary?: number;
  section80C?: number;
  section80D?: number;
  section80TTA?: number;
  homeLoanInterest?: number;
  nps80CCD?: number;
  otherDeductions?: number;
  age?: 'below60' | '60to80' | 'above80';
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
}

export interface UKInput {
  country: 'UK';
  grossIncome: number;
  region: UKRegion;
  pensionContribution?: number;
  studentLoan?: 'plan1' | 'plan2' | 'plan4' | 'plan5' | 'postgrad' | 'none';
  dividendIncome?: number;
  blindPersonAllowance?: boolean;
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
}
