'use client';

// A single Practice subject: every practice question from that subject's
// topics, grouped by topic. Groups resolve across both careers, so a deep
// link to the other track's subject still works.

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { qid } from '@/lib/topics';
import { findTopicRoadmap } from '@/lib/roadmaps';
import { findPracticeGroup } from '@/lib/practice-groups';
import { useProgress } from '@/components/useProgress';
import AppNav from '@/components/AppNav';
import PageHeader from '@/components/PageHeader';
import QuestionRow from '@/components/QuestionRow';
import PageEnter from '@/components/motion/PageEnter';
import ListItem from '@/components/motion/ListItem';
import ProgressBar from '@/components/motion/ProgressBar';
import AnimatedNumber from '@/components/motion/AnimatedNumber';

const BACK = { href: '/practice', label: 'Practice' };

function buildBank(group) {
  const groups = [];
  group.topicIds.forEach((tid) => {
    const { topic } = findTopicRoadmap(tid);
    if (!topic) return;
    const items = [];
    topic.subtopics.forEach((s, si) => {
      s.q.forEach((q, qi) => items.push({ q, id: qid(topic.id, si, qi) }));
    });
    if (items.length) groups.push({ topic, items });
  });
  return groups;
}

export default function PracticeGroupPage() {
  const params = useParams();
  const router = useRouter();
  const { user, meta, loading, error, isDone, toggle, setSelectedCareer } = useProgress();
  const found = findPracticeGroup(params.group);
  const group = found ? found.group : null;
  const groups = useMemo(() => (group ? buildBank(group) : []), [group]);
  // The subject's own track drives the switcher, so a deep link into the
  // other track's subject shows that track (and switching away works).
  const careerId = found ? found.careerId : meta.selectedCareer || null;

  // Switching to the track that doesn't own this subject goes back to the
  // hub. Await the save so /practice loads the new career, not the old one.
  async function onCareerChange(id) {
    await setSelectedCareer(id);
    if (!found || id !== found.careerId) router.push('/practice');
  }

  if (loading) {
    return (
      <>
        <AppNav loading />
        <main className="page" aria-busy="true" />
      </>
    );
  }

  const nav = <AppNav user={user} careerId={careerId} active="practice" onCareerChange={onCareerChange} />;

  if (!group) {
    return (
      <>
        {nav}
        <PageEnter>
          <PageHeader
            back={BACK}
            eyebrow="Practice"
            title="Not found"
            sub={`"${params.group}" isn't a practice subject.`}
          />
        </PageEnter>
      </>
    );
  }

  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const solved = groups.reduce((n, g) => n + g.items.filter((it) => isDone(it.id)).length, 0);
  const pct = total ? Math.round((solved / total) * 100) : 0;

  return (
    <>
      {nav}
      <PageEnter>
        <PageHeader back={BACK} eyebrow="Practice" title={group.label}>
          <div className="progress-line">
            <span>
              <AnimatedNumber value={pct} suffix="%" />
            </span>
            <span className="meta-line">{solved}/{total} solved</span>
            <ProgressBar value={pct} label={group.label + ' progress'} />
          </div>
          {error ? <div className="detail-error" role="alert">{error}</div> : null}
        </PageHeader>

        {groups.map((g, i) => {
          const doneC = g.items.filter((it) => isDone(it.id)).length;
          return (
            <ListItem as="section" index={i} className="sub-block" key={g.topic.id}>
              <div className="sub-head">
                <h2 className="bank-group-title">{g.topic.title}</h2>
                <div className="sub-line" />
                <span className="sub-count mono">{doneC}/{g.items.length}</span>
              </div>
              {g.items.map((it) => (
                <QuestionRow key={it.id} q={it.q} id={it.id} done={isDone(it.id)} onToggle={toggle} />
              ))}
            </ListItem>
          );
        })}
      </PageEnter>
    </>
  );
}
