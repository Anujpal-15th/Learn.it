'use client';

// Topic detail (Phase 4). Shows every subtopic, its checkable question rows,
// and the checkpoint project. Toggling is optimistic and persisted via the
// shared useProgress hook.

import { useParams, useRouter } from 'next/navigation';
import { TOPICS, qid, topicSolved } from '@/lib/topics';
import { useProgress } from '@/components/useProgress';
import QuestionRow from '@/components/QuestionRow';

const TOTAL_TOPICS = TOPICS.length;

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
      <button className="back-btn" onClick={() => router.push('/')}>
        ← Back to roadmap
      </button>

      <div className="detail-head">
        <div className="detail-num mono">TOPIC {numStr} / {TOTAL_TOPICS}</div>
        <div className="detail-title">{top.title}</div>
        <div className="detail-sub">{top.sub}</div>
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
        return (
          <div className="sub-block" key={si}>
            <div className="sub-head">
              <span className="sub-title">{s.title}</span>
              <div className="sub-line" />
              <span className="sub-count mono">{doneC}/{s.q.length}</span>
            </div>
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
