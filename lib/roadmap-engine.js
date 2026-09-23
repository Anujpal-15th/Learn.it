// lib/roadmap-engine.js — pure, derived-state functions that make the
// roadmap "guided" rather than just a list: topic status, prerequisite gaps,
// the next-topic recommendation (with a reason), milestone/phase completion,
// the job-readiness checklist, and the site search index.
//
// Everything here is a pure function of (roadmap, progress) or (topicId,
// progress) — no state of its own, no React, so it's trivially reusable from
// the dashboard, the roadmap page, the topic page, and the validation script.

import { topicSolved, topicComplete, quizComplete, projectDone, phaseProjectDone } from './topics.js';
import { getTopicMeta } from './roadmap-meta.js';
import { CAREERS, ROADMAPS, READINESS_CHECKLIST, getRoadmap, findTopicRoadmap } from './roadmaps.js';
import { INTERVIEW_CATEGORIES, interviewKey } from './interview-questions.js';
import { INTERVIEW_CATEGORIES_AI } from './interview-questions-ai.js';

export function topicStatus(topic, progress) {
  const { c, t } = topicSolved(topic, progress);
  if (t === 0) return 'NOT_STARTED';
  if (c === 0) return 'NOT_STARTED';
  if (c === t) return 'COMPLETED';
  return 'IN_PROGRESS';
}

// --- Tiers (curriculum refinement) ---
// A topic's tier comes from the phase it belongs to. Roadmaps that don't use
// tiers at all (AI Engineer, today) have `phase.tier === undefined` on every
// phase — isCoreTrack() treats that as "core" by default, so every function
// below behaves exactly like the old single-track model for that roadmap.
// Only Java Developer's phases currently declare a tier.
export function topicTier(roadmap, topic) {
  const phase = roadmap.phases[topic.phase];
  return phase && phase.tier;
}
export function isDsaTrack(tier) {
  return tier === 'dsa';
}
export function isOptionalTrack(tier) {
  return tier === 'optional';
}
export function isCoreTrack(tier) {
  return !isDsaTrack(tier) && !isOptionalTrack(tier);
}

// How many of a roadmap's phases are real, approved-curriculum numbered
// phases — excludes elective-only containers (`numbered: false`, e.g. NoSQL,
// Full-Stack Extension) that exist purely to group optional topics for the
// UI and were never part of the approved 26-phase Java Developer structure.
// A roadmap with no such containers (AI Engineer) counts every phase, same
// as `phases.length` always did.
export function numberedPhaseCount(roadmap) {
  return roadmap.phases.filter((p) => p.numbered !== false).length;
}

const TIER_SECTIONS = [
  { tier: 'core-foundations', label: 'Core Java Foundations' },
  { tier: 'dsa', label: 'Parallel DSA Track' },
  { tier: 'backend', label: 'Backend Development' },
  { tier: 'production-advanced', label: 'Production & Advanced Backend' },
  { tier: 'system-design', label: 'System Design & Advanced' },
  { tier: 'optional', label: 'Optional Extensions' },
];

// Groups a roadmap's phases into the 5 (+ optional) named UI sections, each
// carrying its member phases' milestone stats. Presentation-only — doesn't
// change phase numbering or prerequisites. A roadmap with no tiers at all
// (AI Engineer) gets everything under one untiered bucket, so this is safe
// to call for either career.
export function tierSections(roadmap, progress) {
  const stats = milestoneStats(roadmap, progress);
  const hasTiers = roadmap.phases.some((p) => p.tier !== undefined);
  if (!hasTiers) {
    return [{ tier: null, label: null, phases: stats }];
  }
  return TIER_SECTIONS.map((section) => ({
    tier: section.tier,
    label: section.label,
    phases: stats.filter((s) => roadmap.phases[s.index].tier === section.tier),
  })).filter((section) => section.phases.length > 0);
}

// Incomplete prerequisites for a topic — informational only. Never used to
// block navigation; the topic page shows these as a soft "recommended
// prerequisites" banner the learner can act on or ignore.
export function prerequisiteGaps(topicId, progress) {
  const meta = getTopicMeta(topicId);
  const gaps = [];
  meta.prerequisites.forEach((pid) => {
    const { topic } = findTopicRoadmap(pid);
    if (!topic) return;
    const status = topicStatus(topic, progress);
    if (status !== 'COMPLETED') gaps.push({ id: pid, title: topic.title, status });
  });
  return gaps;
}

