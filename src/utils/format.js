export function fmtLbs(v) {
  return v == null ? 'N/A' : v.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' lbs';
}

export function fmtCad(v) {
  return v == null ? 'N/A' : '$' + v.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function fmtPct(v) {
  if (v == null) return 'N/A';
  const sign = v >= 0 ? '+' : '';
  return sign + v.toLocaleString('en-CA', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%';
}

export function fmtMetric(v, metric) {
  return metric === 'lbs' ? fmtLbs(v) : fmtCad(v);
}

// "Jan-26" → { cy: 2026, py: 2025 }
export function yearFromMonth(monthStr) {
  const yy = parseInt(monthStr.split('-')[1], 10);
  return { cy: 2000 + yy, py: 1999 + yy };
}
