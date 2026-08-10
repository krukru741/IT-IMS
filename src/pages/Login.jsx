import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Boxes } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { Sun, Moon } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: 'alex.reyes@company.com', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate auth delay
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    navigate('/');
  };

  return (
    <div className="login-page">
      {/* Theme toggle on login */}
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        style={{ position: 'absolute', top: 20, right: 20 }}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      {/* Background blobs */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
      }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: 300 + i * 80,
            height: 300 + i * 80,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(79,70,229,${0.04 - i * 0.005}) 0%, transparent 70%)`,
            top: `${[10, 60, 30, 80, 5, 50][i]}%`,
            left: `${[20, 70, 80, 10, 50, 35][i]}%`,
            transform: 'translate(-50%, -50%)',
          }} />
        ))}
      </div>

      <div className="login-card animate-fade-up">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon" aria-hidden="true">
            <Boxes size={26} color="#fff" />
          </div>
          <span className="login-logo-text">IT IMS</span>
        </div>

        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Sign in to your IT Inventory Management System</p>

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="input-group">
            <Mail className="input-icon" size={16} aria-hidden="true" />
            <input
              id="email"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              autoComplete="email"
              required
              aria-label="Email address"
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <Lock className="input-icon" size={16} aria-hidden="true" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              autoComplete="current-password"
              aria-label="Password"
              style={{ paddingRight: 44 }}
            />
            <button
              type="button"
              className="input-action"
              onClick={() => setShowPassword(s => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Options */}
          <div className="login-options">
            <label className="checkbox-label" htmlFor="remember">
              <input type="checkbox" id="remember" />
              Remember me
            </label>
            <a href="#" style={{ fontSize: 13 }}>Forgot password?</a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn-login"
            id="login-submit"
            disabled={loading}
            aria-label="Sign in"
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" style={{ animation: 'spin 0.8s linear infinite' }}>
                  <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none"/>
                  <path d="M8 2 A6 6 0 0 1 14 8" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round"/>
                </svg>
                Signing in…
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: 'var(--text-muted)' }}>
          IT IMS v1.0.0 &nbsp;·&nbsp; <a href="#">Support</a>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
