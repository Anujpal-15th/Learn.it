'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not log in.');
        setBusy(false);
        return;
      }
      router.push('/');
      router.refresh();
    } catch {
      setError('Network error — please try again.');
      setBusy(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="mark">THE LEDGER//</span>
          <span className="sub">Log in</span>
        </div>
        <h1 className="auth-title">Welcome back.</h1>
        <p className="auth-lead">
          Log in to pick up exactly where you left off.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              autoComplete="current-password"
              required
            />
          </div>

          <button className="btn-primary" type="submit" disabled={busy}>
            {busy ? 'Signing in…' : 'Log in'}
          </button>
        </form>

        {error ? <p className="auth-error">{error}</p> : null}

        <p className="auth-alt">
          No account yet? <Link href="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
