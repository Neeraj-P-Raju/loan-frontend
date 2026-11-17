import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicNav from '../components/PublicNav.jsx';
import { config } from '../config.js';
import { useAuth } from '../context/AuthContext.jsx';

const emailOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export default function Register() {
  const { login, signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    const err = {};
    if (form.name.trim().length < 3) err.name = 'Enter your full name';
    if (!emailOk(form.email)) err.email = 'Enter a valid email address';
    if (form.password.length < 8) err.password = 'Password must be at least 8 characters';
    if (form.confirm !== form.password) err.confirm = 'Passwords do not match';
    setErrors(err);
    if (Object.keys(err).length) return;
    if (config.USE_MOCK) {
      login(form.email, 'applicant', form.name);
    } else {
      try { await signUp(form.name, form.email, form.password); } catch (ex) { setErrors({ email: ex.message }); return; }
    }
    navigate('/app/dashboard');
  }

  const row = (k, label, type) => (
    <div className={'field' + (errors[k] ? ' has-error' : '')}>
      <label>{label}</label>
      <input type={type} value={form[k]} onChange={set(k)} />
      {errors[k] && <div className="error">{errors[k]}</div>}
    </div>
  );

  return (
    <div>
      <PublicNav />
      <div className="auth-box card">
        <h2>Create an account</h2>
        <div className="notice info">Demo only: no real account is created or stored on a server.</div>
        <form onSubmit={handleSubmit} noValidate>
          {row('name', 'Full name', 'text')}
          {row('email', 'Email', 'email')}
          {row('password', 'Password', 'password')}
          {row('confirm', 'Confirm password', 'password')}
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Register</button>
        </form>
        <p className="muted">Already registered? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}
