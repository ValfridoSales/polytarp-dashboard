import { useMemo } from 'react';
import rawData from '../data/sales.json';
import { ALL_MONTHS } from './useSalesData';

// Rolling 12-month window: last 12 months available in the dataset
export const TREND_MONTHS = ALL_MONTHS.slice(-12);

function cKey(metric) { return metric === 'lbs' ? 'cy_lbs' : 'cy_cad'; }

export function useTrendData({ selectedCategories, metric }) {
  const trendData = useMemo(() => {
    return TREND_MONTHS.map(month => {
      const rows = rawData.filter(
        r => r.month === month && selectedCategories.includes(r.category)
      );
      const total = rows.reduce((s, r) => s + r[cKey(metric)], 0);
      const entry = { month, total };
      for (const cat of selectedCategories) {
        entry[cat] = rows
          .filter(r => r.category === cat)
          .reduce((s, r) => s + r[cKey(metric)], 0);
      }
      return entry;
    });
  }, [selectedCategories, metric]);

  return { trendData, trendMonths: TREND_MONTHS };
}
