import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer,
} from 'recharts';
import { fmtMetric } from '../utils/format';

function barColor(d) {
  if (!d.hasPY) return '#94a3b8';
  return d.diff >= 0 ? '#22c55e' : '#ef4444';
}

function CustomTooltip({ active, payload, metric }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="chart-tooltip">
      <div className="tooltip-title">{d.category}</div>
      <div className="tooltip-row">CY: {fmtMetric(d.cy, metric)}</div>
      <div className="tooltip-row">PY: {d.hasPY ? fmtMetric(d.py, metric) : 'N/A'}</div>
      <div className="tooltip-row">
        Change: {d.hasPY ? (d.diff >= 0 ? '+' : '') + fmtMetric(d.diff, metric) : 'N/A'}
      </div>
    </div>
  );
}

export default function YoyBarChart({ data, metric }) {
  if (!data.length) return <div className="empty-state">No data for selected filters</div>;

  const tickFmt = v => {
    const abs = Math.abs(v);
    if (metric === 'lbs') return (v < 0 ? '-' : '') + abs.toLocaleString('en-CA', { maximumFractionDigits: 0 });
    return (v < 0 ? '-$' : '$') + (abs >= 1000 ? (abs / 1000).toFixed(1) + 'k' : abs.toFixed(0));
  };

  const maxWidth = Math.max(...data.map(d => d.category.length)) * 7 + 8;

  return (
    <div className="chart-card">
      <div className="chart-title">YoY change by category</div>
      <ResponsiveContainer width="100%" height={Math.max(240, data.length * 32 + 40)}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
          <XAxis type="number" tickFormatter={tickFmt} tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="category" tick={{ fontSize: 11 }} width={maxWidth} />
          <Tooltip content={<CustomTooltip metric={metric} />} />
          <Bar dataKey="diff" radius={[0, 3, 3, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={barColor(entry)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
