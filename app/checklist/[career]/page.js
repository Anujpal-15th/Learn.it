'use client';

// Job-readiness checklist — not a guarantee of employment, just a rollup of
// which named skill areas are complete for this career, computed from the
// same topic/interview/project completion data as everything else.

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
        <div className="detail-num mono">JOB-READINESS CHECKLIST</div>
        <div className="detail-title">{career.label}</div>
        <div className="detail-sub">
          This is not a guarantee of employment — it's a checklist showing
          which learning areas you've completed toward {career.label}.
        </div>
        <div className="detail-progress">
          <div className="bar-bg">
            <div className="bar-fill" style={{ width: (items.length ? Math.round((doneCount / items.length) * 100) : 0) + '%' }} />
          </div>
          <span className="mono" style={{ fontSize: 12 }}>{doneCount}/{items.length} ready</span>
        </div>
        {error ? <div className="detail-error">{error}</div> : null}
      </div>

      <div className="readiness-list">
        {items.map((item) => (
          <div className={'readiness-item' + (item.done ? ' done' : '')} key={item.label}>
            <span className="readiness-check">{item.done ? '✓' : ''}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
