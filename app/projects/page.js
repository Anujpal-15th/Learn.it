'use client';

// Projects: the project built alongside each phase, grouped by the same
// tiers the roadmap uses (TIER_SECTIONS order), then the capstone. Java
// keeps its friendlier arc names; other tiers use the TIER_SECTIONS label.

import { Fragment, useMemo } from 'react';
import Link from 'next/link';
import { topicComplete, phaseProjectKey, phaseProjectDone } from '@/lib/topics';
import { getRoadmap } from '@/lib/roadmaps';
import { TIER_SECTIONS } from '@/lib/roadmap-engine';
import { useProgress } from '@/components/useProgress';
import AppNav from '@/components/AppNav';
import PageHeader from '@/components/PageHeader';
import PageEnter from '@/components/motion/PageEnter';
import ListItem from '@/components/motion/ListItem';
import Reveal from '@/components/motion/Reveal';
import styles from './projects.module.css';

const ARC_LABELS = {
  'core-foundations': 'Early Exercises',
  dsa: 'DSA Track',
  backend: 'The Core Build',
  'production-advanced': 'Production Hardening',
  'system-design': 'System Design',
  optional: 'Optional Extensions',
};

const STATE_LABEL = { done: 'Done', ready: 'Ready', locked: 'Locked' };

export default function ProjectsPage() {
  const { user, progress, meta, loading, error, toggle, setSelectedCareer } = useProgress();
  const careerId = meta.selectedCareer || null;
  const roadmap = careerId ? getRoadmap(careerId) : null;

  const byPhase = useMemo(() => {
    const map = {};
    if (roadmap) roadmap.topics.forEach((t) => (map[t.phase] = map[t.phase] || []).push(t));
    return map;
  }, [roadmap]);

  const arcs = useMemo(() => {
    if (!roadmap) return [];
    return TIER_SECTIONS.map(({ tier, label }) => ({
      tier,
      label: ARC_LABELS[tier] || label,
      phases: roadmap.phases
        .map((p, i) => i)
        .filter((i) => roadmap.phases[i].tier === tier && roadmap.phaseProjects[i]),
    })).filter((a) => a.phases.length > 0);
  }, [roadmap]);

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
        <AppNav user={user} careerId={null} active="projects" onCareerChange={setSelectedCareer} />
        <PageEnter>
          <PageHeader
            eyebrow="Projects"
            title="Pick your track"
            sub="Projects follow your roadmap. Choose a track from the switcher in the top bar."
          />
        </PageEnter>
      </>
    );
  }

  const capstoneKey = phaseProjectKey(roadmap.id, 'capstone');
  const capstoneDone = phaseProjectDone(roadmap.id, 'capstone', progress);

  return (
    <>
      <AppNav user={user} careerId={careerId} active="projects" onCareerChange={setSelectedCareer} />

      <PageEnter>
        <PageHeader
          eyebrow="Projects"
          title="What you'll build"
          sub="The project you build alongside each phase of the roadmap."
        >
          {error ? <div className="detail-error" role="alert">{error}</div> : null}
        </PageHeader>

        {arcs.map((arc) => (
          <Fragment key={arc.tier}>
            <h2 className="section-title">{arc.label}</h2>
            <div className="timeline">
              {arc.phases.map((pi, i) => {
                const pp = roadmap.phaseProjects[pi];
                const phaseTopics = byPhase[pi] || [];
                const phaseDone = phaseTopics.length > 0 && phaseTopics.every((t) => topicComplete(t, progress));
                const state = phaseProjectDone(roadmap.id, pi, progress) ? 'done' : phaseDone ? 'ready' : 'locked';
                const first = phaseTopics[0];
                return (
                  <ListItem
                    key={pi}
                    index={i}
                    as={first ? Link : 'div'}
                    href={first ? '/topic/' + first.id : undefined}
                    className={'timeline-row ' + state}
                  >
                    <span className="timeline-status" aria-hidden="true">
                      {state === 'done' ? (
                        <span className="dot dot-done">✓</span>
                      ) : (
                        <span className={'dot ' + (state === 'ready' ? 'dot-ready' : 'dot-upcoming')} />
                      )}
                    </span>
                    <span className="timeline-body">
                      <span className="timeline-title">
                        {pp.title.replace(/^(Phase Project|Optional Project) — /, '')}
                      </span>
                      <span className="timeline-desc">{pp.desc}</span>
                    </span>
                    <span className="timeline-state">{STATE_LABEL[state]}</span>
                    {first ? <span className="row-go" aria-hidden="true">›</span> : null}
                  </ListItem>
                );
              })}
            </div>
          </Fragment>
        ))}

        <Reveal className="capstone">
          <div className="capstone-box">
            <div className="capstone-eyebrow">Capstone · when every topic and project is cleared</div>
            <h2 className="capstone-title">{roadmap.capstone.title}</h2>
            <p className="capstone-desc">{roadmap.capstone.desc}</p>
            <div className={'actions ' + styles.capstoneActions}>
              <button type="button" className="btn-ghost" onClick={() => toggle(capstoneKey)}>
                {capstoneDone ? 'Completed ✓' : 'Mark complete'}
              </button>
            </div>
          </div>
        </Reveal>
      </PageEnter>
    </>
  );
}
