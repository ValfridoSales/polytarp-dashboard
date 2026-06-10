const TABS = [
  { id: 'yoy',         label: 'YoY Comparison' },
  { id: 'trends',      label: 'Trend Graphs'   },
  { id: 'salesperson', label: 'Salesperson'     },
];

export default function TabBar({ activeTab, setActiveTab }) {
  return (
    <div className="tab-bar">
      {TABS.map(tab => (
        <button
          key={tab.id}
          className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
