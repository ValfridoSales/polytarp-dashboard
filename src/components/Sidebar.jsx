import { ALL_MONTHS, ALL_CATEGORIES, CATEGORY_COLORS } from '../hooks/useSalesData';

export default function Sidebar({ metric, setMetric, selectedMonths, setSelectedMonths, selectedCategories, setSelectedCategories }) {
  function toggleMonth(m) {
    setSelectedMonths(prev =>
      prev.includes(m) ? (prev.length > 1 ? prev.filter(x => x !== m) : prev) : [...prev, m]
    );
  }

  function toggleCategory(c) {
    setSelectedCategories(prev =>
      prev.includes(c) ? (prev.length > 1 ? prev.filter(x => x !== c) : prev) : [...prev, c]
    );
  }

  const allMonthsSelected = selectedMonths.length === ALL_MONTHS.length;
  const allCatsSelected = selectedCategories.length === ALL_CATEGORIES.length;

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-mark">P</div>
        <span className="logo-text">Polytarp</span>
      </div>

      {/* Metric toggle */}
      <div className="sidebar-section">
        <div className="sidebar-section-title">Metric</div>
        <div className="metric-toggle">
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

      {/* Month filter */}
      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <div className="sidebar-section-title">Months</div>
          <button
            className="filter-link"
            onClick={() => setSelectedMonths(allMonthsSelected ? [ALL_MONTHS[ALL_MONTHS.length - 1]] : [...ALL_MONTHS])}
          >
            {allMonthsSelected ? 'Clear' : 'All'}
          </button>
        </div>
        <div className="filter-list">
          {ALL_MONTHS.map(m => (
            <label key={m} className="filter-item">
              <input
                type="checkbox"
                checked={selectedMonths.includes(m)}
                onChange={() => toggleMonth(m)}
                className="filter-checkbox"
              />
              <span>{m}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <div className="sidebar-section-title">Categories</div>
          <button
            className="filter-link"
            onClick={() => setSelectedCategories(allCatsSelected ? [ALL_CATEGORIES[0]] : [...ALL_CATEGORIES])}
          >
            {allCatsSelected ? 'Clear' : 'All'}
          </button>
        </div>
        <div className="filter-list">
          {ALL_CATEGORIES.map(c => (
            <label key={c} className="filter-item">
              <input
                type="checkbox"
                checked={selectedCategories.includes(c)}
                onChange={() => toggleCategory(c)}
                className="filter-checkbox"
              />
              <span
                className="cat-swatch"
                style={{ background: CATEGORY_COLORS[c] }}
              />
              <span className="cat-label">{c}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
