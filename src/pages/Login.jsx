import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Boxes, AlertCircle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { mockUsers } from '../data/mockData';
import { Sun, Moon } from 'lucide-react';

// ── Demo-only credential gate ─────────────────────────────────
// There is no backend yet, so we validate against the mock user
// directory. Every seeded account shares this password. Replace
// this entire block with a real API call once auth is available.
const DEMO_PASSWORD = 'demo1234';

// Static — defined once, not recreated every render
const BLOBS = [
  { size: 300, top: 10, left: 20 },
  { size: 380, top: 60, left: 70 },
  { size: 460, top: 30, left: 80 },
  { size: 540, top: 80, left: 10 },
  { size: 620, top: 5, left: 50 },
  { size: 700, top: 50, left: 35 },
];

export default function Login() {
  const navigate = useNavigate();
  const { theme, toggleTheme, setCurrentUser, setActiveBranch } = useStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [remember, setRemember] = useState(!!localStorage.getItem('ims-remember-email'));
  const [form, setForm] = useState({
    email: localStorage.getItem('ims-remember-email') || '',
    password: '',
  });

  const isValid = form.email.trim().length > 3 && form.password.length > 0;

  // ── Credential lookup against mock directory ─────────────────
  const authenticate = (email, password) => {
    const user = mockUsers.find(
      u => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!user) {
      return { ok: false, message: 'No account found with that email address.' };
    }
    if (user.status !== 'active') {
      return { ok: false, message: 'This account is inactive. Contact your administrator.' };
    }
    if (password !== DEMO_PASSWORD) {
      return { ok: false, message: 'Incorrect password. Please try again.' };
    }
    return { ok: true, user };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email.trim() || !form.password) {
      setError('Please enter both email and password.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    // Simulate auth network delay
    await new Promise(r => setTimeout(r, 700));

    const result = authenticate(form.email, form.password);
    setLoading(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    const { user } = result;

    // Hydrate the store with the authenticated user
    setCurrentUser({
      id: user.id,
      name: user.name,
      initials: user.initials,
      email: user.email,
      role: user.role,
      branch: user.branch,
      avatar: null,
    });
    setActiveBranch(user.branch || 'all');

    if (remember) localStorage.setItem('ims-remember-email', form.email);
    else localStorage.removeItem('ims-remember-email');

    navigate('/');
  };

  return (
    <div className="login-page">
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        style={{ position: 'absolute', top: 20, right: 20 }}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {BLOBS.map((b, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: b.size, height: b.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(79,70,229,${0.04 - i * 0.005}) 0%, transparent 70%)`,
            top: `${b.top}%`, left: `${b.left}%`,
            transform: 'translate(-50%, -50%)',
          }} />
        ))}
      </div>

      <div className="login-card animate-fade-up">
        <div className="login-logo">
          <div className="login-logo-icon" aria-hidden="true">
            <Boxes size={26} color="#fff" />
          </div>
          <span className="login-logo-text">IT IMS</span>
        </div>

        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Sign in to your IT Inventory Management System</p>

        {error && (
          <div role="alert" style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--status-danger-bg)', color: 'var(--status-danger)',
            padding: '10px 14px', borderRadius: 'var(--radius-md)',
            fontSize: 13, marginBottom: 16,
          }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="float-field">
            <Mail className="float-field-icon" size={16} aria-hidden="true" />
            <input
              id="email"
              type="email"
              className="float-input"
              placeholder=" "
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              autoComplete="email"
              autoFocus
              required
              aria-invalid={!!error}
              aria-label="Email address"
            />
            <label className="float-label" htmlFor="email">Email address</label>
          </div>

          <div className="float-field">
            <Lock className="float-field-icon" size={16} aria-hidden="true" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="float-input"
              placeholder=" "
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              autoComplete="current-password"
              aria-invalid={!!error}
              aria-label="Password"
              style={{ paddingRight: 44 }}
            />
            <label className="float-label" htmlFor="password">Password</label>
            <button
              type="button"
              className="input-action"
              onClick={() => setShowPassword(s => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="login-options">
            <label className="checkbox-label" htmlFor="remember">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
              />
              Remember me
            </label>
            <a href="#" style={{ fontSize: 13 }}>Forgot password?</a>
          </div>

          <button
            type="submit"
            className="btn-login"
            id="login-submit"
            disabled={loading || !isValid}
            aria-label="Sign in"
            style={{ opacity: !isValid && !loading ? 0.6 : 1 }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" style={{ animation: 'spin 0.8s linear infinite' }}>
                  <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" />
                  <path d="M8 2 A6 6 0 0 1 14 8" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>
                Signing in…
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        {/* Demo credentials hint — remove once real auth is wired */}
        <div style={{
          display: 'flex', gap: 8, alignItems: 'flex-start',
          marginTop: 20, padding: '10px 14px',
          background: 'rgba(79,70,229,0.06)', border: '1px solid rgba(79,70,229,0.15)',
          borderRadius: 'var(--radius-md)', fontSize: 12, color: 'var(--text-muted)',
        }}>
          <Info size={14} style={{ flexShrink: 0, marginTop: 1, color: 'var(--brand-primary)' }} />
          <span>
            Demo mode: sign in with any active user's email from the directory
            (e.g. <strong style={{ color: 'var(--text-secondary)' }}>alex.reyes@company.com</strong>)
            and password <strong style={{ color: 'var(--text-secondary)' }}>{DEMO_PASSWORD}</strong>.
          </span>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--text-muted)' }}>
          IT IMS v1.0.0 &nbsp;·&nbsp; <a href="#">Support</a>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 480px) {
          .float-input { font-size: 16px; }
        }
      `}</style>
    </div>
  );
}