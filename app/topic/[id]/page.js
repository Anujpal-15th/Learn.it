'use client';

// Topic detail (Phase 4). Shows every subtopic, its checkable question rows,
// and the checkpoint project. Toggling is optimistic and persisted via the
// shared useProgress hook.

import { useParams, useRouter } from 'next/navigation';
import { TOPICS, qid, topicSolved, subtopicProgress } from '@/lib/topics';
import { useProgress } from '@/components/useProgress';
import QuestionRow from '@/components/QuestionRow';

const TOTAL_TOPICS = TOPICS.length;

// Phase 0 (Language & Foundations) and Phase 1 (DSA) are genuine
// solve-this-problem practice — kept fully question-by-question checkable.
// Phase 2 onward is framework/infra/frontend material where a beginner
// mainly needs "have I learned this concept yet?" — those topics get one
// checkbox per subtopic instead, with the practice items still listed below
// as reference (and still individually checkable, if wanted).
function isChecklistPhase(phase) {
  return phase >= 2;
}

export default function TopicPage() {
  const params = useParams();
  const router = useRouter();
  const top = TOPICS.find((t) => t.id === params.id);
  const { progress, loading, error, isDone, toggle, toggleMany } = useProgress();

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
      <button className="back-btn" onClick={() => router.push('/')}>
        ← Back to roadmap
      </button>

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
        const doneC = s.q.filter((_, qi) => isDone(qid(top.id, si, qi))).length;
        const checklist = isChecklistPhase(top.phase);
        const { allDone } = subtopicProgress(top, si, progress);
        const subIds = s.q.map((_, qi) => qid(top.id, si, qi));

        return (
          <div className="sub-block" key={si}>
            <div
              className={'sub-head' + (checklist ? ' sub-head-checkable' : '')}
              onClick={checklist ? () => toggleMany(subIds) : undefined}
              role={checklist ? 'button' : undefined}
              tabIndex={checklist ? 0 : undefined}
              onKeyDown={
                checklist
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleMany(subIds);
                      }
                    }
                  : undefined
              }
            >
              {checklist ? (
                <div className={'q-check' + (allDone ? ' sub-check-done' : '')}>
                  {allDone ? '✓' : ''}
                </div>
              ) : null}
              <span className="sub-title">{s.title}</span>
              <div className="sub-line" />
              <span className="sub-count mono">{doneC}/{s.q.length}</span>
            </div>

            {s.concepts ? (
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
            ) : null}

            {s.q.map((q, qi) => {
              const id = qid(top.id, si, qi);
              return (
                <QuestionRow
                  key={id}
                  q={q}
                  id={id}
                  done={isDone(id)}
                  onToggle={toggle}
                />
              );
            })}
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
  );
}
