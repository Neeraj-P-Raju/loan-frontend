import { useEffect, useState } from 'react';
import { getPreprocessing, savePreprocessing } from '../../services/api.js';

const sensitive = ['Gender', 'Married'];

export default function Preprocessing() {
  const [opts, setOpts] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => { getPreprocessing().then(setOpts); }, []);
  if (!opts) return <p>Loading...</p>;

  const set = (k, v) => { setOpts({ ...opts, [k]: v }); setSaved(false); };
  const toggle = (f) => { setOpts({ ...opts, features: { ...opts.features, [f]: !opts.features[f] } }); setSaved(false); };

  async function save() {
    await savePreprocessing(opts);
    setSaved(true);
  }

  const select = (key, label, choices) => (
    <div className="field">
      <label>{label}</label>
      <select value={opts[key]} onChange={(e) => set(key, e.target.value)}>
        {choices.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
      </select>
    </div>
  );

  return (
    <div>
      <h1>Preprocessing</h1>
      <div className="grid grid-2">
        <div className="card">
          <h3>Cleaning and encoding</h3>
          {select('missing', 'Missing values', [['mode', 'Fill with mode (text) or median (numbers)'], ['drop', 'Drop rows with missing values'], ['mean', 'Fill numbers with mean']])}
          {select('encoding', 'Categorical columns', [['onehot', 'One-hot encoding'], ['label', 'Label encoding']])}
          {select('scaling', 'Scaling of numeric columns', [['standard', 'Standardisation (mean 0, std 1)'], ['minmax', 'Min-max (0 to 1)'], ['none', 'No scaling']])}
          {select('imbalance', 'Class imbalance', [['class_weight', 'Class weights'], ['oversample', 'Oversample training set only (after the split)'], ['none', 'Do nothing']])}
          <p className="muted">Oversampling is applied only after the train-test split so that duplicates cannot leak into the test set.</p>
        </div>
        <div className="card">
          <h3>Feature selection</h3>
          {Object.keys(opts.features).map((f) => (
            <label className="check-row" key={f}>
              <input type="checkbox" checked={opts.features[f]} onChange={() => toggle(f)} />
              {f} {sensitive.includes(f) && <span className="badge b-amber">sensitive</span>}
            </label>
          ))}
          {sensitive.some((f) => opts.features[f]) && (
            <div className="notice" style={{ marginTop: 10 }}>
              Gender and marital status are sensitive. Review fairness before using them as model inputs.
            </div>
          )}
        </div>
      </div>
      <button className="btn btn-primary" onClick={save}>Save preprocessing options</button>
      {saved && <span style={{ marginLeft: 12, color: 'var(--green)' }}>Saved (demo store)</span>}
    </div>
  );
}
