'use client';

// Topic detail (Phase 4). Shows every subtopic, its checkable question rows,
// and the checkpoint project. Toggling is optimistic and persisted via the
// shared useProgress hook.

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { TOPICS, qid, topicSolved, checklistKey, checklistProgress } from '@/lib/topics';
import { useProgress } from '@/components/useProgress';
import QuestionRow from '@/components/QuestionRow';
import ThemeToggle from '@/components/ThemeToggle';

const TOTAL_TOPICS = TOPICS.length;

// Phase 1 (DSA) is genuine solve-this-problem practice — a single column of
// checkable questions, since its subtopics are already named patterns.
// Everything else (Phase 0 language foundations, Phase 2 onward) shows a
// checklist of concept names as the primary content, with the existing
// practice questions alongside as secondary/reference material.
function isChecklistPhase(phase) {
  return phase !== 1;
}

export default function TopicPage() {
  const params = useParams();
  const router = useRouter();
  const top = TOPICS.find((t) => t.id === params.id);
  const { progress, loading, error, isDone, toggle } = useProgress();

  if (loading) {
    return (
      <main className="boot">
        <div className="eyebrow">The Ledger</div>
        <p className="sub">Loading…</p>
      </main>
    );
  }

  if (!top) {
    return (
      <div className="detail">
        <button className="back-btn" onClick={() => router.push('/')}>
          ← Back to roadmap
        </button>
        <div className="detail-head">
          <div className="detail-title">Topic not found</div>
          <div className="detail-sub">That topic id doesn’t exist in the roadmap.</div>
        </div>
      </div>
    );
  }

  const { c, t } = topicSolved(top, progress);
  const pct = t ? Math.round((c / t) * 100) : 0;
  const numStr = String(top.num).padStart(2, '0');

  return (
    <div className="detail">
      <div className="page-topbar">
        <button className="back-btn" onClick={() => router.push('/')}>
          ← Back to roadmap
        </button>
        <ThemeToggle />
      </div>

      <div className="detail-layout">
        <aside className="detail-sidebar">
          <div className="sidebar-label">On this page</div>
          {top.subtopics.map((s, si) => {
            const checklist = isChecklistPhase(top.phase);
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
        </aside>

        <div className="detail-main">
          <div className="detail-head">
            <div className="detail-num mono">TOPIC {numStr} / {TOTAL_TOPICS}</div>
            <div className="detail-title">{top.title}</div>
            <div className="detail-sub">{top.sub}</div>
            {top.learnMore ? (
              <a
                className="concept-more"
                href={top.learnMore.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginTop: 10, display: 'inline-block' }}
              >
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
          </div>

          {top.subtopics.map((s, si) => {
            const checklist = isChecklistPhase(top.phase);
            const doneC = s.q.filter((_, qi) => isDone(qid(top.id, si, qi))).length;
            const { c: clDone, t: clTotal } = checklistProgress(top, si, progress);
            const headCount = checklist ? `${clDone}/${clTotal}` : `${doneC}/${s.q.length}`;

            const conceptBlock = s.concepts ? (
              <div className="concept-block">
                <div className="concept-eyebrow">What to learn</div>
                <ul className="concept-list">
                  {s.concepts.map((c, ci) => (
                    <li key={ci}>{c}</li>
                  ))}
                </ul>
                {s.learnMore ? (
                  <a
                    className="concept-more"
                    href={s.learnMore.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {s.learnMore.label} {'↗'}
                  </a>
                ) : null}
              </div>
            ) : null;

            const questionRows = s.q.map((q, qi) => {
              const id = qid(top.id, si, qi);
              return (
                <QuestionRow key={id} q={q} id={id} done={isDone(id)} onToggle={toggle} />
              );
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

          <div className="mini-proj">
            <div className="mini-proj-flag">Checkpoint</div>
            <div>
              <div className="mini-proj-title">{top.mini.title}</div>
              <div className="mini-proj-desc">{top.mini.desc}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
