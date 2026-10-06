'use client';

// Home — answers exactly one question: "what should I do now?" One primary
// action (Continue learning), one progress line, and an "Up next" pair of
// tiles (today's DSA practice, if the track has one, and the current
// project). Deliberately not a stats dashboard — the full breakdown lives on
// /roadmap, and the project journey on /projects. Shows a "pick your track"
// empty state until a career is picked.

import { useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CAREERS, getRoadmap } from '@/lib/roadmaps';
import { topicSolved } from '@/lib/topics';
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
import PageHeader from '@/components/PageHeader';
import PageEnter from '@/components/motion/PageEnter';
import Reveal from '@/components/motion/Reveal';
import AnimatedNumber from '@/components/motion/AnimatedNumber';
import ProgressBar from '@/components/motion/ProgressBar';
import TrackBackground from '@/components/motion/TrackBackground';

// Only ever rendered after useProgress finishes loading (always after
// hydration), so reading the clock here can't cause a hydration mismatch.
function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

const stripPhase = (name) => name.replace(/^Phase \d+ — /, '');

export default function Dashboard() {
  const router = useRouter();
  const { user, progress, meta, loading, setSelectedCareer } = useProgress();

  const careerId = meta.selectedCareer;
  const roadmap = careerId ? getRoadmap(careerId) : null;

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
      <>
        <AppNav loading />
        <main className="page" aria-busy="true" />
      </>
    );
  }

  const hello = `${greeting()}, ${(user && user.name) || 'there'}`;

  if (!roadmap) {
    return (
      <>
        <AppNav user={user} careerId={null} active="home" onCareerChange={setSelectedCareer} />
        <PageEnter>
          <PageHeader eyebrow={hello} title="Pick your track" sub="You can switch any time from the top bar." />
          <Reveal className="career-grid">
            {CAREERS.map((c) => (
              <CareerCard key={c.id} career={c} onStart={handlePickCareer} />
            ))}
          </Reveal>
        </PageEnter>
      </>
    );
  }

  const topicMeta = recommendation ? getTopicMeta(recommendation.topic.id) : null;
  const dsaSolved = dsaRecommendation ? topicSolved(dsaRecommendation.topic, progress) : null;

  return (
    <>
      <AppNav user={user} careerId={careerId} active="home" onCareerChange={setSelectedCareer} />

      <PageEnter>
        <PageHeader
          className="page-header-bg"
          eyebrow={hello}
          title={recommendation ? recommendation.topic.title : 'Every required topic is cleared.'}
          sub={currentSubtopicName ? `Next up: ${currentSubtopicName}` : null}
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={careerId}
              className="track-bg-fade"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <TrackBackground track={careerId} intensity="subtle" />
            </motion.div>
          </AnimatePresence>

          <div className="progress-line">
            <span><AnimatedNumber value={stats.pct} suffix="%" /></span>
            <span className="meta-line">
              {stats.topicsCompleted}/{stats.topicsTotal} topics
              {topicMeta ? ` · ~${topicMeta.estimatedTime} for this topic` : ''}
            </span>
            <ProgressBar value={stats.pct} label="Roadmap progress" />
          </div>

          <div className="actions">
            {recommendation ? (
              <Link className="btn-primary" href={'/topic/' + recommendation.topic.id}>
                Continue learning
              </Link>
            ) : (
              <Link className="btn-primary" href={'/checklist/' + roadmap.id}>
                View readiness checklist
              </Link>
            )}
            <Link className="link-arrow" href={'/roadmap/' + roadmap.id}>
              View roadmap <span aria-hidden="true">→</span>
            </Link>
          </div>
        </PageHeader>

        {dsaRecommendation || project ? (
          <>
            <h2 className="section-title">Up next</h2>
            <Reveal className="tile-grid tile-grid-2">
              {dsaRecommendation ? (
                <Link className="tile" href={'/topic/' + dsaRecommendation.topic.id}>
                  <div className="tile-eyebrow">Today&rsquo;s DSA practice</div>
                  <div className="tile-title">{dsaRecommendation.topic.title}</div>
                  <div className="tile-desc">{dsaRecommendation.reason}</div>
                  <div className="tile-foot">
                    <ProgressBar
                      size="sm"
                      value={dsaSolved.t ? (dsaSolved.c / dsaSolved.t) * 100 : 0}
                      label="DSA topic progress"
                    />
                    <span className="tile-count">{dsaSolved.c}/{dsaSolved.t}</span>
                  </div>
                  <span className="row-go" aria-hidden="true">›</span>
                </Link>
              ) : null}
              {project ? (
                <Link className="tile" href="/projects">
                  <div className="tile-eyebrow">
                    {project.done ? 'Project completed' : 'Current project'} · {stripPhase(project.phaseName)}
                  </div>
                  <div className="tile-title">
                    {project.project.title.replace('Phase Project — ', '')}
                    {project.done ? ' ✓' : ''}
                  </div>
                  <div className="tile-desc">{project.project.desc}</div>
                  <span className="row-go" aria-hidden="true">›</span>
                </Link>
              ) : null}
            </Reveal>
          </>
        ) : null}
      </PageEnter>
    </>
  );
}
