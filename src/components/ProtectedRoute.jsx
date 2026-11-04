import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Sends visitors to the right place:
// not logged in -> /login, wrong portal -> their own dashboard.
export default function ProtectedRoute({ role, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin/overview' : '/app/dashboard'} replace />;
  }
  return children;
}
