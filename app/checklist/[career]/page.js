'use client';

// Learning-readiness checklist — explicitly NOT a job-readiness or
// employment signal. It's a rollup of which named skill areas are complete
// for this career vs. which still need work, computed from the same
// topic/interview/project completion data as everything else. Framed as
// "learning areas completed" / "recommended areas to strengthen" rather
// than "you are job-ready," on purpose — this app is a progress tracker,
// not an employment predictor.

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getRoadmap, getCareer } from '@/lib/roadmaps';
import { readinessChecklist } from '@/lib/roadmap-engine';
import { useProgress } from '@/components/useProgress';
import ThemeToggle from '@/components/ThemeToggle';

export default function ChecklistPage() {
  const params = useParams();
  const router = useRouter();
  const careerId = params.career;
  const roadmap = getRoadmap(careerId);
  const career = getCareer(careerId);
  const { progress, loading, error } = useProgress();

  const items = useMemo(() => readinessChecklist(careerId, progress), [careerId, progress]);
  const doneCount = items.filter((i) => i.done).length;
  const completed = items.filter((i) => i.done);
  const toStrengthen = items.filter((i) => !i.done);

  if (loading) {
    return (
      <main className="boot">
        <div className="eyebrow">Learn.it</div>
        <p className="sub">Loading…</p>
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
          <div className="detail-title">Checklist not found</div>
        </div>
      </div>
    );
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
        <div className="detail-num mono">LEARNING READINESS CHECKLIST</div>
        <div className="detail-title">{career.label}</div>
        <div className="detail-sub">
          This is not a guarantee of employment and it does not predict
          whether you'll get hired — it's a checklist of learning areas
          completed toward {career.label}, and which ones to strengthen next.
        </div>
        <div className="detail-progress">
          <div className="bar-bg">
            <div className="bar-fill" style={{ width: (items.length ? Math.round((doneCount / items.length) * 100) : 0) + '%' }} />
          </div>
          <span className="mono" style={{ fontSize: 12 }}>{doneCount}/{items.length} completed</span>
        </div>
        {error ? <div className="detail-error">{error}</div> : null}
      </div>

      <div className="sub-head">
        <span className="sub-title">Learning areas completed</span>
        <div className="sub-line" />
        <span className="sub-count mono">{completed.length}</span>
      </div>
      {completed.length ? (
        <div className="readiness-list" style={{ marginBottom: 32 }}>
          {completed.map((item) => (
            <div className="readiness-item done" key={item.label}>
              <span className="readiness-check">✓</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="hero-sub" style={{ marginBottom: 32 }}>None yet — every area below is still open.</p>
      )}

      <div className="sub-head">
        <span className="sub-title">Recommended areas to strengthen</span>
        <div className="sub-line" />
        <span className="sub-count mono">{toStrengthen.length}</span>
      </div>
      {toStrengthen.length ? (
        <div className="readiness-list">
          {toStrengthen.map((item) => (
            <div className="readiness-item" key={item.label}>
              <span className="readiness-check" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="hero-sub">Every learning area for {career.label} is complete.</p>
      )}
    </div>
  );
}
