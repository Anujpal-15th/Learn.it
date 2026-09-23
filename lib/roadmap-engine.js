// lib/roadmap-engine.js — pure, derived-state functions that make the
// roadmap "guided" rather than just a list: topic status, prerequisite gaps,
// the next-topic recommendation (with a reason), milestone/phase completion,
// the job-readiness checklist, and the site search index.
//
// Everything here is a pure function of (roadmap, progress) or (topicId,
// progress) — no state of its own, no React, so it's trivially reusable from
// the dashboard, the roadmap page, the topic page, and the validation script.

import { topicSolved, topicComplete, phaseProjectDone } from './topics.js';
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

// Recommend what to learn next, in priority order:
//   1. an in-progress topic (finish what you started)
//   2. the first not-started topic, in roadmap order, whose prerequisites
//      are all complete — with a reason naming what unlocked it
//   3. if nothing has its prerequisites fully met yet (early in the roadmap),
//      just the first not-started topic in roadmap order
//   4. null if every topic is complete
export function recommendNextTopic(roadmap, progress) {
  const topics = roadmap.topics;
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
  return null; // every topic complete
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
    return { index: i, name: phase.name, desc: phase.desc, pct, done, state, topicsTotal: topics.length, topicsCompleted: completedCount };
  });
}

// Whole-roadmap stats for the dashboard/roadmap header.
export function roadmapStats(roadmap, progress) {
  const topics = roadmap.topics;
  let questionsTotal = 0;
  let questionsSolved = 0;
  topics.forEach((t) => {
    const { c, t: tt } = topicSolved(t, progress);
    questionsTotal += tt;
    questionsSolved += c;
  });
  const topicsCompleted = topics.filter((t) => topicComplete(t, progress)).length;

  let projectsCompleted = 0;
  roadmap.phaseProjects.forEach((_, i) => {
    if (phaseProjectDone(roadmap.id, i, progress)) projectsCompleted++;
  });
  if (phaseProjectDone(roadmap.id, 'capstone', progress)) projectsCompleted++;
  const projectsTotal = roadmap.phaseProjects.length + 1;

  const pct = topics.length ? Math.round((topicsCompleted / topics.length) * 100) : 0;
  return { topicsTotal: topics.length, topicsCompleted, questionsTotal, questionsSolved, projectsTotal, projectsCompleted, pct };
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
