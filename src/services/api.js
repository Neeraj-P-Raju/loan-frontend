// Every page gets its data through the functions in this file.
// Right now they use mock data kept in localStorage (the "demo store").
// To connect a real backend, replace the body of each function with a
// fetch() call to config.API_BASE_URL and leave the pages unchanged.

import { config } from '../config.js';
import {
  mockApplications, mockModels, mockAudit, defaultSettings, defaultPreprocessing, DEMO_APPLICANT,
} from '../data/mockData.js';

const KEY = 'loanDemoStore_v1';

function loadStore() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved) return saved;
  } catch { /* ignore and rebuild below */ }
  return {
    applications: mockApplications,
    models: mockModels,
    audit: mockAudit,
    settings: defaultSettings,
    preprocessing: defaultPreprocessing,
  };
}

function saveStore(store) {
  try { localStorage.setItem(KEY, JSON.stringify(store)); } catch { /* storage may be blocked */ }
}

// short delay so pages behave as if a network call was made
const wait = (ms = 250) => new Promise((r) => setTimeout(r, ms));

function addAuditEntry(store, action, detail) {
  const user = JSON.parse(localStorage.getItem('demoUser') || '{}').email || 'unknown';
  store.audit = [{ id: Date.now() + Math.random(), time: new Date().toISOString(), user, action, detail }, ...store.audit];
}

export async function resetDemoData() {
  localStorage.removeItem(KEY);
}

// ---------- applications ----------

