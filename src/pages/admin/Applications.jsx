import { useEffect, useState } from 'react';
import { getApplications, updateApplicationStatus, deleteApplication } from '../../services/api.js';
import { formatCurrency, formatDate } from '../../config.js';
import Badge from '../../components/Badge.jsx';
import Modal from '../../components/Modal.jsx';

const PAGE_SIZE = 8;

export default function Applications() {
  const [apps, setApps] = useState(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [type, setType] = useState('All');
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState(null);

  function load() {
    getApplications().then(setApps);
  }
  useEffect(load, []);

  if (!apps) return <p>Loading...</p>;

  const filtered = apps.filter((a) => {
    const text = (a.id + a.applicantName + a.userEmail).toLowerCase();
    return text.includes(search.toLowerCase()) && (status === 'All' || a.status === status) && (type === 'All' || a.loanType === type);
  });
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  async function changeStatus(id, s) {
    await updateApplicationStatus(id, s);
    load();
  }

  async function confirmDelete() {
    await deleteApplication(toDelete.id);
    setToDelete(null);
    load();
  }

  return (
    <div>
      <h1>Application Management</h1>
      <div className="card">
        <div className="toolbar">
          <input type="search" placeholder="Search by ID, name or email" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            {['All', 'Pending', 'Approved', 'Rejected'].map((s) => <option key={s}>{s}</option>)}
          </select>
          <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }}>
            {['All', 'Home loan', 'Personal loan', 'Education loan', 'Business loan'].map((s) => <option key={s}>{s}</option>)}
          </select>
          <span className="muted">{filtered.length} found</span>
        </div>
        {rows.length === 0 ? <div className="empty">No applications match the filters.</div> : (
          <div className="table-wrap">
            <table className="data">
              <thead><tr><th>ID</th><th>Applicant</th><th>Date</th><th>Loan type</th><th>Amount</th><th>Demo result</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {rows.map((a) => (
                  <tr key={a.id}>
                    <td>{a.id}</td><td>{a.applicantName}</td><td>{formatDate(a.createdAt)}</td><td>{a.loanType}</td>
                    <td>{formatCurrency(a.loanAmount)}</td><td><Badge text={a.label} /></td>
                    <td>
                      <select value={a.status} onChange={(e) => changeStatus(a.id, e.target.value)} style={{ width: 110 }}>
                        {['Pending', 'Approved', 'Rejected'].map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td><button className="btn btn-light btn-small" onClick={() => setToDelete(a)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="pager">
          <button className="btn btn-light btn-small" disabled={current === 1} onClick={() => setPage(current - 1)}>Previous</button>
          <span>Page {current} of {pages}</span>
          <button className="btn btn-light btn-small" disabled={current === pages} onClick={() => setPage(current + 1)}>Next</button>
        </div>
      </div>
      {toDelete && (
        <Modal title="Delete application?" danger confirmText="Delete" onCancel={() => setToDelete(null)} onConfirm={confirmDelete}>
          Application {toDelete.id} ({toDelete.applicantName}) will be removed. This cannot be undone.
        </Modal>
      )}
    </div>
  );
}
