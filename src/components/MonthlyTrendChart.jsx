import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceArea,
} from 'recharts';
import { fmtMetric, fmtPct } from '../utils/format';

const CY_COLOR      = '#2E75B6';
const PY_COLOR      = '#a0aec0';
const CY_FUTURE_CLR = 'rgba(46,117,182,0.13)';

function CustomTooltip({ active, payload, label, metric, fyYear }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload ?? {};
  const isFuture = d.isFuture;
  const cy = payload.find(p => p.dataKey === 'cy')?.value ?? 0;
  const py = payload.find(p => p.dataKey === 'py')?.value ?? 0;
  const yoy = (!isFuture && py > 0) ? ((cy - py) / py) * 100 : null;

  return (
    <div className="chart-tooltip">
      <div className="tooltip-title">{label}</div>
      <div className="tooltip-row">
        <span className="dot" style={{ background: isFuture ? 'rgba(46,117,182,0.35)' : CY_COLOR }} />
        FY{fyYear}: {isFuture ? 'No data yet' : fmtMetric(cy, metric)}
      </div>
      <div className="tooltip-row">
        <span className="dot" style={{ background: PY_COLOR }} />
        FY{fyYear - 1}: {py > 0 ? fmtMetric(py, metric) : 'N/A'}
      </div>
      {yoy != null && (
        <div className="tooltip-row">YoY: {fmtPct(yoy)}</div>
      )}
    </div>
  );
}

export default function MonthlyTrendChart({ data, metric, fyYear }) {
  if (!data?.length) return <div className="empty-state">No data for selected filters</div>;

  const hasFuture  = data.some(d => d.isFuture);
  const firstFuture = hasFuture ? data.find(d => d.isFuture)?.month         : null;
  const lastFuture  = hasFuture ? [...data].reverse().find(d => d.isFuture)?.month : null;

  const legendPayload = [
    { value: `FY${fyYear} (Current)`, type: 'square', color: CY_COLOR },
    { value: `FY${fyYear - 1} (Prior)`,  type: 'square', color: PY_COLOR },
  ];

  const xTickFmt = month => {
    const entry = data.find(d => d.month === month);
    return entry?.isFuture ? `${month}*` : month;
  };

  const yTickFmt = v => {
    if (metric === 'lbs') return v.toLocaleString('en-CA', { maximumFractionDigits: 0 });
    return '$' + (v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v.toFixed(0));
  };

  return (
    <div className="chart-card">
      <div className="chart-title">Monthly Performance — FY{fyYear} vs FY{fyYear - 1}</div>
      {hasFuture && (
        <div className="chart-subtitle">
          * Upcoming months: FY{fyYear - 1} reference shown — current year data not yet available
        </div>
      )}
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} tickFormatter={xTickFmt} />
          <YAxis tickFormatter={yTickFmt} tick={{ fontSize: 11 }} width={62} />
          <Tooltip content={<CustomTooltip metric={metric} fyYear={fyYear} />} />
          <Legend payload={legendPayload} />

          {/* Shade the upcoming-months region */}
          {firstFuture && (
            <ReferenceArea
              x1={firstFuture}
              x2={lastFuture}
              fill="rgba(241,245,249,0.65)"
              stroke="none"
            />
          )}

          {/* Current year bars — faint placeholder for future months */}
          <Bar dataKey="cy" name={`FY${fyYear}`} radius={[3, 3, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.isFuture ? CY_FUTURE_CLR : CY_COLOR} />
            ))}
          </Bar>

          {/* Prior year bars — always solid gray */}
          <Bar dataKey="py" name={`FY${fyYear - 1}`} fill={PY_COLOR} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
