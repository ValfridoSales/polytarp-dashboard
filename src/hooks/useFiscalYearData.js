import { useMemo } from 'react';
import rawData from '../data/sales.json';
import { getFYMonths, prevYearLabel } from '../utils/fiscalYear';
import { yearFromMonth } from '../utils/format';

// Months that actually exist in our dataset
const DATA_MONTH_SET = new Set(rawData.map(r => r.month));

function cKey(metric) { return metric === 'lbs' ? 'cy_lbs' : 'cy_cad'; }
function pKey(metric) { return metric === 'lbs' ? 'py_lbs' : 'py_cad'; }

// Strip out 2024 comparison data — only pyYear 2024 rows return 0
function safePy(record, metric) {
  if (yearFromMonth(record.month).py === 2024) return 0;
  return record[pKey(metric)];
}

export function useFiscalYearData({ selectedFY, selectedCategories, metric }) {
  const fyMonths = useMemo(() => getFYMonths(selectedFY), [selectedFY]);

  // ── Monthly trend ─────────────────────────────────────────────────────────
  // All 12 FY months; future months get cy=0 and py derived from prev year's cy
  const monthlyTrend = useMemo(() => {
    return fyMonths.map(month => {
      const isFuture = !DATA_MONTH_SET.has(month);

      if (!isFuture) {
        const rows = rawData.filter(
          r => r.month === month && selectedCategories.includes(r.category)
        );
        return {
          month,
          cy: rows.reduce((s, r) => s + r[cKey(metric)], 0),
          py: rows.reduce((s, r) => s + safePy(r, metric), 0),
          isFuture: false,
        };
      }

      // Future month: no current-year data yet.
      // Use the equivalent month from the prior FY as a reference PY bar.
      const prevMonth = prevYearLabel(month);
      const prevRows = rawData.filter(
        r => r.month === prevMonth && selectedCategories.includes(r.category)
      );
      return {
        month,
        cy: 0,
        py: prevRows.reduce((s, r) => s + r[cKey(metric)], 0),
        isFuture: true,
      };
    });
  }, [fyMonths, selectedCategories, metric]);

  // ── Stacked by month (CY only, real months only, for CategoryStackedBar) ──
  const stackedByMonth = useMemo(() => {
    return fyMonths
      .filter(month => DATA_MONTH_SET.has(month))
      .map(month => {
        const entry = { month };
        for (const cat of selectedCategories) {
          const rows = rawData.filter(r => r.month === month && r.category === cat);
          entry[cat] = rows.reduce((s, r) => s + r[cKey(metric)], 0);
        }
        return entry;
      });
  }, [fyMonths, selectedCategories, metric]);

  // ── KPIs (YTD — real months only) ────────────────────────────────────────
  const kpis = useMemo(() => {
    const ytdRows = rawData.filter(
      r => fyMonths.includes(r.month) && DATA_MONTH_SET.has(r.month)
           && selectedCategories.includes(r.category)
    );
    const cy = ytdRows.reduce((s, r) => s + r[cKey(metric)], 0);
    const py = ytdRows.reduce((s, r) => s + safePy(r, metric), 0);
    const yoy = py > 0 ? ((cy - py) / py) * 100 : null;
    const totalCad = ytdRows.reduce((s, r) => s + r.cy_cad, 0);
    const totalLbs = ytdRows.reduce((s, r) => s + r.cy_lbs, 0);
    const avgPrice = totalLbs > 0 ? totalCad / totalLbs : 0;
    const byCat = {};
    for (const r of ytdRows) {
      byCat[r.category] = (byCat[r.category] || 0) + r[cKey(metric)];
    }
    const topCat = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
    return { cy, py, yoy, avgPrice, topCat };
  }, [fyMonths, selectedCategories, metric]);

  // ── Category share (YTD, for donut) ──────────────────────────────────────
  const categoryShare = useMemo(() => {
    const ytdRows = rawData.filter(
      r => fyMonths.includes(r.month) && DATA_MONTH_SET.has(r.month)
           && selectedCategories.includes(r.category)
    );
    return selectedCategories
      .map(cat => ({
        category: cat,
        value: ytdRows.filter(r => r.category === cat)
                      .reduce((s, r) => s + r[cKey(metric)], 0),
      }))
      .filter(d => d.value > 0);
  }, [fyMonths, selectedCategories, metric]);

  // ── YoY by category (YTD, for bar chart) ─────────────────────────────────
  const yoyByCategory = useMemo(() => {
    const ytdRows = rawData.filter(
      r => fyMonths.includes(r.month) && DATA_MONTH_SET.has(r.month)
           && selectedCategories.includes(r.category)
    );
    return selectedCategories
      .map(cat => {
        const rows = ytdRows.filter(r => r.category === cat);
        const cy = rows.reduce((s, r) => s + r[cKey(metric)], 0);
        const py = rows.reduce((s, r) => s + safePy(r, metric), 0);
        if (cy === 0 && py === 0) return null;
        return { category: cat, cy, py, diff: cy - py, hasPY: py > 0 };
      })
      .filter(Boolean)
      .sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));
  }, [fyMonths, selectedCategories, metric]);

  // ── Avg price trend (YTD real months, always in CAD$/lb) ─────────────────
  const avgPriceTrend = useMemo(() => {
    return fyMonths
      .filter(month => DATA_MONTH_SET.has(month))
      .map(month => {
        const rows = rawData.filter(
          r => r.month === month && selectedCategories.includes(r.category)
        );
        const cyCad = rows.reduce((s, r) => s + r.cy_cad, 0);
        const cyLbs = rows.reduce((s, r) => s + r.cy_lbs, 0);
        const pyCad = rows.reduce((s, r) => s + safePy(r, 'cad'), 0);
        const pyLbs = rows.reduce((s, r) => s + safePy(r, 'lbs'), 0);
        return {
          month,
          cy: cyLbs > 0 ? cyCad / cyLbs : null,
          py: pyLbs > 0 ? pyCad / pyLbs : null,
        };
      });
  }, [fyMonths, selectedCategories]);

  return { monthlyTrend, stackedByMonth, kpis, categoryShare, yoyByCategory, avgPriceTrend };
}
