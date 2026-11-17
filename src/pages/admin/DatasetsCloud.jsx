import { useEffect, useState } from 'react';
import { getDatasets, uploadDataset, deleteDataset, getDatasetTemplate, trainAllModels, autoSelectModel } from '../../services/realApi.js';

// Datasets stored in the cloud database. The admin can upload, delete, retrain all models
// and let the system activate the best one.
export default function DatasetsCloud() {
  const [list, setList] = useState([]);
  const [cols, setCols] = useState(null);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () => getDatasets().then(setList).catch((e) => setMsg(e.message));
  useEffect(() => { load(); getDatasetTemplate().then(setCols).catch(() => {}); }, []);

  async function run(fn, ok) {
    setBusy(true); setMsg('');
    try { await fn(); setMsg(ok); await load(); } catch (e) { setMsg(e.message); } finally { setBusy(false); }
  }

  return (
    <div>
      <h1>Datasets (cloud storage)</h1>
      <div className="notice info">Datasets are saved in the backend database, not in your browser. The built-in dataset is SYNTHETIC demo data. Upload a real CSV with the columns below to train on it.</div>
      {cols && <p className="muted">Required columns: {cols.columns.join(', ')}. {cols.note}</p>}
      <div className="toolbar">
        <input type="file" accept=".csv" disabled={busy} onChange={(e) => e.target.files[0] && run(() => uploadDataset(e.target.files[0]), 'Dataset uploaded.')} />
      </div>
      {msg && <div className="notice">{msg}</div>}
      <div className="table-wrap"><table>
        <thead><tr><th>Name</th><th>Rows</th><th>Columns</th><th>Type</th><th>Uploaded</th><th>Actions</th></tr></thead>
        <tbody>{list.map((d) => (
          <tr key={d.id}>
            <td>{d.name}</td><td>{d.rows}</td><td>{d.cols}</td><td>{d.synthetic ? 'Synthetic demo' : 'Uploaded'}</td><td>{d.createdAt.slice(0, 10)}</td>
            <td className="actions">
              <button className="btn btn-small btn-teal" disabled={busy} onClick={() => run(() => trainAllModels(d.id), 'All 6 models trained and the best one (by ROC-AUC) is now active automatically. Model Comparison shows the report.')}>Train all models</button>
              <button className="btn btn-small btn-danger" disabled={busy} onClick={() => window.confirm('Delete this dataset?') && run(() => deleteDataset(d.id), 'Dataset deleted.')}>Delete</button>
            </td>
          </tr>))}</tbody>
      </table></div>
      <p><button className="btn btn-primary" disabled={busy} onClick={() => run(() => autoSelectModel('auc'), 'The model with the best ROC-AUC is now active for new applications.')}>Auto-select best model (ROC-AUC)</button></p>
    </div>
  );
}
