// lib/roadmaps.js — the career/roadmap registry. This is the one place that
// knows there are two roadmaps; everything else (topic page, dashboard,
// quiz block) works generically off whichever roadmap/topic it's handed.

import * as java from './topics.js';
import * as ai from './topics-ai.js';

export const CAREERS = [
  {
    id: 'java-developer',
    label: 'Java Developer',
    tagline: 'Java → Spring → Backend → Databases → System Design',
    pitch: 'DSA and core Java first, then Spring Boot, databases, security and testing, then scale, system design, and a frontend layer to close the loop.',
  },
  {
    id: 'ai-engineer',
    label: 'AI Engineer',
    tagline: 'Python → ML → Deep Learning → LLMs → RAG → AI Agents',
    pitch: 'Python and math foundations, classical ML and deep learning, then the modern LLM stack — RAG, agents, fine-tuning, and shipping a model to production.',
  },
];

export const ROADMAPS = {
  'java-developer': {
    id: 'java-developer',
    label: 'Java Developer',
    phases: java.PHASES,
    topics: java.TOPICS,
    phaseProjects: java.PHASE_PROJECTS,
    capstone: java.CAPSTONE,
  },
  'ai-engineer': {
    id: 'ai-engineer',
    label: 'AI Engineer',
    phases: ai.PHASES,
    topics: ai.TOPICS,
    phaseProjects: ai.PHASE_PROJECTS,
    capstone: ai.CAPSTONE,
  },
};

export function getRoadmap(careerId) {
  return ROADMAPS[careerId] || null;
}

export function getCareer(careerId) {
  return CAREERS.find((c) => c.id === careerId) || null;
}

// A topic id is only ever defined in one roadmap — find which one owns it so
// /topic/[id] can stay a single flat route without a career segment in the URL.
export function findTopicRoadmap(topicId) {
  for (const career of CAREERS) {
    const roadmap = ROADMAPS[career.id];
    const topic = roadmap.topics.find((t) => t.id === topicId);
    if (topic) return { roadmap, topic };
  }
  return { roadmap: null, topic: null };
}

// Job-readiness checklist config per career — each item is "done" when every
// topic it lists is complete (topicComplete from lib/topics.js). Grouped by
// named skill area (matching how a hiring manager would actually describe
// what's been learned), not 1:1 with the internal phase structure.
export const READINESS_CHECKLIST = {
  'java-developer': [
    { label: 'Java Core', topicIds: ['java-fundamentals', 'java-core', 'solid'] },
    { label: 'DSA', topicIds: ['dsa1', 'dsa2', 'dsa3', 'dsa4', 'dsa5', 'dsa6'] },
    { label: 'SQL & Databases', topicIds: ['sql-db', 'jpa', 'nosql'] },
    { label: 'Spring Boot', topicIds: ['spring'] },
    { label: 'REST APIs', topicIds: ['rest'] },
    { label: 'Security', topicIds: ['security'] },
    { label: 'Testing', topicIds: ['testing'] },
    { label: 'Docker', topicIds: ['docker', 'kubernetes', 'cicd'] },
    { label: 'System Design', topicIds: ['sysdesign', 'cloud'] },
    { label: 'Interview Questions', interviewTrack: 'java' },
    { label: 'Projects', projectsCareer: 'java-developer' },
  ],
  'ai-engineer': [
    { label: 'Python', topicIds: ['python-fundamentals'] },
    { label: 'Mathematics', topicIds: ['ai-math'] },
    { label: 'Machine Learning', topicIds: ['ml-supervised', 'ml-unsupervised'] },
    { label: 'Deep Learning', topicIds: ['dl-foundations', 'dl-architectures', 'pytorch'] },
    { label: 'NLP', topicIds: ['nlp'] },
    { label: 'LLMs', topicIds: ['genai'] },
    { label: 'RAG', topicIds: ['rag'] },
    { label: 'Agents', topicIds: ['ai-agents'] },
    { label: 'Evaluation', topicIds: ['ai-frameworks'] },
    { label: 'Deployment', topicIds: ['fine-tuning', 'mlops'] },
    { label: 'Interview Questions', interviewTrack: 'ai' },
    { label: 'Projects', projectsCareer: 'ai-engineer' },
  ],
};
