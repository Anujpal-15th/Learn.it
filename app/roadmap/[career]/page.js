'use client';

// The Roadmap: answers exactly "where am I going, where am I now, what
// should I learn next" — nothing else. One row per topic, grouped by tier,
// status-coded (done/current/upcoming) on a scroll spine. Full topic detail
// (concepts, practice, quiz, project) lives on /topic/[id]; the project
// journey lives on /projects.

import { useEffect, useMemo, useRef } from 'react';
import { useParams } from 'next/navigation';
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
import PageHeader from '@/components/PageHeader';
import PageEnter from '@/components/motion/PageEnter';
import ListItem from '@/components/motion/ListItem';
import AnimatedNumber from '@/components/motion/AnimatedNumber';
import ProgressBar from '@/components/motion/ProgressBar';
import HereMarker from '@/components/motion/HereMarker';
import ScrollSpine from '@/components/motion/ScrollSpine';

const stripPhase = (name) => name.replace(/^Phase \d+ — /, '');

// One labelled list of topic rows with its own spine.
function RoadmapSection({ label, topics, progress, currentId, todayId }) {
  const listRef = useRef(null);
  return (
    <>
      <h2 className="section-title">{label}</h2>
      <div className="roadmap-list" ref={listRef}>
        <ScrollSpine targetRef={listRef} />
        {topics.map((top, i) => {
          const { c, t } = topicSolved(top, progress);
          const complete = topicComplete(top, progress);
          const isCurrent = !complete && top.id === currentId;
          const isToday = !complete && top.id === todayId;
          const state = complete ? 'done' : isCurrent ? 'current topic' : isToday ? "today's DSA practice" : 'not done';
          return (
            <ListItem
              key={top.id}
              index={i}
              as={Link}
              href={'/topic/' + top.id}
              className={'roadmap-row' + (complete ? ' done' : '') + (isCurrent ? ' current' : '')}
              aria-label={`${top.title}, ${state}, ${c} of ${t} practice items`}
            >
              <span className="roadmap-row-status" aria-hidden="true">
                {complete ? (
                  <span className="dot dot-done">✓</span>
                ) : isCurrent ? (
                  <HereMarker />
                ) : (
                  <span className="dot dot-upcoming" />
                )}
              </span>
              <span className="roadmap-row-body">
                <span className="roadmap-row-name">{top.title}</span>
              </span>
              {isCurrent ? <span className="pill">Continue <span aria-hidden="true">→</span></span> : null}
              {isToday ? <span className="tag">Today</span> : null}
              <span className="roadmap-row-count mono">{c}/{t}</span>
              <span className="row-go" aria-hidden="true">›</span>
            </ListItem>
          );
        })}
      </div>
    </>
  );
}

export default function RoadmapPage() {
  const params = useParams();
  const careerId = params.career;
  const roadmap = getRoadmap(careerId);
  const career = getCareer(careerId);
  const { user, progress, meta, loading, error, setSelectedCareer } = useProgress();

  useEffect(() => {
    if (!loading && roadmap && meta.selectedCareer !== careerId) {
      setSelectedCareer(careerId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, careerId]);

  const stats = useMemo(() => (roadmap ? roadmapStats(roadmap, progress) : null), [roadmap, progress]);
  const recommendation = useMemo(() => (roadmap ? recommendNextTopic(roadmap, progress) : null), [roadmap, progress]);
  const dsaRecommendation = useMemo(() => (roadmap ? recommendDsaPractice(roadmap, progress) : null), [roadmap, progress]);

  // [{ label, topics }] — one group per tier. A roadmap with no tiers at all
  // (label null) falls back to one group per phase, named after the phase.
  const groups = useMemo(() => {
    if (!roadmap) return [];
    const topicsOf = (phaseIndex) => roadmap.topics.filter((t) => t.phase === phaseIndex);
    return tierSections(roadmap, progress).flatMap((section) =>
      section.label
        ? [{ label: section.label, topics: section.phases.flatMap((m) => topicsOf(m.index)) }]
        : section.phases.map((m) => ({ label: stripPhase(roadmap.phases[m.index].name), topics: topicsOf(m.index) }))
    ).filter((g) => g.topics.length > 0);
  }, [roadmap, progress]);

  if (loading) {
    return (
      <>
        <AppNav loading />
        <main className="page" aria-busy="true" />
      </>
    );
  }

  if (!roadmap || !career) {
    return (
      <>
        <AppNav user={user} careerId={meta.selectedCareer || null} active="roadmap" />
        <PageEnter>
          <PageHeader
            back={{ href: '/dashboard', label: 'Home' }}
            eyebrow="Roadmap"
            title="Roadmap not found"
            sub={`"${careerId}" isn't one of Learn.it's two career paths.`}
          />
        </PageEnter>
      </>
    );
  }

  const progressMeta =
    `${stats.topicsCompleted}/${stats.topicsTotal} topics` +
    (stats.dsaStats ? ` · DSA ${stats.dsaStats.completed}/${stats.dsaStats.total}` : '');

  return (
    <>
      <AppNav user={user} careerId={roadmap.id} active="roadmap" />

      <PageEnter>
        <PageHeader
          eyebrow={`${numberedPhaseCount(roadmap)} phases · ${roadmap.topics.length} topics`}
          title={career.label}
          aside={
            <Link className="link-arrow" href={'/checklist/' + roadmap.id}>
              Readiness checklist <span aria-hidden="true">→</span>
            </Link>
          }
        >
          <div className="progress-line">
            <span><AnimatedNumber value={stats.pct} suffix="%" /></span>
            <span className="meta-line">{progressMeta}</span>
            <ProgressBar value={stats.pct} label="Roadmap progress" />
          </div>
          {error ? <div className="detail-error">{error}</div> : null}
        </PageHeader>

        {groups.map((g) => (
          <RoadmapSection
            key={g.label}
            label={g.label}
            topics={g.topics}
            progress={progress}
            currentId={recommendation ? recommendation.topic.id : null}
            todayId={dsaRecommendation ? dsaRecommendation.topic.id : null}
          />
        ))}

        <Link className="link-arrow" href="/projects">
          View the project journey <span aria-hidden="true">→</span>
        </Link>
      </PageEnter>
    </>
  );
}
