// lib/topics.js — the full roadmap content + small pure progress helpers.
//
// Shapes (Architecture.md):
//   PHASES:         [{ name, desc }]                (8, Phase 0..7)
//   TOPICS:         [{ id, num, phase, title, sub, subtopics, mini }]  (23)
//     subtopics:    [{ title, q: [{ t, d, p, u? }] }]   d = 'E'|'M'|'H'
//     mini:         { title, desc }                 checkpoint project
//   PHASE_PROJECTS: [{ title, desc }]               (8, one per phase)
//   CAPSTONE:       { title, desc }
//
// Real, well-known LeetCode problems get correct URLs. Framework/infra/frontend
// work uses concrete "Build task" exercises with no invented links.

const LC = (slug) => 'https://leetcode.com/problems/' + slug + '/';
const GFG = (q) => 'https://www.geeksforgeeks.org/?s=' + encodeURIComponent(q);

export const DIFF = { E: 'Easy', M: 'Medium', H: 'Hard' };

export const PHASES = [
  { name: 'Phase 0 — DSA & Algorithms', desc: 'Every core data structure and algorithm pattern, before a single line of framework code.' },
  { name: 'Phase 1 — Language & Foundations', desc: 'Get fluent in Java itself and the discipline around it before touching a framework.' },
  { name: 'Phase 2 — Data Layer', desc: 'Learn to model and query data correctly — this is where most backend bugs actually live.' },
  { name: 'Phase 3 — The Framework', desc: 'Spring Boot and REST — turn your data layer into a real, callable service.' },
  { name: 'Phase 4 — Production Hardening', desc: 'Secure it, test it — nothing ships without both.' },
  { name: 'Phase 5 — Scale & Ship', desc: 'Caching, queues, containers, pipelines — how a service survives real traffic.' },
  { name: 'Phase 6 — Think Like an Architect', desc: 'Zoom out from code to systems — and take it to the cloud.' },
  { name: 'Phase 7 — Frontend & Full-Stack', desc: 'Close the loop: build the interface that talks to everything you just built.' },
];

export const PHASE_PROJECTS = [
  { title: 'Phase Project — DSA Problem Tracker CLI', desc: 'A Java console app that logs solved problems by pattern/difficulty and shows your own progress stats — practice plus a real mini-tool.' },
  { title: 'Phase Project — CLI Inventory & Order Simulator', desc: 'A pure-Java console app (no Spring yet) applying OOP + SOLID + patterns, built with Gradle, version-controlled properly on GitHub.' },
  { title: 'Phase Project — Data Access Layer for a Bookstore', desc: 'A standalone JPA data layer over a normalized PostgreSQL schema, with tuned queries and zero N+1 issues.' },
  { title: 'Phase Project — CodeSense-style REST Service', desc: 'A documented, versioned, paginated Spring Boot REST API — the shape of a real placement-ready backend project.' },
  { title: 'Phase Project — Secured, Tested Booking API', desc: 'A booking/reservation API with JWT auth, RBAC, and a full unit + integration test suite.' },
  { title: 'Phase Project — Deployed, Event-Driven Service', desc: 'A containerized, cached, queue-driven service auto-deployed via GitHub Actions to your Azure VM.' },
  { title: 'Phase Project — System Design Portfolio', desc: 'Three written design docs (URL shortener, rate limiter, notification fan-out) — the artifact interviewers actually want to see.' },
  { title: 'Phase Project — Full-Stack Roadmap App', desc: 'A React + TypeScript frontend wired to your Spring Boot API with auth — essentially this Ledger, rebuilt on your own stack.' },
];

export const CAPSTONE = {
  title: 'The Capstone',
  desc:
    "A production-shaped capstone: a multi-module Spring Boot platform with JPA + PostgreSQL, secured with JWT, cached with Redis, event-driven with a message queue, fully tested, containerized, deployed via CI/CD, fronted by a React + TypeScript app, and documented with a system design doc — every topic on this page applied end to end.",
};

