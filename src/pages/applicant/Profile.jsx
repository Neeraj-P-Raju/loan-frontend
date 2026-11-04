import { useAuth } from '../../context/AuthContext.jsx';

export default function Profile() {
  const { user } = useAuth();
  return (
    <div>
      <h1>Profile</h1>
      <div className="card" style={{ maxWidth: 520 }}>
        <dl className="kv">
          <dt>Name</dt><dd>{user.name}</dd>
          <dt>Email</dt><dd>{user.email}</dd>
          <dt>Role</dt><dd>Applicant (demo)</dd>
        </dl>
        <p className="muted">
          Account details are kept separate from the application answers and are never used as model features.
        </p>
      </div>
    </div>
  );
}
