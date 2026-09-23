// lib/roadmap-meta.js — per-topic metadata (difficulty, estimated time,
// prerequisites) for every topic across both roadmaps.
//
// Kept as a separate layer, keyed by topic id, instead of adding fields
// directly onto every topic object in lib/topics.js / lib/topics-ai.js —
// this way the existing, already-verified Java content (2000+ lines, real
// links) never has to be touched to gain this metadata, and both roadmaps'
// topics share one lookup shape.
//
// prerequisites are topic ids from EITHER roadmap's TOPICS array — a topic
// only ever lists prereqs from its own roadmap, but the lookup itself is
// roadmap-agnostic since topic ids are globally unique.
//
// Prerequisites are intentionally transitive-light: a topic lists only its
// direct prerequisites (e.g. REST APIs requires Spring + JPA, not also Java
// Core/SOLID individually — those are already prerequisites of Spring).

export const DIFFICULTY = { BEGINNER: 'BEGINNER', INTERMEDIATE: 'INTERMEDIATE', ADVANCED: 'ADVANCED' };

export const TOPIC_META = {
  // ---------------- Java Developer ----------------
  'java-fundamentals': { difficulty: 'BEGINNER', estimatedTime: '6–8 hrs', prerequisites: [] },
  'java-core': { difficulty: 'BEGINNER', estimatedTime: '10–12 hrs', prerequisites: ['java-fundamentals'] },
  'solid': { difficulty: 'INTERMEDIATE', estimatedTime: '5–6 hrs', prerequisites: ['java-core'] },
  'build-tools': { difficulty: 'BEGINNER', estimatedTime: '3–4 hrs', prerequisites: ['java-fundamentals'] },
  'git': { difficulty: 'BEGINNER', estimatedTime: '3–4 hrs', prerequisites: [] },
  'linux-cli': { difficulty: 'BEGINNER', estimatedTime: '3–4 hrs', prerequisites: [] },
  'dsa1': { difficulty: 'BEGINNER', estimatedTime: '10–12 hrs', prerequisites: ['java-fundamentals'] },
  'dsa2': { difficulty: 'INTERMEDIATE', estimatedTime: '10–12 hrs', prerequisites: ['dsa1'] },
  'dsa3': { difficulty: 'INTERMEDIATE', estimatedTime: '12–14 hrs', prerequisites: ['dsa2'] },
  'dsa4': { difficulty: 'INTERMEDIATE', estimatedTime: '10–12 hrs', prerequisites: ['dsa3'] },
  'dsa5': { difficulty: 'ADVANCED', estimatedTime: '14–16 hrs', prerequisites: ['dsa4'] },
  'dsa6': { difficulty: 'ADVANCED', estimatedTime: '10–12 hrs', prerequisites: ['dsa5'] },
  'sql-db': { difficulty: 'BEGINNER', estimatedTime: '10–12 hrs', prerequisites: ['java-core'] },
  'jpa': { difficulty: 'INTERMEDIATE', estimatedTime: '8–10 hrs', prerequisites: ['sql-db'] },
  'nosql': { difficulty: 'INTERMEDIATE', estimatedTime: '5–6 hrs', prerequisites: ['sql-db'] },
  'spring': { difficulty: 'INTERMEDIATE', estimatedTime: '8–10 hrs', prerequisites: ['java-core', 'solid'] },
  'rest': { difficulty: 'INTERMEDIATE', estimatedTime: '8–10 hrs', prerequisites: ['spring', 'jpa'] },
  'security': { difficulty: 'INTERMEDIATE', estimatedTime: '8–10 hrs', prerequisites: ['rest'] },
  'testing': { difficulty: 'INTERMEDIATE', estimatedTime: '6–8 hrs', prerequisites: ['rest'] },
  'cache-mq': { difficulty: 'ADVANCED', estimatedTime: '6–8 hrs', prerequisites: ['rest'] },
  'docker': { difficulty: 'INTERMEDIATE', estimatedTime: '4–6 hrs', prerequisites: ['rest'] },
  'kubernetes': { difficulty: 'ADVANCED', estimatedTime: '6–8 hrs', prerequisites: ['docker'] },
  'cicd': { difficulty: 'INTERMEDIATE', estimatedTime: '4–6 hrs', prerequisites: ['docker', 'testing'] },
  'sysdesign': { difficulty: 'ADVANCED', estimatedTime: '10–12 hrs', prerequisites: ['cache-mq', 'sql-db'] },
  'cloud': { difficulty: 'INTERMEDIATE', estimatedTime: '4–6 hrs', prerequisites: ['docker'] },
  'html-css': { difficulty: 'BEGINNER', estimatedTime: '6–8 hrs', prerequisites: [] },
  'js-dom': { difficulty: 'BEGINNER', estimatedTime: '8–10 hrs', prerequisites: ['html-css'] },
  'typescript': { difficulty: 'INTERMEDIATE', estimatedTime: '4–6 hrs', prerequisites: ['js-dom'] },
  'react-fundamentals': { difficulty: 'INTERMEDIATE', estimatedTime: '8–10 hrs', prerequisites: ['js-dom'] },
  'react-advanced': { difficulty: 'ADVANCED', estimatedTime: '8–10 hrs', prerequisites: ['react-fundamentals', 'typescript'] },

  // ---------------- AI Engineer ----------------
  'python-fundamentals': { difficulty: 'BEGINNER', estimatedTime: '8–10 hrs', prerequisites: [] },
  'ai-math': { difficulty: 'BEGINNER', estimatedTime: '10–14 hrs', prerequisites: [] },
  'data-tools': { difficulty: 'BEGINNER', estimatedTime: '10–12 hrs', prerequisites: ['python-fundamentals'] },
  'ml-supervised': { difficulty: 'INTERMEDIATE', estimatedTime: '10–12 hrs', prerequisites: ['data-tools', 'ai-math'] },
  'ml-unsupervised': { difficulty: 'INTERMEDIATE', estimatedTime: '8–10 hrs', prerequisites: ['ml-supervised'] },
  'dl-foundations': { difficulty: 'INTERMEDIATE', estimatedTime: '10–12 hrs', prerequisites: ['ml-unsupervised', 'ai-math'] },
  'dl-architectures': { difficulty: 'ADVANCED', estimatedTime: '10–12 hrs', prerequisites: ['dl-foundations'] },
  'pytorch': { difficulty: 'INTERMEDIATE', estimatedTime: '8–10 hrs', prerequisites: ['dl-foundations'] },
  'nlp': { difficulty: 'ADVANCED', estimatedTime: '10–12 hrs', prerequisites: ['pytorch', 'dl-architectures'] },
  'genai': { difficulty: 'INTERMEDIATE', estimatedTime: '6–8 hrs', prerequisites: ['nlp'] },
  'rag': { difficulty: 'ADVANCED', estimatedTime: '8–10 hrs', prerequisites: ['genai'] },
  'ai-agents': { difficulty: 'ADVANCED', estimatedTime: '8–10 hrs', prerequisites: ['genai'] },
  'ai-frameworks': { difficulty: 'INTERMEDIATE', estimatedTime: '6–8 hrs', prerequisites: ['rag', 'ai-agents'] },
  'fine-tuning': { difficulty: 'ADVANCED', estimatedTime: '8–10 hrs', prerequisites: ['pytorch', 'nlp'] },
  'mlops': { difficulty: 'INTERMEDIATE', estimatedTime: '6–8 hrs', prerequisites: ['ai-frameworks'] },
};

const DEFAULT_META = { difficulty: 'INTERMEDIATE', estimatedTime: '4–6 hrs', prerequisites: [] };

// Always returns a usable object, even for a topic id with no explicit entry —
// callers never need a null-check.
export function getTopicMeta(topicId) {
  return TOPIC_META[topicId] || DEFAULT_META;
}
