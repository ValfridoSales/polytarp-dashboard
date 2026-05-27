import { useState } from 'react';
import Sidebar from './components/Sidebar';
import KpiCards from './components/KpiCards';
import MonthlyTrendChart from './components/MonthlyTrendChart';
import CategoryStackedBar from './components/CategoryStackedBar';
import CategoryDonut from './components/CategoryDonut';
import YoyBarChart from './components/YoyBarChart';
import AvgPriceLine from './components/AvgPriceLine';
import { useSalesData, ALL_MONTHS, ALL_CATEGORIES, LAST_DATE } from './hooks/useSalesData';
import './App.css';

const lastDateFmt = new Date(LAST_DATE + 'T12:00:00').toLocaleDateString('en-CA', {
  year: 'numeric', month: 'short', day: 'numeric',
});

export default function App() {
  const [metric, setMetric] = useState('cad');
  const [selectedMonths, setSelectedMonths] = useState([...ALL_MONTHS]);
  const [selectedCategories, setSelectedCategories] = useState([...ALL_CATEGORIES]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { kpis, monthlyTrend, stackedByMonth, categoryShare, yoyByCategory, avgPriceTrend } =
    useSalesData({ metric, selectedMonths, selectedCategories });

  return (
    <div className="layout">
      {/* Sidebar */}
      <div className={`sidebar-wrapper ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar
          metric={metric}
          setMetric={setMetric}
          selectedMonths={selectedMonths}
          setSelectedMonths={setSelectedMonths}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="main-wrapper">
        {/* Sticky header */}
        <header className="top-header">
          <div className="header-left">
            <button className="hamburger" onClick={() => setSidebarOpen(v => !v)} aria-label="Toggle sidebar">
              <span /><span /><span />
            </button>
            <div>
              <div className="header-title">Sales KPI Dashboard</div>
              <div className="header-sub">Polytarp Distribution — Data as of {lastDateFmt}</div>
            </div>
          </div>
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
        </header>

        {/* Dashboard content */}
        <main className="main-content">
          <KpiCards kpis={kpis} metric={metric} />

          <div className="chart-grid-full">
            <MonthlyTrendChart data={monthlyTrend} metric={metric} />
          </div>

          <div className="chart-grid-full">
            <CategoryStackedBar data={stackedByMonth} selectedCategories={selectedCategories} metric={metric} />
          </div>

          <div className="chart-grid-half">
            <CategoryDonut data={categoryShare} metric={metric} />
            <YoyBarChart data={yoyByCategory} metric={metric} />
          </div>

          <div className="chart-grid-full">
            <AvgPriceLine data={avgPriceTrend} />
          </div>
        </main>
      </div>
    </div>
  );
}
