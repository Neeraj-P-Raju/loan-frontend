import { useEffect, useState } from 'react';
import { getAuditLogs } from '../../services/api.js';

export default function AuditLogs() {
  const [logs, setLogs] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => { getAuditLogs().then(setLogs); }, []);
  if (!logs) return <p>Loading...</p>;

  const actions = ['All', ...new Set(logs.map((l) => l.action))];
  const shown = logs.filter((l) => filter === 'All' || l.action === filter);

  return (
    <div>
      <h1>Audit Logs</h1>
      <div className="card">
        <div className="toolbar">
          <label>Action:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>{actions.map((a) => <option key={a}>{a}</option>)}</select>
        </div>
        <div className="table-wrap">
          <table className="data">
            <thead><tr><th>Time</th><th>User</th><th>Action</th><th>Details</th></tr></thead>
            <tbody>
              {shown.slice(0, 15).map((l) => (
                <tr key={l.id}>
                  <td>{new Date(l.time).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                  <td>{l.user}</td><td>{l.action}</td><td>{l.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
