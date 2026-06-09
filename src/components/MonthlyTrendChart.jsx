import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { fmtMetric, fmtPct, yearFromMonth } from '../utils/format';

// Gray  = "recent" prior year (e.g. 2025 comparing to Jan/Feb 2026)
// Amber = "older"  prior year (e.g. 2024 comparing to Nov/Dec 2025 and earlier)
const PY_COLOR_RECENT = '#a0aec0';
const PY_COLOR_OLDER  = '#e8b86a';

function pyBarColor(monthStr, maxPyYear) {
  return yearFromMonth(monthStr).py === maxPyYear ? PY_COLOR_RECENT : PY_COLOR_OLDER;
}

function CustomTooltip({ active, payload, label, metric }) {
  if (!active || !payload?.length) return null;
  const cy = payload.find(p => p.dataKey === 'cy')?.value ?? 0;
  const py = payload.find(p => p.dataKey === 'py')?.value ?? 0;
  const yoy = py > 0 ? ((cy - py) / py) * 100 : null;
  const { cy: cyYear, py: pyYear } = yearFromMonth(label);
  const pyColor = payload.find(p => p.dataKey === 'py')?.fill ?? PY_COLOR_RECENT;
  return (
    <div className="chart-tooltip">
      <div className="tooltip-title">{label}</div>
      <div className="tooltip-row"><span className="dot" style={{ background: '#2E75B6' }} />{cyYear}: {fmtMetric(cy, metric)}</div>
      <div className="tooltip-row"><span className="dot" style={{ background: pyColor }} />{pyYear}: {fmtMetric(py, metric)}</div>
      <div className="tooltip-row">YoY: {yoy != null ? fmtPct(yoy) : 'N/A'}</div>
    </div>
  );
}

export default function MonthlyTrendChart({ data, metric }) {
  if (!data.length) return <div className="empty-state">No data for selected filters</div>;

  // Determine the "recent" prior year (highest py year in the current view)
  const maxPyYear = Math.max(...data.map(d => yearFromMonth(d.month).py));

  // Build dynamic legend — one entry per distinct py year, sorted descending
  const pyYears = [...new Set(data.map(d => yearFromMonth(d.month).py))].sort((a, b) => b - a);
  const legendPayload = [
    { value: 'Current Year', type: 'square', color: '#2E75B6' },
    ...pyYears.map(yr => ({
      value: `Prior Year (${yr})`,
      type: 'square',
      color: yr === maxPyYear ? PY_COLOR_RECENT : PY_COLOR_OLDER,
    })),
  ];

  const tickFmt = v => {
    if (metric === 'lbs') return v.toLocaleString('en-CA', { maximumFractionDigits: 0 });
    return '$' + (v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v.toFixed(0));
  };

  return (
    <div className="chart-card">
      <div className="chart-title">Monthly Performance — Year over Year</div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={tickFmt} tick={{ fontSize: 11 }} width={60} />
          <Tooltip content={<CustomTooltip metric={metric} />} />
          <Legend payload={legendPayload} />
          <Bar dataKey="cy" name="Current Year" fill="#2E75B6" radius={[3, 3, 0, 0]} />
          <Bar dataKey="py" name="Prior Year" radius={[3, 3, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={pyBarColor(entry.month, maxPyYear)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
