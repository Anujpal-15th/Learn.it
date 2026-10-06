'use client';

// Topic detail — where the actual learning happens. Subtopics render as a
// stepper: only the current (first not-fully-done) one is expanded with its
// full Learn -> Practice content; completed ones collapse to a checked line,
// upcoming ones show closed. Quiz and the checkpoint project are the final
// two steps in the same stepper, so the whole page reads as one guided path
// instead of everything expanded at once.

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useReducedMotion } from 'motion/react';
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
import AppNav from '@/components/AppNav';
import PageHeader from '@/components/PageHeader';
import PageEnter from '@/components/motion/PageEnter';
import ProgressBar from '@/components/motion/ProgressBar';
import Collapse from '@/components/motion/Collapse';
import HereMarker from '@/components/motion/HereMarker';
import QuestionRow, { CheckMark } from '@/components/QuestionRow';
import PrereqBanner from '@/components/PrereqBanner';
import QuizBlock from '@/components/QuizBlock';
import styles from './topic.module.css';

// A topic uses the checklist layout (concept checklist + practice side by
// side) whenever its subtopics carry a checklist — true for every topic
// except the DSA phase's pattern-based topics, which are pure practice.
function isChecklistTopic(top) {
  return !!(top.subtopics[0] && top.subtopics[0].checklist);
}

const stripPhase = (name) => name.replace(/^Phase \d+ — /, '');
const titleCase = (s) => s.charAt(0) + s.slice(1).toLowerCase();

export default function TopicPage() {
  const params = useParams();
  const { roadmap, topic: top } = findTopicRoadmap(params.id);
  const { user, meta, progress, loading, error, isDone, toggle } = useProgress();

  if (loading) {
    return (
      <>
        <AppNav loading />
        <main className="page" aria-busy="true" />
      </>
    );
  }

  if (!top) {
    return (
      <>
        <AppNav user={user} careerId={meta.selectedCareer || null} active="roadmap" />
        <PageEnter>
          <PageHeader
            back={{ href: '/dashboard', label: 'Home' }}
            eyebrow="Topic"
            title="Topic not found"
            sub="That topic id doesn’t exist in either roadmap."
          />
        </PageEnter>
      </>
    );
  }

  // Keyed by topic so the open-step override resets when moving between topics.
  return (
    <>
      <AppNav user={user} careerId={roadmap.id} active="roadmap" />
      <TopicContent
        key={top.id}
        roadmap={roadmap}
        top={top}
        progress={progress}
        error={error}
        isDone={isDone}
        toggle={toggle}
      />
    </>
  );
}

