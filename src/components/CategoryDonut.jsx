import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CATEGORY_COLORS } from '../hooks/useSalesData';
import { fmtMetric } from '../utils/format';

function CustomTooltip({ active, payload, metric }) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="chart-tooltip">
      <div className="tooltip-title">{d.name}</div>
      <div className="tooltip-row">{fmtMetric(d.value, metric)}</div>
      <div className="tooltip-row">{d.payload.pct.toFixed(1)}%</div>
    </div>
  );
}

export default function CategoryDonut({ data, metric, onSelectCategory }) {
  if (!data.length) return <div className="empty-state">No data for selected filters</div>;

  const total = data.reduce((s, d) => s + d.value, 0);
  const enriched = data.map(d => ({ ...d, pct: total > 0 ? (d.value / total) * 100 : 0 }));

  const totalLabel = metric === 'lbs'
    ? total.toLocaleString('en-CA', { maximumFractionDigits: 0 }) + ' lbs'
    : '$' + total.toLocaleString('en-CA', { maximumFractionDigits: 0 });

  return (
    <div className="chart-card">
      <div className="chart-title">Category share (CY)</div>
      <div style={{ position: 'relative' }}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={enriched}
              dataKey="value"
              nameKey="category"
              cx="50%"
              cy="44%"
              innerRadius="40%"
              outerRadius="60%"
              paddingAngle={2}
              onClick={d => onSelectCategory && onSelectCategory(d.category)}
              style={{ cursor: 'pointer' }}
            >
              {enriched.map(entry => (
                <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip metric={metric} />} />
            <Legend formatter={(value) => <span style={{ fontSize: 11 }}>{value}</span>} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label overlay */}
        <div style={{
          position: 'absolute',
          top: '44%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none',
        }}>
          <div style={{ fontSize: 10, color: '#64748b', marginBottom: 2 }}>
            {metric === 'lbs' ? 'Total lbs' : 'Total CAD$'}
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap' }}>
            {totalLabel}
          </div>
        </div>
      </div>
    </div>
  );
}