function completedPrereqTitles(topicId, progress) {
  const meta = getTopicMeta(topicId);
  return meta.prerequisites
    .map((pid) => findTopicRoadmap(pid).topic)
    .filter((t) => t && topicComplete(t, progress))
    .map((t) => t.title);
}

// Recommend what to learn next FROM A GIVEN SET OF TOPICS, in priority order:
//   1. an in-progress topic (finish what you started)
//   2. the first not-started topic, in roadmap order, whose prerequisites
//      are all complete — with a reason naming what unlocked it
//   3. if nothing has its prerequisites fully met yet (early in the roadmap),
//      just the first not-started topic in roadmap order
//   4. null if every topic in the set is complete
function recommendFrom(topics, progress) {
  const inProgress = topics.find((t) => topicStatus(t, progress) === 'IN_PROGRESS');
  if (inProgress) {
    return { topic: inProgress, reason: `Continue where you left off in "${inProgress.title}."` };
  }

  const notStarted = topics.filter((t) => topicStatus(t, progress) === 'NOT_STARTED');
  for (const t of notStarted) {
    if (prerequisiteGaps(t.id, progress).length === 0) {
      const done = completedPrereqTitles(t.id, progress);
      const reason = done.length
        ? `Recommended because you've completed ${done.join(', ')}.`
        : 'Start of your roadmap.';
      return { topic: t, reason };
    }
  }

  if (notStarted.length) {
    return { topic: notStarted[0], reason: 'Start of your roadmap.' };
  }
  return null; // every topic in this set is complete
}

// The main "Recommended Next" — scoped to the required (core) path only, so
// DSA never blocks or gets recommended here even though its own prerequisite
// (core-java) would otherwise make it eligible early. This is the
// direct fix for the "DSA blocks the backend path" gap identified in the
// curriculum audit.
export function recommendNextTopic(roadmap, progress) {
  const coreTopics = roadmap.topics.filter((t) => isCoreTrack(topicTier(roadmap, t)));
  return recommendFrom(coreTopics, progress);
}

// A second, independent recommendation for the parallel DSA track — its own
// "keep going" logic, never gated by core-path progress. Returns null for a
// roadmap with no DSA-tier topics (e.g. AI Engineer) or once DSA is fully
// solved.
export function recommendDsaPractice(roadmap, progress) {
  const dsaTopics = roadmap.topics.filter((t) => isDsaTrack(topicTier(roadmap, t)));
  if (dsaTopics.length === 0) return null;
  return recommendFrom(dsaTopics, progress);
}

// What "next topic" means from a specific topic's own page — DSA topics
// recommend within the DSA track, everything else recommends the next core
// topic. Used by the topic page's "Next Topic" button.
export function recommendNextFrom(roadmap, currentTopic, progress) {
  const tier = topicTier(roadmap, currentTopic);
  return isDsaTrack(tier) ? recommendDsaPractice(roadmap, progress) : recommendNextTopic(roadmap, progress);
}

// Per-phase ("milestone") completion. Exactly one phase is 'current' (the
// first incomplete one in order) — phases after it are 'upcoming' (shown
// locked in the UI for orientation only, never actually inaccessible).
export function milestoneStats(roadmap, progress) {
  const byPhase = {};
  roadmap.topics.forEach((t) => {
    (byPhase[t.phase] = byPhase[t.phase] || []).push(t);
  });
  let foundCurrent = false;
  let numberedSoFar = 0;
  return roadmap.phases.map((phase, i) => {
    const topics = byPhase[i] || [];
    const completedCount = topics.filter((t) => topicComplete(t, progress)).length;
    const pct = topics.length ? Math.round((completedCount / topics.length) * 100) : 0;
    const done = topics.length > 0 && completedCount === topics.length;
    let state;
    if (done) state = 'done';
    else if (!foundCurrent) {
      state = 'current';
      foundCurrent = true;
    } else state = 'upcoming';
    // displayNumber is null for a `numbered: false` elective container (not
    // one of the approved 26 curriculum phases) — the UI must not badge it
    // with a phase number. Every other phase gets its position among ONLY
    // the numbered phases, so an elective container never shifts the
    // numbering of the phases around it.
    const displayNumber = phase.numbered === false ? null : ++numberedSoFar;
    return {
      index: i,
      name: phase.name,
      desc: phase.desc,
      pct,
      done,
      state,
      topicsTotal: topics.length,
      topicsCompleted: completedCount,
      displayNumber,
    };
  });
}

