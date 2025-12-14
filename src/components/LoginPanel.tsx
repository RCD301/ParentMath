// src/components/LoginPanel.tsx
import { useState, useEffect, useRef } from 'react';
import { signInWithEmail, signUpWithEmail, logOut } from '../lib/authService';
import { useAuth } from '../context/AuthContext';
import './LoginPanel.css';

export function LoginPanel() {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === 'login') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
      // Close dropdown on successful login
      setIsOpen(false);
      setEmail('');
      setPassword('');
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  function handleToggleMode() {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError(null);
  }

  return (
    <div className="login-panel" ref={dropdownRef}>
      {/* Avatar/User Icon Trigger */}
      <button
        className="login-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={user ? 'User menu' : 'Sign in'}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="10" cy="7" r="4" />
          <path d="M3 20c0-4.4 3.1-8 7-8s7 3.6 7 8" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="login-dropdown">
          {user ? (
            // Logged in state
            <div className="login-dropdown-content">
              <p className="user-email">{user.email}</p>
              <button className="btn-logout" onClick={() => logOut()}>
                Log out
              </button>
            </div>
          ) : (
            // Login/signup form
            <div className="login-dropdown-content">
              <h3 className="login-dropdown-title">
                {mode === 'login' ? 'Sign in' : 'Create account'}
              </h3>

              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  />
                </div>

                {error && <div className="error-text">{error}</div>}

                <button type="submit" className="btn-submit" disabled={busy}>
                  {busy ? 'Working…' : mode === 'login' ? 'Log in' : 'Sign up'}
                </button>

                <button
                  type="button"
                  className="btn-toggle-mode"
                  onClick={handleToggleMode}
                >
                  {mode === 'login' ? 'Create account' : 'Log in'}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
