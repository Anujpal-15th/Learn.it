'use client';

// Topic detail — the Learn -> Practice -> Quiz -> Project step of the
// guided flow. Works for a topic from either roadmap (looked up via
// findTopicRoadmap, not a hardcoded TOPICS import), and adds the
// guided-learning layer on top of the original subtopic/practice/checkpoint
// content: a soft prerequisites banner, a quiz block, and mark-complete /
// next-topic navigation driven by the recommendation engine.

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  qid,
  topicSolved,
  checklistKey,
  checklistProgress,
  projectKey,
  projectDone,
} from '@/lib/topics';
import { findTopicRoadmap } from '@/lib/roadmaps';
import { prerequisiteGaps, recommendNextTopic } from '@/lib/roadmap-engine';
import { getTopicMeta } from '@/lib/roadmap-meta';
import { useProgress } from '@/components/useProgress';
import QuestionRow from '@/components/QuestionRow';
import ThemeToggle from '@/components/ThemeToggle';
import PrereqBanner from '@/components/PrereqBanner';
import QuizBlock from '@/components/QuizBlock';

// A topic uses the checklist layout (concept checklist + practice side by
// side) whenever its subtopics carry a checklist — true for every topic
// except the DSA phase's pattern-based topics, which are pure practice.
function isChecklistTopic(top) {
  return !!(top.subtopics[0] && top.subtopics[0].checklist);
}

