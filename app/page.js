'use client';

// Public landing page (Phase 5, motion-graphics pass). This is the one
// surface in the app that earns a louder, marketing-style motion treatment
// — everywhere else (the tracker itself) stays restrained since it's a
// dense, daily-use tool, not a page you scroll through once. Built entirely
// with the `motion` library already used across the app (no external
// Lottie/image assets), so it's free and stays on the same design tokens.

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform, animate } from 'motion/react';
import Link from 'next/link';
import { TOPICS, PHASES, PHASE_PROJECTS, totalQuestions } from '@/lib/topics';
import ThemeToggle from '@/components/ThemeToggle';

const TOTAL_TOPICS = TOPICS.length;
const TOTAL_QUESTIONS = totalQuestions();
const TOTAL_PROJECTS = PHASE_PROJECTS.length + 1; // + capstone

const headline = ['From', 'Syntax', 'to', 'Systems.'];

const wordVariants = {
  hidden: { opacity: 0, y: 24 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  }),
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};
const gridVariants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

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
    <div className="landing">
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

      <section className="hero" style={{ position: 'relative' }}>
        <div className="landing-blobs">
          <motion.div
            className="landing-blob b1"
            animate={{ x: [0, 40, -20, 0], y: [0, 30, -10, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="landing-blob b2"
            animate={{ x: [0, -30, 20, 0], y: [0, 20, -30, 0] }}
            transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="landing-blob b3"
            animate={{ x: [0, 25, -35, 0], y: [0, -20, 15, 0] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <motion.div
          className="eyebrow"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          8 phases · {TOTAL_TOPICS} topics · dsa-to-deployment · full-stack java track
        </motion.div>

        <h1 className="title landing-headline">
          {headline.map((w, i) => (
            <motion.span
              key={w}
              className="word"
              custom={i}
              initial="hidden"
              animate="show"
              variants={wordVariants}
              style={{ marginRight: i === headline.length - 1 ? 0 : '0.28em' }}
            >
              {i === 1 ? <span className="out">{w}</span> : w}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="hero-sub"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
        >
          A structured Java backend roadmap and daily practice tracker — DSA
          and algorithms first, then the full backend stack, then the
          frontend that ties it together. Every topic broken into subtopics,
          every subtopic backed by real practice questions, every phase
          closed out with a project.
        </motion.p>

        <motion.div
          className="landing-cta"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link className="btn-primary landing-btn" href={authed ? '/dashboard' : '/signup'}>
              {authed ? 'Go to dashboard' : 'Start tracking — it’s free'}
            </Link>
          </motion.div>
          {authed ? null : (
            <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link className="back-btn" href="/login">
                I already have an account
              </Link>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          className="landing-chips"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <span className="landing-chip">18 real DSA patterns</span>
          <span className="landing-chip">JWT auth · security · testing</span>
          <span className="landing-chip">Docker · Kubernetes · CI/CD</span>
          <span className="landing-chip">React + TypeScript frontend</span>
        </motion.div>
      </section>

      <div className="landing-stats">
        <StatCard to={TOTAL_TOPICS} label="Topics" />
        <StatCard to={TOTAL_QUESTIONS} label="Practice questions" />
        <StatCard to={PHASES.length} label="Phases" />
        <StatCard to={TOTAL_PROJECTS} label="Checkpoint projects" />
      </div>

      <div className="section-label">
        <span>The Journey</span>
      </div>
      <Journey />

      <div className="section-label">
        <span>Why it&rsquo;s built this way</span>
      </div>
      <motion.div
        className="landing-pillars"
        variants={gridVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
      >
        <Pillar
          num="01"
          title="Learn, then practice"
          desc="Every subtopic opens with a short primer on what it actually teaches — not just a pile of question links with no context."
        />
        <Pillar
          num="02"
          title="Real questions, real sources"
          desc="Every practice link is a real, verified problem on LeetCode, HackerRank, or a real article — nothing invented, nothing dead."
        />
        <Pillar
          num="03"
          title="Daily momentum, tracked"
          desc="A GitHub-style activity ledger and per-topic progress bars, so a year of studying compounds into something visible."
        />
      </motion.div>

      <div className="landing-final">
        <motion.div
          className="landing-final-box"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2>Start the climb.</h2>
          <p>
            Free to use, your progress saves to your account, and nothing
            here is a course upsell — just a roadmap and a checklist.
          </p>
          <div className="landing-cta">
            <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link className="btn-primary landing-btn" href={authed ? '/dashboard' : '/signup'}>
                {authed ? 'Go to dashboard' : 'Create your account'}
              </Link>
            </motion.div>
            {authed ? null : (
              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link className="back-btn" href="/login">
                  Log in
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      <footer>Built for one engineer&rsquo;s climb — Meerut → production</footer>
    </div>
  );
}

function StatCard({ to, label }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.3,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <motion.div
      ref={ref}
      className="landing-stat"
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <div className="num">{val}</div>
      <div className="lbl">{label}</div>
    </motion.div>
  );
}

function Pillar({ num, title, desc }) {
  return (
    <motion.div className="pillar-card" variants={fadeUp}>
      <span className="pillar-num">{num}</span>
      <div className="pillar-title">{title}</div>
      <div className="pillar-desc">{desc}</div>
    </motion.div>
  );
}

function Journey() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.5'],
  });
  const fillScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="landing-journey" ref={ref}>
      <div className="journey-track" />
      <motion.div className="journey-fill" style={{ scaleY: fillScale }} />
      {PHASES.map((ph, i) => (
        <motion.div
          className="journey-item"
          key={i}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="journey-node">{String(i + 1).padStart(2, '0')}</div>
          <div className="journey-card">
            <div className="jtitle">{ph.name.replace(/^Phase \d+\s*—\s*/, '')}</div>
            <div className="jdesc">{ph.desc}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
