import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { fmtMetric } from '../utils/format';

function CustomTooltip({ active, payload, label, metric }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="tooltip-title">{label}</div>
      <div className="tooltip-row">
        <span className="dot" style={{ background: '#2E75B6' }} />
        Total: {fmtMetric(payload[0]?.value ?? 0, metric)}
      </div>
    </div>
  );
}

export default function TrendLineChart({ data, metric }) {
  if (!data?.length) return <div className="empty-state">No data available</div>;

  const avg = data.reduce((s, d) => s + d.total, 0) / data.length;

  const tickFmt = v => {
    if (metric === 'lbs') return v.toLocaleString('en-CA', { maximumFractionDigits: 0 });
    return '$' + (v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v.toFixed(0));
  };

  return (
    <div className="chart-card">
      <div className="chart-title">12-Month Rolling Sales Trend</div>
      <div className="chart-subtitle">Month-to-month total across selected categories</div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 12, right: 24, left: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={tickFmt} tick={{ fontSize: 11 }} width={64} />
          <Tooltip content={<CustomTooltip metric={metric} />} />
          <ReferenceLine
            y={avg}
            stroke="#94a3b8"
            strokeDasharray="5 4"
            label={{ value: '12-mo avg', position: 'insideTopRight', fontSize: 10, fill: '#94a3b8' }}
          />
          <Line
            type="monotone"
            dataKey="total"
            name="Total Sales"
            stroke="#2E75B6"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#2E75B6', strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
