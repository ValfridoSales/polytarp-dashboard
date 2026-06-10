import { ALL_CATEGORIES, CATEGORY_COLORS, ALL_MONTHS } from '../hooks/useSalesData';
import { getAvailableFYs, getFYStatus } from '../utils/fiscalYear';
import polytarpLogo from '../assets/polytarp-logo.png';

const AVAILABLE_FYS = getAvailableFYs(ALL_MONTHS);

function fyBadge(fy) {
  const status = getFYStatus(fy, ALL_MONTHS);
  if (status === 'Complete')    return { label: 'Complete',    cls: 'badge-complete'    };
  if (status === 'In Progress') return { label: 'In Progress', cls: 'badge-progress' };
  return null;
}

export default function Sidebar({
  activeTab,
  metric, setMetric,
  selectedFY, setSelectedFY,
  selectedCategories, setSelectedCategories,
}) {
  function toggleCategory(c) {
    setSelectedCategories(prev =>
      prev.includes(c)
        ? (prev.length > 1 ? prev.filter(x => x !== c) : prev)
        : [...prev, c]
    );
  }

  const allCatsSelected = selectedCategories.length === ALL_CATEGORIES.length;

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <img src={polytarpLogo} alt="Polytarp" style={{ width: '100%', maxWidth: 160, height: 'auto' }} />
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

      {/* Fiscal year selector — Tab 1 only */}
      {activeTab === 'yoy' && (
        <div className="sidebar-section">
          <div className="sidebar-section-title">Fiscal Year</div>
          <div className="fy-selector">
            {AVAILABLE_FYS.map(fy => {
              const badge = fyBadge(fy);
              return (
                <button
                  key={fy}
                  className={`fy-btn ${selectedFY === fy ? 'active' : ''}`}
                  onClick={() => setSelectedFY(fy)}
                >
                  <span className="fy-btn-year">FY{fy}</span>
                  <span className="fy-btn-range">
                    Mar {String(fy).slice(-2)} – Feb {String(fy + 1).slice(-2)}
                  </span>
                  {badge && (
                    <span className={`fy-btn-badge ${badge.cls}`}>{badge.label}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Category filter — all tabs except Salesperson */}
      {activeTab !== 'salesperson' && (
        <div className="sidebar-section">
          <div className="sidebar-section-header">
            <div className="sidebar-section-title">Categories</div>
            <button
              className="filter-link"
              onClick={() =>
                setSelectedCategories(
                  allCatsSelected ? [ALL_CATEGORIES[0]] : [...ALL_CATEGORIES]
                )
              }
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
                <span className="cat-swatch" style={{ background: CATEGORY_COLORS[c] }} />
                <span className="cat-label">{c}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
