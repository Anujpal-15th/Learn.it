'use client';

// Home — answers exactly one question: "what should I do now?" One primary
// action (Continue Learning), a compact progress line, and the project
// currently in front of the learner. Deliberately not a stats dashboard —
// the full breakdown lives on /roadmap, and the project journey on
// /projects. Shows a "choose your path" empty state until a career is picked.

import { useMemo } from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CAREERS, getRoadmap, getCareer } from '@/lib/roadmaps';
import {
  roadmapStats,
  recommendNextTopic,
  recommendDsaPractice,
  currentSubtopicIndex,
  currentProject,
} from '@/lib/roadmap-engine';
import { getTopicMeta } from '@/lib/roadmap-meta';
import { useProgress } from '@/components/useProgress';
import AppNav from '@/components/AppNav';
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

  const careerId = meta.selectedCareer;
  const roadmap = careerId ? getRoadmap(careerId) : null;
  const career = careerId ? getCareer(careerId) : null;

  const stats = useMemo(() => (roadmap ? roadmapStats(roadmap, progress) : null), [roadmap, progress]);
  const recommendation = useMemo(() => (roadmap ? recommendNextTopic(roadmap, progress) : null), [roadmap, progress]);
  const dsaRecommendation = useMemo(() => (roadmap ? recommendDsaPractice(roadmap, progress) : null), [roadmap, progress]);
  const project = useMemo(() => (roadmap ? currentProject(roadmap, progress) : null), [roadmap, progress]);

  const currentSubtopicName = useMemo(() => {
    if (!recommendation) return null;
    const si = currentSubtopicIndex(recommendation.topic, progress);
    const sub = recommendation.topic.subtopics[si];
    return sub ? sub.title : null;
  }, [recommendation, progress]);

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

  if (!roadmap) {
    return (
      <>
        <AppNav user={user} active="home" />
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
        <footer>Built for one engineer&rsquo;s climb — Meerut → production</footer>
      </>
    );
  }

  const meta2 = recommendation ? getTopicMeta(recommendation.topic.id) : null;

  return (
    <>
      <AppNav user={user} careerId={careerId} active="home" />

      <motion.section
        className="hero"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="eyebrow">{greeting()}, {user.name || 'there'}</div>

        {recommendation ? (
          <>
            <h1 className="title">{recommendation.topic.title}</h1>
            {currentSubtopicName ? <p className="hero-sub" style={{ marginTop: 6 }}>{currentSubtopicName}</p> : null}

            <div className="detail-progress" style={{ maxWidth: 420, marginTop: 22, gap: 14, flexWrap: 'wrap' }}>
              <span className="ctag">{stats.pct}% of roadmap</span>
              {meta2 ? <span className="ctag">~{meta2.estimatedTime}</span> : null}
            </div>

            <div className="landing-cta" style={{ marginTop: 22 }}>
              <button className="btn-primary landing-btn" onClick={() => router.push('/topic/' + recommendation.topic.id)}>
                Continue Learning
              </button>
              <Link className="back-btn" href={'/roadmap/' + roadmap.id}>
                Full roadmap
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="title">Every required topic is cleared.</h1>
            <div className="landing-cta" style={{ marginTop: 22 }}>
              <Link className="btn-primary landing-btn" href={'/checklist/' + roadmap.id}>
                View readiness checklist
              </Link>
            </div>
          </>
        )}
      </motion.section>

      <div className="ledger" style={{ marginTop: -8, marginBottom: 32 }}>
        <div className="cell">
          <div className="num">{stats.topicsCompleted}/{stats.topicsTotal}</div>
          <div className="lbl">Topics</div>
        </div>
        <div className="cell">
          <div className="num">{stats.pct}%</div>
          <div className="lbl">Roadmap progress</div>
        </div>
      </div>

      {dsaRecommendation ? (
        <div style={{ maxWidth: 1600, margin: '0 auto', padding: '0 32px 24px' }}>
          <div className="recommend-card" style={{ borderColor: 'var(--faint)', background: 'var(--paper2)' }}>
            <div className="recommend-eyebrow">Today's DSA practice (parallel track)</div>
            <div className="recommend-title">{dsaRecommendation.topic.title}</div>
            <div className="recommend-reason">{dsaRecommendation.reason}</div>
            <button className="back-btn" style={{ marginTop: 14 }} onClick={() => router.push('/topic/' + dsaRecommendation.topic.id)}>
              Practice
            </button>
          </div>
        </div>
      ) : null}

      {project ? (
        <div style={{ maxWidth: 1600, margin: '0 auto', padding: '0 32px 48px' }}>
          <div className="section-label" style={{ padding: 0, marginBottom: 12 }}>
            <span>Current project</span>
            <div className="ln" />
          </div>
          <div
            className="proj-card"
            style={{ gridColumn: 'unset', cursor: 'pointer' }}
            onClick={() => router.push('/projects')}
            role="button"
            tabIndex={0}
          >
            <span className="proj-eyebrow">{project.done ? 'Completed' : project.phaseName}</span>
            <div className="proj-title">{project.project.title.replace('Phase Project — ', '')}{project.done ? ' ✓' : ''}</div>
            <div className="proj-desc">{project.project.desc}</div>
          </div>
        </div>
      ) : null}

      <p style={{ textAlign: 'center', marginBottom: 40 }}>
        <Link className="concept-more" href="/">Working on the other path too? Start it from the homepage →</Link>
      </p>

      <footer>Built for one engineer&rsquo;s climb — Meerut → production</footer>
    </>
  );
}
