'use client';

// Dashboard — the personalized hub, not the roadmap browser (that's now
// /roadmap/[career]). Shows a "choose your path" empty state until the
// learner has picked a career, then Continue Learning + Your Progress +
// Recommended Next + a milestone summary, scoped to their selected career.

import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CAREERS, getRoadmap, getCareer } from '@/lib/roadmaps';
import { roadmapStats, milestoneStats, recommendNextTopic } from '@/lib/roadmap-engine';
import { useProgress } from '@/components/useProgress';
import ThemeToggle from '@/components/ThemeToggle';
import Logo from '@/components/Logo';
import CareerCard from '@/components/CareerCard';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard() {
  const router = useRouter();
  const { user, progress, meta, loading, setSelectedCareer } = useProgress();
  const [menuOpen, setMenuOpen] = useState(false);

  const careerId = meta.selectedCareer;
  const roadmap = careerId ? getRoadmap(careerId) : null;
  const career = careerId ? getCareer(careerId) : null;

  const stats = useMemo(() => (roadmap ? roadmapStats(roadmap, progress) : null), [roadmap, progress]);
  const milestones = useMemo(() => (roadmap ? milestoneStats(roadmap, progress) : []), [roadmap, progress]);
  const recommendation = useMemo(() => (roadmap ? recommendNextTopic(roadmap, progress) : null), [roadmap, progress]);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
    router.refresh();
  }

  async function handlePickCareer(id) {
    await setSelectedCareer(id);
    router.push('/roadmap/' + id);
  }

  if (loading) {
    return (
      <main className="boot">
        <div className="eyebrow">Learn.it</div>
        <p className="sub">Loading your roadmap…</p>
      </main>
    );
  }

  return (
    <>
      <div className="topbar">
        <div className="brand">
          <Logo size={26} />
          <span className="mark">Learn.it</span>
          <span className="sub">{user.name || user.email}</span>
        </div>
        <button className="menu-btn" onClick={() => setMenuOpen((o) => !o)} aria-label="Menu" aria-expanded={menuOpen}>
          {menuOpen ? '✕' : '☰'}
        </button>
        <div className={'nav' + (menuOpen ? ' open' : '')}>
          {roadmap ? <Link className="tab" href={'/roadmap/' + roadmap.id}>Roadmap</Link> : null}
          <Link className="tab" href="/search">Search</Link>
          <Link className="tab" href="/interview-questions">Interview Q&amp;A</Link>
          {career && career.id === 'java-developer' ? (
            <>
              <Link className="tab" href="/backend-topics">Backend Topics</Link>
              <Link className="tab" href="/networking">Networking</Link>
              <Link className="tab" href="/algorithms">Algorithm List</Link>
              <Link className="tab" href="/leetcode">LeetCode</Link>
            </>
          ) : null}
          <ThemeToggle />
          <button className="tab" onClick={handleLogout}>Log out</button>
        </div>
      </div>

      {!roadmap ? (
        <div className="empty-state boot">
          <div className="eyebrow">Learn.it</div>
          <div className="empty-state-title">
            {greeting()}, {user.name || 'there'}. What do you want to become?
          </div>
          <div className="career-grid">
            {CAREERS.map((c) => (
              <CareerCard key={c.id} career={c} onStart={handlePickCareer} />
            ))}
          </div>
        </div>
      ) : (
        <>
          <motion.section
            className="hero"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="eyebrow">{greeting()}, {user.name || 'there'} 👋</div>
            <h1 className="title">
              Continue Learning
              <br />
              <span className="out">{career.label}</span>
            </h1>

            <div className="detail-progress" style={{ maxWidth: 420, marginTop: 20 }}>
              <div className="bar-bg">
                <div className="bar-fill" style={{ width: stats.pct + '%' }} />
              </div>
              <span className="mono" style={{ fontSize: 12 }}>{stats.pct}% complete</span>
            </div>

            {recommendation ? (
              <p className="hero-sub" style={{ marginTop: 16 }}>
                Current topic: <strong>{recommendation.topic.title}</strong>
              </p>
            ) : (
              <p className="hero-sub" style={{ marginTop: 16 }}>
                Every topic in this roadmap is cleared.
              </p>
            )}

            <div className="landing-cta" style={{ marginTop: 20 }}>
              {recommendation ? (
                <button className="btn-primary landing-btn" onClick={() => router.push('/topic/' + recommendation.topic.id)}>
                  Continue Learning
                </button>
              ) : (
                <Link className="btn-primary landing-btn" href={'/checklist/' + roadmap.id}>
                  View readiness checklist
                </Link>
              )}
              <Link className="back-btn" href={'/roadmap/' + roadmap.id}>
                View full roadmap
              </Link>
            </div>
          </motion.section>

          <div className="ledger" style={{ marginTop: -20, marginBottom: 40 }}>
            <div className="cell">
              <div className="num">{stats.topicsCompleted}</div>
              <div className="lbl">Topics completed</div>
            </div>
            <div className="cell">
              <div className="num">{stats.questionsSolved}</div>
              <div className="lbl">Questions solved</div>
            </div>
            <div className="cell">
              <div className="num">{stats.projectsCompleted}</div>
              <div className="lbl">Projects completed</div>
            </div>
            <div className="cell">
              <div className="num">{stats.pct}%</div>
              <div className="lbl">Roadmap progress</div>
            </div>
          </div>

          {recommendation ? (
            <>
              <div className="section-label"><span>Recommended Next</span><div className="ln" /></div>
              <div className="recommend-card" style={{ marginBottom: 40 }}>
                <div className="recommend-eyebrow">Because of your progress so far</div>
                <div className="recommend-title">{recommendation.topic.title}</div>
                <div className="recommend-reason">{recommendation.reason}</div>
                <button className="btn-primary" style={{ marginTop: 14 }} onClick={() => router.push('/topic/' + recommendation.topic.id)}>
                  Start
                </button>
              </div>
            </>
          ) : null}

          <div className="section-label"><span>Milestones</span><div className="ln" /></div>
          <div className="milestone-track" style={{ marginBottom: 40 }}>
            {milestones.map((m) => (
              <div className={'milestone-row ' + m.state} key={m.index}>
                <span className="milestone-num mono">{String(m.index + 1).padStart(2, '0')}</span>
                <span className="milestone-name">{m.name} {m.done ? '✓' : m.state === 'upcoming' ? '🔒' : ''}</span>
                <div className="milestone-bar bar-bg">
                  <div className="bar-fill" style={{ width: m.pct + '%' }} />
                </div>
                <span className="milestone-pct mono">{m.topicsCompleted}/{m.topicsTotal}</span>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', marginBottom: 40 }}>
            <Link className="concept-more" href="/">Working on the other path too? Start it from the homepage →</Link>
          </p>
        </>
      )}

      <footer>Built for one engineer&rsquo;s climb — Meerut → production</footer>
    </>
  );
}
