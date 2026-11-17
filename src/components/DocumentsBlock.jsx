import { useEffect, useState } from 'react';
import { listDocuments, openDocument } from '../services/realApi.js';

const names = { photo: 'Photo', pan_card: 'PAN card', address_proof: 'Address proof', income_proof: 'Income proof', bank_statement: 'Bank statement' };

// Lists the uploaded files of one application. Each file opens in a new tab.
export default function DocumentsBlock({ appId }) {
  const [docs, setDocs] = useState([]);
  useEffect(() => { listDocuments(appId).then(setDocs).catch(() => setDocs([])); }, [appId]);
  if (!docs.length) return null;
  return (
    <div className="card">
      <h3>Uploaded documents</h3>
      {docs.map((d) => (
        <div key={d.id} className="input-row">
          <span>{names[d.kind] || d.kind}: {d.filename}</span>
          <button className="btn btn-light btn-small" onClick={() => openDocument(d.id).catch((e) => alert(e.message))}>Open</button>
        </div>
      ))}
    </div>
  );
}
