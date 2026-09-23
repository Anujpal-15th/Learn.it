// scripts/validate-content.mjs — content integrity check for both roadmaps.
// Run with: npm run validate
//
// Checks: duplicate/missing topic ids, broken prerequisite references,
// cross-roadmap prerequisite leaks, invalid difficulty values, topics whose
// phase index doesn't exist (orphaned topics), malformed resource links
// (missing label/url or an unparsable/non-http(s) URL), malformed quiz
// questions (wrong option count, out-of-range correct index, missing
// explanation), and job-readiness checklist items referencing topics that
// don't exist.
//
// Exits 1 on any failure so this is CI/pre-deploy friendly.

import { CAREERS, ROADMAPS, READINESS_CHECKLIST } from '../lib/roadmaps.js';
import { TOPIC_META, DIFFICULTY } from '../lib/roadmap-meta.js';
import { INTERVIEW_CATEGORIES } from '../lib/interview-questions.js';
import { INTERVIEW_CATEGORIES_AI } from '../lib/interview-questions-ai.js';

const errors = [];
const warnings = [];

function fail(msg) {
  errors.push(msg);
}
function warn(msg) {
  warnings.push(msg);
}

function isValidUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

function checkResource(resource, context) {
  if (!resource) return;
  if (!resource.label || typeof resource.label !== 'string') {
    fail(`${context}: resource missing a label`);
  }
  if (!resource.url) {
    fail(`${context}: resource missing a url`);
  } else if (!isValidUrl(resource.url)) {
    fail(`${context}: resource url is not a valid http(s) URL — "${resource.url}"`);
  }
}

function checkQuiz(quiz, context) {
  (quiz || []).forEach((q, qi) => {
    const label = `${context} quiz[${qi}]`;
    if (!q.q || typeof q.q !== 'string') fail(`${label}: missing question text`);
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      fail(`${label}: must have exactly 4 options`);
    }
    if (typeof q.correct !== 'number' || q.correct < 0 || q.correct > 3) {
      fail(`${label}: correct index out of range (${q.correct})`);
    }
    if (!q.explanation || typeof q.explanation !== 'string') {
      fail(`${label}: missing explanation`);
    }
  });
}

// --- Build a global id registry across both roadmaps ---
const allTopicIds = new Set();
const idOwner = new Map(); // id -> roadmap.id, to detect cross-roadmap duplicates

CAREERS.forEach((career) => {
  const roadmap = ROADMAPS[career.id];

  roadmap.topics.forEach((top) => {
    const context = `[${career.id}] topic "${top.id || '(missing id)'}"`;

    if (!top.id) {
      fail(`${context}: missing id`);
      return;
    }
    if (allTopicIds.has(top.id)) {
      fail(`Duplicate topic id "${top.id}" — owned by ${idOwner.get(top.id)} and ${career.id}`);
    }
    allTopicIds.add(top.id);
    idOwner.set(top.id, career.id);

    if (!top.title) fail(`${context}: missing title`);
    if (!Array.isArray(top.subtopics) || top.subtopics.length === 0) {
      fail(`${context}: no subtopics`);
    }

    // Orphaned topic: phase index must exist in this roadmap's PHASES array.
    if (typeof top.phase !== 'number' || top.phase < 0 || top.phase >= roadmap.phases.length) {
      fail(`${context}: phase index ${top.phase} has no matching phase (roadmap has ${roadmap.phases.length})`);
    }

    checkResource(top.learnMore, context);
    checkQuiz(top.quiz, context);

    (top.subtopics || []).forEach((s, si) => {
      const subContext = `${context} subtopic[${si}] "${s.title || '?'}"`;
      if (!Array.isArray(s.q)) fail(`${subContext}: missing practice question array`);
      checkResource(s.learnMore, subContext);
      (s.q || []).forEach((q, qi) => {
        if (!q.t) fail(`${subContext} question[${qi}]: missing text`);
        if (q.u && !isValidUrl(q.u)) {
          fail(`${subContext} question[${qi}]: invalid URL — "${q.u}"`);
        }
      });
    });

    if (!top.mini || !top.mini.title || !top.mini.desc) {
      fail(`${context}: missing checkpoint project (mini)`);
    }
  });

  // Every phase should have a project.
  if (roadmap.phaseProjects.length !== roadmap.phases.length) {
    fail(`[${career.id}]: ${roadmap.phases.length} phases but ${roadmap.phaseProjects.length} phase projects`);
  }
  if (!roadmap.capstone || !roadmap.capstone.title) {
    fail(`[${career.id}]: missing capstone`);
  }
});

