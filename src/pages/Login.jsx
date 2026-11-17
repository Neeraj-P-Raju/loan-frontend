import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicNav from '../components/PublicNav.jsx';
import { config } from '../config.js';
import { useAuth } from '../context/AuthContext.jsx';

const emailOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export default function Login() {
  const { login, signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('applicant');
  const [errors, setErrors] = useState({});

  async function handleSubmit(e) {
    e.preventDefault();
    const err = {};
    if (!emailOk(email)) err.email = 'Enter a valid email address';
    if (password.length < 8) err.password = 'Password must be at least 8 characters';
    setErrors(err);
    if (Object.keys(err).length) return;
    if (config.USE_MOCK) {
      login(email, role);
      navigate(role === 'admin' ? '/admin/overview' : '/app/dashboard');
      return;
    }
    try {
      const u = await signIn(email, password);
      navigate(u.role === 'admin' ? '/admin/overview' : '/app/dashboard');
    } catch (ex) {
      setErrors({ password: ex.message });
    }
  }

  function fillDemo(r) {
    setRole(r);
    setEmail(r === 'admin' ? 'admin@demo.com' : 'applicant@demo.com');
    setPassword('demo12345');
    setErrors({});
  }

  return (
    <div>
      <PublicNav />
      <div className="auth-box card">
        <h2>Login</h2>
        <div className="notice info">Demo login: any valid email and a password of 8 or more characters will work. Choose a role below.</div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="role-pick">
            {['applicant', 'admin'].map((r) => (
              <label key={r} className={role === r ? 'on' : ''}>
                <input type="radio" name="role" checked={role === r} onChange={() => setRole(r)} />
                {r === 'applicant' ? 'Applicant' : 'Admin'}
              </label>
            ))}
          </div>
          <div className={'field' + (errors.email ? ' has-error' : '')}>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>
          <div className={'field' + (errors.password ? ' has-error' : '')}>
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {errors.password && <div className="error">{errors.password}</div>}
          </div>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Login</button>
        </form>
        <p className="muted">
          Quick fill: <a href="#" onClick={(e) => { e.preventDefault(); fillDemo('applicant'); }}>demo applicant</a>
          {' | '}
          <a href="#" onClick={(e) => { e.preventDefault(); fillDemo('admin'); }}>demo admin</a>
        </p>
        <p className="muted">No account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}
