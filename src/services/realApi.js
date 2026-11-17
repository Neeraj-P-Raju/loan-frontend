// Real backend calls (FastAPI). Used when config.USE_MOCK is false.
import { config } from '../config.js';

const tokenKey = 'authToken';
export const clearToken = () => localStorage.removeItem(tokenKey);

async function req(path, opts = {}) {
  const headers = { Authorization: 'Bearer ' + (localStorage.getItem(tokenKey) || '') };
  if (opts.body && !(opts.body instanceof FormData)) headers['Content-Type'] = 'application/json';
  let res;
  try {
    res = await fetch(config.API_BASE_URL + path, { ...opts, headers, body: opts.body && !(opts.body instanceof FormData) ? JSON.stringify(opts.body) : opts.body });
  } catch {
    throw new Error('Cannot reach the server. Check that the backend is running and VITE_API_URL is correct.');
  }
  if (!res.ok) {
    let msg = 'Request failed';
    try { const j = await res.json(); msg = typeof j.detail === 'string' ? j.detail : JSON.stringify(j.detail); } catch { /* keep default */ }
    throw new Error(msg);
  }
  return res.json();
}

// ----- accounts -----
export async function authLogin(email, password) {
  const r = await req('/auth/login', { method: 'POST', body: { email, password } });
  localStorage.setItem(tokenKey, r.token);
  return r.user;
}
export async function authRegister(name, email, password) {
  const r = await req('/auth/register', { method: 'POST', body: { name, email, password } });
  localStorage.setItem(tokenKey, r.token);
  return r.user;
}

// ----- applications (same names and shapes as mockApi.js) -----
export const getApplications = (userEmail) => req('/applications' + (userEmail ? '?mine=1' : ''));
export const getApplication = (id) => req('/applications/' + id).catch(() => null);
const DOC_KINDS = { photo: 'photo', panCard: 'pan_card', addressProof: 'address_proof', incomeProof: 'income_proof', bankStatement: 'bank_statement' };
export async function createApplication(answers, user, testMode = false) {
  const clean = { ...answers, docs: {} };
  for (const [field, kind] of Object.entries(DOC_KINDS)) {
    if (answers[field] instanceof File) {            // upload each file first, then send only its id
      const f = new FormData(); f.append('kind', kind); f.append('file', answers[field]);
      clean.docs[kind] = (await req('/documents', { method: 'POST', body: f })).id;
    }
    delete clean[field];
  }
  return req('/applications', { method: 'POST', body: { answers: clean, testMode } });
}
export const listDocuments = (appId) => req('/documents?application_id=' + appId);
export async function openDocument(id) {            // fetch with the login token, then open the file in a new tab
  const res = await fetch(`${config.API_BASE_URL}/documents/${id}/file`, { headers: { Authorization: 'Bearer ' + localStorage.getItem(tokenKey) } });
  if (!res.ok) throw new Error('Could not open the document');
  window.open(URL.createObjectURL(await res.blob()), '_blank');
}
export const updateApplicationStatus = (id, status) => req(`/applications/${id}/status`, { method: 'PATCH', body: { status } });
export const deleteApplication = (id) => req('/applications/' + id, { method: 'DELETE' });
export const getStats = () => req('/stats');

// ----- models -----
export const getModels = () => req('/models');
export const runTraining = async ({ algorithm, split, seed }) => (await req('/models/train', { method: 'POST', body: { algorithms: [algorithm], split, seed } }))[0];
export const setActiveModel = (id) => req(`/models/${id}/activate`, { method: 'POST', body: {} });
export const autoSelectModel = (metric = 'auc') => req('/models/auto-select', { method: 'POST', body: { metric } });
export const trainAllModels = (datasetId, split = 80, seed = 42) => req('/models/train', { method: 'POST', body: { datasetId, autoActivate: true, algorithms: ['Logistic Regression', 'Decision Tree', 'Random Forest', 'SVM', 'KNN', 'Gradient Boosting'], split, seed } });

// ----- datasets, audit, retention -----
export const getDatasets = () => req('/datasets');
export const uploadDataset = (file) => { const f = new FormData(); f.append('file', file); return req('/datasets/upload', { method: 'POST', body: f }); };
export const deleteDataset = (id) => req('/datasets/' + id, { method: 'DELETE' });
export const getDatasetTemplate = () => req('/datasets/template');
export const getAuditLogs = () => req('/audit');
export const addAudit = async () => {};   // the server writes audit entries itself
export const getRetentionPreview = (days) => req('/retention/preview?days=' + days);
export const applyRetention = async (days, mode) => (await req('/retention/apply', { method: 'POST', body: { days, mode } })).affected;
export const withdrawApplication = (id) => req(`/applications/${id}/withdraw`, { method: 'POST', body: {} });
export async function downloadExport(kind) {         // kind: 'audit' or 'applications'
  const res = await fetch(`${config.API_BASE_URL}/export/${kind}.xlsx`, { headers: { Authorization: 'Bearer ' + localStorage.getItem(tokenKey) } });
  if (!res.ok) throw new Error('Could not download the Excel file');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(await res.blob());
  a.download = kind === 'audit' ? 'audit_log.xlsx' : 'applications.xlsx';
  a.click();
}
