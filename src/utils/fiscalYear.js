// Fiscal year naming: start-year convention
// FY2026 = Mar-26 → Feb-27
// FY2025 = Mar-25 → Feb-26

export const FY_MONTH_NAMES = [
  'Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb',
];

/** Returns the 12 month-labels for a given FY start year.
 *  getFYMonths(2026) → ['Mar-26','Apr-26',...,'Jan-27','Feb-27'] */
export function getFYMonths(fyYear) {
  return FY_MONTH_NAMES.map((m, i) => {
    // Jan (idx=10) and Feb (idx=11) roll into the next calendar year
    const yr = i <= 9 ? fyYear : fyYear + 1;
    return `${m}-${String(yr).slice(-2)}`;
  });
}

/** Which FY start-year does a given month-label belong to?
 *  'Mar-26' → 2026, 'Jan-26' → 2025, 'Feb-26' → 2025 */
export function monthToFY(monthLabel) {
  const [mName, yy] = monthLabel.split('-');
  const calYr = 2000 + parseInt(yy, 10);
  const idx = FY_MONTH_NAMES.indexOf(mName);
  // Jan, Feb belong to the FY that started the previous March
  return idx >= 10 ? calYr - 1 : calYr;
}

/** Previous calendar-year equivalent of a month label.
 *  'May-26' → 'May-25',  'Jan-27' → 'Jan-26' */
export function prevYearLabel(monthLabel) {
  const [m, yy] = monthLabel.split('-');
  return `${m}-${String(parseInt(yy, 10) - 1).padStart(2, '0')}`;
}

/** All FY start-years that have at least one data month (descending). */
export function getAvailableFYs(allMonths) {
  const fySet = new Set(allMonths.map(m => monthToFY(m)));
  return [...fySet].sort((a, b) => b - a);
}

/** 'Complete' | 'In Progress' | 'No Data' */
export function getFYStatus(fyYear, allMonths) {
  const months = getFYMonths(fyYear);
  const monthSet = new Set(allMonths);
  if (months.every(m => monthSet.has(m))) return 'Complete';
  if (months.some(m => monthSet.has(m)))  return 'In Progress';
  return 'No Data';
}
