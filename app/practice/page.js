'use client';

// Practice — "Can I actually do this?" A hub of existing practice content
// regrouped by subject instead of scattered across 5 separate nav items.
// No new questions: Java/SQL/Spring Boot/System Design are filtered views
// over the same per-topic practice questions already in topics.js (same
// derivation /leetcode already used); DSA and Interview just link to the
// existing, unchanged /leetcode and /interview-questions pages.

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TOPICS, qid } from '@/lib/topics';
import { getRoadmap } from '@/lib/roadmaps';
import { PRACTICE_GROUPS } from '@/lib/practice-groups';
import { useProgress } from '@/components/useProgress';
import AppNav from '@/components/AppNav';

function groupCounts(group, progress) {
  let total = 0;
  let solved = 0;
  group.topicIds.forEach((tid) => {
    const top = TOPICS.find((t) => t.id === tid);
    if (!top) return;
    top.subtopics.forEach((s, si) => {
      s.q.forEach((q, qi) => {
        total++;
        if (progress && progress[qid(tid, si, qi)]) solved++;
      });
    });
  });
  return { total, solved };
}

export default function PracticePage() {
  const router = useRouter();
  const { user, progress, meta, loading } = useProgress();
  const careerId = meta.selectedCareer;
  const roadmap = careerId ? getRoadmap(careerId) : null;
  const hasDsa = !!(roadmap && roadmap.topics.some((t) => t.phase !== undefined && roadmap.phases[t.phase] && roadmap.phases[t.phase].tier === 'dsa'));
  const isJavaTrack = careerId === 'java-developer';

  if (loading) {
    return (
      <main className="boot">
        <div className="eyebrow">Learn.it</div>
        <p className="sub">Loading…</p>
      </main>
    );
  }

  if (!careerId) {
    return (
      <>
        <AppNav user={user} active="practice" />
        <div className="detail">
          <div className="detail-head">
            <div className="detail-title">Pick a career first</div>
            <div className="detail-sub">Practice is scoped to your roadmap.</div>
            <div className="landing-cta" style={{ marginTop: 20 }}>
              <Link className="btn-primary landing-btn" href="/dashboard">Go to Home</Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AppNav user={user} careerId={careerId} active="practice" />

      <div className="detail">
        <div className="detail-head">
          <div className="detail-num mono">PRACTICE</div>
          <div className="detail-title">Can I actually do this?</div>
          <div className="detail-sub">Every practice question in the roadmap, grouped by subject.</div>
        </div>

        <div className="practice-grid">
          {isJavaTrack &&
            Object.entries(PRACTICE_GROUPS).map(([key, group]) => {
              const { total, solved } = groupCounts(group, progress);
              return (
                <div
                  className="card"
                  key={key}
                  onClick={() => router.push('/practice/' + key)}
                  role="button"
                  tabIndex={0}
                >
                  <div>
                    <div className="ctitle">{group.label}</div>
                    <div className="cmeta">{group.topicIds.length} topic{group.topicIds.length === 1 ? '' : 's'}</div>
                  </div>
                  <div className="progress-row">
                    <div className="bar-bg">
                      <div className="bar-fill" style={{ width: (total ? Math.round((solved / total) * 100) : 0) + '%' }} />
                    </div>
                    <span className="ctag">{solved}/{total}</span>
                  </div>
                </div>
              );
            })}

          {hasDsa ? (
            <div className="card" onClick={() => router.push('/leetcode')} role="button" tabIndex={0}>
              <div>
                <div className="ctitle">DSA</div>
                <div className="cmeta">Every LeetCode problem in the roadmap</div>
              </div>
              <div className="cmeta">Open the bank →</div>
            </div>
          ) : null}

          <div className="card" onClick={() => router.push('/interview-questions')} role="button" tabIndex={0}>
            <div>
              <div className="ctitle">Interview</div>
              <div className="cmeta">Commonly-asked questions, both tracks</div>
            </div>
            <div className="cmeta">Open Interview Q&amp;A →</div>
          </div>
        </div>

        {isJavaTrack ? (
          <p style={{ marginTop: 32 }}>
            <span className="sidebar-label" style={{ display: 'inline' }}>Also see: </span>
            <Link className="concept-more" href="/algorithms">Algorithm List</Link>
            {' · '}
            <Link className="concept-more" href="/backend-topics">Backend Topics</Link>
            {' · '}
            <Link className="concept-more" href="/networking">Networking</Link>
          </p>
        ) : null}
      </div>

      <footer>Built for one engineer&rsquo;s climb — Meerut → production</footer>
    </>
  );
}
