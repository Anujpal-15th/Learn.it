'use client';

// The Roadmap: answers exactly "where am I going, where am I now, what
// should I learn next" — nothing else. One row per topic, grouped by tier,
// status-coded (done/current/upcoming). Full topic detail (concepts,
// practice, quiz, project) lives on /topic/[id]; the project journey lives
// on /projects; this page used to duplicate both (a compact milestone list
// AND a full phase card per phase) — that duplication is what made it long.

import { useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { topicSolved, topicComplete } from '@/lib/topics';
import { getRoadmap, getCareer } from '@/lib/roadmaps';
import {
  tierSections,
  roadmapStats,
  recommendNextTopic,
  recommendDsaPractice,
  numberedPhaseCount,
} from '@/lib/roadmap-engine';
import { useProgress } from '@/components/useProgress';
import AppNav from '@/components/AppNav';

export default function RoadmapPage() {
  const params = useParams();
  const router = useRouter();
  const careerId = params.career;
  const roadmap = getRoadmap(careerId);
  const career = getCareer(careerId);
  const { user, progress, meta, loading, error, setSelectedCareer } = useProgress();

  useEffect(() => {
    if (!loading && meta.selectedCareer !== careerId) {
      setSelectedCareer(careerId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, careerId]);

  const stats = useMemo(() => (roadmap ? roadmapStats(roadmap, progress) : null), [roadmap, progress]);
  const sections = useMemo(() => (roadmap ? tierSections(roadmap, progress) : []), [roadmap, progress]);
  const recommendation = useMemo(() => (roadmap ? recommendNextTopic(roadmap, progress) : null), [roadmap, progress]);
  const dsaRecommendation = useMemo(() => (roadmap ? recommendDsaPractice(roadmap, progress) : null), [roadmap, progress]);

  const byPhase = useMemo(() => {
    if (!roadmap) return {};
    const map = {};
    roadmap.topics.forEach((t) => {
      (map[t.phase] = map[t.phase] || []).push(t);
    });
    return map;
  }, [roadmap]);

  if (loading) {
    return (
      <main className="boot">
        <div className="eyebrow">Learn.it</div>
        <p className="sub">Loading your roadmap…</p>
      </main>
    );
  }

  if (!roadmap || !career) {
    return (
      <div className="detail">
        <button className="back-btn" onClick={() => router.push('/dashboard')}>
          ← Back to dashboard
        </button>
        <div className="detail-head">
          <div className="detail-title">Roadmap not found</div>
          <div className="detail-sub">"{careerId}" isn't one of Learn.it's two career paths.</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <AppNav user={user} careerId={roadmap.id} active="roadmap" />

      <motion.section
        className="hero"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="eyebrow">
          {numberedPhaseCount(roadmap)} phases · {roadmap.topics.length} topics · {career.label}
        </div>
        <h1 className="title">{career.label}</h1>
        <p className="hero-sub">Your journey</p>

        <div className="ledger">
          <div className="cell">
            <div className="num">{stats.topicsCompleted}/{stats.topicsTotal}</div>
            <div className="lbl">Topics completed</div>
          </div>
          <div className="cell">
            <div className="num">{stats.pct}%</div>
            <div className="lbl">Overall progress</div>
          </div>
          {stats.dsaStats ? (
            <div className="cell">
              <div className="num">{stats.dsaStats.completed}/{stats.dsaStats.total}</div>
              <div className="lbl">DSA (parallel track)</div>
            </div>
          ) : null}
        </div>

        <p style={{ marginTop: 16 }}>
          <Link className="concept-more" href={'/checklist/' + roadmap.id}>Readiness checklist →</Link>
        </p>
      </motion.section>

      {recommendation ? (
        <div style={{ maxWidth: 1600, margin: '0 auto', padding: '0 32px' }}>
          <div className="recommend-card" style={{ marginBottom: 12 }}>
            <div className="recommend-eyebrow">Recommended next</div>
            <div className="recommend-title">{recommendation.topic.title}</div>
            <div className="recommend-reason">{recommendation.reason}</div>
            <button
              className="btn-primary"
              style={{ marginTop: 14, width: 'auto', padding: '10px 20px' }}
              onClick={() => router.push('/topic/' + recommendation.topic.id)}
            >
              Continue Learning
            </button>
          </div>
        </div>
      ) : null}

      {dsaRecommendation ? (
        <div style={{ maxWidth: 1600, margin: '0 auto', padding: '0 32px' }}>
          <div className="recommend-card" style={{ marginBottom: 32, borderColor: 'var(--faint)', background: 'var(--paper2)' }}>
            <div className="recommend-eyebrow">DSA practice (parallel — never blocks the path above)</div>
            <div className="recommend-title">{dsaRecommendation.topic.title}</div>
            <div className="recommend-reason">{dsaRecommendation.reason}</div>
            <button
              className="back-btn"
              style={{ marginTop: 14 }}
              onClick={() => router.push('/topic/' + dsaRecommendation.topic.id)}
            >
              Practice
            </button>
          </div>
        </div>
      ) : null}

      {sections.map((section) => (
        <div key={section.label || 'all'}>
          {section.label ? (
            <div className="section-label"><span>{section.label}</span><div className="ln" /></div>
          ) : null}

          <div className="roadmap-list" style={{ marginBottom: 32 }}>
            {section.phases.flatMap((m) =>
              (byPhase[m.index] || []).map((top) => {
                const { c, t } = topicSolved(top, progress);
                const complete = topicComplete(top, progress);
                const isCurrent = !complete && recommendation && recommendation.topic.id === top.id;
                return (
                  <div
                    key={top.id}
                    className={'roadmap-row' + (complete ? ' done' : '') + (isCurrent ? ' current' : '')}
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
                    <span className="roadmap-row-status">{complete ? '✓' : isCurrent ? '●' : '○'}</span>
                    <span className="roadmap-row-body">
                      <span className="roadmap-row-name">{top.title}</span>
                      {isCurrent ? <span className="roadmap-row-sub">{c}/{t} completed</span> : null}
                    </span>
                    <span className="roadmap-row-count mono">{c}/{t}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ))}

      <p style={{ textAlign: 'center', marginBottom: 40 }}>
        <Link className="concept-more" href="/projects">View the project journey →</Link>
      </p>

      {error ? <div className="detail-error" style={{ margin: '0 32px' }}>{error}</div> : null}

      <footer>Built for one engineer&rsquo;s climb — Meerut → production</footer>
    </>
  );
}
