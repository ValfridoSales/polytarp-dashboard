import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { fmtCad } from '../utils/format';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="tooltip-title">{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} className="tooltip-row">
          <span className="dot" style={{ background: p.stroke }} />
          {p.name}: {p.value != null ? fmtCad(p.value) + '/lb' : 'N/A'}
        </div>
      ))}
    </div>
  );
}

export default function AvgPriceLine({ data }) {
  if (!data.length) return <div className="empty-state">No data for selected filters</div>;

  const tickFmt = v => v != null ? '$' + v.toFixed(2) : '';

  return (
    <div className="chart-card">
      <div className="chart-title">Avg price per lb over time</div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 8, right: 24, left: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={tickFmt} tick={{ fontSize: 11 }} width={58} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="cy"
            name="CY"
            stroke="#2E75B6"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="py"
            name="PY"
            stroke="#a0aec0"
            strokeWidth={2}
            strokeDasharray="5 4"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