export const TOPICS = [
  // ---------------------------------------------------------------- Phase 0
  {
    id: 'dsa1', num: 1, phase: 0, title: 'DSA I — Foundations',
    sub: 'Arrays, strings, two pointers, sliding window, recursion — the patterns everything else is built on.',
    subtopics: [
      { title: 'Arrays & Strings', q: [
        { t: 'Two Sum', d: 'E', p: 'LeetCode', u: LC('two-sum') },
        { t: 'Best Time to Buy and Sell Stock', d: 'E', p: 'LeetCode', u: LC('best-time-to-buy-and-sell-stock') },
        { t: 'Contains Duplicate', d: 'E', p: 'LeetCode', u: LC('contains-duplicate') },
        { t: 'Maximum Subarray', d: 'M', p: 'LeetCode', u: LC('maximum-subarray') },
        { t: 'Product of Array Except Self', d: 'M', p: 'LeetCode', u: LC('product-of-array-except-self') },
        { t: 'Trapping Rain Water', d: 'H', p: 'LeetCode', u: LC('trapping-rain-water') } ] },
      { title: 'Two Pointers & Sliding Window', q: [
        { t: 'Valid Palindrome', d: 'E', p: 'LeetCode', u: LC('valid-palindrome') },
        { t: 'Two Sum II — Input Array Is Sorted', d: 'M', p: 'LeetCode', u: LC('two-sum-ii-input-array-is-sorted') },
        { t: '3Sum', d: 'M', p: 'LeetCode', u: LC('3sum') },
        { t: 'Container With Most Water', d: 'M', p: 'LeetCode', u: LC('container-with-most-water') },
        { t: 'Longest Substring Without Repeating Characters', d: 'M', p: 'LeetCode', u: LC('longest-substring-without-repeating-characters') },
        { t: 'Minimum Window Substring', d: 'H', p: 'LeetCode', u: LC('minimum-window-substring') } ] },
      { title: 'Recursion & Basic Math', q: [
        { t: 'Power of Two', d: 'E', p: 'LeetCode', u: LC('power-of-two') },
        { t: 'Fibonacci Number', d: 'E', p: 'LeetCode', u: LC('fibonacci-number') },
        { t: 'Pow(x, n)', d: 'M', p: 'LeetCode', u: LC('powx-n') },
        { t: 'Generate Parentheses', d: 'M', p: 'LeetCode', u: LC('generate-parentheses') },
        { t: 'Permutations', d: 'M', p: 'LeetCode', u: LC('permutations') } ] },
    ],
    mini: { title: 'Checkpoint Project — Custom Array/String Utility Kit', desc: "Implement your own mini-library (no built-ins): string reverse, palindrome check, array rotation, subarray sum — then benchmark against Java's built-ins." },
  },
  {
    id: 'dsa2', num: 2, phase: 0, title: 'DSA II — Core Data Structures',
    sub: 'Linked lists, stacks, queues, hashing, sorting and searching.',
    subtopics: [
      { title: 'Linked List', q: [
        { t: 'Reverse Linked List', d: 'E', p: 'LeetCode', u: LC('reverse-linked-list') },
        { t: 'Merge Two Sorted Lists', d: 'E', p: 'LeetCode', u: LC('merge-two-sorted-lists') },
        { t: 'Linked List Cycle', d: 'E', p: 'LeetCode', u: LC('linked-list-cycle') },
        { t: 'Remove Nth Node From End of List', d: 'M', p: 'LeetCode', u: LC('remove-nth-node-from-end-of-list') },
        { t: 'Add Two Numbers', d: 'M', p: 'LeetCode', u: LC('add-two-numbers') },
        { t: 'Reorder List', d: 'M', p: 'LeetCode', u: LC('reorder-list') } ] },
      { title: 'Stack & Queue', q: [
        { t: 'Valid Parentheses', d: 'E', p: 'LeetCode', u: LC('valid-parentheses') },
        { t: 'Min Stack', d: 'M', p: 'LeetCode', u: LC('min-stack') },
        { t: 'Evaluate Reverse Polish Notation', d: 'M', p: 'LeetCode', u: LC('evaluate-reverse-polish-notation') },
        { t: 'Daily Temperatures', d: 'M', p: 'LeetCode', u: LC('daily-temperatures') },
        { t: 'Largest Rectangle in Histogram', d: 'H', p: 'LeetCode', u: LC('largest-rectangle-in-histogram') } ] },
      { title: 'Hashing', q: [
        { t: 'Valid Anagram', d: 'E', p: 'LeetCode', u: LC('valid-anagram') },
        { t: 'Group Anagrams', d: 'M', p: 'LeetCode', u: LC('group-anagrams') },
        { t: 'Top K Frequent Elements', d: 'M', p: 'LeetCode', u: LC('top-k-frequent-elements') },
        { t: 'Subarray Sum Equals K', d: 'M', p: 'LeetCode', u: LC('subarray-sum-equals-k') },
        { t: 'Longest Consecutive Sequence', d: 'M', p: 'LeetCode', u: LC('longest-consecutive-sequence') } ] },
      { title: 'Sorting & Searching', q: [
        { t: 'Binary Search', d: 'E', p: 'LeetCode', u: LC('binary-search') },
        { t: 'Search Insert Position', d: 'E', p: 'LeetCode', u: LC('search-insert-position') },
        { t: 'Search in Rotated Sorted Array', d: 'M', p: 'LeetCode', u: LC('search-in-rotated-sorted-array') },
        { t: 'Find Minimum in Rotated Sorted Array', d: 'M', p: 'LeetCode', u: LC('find-minimum-in-rotated-sorted-array') },
        { t: 'Kth Largest Element in an Array', d: 'M', p: 'LeetCode', u: LC('kth-largest-element-in-an-array') },
        { t: 'Merge Intervals', d: 'M', p: 'LeetCode', u: LC('merge-intervals') } ] },
    ],
    mini: { title: 'Checkpoint Project — Build Your Own HashMap + Sort Visualizer', desc: 'Implement a HashMap from scratch (buckets + collision handling) and a small console tool that visualizes bubble/merge/quick sort step by step.' },
  },
  {
    id: 'dsa3', num: 3, phase: 0, title: 'DSA III — Trees, Graphs & Dynamic Programming',
    sub: 'The topics that decide most SDE interviews: trees, heaps, tries, graphs, DP, greedy, backtracking, bit manipulation.',
    subtopics: [
      { title: 'Trees & BST', q: [
        { t: 'Maximum Depth of Binary Tree', d: 'E', p: 'LeetCode', u: LC('maximum-depth-of-binary-tree') },
        { t: 'Invert Binary Tree', d: 'E', p: 'LeetCode', u: LC('invert-binary-tree') },
        { t: 'Validate Binary Search Tree', d: 'M', p: 'LeetCode', u: LC('validate-binary-search-tree') },
        { t: 'Binary Tree Level Order Traversal', d: 'M', p: 'LeetCode', u: LC('binary-tree-level-order-traversal') },
        { t: 'Lowest Common Ancestor of a BST', d: 'M', p: 'LeetCode', u: LC('lowest-common-ancestor-of-a-binary-search-tree') },
        { t: 'Serialize and Deserialize Binary Tree', d: 'H', p: 'LeetCode', u: LC('serialize-and-deserialize-binary-tree') } ] },
      { title: 'Heaps & Tries', q: [
        { t: 'Kth Largest Element in a Stream', d: 'E', p: 'LeetCode', u: LC('kth-largest-element-in-a-stream') },
        { t: 'Last Stone Weight', d: 'E', p: 'LeetCode', u: LC('last-stone-weight') },
        { t: 'Implement Trie (Prefix Tree)', d: 'M', p: 'LeetCode', u: LC('implement-trie-prefix-tree') },
        { t: 'Design Add and Search Words Data Structure', d: 'M', p: 'LeetCode', u: LC('design-add-and-search-words-data-structure') },
        { t: 'Find Median from Data Stream', d: 'H', p: 'LeetCode', u: LC('find-median-from-data-stream') } ] },
      { title: 'Graphs', q: [
        { t: 'Number of Islands', d: 'M', p: 'LeetCode', u: LC('number-of-islands') },
        { t: 'Clone Graph', d: 'M', p: 'LeetCode', u: LC('clone-graph') },
        { t: 'Course Schedule', d: 'M', p: 'LeetCode', u: LC('course-schedule') },
        { t: 'Rotting Oranges', d: 'M', p: 'LeetCode', u: LC('rotting-oranges') },
        { t: 'Pacific Atlantic Water Flow', d: 'M', p: 'LeetCode', u: LC('pacific-atlantic-water-flow') },
        { t: 'Network Delay Time', d: 'M', p: 'LeetCode', u: LC('network-delay-time') } ] },
      { title: 'Dynamic Programming & Greedy', q: [
        { t: 'Climbing Stairs', d: 'E', p: 'LeetCode', u: LC('climbing-stairs') },
        { t: 'House Robber', d: 'M', p: 'LeetCode', u: LC('house-robber') },
        { t: 'Coin Change', d: 'M', p: 'LeetCode', u: LC('coin-change') },
        { t: 'Longest Increasing Subsequence', d: 'M', p: 'LeetCode', u: LC('longest-increasing-subsequence') },
        { t: 'Word Break', d: 'M', p: 'LeetCode', u: LC('word-break') },
        { t: 'Jump Game', d: 'M', p: 'LeetCode', u: LC('jump-game') } ] },
      { title: 'Backtracking & Bit Manipulation', q: [
        { t: 'Subsets', d: 'M', p: 'LeetCode', u: LC('subsets') },
        { t: 'Combination Sum', d: 'M', p: 'LeetCode', u: LC('combination-sum') },
        { t: 'Word Search', d: 'M', p: 'LeetCode', u: LC('word-search') },
        { t: 'N-Queens', d: 'H', p: 'LeetCode', u: LC('n-queens') },
        { t: 'Single Number', d: 'E', p: 'LeetCode', u: LC('single-number') },
        { t: 'Number of 1 Bits', d: 'E', p: 'LeetCode', u: LC('number-of-1-bits') },
        { t: 'Counting Bits', d: 'E', p: 'LeetCode', u: LC('counting-bits') } ] },
    ],
    mini: { title: 'Combined Project — DSA Judge Engine', desc: 'A small Java engine that runs test cases against a solution class for graph/DP problems and reports pass/fail — a direct precursor to how a real online judge works.' },
  },

  // ---------------------------------------------------------------- Phase 1
  {
    id: 'java-core', num: 4, phase: 1, title: 'Java Core & OOP',
    sub: 'Syntax, collections, exceptions, streams, concurrency, the four pillars.',
    subtopics: [
      { title: 'Collections Framework', q: [
        { t: 'LRU Cache', d: 'M', p: 'LeetCode', u: LC('lru-cache') },
        { t: 'Insert Delete GetRandom O(1)', d: 'M', p: 'LeetCode', u: LC('insert-delete-getrandom-o1') },
        { t: 'Design a bounded blocking queue using core collections', d: 'H', p: 'Build task' } ] },
      { title: 'Exception Handling', q: [
        { t: 'Build a custom checked exception hierarchy for a banking app', d: 'E', p: 'Build task' },
        { t: 'Fix a try-with-resources leak in given code', d: 'M', p: 'Build task' },
        { t: 'Design a retry-with-backoff wrapper using custom exceptions', d: 'H', p: 'Build task' } ] },
      { title: 'Streams, Lambdas & Functional Interfaces', q: [
        { t: 'Sum all even numbers in a list using streams', d: 'E', p: 'HackerRank', u: 'https://www.hackerrank.com/domains/java' },
        { t: 'Group employees by department using Collectors.groupingBy', d: 'M', p: 'Build task' },
        { t: 'Implement a custom Collector for a running statistics summary', d: 'H', p: 'Build task' } ] },
      { title: 'Multithreading & Concurrency Basics', q: [
        { t: 'Print numbers alternately using two threads', d: 'M', p: 'GeeksforGeeks', u: GFG('print numbers alternately using two threads java') },
        { t: 'Implement a thread-safe counter without synchronized', d: 'M', p: 'Build task' },
        { t: 'Build a producer-consumer queue with wait/notify', d: 'H', p: 'Build task' } ] },
    ],
    mini: { title: 'Checkpoint Project — Console Library Manager', desc: 'CLI app using collections, streams and custom exceptions to manage books, members and due dates in memory.' },
  },
  {
    id: 'solid', num: 5, phase: 1, title: 'SOLID & Design Principles',
    sub: 'The 5 SOLID principles, DRY/KISS/YAGNI, and the patterns that show up in real codebases.',
    subtopics: [
      { title: 'Single Responsibility & Open/Closed', q: [
        { t: 'Identify SRP violations in a given 150-line class', d: 'E', p: 'Build task' },
        { t: 'Refactor a God class that handles orders, payments and emails', d: 'M', p: 'Build task' },
        { t: 'Add a new discount type without modifying existing code (OCP)', d: 'M', p: 'Build task' } ] },
      { title: 'Liskov, Interface Segregation & Dependency Inversion', q: [
        { t: 'Split a fat "Worker" interface into role-based interfaces', d: 'E', p: 'Build task' },
        { t: 'Fix a Rectangle/Square inheritance that breaks LSP', d: 'M', p: 'Build task' },
        { t: 'Invert a hard dependency on a concrete MySQL class', d: 'M', p: 'Build task' } ] },
      { title: 'Design Patterns', q: [
        { t: 'Implement a thread-safe Singleton (double-checked locking)', d: 'M', p: 'GeeksforGeeks', u: GFG('double checked locking singleton java') },
        { t: 'Build a payment method Strategy pattern (Card/UPI/Wallet)', d: 'M', p: 'Build task' },
        { t: 'Design an event notification system using Observer', d: 'H', p: 'Build task' } ] },
    ],
    mini: { title: 'Checkpoint Project — Pluggable Notification Engine', desc: 'A notification system (Email/SMS/Push) built entirely against SOLID: add a new channel without touching existing classes.' },
  },
  {
    id: 'build-tools', num: 6, phase: 1, title: 'Build Tools — Maven & Gradle',
    sub: 'Dependency management, build lifecycle, multi-module projects.',
    subtopics: [
      { title: 'Maven Fundamentals', q: [
        { t: 'Set up a multi-module Maven project (api + core + common)', d: 'M', p: 'Build task' },
        { t: 'Resolve a dependency version conflict using exclusions', d: 'M', p: 'Build task' },
        { t: 'Write a custom Maven profile for dev vs prod builds', d: 'H', p: 'Build task' } ] },
      { title: 'Gradle Fundamentals', q: [
        { t: 'Convert a Maven pom.xml project to Gradle (Kotlin DSL)', d: 'M', p: 'Build task' },
        { t: 'Set up Gradle build caching for faster CI builds', d: 'M', p: 'Build task' },
        { t: 'Write a custom Gradle task to generate a build-info file', d: 'H', p: 'Build task' } ] },
    ],
    mini: { title: 'Checkpoint Project — Multi-Module Utility Library', desc: 'A shared internal library split into modules (validation, logging, common-dto), built and versioned with Gradle.' },
  },
  {
    id: 'git', num: 7, phase: 1, title: 'Version Control — Git',
    sub: 'Branching, merge vs rebase, conflict resolution, PR discipline.',
    subtopics: [
      { title: 'Branching & Merging', q: [
        { t: 'Resolve a merge conflict in two divergent feature branches', d: 'E', p: 'Build task' },
        { t: 'Recover a deleted branch using reflog', d: 'M', p: 'Build task' },
        { t: 'Interactively rebase 5 commits into 2 clean commits', d: 'M', p: 'Build task' } ] },
      { title: 'Workflow & History Hygiene', q: [
        { t: 'Write a proper .gitignore for a Spring Boot + React monorepo', d: 'E', p: 'Build task' },
        { t: 'Squash and rewrite commit messages before a PR', d: 'M', p: 'Build task' },
        { t: 'Set up a pre-commit hook that blocks secrets from being committed', d: 'H', p: 'Build task' } ] },
    ],
    mini: { title: 'Checkpoint Project — Team Git Playbook', desc: 'A documented branching strategy (trunk-based or GitFlow) applied to one of your own repos, with hooks and PR templates.' },
  },

  // ---------------------------------------------------------------- Phase 2
  {
    id: 'sql-db', num: 8, phase: 2, title: 'Databases & SQL',
    sub: 'SQL fundamentals, PostgreSQL, transactions, ACID, indexing, query tuning.',
    subtopics: [
      { title: 'Core SQL & Joins', q: [
        { t: 'Combine Two Tables', d: 'E', p: 'LeetCode', u: LC('combine-two-tables') },
        { t: 'Second Highest Salary', d: 'M', p: 'LeetCode', u: LC('second-highest-salary') },
        { t: 'Duplicate Emails', d: 'E', p: 'LeetCode', u: LC('duplicate-emails') },
        { t: 'Customers Who Never Order', d: 'E', p: 'LeetCode', u: LC('customers-who-never-order') },
        { t: 'Employees Earning More Than Their Managers', d: 'E', p: 'LeetCode', u: LC('employees-earning-more-than-their-managers') },
        { t: 'Rank Scores', d: 'M', p: 'LeetCode', u: LC('rank-scores') },
        { t: 'Department Highest Salary', d: 'M', p: 'LeetCode', u: LC('department-highest-salary') },
        { t: 'Department Top Three Salaries', d: 'H', p: 'LeetCode', u: LC('department-top-three-salaries') } ] },
      { title: 'Normalization & Schema Design', q: [
        { t: 'Model a many-to-many tags system with a junction table', d: 'E', p: 'Build task' },
        { t: 'Normalize a flat orders table to 3NF', d: 'M', p: 'Build task' },
        { t: 'Design a schema for a library system with borrowing history', d: 'M', p: 'Build task' } ] },
      { title: 'Transactions, ACID & Indexing', q: [
        { t: 'Explain and demonstrate a dirty read with two transactions', d: 'M', p: 'Build task' },
        { t: 'Add the right index to fix a slow query (EXPLAIN ANALYZE)', d: 'M', p: 'Build task' },
        { t: 'Simulate and resolve a deadlock between two transactions', d: 'H', p: 'Build task' } ] },
    ],
    mini: { title: 'Checkpoint Project — Schema + Query Tuning Lab', desc: 'Design a normalized PostgreSQL schema for an e-commerce store, then deliberately break and fix slow queries with indexes.' },
  },
  {
    id: 'jpa', num: 9, phase: 2, title: 'Hibernate / JPA',
    sub: 'Entities, relationships, JPQL, lazy vs eager, the N+1 problem, caching.',
    subtopics: [
      { title: 'Entities & Relationships', q: [
        { t: 'Model a OneToMany between Order and OrderItem correctly', d: 'E', p: 'Build task' },
        { t: 'Fix a bidirectional ManyToMany causing infinite JSON recursion', d: 'M', p: 'Build task' },
        { t: 'Implement a self-referencing entity (Employee → Manager)', d: 'M', p: 'Build task' } ] },
      { title: 'Querying — JPQL, Criteria, Native', q: [
        { t: 'Write a JPQL query with joins and a WHERE on a nested field', d: 'E', p: 'Build task' },
        { t: 'Write a native query with pagination for a report', d: 'M', p: 'Build task' },
        { t: 'Build a dynamic search filter using the Criteria API', d: 'H', p: 'Build task' } ] },
      { title: 'Lazy vs Eager, N+1, Caching', q: [
        { t: 'Diagnose and fix an N+1 query using a given repository', d: 'M', p: 'Build task' },
        { t: 'Switch a relation from EAGER to LAZY without breaking a DTO mapper', d: 'M', p: 'Build task' },
        { t: 'Enable second-level cache for a read-heavy entity', d: 'H', p: 'Build task' } ] },
    ],
    mini: { title: 'Checkpoint Project — Inventory Persistence Layer', desc: 'A JPA layer for a warehouse system: entities, relationships, and one deliberately-fixed N+1 problem with before/after query logs.' },
  },

  // ---------------------------------------------------------------- Phase 3
  {
    id: 'spring', num: 10, phase: 3, title: 'Spring Core & Spring Boot',
    sub: 'IoC/DI, bean lifecycle, layered architecture, configuration, validation.',
    subtopics: [
      { title: 'IoC, DI & Bean Lifecycle', q: [
        { t: 'Convert field injection to constructor injection across a service', d: 'E', p: 'Build task' },
        { t: 'Resolve a circular dependency between two @Service beans', d: 'M', p: 'Build task' },
        { t: 'Write a custom @Configuration with @Bean and scopes (singleton/prototype)', d: 'M', p: 'Build task' } ] },
      { title: 'Layered Architecture & Config', q: [
        { t: 'Split a fat Controller into Controller/Service/Repository layers', d: 'E', p: 'Build task' },
        { t: 'Set up application-dev.yml and application-prod.yml with profiles', d: 'M', p: 'Build task' },
        { t: 'Externalize secrets using environment variables + @ConfigurationProperties', d: 'M', p: 'Build task' } ] },
      { title: 'Exception Handling & Validation', q: [
        { t: 'Build a global exception handler with @ControllerAdvice', d: 'M', p: 'Build task' },
        { t: 'Add request validation with @Valid and custom annotations', d: 'M', p: 'Build task' },
        { t: 'Return structured error responses (RFC 7807 style)', d: 'H', p: 'Build task' } ] },
    ],
    mini: { title: 'Checkpoint Project — Task Manager Service (Spring Boot)', desc: 'A clean layered Spring Boot service for tasks/projects, profile-based config, global exception handling.' },
  },
  {
    id: 'rest', num: 11, phase: 3, title: 'REST API Design',
    sub: 'HTTP fundamentals, DTOs, versioning, pagination, OpenAPI docs.',
    subtopics: [
      { title: 'HTTP Semantics & Status Codes', q: [
        { t: 'Map CRUD operations to correct HTTP verbs and status codes', d: 'E', p: 'Build task' },
        { t: 'Design idempotent PUT vs non-idempotent POST endpoints', d: 'M', p: 'Build task' },
        { t: 'Implement proper 4xx vs 5xx handling for a payments endpoint', d: 'M', p: 'Build task' } ] },
      { title: 'DTOs, Versioning & Pagination', q: [
        { t: 'Map Entity → DTO to avoid leaking internal fields', d: 'E', p: 'Build task' },
        { t: 'Version an API using URI vs header-based versioning', d: 'M', p: 'Build task' },
        { t: 'Add cursor-based pagination to a large listing endpoint', d: 'H', p: 'Build task' } ] },
      { title: 'Documentation & Contracts', q: [
        { t: 'Document an API fully with springdoc-openapi/Swagger', d: 'E', p: 'Build task' },
        { t: 'Write a Postman collection with environment variables', d: 'E', p: 'Build task' },
        { t: 'Design a consistent error-response contract across all endpoints', d: 'M', p: 'Build task' } ] },
    ],
    mini: { title: 'Combined Project — Task Manager REST API', desc: 'Turn the Spring Boot checkpoint project into a documented, versioned, paginated REST API with Postman + Swagger.' },
  },

  // ---------------------------------------------------------------- Phase 4
  {
    id: 'security', num: 12, phase: 4, title: 'Security',
    sub: 'AuthN vs AuthZ, Spring Security, JWT, OAuth2 basics, password hashing, CORS.',
    subtopics: [
      { title: 'Authentication vs Authorization', q: [
        { t: 'Hash and verify passwords using BCrypt', d: 'E', p: 'Build task' },
        { t: 'Implement role-based access control (USER vs ADMIN)', d: 'M', p: 'Build task' },
        { t: 'Explain and fix a broken access control endpoint (OWASP #1)', d: 'M', p: 'Build task' } ] },
      { title: 'Spring Security & JWT', q: [
        { t: 'Set up Spring Security with a custom UserDetailsService', d: 'M', p: 'Build task' },
        { t: 'Add method-level security with @PreAuthorize', d: 'M', p: 'Build task' },
        { t: 'Issue and validate JWT access + refresh tokens', d: 'H', p: 'Build task' } ] },
      { title: 'OAuth2 & CORS', q: [
        { t: 'Configure CORS correctly for a React frontend calling your API', d: 'E', p: 'Build task' },
        { t: 'Explain the OAuth2 authorization code flow with a diagram', d: 'M', p: 'Build task' },
        { t: 'Add rate limiting to a login endpoint to block brute force', d: 'H', p: 'Build task' } ] },
    ],
    mini: { title: 'Checkpoint Project — Auth Service', desc: 'A standalone authentication microservice: signup, login, JWT issuing, role-based route protection.' },
  },
  {
    id: 'testing', num: 13, phase: 4, title: 'Testing',
    sub: 'JUnit, Mockito, unit vs integration, coverage, TDD basics.',
    subtopics: [
      { title: 'Unit Testing with JUnit & Mockito', q: [
        { t: 'Write unit tests for a Service class mocking the Repository', d: 'E', p: 'Build task' },
        { t: 'Test exception paths using assertThrows', d: 'E', p: 'Build task' },
        { t: 'Mock an external API call using Mockito and verify interactions', d: 'M', p: 'Build task' } ] },
      { title: 'Integration Testing', q: [
        { t: 'Write a @SpringBootTest with an in-memory H2 database', d: 'M', p: 'Build task' },
        { t: 'Test a REST controller end-to-end with MockMvc', d: 'M', p: 'Build task' },
        { t: 'Set up Testcontainers to run tests against real PostgreSQL', d: 'H', p: 'Build task' } ] },
      { title: 'TDD & Coverage', q: [
        { t: 'Get a service class to 90%+ coverage with JaCoCo', d: 'E', p: 'Build task' },
        { t: 'Build one feature strictly red-green-refactor (TDD)', d: 'M', p: 'Build task' },
        { t: 'Identify untested edge cases in an existing class', d: 'M', p: 'Build task' } ] },
    ],
    mini: { title: 'Combined Project — Fully Tested Auth Service', desc: 'Add a complete unit + integration test suite (with Testcontainers) to the Auth Service project.' },
  },

  // ---------------------------------------------------------------- Phase 5
  {
    id: 'cache-mq', num: 14, phase: 5, title: 'Caching & Messaging',
    sub: 'Redis basics and a message queue (Kafka or RabbitMQ).',
    subtopics: [
      { title: 'Redis Caching', q: [
        { t: 'Cache a slow DB read endpoint with Redis + TTL', d: 'E', p: 'Build task' },
        { t: 'Implement cache invalidation on update (write-through)', d: 'M', p: 'Build task' },
        { t: 'Handle a cache stampede with locking or request coalescing', d: 'H', p: 'Build task' } ] },
      { title: 'Message Queues (pick Kafka or RabbitMQ)', q: [
        { t: 'Publish and consume a simple event (OrderPlaced)', d: 'E', p: 'Build task' },
        { t: 'Design an async email-notification consumer decoupled from the API', d: 'M', p: 'Build task' },
        { t: 'Implement a dead-letter queue for failed message processing', d: 'H', p: 'Build task' } ] },
    ],
    mini: { title: 'Checkpoint Project — Order Events Pipeline', desc: 'Orders published as events, consumed asynchronously to update inventory and send notifications, with Redis caching on reads.' },
  },
  {
    id: 'docker', num: 15, phase: 5, title: 'Docker & Containers',
    sub: 'Dockerfile basics, docker-compose, containerizing Spring Boot.',
    subtopics: [
      { title: 'Dockerfile Fundamentals', q: [
        { t: 'Pass environment-specific config into a container at runtime', d: 'E', p: 'Build task' },
        { t: 'Write a multi-stage Dockerfile for a Spring Boot app', d: 'M', p: 'Build task' },
        { t: 'Reduce a Java image size using a slim/distroless base', d: 'M', p: 'Build task' } ] },
      { title: 'docker-compose & Networking', q: [
        { t: 'Set up a named volume so DB data survives container restarts', d: 'E', p: 'Build task' },
        { t: 'Compose an app + PostgreSQL + Redis stack with one command', d: 'M', p: 'Build task' },
        { t: "Debug why two containers on different networks can't talk", d: 'M', p: 'Build task' } ] },
    ],
    mini: { title: 'Checkpoint Project — Fully Containerized Stack', desc: 'Package the Order Events Pipeline (API + DB + Redis + MQ) into a single docker-compose stack.' },
  },
  {
    id: 'cicd', num: 16, phase: 5, title: 'CI/CD & Deployment',
    sub: 'GitHub Actions, deployment strategy, environment configs, basic monitoring.',
    subtopics: [
      { title: 'GitHub Actions', q: [
        { t: 'Write a workflow that runs tests on every PR', d: 'E', p: 'Build task' },
        { t: 'Add a build-and-push-to-registry job on merge to main', d: 'M', p: 'Build task' },
        { t: 'Set up a matrix build across two Java versions', d: 'M', p: 'Build task' } ] },
      { title: 'Deployment & Monitoring', q: [
        { t: 'Add structured logging and a /health endpoint', d: 'E', p: 'Build task' },
        { t: 'Deploy a container to a VM with a zero-downtime restart script', d: 'M', p: 'Build task' },
        { t: 'Set up a basic alert for high error rate or downtime', d: 'H', p: 'Build task' } ] },
    ],
    mini: { title: 'Combined Project — Auto-Deployed Stack', desc: 'Full CI/CD: push to main → tests run → image built → deployed to your Azure VM automatically.' },
  },

  // ---------------------------------------------------------------- Phase 6
  {
    id: 'sysdesign', num: 17, phase: 6, title: 'System Design Basics',
    sub: 'Scalability, load balancing, caching strategy, monoliths vs microservices, API gateways.',
    subtopics: [
      { title: 'Scalability Concepts', q: [
        { t: 'Explain vertical vs horizontal scaling with a real scenario', d: 'E', p: 'Build task' },
        { t: 'Design a URL shortener (traffic estimate, schema, scaling)', d: 'M', p: 'Build task' },
        { t: 'Design a rate limiter (token bucket vs sliding window)', d: 'H', p: 'Build task' } ] },
      { title: 'Monoliths, Microservices & Gateways', q: [
        { t: 'Decide monolith vs microservices for a given product spec', d: 'M', p: 'Build task' },
        { t: 'Design an API gateway routing to 3 backend services', d: 'M', p: 'Build task' },
        { t: 'Design a notification system for millions of users (fan-out)', d: 'H', p: 'Build task' } ] },
    ],
    mini: { title: 'Checkpoint Project — Design Doc: Your App at Scale', desc: 'Write a real system design doc for scaling one of your projects to 100k concurrent users — bottlenecks, caching, queueing.' },
  },
  {
    id: 'cloud', num: 18, phase: 6, title: 'Cloud Fundamentals',
    sub: 'Core AWS/Azure services for backend: compute, storage, managed databases.',
    subtopics: [
      { title: 'Compute & Storage', q: [
        { t: 'Deploy a Spring Boot app to a fresh Azure VM from scratch', d: 'E', p: 'Build task' },
        { t: 'Set up object storage (Azure Blob/S3) for file uploads', d: 'M', p: 'Build task' },
        { t: 'Configure autoscaling rules for a compute instance group', d: 'H', p: 'Build task' } ] },
      { title: 'Managed Databases & Networking', q: [
        { t: 'Configure a firewall/security group to only allow needed ports', d: 'E', p: 'Build task' },
        { t: 'Migrate a local PostgreSQL DB to a managed cloud DB instance', d: 'M', p: 'Build task' },
        { t: 'Set up a VPC/VNet with public and private subnets', d: 'H', p: 'Build task' } ] },
    ],
    mini: { title: 'Checkpoint Project — Cloud-Native Redeploy', desc: 'Re-architect one of your deployments using a managed DB + blob storage + proper network security groups.' },
  },

  // ---------------------------------------------------------------- Phase 7
  {
    id: 'html-css', num: 19, phase: 7, title: 'HTML, CSS & Responsive Design',
    sub: 'Semantic markup, accessibility, Flexbox/Grid layout, responsive breakpoints.',
    subtopics: [
      { title: 'Semantic HTML & Accessibility', q: [
        { t: 'Rebuild a div-soup page using semantic landmark elements', d: 'E', p: 'Build task' },
        { t: 'Make a custom form fully keyboard- and screen-reader-accessible', d: 'M', p: 'Build task' },
        { t: 'Audit a page against WCAG AA (contrast, alt text, focus order)', d: 'M', p: 'Build task' } ] },
      { title: 'CSS Layout (Flexbox & Grid)', q: [
        { t: 'Build a holy-grail layout with CSS Grid', d: 'E', p: 'Build task' },
        { t: 'Recreate a pricing-cards row that wraps cleanly with Flexbox', d: 'M', p: 'Build task' },
        { t: 'Build a responsive image gallery with grid-auto-fit/minmax', d: 'M', p: 'Build task' } ] },
      { title: 'Responsive Design & Media Queries', q: [
        { t: 'Make a fixed desktop layout mobile-first with media queries', d: 'E', p: 'Build task' },
        { t: 'Build a navbar that collapses to a hamburger under 768px', d: 'M', p: 'Build task' },
        { t: 'Use clamp()/min()/max() for fluid typography and spacing', d: 'M', p: 'Build task' } ] },
    ],
    mini: { title: 'Checkpoint Project — Responsive Landing Page', desc: 'A pixel-clean, fully responsive, accessible landing page built with semantic HTML and Grid/Flexbox — no framework.' },
  },
  {
    id: 'js-dom', num: 20, phase: 7, title: 'JavaScript Core & DOM',
    sub: 'Language fundamentals, ES6+, DOM manipulation, events, async patterns.',
    subtopics: [
      { title: 'JS Fundamentals & ES6+', q: [
        { t: 'Predict and explain output of tricky closure/hoisting snippets', d: 'E', p: 'Build task' },
        { t: 'Reimplement map/filter/reduce from scratch on arrays', d: 'M', p: 'Build task' },
        { t: 'Deep-clone a nested object without structuredClone', d: 'M', p: 'Build task' } ] },
      { title: 'DOM Manipulation & Events', q: [
        { t: 'Build a to-do list with add/remove/toggle, no framework', d: 'E', p: 'Build task' },
        { t: 'Implement event delegation for a dynamic list', d: 'M', p: 'Build task' },
        { t: 'Build a debounced live-search input against a mock API', d: 'M', p: 'Build task' } ] },
      { title: 'Async JavaScript', q: [
        { t: 'Rewrite a callback pyramid using async/await', d: 'E', p: 'Build task' },
        { t: 'Fetch and render data with proper loading + error states', d: 'M', p: 'Build task' },
        { t: 'Implement Promise.all with a concurrency limit', d: 'H', p: 'Build task' } ] },
    ],
    mini: { title: 'Checkpoint Project — Vanilla JS Weather Dashboard', desc: 'A no-framework app that fetches a weather API, handles loading/error states, and updates the DOM reactively.' },
  },
  {
    id: 'typescript', num: 21, phase: 7, title: 'TypeScript Fundamentals',
    sub: 'Types, interfaces, generics, and the advanced type features that matter in React.',
    subtopics: [
      { title: 'Types & Interfaces', q: [
        { t: 'Type a messy JS module with interfaces and unions', d: 'E', p: 'Build task' },
        { t: 'Model an API response with nested/optional fields as types', d: 'M', p: 'Build task' },
        { t: 'Replace all `any` in a small codebase with precise types', d: 'M', p: 'Build task' } ] },
      { title: 'Advanced TS', q: [
        { t: 'Write a generic function with constrained type parameters', d: 'M', p: 'Build task' },
        { t: 'Use utility types (Partial, Pick, Omit, Record) to derive types', d: 'M', p: 'Build task' },
        { t: 'Build a discriminated union + exhaustive switch with never', d: 'H', p: 'Build task' } ] },
    ],
    mini: { title: 'Checkpoint Project — Typed API Client', desc: 'A small, fully-typed API client wrapper with generics for requests/responses and no `any` anywhere.' },
  },
  {
    id: 'react-fundamentals', num: 22, phase: 7, title: 'React Fundamentals',
    sub: 'Components, props, state, hooks, forms, and the render model.',
    subtopics: [
      { title: 'Components & Props', q: [
        { t: 'Break a static page into reusable, prop-driven components', d: 'E', p: 'Build task' },
        { t: 'Build a reusable Card/List with children and render props', d: 'M', p: 'Build task' },
        { t: 'Lift state up to share data between two sibling components', d: 'M', p: 'Build task' } ] },
      { title: 'State & Hooks', q: [
        { t: 'Build a counter/toggle with useState correctly (no stale state)', d: 'E', p: 'Build task' },
        { t: 'Fetch data in useEffect with cleanup and a loading state', d: 'M', p: 'Build task' },
        { t: 'Extract shared logic into a custom hook (e.g. useLocalStorage)', d: 'M', p: 'Build task' } ] },
      { title: 'Forms & Events', q: [
        { t: 'Build a controlled form with validation and error messages', d: 'E', p: 'Build task' },
        { t: 'Handle a multi-field form with a single state object + reducer', d: 'M', p: 'Build task' },
        { t: 'Debounce a search field and cancel stale requests', d: 'M', p: 'Build task' } ] },
    ],
    mini: { title: 'Checkpoint Project — React Task Board', desc: 'A component-driven task board (add/edit/complete) with custom hooks and controlled forms — no state library yet.' },
  },
  {
    id: 'react-advanced', num: 23, phase: 7, title: 'React Advanced & State Management',
    sub: 'Context, global state, performance, routing, and data fetching.',
    subtopics: [
      { title: 'Context API & Global State', q: [
        { t: 'Replace deep prop-drilling with a Context provider', d: 'E', p: 'Build task' },
        { t: 'Build an auth context with login/logout and a protected route', d: 'M', p: 'Build task' },
        { t: 'Model complex global state with useReducer + Context', d: 'M', p: 'Build task' } ] },
      { title: 'Performance', q: [
        { t: 'Find and fix an unnecessary-rerender bug with the Profiler', d: 'M', p: 'Build task' },
        { t: 'Apply memo/useMemo/useCallback where they actually help', d: 'M', p: 'Build task' },
        { t: 'Virtualize a long list to keep scrolling smooth', d: 'H', p: 'Build task' } ] },
      { title: 'Routing & Data Fetching', q: [
        { t: 'Set up multi-page routing with nested routes and params', d: 'E', p: 'Build task' },
        { t: 'Add data fetching with cache + revalidation (e.g. React Query)', d: 'M', p: 'Build task' },
        { t: 'Handle loading/error/empty states for a paginated list', d: 'M', p: 'Build task' } ] },
    ],
    mini: { title: 'Checkpoint Project — Full-Stack Frontend', desc: 'A routed React + TS app with auth context, global state, cached data fetching, and real loading/error states — wired to a real API.' },
  },
];

// --- Pure progress helpers (used by dashboard, topic pages, LeetCode bank) ---

export function qid(topicId, si, qi) {
  return topicId + '::' + si + '::' + qi;
}

export function totalQuestions() {
  let t = 0;
  TOPICS.forEach((top) => top.subtopics.forEach((s) => (t += s.q.length)));
  return t;
}

export function solvedCount(progress) {
  return Object.values(progress || {}).filter(Boolean).length;
}

// { c: solved, t: total } for one topic given the progress map.
export function topicSolved(top, progress) {
  let c = 0;
  let t = 0;
  top.subtopics.forEach((s, si) =>
    s.q.forEach((q, qi) => {
      t++;
      if (progress && progress[qid(top.id, si, qi)]) c++;
    })
  );
  return { c, t };
}

export function topicComplete(top, progress) {
  const { c, t } = topicSolved(top, progress);
  return t > 0 && c === t;
}
