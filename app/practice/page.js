'use client';

// Practice: a hub of the roadmap's practice content, regrouped by subject.
// Subject tiles are UI-only groupings of each track's topics
// (lib/practice-groups.js), counted from the same per-topic practice
// questions the topic pages use. DSA, Interview and the Java reference
// lists link to their own banks.

import Link from 'next/link';
import { qid } from '@/lib/topics';
import { getRoadmap, getCareer, findTopicRoadmap } from '@/lib/roadmaps';
import { getPracticeGroups } from '@/lib/practice-groups';
import { useProgress } from '@/components/useProgress';
import AppNav from '@/components/AppNav';
import PageHeader from '@/components/PageHeader';
import PageEnter from '@/components/motion/PageEnter';
import Reveal from '@/components/motion/Reveal';
import ProgressBar from '@/components/motion/ProgressBar';
import AnimatedNumber from '@/components/motion/AnimatedNumber';

function groupCounts(group, progress) {
  let total = 0;
  let solved = 0;
  const titles = [];
  group.topicIds.forEach((tid) => {
    const { topic } = findTopicRoadmap(tid);
    if (!topic) return;
    titles.push(topic.title);
    topic.subtopics.forEach((s, si) => {
      s.q.forEach((q, qi) => {
        total++;
        if (progress[qid(tid, si, qi)]) solved++;
      });
    });
  });
  return { total, solved, titles };
}

const REFERENCE = [
  { href: '/algorithms', title: 'Algorithm List', desc: 'Named algorithms worth knowing.' },
  { href: '/backend-topics', title: 'Backend Topics', desc: 'A glossary of backend engineering.' },
  { href: '/networking', title: 'Networking', desc: 'The layer under every API call.' },
];

export default function PracticePage() {
  const { user, progress, meta, loading, setSelectedCareer } = useProgress();
  const careerId = meta.selectedCareer || null;
  const roadmap = careerId ? getRoadmap(careerId) : null;

  if (loading) {
    return (
      <>
        <AppNav loading />
        <main className="page" aria-busy="true" />
      </>
    );
  }

  if (!roadmap) {
    return (
      <>
        <AppNav user={user} careerId={null} active="practice" onCareerChange={setSelectedCareer} />
        <PageEnter>
          <PageHeader
            eyebrow="Practice"
            title="Pick your track"
            sub="Practice follows your roadmap. Choose a track from the switcher in the top bar."
          />
        </PageEnter>
      </>
    );
  }

  const career = getCareer(careerId);
  const hasDsa = roadmap.phases.some((p) => p.tier === 'dsa');
  const isJava = careerId === 'java-developer';

  return (
    <>
      <AppNav user={user} careerId={careerId} active="practice" onCareerChange={setSelectedCareer} />

      <PageEnter>
        <PageHeader
          eyebrow="Practice"
          title="Practice by subject"
          sub={`Every practice question in the ${career.label} roadmap, grouped by subject.`}
        />

        <Reveal className="tile-grid">
          {Object.entries(getPracticeGroups(careerId)).map(([key, group]) => {
            const { total, solved, titles } = groupCounts(group, progress);
            const pct = total ? Math.round((solved / total) * 100) : 0;
            return (
              <Link className="tile" href={'/practice/' + key} key={key}>
                <span className="tile-eyebrow">
                  {titles.length} topic{titles.length === 1 ? '' : 's'}
                </span>
                <span className="tile-title">{group.label}</span>
                <span className="tile-desc">{titles.join(' · ')}</span>
                <span className="tile-foot">
                  <ProgressBar value={pct} size="sm" label={group.label + ' progress'} />
                  <span className="tile-count">
                    <AnimatedNumber value={solved} />/{total}
                  </span>
                </span>
                <span className="row-go" aria-hidden="true">›</span>
              </Link>
            );
          })}

          {hasDsa ? (
            <Link className="tile" href="/leetcode">
              <span className="tile-eyebrow">Problem bank</span>
              <span className="tile-title">DSA</span>
              <span className="tile-desc">Every LeetCode problem in the roadmap, in one place.</span>
              <span className="row-go" aria-hidden="true">›</span>
            </Link>
          ) : null}

          <Link className="tile" href="/interview-questions">
            <span className="tile-eyebrow">Interview</span>
            <span className="tile-title">Interview Q&amp;A</span>
            <span className="tile-desc">Commonly asked {career.label} interview questions.</span>
            <span className="row-go" aria-hidden="true">›</span>
          </Link>
        </Reveal>

        {isJava ? (
          <>
            <h2 className="section-title">Reference</h2>
            <Reveal className="tile-grid">
              {REFERENCE.map((r) => (
                <Link className="tile tile-sm" href={r.href} key={r.href}>
                  <span className="tile-title">{r.title}</span>
                  <span className="tile-desc">{r.desc}</span>
                  <span className="row-go" aria-hidden="true">›</span>
                </Link>
              ))}
            </Reveal>
          </>
        ) : null}
      </PageEnter>
    </>
  );
}
