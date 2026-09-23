'use client';

// Public landing page. Rebuilt around the guided-roadmap product: the
// headline states what Learn.it does, then exactly two career cards — no
// stat counters, scroll-journey, or pillar cards competing for attention.
// (The previous Java-only marketing page's phase-journey content now lives
// on each /roadmap/[career] page, where it's actually relevant context.)

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CAREERS } from '@/lib/roadmaps';
import ThemeToggle from '@/components/ThemeToggle';
import Logo from '@/components/Logo';
import CareerCard from '@/components/CareerCard';

export default function LandingPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let active = true;
    fetch('/api/auth/me')
      .then((res) => {
        if (active && res.ok) setAuthed(true);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  function handleStart(careerId) {
    if (authed) {
      router.push('/roadmap/' + careerId);
    } else {
      router.push('/signup?career=' + careerId);
    }
  }

  return (
    <div className="landing">
      <div className="topbar">
        <div className="brand">
          <Logo size={26} />
          <span className="mark">Learn.it</span>
        </div>
        <button className="menu-btn" onClick={() => setMenuOpen((o) => !o)} aria-label="Menu" aria-expanded={menuOpen}>
          {menuOpen ? '✕' : '☰'}
        </button>
        <div className={'nav' + (menuOpen ? ' open' : '')}>
          <ThemeToggle />
          {authed ? (
            <Link className="tab" href="/dashboard">
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link className="tab" href="/login">
                Log in
              </Link>
              <Link className="tab" href="/signup">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>

      <motion.section
        className="hero"
        style={{ textAlign: 'center' }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="eyebrow" style={{ margin: '0 auto 24px' }}>
          Learn.it
        </div>
        <h1 className="title" style={{ margin: '0 auto' }}>
          Build skills. Build projects.
          <br />
          <span className="out">Get job-ready.</span>
        </h1>
        <p className="hero-sub" style={{ margin: '20px auto 0' }}>
          Tell Learn.it what you want to become. It tells you what to learn,
          what to practice, what to build, and what to do next.
        </p>
      </motion.section>

      <motion.div
        className="career-grid"
        style={{ marginTop: 12, marginBottom: 60 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        {CAREERS.map((career) => (
          <CareerCard key={career.id} career={career} onStart={handleStart} />
        ))}
      </motion.div>

      <footer>Built for one engineer&rsquo;s climb — Meerut → production</footer>
    </div>
  );
}
