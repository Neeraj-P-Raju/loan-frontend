import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/applicant/Dashboard.jsx';
import NewApplication from './pages/applicant/NewApplication.jsx';
import ApplicationView from './pages/applicant/ApplicationView.jsx';
import HistoryPage from './pages/applicant/History.jsx';
import Profile from './pages/applicant/Profile.jsx';
import Overview from './pages/admin/Overview.jsx';
import Applications from './pages/admin/Applications.jsx';
import DatasetsCloud from './pages/admin/DatasetsCloud.jsx';
import { config } from './config.js';
import Datasets from './pages/admin/Datasets.jsx';
import Preprocessing from './pages/admin/Preprocessing.jsx';
import Training from './pages/admin/Training.jsx';
import Comparison from './pages/admin/Comparison.jsx';
import Retention from './pages/admin/Retention.jsx';
import AuditLogs from './pages/admin/AuditLogs.jsx';
import SettingsPage from './pages/admin/Settings.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/app" element={<ProtectedRoute role="applicant"><Layout role="applicant" /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="apply" element={<NewApplication />} />
        <Route path="test" element={<NewApplication testMode />} />
        <Route path="result/:id" element={<ApplicationView />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="history/:id" element={<ApplicationView detail />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="/admin" element={<ProtectedRoute role="admin"><Layout role="admin" /></ProtectedRoute>}>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<Overview />} />
        <Route path="applications" element={<Applications />} />
        <Route path="applications/:id" element={<ApplicationView detail />} />
        <Route path="test" element={<NewApplication testMode />} />
        <Route path="datasets" element={config.USE_MOCK ? <Datasets /> : <DatasetsCloud />} />
        <Route path="preprocessing" element={<Preprocessing />} />
        <Route path="training" element={<Training />} />
        <Route path="comparison" element={<Comparison />} />
        <Route path="retention" element={<Retention />} />
        <Route path="audit" element={<AuditLogs />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
