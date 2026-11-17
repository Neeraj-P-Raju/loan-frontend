import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { createApplication } from '../../services/api.js';
import { formatCurrency } from '../../config.js';
import {
  getSections, visibleFields, clearHiddenAnswers, validateSection, validateField,
} from '../../data/formConfig.js';

// One component draws every section from the configuration in formConfig.js.
function FieldInput({ field, value, error, onChange }) {
  const common = { value: value ?? '', onChange: (e) => onChange(field.name, e.target.value) };
  let input;
  if (field.type === 'select') {
    input = (
      <select {...common}>
        <option value="">Select...</option>
        {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  } else if (field.type === 'file') {
    input = <input type="file" accept={field.accept} onChange={(e) => onChange(field.name, e.target.files[0])} />;
  } else {
    input = <input type={field.type} {...common} />;
  }
  return (
    <div className={'field' + (error ? ' has-error' : '')}>
      <label>
        {field.label} {field.required ? <span className="req">*</span> : <span className="opt">(optional)</span>}
      </label>
      <div className="input-row">
        {input}
        {field.unit && <span className="unit">{field.unit}</span>}
      </div>
      {field.hint && <div className="hint">{field.hint}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default function NewApplication({ testMode = false }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const sections = useMemo(() => getSections(testMode), [testMode]);
  const stepTitles = [...sections.map((s) => s.title), 'Review and Submit'];
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [agree, setAgree] = useState(false);
  const [saving, setSaving] = useState(false);

  const isReview = step === sections.length;

  function handleChange(name, value) {
    // clearHiddenAnswers removes answers of questions that are no longer shown
    setValues((old) => clearHiddenAnswers({ ...old, [name]: value }));
    setErrors((old) => ({ ...old, [name]: '' }));
  }

  function next() {
    const errs = validateSection(sections[step], values);
    setErrors(errs);
    if (Object.keys(errs).length === 0) setStep(step + 1);
  }

  async function submit() {
    // check all sections once more before sending
    for (let i = 0; i < sections.length; i++) {
      if (Object.keys(validateSection(sections[i], values)).length) {
        setStep(i);
        setErrors(validateSection(sections[i], values));
        return;
      }
    }
    setSaving(true);
    try {
      const app = await createApplication(values, user, testMode);
      navigate(user.role === 'admin' ? `/admin/applications/${app.id}` : `/app/result/${app.id}`);
    } catch (err) {
      setSaving(false);
      alert(err.message);
    }
  }

  return (
    <div>
      <h1>{testMode ? 'Test Application (testing mode)' : 'New Loan Application'}</h1>
      {testMode && <div className="notice info">TEST MODE: every field is optional (loan amount and term are still needed to predict) and documents are not required. The prediction uses the same model and rules as a real application, and the record is marked as a test.</div>}
      <div className="stepper">
        {stepTitles.map((t, i) => (
          <div key={t} className={'step' + (i < step ? ' done' : '') + (i === step ? ' current' : '')}>
            {i + 1}. {t}
          </div>
        ))}
      </div>

      <div className="card">
        {!isReview && (
          <>
            <h2>{sections[step].title}</h2>
            {sections[step].note && visibleFields(sections[step], values).length === 0 && (
              <div className="notice info">
                {sections[step].note} Your loan type does not need this section, so you can continue.
              </div>
            )}
            <p className="muted">Fields marked * are required.</p>
            <div className="form-grid">
              {visibleFields(sections[step], values).map((f) => (
                <FieldInput key={f.name} field={f} value={values[f.name]} error={errors[f.name]} onChange={handleChange} />
              ))}
            </div>
          </>
        )}

        {isReview && (
          <>
            <h2>Review and Submit</h2>
            <p className="muted">Check your answers. Use Edit to go back to a section.</p>
            {sections.map((s, i) => (
              <div className="summary-sec" key={s.id}>
                <h3>
                  {s.title}
                  <button className="btn btn-light btn-small" onClick={() => setStep(i)}>Edit</button>
                </h3>
                <dl className="kv">
                  {visibleFields(s, values).map((f) => (
                    <div key={f.name} style={{ display: 'contents' }}>
                      <dt>{f.label}</dt>
                      <dd>{values[f.name] instanceof File ? values[f.name].name : values[f.name] ? (f.unit === '₹' || f.unit === '₹ per month' ? formatCurrency(values[f.name]) : values[f.name] + (f.unit && f.type === 'number' ? ' ' + f.unit : '')) : '-'}</dd>
                    </div>
                  ))}
                  {visibleFields(s, values).length === 0 && <dd>Not needed for this loan type</dd>}
                </dl>
              </div>
            ))}
            <label className="check-row">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              I confirm the details are correct and I understand the result is only a demonstration estimate.
            </label>
          </>
        )}

        <div className="actions">
          <button className="btn btn-light" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</button>
          {!isReview ? (
            <button className="btn btn-primary" onClick={next}>Next</button>
          ) : (
            <button className="btn btn-teal" disabled={!agree || saving} onClick={submit}>
              {saving ? 'Submitting...' : 'Submit application'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
