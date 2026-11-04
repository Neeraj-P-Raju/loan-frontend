import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getApplication } from '../../services/api.js';
import { formatCurrency, formatDate } from '../../config.js';
import { sections } from '../../data/formConfig.js';
import Badge from '../../components/Badge.jsx';
import BarList from '../../components/BarList.jsx';

// Used for the result page (after submit) and for the detail view in history.
export default function ApplicationView({ detail }) {
  const { id } = useParams();
  const [app, setApp] = useState(undefined);

  useEffect(() => {
    getApplication(id).then(setApp);
  }, [id]);

  if (app === undefined) return <p>Loading...</p>;
  if (app === null) return <div className="card empty">Application {id} was not found.</div>;

  const ok = app.label === 'Likely Approved';
  const a = app.answers || {};
  const allFields = sections.flatMap((s) => s.fields);

  // Illustrative explanation only, written from simple rules (demo).
  const factors = [
    { label: 'Credit history', value: String(a.creditHistory || '').startsWith('Good') ? 0.9 : 0.3 },
    { label: 'Income vs. repayment', value: Math.min(1, app.income / (app.loanAmount / app.loanTerm + 1) / 6) },
    { label: 'Loan amount', value: Math.max(0.1, 1 - app.loanAmount / 5000000) },
    { label: 'Employment', value: app.employmentStatus === 'Unemployed' ? 0.2 : 0.8 },
  ];

  return (
    <div>
      <h1>{detail ? 'Application Details' : 'Prediction Result'}</h1>
      <div className="notice">
        <strong>Demo prediction.</strong> No trained model is connected yet. This result comes from a simple
        sample rule and is not a real lending decision.
      </div>

      <div className={'result-box ' + (ok ? 'yes' : 'no')}>
        <div className="muted">Application {app.id} | {formatDate(app.createdAt)}</div>
        <div className="big">{app.label}</div>
        <div>Demo score: {Math.round(app.probability * 100)}%</div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>Summary</h3>
          <dl className="kv">
            <dt>Applicant</dt><dd>{app.applicantName}</dd>
            <dt>Loan type</dt><dd>{app.loanType}</dd>
            <dt>Amount</dt><dd>{formatCurrency(app.loanAmount)}</dd>
            <dt>Term</dt><dd>{app.loanTerm} months</dd>
            <dt>Monthly income</dt><dd>{formatCurrency(app.income)}</dd>
            <dt>Status</dt><dd><Badge text={app.status} /></dd>
          </dl>
        </div>
        <div className="card">
          <h3>Why this result? (illustrative)</h3>
          <BarList teal rows={factors.map((f) => ({ label: f.label, value: Math.round(f.value * 100) }))} max={100} format={(v) => v + '%'} />
          <p className="muted">Higher bars helped the result. These bars are sample values for the demo.</p>
        </div>
      </div>

      {detail && (
        <div className="card">
          <h3>Submitted answers</h3>
          <dl className="kv">
            {allFields.filter((f) => a[f.name] !== undefined && a[f.name] !== '').map((f) => (
              <div key={f.name} style={{ display: 'contents' }}>
                <dt>{f.label}</dt><dd>{a[f.name]}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <Link to="/app/history" className="btn btn-light">Back to history</Link>{' '}
      {!detail && <Link to="/app/apply" className="btn btn-teal">New application</Link>}
    </div>
  );
}
