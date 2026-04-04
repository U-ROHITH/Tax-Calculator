import { CarryForwardLoss, CarryForwardSummary } from './types';

// ─── FY string helpers ────────────────────────────────────────────────────────

/**
 * Parse "FY 2022-23" → 2022 (start year of FY)
 */
function parseFYStart(fy: string): number {
  const match = fy.match(/(\d{4})-\d{2}/);
  if (!match) return 0;
  return parseInt(match[1], 10);
}

/**
 * Build "FY YYYY-YY" from a start year integer.
 */
function buildFY(startYear: number): string {
  const end = (startYear + 1).toString().slice(-2);
  return `FY ${startYear}-${end}`;
}

/**
 * Compute expiry FY for a loss type.
 * Depreciation: never expires.
 * All others: 8 years from year of loss.
 */
export function computeExpiryFY(
  type: CarryForwardLoss['type'],
  yearOfLoss: string,
): string {
  if (type === 'depreciation') return 'Never';
  const startYear = parseFYStart(yearOfLoss);
  return buildFY(startYear + 8);
}

// ─── Core computation ─────────────────────────────────────────────────────────

export function computeCarryForwardSetOff(
  losses: CarryForwardLoss[],
  currentFY: string,         // "FY 2025-26"
  businessIncome: number,
  ltcgAmount: number,
  stcgAmount: number,
  marginalRate: number,      // decimal e.g. 0.30
): CarryForwardSummary {
  const currentStart = parseFYStart(currentFY);

  // --- 1. Filter expired losses ---
  const activeLosses = losses.filter((loss) => {
    if (loss.type === 'depreciation') return true; // never expires
    const expiryStart = parseFYStart(loss.expiryFY);
    // Loss expires after 8 years; it is available in the 8th year itself.
    // expiryFY = yearOfLoss + 8; loss is VALID if currentStart <= expiryStart - 1
    // i.e. current FY starts no later than expiryFY start - 1 year
    return currentStart < expiryStart;
  });

  // --- 2. Sort FIFO within each type (oldest first) ---
  const sorted = [...activeLosses].sort((a, b) => {
    const aStart = parseFYStart(a.yearOfLoss);
    const bStart = parseFYStart(b.yearOfLoss);
    return aStart - bStart;
  });

  // --- 3. Working buckets for available income ---
  let remainBusiness = Math.max(0, businessIncome);
  let remainLTCG = Math.max(0, ltcgAmount);
  let remainSTCG = Math.max(0, stcgAmount);

  // --- 4. Apply set-offs ---
  const updatedLosses: CarryForwardLoss[] = sorted.map((loss) => {
    let setOff = 0;
    let available = loss.remainingBalance;

    switch (loss.type) {
      case 'business': {
        // Set off against business income only
        const used = Math.min(available, remainBusiness);
        remainBusiness -= used;
        setOff = used;
        break;
      }
      case 'depreciation': {
        // Set off against any income (business first, then LTCG, then STCG)
        let used = Math.min(available, remainBusiness);
        remainBusiness -= used;
        available -= used;
        setOff += used;

        used = Math.min(available, remainLTCG);
        remainLTCG -= used;
        available -= used;
        setOff += used;

        used = Math.min(available, remainSTCG);
        remainSTCG -= used;
        setOff += used;
        break;
      }
      case 'ltcg': {
        // Set off only against LTCG
        const used = Math.min(available, remainLTCG);
        remainLTCG -= used;
        setOff = used;
        break;
      }
      case 'stcg': {
        // Set off against STCG first, then LTCG
        let used = Math.min(available, remainSTCG);
        remainSTCG -= used;
        available -= used;
        setOff += used;

        used = Math.min(available, remainLTCG);
        remainLTCG -= used;
        setOff += used;
        break;
      }
      case 'house_property': {
        // HP loss capped at ₹2L/yr against salary — simplified: treat as
        // business income slot (any non-capital income). Cap per entry at ₹2L.
        const cap = Math.min(available, 200_000);
        const used = Math.min(cap, remainBusiness);
        remainBusiness -= used;
        setOff = used;
        break;
      }
    }

    return {
      ...loss,
      setOffThisYear: setOff,
      remainingBalance: loss.remainingBalance - setOff,
    };
  });

  // --- 5. Identify losses expiring "soon" (within current FY or next 2 FYs) ---
  const lossesExpiringSoon = updatedLosses.filter((loss) => {
    if (loss.type === 'depreciation') return false;
    const expiryStart = parseFYStart(loss.expiryFY);
    return expiryStart - currentStart <= 2 && loss.remainingBalance > 0;
  });

  // --- 6. Aggregate totals ---
  const totalBFLoss = activeLosses.reduce((s, l) => s + l.remainingBalance, 0);
  const totalSetOffThisYear = updatedLosses.reduce(
    (s, l) => s + (l.setOffThisYear ?? 0),
    0,
  );
  const taxSavedThisYear = Math.round(totalSetOffThisYear * marginalRate);

  return {
    totalBFLoss,
    totalSetOffThisYear,
    taxSavedThisYear,
    lossesExpiringSoon,
    updatedLosses,
  };
}
