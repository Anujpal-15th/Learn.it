'use client';

// Dashboard (Phase 3). Reads the real session + progress, renders the stat
// strip, the daily activity grid, and every phase -> topic card. Read-only:
// toggling questions happens on the topic detail page (Phase 4).

import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import {
  TOPICS,
  PHASES,
  PHASE_PROJECTS,
  CAPSTONE,
  totalQuestions,
  solvedCount,
  topicSolved,
  topicComplete,
} from '@/lib/topics';
import { useProgress } from '@/components/useProgress';
import ThemeToggle from '@/components/ThemeToggle';

const TOTAL_TOPICS = TOPICS.length;

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

export default function Dashboard() {
  const router = useRouter();
  const { user, progress, growth, loading } = useProgress();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
    router.refresh();
  }

  const stats = useMemo(() => {
    const total = totalQuestions();
    const solved = solvedCount(progress);
    const cleared = TOPICS.filter((t) => topicComplete(t, progress)).length;
    return {
      total,
      solved,
      cleared,
      pct: total ? Math.round((solved / total) * 100) : 0,
    };
  }, [progress]);

  const byPhase = useMemo(() => {
    const map = {};
    TOPICS.forEach((t) => {
      (map[t.phase] = map[t.phase] || []).push(t);
    });
    return map;
  }, []);

  if (loading) {
    return (
      <main className="boot">
        <div className="eyebrow">The Ledger</div>
        <p className="sub">Loading your roadmap…</p>
      </main>
    );
  }

  return (
    <>
      <div className="topbar">
        <div className="brand">
          <span className="mark">THE LEDGER//</span>
          <span className="sub">{user.name || user.email}</span>
        </div>
        <button
          className="menu-btn"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
        <div className={'nav' + (menuOpen ? ' open' : '')}>
          <a className="tab" href="/backend-topics">
            Backend Topics
          </a>
          <a className="tab" href="/networking">
            Networking
          </a>
          <a className="tab" href="/interview-questions">
            Interview Q&amp;A
          </a>
          <a className="tab" href="/algorithms">
            Algorithm List
          </a>
          <a className="tab" href="/leetcode">
            <span className="dot" aria-hidden="true" />
            {stats.solved} solved
          </a>
          <ThemeToggle />
          <button className="tab" onClick={handleLogout}>
            Log out
          </button>
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
          DSA and algorithms first, then the full backend stack, then the
          frontend that ties it together — every topic broken into subtopics,
          every subtopic backed by real practice questions across all three
          difficulties, every phase closed out with a project. Nothing skipped.
        </p>

        <div className="ledger">
          <div className="cell">
            <div className="num">{stats.cleared}/{TOTAL_TOPICS}</div>
            <div className="lbl">Topics cleared</div>
          </div>
          <div className="cell">
            <div className="num">{stats.solved}/{stats.total}</div>
            <div className="lbl">Questions solved</div>
          </div>
          <div className="cell">
            <div className="num">{stats.cleared}/{TOTAL_TOPICS}</div>
            <div className="lbl">Checkpoints hit</div>
          </div>
          <div className="cell">
            <div className="num">{stats.pct}%</div>
            <div className="lbl">Overall progress</div>
          </div>
        </div>
      </motion.section>

      <div className="growth">
        <h3>Daily growth — activity ledger</h3>
        <GrowthGrid growth={growth} />
      </div>

      <div className="section-label">
        <span>The Roadmap</span>
        <div className="ln" />
      </div>

      <div>
        {PHASES.map((ph, pi) => {
          const phaseTopics = byPhase[pi] || [];
          const phaseDone =
            phaseTopics.length > 0 &&
            phaseTopics.every((t) => topicComplete(t, progress));
          const pp = PHASE_PROJECTS[pi];
          return (
            <div className="phase" key={pi}>
              <div className="phase-head">
                <span className="phase-num mono">
                  {String(pi + 1).padStart(2, '0')}
                </span>
                <span className="phase-title">{ph.name}</span>
              </div>
              <div className="phase-desc">{ph.desc}</div>
              {ph.learnMore ? (
                <a
                  className="concept-more"
                  href={ph.learnMore.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginBottom: 18, display: 'inline-block' }}
                >
                  {ph.learnMore.label} {'↗'}
                </a>
              ) : null}

              <motion.div
                className="topic-grid"
                variants={gridVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-40px' }}
              >
                {phaseTopics.map((top) => {
                  const { c, t } = topicSolved(top, progress);
                  const pct = t ? Math.round((c / t) * 100) : 0;
                  const complete = topicComplete(top, progress);
                  return (
                    <motion.div
                      className="card"
                      key={top.id}
                      variants={cardVariants}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 26 }}
                      onClick={() => router.push('/topic/' + top.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          router.push('/topic/' + top.id);
                        }
                      }}
                    >
                      <div>
                        <div className="cnum">
                          {String(top.num).padStart(2, '0')} / {TOTAL_TOPICS}
                          {complete ? ' · Cleared' : ''}
                        </div>
                        <div className="ctitle">{top.title}</div>
                        <div className="cmeta">
                          {top.subtopics.length} subtopics
                        </div>
                      </div>
                      <div>
                        <div className="progress-row">
                          <div className="bar-bg">
                            <div className="bar-fill" style={{ width: pct + '%' }} />
                          </div>
                          <span className="ctag">{c}/{t}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {pp ? (
                  <motion.div
                    className="proj-card"
                    variants={cardVariants}
                    style={{ opacity: phaseDone ? 1 : 0.6 }}
                  >
                    <span className="proj-eyebrow">
                      {phaseDone ? 'Unlocked' : 'Unlocks when phase topics are cleared'}
                    </span>
                    <div className="proj-title">{pp.title}</div>
                    <div className="proj-desc">{pp.desc}</div>
                  </motion.div>
                ) : null}
              </motion.div>
            </div>
          );
        })}
      </div>

      <div className="capstone">
        <div className="capstone-box">
          <div className="capstone-eyebrow">
            When all {TOTAL_TOPICS} topics are cleared
          </div>
          <div className="capstone-title">{CAPSTONE.title}</div>
          <div className="capstone-desc">{CAPSTONE.desc}</div>
        </div>
      </div>

      <footer>Built for one engineer&rsquo;s climb — Meerut → production</footer>
    </>
  );
}

// GitHub-contributions-style grid: last 371 days, 4 fill levels toward --ink.
function GrowthGrid({ growth }) {
  const cells = useMemo(() => {
    const out = [];
    const today = new Date();
    for (let i = 370; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const count = growth[key] || 0;
      let lvl = '';
      if (count >= 1) lvl = 'l1';
      if (count >= 3) lvl = 'l2';
      if (count >= 6) lvl = 'l3';
      if (count >= 10) lvl = 'l4';
      out.push({ key, count, lvl });
    }
    return out;
  }, [growth]);

  return (
    <div className="grid-days">
      {cells.map((c) => (
        <div
          key={c.key}
          className={'gday ' + c.lvl}
          title={c.key + ': ' + c.count + ' solved'}
        />
      ))}
    </div>
  );
}