export default function TopicPage() {
  const params = useParams();
  const router = useRouter();
  const { roadmap, topic: top } = findTopicRoadmap(params.id);
  const { progress, loading, error, isDone, toggle } = useProgress();

  if (loading) {
    return (
      <main className="boot">
        <div className="eyebrow">Learn.it</div>
        <p className="sub">Loading…</p>
      </main>
    );
  }

  if (!top) {
    return (
      <div className="detail">
        <button className="back-btn" onClick={() => router.push('/dashboard')}>
          ← Back to roadmap
        </button>
        <div className="detail-head">
          <div className="detail-title">Topic not found</div>
          <div className="detail-sub">That topic id doesn’t exist in either roadmap.</div>
        </div>
      </div>
    );
  }

  const TOTAL_TOPICS = roadmap.topics.length;
  const { c, t } = topicSolved(top, progress);
  const pct = t ? Math.round((c / t) * 100) : 0;
  const numStr = String(top.num).padStart(2, '0');
  const meta = getTopicMeta(top.id);
  const gaps = prerequisiteGaps(top.id, progress);
  const projDone = projectDone(top.id, progress);

  const recommendation = recommendNextTopic(roadmap, progress);
  const nextTopic =
    recommendation && recommendation.topic.id !== top.id ? recommendation.topic : null;

  return (
    <div className="detail">
      <div className="page-topbar">
        <button className="back-btn" onClick={() => router.push('/roadmap/' + roadmap.id)}>
          ← Back to roadmap
        </button>
        <ThemeToggle />
      </div>

      <div className="detail-layout">
        <aside className="detail-sidebar">
          <div className="sidebar-label">On this page</div>
          {top.subtopics.map((s, si) => {
            const checklist = isChecklistTopic(top);
            const navCount = checklist
              ? checklistProgress(top, si, progress)
              : { c: s.q.filter((_, qi) => isDone(qid(top.id, si, qi))).length, t: s.q.length };
            return (
              <a key={si} href={`#sub-${si}`} className="sidebar-link">
                <span>{s.title}</span>
                <span className="mono">{navCount.c}/{navCount.t}</span>
              </a>
            );
          })}
          {top.quiz && top.quiz.length ? (
            <a href="#quiz" className="sidebar-link">
              <span>Quiz</span>
            </a>
          ) : null}
        </aside>

        <div className="detail-main">
          <div className="detail-head">
            <div className="detail-num mono">TOPIC {numStr} / {TOTAL_TOPICS}</div>
            <div className="detail-title">{top.title}</div>
            <div className="detail-sub">{top.sub}</div>

            <div className="detail-progress" style={{ gap: 14, flexWrap: 'wrap' }}>
              <span className="ctag">Difficulty: {meta.difficulty}</span>
              <span className="ctag">Estimated time: {meta.estimatedTime}</span>
            </div>

            {top.learnMore ? (
              <a className="concept-more" href={top.learnMore.url} target="_blank" rel="noopener noreferrer" style={{ marginTop: 10, display: 'inline-block' }}>
                {top.learnMore.label} {'↗'}
              </a>
            ) : null}
            <div className="detail-progress">
              <div className="bar-bg">
                <div className="bar-fill" style={{ width: pct + '%' }} />
              </div>
              <span className="mono" style={{ fontSize: 12 }}>{c}/{t} solved</span>
            </div>
            {error ? <div className="detail-error">{error}</div> : null}

            <PrereqBanner gaps={gaps} />
          </div>

          {top.subtopics.map((s, si) => {
            const checklist = isChecklistTopic(top);
            const doneC = s.q.filter((_, qi) => isDone(qid(top.id, si, qi))).length;
            const { c: clDone, t: clTotal } = checklistProgress(top, si, progress);
            const headCount = checklist ? `${clDone}/${clTotal}` : `${doneC}/${s.q.length}`;

            const conceptBlock = s.concepts ? (
              <div className="concept-block">
                <div className="concept-eyebrow">What to learn</div>
                <ul className="concept-list">
                  {s.concepts.map((cItem, ci) => (
                    <li key={ci}>{cItem}</li>
                  ))}
                </ul>
                {s.learnMore ? (
                  <a className="concept-more" href={s.learnMore.url} target="_blank" rel="noopener noreferrer">
                    {s.learnMore.label} {'↗'}
                  </a>
                ) : null}
              </div>
            ) : null;

            const questionRows = s.q.map((q, qi) => {
              const id = qid(top.id, si, qi);
              return <QuestionRow key={id} q={q} id={id} done={isDone(id)} onToggle={toggle} />;
            });

            return (
              <div className="sub-block" id={`sub-${si}`} key={si}>
                <div className="sub-head">
                  <span className="sub-title">{s.title}</span>
                  <div className="sub-line" />
                  <span className="sub-count mono">{headCount}</span>
                </div>

                {conceptBlock}

                {checklist ? (
                  <div className="checklist-columns">
                    <div className="checklist-col">
                      <div className="col-label">Topics to learn <span className="mono">{clDone}/{clTotal}</span></div>
                      {(s.checklist || []).map((name, ci) => {
                        const id = checklistKey(top.id, si, ci);
                        const done = isDone(id);
                        return (
                          <motion.div
                            key={id}
                            className={'q-row' + (done ? ' done' : '')}
                            onClick={() => toggle(id)}
                            role="button"
                            tabIndex={0}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                toggle(id);
                              }
                            }}
                          >
                            <div className="q-check">{done ? '✓' : ''}</div>
                            <div className="q-text">{name}</div>
                          </motion.div>
                        );
                      })}
                    </div>
                    <div className="checklist-col">
                      <div className="col-label">Practice <span className="mono">{doneC}/{s.q.length}</span></div>
                      {questionRows}
                    </div>
                  </div>
                ) : (
                  questionRows
                )}
              </div>
            );
          })}

          {top.quiz && top.quiz.length ? (
            <div id="quiz">
              <QuizBlock topic={top} isDone={isDone} toggle={toggle} />
            </div>
          ) : null}

          <div
            className="mini-proj"
            onClick={() => toggle(projectKey(top.id))}
            role="button"
            tabIndex={0}
            style={{ cursor: 'pointer' }}
          >
            <div className="mini-proj-flag">{projDone ? 'Completed' : 'Checkpoint'}</div>
            <div>
              <div className="mini-proj-title">{top.mini.title}{projDone ? ' ✓' : ''}</div>
              <div className="mini-proj-desc">{top.mini.desc}</div>
            </div>
          </div>

          <div className="landing-cta" style={{ marginTop: 24 }}>
            {nextTopic ? (
              <button className="btn-primary landing-btn" onClick={() => router.push('/topic/' + nextTopic.id)}>
                Next Topic: {nextTopic.title} →
              </button>
            ) : (
              <button className="btn-primary landing-btn" onClick={() => router.push('/roadmap/' + roadmap.id)}>
                Back to Roadmap
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
