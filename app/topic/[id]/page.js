'use client';

// Topic detail — where the actual learning happens. Subtopics render as a
// stepper: only the current (first not-fully-done) one is expanded with its
// full Learn -> Practice content; completed ones collapse to a checked line,
// upcoming ones show closed. Quiz and the checkpoint project are the final
// two steps in the same stepper, so the whole page reads as one guided path
// instead of everything expanded at once.

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  qid,
  topicSolved,
  checklistKey,
  checklistProgress,
  projectKey,
  projectDone,
  quizKey,
} from '@/lib/topics';
import { findTopicRoadmap } from '@/lib/roadmaps';
import { prerequisiteGaps, recommendNextFrom } from '@/lib/roadmap-engine';
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
  const [override, setOverride] = useState(null);

  useEffect(() => {
    setOverride(null);
  }, [top && top.id]);

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

  const { c, t } = topicSolved(top, progress);
  const meta = getTopicMeta(top.id);
  const gaps = prerequisiteGaps(top.id, progress);
  const projDone = projectDone(top.id, progress);
  const checklist = isChecklistTopic(top);

  const recommendation = recommendNextFrom(roadmap, top, progress);
  const nextTopic =
    recommendation && recommendation.topic.id !== top.id ? recommendation.topic : null;

  function subtopicDone(si) {
    const s = top.subtopics[si];
    const questDone = s.q.filter((_, qi) => isDone(qid(top.id, si, qi))).length;
    if (s.checklist) {
      const { c: clDone, t: clTotal } = checklistProgress(top, si, progress);
      return clTotal > 0 && clDone === clTotal && questDone === s.q.length;
    }
    return s.q.length > 0 && questDone === s.q.length;
  }

  const hasQuiz = !!(top.quiz && top.quiz.length);
  const quizDone = hasQuiz && top.quiz.every((_, qi) => isDone(quizKey(top.id, qi)));

  // steps: every subtopic, then Quiz (if present), then the checkpoint
  // project — one flat sequence, one open step at a time.
  const stepCount = top.subtopics.length + (hasQuiz ? 1 : 0) + 1;
  const firstUnfinishedSubtopic = top.subtopics.findIndex((_, si) => !subtopicDone(si));
  const defaultIndex =
    firstUnfinishedSubtopic !== -1
      ? firstUnfinishedSubtopic
      : hasQuiz && !quizDone
      ? top.subtopics.length
      : stepCount - 1;
  const openIndex = override !== null ? override : defaultIndex;

  function stepAt(index) {
    if (index < top.subtopics.length) return { type: 'subtopic', si: index };
    if (hasQuiz && index === top.subtopics.length) return { type: 'quiz' };
    return { type: 'project' };
  }

  function toggleOpen(index) {
    setOverride(index === openIndex ? null : index);
  }

  return (
    <div className="detail">
      <div className="page-topbar">
        <button className="back-btn" onClick={() => router.push('/roadmap/' + roadmap.id)}>
          ← Back to roadmap
        </button>
        <ThemeToggle />
      </div>

      <div className="detail-head">
        <div className="detail-num mono">{c}/{t} COMPLETED</div>
        <div className="detail-title">{top.title}</div>

        <div className="detail-progress" style={{ gap: 14, flexWrap: 'wrap' }}>
          <span className="ctag">Difficulty: {meta.difficulty}</span>
          <span className="ctag">Estimated time: {meta.estimatedTime}</span>
        </div>

        {top.learnMore ? (
          <a className="concept-more" href={top.learnMore.url} target="_blank" rel="noopener noreferrer" style={{ marginTop: 10, display: 'inline-block' }}>
            {top.learnMore.label} {'↗'}
          </a>
        ) : null}
        {error ? <div className="detail-error">{error}</div> : null}

        <PrereqBanner gaps={gaps} />
      </div>

      <div className="stepper">
        {top.subtopics.map((s, si) => {
          const done = subtopicDone(si);
          const isOpen = openIndex === si;
          const doneC = s.q.filter((_, qi) => isDone(qid(top.id, si, qi))).length;
          const { c: clDone, t: clTotal } = checklistProgress(top, si, progress);
          const headCount = checklist ? `${clDone}/${clTotal}` : `${doneC}/${s.q.length}`;

          return (
            <div className={'step' + (done ? ' done' : '') + (isOpen ? ' open' : '')} key={si}>
              <div className="step-head" onClick={() => toggleOpen(si)} role="button" tabIndex={0}>
                <span className="step-status">{done ? '✓' : isOpen ? '●' : '○'}</span>
                <span className="step-title">{s.title}</span>
                <span className="step-count mono">{headCount}</span>
              </div>

              {isOpen ? (
                <div className="step-body">
                  {s.concepts ? (
                    <div className="concept-block">
                      <div className="concept-eyebrow">Why it matters</div>
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
                  ) : null}

                  {checklist ? (
                    <div className="checklist-columns">
                      <div className="checklist-col">
                        <div className="col-label">Topics to learn <span className="mono">{clDone}/{clTotal}</span></div>
                        {(s.checklist || []).map((name, ci) => {
                          const id = checklistKey(top.id, si, ci);
                          const cdone = isDone(id);
                          return (
                            <motion.div
                              key={id}
                              className={'q-row' + (cdone ? ' done' : '')}
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
                              <div className="q-check">{cdone ? '✓' : ''}</div>
                              <div className="q-text">{name}</div>
                            </motion.div>
                          );
                        })}
                      </div>
                      <div className="checklist-col">
                        <div className="col-label">Practice <span className="mono">{doneC}/{s.q.length}</span></div>
                        {s.q.map((q, qi) => {
                          const id = qid(top.id, si, qi);
                          return <QuestionRow key={id} q={q} id={id} done={isDone(id)} onToggle={toggle} />;
                        })}
                      </div>
                    </div>
                  ) : (
                    s.q.map((q, qi) => {
                      const id = qid(top.id, si, qi);
                      return <QuestionRow key={id} q={q} id={id} done={isDone(id)} onToggle={toggle} />;
                    })
                  )}

                  {si < top.subtopics.length - 1 ? (
                    <button
                      className="btn-primary"
                      style={{ width: 'auto', padding: '10px 20px', marginTop: 8 }}
                      onClick={() => setOverride(si + 1)}
                    >
                      Next: {top.subtopics[si + 1].title} →
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })}

        {hasQuiz ? (
          <div className={'step' + (quizDone ? ' done' : '') + (openIndex === top.subtopics.length ? ' open' : '')}>
            <div className="step-head" onClick={() => toggleOpen(top.subtopics.length)} role="button" tabIndex={0}>
              <span className="step-status">{quizDone ? '✓' : openIndex === top.subtopics.length ? '●' : '○'}</span>
              <span className="step-title">Quiz</span>
              <span className="step-count mono">
                {top.quiz.filter((_, qi) => isDone(quizKey(top.id, qi))).length}/{top.quiz.length}
              </span>
            </div>
            {openIndex === top.subtopics.length ? (
              <div className="step-body">
                <QuizBlock topic={top} isDone={isDone} toggle={toggle} />
              </div>
            ) : null}
          </div>
        ) : null}

        <div className={'step' + (projDone ? ' done' : '') + (openIndex === stepCount - 1 ? ' open' : '')}>
          <div className="step-head" onClick={() => toggleOpen(stepCount - 1)} role="button" tabIndex={0}>
            <span className="step-status">{projDone ? '✓' : openIndex === stepCount - 1 ? '●' : '○'}</span>
            <span className="step-title">Complete &amp; Continue</span>
            <span className="step-count mono">{projDone ? 'done' : 'open'}</span>
          </div>
          {openIndex === stepCount - 1 ? (
            <div className="step-body">
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
          ) : null}
        </div>
      </div>
    </div>
  );
}
