import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { fmtMetric, fmtPct } from '../utils/format';

function CustomTooltip({ active, payload, label, metric }) {
  if (!active || !payload?.length) return null;
  const cy = payload.find(p => p.dataKey === 'cy')?.value ?? 0;
  const py = payload.find(p => p.dataKey === 'py')?.value ?? 0;
  const yoy = py > 0 ? ((cy - py) / py) * 100 : null;
  return (
    <div className="chart-tooltip">
      <div className="tooltip-title">{label}</div>
      <div className="tooltip-row"><span className="dot" style={{ background: '#2E75B6' }} />CY: {fmtMetric(cy, metric)}</div>
      <div className="tooltip-row"><span className="dot" style={{ background: '#a0aec0' }} />PY: {fmtMetric(py, metric)}</div>
      <div className="tooltip-row">YoY: {yoy != null ? fmtPct(yoy) : 'N/A'}</div>
    </div>
  );
}

export default function MonthlyTrendChart({ data, metric }) {
  if (!data.length) return <div className="empty-state">No data for selected filters</div>;

  const tickFmt = v => {
    if (metric === 'lbs') return v.toLocaleString('en-CA', { maximumFractionDigits: 0 });
    return '$' + (v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v.toFixed(0));
  };

  return (
    <div className="chart-card">
      <div className="chart-title">Monthly performance — CY vs PY</div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={tickFmt} tick={{ fontSize: 11 }} width={60} />
          <Tooltip content={<CustomTooltip metric={metric} />} />
          <Legend />
          <Bar dataKey="cy" name="CY" fill="#2E75B6" radius={[3, 3, 0, 0]} />
          <Bar dataKey="py" name="PY" fill="#a0aec0" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
