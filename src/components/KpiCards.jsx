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

export default function KpiCards({ kpis, metric }) {
  const { cy, py, yoy, avgPrice, topCat } = kpis;

  const fmt = v => metric === 'lbs' ? fmtLbs(v) : fmtCad(v);
  const yoyAccent = yoy == null ? '' : yoy >= 0 ? 'positive' : 'negative';
  const yoyDisplay = yoy == null ? 'N/A' : (yoy >= 0 ? '▲ ' : '▼ ') + fmtPct(yoy);

  return (
    <div className="kpi-row">
      <KpiCard label="Total (CY)" value={fmt(cy)} />
      <KpiCard label="Total (PY)" value={fmt(py)} />
      <KpiCard label="YoY Change" value={yoyDisplay} accent={yoyAccent} />
      <KpiCard label="Avg $/lb (CY)" value={fmtCad(avgPrice)} sub="always in CAD$" />
      <KpiCard label="Top Category" value={topCat} />
    </div>
  );
}