// --- Metadata: difficulty + prerequisites ---
Object.entries(TOPIC_META).forEach(([topicId, meta]) => {
  const context = `roadmap-meta "${topicId}"`;
  if (!allTopicIds.has(topicId)) {
    fail(`${context}: metadata exists for a topic id that isn't in any roadmap`);
    return;
  }
  if (!DIFFICULTY[meta.difficulty]) {
    fail(`${context}: invalid difficulty "${meta.difficulty}"`);
  }
  const ownerCareer = idOwner.get(topicId);
  (meta.prerequisites || []).forEach((prereqId) => {
    if (!allTopicIds.has(prereqId)) {
      fail(`${context}: prerequisite "${prereqId}" does not exist in any roadmap`);
    } else if (idOwner.get(prereqId) !== ownerCareer) {
      fail(`${context}: prerequisite "${prereqId}" belongs to a different roadmap (${idOwner.get(prereqId)})`);
    }
  });
});

// Every topic should ideally have metadata — warn, don't fail (a sensible
// default is used at runtime).
allTopicIds.forEach((id) => {
  if (!TOPIC_META[id]) warn(`Topic "${id}" has no roadmap-meta entry — falling back to defaults`);
});

// --- Readiness checklist: topicIds must exist and belong to that career ---
Object.entries(READINESS_CHECKLIST).forEach(([careerId, items]) => {
  items.forEach((item) => {
    (item.topicIds || []).forEach((id) => {
      if (!allTopicIds.has(id)) {
        fail(`Readiness checklist [${careerId}] "${item.label}": references nonexistent topic "${id}"`);
      } else if (idOwner.get(id) !== careerId) {
        fail(`Readiness checklist [${careerId}] "${item.label}": references a topic from another roadmap ("${id}")`);
      }
    });
  });
});

// --- Interview question banks: duplicate slugs (shared 'interview::' key
// namespace across both tracks) and resource links ---
const interviewSlugs = new Set();
[
  { label: 'java', categories: INTERVIEW_CATEGORIES },
  { label: 'ai', categories: INTERVIEW_CATEGORIES_AI },
].forEach(({ label, categories }) => {
  categories.forEach((cat) => {
    checkResource(cat.source, `interview-questions[${label}] category "${cat.name}"`);
    cat.items.forEach((item) => {
      if (!item.slug) {
        fail(`interview-questions[${label}] "${cat.name}": item missing slug`);
        return;
      }
      if (interviewSlugs.has(item.slug)) {
        fail(`Duplicate interview question slug "${item.slug}"`);
      }
      interviewSlugs.add(item.slug);
      if (!item.q || !item.d) {
        fail(`interview-questions[${label}] "${item.slug}": missing question or explanation`);
      }
    });
  });
});

// --- Report ---
console.log(`Checked ${allTopicIds.size} topics across ${CAREERS.length} roadmaps.`);

if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`);
  warnings.forEach((w) => console.log(`  ! ${w}`));
}

if (errors.length) {
  console.log(`\n${errors.length} error(s):`);
  errors.forEach((e) => console.log(`  ✗ ${e}`));
  process.exit(1);
}

console.log('\nAll content checks passed.');
