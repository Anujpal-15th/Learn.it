'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AppNav from '@/components/AppNav';
import CareerSwitcher from '@/components/CareerSwitcher';
import Reveal from '@/components/motion/Reveal';
import { getCareer } from '@/lib/roadmaps';

export default function SignupPage() {
  return (
    <Suspense fallback={<AppNav minimal />}>
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const param = searchParams.get('career');
  // Track: ?career, else the last-used track (read after mount), else Java.
  // Before that read, nothing is shown, so AppNav doesn't write a guess over
  // the saved track and the pill doesn't slide on load.
  const [stored, setStored] = useState(null);
  const [resolved, setResolved] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem('learnit-track');
      if (getCareer(saved)) setStored(saved);
    } catch {}
    setResolved(true);
  }, []);
  const shownId = getCareer(param) ? param : resolved ? stored || 'java-developer' : null;
  const career = getCareer(shownId || 'java-developer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not create account.');
        setBusy(false);
        return;
      }
      // There is always a track, so carry it straight through to its roadmap
      // instead of dropping the learner on an empty dashboard.
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress: {}, growth: {}, meta: { selectedCareer: career.id } }),
      });
      router.push('/roadmap/' + career.id);
      router.refresh();
    } catch {
      setError('Network error — please try again.');
      setBusy(false);
    }
  }

  function handleCareer(id) {
    router.replace('/signup?career=' + id, { scroll: false });
  }

  return (
    <>
      <AppNav minimal careerId={shownId} />
      <main className="auth-wrap">
        <Reveal className="auth-card">
          <div className="auth-brand">
            <span className="sub">Sign up</span>
          </div>
          <h1 className="auth-title">Start the climb.</h1>
          <p className="auth-lead">Your progress saves to your account. Sign in anywhere.</p>

          <div className="field">
            <CareerSwitcher value={shownId} onChange={handleCareer} size="sm" block />
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="name">Name (optional)</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Anuj"
                autoComplete="name"
              />
            </div>
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
                placeholder="At least 8 characters"
                autoComplete="new-password"
                required
              />
            </div>

            <button className="btn-primary" type="submit" disabled={busy}>
              {busy ? 'Creating…' : 'Create account'}
            </button>
          </form>

          {error ? <p className="auth-error">{error}</p> : null}

          <p className="auth-alt">
            Already have an account? <Link href="/login">Log in</Link>
          </p>
        </Reveal>
      </main>
    </>
  );
}
