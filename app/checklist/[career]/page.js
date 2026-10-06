'use client';

// Learning-readiness checklist — explicitly NOT a job-readiness or
// employment signal. It's a rollup of which named skill areas are complete
// for this career vs. which still need work, computed from the same
// topic/interview/project completion data as everything else. Framed as
// "covered" / "to strengthen" rather than "you are job-ready," on purpose —
// this app is a progress tracker, not an employment predictor.

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { getRoadmap, getCareer } from '@/lib/roadmaps';
import { readinessChecklist, readinessGates } from '@/lib/roadmap-engine';
import { useProgress } from '@/components/useProgress';
import AppNav from '@/components/AppNav';
import PageHeader from '@/components/PageHeader';
import PageEnter from '@/components/motion/PageEnter';
import ListItem from '@/components/motion/ListItem';
import AnimatedNumber from '@/components/motion/AnimatedNumber';
import ProgressBar from '@/components/motion/ProgressBar';
import styles from './checklist.module.css';

function ItemList({ items, done }) {
  return (
    <ul className="readiness-list">
      {items.map((item, i) => (
        <ListItem as="li" index={i} className={'readiness-item' + (done ? ' done' : '')} key={item.label}>
          <span className="readiness-check" aria-hidden="true">{done ? '✓' : ''}</span>
          <span>{item.label}</span>
        </ListItem>
      ))}
    </ul>
  );
}

export default function ChecklistPage() {
  const params = useParams();
  const careerId = params.career;
  const roadmap = getRoadmap(careerId);
  const career = getCareer(careerId);
  const { user, meta, progress, loading, error } = useProgress();

  const items = useMemo(() => readinessChecklist(careerId, progress), [careerId, progress]);
  // Named career-readiness gates — readinessGates() returns null for any
  // roadmap without the Java tiers (AI Engineer), so the section only renders
  // when it's non-null.
  const gates = useMemo(() => (roadmap ? readinessGates(roadmap, progress) : null), [roadmap, progress]);
  const completed = items.filter((i) => i.done);
  const toStrengthen = items.filter((i) => !i.done);
  const pct = items.length ? Math.round((completed.length / items.length) * 100) : 0;

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
          <PageHeader back={{ href: '/dashboard', label: 'Home' }} eyebrow="Readiness" title="Checklist not found" />
        </PageEnter>
      </>
    );
  }

  return (
    <>
      <AppNav user={user} careerId={roadmap.id} active="roadmap" />

      <PageEnter>
        <PageHeader
          back={{ href: '/roadmap/' + roadmap.id, label: career.label + ' roadmap' }}
          eyebrow="Readiness"
          title="What you’ve covered"
          sub="A learning checklist, not a hiring prediction."
        >
          <div className="progress-line">
            <span><AnimatedNumber value={pct} suffix="%" /></span>
            <span className="meta-line">{completed.length}/{items.length} learning areas covered</span>
            <ProgressBar value={pct} label="Checklist progress" />
          </div>
          {error ? <div className="detail-error">{error}</div> : null}
        </PageHeader>

        {gates ? (
          <>
            <h2 className="section-title">Career readiness gates</h2>
            <div className="gate-list">
              {Object.values(gates).map((gate) => (
                <div className="gate-row" key={gate.label}>
                  <span>{gate.label}{gate.done ? ' ✓' : ''}</span>
                  <ProgressBar
                    size="sm"
                    value={gate.total ? (gate.completed / gate.total) * 100 : 0}
                    label={gate.label}
                  />
                  <span className="meta-line">{gate.completed}/{gate.total}</span>
                </div>
              ))}
            </div>
          </>
        ) : null}

        <div className={'cols-2' + (gates ? ' ' + styles.columns : '')}>
          <section>
            <h2 className="section-title">Covered</h2>
            {completed.length ? (
              <ItemList items={completed} done />
            ) : (
              <p className={styles.empty}>None yet — every area is still open.</p>
            )}
          </section>
          <section>
            <h2 className="section-title">To strengthen</h2>
            {toStrengthen.length ? (
              <ItemList items={toStrengthen} done={false} />
            ) : (
              <p className={styles.empty}>Every learning area for {career.label} is complete.</p>
            )}
          </section>
        </div>
      </PageEnter>
    </>
  );
}
