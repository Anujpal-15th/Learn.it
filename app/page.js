'use client';

// Public landing page (Phase 5). Anyone can see this — no session required.
// A returning logged-in visitor gets a "Go to dashboard" CTA instead of
// login/signup once the quick /api/auth/me check resolves.

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { TOPICS, PHASES } from '@/lib/topics';
import ThemeToggle from '@/components/ThemeToggle';

const TOTAL_TOPICS = TOPICS.length;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};
const gridVariants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

export default function LandingPage() {
  const [authed, setAuthed] = useState(false);

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

  return (
    <>
      <div className="topbar">
        <div className="brand">
          <span className="mark">THE LEDGER//</span>
        </div>
        <div className="nav">
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
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="eyebrow">
          8 phases · {TOTAL_TOPICS} topics · dsa-to-deployment · full-stack java track
        </div>
        <h1 className="title">
          From <span className="out">Syntax</span>
          <br />
          to Systems.
        </h1>
        <p className="hero-sub">
          A structured Java backend roadmap and daily practice tracker — DSA
          and algorithms first, then the full backend stack, then the
          frontend that ties it together. Every topic broken into subtopics,
          every subtopic backed by real practice questions, every phase
          closed out with a project.
        </p>
        <div className="landing-cta">
          <Link className="btn-primary landing-btn" href={authed ? '/dashboard' : '/signup'}>
            {authed ? 'Go to dashboard' : 'Start tracking — it’s free'}
          </Link>
          {authed ? null : (
            <Link className="back-btn" href="/login">
              I already have an account
            </Link>
          )}
        </div>
      </motion.section>

      <div className="section-label">
        <span>The Roadmap</span>
      </div>

      <div className="phase">
        <motion.div
          className="topic-grid landing-phase-grid"
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
        >
          {PHASES.map((ph, pi) => (
            <motion.div className="card landing-phase-card" key={pi} variants={fadeUp}>
              <div className="cnum">{String(pi + 1).padStart(2, '0')} / {PHASES.length}</div>
              <div className="ctitle">{ph.name.replace(/^Phase \d+\s*—\s*/, '')}</div>
              <div className="cmeta">{ph.desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <footer>Built for one engineer&rsquo;s climb — Meerut → production</footer>
    </>
  );
}
