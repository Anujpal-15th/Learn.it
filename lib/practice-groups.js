// lib/practice-groups.js — a UI-only regrouping of existing topic ids for
// the /practice hub. Not curriculum content: every id here already exists
// in lib/topics.js with its own practice questions; this just says which
// subject bucket each one shows up under on the Practice page.

export const PRACTICE_GROUPS = {
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
};
