'use client';

// LeetCode bank (Phase 4). A focused view of every real LeetCode problem in
// the roadmap, grouped by topic — derived from lib/topics.js, not a separate
// data set, so checking a problem here and on its topic page is the same state.

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { TOPICS, qid } from '@/lib/topics';
import { useProgress } from '@/components/useProgress';
import QuestionRow from '@/components/QuestionRow';
import ThemeToggle from '@/components/ThemeToggle';

function isLeetCode(q) {
  return !!q.u && q.u.includes('leetcode.com');
}

// Build [{ topic, items: [{ q, id }] }] for every topic that has LC problems.
function buildBank() {
  const groups = [];
  TOPICS.forEach((top) => {
    const items = [];
    top.subtopics.forEach((s, si) => {
      s.q.forEach((q, qi) => {
        if (isLeetCode(q)) items.push({ q, id: qid(top.id, si, qi) });
      });
    });
    if (items.length) groups.push({ topic: top, items });
  });
  return groups;
}

export default function LeetCodePage() {
  const router = useRouter();
  const { loading, error, isDone, toggle } = useProgress();
  const groups = useMemo(buildBank, []);

  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const solved = groups.reduce(
    (n, g) => n + g.items.filter((it) => isDone(it.id)).length,
    0
  );

  if (loading) {
    return (
      <main className="boot">
        <div className="eyebrow">The Ledger</div>
        <p className="sub">Loading the bank…</p>
      </main>
    );
  }

  return (
    <div className="detail">
      <div className="page-topbar">
        <button className="back-btn" onClick={() => router.push('/dashboard')}>
          ← Back to roadmap
        </button>
        <ThemeToggle />
      </div>

      <div className="detail-head">
        <div className="detail-num mono">PRACTICE BANK</div>
        <div className="detail-title">LeetCode</div>
        <div className="detail-sub">
          Every real LeetCode problem across the roadmap, in one place. Checking
          a problem here updates your topic progress too.
        </div>
        <div className="detail-progress">
          <div className="bar-bg">
            <div
              className="bar-fill"
              style={{ width: (total ? Math.round((solved / total) * 100) : 0) + '%' }}
            />
          </div>
          <span className="mono" style={{ fontSize: 12 }}>{solved}/{total} solved</span>
        </div>
        {error ? <div className="detail-error">{error}</div> : null}
      </div>

      {groups.map((g) => {
        const doneC = g.items.filter((it) => isDone(it.id)).length;
        return (
          <div className="sub-block" key={g.topic.id}>
            <div className="sub-head">
              <span className="bank-group-title">{g.topic.title}</span>
              <div className="sub-line" />
              <span className="sub-count mono">{doneC}/{g.items.length}</span>
            </div>
            {g.items.map((it) => (
              <QuestionRow
                key={it.id}
                q={it.q}
                id={it.id}
                done={isDone(it.id)}
                onToggle={toggle}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
