import { fmtLbs, fmtCad, fmtPct } from '../utils/format';

function KpiCard({ label, value, sub, accent }) {
  return (
    <div className="kpi-card">
      <div className="kpi-label">{label}</div>
      <div className={`kpi-value ${accent || ''}`}>{value}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
    </div>
  );
}

export default function KpiCards({ kpis, metric, fyYear }) {
  const { cy, py, yoy, avgPrice, topCat } = kpis;

  const fmt = v => metric === 'lbs' ? fmtLbs(v) : fmtCad(v);
  const yoyAccent = yoy == null ? '' : yoy >= 0 ? 'positive' : 'negative';
  const yoyDisplay = yoy == null ? 'N/A' : (yoy >= 0 ? '▲ ' : '▼ ') + fmtPct(yoy);

  const cyLabel = fyYear ? `FY${fyYear} — YTD Total`       : 'Total — Current Year';
  const pyLabel = fyYear ? `FY${fyYear - 1} — Comparison`  : 'Total — Prior Year';

  return (
    <div className="kpi-row">
      <KpiCard label={cyLabel} value={fmt(cy)} />
      <KpiCard label={pyLabel} value={fmt(py)} />
      <KpiCard label="YoY Change" value={yoyDisplay} accent={yoyAccent} />
      <KpiCard label="Avg $/lb — Current FY" value={fmtCad(avgPrice)} sub="always in CAD$" />
      <KpiCard label="Top Category" value={topCat} />
    </div>
  );
}
