'use client';

// The Roadmap level of the guided flow: Career -> Roadmap -> Phase -> Topic.
// A career-scoped version of what used to be the whole dashboard — phase
// cards, milestone track, projects, capstone — plus the career gets
// persisted as the learner's selected career the moment they land here.

import { useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  topicSolved,
  topicComplete,
  phaseProjectKey,
  phaseProjectDone,
} from '@/lib/topics';
import { getRoadmap, getCareer } from '@/lib/roadmaps';
import { milestoneStats, roadmapStats, recommendNextTopic } from '@/lib/roadmap-engine';
import { useProgress } from '@/components/useProgress';
import ThemeToggle from '@/components/ThemeToggle';
import Logo from '@/components/Logo';

const gridVariants = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

export default function RoadmapPage() {
  const params = useParams();
  const router = useRouter();
  const careerId = params.career;
  const roadmap = getRoadmap(careerId);
  const career = getCareer(careerId);
  const { progress, meta, loading, error, isDone, toggle, setSelectedCareer } = useProgress();

  useEffect(() => {
    if (!loading && meta.selectedCareer !== careerId) {
      setSelectedCareer(careerId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, careerId]);

  const stats = useMemo(() => (roadmap ? roadmapStats(roadmap, progress) : null), [roadmap, progress]);
  const milestones = useMemo(() => (roadmap ? milestoneStats(roadmap, progress) : []), [roadmap, progress]);
  const recommendation = useMemo(() => (roadmap ? recommendNextTopic(roadmap, progress) : null), [roadmap, progress]);

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

  const capstoneKey = phaseProjectKey(roadmap.id, 'capstone');
  const capstoneDone = phaseProjectDone(roadmap.id, 'capstone', progress);

  return (
    <>
      <div className="topbar">
        <div className="brand">
          <Logo size={26} />
          <span className="mark">Learn.it</span>
          <span className="sub">{career.label}</span>
        </div>
        <div className="nav">
          <Link className="tab" href="/dashboard">Dashboard</Link>
          <Link className="tab" href={'/checklist/' + roadmap.id}>Readiness</Link>
          <Link className="tab" href="/search">Search</Link>
          <ThemeToggle />
        </div>
      </div>

      <motion.section
        className="hero"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="eyebrow">
          {roadmap.phases.length} phases · {roadmap.topics.length} topics · {career.label}
        </div>
        <h1 className="title">{career.label}</h1>
        <p className="hero-sub">{career.pitch}</p>

        <div className="ledger">
          <div className="cell">
            <div className="num">{stats.topicsCompleted}/{stats.topicsTotal}</div>
            <div className="lbl">Topics cleared</div>
          </div>
          <div className="cell">
            <div className="num">{stats.questionsSolved}/{stats.questionsTotal}</div>
            <div className="lbl">Questions solved</div>
          </div>
          <div className="cell">
            <div className="num">{stats.projectsCompleted}/{stats.projectsTotal}</div>
            <div className="lbl">Projects completed</div>
          </div>
          <div className="cell">
            <div className="num">{stats.pct}%</div>
            <div className="lbl">Overall progress</div>
          </div>
        </div>
      </motion.section>

      {recommendation ? (
        <div className="section-label"><span>Start here</span><div className="ln" /></div>
      ) : null}
      {recommendation ? (
        <div className="recommend-card" style={{ marginBottom: 8 }}>
          <div className="recommend-eyebrow">Recommended next</div>
          <div className="recommend-title">{recommendation.topic.title}</div>
          <div className="recommend-reason">{recommendation.reason}</div>
          <button
            className="btn-primary"
            style={{ marginTop: 14 }}
            onClick={() => router.push('/topic/' + recommendation.topic.id)}
          >
            Continue Learning
          </button>
        </div>
      ) : (
        <div className="recommend-card" style={{ marginBottom: 8 }}>
          <div className="recommend-eyebrow">Roadmap complete</div>
          <div className="recommend-title">Every topic is cleared.</div>
          <div className="recommend-reason">
            Check the readiness checklist and make sure the capstone is done too.
          </div>
        </div>
      )}

      <div className="section-label"><span>Milestones</span><div className="ln" /></div>
      <div className="milestone-track">
        {milestones.map((m) => (
          <div className={'milestone-row ' + m.state} key={m.index}>
            <span className="milestone-num mono">{String(m.index + 1).padStart(2, '0')}</span>
            <span className="milestone-name">
              {m.name} {m.done ? '✓' : m.state === 'upcoming' ? '🔒' : ''}
            </span>
            <div className="milestone-bar bar-bg">
              <div className="bar-fill" style={{ width: m.pct + '%' }} />
            </div>
            <span className="milestone-pct mono">{m.topicsCompleted}/{m.topicsTotal}</span>
          </div>
        ))}
      </div>

      <div className="section-label"><span>The Roadmap</span><div className="ln" /></div>

      <div>
        {roadmap.phases.map((ph, pi) => {
          const phaseTopics = byPhase[pi] || [];
          const phaseDone = phaseTopics.length > 0 && phaseTopics.every((t) => topicComplete(t, progress));
          const pp = roadmap.phaseProjects[pi];
          const ppKey = phaseProjectKey(roadmap.id, pi);
          const ppDone = phaseProjectDone(roadmap.id, pi, progress);
          return (
            <div className="phase" key={pi}>
              <div className="phase-head">
                <span className="phase-num mono">{String(pi + 1).padStart(2, '0')}</span>
                <span className="phase-title">{ph.name}</span>
              </div>
              <div className="phase-desc">{ph.desc}</div>
              {ph.learnMore ? (
                <a className="concept-more" href={ph.learnMore.url} target="_blank" rel="noopener noreferrer" style={{ marginBottom: 18, display: 'inline-block' }}>
                  {ph.learnMore.label} {'↗'}
                </a>
              ) : null}

              <motion.div className="topic-grid" variants={gridVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }}>
                {phaseTopics.map((top) => {
                  const { c, t } = topicSolved(top, progress);
                  const pct = t ? Math.round((c / t) * 100) : 0;
                  const complete = topicComplete(top, progress);
                  return (
                    <motion.div
                      className="card"
                      key={top.id}
                      variants={cardVariants}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 26 }}
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
                          {String(top.num).padStart(2, '0')} / {roadmap.topics.length}
                          {complete ? ' · Cleared' : ''}
                        </div>
                        <div className="ctitle">{top.title}</div>
                        <div className="cmeta">{top.subtopics.length} subtopics</div>
                      </div>
                      <div>
                        <div className="progress-row">
                          <div className="bar-bg">
                            <div className="bar-fill" style={{ width: pct + '%' }} />
                          </div>
                          <span className="ctag">{c}/{t}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {pp ? (
                  <motion.div
                    className="proj-card"
                    variants={cardVariants}
                    style={{ opacity: phaseDone || ppDone ? 1 : 0.6, cursor: 'pointer' }}
                    onClick={() => toggle(ppKey)}
                    role="button"
                    tabIndex={0}
                  >
                    <span className="proj-eyebrow">{ppDone ? 'Completed' : phaseDone ? 'Unlocked' : 'Unlocks when phase topics are cleared'}</span>
                    <div className="proj-title">{pp.title}{ppDone ? ' ✓' : ''}</div>
                    <div className="proj-desc">{pp.desc}</div>
                  </motion.div>
                ) : null}
              </motion.div>
            </div>
          );
        })}
      </div>

      <div className="capstone">
        <div className="capstone-box" onClick={() => toggle(capstoneKey)} role="button" tabIndex={0} style={{ cursor: 'pointer' }}>
          <div className="capstone-eyebrow">
            When every topic and project is cleared{capstoneDone ? ' — done!' : ''}
          </div>
          <div className="capstone-title">{roadmap.capstone.title}{capstoneDone ? ' ✓' : ''}</div>
          <div className="capstone-desc">{roadmap.capstone.desc}</div>
        </div>
      </div>

      {error ? <div className="detail-error" style={{ margin: '0 32px' }}>{error}</div> : null}

      <footer>Built for one engineer&rsquo;s climb — Meerut → production</footer>
    </>
  );
}
