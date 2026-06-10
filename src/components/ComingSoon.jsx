export default function ComingSoon() {
  return (
    <div className="coming-soon-wrapper">
      <div className="coming-soon-card">
        <div className="coming-soon-title">Salesperson Analytics</div>
        <div className="coming-soon-badge">Still to be added</div>
        <p className="coming-soon-desc">
          This module will display sales performance broken down by salesperson —
          per-rep totals, category mix, and month-over-month trend comparisons.
          Data connection is pending.
        </p>

        {/* Skeleton mockup to show the intended layout */}
        <div className="coming-soon-mockup">
          <div className="mockup-row">
            <div className="mockup-block skeleton" />
            <div className="mockup-block skeleton" />
            <div className="mockup-block skeleton" />
            <div className="mockup-block skeleton" />
          </div>
          <div className="mockup-row">
            <div className="mockup-block skeleton tall" />
            <div className="mockup-block skeleton tall wide" />
          </div>
        </div>
      </div>
    </div>
  );
}