export async function getApplications(userEmail) {
  await wait();
  const all = loadStore().applications;
  const list = userEmail ? all.filter((a) => a.userEmail === userEmail) : all;
  return [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function getApplication(id) {
  await wait(150);
  return loadStore().applications.find((a) => a.id === id) || null;
}

// DEMO prediction: a simple hand-written score, not a trained model.
export function predictDemo(a) {
  const own = a.monthlySalary || a.avgMonthlyIncome || a.monthlyTurnover || a.otherIncome;
  const income = Number(own || 0) + Number(a.coIncome || 0);
  const emi = Number(a.monthlyRepayment || 0);
  const monthlyInstalment = Number(a.loanAmount) / Math.max(Number(a.loanTerm), 1);
  let score = 0.5;
  if (a.creditHistory && a.creditHistory.startsWith('Good')) score += 0.25;
  if (a.creditHistory && a.creditHistory.startsWith('Poor')) score -= 0.3;
  if (income > 0) {
    const burden = (monthlyInstalment + emi) / income;
    score += burden < 0.3 ? 0.15 : burden < 0.5 ? 0 : -0.2;
  } else score -= 0.25;
  if (a.education === 'Graduate') score += 0.04;
  if (a.propertyArea === 'Semi-urban') score += 0.03;
  if (a.previousRepayment === 'Not fully repaid') score -= 0.15;
  const probability = Math.min(0.97, Math.max(0.05, score));
  return {
    probability: Math.round(probability * 100) / 100,
    label: probability >= 0.5 ? 'Likely Approved' : 'Likely Not Approved',
    income,
  };
}

export async function createApplication(answers, user) {
  await wait(500);
  const store = loadStore();
  const p = predictDemo(answers);
  const app = {
    id: `LA-2026-${String(store.applications.length + 1).padStart(4, '0')}`,
    userEmail: user.email,
    applicantName: answers.fullName,
    createdAt: new Date().toISOString(),
    status: 'Pending',
    loanType: answers.loanType,
    loanAmount: Number(answers.loanAmount),
    loanTerm: Number(answers.loanTerm),
    income: p.income,
    employmentStatus: answers.employmentStatus,
    label: p.label,
    probability: p.probability,
    answers,
  };
  store.applications = [app, ...store.applications];
  addAuditEntry(store, 'Application', `${app.id} submitted by ${user.email}`);
  saveStore(store);
  return app;
}

export async function updateApplicationStatus(id, status) {
  await wait(150);
  const store = loadStore();
  store.applications = store.applications.map((a) => (a.id === id ? { ...a, status } : a));
  addAuditEntry(store, 'Application', `Status of ${id} changed to ${status}`);
  saveStore(store);
}

export async function deleteApplication(id) {
  await wait(150);
  const store = loadStore();
  store.applications = store.applications.filter((a) => a.id !== id);
  addAuditEntry(store, 'Application', `${id} deleted`);
  saveStore(store);
}

// ---------- models ----------

export async function getModels() {
  await wait();
  return loadStore().models;
}

// DEMO training: the numbers come from a small formula, nothing is trained.
export async function runTraining({ algorithm, split, seed }) {
  await wait(2200);
  const base = { 'Logistic Regression': 0.8, 'Decision Tree': 0.76, 'Random Forest': 0.84, SVM: 0.81, KNN: 0.78 }[algorithm] || 0.78;
  const jitter = (((Number(seed) * 9301 + 49297) % 233280) / 233280 - 0.5) * 0.04;
  const acc = Math.round((base + jitter) * 100) / 100;
  const r = (x) => Math.round(x * 100) / 100;
  const store = loadStore();
  const model = {
    id: 'M' + (store.models.length + 1),
    algorithm, split: Number(split), seed: Number(seed),
    accuracy: acc, precision: r(acc - 0.01), recall: r(acc + 0.08), f1: r(acc + 0.03), auc: r(acc + 0.05),
    trainedAt: new Date().toISOString(), active: false,
  };
  store.models = [...store.models, model];
  addAuditEntry(store, 'Training', `${algorithm} trained (demo), ${split}/${100 - split} split, seed ${seed}`);
  saveStore(store);
  return model;
}

export async function setActiveModel(id) {
  await wait(150);
  const store = loadStore();
  store.models = store.models.map((m) => ({ ...m, active: m.id === id }));
  const m = store.models.find((x) => x.id === id);
  addAuditEntry(store, 'Model', `${m.algorithm} set as active model (demo)`);
  saveStore(store);
}

// ---------- audit, settings, preprocessing ----------

export async function getAuditLogs() {
  await wait();
  return loadStore().audit;
}

export async function addAudit(action, detail) {
  const store = loadStore();
  addAuditEntry(store, action, detail);
  saveStore(store);
}

export async function getSettings() {
  await wait(100);
  return loadStore().settings;
}

export async function saveSettings(settings) {
  await wait(150);
  const store = loadStore();
  store.settings = settings;
  addAuditEntry(store, 'Settings', 'Settings updated');
  saveStore(store);
}

export async function getPreprocessing() {
  await wait(100);
  return loadStore().preprocessing;
}

export async function savePreprocessing(config2) {
  await wait(150);
  const store = loadStore();
  store.preprocessing = config2;
  const off = Object.keys(config2.features).filter((k) => !config2.features[k]);
  addAuditEntry(store, 'Preprocessing', `Saved options. Excluded features: ${off.join(', ') || 'none'}`);
  saveStore(store);
}

// ---------- retention ----------

export async function getRetentionPreview(days) {
  await wait();
  const limit = Date.now() - days * 24 * 3600 * 1000;
  return loadStore().applications.filter((a) => new Date(a.createdAt).getTime() < limit && !a.archived);
}

export async function applyRetention(days, mode) {
  await wait(300);
  const store = loadStore();
  const limit = Date.now() - days * 24 * 3600 * 1000;
  const affected = store.applications.filter((a) => new Date(a.createdAt).getTime() < limit && !a.archived);
  if (mode === 'delete') {
    store.applications = store.applications.filter((a) => !affected.includes(a));
  } else {
    store.applications = store.applications.map((a) => (affected.includes(a) ? { ...a, archived: true } : a));
  }
  addAuditEntry(store, 'Retention', `${affected.length} record(s) older than ${days} days ${mode === 'delete' ? 'deleted' : 'archived'}`);
  saveStore(store);
  return affected.length;
}

// ---------- summary numbers for dashboards ----------

export async function getStats() {
  await wait();
  const store = loadStore();
  const apps = store.applications.filter((a) => !a.archived);
  const count = (f) => apps.filter(f).length;
  return {
    total: apps.length,
    pending: count((a) => a.status === 'Pending'),
    approved: count((a) => a.status === 'Approved'),
    rejected: count((a) => a.status === 'Rejected'),
    byType: ['Home loan', 'Personal loan', 'Education loan', 'Business loan'].map((t) => ({ label: t, value: count((a) => a.loanType === t) })),
    activeModel: store.models.find((m) => m.active)?.algorithm || 'None',
    mock: config.USE_MOCK,
  };
}

export { DEMO_APPLICANT };
