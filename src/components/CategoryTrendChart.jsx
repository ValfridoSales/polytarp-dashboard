import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';
import { CATEGORY_COLORS } from '../hooks/useSalesData';
import { fmtMetric } from '../utils/format';

function CustomTooltip({ active, payload, label, metric }) {
  if (!active || !payload?.length) return null;
  const visible = [...payload]
    .filter(p => p.value > 0)
    .sort((a, b) => b.value - a.value);
  return (
    <div className="chart-tooltip" style={{ maxHeight: 240, overflowY: 'auto' }}>
      <div className="tooltip-title">{label}</div>
      {visible.map(p => (
        <div key={p.dataKey} className="tooltip-row">
          <span className="dot" style={{ background: p.color }} />
          {p.dataKey}: {fmtMetric(p.value, metric)}
        </div>
      ))}
    </div>
  );
}

export default function CategoryTrendChart({ data, selectedCategories, metric }) {
  if (!data?.length) return <div className="empty-state">No data available</div>;

  // Only render lines for categories that have at least one non-zero data point
  const activeCats = selectedCategories.filter(cat =>
    data.some(d => (d[cat] ?? 0) > 0)
  );

  const tickFmt = v => {
    if (metric === 'lbs') return v.toLocaleString('en-CA', { maximumFractionDigits: 0 });
    return '$' + (v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v.toFixed(0));
  };

  return (
    <div className="chart-card">
      <div className="chart-title">Category Trends</div>
      <div className="chart-subtitle">12-month rolling trend — click legend to isolate categories</div>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 12, right: 24, left: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={tickFmt} tick={{ fontSize: 11 }} width={64} />
          <Tooltip content={<CustomTooltip metric={metric} />} />
          <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
          {activeCats.map(cat => (
            <Line
              key={cat}
              type="monotone"
              dataKey={cat}
              stroke={CATEGORY_COLORS[cat]}
              strokeWidth={1.8}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
