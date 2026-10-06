'use client';

// Public landing page (spec section 4). One track at a time, picked with the
// top-bar switcher: hero (animated track background) -> how it works -> that
// track's path -> one closing CTA -> footer.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import AppNav from '@/components/AppNav';
import TrackBackground from '@/components/motion/TrackBackground';
import Reveal from '@/components/motion/Reveal';
import ListItem from '@/components/motion/ListItem';
import AnimatedNumber from '@/components/motion/AnimatedNumber';
import { CAREERS, getCareer, getRoadmap } from '@/lib/roadmaps';
import { numberedPhaseCount, tierSections } from '@/lib/roadmap-engine';
import s from './Landing.module.css';

const COPY = {
  'java-developer': {
    line1: 'Become a Java backend engineer.',
    line2: 'One topic at a time.',
    sub: 'A guided path from Java fundamentals through Spring Boot, databases, and system design, with DSA practice alongside.',
  },
  'ai-engineer': {
    line1: 'Become an AI engineer.',
    line2: 'Python to production agents.',
    sub: 'A guided path from Python and math through deep learning, LLMs, RAG, and agents, with a real project at every phase.',
  },
};

const STEPS = [
  { n: '01', name: 'Learn', text: 'One topic at a time, broken into small steps.' },
  { n: '02', name: 'Practice', text: 'Curated problems and a quiz for every topic.' },
  { n: '03', name: 'Build', text: 'A project at every phase, then a capstone.' },
];

const EASE_OUT = [0.16, 1, 0.3, 1];
const stripPhase = (name) => name.replace(/^Phase \d+ — /, '');

export default function LandingPage() {
  const [me, setMe] = useState(undefined); // undefined = checking, null = logged out
  const [track, setTrack] = useState('java-developer');
  // Until the saved track is read, AppNav gets no careerId so it can't write
  // the Java default over the learner's saved track.
  const [resolved, setResolved] = useState(false);
  // The load-time swap to the saved track is instant; only a user's own
  // switch cross-fades the hero copy.
  const [userSwitched, setUserSwitched] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (alive) setMe(json && json.user ? json.user : null);
      })
      .catch(() => {
        if (alive) setMe(null);
      });
    return () => {
      alive = false;
    };
  }, []);

  // Saved track priority: this browser's localStorage, else (logged in) the
  // account's saved career, else Java. `resolved` stays false until we know,
  // so AppNav never persists a guess over the real track.
  const [hasLocal, setHasLocal] = useState(null);
  useEffect(() => {
    let ok = false;
    try {
      const saved = localStorage.getItem('learnit-track');
      if (getCareer(saved)) {
        setTrack(saved);
        ok = true;
      }
    } catch {}
    setHasLocal(ok);
  }, []);

  useEffect(() => {
    if (hasLocal === null || me === undefined) return;
    if (hasLocal || !me) {
      setResolved(true);
      return;
    }
    let alive = true;
    fetch('/api/progress')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const saved = data && data.meta && data.meta.selectedCareer;
        if (alive && getCareer(saved)) setTrack(saved);
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setResolved(true);
      });
    return () => {
      alive = false;
    };
  }, [hasLocal, me]);

  function handleTrack(id) {
    setUserSwitched(true);
    setTrack(id);
  }

  const career = getCareer(track);
  const roadmap = getRoadmap(track);
  const sections = tierSections(roadmap, {});

  const cta = me ? (
    <Link className="btn-primary" href={'/roadmap/' + track}>
      Continue on {career.label} <span aria-hidden="true">→</span>
    </Link>
  ) : (
    <Link className="btn-primary" href={'/signup?career=' + track}>
      Start the {career.label} roadmap
    </Link>
  );

  return (
    <>
      <AppNav user={me} careerId={resolved ? track : null} onCareerChange={handleTrack} />

      <main>
        <section className={s.hero}>
          {resolved ? (
            <AnimatePresence>
              <motion.div
                key={track}
                className="track-bg-fade"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <TrackBackground track={track} intensity="full" />
              </motion.div>
            </AnimatePresence>
          ) : null}

          <div className={s.heroInner}>
            {/* Both tracks' copy share one grid cell, so the block is always
                as tall as the taller one: switching never shifts the layout. */}
            <div className={s.copyStack}>
              {CAREERS.map((c) => {
                const on = c.id === track;
                const copy = COPY[c.id];
                return (
                  <motion.div
                    key={c.id}
                    className={s.copy}
                    aria-hidden={on ? undefined : true}
                    initial={false}
                    animate={{ opacity: on ? 1 : 0, y: on ? 0 : -6 }}
                    transition={
                      userSwitched
                        ? on
                          ? { duration: 0.25, delay: 0.15, ease: EASE_OUT }
                          : { duration: 0.15, ease: EASE_OUT }
                        : { duration: 0 }
                    }
                  >
                    <div className="eyebrow">{c.label} track</div>
                    <h1 className={s.title}>
                      {copy.line1}
                      <br />
                      <span className={s.accent}>{copy.line2}</span>
                    </h1>
                    <p className={s.sub}>{copy.sub}</p>
                  </motion.div>
                );
              })}
            </div>

            <p className={s.stats + ' mono'}>
              <AnimatedNumber value={numberedPhaseCount(roadmap)} /> phases ·{' '}
              <AnimatedNumber value={roadmap.topics.length} /> topics ·{' '}
              <AnimatedNumber value={roadmap.phaseProjects.length + 1} /> projects
            </p>

            <div className={s.actions}>
              {cta}
              <p className={s.note}>Free. Progress saves to your account.</p>
            </div>
          </div>
        </section>

        <Reveal as="section" className={s.section} aria-labelledby="how-title">
          <h2 id="how-title" className={s.sectionTitle}>
            How it works
          </h2>
          <ol className={s.steps}>
            {STEPS.map((step) => (
              <li key={step.n} className={s.step}>
                <span className={s.stepNum}>{step.n}</span>
                <span className={s.stepName}>{step.name}</span>
                <span className={s.stepText}>{step.text}</span>
              </li>
            ))}
          </ol>
        </Reveal>

        <section className={s.section} aria-labelledby="path-title">
          <h2 id="path-title" className={s.sectionTitle}>
            The {career.label} path
          </h2>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={track}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {sections.map((section) => (
                <div key={section.tier || 'all'} className={s.group}>
                  {section.label ? <h3 className={s.groupTitle}>{section.label}</h3> : null}
                  <ol className={s.items}>
                    {section.phases.map((m, i) => {
                      const phase = roadmap.phases[m.index];
                      return (
                        <ListItem key={m.index} index={i} as="li" className={s.item}>
                          <span className={s.num} aria-hidden="true">
                            {phase.numbered === false ? '+' : String(m.index + 1).padStart(2, '0')}
                          </span>
                          <span>{stripPhase(phase.name)}</span>
                        </ListItem>
                      );
                    })}
                  </ol>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </section>

        <Reveal as="section" className={s.closing}>
          <p className={s.closingLine}>Ready when you are.</p>
          {cta}
        </Reveal>
      </main>

      <footer>Built for one engineer&rsquo;s climb — Meerut → production</footer>
    </>
  );
}
