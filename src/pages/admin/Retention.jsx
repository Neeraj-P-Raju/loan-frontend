import { useEffect, useState } from 'react';
import { getRetentionPreview, applyRetention } from '../../services/api.js';
import { formatDate } from '../../config.js';
import Modal from '../../components/Modal.jsx';

export default function Retention() {
  const [days, setDays] = useState(30);
  const [mode, setMode] = useState('archive');
  const [affected, setAffected] = useState(null);
  const [ask, setAsk] = useState(false);
  const [done, setDone] = useState('');

  function preview() {
    setDone('');
    getRetentionPreview(days).then(setAffected);
  }
  useEffect(preview, [days]);

  async function confirm() {
    const n = await applyRetention(days, mode);
    setAsk(false);
    setDone(`${n} record(s) ${mode === 'delete' ? 'deleted' : 'archived'}. An audit log entry was written.`);
    getRetentionPreview(days).then(setAffected);
  }

  return (
    <div>
      <h1>Data Retention</h1>
      <div className="notice info">Nothing is removed automatically. Records change only after you preview and confirm.</div>
      <div className="card">
        <div className="toolbar">
          <label>Keep records for:</label>
          <select value={days} onChange={(e) => setDays(Number(e.target.value))} style={{ maxWidth: 140 }}>
            {[7, 30, 90].map((d) => <option key={d} value={d}>{d} days</option>)}
          </select>
          <label className="check-row"><input type="radio" checked={mode === 'archive'} onChange={() => setMode('archive')} /> Archive</label>
          <label className="check-row"><input type="radio" checked={mode === 'delete'} onChange={() => setMode('delete')} /> Delete</label>
        </div>
        <h3>Records older than {days} days: {affected ? affected.length : '...'}</h3>
        {affected && affected.length > 0 && (
          <div className="table-wrap">
            <table className="data">
              <thead><tr><th>ID</th><th>Applicant</th><th>Date</th><th>Loan type</th></tr></thead>
              <tbody>
                {affected.slice(0, 6).map((a) => <tr key={a.id}><td>{a.id}</td><td>{a.applicantName}</td><td>{formatDate(a.createdAt)}</td><td>{a.loanType}</td></tr>)}
              </tbody>
            </table>
            {affected.length > 6 && <p className="muted">and {affected.length - 6} more</p>}
          </div>
        )}
        {affected && affected.length === 0 && <div className="empty">No records are older than {days} days.</div>}
        <button className="btn btn-primary" style={{ marginTop: 12 }} disabled={!affected || affected.length === 0} onClick={() => setAsk(true)}>
          {mode === 'delete' ? 'Delete these records' : 'Archive these records'}
        </button>
        {done && <p style={{ color: 'var(--green)' }}>{done}</p>}
      </div>
      {ask && (
        <Modal title="Please confirm" danger={mode === 'delete'} confirmText={mode === 'delete' ? 'Delete' : 'Archive'} onCancel={() => setAsk(false)} onConfirm={confirm}>
          {affected.length} record(s) older than {days} days will be {mode === 'delete' ? 'deleted' : 'archived'}.
        </Modal>
      )}
    </div>
  );
}