function TopicContent({ roadmap, top, progress, error, isDone, toggle }) {
  const [override, setOverride] = useState(null);
  const headRefs = useRef([]);
  const lastOpen = useRef(null);
  const reduce = useReducedMotion();

  const { c, t } = topicSolved(top, progress);
  const meta = getTopicMeta(top.id);
  const gaps = prerequisiteGaps(top.id, progress);
  const projDone = projectDone(top.id, progress);
  const checklist = isChecklistTopic(top);
  const phase = roadmap.phases[top.phase];

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
  const quizAnswered = hasQuiz ? top.quiz.filter((_, qi) => isDone(quizKey(top.id, qi))).length : 0;
  const quizDone = hasQuiz && quizAnswered === top.quiz.length;

  // steps: every subtopic, then Quiz (if present), then the checkpoint
  // project — one flat sequence, one open step at a time.
  const quizIndex = top.subtopics.length;
  const stepCount = top.subtopics.length + (hasQuiz ? 1 : 0) + 1;
  const projectIndex = stepCount - 1;
  const firstUnfinishedSubtopic = top.subtopics.findIndex((_, si) => !subtopicDone(si));
  const defaultIndex =
    firstUnfinishedSubtopic !== -1
      ? firstUnfinishedSubtopic
      : hasQuiz && !quizDone
      ? quizIndex
      : projectIndex;
  const openIndex = override !== null ? override : defaultIndex;

  // When the open step changes and its head has scrolled up under the sticky
  // nav, bring it back into view once the collapse has finished (spec 3.6).
  // Skipped on first mount so the page never scrolls by itself on arrival.
  useEffect(() => {
    if (lastOpen.current === null || lastOpen.current === openIndex) {
      lastOpen.current = openIndex;
      return undefined;
    }
    lastOpen.current = openIndex;
    const timer = setTimeout(() => {
      const head = headRefs.current[openIndex];
      if (!head) return;
      const navH =
        parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64;
      const y = head.getBoundingClientRect().top;
      if (y < navH) {
        window.scrollTo({ top: window.scrollY + y - navH - 16, behavior: reduce ? 'auto' : 'smooth' });
      }
    }, 320);
    return () => clearTimeout(timer);
  }, [openIndex, reduce]);

  function toggleOpen(index) {
    setOverride(index === openIndex ? null : index);
  }

  // One step = a <button> head + a Collapse body. The open (unfinished) step
  // carries the page's single HereMarker. `body` is a function so only the
  // open step's content is built (a closing step keeps its last render while
  // it animates out).
  function renderStep(index, { title, done, count, body }) {
    const isOpen = openIndex === index;
    const bodyId = 'step-body-' + index;
    return (
      <div className={'step' + (done ? ' done' : '') + (isOpen ? ' open' : '')} key={index}>
        <button
          type="button"
          className="step-head"
          ref={(el) => {
            headRefs.current[index] = el;
          }}
          aria-label={title + (done ? ', complete' : '') + ', ' + count}
          aria-expanded={isOpen}
          aria-controls={bodyId}
          onClick={() => toggleOpen(index)}
        >
          <span className="step-status" aria-hidden="true">
            {done ? (
              <span className="dot dot-done">✓</span>
            ) : isOpen ? (
              <HereMarker />
            ) : (
              <span className="dot dot-upcoming" />
            )}
          </span>
          <span className="step-title">{title}</span>
          <span className="step-count mono">{count}</span>
        </button>
        <div id={bodyId}>
          <Collapse open={isOpen}>
            {isOpen ? <div className="step-body">{body()}</div> : null}
          </Collapse>
        </div>
      </div>
    );
  }

  function subtopicBody(s, si) {
    const doneC = s.q.filter((_, qi) => isDone(qid(top.id, si, qi))).length;
    const { c: clDone, t: clTotal } = checklistProgress(top, si, progress);
    return (
      <>
        {s.concepts ? (
          <div className="concept-block">
            <div className="concept-eyebrow">Why it matters</div>
            <ul className="concept-list">
              {s.concepts.map((cItem, ci) => (
                <li key={ci}>{cItem}</li>
              ))}
            </ul>
            {s.learnMore ? (
              <a
                className={'link-arrow ' + styles.more}
                href={s.learnMore.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.learnMore.label} <span aria-hidden="true">↗</span>
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
                  <button
                    key={id}
                    type="button"
                    className={'q-row ' + styles.rowButton + (cdone ? ' done' : '')}
                    aria-pressed={cdone}
                    onClick={() => toggle(id)}
                  >
                    <span className="q-check" aria-hidden="true">
                      <CheckMark done={cdone} />
                    </span>
                    <span className="q-text">{name}</span>
                  </button>
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
          <div className="actions">
            <button type="button" className="btn-ghost" onClick={() => setOverride(si + 1)}>
              Next: {top.subtopics[si + 1].title} <span aria-hidden="true">→</span>
            </button>
          </div>
        ) : null}
      </>
    );
  }

  const projectBody = () => (
    <>
      <button
        type="button"
        className={'mini-proj ' + styles.miniButton}
        aria-pressed={projDone}
        onClick={() => toggle(projectKey(top.id))}
      >
        <span className="mini-proj-flag">{projDone ? 'Completed' : 'Checkpoint'}</span>
        <span className={styles.miniText}>
          <span className="mini-proj-title">
            {top.mini.title}{projDone ? ' ✓' : ''}
          </span>
          <span className="mini-proj-desc">{top.mini.desc}</span>
        </span>
      </button>

      <div className="actions">
        {nextTopic ? (
          <Link className="btn-primary" href={'/topic/' + nextTopic.id}>
            Next topic: {nextTopic.title} <span aria-hidden="true">→</span>
          </Link>
        ) : (
          <Link className="btn-primary" href={'/roadmap/' + roadmap.id}>
            Back to roadmap
          </Link>
        )}
      </div>
    </>
  );

  return (
    <PageEnter>
      <PageHeader
        back={{ href: '/roadmap/' + roadmap.id, label: roadmap.label + ' roadmap' }}
        eyebrow={phase ? stripPhase(phase.name) : null}
        title={top.title}
      >
        <div className="meta-stack">
          <div className="meta-line">
            {c}/{t} done · {titleCase(meta.difficulty)} · ~{meta.estimatedTime}
          </div>
          <ProgressBar size="sm" value={t ? (c / t) * 100 : 0} label="Topic progress" />
        </div>
        {top.learnMore ? (
          <div className="actions">
            <a className="link-arrow" href={top.learnMore.url} target="_blank" rel="noopener noreferrer">
              {top.learnMore.label} <span aria-hidden="true">↗</span>
            </a>
          </div>
        ) : null}
        {error ? <div className="detail-error">{error}</div> : null}
        <PrereqBanner gaps={gaps} />
      </PageHeader>

      <div className="stepper">
        {top.subtopics.map((s, si) => {
          const doneC = s.q.filter((_, qi) => isDone(qid(top.id, si, qi))).length;
          const { c: clDone, t: clTotal } = checklistProgress(top, si, progress);
          return renderStep(si, {
            title: s.title,
            done: subtopicDone(si),
            count: checklist ? `${clDone}/${clTotal}` : `${doneC}/${s.q.length}`,
            body: () => subtopicBody(s, si),
          });
        })}

        {hasQuiz
          ? renderStep(quizIndex, {
              title: 'Quiz',
              done: quizDone,
              count: `${quizAnswered}/${top.quiz.length}`,
              body: () => <QuizBlock topic={top} isDone={isDone} toggle={toggle} />,
            })
          : null}

        {renderStep(projectIndex, {
          title: 'Complete & Continue',
          done: projDone,
          count: projDone ? 'done' : 'open',
          body: projectBody,
        })}
      </div>
    </PageEnter>
  );
}
