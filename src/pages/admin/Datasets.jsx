import { useState } from 'react';
import { addAudit } from '../../services/api.js';

// Very small CSV reader: handles commas and double quotes, enough for this demo.
function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const split = (line) => {
    const out = [];
    let cur = '', inQ = false;
    for (const ch of line) {
      if (ch === '"') inQ = !inQ;
      else if (ch === ',' && !inQ) { out.push(cur); cur = ''; }
      else cur += ch;
    }
    out.push(cur);
    return out;
  };
  const header = split(lines[0]);
  const rows = lines.slice(1).map(split);
  return { header, rows };
}

function analyse({ header, rows }) {
  const columns = header.map((name, i) => {
    const values = rows.map((r) => (r[i] ?? '').trim());
    const filled = values.filter((v) => v !== '');
    const numeric = filled.length > 0 && filled.every((v) => !Number.isNaN(Number(v)));
    return { name, type: numeric ? 'number' : 'text', missing: values.length - filled.length, unique: new Set(filled).size };
  });
  const seen = new Set();
  let duplicates = 0;
  rows.forEach((r) => {
    const key = r.join('|');
    if (seen.has(key)) duplicates++;
    seen.add(key);
  });
  return { columns, duplicates };
}

export default function Datasets() {
  const [name, setName] = useState('');
  const [data, setData] = useState(null);
  const [target, setTarget] = useState('');
  const [error, setError] = useState('');

  function show(fileName, text) {
    try {
      const parsed = parseCsv(text);
      if (parsed.header.length < 2 || parsed.rows.length === 0) throw new Error('empty');
      setData({ ...parsed, ...analyse(parsed) });
      setName(fileName);
      setTarget(parsed.header.find((h) => /status|target|approved/i.test(h)) || parsed.header[parsed.header.length - 1]);
      setError('');
      addAudit('Dataset', `Loaded ${fileName} (${parsed.rows.length} rows)`);
    } catch {
      setError('This file could not be read as a CSV with a header row.');
      setData(null);
    }
  }

  // The file is read in the browser only. Nothing is uploaded anywhere.
  function onFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please choose a .csv file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => show(file.name, String(reader.result));
    reader.readAsText(file);
  }

  async function loadSample() {
    const res = await fetch('/sample_loan_data.csv');
    show('sample_loan_data.csv (demo)', await res.text());
  }

  const totalMissing = data ? data.columns.reduce((s, c) => s + c.missing, 0) : 0;

  return (
    <div>
      <h1>Dataset Management</h1>
      <div className="card">
        <p className="muted">Choose a CSV file from your computer. It is read in your browser and is not uploaded.</p>
        <div className="toolbar">
          <input type="file" accept=".csv" onChange={onFile} />
          <button className="btn btn-light" onClick={loadSample}>Load demo sample</button>
        </div>
        {error && <div className="error">{error}</div>}
      </div>

      {data && (
        <>
          <div className="grid grid-4" style={{ marginBottom: 20 }}>
            <div className="card stat"><div className="muted">File</div><div style={{ fontWeight: 600, wordBreak: 'break-all' }}>{name}</div></div>
            <div className="card stat"><div className="muted">Rows</div><div className="num">{data.rows.length}</div></div>
            <div className="card stat"><div className="muted">Missing values</div><div className="num">{totalMissing}</div></div>
            <div className="card stat"><div className="muted">Duplicate rows</div><div className="num">{data.duplicates}</div></div>
          </div>

          <div className="card">
            <h3>Preview (first 5 rows)</h3>
            <div className="table-wrap">
              <table className="data">
                <thead><tr>{data.header.map((h) => <th key={h}>{h}</th>)}</tr></thead>
                <tbody>
                  {data.rows.slice(0, 5).map((r, i) => (
                    <tr key={i}>{data.header.map((h, j) => <td key={h}>{r[j] === '' ? <em className="muted">missing</em> : r[j]}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h3>Columns</h3>
            <div className="toolbar">
              <label>Target column:</label>
              <select value={target} onChange={(e) => setTarget(e.target.value)}>
                {data.header.map((h) => <option key={h}>{h}</option>)}
              </select>
            </div>
            <div className="table-wrap">
              <table className="data">
                <thead><tr><th>Column</th><th>Type</th><th>Missing</th><th>Unique values</th></tr></thead>
                <tbody>
                  {data.columns.map((c) => (
                    <tr key={c.name}>
                      <td>{c.name}{c.name === target ? ' (target)' : ''}</td><td>{c.type}</td><td>{c.missing}</td><td>{c.unique}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
