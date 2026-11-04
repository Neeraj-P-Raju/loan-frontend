import { useEffect, useState } from 'react';
import { getStats, getModels } from '../../services/api.js';
import BarList from '../../components/BarList.jsx';

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [models, setModels] = useState([]);

  useEffect(() => {
    getStats().then(setStats);
    getModels().then(setModels);
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div>
      <h1>Admin Overview</h1>
      <div className="grid grid-4" style={{ marginBottom: 20 }}>
        <div className="card stat"><div className="muted">Total applications</div><div className="num">{stats.total}</div></div>
        <div className="card stat"><div className="muted">Pending</div><div className="num">{stats.pending}</div></div>
        <div className="card stat"><div className="muted">Approved</div><div className="num">{stats.approved}</div></div>
        <div className="card stat"><div className="muted">Rejected</div><div className="num">{stats.rejected}</div></div>
      </div>
      <div className="grid grid-2">
        <div className="card">
          <h3>Applications by loan type (demo data)</h3>
          <BarList rows={stats.byType} />
        </div>
        <div className="card">
          <h3>Model accuracy (demo values)</h3>
          <BarList teal max={100} rows={models.map((m) => ({ label: m.algorithm, value: Math.round(m.accuracy * 100) }))} format={(v) => v + '%'} />
          <p className="muted">Active model: <strong>{stats.activeModel}</strong>. Values are sample numbers, not real results.</p>
        </div>
      </div>
    </div>
  );
}