// Whole-roadmap stats for the dashboard/roadmap header. "Overall progress"
// (topicsTotal/topicsCompleted/pct) is scoped to the required (core) path —
// DSA and optional-elective topics are tracked separately (dsaStats) rather
// than silently diluting or inflating the number a learner reads as "how
// close am I." Questions solved/projects still count everything, since those
// are raw achievement counts, not a completion percentage.
export function roadmapStats(roadmap, progress) {
  const allTopics = roadmap.topics;
  const requiredTopics = allTopics.filter((t) => isCoreTrack(topicTier(roadmap, t)));
  const dsaTopics = allTopics.filter((t) => isDsaTrack(topicTier(roadmap, t)));

  let questionsTotal = 0;
  let questionsSolved = 0;
  allTopics.forEach((t) => {
    const { c, t: tt } = topicSolved(t, progress);
    questionsTotal += tt;
    questionsSolved += c;
  });

  const topicsCompleted = requiredTopics.filter((t) => topicComplete(t, progress)).length;
  const pct = requiredTopics.length ? Math.round((topicsCompleted / requiredTopics.length) * 100) : 0;

  const dsaCompleted = dsaTopics.filter((t) => topicComplete(t, progress)).length;

  let projectsCompleted = 0;
  roadmap.phaseProjects.forEach((_, i) => {
    if (phaseProjectDone(roadmap.id, i, progress)) projectsCompleted++;
  });
  if (phaseProjectDone(roadmap.id, 'capstone', progress)) projectsCompleted++;
  const projectsTotal = roadmap.phaseProjects.length + 1;

  return {
    topicsTotal: requiredTopics.length,
    topicsCompleted,
    questionsTotal,
    questionsSolved,
    projectsTotal,
    projectsCompleted,
    pct,
    dsaStats: dsaTopics.length ? { total: dsaTopics.length, completed: dsaCompleted } : null,
  };
}

// Job-readiness checklist: each item is done when everything it points at
// (a set of topics, an interview-question track, or the project set) is
// complete. Not a guarantee of employment — just a completion checklist.
export function readinessChecklist(careerId, progress) {
  const items = READINESS_CHECKLIST[careerId] || [];
  const roadmap = getRoadmap(careerId);
  if (!roadmap) return [];

  return items.map((item) => {
    let done = false;
    if (item.topicIds) {
      done = item.topicIds.every((id) => {
        const t = roadmap.topics.find((x) => x.id === id);
        return t && topicComplete(t, progress);
      });
    } else if (item.interviewTrack) {
      const categories = item.interviewTrack === 'java' ? INTERVIEW_CATEGORIES : INTERVIEW_CATEGORIES_AI;
      const total = categories.reduce((n, c) => n + c.items.length, 0);
      const solved = categories.reduce(
        (n, c) => n + c.items.filter((it) => progress && progress[interviewKey(it.slug)]).length,
        0
      );
      done = total > 0 && solved === total;
    } else if (item.projectsCareer) {
      const rm = getRoadmap(item.projectsCareer);
      const allPhasesDone = rm.phaseProjects.every((_, i) => phaseProjectDone(rm.id, i, progress));
      done = allPhasesDone && phaseProjectDone(rm.id, 'capstone', progress);
    }
    return { label: item.label, done };
  });
}

