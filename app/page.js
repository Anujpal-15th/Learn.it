'use client';

// Dashboard (Phase 3). Reads the real session + progress, renders the stat
// strip, the daily activity grid, and every phase -> topic card. Read-only:
// toggling questions happens on the topic detail page (Phase 4).

import { useEffect, useMemo, useState } from 'react';
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

const TOTAL_TOPICS = TOPICS.length;

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState({});
  const [growth, setGrowth] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const meRes = await fetch('/api/auth/me');
        if (!meRes.ok) {
          router.replace('/login');
          return;
        }
        const me = await meRes.json();
        const progRes = await fetch('/api/progress');
        const prog = progRes.ok ? await progRes.json() : { progress: {}, growth: {} };
        if (!active) return;
        setUser(me.user);
        setProgress(prog.progress || {});
        setGrowth(prog.growth || {});
        setLoading(false);
      } catch {
        router.replace('/login');
      }
    })();
    return () => {
      active = false;
    };
  }, [router]);

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
        <div className="nav">
          <a className="tab" href="/leetcode">
            <span className="dot" aria-hidden="true" />
            {stats.solved} solved
          </a>
          <button className="tab" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>

      <section className="hero">
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
      </section>

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

              <div className="topic-grid">
                {phaseTopics.map((top) => {
                  const { c, t } = topicSolved(top, progress);
                  const pct = t ? Math.round((c / t) * 100) : 0;
                  const complete = topicComplete(top, progress);
                  return (
                    <div
                      className="card"
                      key={top.id}
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
                          {complete ? ' · CLEARED' : ''}
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
                    </div>
                  );
                })}

                {pp ? (
                  <div className="proj-card" style={{ opacity: phaseDone ? 1 : 0.55 }}>
                    <span className="proj-eyebrow">
                      {phaseDone ? 'Unlocked' : 'Unlocks when phase topics are cleared'}
                    </span>
                    <div className="proj-title">{pp.title}</div>
                    <div className="proj-desc">{pp.desc}</div>
                  </div>
                ) : null}
              </div>
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

      <footer>BUILT FOR ONE ENGINEER'S CLIMB — MEERUT → PRODUCTION</footer>
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
