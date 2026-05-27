import { useMemo } from 'react';
import rawData from '../data/sales.json';

export const ALL_MONTHS = ['Nov-25', 'Dec-25', 'Jan-26', 'Feb-26', 'Mar-26', 'Apr-26'];

export const ALL_CATEGORIES = [
  'a.AG-BW', 'b.AUTO', 'c.GP', 'c.SSCF', 'c.SSix',
  'd.LAMPET', 'd.PF', 'd.SPF', 'd.zFGBG', 'e.FURN',
  'f.ASB', 'f.NFBG', 'f.VCI', 'g.STWR', 'h.SH-TU',
];

export const CATEGORY_COLORS = {
  'a.AG-BW':  '#2E75B6',
  'b.AUTO':   '#ED7D31',
  'c.GP':     '#A9D18E',
  'c.SSCF':   '#4BACC6',
  'c.SSix':   '#FF6B6B',
  'd.LAMPET': '#FFC000',
  'd.PF':     '#7030A0',
  'd.SPF':    '#00B0F0',
  'd.zFGBG':  '#92D050',
  'e.FURN':   '#FF7E79',
  'f.ASB':    '#0070C0',
  'f.NFBG':   '#833C00',
  'f.VCI':    '#375623',
  'g.STWR':   '#757070',
  'h.SH-TU':  '#D6AFCA',
};

export const LAST_DATE = rawData.reduce((latest, r) => r.date > latest ? r.date : latest, '');

function cyKey(metric) { return metric === 'lbs' ? 'cy_lbs' : 'cy_cad'; }
function pyKey(metric) { return metric === 'lbs' ? 'py_lbs' : 'py_cad'; }

export function useSalesData({ metric, selectedMonths, selectedCategories }) {
  const filtered = useMemo(() => {
    return rawData.filter(
      r => selectedMonths.includes(r.month) && selectedCategories.includes(r.category)
    );
  }, [selectedMonths, selectedCategories]);

  const kpis = useMemo(() => {
    const cy = filtered.reduce((s, r) => s + r[cyKey(metric)], 0);
    const py = filtered.reduce((s, r) => s + r[pyKey(metric)], 0);
    const yoy = py > 0 ? ((cy - py) / py) * 100 : null;

    const totalCyCad = filtered.reduce((s, r) => s + r.cy_cad, 0);
    const totalCyLbs = filtered.reduce((s, r) => s + r.cy_lbs, 0);
    const avgPrice = totalCyLbs > 0 ? totalCyCad / totalCyLbs : 0;

    const byCategory = {};
    for (const r of filtered) {
      byCategory[r.category] = (byCategory[r.category] || 0) + r[cyKey(metric)];
    }
    const topCat = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

    return { cy, py, yoy, avgPrice, topCat };
  }, [filtered, metric]);

  const monthlyTrend = useMemo(() => {
    return ALL_MONTHS.filter(m => selectedMonths.includes(m)).map(month => {
      const rows = filtered.filter(r => r.month === month);
      return {
        month,
        cy: rows.reduce((s, r) => s + r[cyKey(metric)], 0),
        py: rows.reduce((s, r) => s + r[pyKey(metric)], 0),
      };
    });
  }, [filtered, metric, selectedMonths]);

  const stackedByMonth = useMemo(() => {
    return ALL_MONTHS.filter(m => selectedMonths.includes(m)).map(month => {
      const entry = { month };
      for (const cat of selectedCategories) {
        const rows = filtered.filter(r => r.month === month && r.category === cat);
        entry[cat] = rows.reduce((s, r) => s + r[cyKey(metric)], 0);
      }
      return entry;
    });
  }, [filtered, metric, selectedMonths, selectedCategories]);

  const categoryShare = useMemo(() => {
    return selectedCategories
      .map(cat => ({
        category: cat,
        value: filtered.filter(r => r.category === cat).reduce((s, r) => s + r[cyKey(metric)], 0),
      }))
      .filter(d => d.value > 0);
  }, [filtered, metric, selectedCategories]);

  const yoyByCategory = useMemo(() => {
    return selectedCategories
      .map(cat => {
        const rows = filtered.filter(r => r.category === cat);
        const cy = rows.reduce((s, r) => s + r[cyKey(metric)], 0);
        const py = rows.reduce((s, r) => s + r[pyKey(metric)], 0);
        if (cy === 0 && py === 0) return null;
        return { category: cat, cy, py, diff: cy - py, hasPY: py > 0 };
      })
      .filter(Boolean)
      .sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));
  }, [filtered, metric, selectedCategories]);

  const avgPriceTrend = useMemo(() => {
    return ALL_MONTHS.filter(m => selectedMonths.includes(m)).map(month => {
      const rows = filtered.filter(r => r.month === month);
      const cyCad = rows.reduce((s, r) => s + r.cy_cad, 0);
      const cyLbs = rows.reduce((s, r) => s + r.cy_lbs, 0);
      const pyCad = rows.reduce((s, r) => s + r.py_cad, 0);
      const pyLbs = rows.reduce((s, r) => s + r.py_lbs, 0);
      return {
        month,
        cy: cyLbs > 0 ? cyCad / cyLbs : null,
        py: pyLbs > 0 ? pyCad / pyLbs : null,
      };
    });
  }, [filtered, selectedMonths]);

  return { filtered, kpis, monthlyTrend, stackedByMonth, categoryShare, yoyByCategory, avgPriceTrend };
}
