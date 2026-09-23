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
  // ---------------- Java Backend Engineer — Core (tier: core-foundations) ----------------
  'programming-foundations': { difficulty: 'BEGINNER', estimatedTime: '6–8 hrs', prerequisites: [] },
  'java-fundamentals': { difficulty: 'BEGINNER', estimatedTime: '6–8 hrs', prerequisites: ['programming-foundations'] },
  'ood-foundations': { difficulty: 'INTERMEDIATE', estimatedTime: '5–6 hrs', prerequisites: ['java-fundamentals'] },
  'collections-generics': { difficulty: 'INTERMEDIATE', estimatedTime: '8–10 hrs', prerequisites: ['ood-foundations'] },
  'modern-java': { difficulty: 'INTERMEDIATE', estimatedTime: '8–10 hrs', prerequisites: ['collections-generics'] },
  'concurrency-jvm': { difficulty: 'ADVANCED', estimatedTime: '10–12 hrs', prerequisites: ['modern-java'] },

  // ---------------- Parallel DSA Track (tier: dsa) — never blocks core ----------------
  'dsa1': { difficulty: 'BEGINNER', estimatedTime: '10–12 hrs', prerequisites: ['java-fundamentals'] },
  'dsa2': { difficulty: 'INTERMEDIATE', estimatedTime: '10–12 hrs', prerequisites: ['dsa1'] },
  'dsa3': { difficulty: 'INTERMEDIATE', estimatedTime: '12–14 hrs', prerequisites: ['dsa2'] },
  'dsa4': { difficulty: 'INTERMEDIATE', estimatedTime: '10–12 hrs', prerequisites: ['dsa3'] },
  'dsa5': { difficulty: 'ADVANCED', estimatedTime: '14–16 hrs', prerequisites: ['dsa4'] },
  'dsa6': { difficulty: 'ADVANCED', estimatedTime: '10–12 hrs', prerequisites: ['dsa5'] },

  // ---------------- Backend Development (tier: backend) ----------------
  'dev-fundamentals': { difficulty: 'BEGINNER', estimatedTime: '8–10 hrs', prerequisites: ['programming-foundations'] },
  'sql-db': { difficulty: 'BEGINNER', estimatedTime: '9–11 hrs', prerequisites: ['dev-fundamentals'] },
  'build-tools': { difficulty: 'INTERMEDIATE', estimatedTime: '5–6 hrs', prerequisites: ['sql-db'] },
  'spring-core': { difficulty: 'INTERMEDIATE', estimatedTime: '6–8 hrs', prerequisites: ['modern-java', 'build-tools'] },
  'spring-boot-rest': { difficulty: 'INTERMEDIATE', estimatedTime: '8–10 hrs', prerequisites: ['spring-core'] },
  'jpa': { difficulty: 'INTERMEDIATE', estimatedTime: '9–11 hrs', prerequisites: ['spring-boot-rest'] },
  'production-api-engineering': { difficulty: 'INTERMEDIATE', estimatedTime: '6–8 hrs', prerequisites: ['jpa'] },
  'security': { difficulty: 'INTERMEDIATE', estimatedTime: '8–10 hrs', prerequisites: ['production-api-engineering'] },
  'testing': { difficulty: 'INTERMEDIATE', estimatedTime: '6–8 hrs', prerequisites: ['security'] },

  // ---------------- Production & Advanced Backend (tier: production-advanced) ----------------
  'production-engineering-capstone': { difficulty: 'INTERMEDIATE', estimatedTime: '6–8 hrs', prerequisites: ['testing'] },
  'cache-mq': { difficulty: 'INTERMEDIATE', estimatedTime: '5–6 hrs', prerequisites: ['production-engineering-capstone'] },
  'messaging-kafka': { difficulty: 'ADVANCED', estimatedTime: '8–10 hrs', prerequisites: ['cache-mq'] },
  'docker': { difficulty: 'INTERMEDIATE', estimatedTime: '4–6 hrs', prerequisites: ['production-engineering-capstone'] },
  'cicd': { difficulty: 'INTERMEDIATE', estimatedTime: '4–6 hrs', prerequisites: ['docker', 'testing'] },
  'cloud': { difficulty: 'INTERMEDIATE', estimatedTime: '4–6 hrs', prerequisites: ['cicd'] },

  // ---------------- System Design & Advanced (tier: system-design) ----------------
  'lld-design-patterns': { difficulty: 'ADVANCED', estimatedTime: '10–12 hrs', prerequisites: ['ood-foundations', 'production-engineering-capstone'] },
  'hld-distributed-systems': { difficulty: 'ADVANCED', estimatedTime: '10–12 hrs', prerequisites: ['lld-design-patterns', 'cache-mq', 'messaging-kafka'] },
  'microservices': { difficulty: 'ADVANCED', estimatedTime: '8–10 hrs', prerequisites: ['hld-distributed-systems'] },
  'kubernetes': { difficulty: 'ADVANCED', estimatedTime: '6–8 hrs', prerequisites: ['docker', 'microservices'] },

  // ---------------- Optional electives (tier: optional) — never gate readiness ----------------
  'nosql': { difficulty: 'INTERMEDIATE', estimatedTime: '5–6 hrs', prerequisites: ['sql-db'] },
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
