import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { CATEGORY_COLORS } from '../hooks/useSalesData';
import { fmtMetric } from '../utils/format';

function CustomTooltip({ active, payload, label, metric }) {
  if (!active || !payload?.length) return null;
  const sorted = [...payload].sort((a, b) => b.value - a.value).filter(p => p.value > 0);
  return (
    <div className="chart-tooltip" style={{ maxHeight: 240, overflowY: 'auto' }}>
      <div className="tooltip-title">{label}</div>
      {sorted.map(p => (
        <div key={p.dataKey} className="tooltip-row">
          <span className="dot" style={{ background: p.fill }} />
          {p.dataKey}: {fmtMetric(p.value, metric)}
        </div>
      ))}
    </div>
  );
}

export default function CategoryStackedBar({ data, selectedCategories, metric }) {
  const [hidden, setHidden] = useState(new Set());

  if (!data.length) return <div className="empty-state">No data for selected filters</div>;

  const toggleCat = cat => {
    setHidden(prev => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  };

  const activeCats = selectedCategories.filter(c =>
    data.some(row => row[c] > 0)
  );

  const tickFmt = v => {
    if (metric === 'lbs') return v.toLocaleString('en-CA', { maximumFractionDigits: 0 });
    return '$' + (v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v.toFixed(0));
  };

  return (
    <div className="chart-card">
      <div className="chart-title">Sales by category</div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={tickFmt} tick={{ fontSize: 11 }} width={60} />
          <Tooltip content={<CustomTooltip metric={metric} />} />
          <Legend
            onClick={e => toggleCat(e.dataKey)}
            formatter={(value) => (
              <span style={{ opacity: hidden.has(value) ? 0.35 : 1, cursor: 'pointer', fontSize: 11 }}>
                {value}
              </span>
            )}
          />
          {activeCats.map(cat => (
            <Bar
              key={cat}
              dataKey={cat}
              stackId="a"
              fill={CATEGORY_COLORS[cat]}
              hide={hidden.has(cat)}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
