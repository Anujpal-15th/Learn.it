'use client';

// A single Practice subject — every practice question from that subject's
// topics, grouped by topic. Same shape/derivation as /leetcode, filtered by
// lib/practice-groups.js instead of "is this a LeetCode link."

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TOPICS, qid } from '@/lib/topics';
import { PRACTICE_GROUPS } from '@/lib/practice-groups';
import { useProgress } from '@/components/useProgress';
import QuestionRow from '@/components/QuestionRow';
import ThemeToggle from '@/components/ThemeToggle';

function buildBank(group) {
  const groups = [];
  group.topicIds.forEach((tid) => {
    const top = TOPICS.find((t) => t.id === tid);
    if (!top) return;
    const items = [];
    top.subtopics.forEach((s, si) => {
      s.q.forEach((q, qi) => items.push({ q, id: qid(top.id, si, qi) }));
    });
    if (items.length) groups.push({ topic: top, items });
  });
  return groups;
}

export default function PracticeGroupPage() {
  const params = useParams();
  const router = useRouter();
  const { loading, error, isDone, toggle } = useProgress();
  const group = PRACTICE_GROUPS[params.group];
  const groups = useMemo(() => (group ? buildBank(group) : []), [group]);

  if (loading) {
    return (
      <main className="boot">
        <div className="eyebrow">Learn.it</div>
        <p className="sub">Loading…</p>
      </main>
    );
  }

  if (!group) {
    return (
      <div className="detail">
        <button className="back-btn" onClick={() => router.push('/practice')}>
          ← Back to Practice
        </button>
        <div className="detail-head">
          <div className="detail-title">Not found</div>
          <div className="detail-sub">"{params.group}" isn't a practice subject.</div>
        </div>
      </div>
    );
  }

  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const solved = groups.reduce((n, g) => n + g.items.filter((it) => isDone(it.id)).length, 0);

  return (
    <div className="detail">
      <div className="page-topbar">
        <button className="back-btn" onClick={() => router.push('/practice')}>
          ← Back to Practice
        </button>
        <ThemeToggle />
      </div>

      <div className="detail-head">
        <div className="detail-num mono">PRACTICE</div>
        <div className="detail-title">{group.label}</div>
        <div className="detail-progress">
          <div className="bar-bg">
            <div className="bar-fill" style={{ width: (total ? Math.round((solved / total) * 100) : 0) + '%' }} />
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
              <QuestionRow key={it.id} q={it.q} id={it.id} done={isDone(it.id)} onToggle={toggle} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
