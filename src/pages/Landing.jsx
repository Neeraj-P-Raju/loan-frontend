import { Link } from 'react-router-dom';
import { FileText, Cpu, Lock, MessageCircle } from 'lucide-react';
import PublicNav from '../components/PublicNav.jsx';

export default function Landing() {
  return (
    <div>
      <PublicNav />
      <section className="hero">
        <h1>Check your loan chances before you apply</h1>
        <p>
          Fill in one guided form and get a quick estimate from a machine learning model.
          This is an academic prototype: the estimate shown is a demonstration and not a bank decision.
        </p>
        <div className="btns">
          <Link to="/register" className="btn btn-teal">Apply now</Link>
          <Link to="/login" className="btn btn-light">Login</Link>
        </div>
      </section>

      <section className="info-cards" id="how">
        <h2 style={{ textAlign: 'center' }}>How it works</h2>
        <div className="grid grid-3">
          <div className="card">
            <FileText color="#0d9488" />
            <h3>1. Fill the form</h3>
            <p className="muted">Six short sections. Questions appear only when they apply to you.</p>
          </div>
          <div className="card">
            <Cpu color="#0d9488" />
            <h3>2. Get an estimate</h3>
            <p className="muted">A model gives a likely approved or not approved result (demo values for now).</p>
          </div>
          <div className="card">
            <Lock color="#0d9488" />
            <h3>3. Your data stays separate</h3>
            <p className="muted">Account details are never used as model features, and sensitive fields are optional.</p>
          </div>
        </div>
      </section>

      <div className="footer" id="contact">
        Contact: loanpredict.demo@example.com (demo address) | CSD481 Mini Project, Semester 7
      </div>
      <button className="help-btn" title="Placeholder for a chatbot" onClick={() => alert('Help chat is a placeholder in this demo.')}>
        <MessageCircle size={16} style={{ verticalAlign: 'middle' }} /> Help
      </button>
    </div>
  );
}
