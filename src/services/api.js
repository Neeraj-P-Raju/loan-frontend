// Pages import from this file only. It picks the demo store (mockApi.js) or the real
// FastAPI backend (realApi.js) according to config.USE_MOCK. Functions the backend does not
// provide yet (settings, preprocessing options) keep using the demo store.
import { config } from '../config.js';
import * as mock from './mockApi.js';
import * as real from './realApi.js';

const impl = config.USE_MOCK ? mock : { ...mock, ...real };

export const resetDemoData = (...a) => impl.resetDemoData(...a);
export const getApplications = (...a) => impl.getApplications(...a);
export const getApplication = (...a) => impl.getApplication(...a);
export const predictDemo = (...a) => mock.predictDemo(...a);
export const createApplication = (...a) => impl.createApplication(...a);
export const updateApplicationStatus = (...a) => impl.updateApplicationStatus(...a);
export const deleteApplication = (...a) => impl.deleteApplication(...a);
export const withdrawApplication = (id) => (config.USE_MOCK ? mock.updateApplicationStatus(id, 'Withdrawn') : real.withdrawApplication(id));
export { downloadExport } from './realApi.js';
export const getProfile = () => (config.USE_MOCK ? Promise.resolve({}) : real.getProfile());
export const saveProfile = (...a) => (config.USE_MOCK ? Promise.resolve() : real.saveProfile(...a));
export const clearProfile = () => (config.USE_MOCK ? Promise.resolve() : real.clearProfile());
export const getModels = (...a) => impl.getModels(...a);
export const runTraining = (...a) => impl.runTraining(...a);
export const setActiveModel = (...a) => impl.setActiveModel(...a);
export const getAuditLogs = (...a) => impl.getAuditLogs(...a);
export const addAudit = (...a) => impl.addAudit(...a);
export const getSettings = (...a) => impl.getSettings(...a);
export const saveSettings = (...a) => impl.saveSettings(...a);
export const getPreprocessing = (...a) => impl.getPreprocessing(...a);
export const savePreprocessing = (...a) => impl.savePreprocessing(...a);
export const getRetentionPreview = (...a) => impl.getRetentionPreview(...a);
export const applyRetention = (...a) => impl.applyRetention(...a);
export const getStats = (...a) => impl.getStats(...a);
export { DEMO_APPLICANT } from '../data/mockData.js';
