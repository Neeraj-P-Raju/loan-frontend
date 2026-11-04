import { useEffect, useState } from 'react';
import { getModels, setActiveModel } from '../../services/api.js';
import BarList from '../../components/BarList.jsx';

const pct = (v) => (v * 100).toFixed(1) + '%';

export default function Comparison() {
  const [models, setModels] = useState(null);
  const load = () => getModels().then(setModels);
  useEffect(() => { load(); }, []);
  if (!models) return <p>Loading...</p>;

  async function choose(id) {
    await setActiveModel(id);
    load();
  }

  return (
    <div>
      <h1>Model Comparison</h1>
      <div className="notice">All values are demonstration data.</div>
      <div className="card">
        <div className="table-wrap">
          <table className="data">
            <thead><tr><th>Algorithm</th><th>Split</th><th>Accuracy</th><th>Precision</th><th>Recall</th><th>F1-score</th><th>ROC-AUC</th><th>Active</th></tr></thead>
            <tbody>
              {models.map((m) => (
                <tr key={m.id}>
                  <td>{m.algorithm}</td><td>{m.split}/{100 - m.split}</td><td>{pct(m.accuracy)}</td><td>{pct(m.precision)}</td>
                  <td>{pct(m.recall)}</td><td>{pct(m.f1)}</td><td>{m.auc.toFixed(2)}</td>
                  <td>
                    {m.active ? <span className="badge b-green">Active</span> :
                      <button className="btn btn-light btn-small" onClick={() => choose(m.id)}>Set active</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card">
        <h3>Accuracy by model (demo)</h3>
        <BarList teal max={100} rows={models.map((m) => ({ label: m.algorithm + ' ' + m.id, value: Math.round(m.accuracy * 100) }))} format={(v) => v + '%'} />
      </div>
    </div>
  );
}
