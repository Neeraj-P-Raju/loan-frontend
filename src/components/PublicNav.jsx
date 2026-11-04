import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { config } from '../config.js';

export default function PublicNav() {
  return (
    <div className="pub-nav">
      <Link to="/" className="logo"><ShieldCheck size={22} /> {config.APP_NAME}</Link>
      <div>
        <Link to="/">Home</Link>
        <a href="/#how">How it works</a>
        <a href="/#contact">Contact</a>
        <Link to="/login">Login</Link>
        <Link to="/register">Get started</Link>
      </div>
    </div>
  );
}
