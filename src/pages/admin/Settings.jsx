import { useEffect, useState } from 'react';
import { getSettings, saveSettings, resetDemoData } from '../../services/api.js';
import { config } from '../../config.js';

export default function SettingsPage() {
  const [s, setS] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => { getSettings().then(setS); }, []);
  if (!s) return <p>Loading...</p>;

  const set = (k, v) => { setS({ ...s, [k]: v }); setSaved(false); };

  async function save() {
    await saveSettings(s);
    setSaved(true);
  }

  async function reset() {
    await resetDemoData();
    window.location.reload();
  }

  const toggle = (k, label) => (
    <label className="check-row">
      <input type="checkbox" checked={s[k]} onChange={(e) => set(k, e.target.checked)} /> {label}
    </label>
  );

  return (
    <div>
      <h1>Settings</h1>
      <div className="grid grid-2">
        <div className="card">
          <h3>General</h3>
          <div className="field"><label>System name</label><input type="text" value={s.systemName} onChange={(e) => set('systemName', e.target.value)} /></div>
          <div className="field">
            <label>Default retention period</label>
            <select value={s.retentionDays} onChange={(e) => set('retentionDays', Number(e.target.value))}>
              {[7, 30, 90].map((d) => <option key={d} value={d}>{d} days</option>)}
            </select>
          </div>
          {toggle('showDemoBanner', 'Show the demo banner on every page')}
          {toggle('emailNotifications', 'Email notifications (not connected in the demo)')}
        </div>
        <div className="card">
          <h3>Fairness</h3>
          {toggle('excludeGender', 'Exclude Gender from model features')}
          {toggle('excludeMarried', 'Exclude Married from model features')}
          <p className="muted">These two fields are sensitive. The default is to leave them out of the model.</p>
          <h3 style={{ marginTop: 18 }}>Connection</h3>
          <dl className="kv">
            <dt>Data source</dt><dd>{config.USE_MOCK ? 'Mock data (demo)' : 'Backend API'}</dd>
            <dt>API address</dt><dd>{config.API_BASE_URL}</dd>
          </dl>
        </div>
      </div>
      <button className="btn btn-primary" onClick={save}>Save settings</button>{' '}
      <button className="btn btn-light" onClick={reset}>Reset demo data</button>
      {saved && <span style={{ marginLeft: 12, color: 'var(--green)' }}>Saved (demo store)</span>}
    </div>
  );
}
