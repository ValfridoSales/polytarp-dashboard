import { useState } from 'react';
import Sidebar             from './components/Sidebar';
import TabBar              from './components/TabBar';
import KpiCards            from './components/KpiCards';
import MonthlyTrendChart   from './components/MonthlyTrendChart';
import CategoryStackedBar  from './components/CategoryStackedBar';
import CategoryDonut       from './components/CategoryDonut';
import YoyBarChart         from './components/YoyBarChart';
import AvgPriceLine        from './components/AvgPriceLine';
import TrendLineChart      from './components/TrendLineChart';
import CategoryTrendChart  from './components/CategoryTrendChart';
import ComingSoon          from './components/ComingSoon';
import { ALL_CATEGORIES, LAST_DATE, ALL_MONTHS } from './hooks/useSalesData';
import { useFiscalYearData }  from './hooks/useFiscalYearData';
import { useTrendData }       from './hooks/useTrendData';
import { getAvailableFYs }    from './utils/fiscalYear';
import './App.css';

const AVAILABLE_FYS = getAvailableFYs(ALL_MONTHS);
const DEFAULT_FY    = AVAILABLE_FYS[0]; // most recent FY with any data

const lastDateFmt = new Date(LAST_DATE + 'T12:00:00').toLocaleDateString('en-CA', {
  year: 'numeric', month: 'short', day: 'numeric',
});

export default function App() {
  const [activeTab,          setActiveTab]          = useState('yoy');
  const [metric,             setMetric]             = useState('cad');
  const [selectedFY,         setSelectedFY]         = useState(DEFAULT_FY);
  const [selectedCategories, setSelectedCategories] = useState([...ALL_CATEGORIES]);
  const [sidebarOpen,        setSidebarOpen]        = useState(false);

  // ── Tab 1 data ────────────────────────────────────────────────────────────
  const {
    monthlyTrend, stackedByMonth, kpis, categoryShare, yoyByCategory, avgPriceTrend,
  } = useFiscalYearData({ selectedFY, selectedCategories, metric });

  // ── Tab 2 data ────────────────────────────────────────────────────────────
  const { trendData } = useTrendData({ selectedCategories, metric });

  return (
    <div className="layout">
      {/* Sidebar */}
      <div className={`sidebar-wrapper ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar
          activeTab={activeTab}
          metric={metric}
          setMetric={setMetric}
          selectedFY={selectedFY}
          setSelectedFY={setSelectedFY}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main area */}
      <div className="main-wrapper">
        {/* Sticky header */}
        <header className="top-header">
          <div className="header-left">
            <button
              className="hamburger"
              onClick={() => setSidebarOpen(v => !v)}
              aria-label="Toggle sidebar"
            >
              <span /><span /><span />
            </button>
            <div>
              <div className="header-title">Sales KPI Dashboard</div>
              <div className="header-sub">Polytarp Distribution — Data as of {lastDateFmt}</div>
            </div>
          </div>
          <div className="header-right">
            <div className="header-metric-toggle">
              <button
                className={`metric-btn ${metric === 'lbs' ? 'active' : ''}`}
                onClick={() => setMetric('lbs')}
              >
                Lbs
              </button>
              <button
                className={`metric-btn ${metric === 'cad' ? 'active' : ''}`}
                onClick={() => setMetric('cad')}
              >
                CAD$
              </button>
            </div>
          </div>
        </header>

        {/* Tab bar */}
        <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab content */}
        <main className="main-content">

          {/* ── Tab 1: YoY Comparison ──────────────────────────────────── */}
          {activeTab === 'yoy' && (
            <>
              <KpiCards kpis={kpis} metric={metric} fyYear={selectedFY} />

              <div className="chart-grid-full">
                <MonthlyTrendChart data={monthlyTrend} metric={metric} fyYear={selectedFY} />
              </div>

              <div className="chart-grid-full">
                <CategoryStackedBar
                  data={stackedByMonth}
                  selectedCategories={selectedCategories}
                  metric={metric}
                />
              </div>

              <div className="chart-grid-half">
                <CategoryDonut
                  data={categoryShare}
                  metric={metric}
                  fyYear={selectedFY}
                />
                <YoyBarChart data={yoyByCategory} metric={metric} fyYear={selectedFY} />
              </div>

              <div className="chart-grid-full">
                <AvgPriceLine data={avgPriceTrend} />
              </div>
            </>
          )}

          {/* ── Tab 2: Trend Graphs ────────────────────────────────────── */}
          {activeTab === 'trends' && (
            <>
              <div className="chart-grid-full">
                <TrendLineChart data={trendData} metric={metric} />
              </div>
              <div className="chart-grid-full">
                <CategoryTrendChart
                  data={trendData}
                  selectedCategories={selectedCategories}
                  metric={metric}
                />
              </div>
            </>
          )}

          {/* ── Tab 3: Salesperson ────────────────────────────────────── */}
          {activeTab === 'salesperson' && <ComingSoon />}

        </main>
      </div>
    </div>
  );
}