// Named career-readiness gates from the curriculum plan (§6) — actual
// computed rollups, not labels. A gate is "done" once every topic in its
// required tier set has its practice questions, quiz, AND checkpoint
// project all complete. DSA (tier 'dsa') and every optional-elective topic
// (tier 'optional' — NoSQL, the frontend extension, and Kubernetes) can
// never enter a gate's required set: each gate only ever pulls topics from
// specific required tiers, so this is enforced structurally rather than by
// an exclusion list that could drift out of sync.
function tierTopics(roadmap, tier) {
  return roadmap.topics.filter((t) => topicTier(roadmap, t) === tier);
}
function topicFullyDone(topic, progress) {
  return topicComplete(topic, progress) && quizComplete(topic, progress) && projectDone(topic.id, progress);
}
function gateStatus(label, topics, progress) {
  const total = topics.length;
  const completed = topics.filter((t) => topicFullyDone(t, progress)).length;
  return { label, total, completed, done: total > 0 && completed === total };
}

// Returns null for a roadmap with no tiers (AI Engineer) — these are a Java
// Developer-specific concept from the curriculum refinement.
export function readinessGates(roadmap, progress) {
  if (!roadmap.phases.some((p) => p.tier !== undefined)) return null;

  const coreFoundations = tierTopics(roadmap, 'core-foundations');
  const backend = tierTopics(roadmap, 'backend');
  const productionAdvanced = tierTopics(roadmap, 'production-advanced');
  const systemDesign = tierTopics(roadmap, 'system-design');

  return {
    javaFoundationReady: gateStatus('Java Foundation Ready', coreFoundations, progress),
    backendDevelopmentReady: gateStatus('Backend Development Ready', [...coreFoundations, ...backend], progress),
    productionBackendReady: gateStatus(
      'Production Backend Ready',
      [...coreFoundations, ...backend, ...productionAdvanced],
      progress
    ),
    systemDesignReady: gateStatus('System Design Ready', systemDesign, progress),
  };
}

// --- Search ---

export function buildSearchIndex() {
  const index = [];
  CAREERS.forEach((career) => {
    const roadmap = ROADMAPS[career.id];
    roadmap.topics.forEach((t) => {
      index.push({ type: 'Topic', career: career.label, careerId: career.id, title: t.title, subtitle: t.sub, url: '/topic/' + t.id });
      t.subtopics.forEach((s, si) => {
        index.push({ type: 'Subtopic', career: career.label, careerId: career.id, title: s.title, subtitle: t.title, url: '/topic/' + t.id + '#sub-' + si });
        (s.q || []).forEach((q) => {
          index.push({ type: 'Question', career: career.label, careerId: career.id, title: q.t, subtitle: t.title + ' — ' + s.title, url: '/topic/' + t.id, external: q.u || null });
        });
        // Checklist items carry the most specific searchable terms (e.g.
        // "HashMap vs TreeMap", "JWT") — without these, canonical searches
        // for a named technology would return nothing.
        (s.checklist || []).forEach((name) => {
          index.push({ type: 'Concept', career: career.label, careerId: career.id, title: name, subtitle: t.title + ' — ' + s.title, url: '/topic/' + t.id + '#sub-' + si });
        });
      });
      if (t.learnMore) {
        index.push({ type: 'Resource', career: career.label, careerId: career.id, title: t.learnMore.label, subtitle: t.title, url: '/topic/' + t.id, external: t.learnMore.url });
      }
    });
    roadmap.phaseProjects.forEach((p, i) => {
      index.push({ type: 'Project', career: career.label, careerId: career.id, title: p.title, subtitle: roadmap.phases[i] ? roadmap.phases[i].name : '', url: '/roadmap/' + career.id });
    });
    index.push({ type: 'Project', career: career.label, careerId: career.id, title: roadmap.capstone.title, subtitle: 'Capstone', url: '/roadmap/' + career.id });
  });
  return index;
}

// Simple relevance-scored substring search — no dependency, this is a small
// static content set (a few thousand entries at most), not a search corpus
// that needs a real index.
export function searchContent(query, index) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return [];
  const data = index || buildSearchIndex();
  return data
    .map((item) => {
      const title = item.title.toLowerCase();
      const subtitle = (item.subtitle || '').toLowerCase();
      let score = 0;
      if (title === q) score = 100;
      else if (title.startsWith(q)) score = 60;
      else if (title.includes(q)) score = 40;
      if (subtitle.includes(q)) score += 10;
      return { item, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 60)
    .map((r) => r.item);
}
