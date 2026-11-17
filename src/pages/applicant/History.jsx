import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { getApplications, withdrawApplication, deleteApplication } from '../../services/api.js';
import { formatCurrency, formatDate } from '../../config.js';
import Badge from '../../components/Badge.jsx';

export default function HistoryPage() {
  const { user } = useAuth();
  const [apps, setApps] = useState(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');

  useEffect(() => {
    getApplications(user.email).then(setApps);
  }, [user.email]);

  async function withdraw(id) {
    if (!window.confirm('Withdraw this application?')) return;
    try { await withdrawApplication(id); setApps(await getApplications(user.email)); } catch (e) { alert(e.message); }
  }
  async function remove(id) {
    if (!window.confirm('Permanently delete this application and its documents?')) return;
    try { await deleteApplication(id); setApps(await getApplications(user.email)); } catch (e) { alert(e.message); }
  }

  if (!apps) return <p>Loading...</p>;

  const shown = apps.filter((a) => {
    const text = (a.id + a.loanType + a.applicantName).toLowerCase();
    return text.includes(search.toLowerCase()) && (status === 'All' || a.status === status);
  });

  return (
    <div>
      <h1>Application History</h1>
      <div className="card">
        <div className="toolbar">
          <input type="search" placeholder="Search by ID or loan type" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {['All', 'Pending', 'Approved', 'Rejected'].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        {shown.length === 0 ? (
          <div className="empty">{apps.length === 0 ? 'No applications yet.' : 'No applications match your search.'}</div>
        ) : (
          <div className="table-wrap">
            <table className="data">
              <thead><tr><th>ID</th><th>Date</th><th>Loan type</th><th>Amount</th><th>Demo result</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {shown.map((a) => (
                  <tr key={a.id}>
                    <td>{a.id}{a.isTest ? ' (test)' : ''}</td><td>{formatDate(a.createdAt)}</td><td>{a.loanType}</td>
                    <td>{formatCurrency(a.loanAmount)}</td><td><Badge text={a.label} /></td>
                    <td><Badge text={a.status} /></td><td><Link to={`/app/history/${a.id}`}>View</Link>{a.status === 'Pending' && <> | <a href="#" onClick={(e) => { e.preventDefault(); withdraw(a.id); }}>Withdraw</a></>} | <a href="#" onClick={(e) => { e.preventDefault(); remove(a.id); }}>Delete</a></td>
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
