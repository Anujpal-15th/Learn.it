'use client';

// Projects — "Can I build something?" Surfaces the existing
// PHASE_PROJECTS + CAPSTONE data honestly: it's not one clean line, it's a
// real arc — early standalone exercises, then a core build that deepens
// (Bookstore -> Task API -> Booking API -> the E-Commerce Backend capstone
// of the backend journey), hardened through production, then split into
// services for the system-design projects, then optional side quests, then
// the Capstone. Grouped by the same tier every other page already uses —
// no new data, nothing invented.

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { topicComplete, phaseProjectKey, phaseProjectDone } from '@/lib/topics';
import { getRoadmap } from '@/lib/roadmaps';
import { useProgress } from '@/components/useProgress';
import AppNav from '@/components/AppNav';
import Link from 'next/link';

const ARC_LABELS = {
  'core-foundations': 'Early Exercises',
  dsa: 'DSA Track',
  backend: 'The Core Build',
  'production-advanced': 'Production Hardening',
  'system-design': 'System Design',
  optional: 'Optional Extensions',
};
const ARC_ORDER = ['core-foundations', 'dsa', 'backend', 'production-advanced', 'system-design', 'optional'];

export default function ProjectsPage() {
  const router = useRouter();
  const { user, progress, meta, loading, toggle } = useProgress();
  const careerId = meta.selectedCareer;
  const roadmap = careerId ? getRoadmap(careerId) : null;

  const byPhase = useMemo(() => {
    if (!roadmap) return {};
    const map = {};
    roadmap.topics.forEach((t) => {
      (map[t.phase] = map[t.phase] || []).push(t);
    });
    return map;
  }, [roadmap]);

  const arcs = useMemo(() => {
    if (!roadmap) return [];
    const hasTiers = roadmap.phases.some((p) => p.tier !== undefined);
    const order = hasTiers ? ARC_ORDER : [undefined];
    return order
      .map((tier) => {
        const phases = roadmap.phases
          .map((p, i) => ({ phase: p, index: i }))
          .filter(({ phase, index }) => phase.tier === tier && roadmap.phaseProjects[index]);
        return { tier, label: ARC_LABELS[tier] || 'Projects', phases };
      })
      .filter((a) => a.phases.length > 0);
  }, [roadmap]);

  if (loading) {
    return (
      <main className="boot">
        <div className="eyebrow">Learn.it</div>
        <p className="sub">Loading…</p>
      </main>
    );
  }

  if (!careerId || !roadmap) {
    return (
      <>
        <AppNav user={user} active="projects" />
        <div className="detail">
          <div className="detail-head">
            <div className="detail-title">Pick a career first</div>
            <div className="detail-sub">Projects are scoped to your roadmap.</div>
            <div className="landing-cta" style={{ marginTop: 20 }}>
              <Link className="btn-primary landing-btn" href="/dashboard">Go to Home</Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  const capstoneKey = phaseProjectKey(roadmap.id, 'capstone');
  const capstoneDone = phaseProjectDone(roadmap.id, 'capstone', progress);

  return (
    <>
      <AppNav user={user} careerId={careerId} active="projects" />

      <div className="detail">
        <div className="detail-head">
          <div className="detail-num mono">PROJECTS</div>
          <div className="detail-title">Can I build something?</div>
          <div className="detail-sub">The project you build alongside each phase of the roadmap.</div>
        </div>

        {arcs.map((arc) => (
          <div className="sub-block" key={arc.tier || 'all'}>
            <div className="sub-head">
              <span className="sub-title">{arc.label}</span>
              <div className="sub-line" />
            </div>

            {arc.phases.map(({ index: pi }) => {
              const pp = roadmap.phaseProjects[pi];
              const phaseTopics = byPhase[pi] || [];
              const phaseDone = phaseTopics.length > 0 && phaseTopics.every((t) => topicComplete(t, progress));
              const ppDone = phaseProjectDone(roadmap.id, pi, progress);
              const ppKey = phaseProjectKey(roadmap.id, pi);
              return (
                <div
                  key={pi}
                  className="proj-card"
                  style={{ gridColumn: 'unset', marginBottom: 12, opacity: phaseDone || ppDone ? 1 : 0.6, cursor: 'pointer' }}
                  onClick={() => router.push('/topic/' + (phaseTopics[0] ? phaseTopics[0].id : ''))}
                  role="button"
                  tabIndex={0}
                >
                  <span className="proj-eyebrow">
                    {ppDone ? 'Completed' : phaseDone ? 'Unlocked' : 'Unlocks when its topic is cleared'}
                  </span>
                  <div className="proj-title">
                    {pp.title.replace(/^(Phase Project|Optional Project) — /, '')}
                    {ppDone ? ' ✓' : ''}
                  </div>
                  <div className="proj-desc">{pp.desc}</div>
                </div>
              );
            })}
          </div>
        ))}

        <div className="capstone" style={{ margin: '40px 0 0', padding: 0 }}>
          <div
            className="capstone-box"
            onClick={() => toggle(capstoneKey)}
            role="button"
            tabIndex={0}
            style={{ cursor: 'pointer' }}
          >
            <div className="capstone-eyebrow">
              When every topic and project is cleared{capstoneDone ? ' — done!' : ''}
            </div>
            <div className="capstone-title">{roadmap.capstone.title}{capstoneDone ? ' ✓' : ''}</div>
            <div className="capstone-desc">{roadmap.capstone.desc}</div>
          </div>
        </div>
      </div>

      <footer>Built for one engineer&rsquo;s climb — Meerut → production</footer>
    </>
  );
}
