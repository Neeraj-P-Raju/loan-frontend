import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FilePlus2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { getApplications } from '../../services/api.js';
import { formatCurrency, formatDate } from '../../config.js';
import Badge from '../../components/Badge.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const [apps, setApps] = useState(null);

  useEffect(() => {
    getApplications(user.email).then(setApps);
  }, [user.email]);

  if (!apps) return <p>Loading...</p>;
  const count = (s) => apps.filter((a) => a.status === s).length;

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <div className="grid grid-4" style={{ marginBottom: 20 }}>
        <div className="card stat"><div className="muted">Applications</div><div className="num">{apps.length}</div></div>
        <div className="card stat"><div className="muted">Pending</div><div className="num">{count('Pending')}</div></div>
        <div className="card stat"><div className="muted">Approved</div><div className="num">{count('Approved')}</div></div>
        <div className="card stat"><div className="muted">Rejected</div><div className="num">{count('Rejected')}</div></div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Recent activity</h2>
          <Link to="/app/apply" className="btn btn-teal"><FilePlus2 size={16} /> New application</Link>
        </div>
        {apps.length === 0 ? (
          <div className="empty">You have not applied yet. Start a new application to see the demo result.</div>
        ) : (
          <div className="table-wrap">
            <table className="data">
              <thead><tr><th>ID</th><th>Date</th><th>Loan type</th><th>Amount</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {apps.slice(0, 4).map((a) => (
                  <tr key={a.id}>
                    <td>{a.id}</td><td>{formatDate(a.createdAt)}</td><td>{a.loanType}</td>
                    <td>{formatCurrency(a.loanAmount)}</td><td><Badge text={a.status} /></td>
                    <td><Link to={`/app/history/${a.id}`}>View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
