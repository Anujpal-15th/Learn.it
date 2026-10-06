// lib/practice-groups.js — a UI-only regrouping of existing topic ids for
// the /practice hub, keyed by career. Not curriculum content: every id here
// already exists in that career's roadmap (lib/topics.js or lib/topics-ai.js)
// with its own practice questions; this just says which subject bucket each
// one shows up under on the Practice page. Group keys double as
// /practice/<key> routes, so they must be unique across careers.

export const PRACTICE_GROUPS = {
  'java-developer': {
    java: {
      label: 'Java',
      topicIds: ['core-java', 'ood-foundations', 'collections-generics', 'modern-java', 'concurrency-jvm'],
    },
    sql: {
      label: 'SQL',
      topicIds: ['sql-db'],
    },
    'spring-boot': {
      label: 'Spring Boot',
      topicIds: ['spring-core', 'spring-boot-rest', 'jpa', 'security'],
    },
    'system-design': {
      label: 'System Design',
      topicIds: ['lld-design-patterns', 'hld-distributed-systems', 'microservices'],
    },
  },
  'ai-engineer': {
    'python-data': {
      label: 'Python & Data',
      topicIds: ['python-fundamentals', 'ai-math', 'data-tools'],
    },
    'machine-learning': {
      label: 'Machine Learning',
      topicIds: ['ml-supervised', 'ml-unsupervised'],
    },
    'deep-learning': {
      label: 'Deep Learning & PyTorch',
      topicIds: ['dl-foundations', 'dl-architectures', 'pytorch'],
    },
    'nlp-llms': {
      label: 'NLP & LLMs',
      topicIds: ['nlp', 'genai', 'fine-tuning'],
    },
    'rag-agents': {
      label: 'RAG & Agents',
      topicIds: ['rag', 'ai-agents', 'ai-frameworks'],
    },
    mlops: {
      label: 'MLOps & Deployment',
      topicIds: ['mlops'],
    },
  },
};

// One career's groups ({ key: { label, topicIds } }), or {} for an unknown career.
export function getPracticeGroups(careerId) {
  return PRACTICE_GROUPS[careerId] || {};
}

// Resolve a /practice/<key> route to its group and owning career, or null.
export function findPracticeGroup(key) {
  for (const [careerId, groups] of Object.entries(PRACTICE_GROUPS)) {
    if (Object.prototype.hasOwnProperty.call(groups, key)) return { careerId, key, group: groups[key] };
  }
  return null;
}
