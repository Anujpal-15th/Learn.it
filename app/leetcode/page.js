'use client';

// LeetCode bank. A focused view of every real LeetCode problem in the Java
// roadmap, grouped by topic. Derived from lib/topics.js, not a separate data
// set, so checking a problem here and on its topic page is the same state.

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { TOPICS, qid } from '@/lib/topics';
import { useProgress } from '@/components/useProgress';
import AppNav from '@/components/AppNav';
import PageHeader from '@/components/PageHeader';
import QuestionRow from '@/components/QuestionRow';
import PageEnter from '@/components/motion/PageEnter';
import ListItem from '@/components/motion/ListItem';
import ProgressBar from '@/components/motion/ProgressBar';
import AnimatedNumber from '@/components/motion/AnimatedNumber';

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
  const { user, meta, loading, error, isDone, toggle, setSelectedCareer } = useProgress();
  const groups = useMemo(buildBank, []);

  // Java-only page: switching to another track goes back to the hub. Await
  // the save so /practice loads the new career.
  async function onCareerChange(id) {
    await setSelectedCareer(id);
    if (id !== 'java-developer') router.push('/practice');
  }

  if (loading) {
    return (
      <>
        <AppNav loading />
        <main className="page" aria-busy="true" />
      </>
    );
  }

  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const solved = groups.reduce((n, g) => n + g.items.filter((it) => isDone(it.id)).length, 0);
  const pct = total ? Math.round((solved / total) * 100) : 0;

  return (
    <>
      <AppNav user={user} careerId={meta.selectedCareer || null} active="practice" onCareerChange={onCareerChange} />

      <PageEnter>
        <PageHeader
          back={{ href: '/practice', label: 'Practice' }}
          eyebrow="DSA"
          title="LeetCode bank"
          sub="Every LeetCode problem in the roadmap, in one place. Checking one here updates its topic too."
        >
          <div className="progress-line">
            <span>
              <AnimatedNumber value={pct} suffix="%" />
            </span>
            <span className="meta-line">{solved}/{total} solved</span>
            <ProgressBar value={pct} label="LeetCode progress" />
          </div>
          {error ? <div className="detail-error" role="alert">{error}</div> : null}
        </PageHeader>

        {groups.map((g, i) => {
          const doneC = g.items.filter((it) => isDone(it.id)).length;
          return (
            <ListItem as="section" index={i} className="sub-block" key={g.topic.id}>
              <div className="sub-head">
                <h2 className="bank-group-title">{g.topic.title}</h2>
                <div className="sub-line" />
                <span className="sub-count mono">{doneC}/{g.items.length}</span>
              </div>
              {g.items.map((it) => (
                <QuestionRow key={it.id} q={it.q} id={it.id} done={isDone(it.id)} onToggle={toggle} />
              ))}
            </ListItem>
          );
        })}
      </PageEnter>
    </>
  );
}
