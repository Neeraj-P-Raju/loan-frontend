import { useEffect, useState } from 'react';
import { getModels, runTraining } from '../../services/api.js';
import { formatDate } from '../../config.js';

const algorithms = ['Logistic Regression', 'Decision Tree', 'Random Forest', 'SVM', 'KNN'];

export default function Training() {
  const [algorithm, setAlgorithm] = useState(algorithms[2]);
  const [split, setSplit] = useState(80);
  const [seed, setSeed] = useState(42);
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState('');
  const [models, setModels] = useState([]);

  useEffect(() => { getModels().then(setModels); }, []);

  async function start() {
    setRunning(true);
    setMessage('');
    setProgress(5);
    // the bar is only for show: the demo "training" just waits a moment
    const timer = setInterval(() => setProgress((p) => Math.min(p + 12, 92)), 250);
    const model = await runTraining({ algorithm, split, seed });
    clearInterval(timer);
    setProgress(100);
    setRunning(false);
    setMessage(`Finished (demo). ${model.algorithm} accuracy ${(model.accuracy * 100).toFixed(0)}%. See Model Comparison.`);
    getModels().then(setModels);
  }

  return (
    <div>
      <h1>Model Training</h1>
      <div className="notice">Demo: no real model is trained. The metrics are produced by a small formula so the pages can be tested.</div>
      <div className="grid grid-2">
        <div className="card">
          <h3>Settings</h3>
          <div className="field">
            <label>Algorithm</label>
            <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>{algorithms.map((a) => <option key={a}>{a}</option>)}</select>
          </div>
          <div className="field">
            <label>Training share: {split}% (test share {100 - split}%)</label>
            <input type="range" min="60" max="90" step="5" value={split} onChange={(e) => setSplit(e.target.value)} style={{ width: '100%' }} />
          </div>
          <div className="field">
            <label>Random seed</label>
            <input type="number" value={seed} onChange={(e) => setSeed(e.target.value)} />
          </div>
          <button className="btn btn-primary" disabled={running} onClick={start}>{running ? 'Training...' : 'Start training (demo)'}</button>
          {(running || progress > 0) && <div className="progress" style={{ marginTop: 14 }}><div style={{ width: progress + '%' }} /></div>}
          {message && <p style={{ color: 'var(--green)' }}>{message}</p>}
        </div>
        <div className="card">
          <h3>Training runs</h3>
          <div className="table-wrap">
            <table className="data">
              <thead><tr><th>Algorithm</th><th>Split</th><th>Seed</th><th>Date</th></tr></thead>
              <tbody>
                {[...models].reverse().slice(0, 7).map((m) => (
                  <tr key={m.id}><td>{m.algorithm}</td><td>{m.split}/{100 - m.split}</td><td>{m.seed}</td><td>{formatDate(m.trainedAt)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
