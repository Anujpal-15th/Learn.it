// lib/topics.js — the full roadmap content + small pure progress helpers.
//
// Shapes (Architecture.md, extended per user-directed content overhauls):
//   PHASES:         [{ name, desc, learnMore?: {label,url} }]   (8, Phase 0..7)
//   TOPICS:         [{ id, num, phase, title, sub, learnMore?: {label,url}, subtopics, mini }]  (27)
//     subtopics:    [{ title, concepts: [...], learnMore?: {label,url}, q: [{ t, d, p, u? }] }]
//       - concepts: short "what to learn" primer, rendered above the questions
//         so a subtopic teaches before it tests.
//       - learnMore: one optional deeper-reading link (subtopic, topic, and
//         phase level all support their own learnMore).
//       - d = 'E'|'M'|'H'
//     mini:         { title, desc }                 checkpoint project
//   PHASE_PROJECTS: [{ title, desc }]               (8, one per phase)
//   CAPSTONE:       { title, desc }
//
// Phase order (v3): Language & Foundations comes BEFORE DSA — you need Java
// fluency to write DSA solutions at all, so DSA is no longer the very first
// thing a beginner hits. DSA still covers the real, industry-standard
// 18-pattern breakdown (NeetCode 150 / Blind 75 taxonomy), now expanded to
// 15-20 verified questions per pattern where that many genuinely exist —
// a few small patterns (Tries, Heaps, Advanced Graphs, Intervals, Bit
// Manipulation) have a naturally smaller real problem pool and are capped
// honestly rather than padded with invented links.
//
// New subtopics added in this pass close specific gaps: JVM memory/GC,
// modern Java syntax (enums/var/records), networking foundations, common web
// vulnerabilities (SQLi/XSS/CSRF), observability (Actuator/logging/metrics),
// distributed-systems resilience (CAP/circuit breakers/idempotency/CDN), and
// database operations (connection pooling/migrations/replication). All new
// subtopics are appended at the end of their topic's subtopics array (not
// inserted in the middle) so existing progress on already-existing
// subtopics/questions is never disturbed by an index shift.

const LC = (slug) => 'https://leetcode.com/problems/' + slug + '/';
const GFG = (q) => 'https://www.geeksforgeeks.org/?s=' + encodeURIComponent(q);
const HR = (slug) => 'https://www.hackerrank.com/challenges/' + slug + '/problem';

export const DIFF = { E: 'Easy', M: 'Medium', H: 'Hard' };

export const PHASES = [
  { name: 'Phase 0 — Language & Foundations', desc: 'Get fluent in Java itself and the discipline around it before anything else — DSA, frameworks, all of it depend on this.', learnMore: { label: 'Oracle — The Java Tutorials', url: 'https://docs.oracle.com/javase/tutorial/' } },
  { name: 'Phase 1 — DSA & Algorithms', desc: 'Now that Java itself isn\'t a barrier: every core data structure and algorithm pattern, before a single line of framework code.', learnMore: { label: 'NeetCode — DSA Roadmap', url: 'https://neetcode.io/roadmap' } },
  { name: 'Phase 2 — Data Layer', desc: 'Learn to model and query data correctly — this is where most backend bugs actually live.', learnMore: { label: 'PostgreSQL Tutorial', url: 'https://www.postgresql.org/docs/current/tutorial.html' } },
  { name: 'Phase 3 — The Framework', desc: 'Spring Boot and REST — turn your data layer into a real, callable service.', learnMore: { label: 'Spring Boot Reference Docs', url: 'https://docs.spring.io/spring-boot/documentation.html' } },
  { name: 'Phase 4 — Production Hardening', desc: 'Secure it, test it — nothing ships without both.', learnMore: { label: 'OWASP Top Ten', url: 'https://owasp.org/www-project-top-ten/' } },
  { name: 'Phase 5 — Scale & Ship', desc: 'Caching, queues, containers, pipelines — how a service survives real traffic.', learnMore: { label: 'Docker — Get Started', url: 'https://docs.docker.com/get-started/' } },
  { name: 'Phase 6 — Think Like an Architect', desc: 'Zoom out from code to systems — and take it to the cloud.', learnMore: { label: 'The System Design Primer', url: 'https://github.com/donnemartin/system-design-primer' } },
  { name: 'Phase 7 — Frontend & Full-Stack', desc: 'Close the loop: build the interface that talks to everything you just built.', learnMore: { label: 'MDN Web Docs', url: 'https://developer.mozilla.org/en-US/docs/Web' } },
];

export const PHASE_PROJECTS = [
  { title: 'Phase Project — CLI Inventory & Order Simulator', desc: 'A pure-Java console app (no Spring yet) applying OOP + SOLID + patterns, built with Gradle, version-controlled properly on GitHub.' },
  { title: 'Phase Project — DSA Problem Tracker CLI', desc: 'A Java console app that logs solved problems by pattern/difficulty and shows your own progress stats — practice plus a real mini-tool.' },
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
  // ==================================================================
  // PHASE 0 — LANGUAGE & FOUNDATIONS
  // ==================================================================
  {
    id: 'java-fundamentals', num: 1, phase: 0, title: 'Java Fundamentals — Syntax & OOP Basics',
    sub: "Before Collections, Streams, or Spring — and before DSA: variables, operators, control flow, modern syntax, and the four OOP pillars. If you can't explain these, nothing later in the roadmap will make sense.",
    learnMore: { label: 'Oracle — Language Basics Trail', url: 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/index.html' },
    subtopics: [
      { title: 'Variables & Data Types',
        concepts: [
          'Java is statically typed: every variable has a fixed type declared up front (int, double, boolean, String, ...) that the compiler checks before the program ever runs.',
          'Primitives (int, long, double, char, boolean) store raw values directly; everything else (String, arrays, objects) is a reference to memory elsewhere.',
          'Know the default values (0, false, null), the difference between int and Integer (autoboxing), and why == on objects compares references, not content.',
        ],
        learnMore: { label: 'Oracle — Java Variables Tutorial', url: 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/variables.html' },
        q: [
          { t: 'Welcome to Java!', d: 'E', p: 'HackerRank', u: HR('welcome-to-java') },
          { t: 'Java Datatypes', d: 'E', p: 'HackerRank', u: HR('java-datatypes') },
          { t: 'Java Output Formatting', d: 'E', p: 'HackerRank', u: HR('java-output-formatting') },
          { t: 'Write a program that demonstrates primitive vs. reference-type behavior when passed to a method', d: 'E', p: 'Build task' },
        ] },
      { title: 'Operators & Control Flow',
        concepts: [
          'Arithmetic, relational, logical, and assignment operators combine into expressions — know operator precedence well enough to predict output without running the code.',
          'if/else and switch pick one branch; for/while/do-while repeat a block — every algorithm you\'ll ever write is built from just these primitives.',
          'A modern switch expression (Java 14+) can return a value directly, replacing a lot of fall-through-prone switch statements.',
        ],
        learnMore: { label: 'Oracle — Control Flow Statements', url: 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/flow.html' },
        q: [
          { t: 'Java If-Else', d: 'E', p: 'HackerRank', u: HR('java-if-else') },
          { t: 'Java Loops I', d: 'E', p: 'HackerRank', u: HR('java-loops-i') },
          { t: 'Java Loops II', d: 'M', p: 'HackerRank', u: HR('java-loops-ii') },
          { t: 'Write a program using a switch expression to classify a numeric grade into A/B/C/D/F', d: 'E', p: 'Build task' },
        ] },
      { title: 'OOP Pillars',
        concepts: [
          'Encapsulation: keep fields private, expose behavior through methods — an object controls its own state instead of letting outside code mutate it directly.',
          'Inheritance lets a subclass reuse and extend a superclass; polymorphism lets you call the same method name on different subclasses and get type-specific behavior.',
          'Abstraction hides implementation detail behind an interface or abstract class — callers depend on "what it does," not "how it does it."',
        ],
        learnMore: { label: 'Oracle — Object-Oriented Programming Concepts', url: 'https://docs.oracle.com/javase/tutorial/java/concepts/' },
        q: [
          { t: 'Java Inheritance I', d: 'E', p: 'HackerRank', u: HR('java-inheritance-1') },
          { t: 'Build a BankAccount class demonstrating encapsulation (private balance, public deposit/withdraw with validation)', d: 'E', p: 'Build task' },
          { t: 'Build a Shape hierarchy (Circle, Rectangle, Triangle) overriding an abstract area() method to demonstrate polymorphism', d: 'M', p: 'Build task' },
          { t: 'Define a Payable interface and implement it across two unrelated classes to demonstrate abstraction', d: 'M', p: 'Build task' },
          { t: 'Write two overloaded methods and one overridden method in the same small program, and explain the difference', d: 'E', p: 'Build task' },
        ] },
      { title: 'Enums, var & Records',
        concepts: [
          'An enum is a fixed set of named constants — safer than raw ints/strings for a closed set of states (OrderStatus.PENDING/SHIPPED/DELIVERED), and it can carry its own fields and methods.',
          'var lets the compiler infer a local variable\'s type from its initializer — still statically typed under the hood, just less typing; use it only when the inferred type is obvious from the right-hand side.',
          'A record (Java 16+) is a compact, immutable data carrier — one line replaces a hand-written constructor + getters + equals/hashCode/toString, ideal for DTOs.',
        ],
        learnMore: { label: 'Oracle — Record Classes', url: 'https://docs.oracle.com/en/java/javase/17/language/records.html' },
        q: [
          { t: 'Model OrderStatus as an enum with a field (e.g. a display label) instead of raw strings', d: 'E', p: 'Build task' },
          { t: 'Rewrite a verbose, local-variable-declaration-heavy method using var where it genuinely improves readability', d: 'E', p: 'Build task' },
          { t: 'Convert a hand-written immutable DTO class (constructor + getters + equals/hashCode) into a record', d: 'E', p: 'Build task' },
        ] },
    ],
    mini: { title: 'Checkpoint Project — Command-Line Grade Calculator', desc: 'A console program that reads student scores, uses control flow and an enum for grade categories to assign letter grades, and models Student/Course with a small class hierarchy and a record-based result DTO.' },
  },
  {
    id: 'java-core', num: 2, phase: 0, title: 'Java Core — Collections, Streams & Concurrency',
    sub: 'Now that syntax and OOP are solid: the Collections Framework, exception handling, streams and lambdas, multithreading, and how the JVM actually manages memory underneath it all.',
    learnMore: { label: 'Oracle — Collections Framework Overview', url: 'https://docs.oracle.com/javase/tutorial/collections/intro/index.html' },
    subtopics: [
      { title: 'Collections Framework',
        concepts: [
          'List (ordered, duplicates OK), Set (no duplicates), and Map (key→value) are the three families — pick based on what question you need to ask the data.',
          'ArrayList is fast random access, slow middle-insert; LinkedList is the reverse — know the Big-O trade-off before defaulting to ArrayList everywhere.',
          'HashMap/HashSet give O(1) average operations via hashing; TreeMap/TreeSet trade that for O(log n) but keep keys sorted.',
        ],
        learnMore: { label: 'Oracle — Collections Framework Overview', url: 'https://docs.oracle.com/javase/tutorial/collections/intro/index.html' },
        q: [
          { t: 'LRU Cache', d: 'M', p: 'LeetCode', u: LC('lru-cache') },
          { t: 'Insert Delete GetRandom O(1)', d: 'M', p: 'LeetCode', u: LC('insert-delete-getrandom-o1') },
          { t: 'Design a bounded blocking queue using core collections', d: 'H', p: 'Build task' } ] },
      { title: 'Exception Handling',
        concepts: [
          'Checked exceptions must be declared or caught (compiler-enforced); unchecked (RuntimeException) exceptions are for programmer errors you don\'t want to force-catch everywhere.',
          'try-with-resources auto-closes anything implementing AutoCloseable — the modern default over manual finally-block cleanup.',
          'Catch the most specific exception you can meaningfully handle; swallowing exceptions silently (empty catch block) hides real bugs.',
        ],
        learnMore: { label: 'Oracle — Exceptions Tutorial', url: 'https://docs.oracle.com/javase/tutorial/essential/exceptions/' },
        q: [
          { t: 'Build a custom checked exception hierarchy for a banking app', d: 'E', p: 'Build task' },
          { t: 'Fix a try-with-resources leak in given code', d: 'M', p: 'Build task' },
          { t: 'Design a retry-with-backoff wrapper using custom exceptions', d: 'H', p: 'Build task' } ] },
      { title: 'Streams, Lambdas & Functional Interfaces',
        concepts: [
          'A stream describes a pipeline of operations (filter, map, reduce) over data — it\'s declarative ("what to compute"), not imperative ("how to loop").',
          'A lambda is a compact anonymous implementation of a functional interface (one abstract method) — Runnable, Comparator, and Function are common targets.',
          'Streams are lazy and single-use: nothing runs until a terminal operation (collect, forEach, reduce) is called, and a stream can\'t be reused after that.',
        ],
        learnMore: { label: 'Oracle — Streams Package', url: 'https://docs.oracle.com/javase/8/docs/api/java/util/stream/package-summary.html' },
        q: [
          { t: 'Sum all even numbers in a list using streams', d: 'E', p: 'HackerRank', u: 'https://www.hackerrank.com/domains/java' },
          { t: 'Group employees by department using Collectors.groupingBy', d: 'M', p: 'Build task' },
          { t: 'Implement a custom Collector for a running statistics summary', d: 'H', p: 'Build task' } ] },
      { title: 'Multithreading & Concurrency',
        concepts: [
          'A thread is an independent path of execution; shared mutable state between threads is where almost every concurrency bug comes from.',
          'Implementing Runnable (or Callable) and handing it to a Thread/ExecutorService is preferred over extending Thread directly — it keeps your class free to extend something else.',
          'volatile guarantees visibility of a variable\'s latest value across threads but not atomicity of compound operations (like increment) — that\'s what atomic classes (AtomicInteger) and synchronized are for.',
          'ExecutorService manages a pool of worker threads for you instead of raw Threads; CompletableFuture chains async work without blocking — the modern alternative to raw wait/notify.',
          'A deadlock happens when two threads each hold a lock the other needs — always acquire locks in a consistent order to avoid it; a race condition happens when the outcome depends on timing you don\'t control.',
        ],
        learnMore: { label: 'Oracle — Concurrency Tutorial', url: 'https://docs.oracle.com/javase/tutorial/essential/concurrency/' },
        q: [
          { t: 'Implement the same task using Thread (extends) vs Runnable (implements), and explain why Runnable is preferred', d: 'E', p: 'Build task' },
          { t: 'Print numbers alternately using two threads', d: 'M', p: 'GeeksforGeeks', u: GFG('print numbers alternately using two threads java') },
          { t: 'Demonstrate a race condition with a non-atomic counter, then fix it with AtomicInteger', d: 'M', p: 'Build task' },
          { t: 'Implement a thread-safe counter without synchronized', d: 'M', p: 'Build task' },
          { t: 'Submit 5 tasks to an ExecutorService thread pool and collect results with Future/CompletableFuture', d: 'M', p: 'Build task' },
          { t: 'Build a producer-consumer queue with wait/notify', d: 'H', p: 'Build task' },
          { t: 'Reproduce a deadlock between two threads acquiring two locks in opposite order, then fix it', d: 'H', p: 'Build task' },
        ] },
      { title: 'JVM Internals & Memory Management',
        concepts: [
          'The JVM splits memory into stack (per-thread, method calls & local variables) and heap (shared, all objects) — a StackOverflowError comes from the stack, an OutOfMemoryError almost always from the heap.',
          'The heap is generational: new objects are allocated in Young Gen (Eden + Survivor spaces); objects that survive enough collections get promoted to Old Gen — this split is what makes garbage collection fast in practice.',
          'A garbage collector reclaims memory for objects with no reachable references — minor GCs on Young Gen are frequent and cheap, major/full GCs on Old Gen are rare and expensive, which is why GC tuning is really about minimizing full GCs.',
        ],
        learnMore: { label: 'Oracle — Garbage Collection Tuning Guide', url: 'https://docs.oracle.com/en/java/javase/17/gctuning/introduction-garbage-collection-tuning.html' },
        q: [
          { t: 'Explain the difference between stack and heap memory with a diagram', d: 'E', p: 'Build task' },
          { t: 'Force and observe a StackOverflowError vs an OutOfMemoryError with two small programs', d: 'E', p: 'Build task' },
          { t: "Explain Java's generational garbage collection (Young Gen, Old Gen, minor vs major GC)", d: 'M', p: 'GeeksforGeeks', u: GFG('java garbage collection generational') },
          { t: 'Use JVM flags (-Xms, -Xmx, -XX:+PrintGCDetails) to observe GC behavior on a memory-heavy program', d: 'H', p: 'Build task' },
        ] },
    ],
    mini: { title: 'Checkpoint Project — Console Library Manager', desc: 'CLI app using collections, streams and custom exceptions to manage books, members and due dates in memory.' },
  },
  {
    id: 'solid', num: 3, phase: 0, title: 'SOLID & Design Principles',
    sub: 'The 5 SOLID principles, DRY/KISS/YAGNI, and the patterns that show up in real codebases.',
    learnMore: { label: 'GeeksforGeeks — SOLID Principles', url: GFG('SOLID principles in Java') },
    subtopics: [
      { title: 'Single Responsibility & Open/Closed',
        concepts: [
          'A class should have one reason to change — if you can describe it with "and," it\'s probably doing two jobs.',
          'Open/Closed: open for extension, closed for modification — add new behavior via new classes/interfaces, not by editing tested code.',
          'Watch for the smell of a class that keeps growing an if/else or switch every time a new case is added — that\'s usually an OCP violation.',
        ],
        q: [
          { t: 'Identify SRP violations in a given 150-line class', d: 'E', p: 'Build task' },
          { t: 'Refactor a God class that handles orders, payments and emails', d: 'M', p: 'Build task' },
          { t: 'Add a new discount type without modifying existing code (OCP)', d: 'M', p: 'Build task' } ] },
      { title: 'Liskov, Interface Segregation & Dependency Inversion',
        concepts: [
          'Liskov Substitution: a subclass must be usable anywhere its parent is expected, without surprising callers — no silently narrowing behavior or throwing where the parent wouldn\'t.',
          'Interface Segregation: many small, focused interfaces beat one fat interface that forces implementers to stub out methods they don\'t need.',
          'Dependency Inversion: depend on abstractions (interfaces), not concrete classes — high-level policy shouldn\'t know about low-level implementation details.',
        ],
        q: [
          { t: 'Split a fat "Worker" interface into role-based interfaces', d: 'E', p: 'Build task' },
          { t: 'Fix a Rectangle/Square inheritance that breaks LSP', d: 'M', p: 'Build task' },
          { t: 'Invert a hard dependency on a concrete MySQL class', d: 'M', p: 'Build task' } ] },
      { title: 'Design Patterns',
        concepts: [
          'Patterns are named solutions to recurring problems — the value is the shared vocabulary ("just use Strategy here") as much as the code itself.',
          'Creational patterns (Singleton, Factory, Builder) control object creation; structural (Adapter, Decorator, Facade) compose objects; behavioral (Strategy, Observer) manage communication between them.',
          'Don\'t force a pattern where a simple function would do — overuse of patterns is its own kind of over-engineering.',
        ],
        learnMore: { label: 'Refactoring.Guru — Design Patterns', url: 'https://refactoring.guru/design-patterns' },
        q: [
          { t: 'Build a Factory Method for creating different Shape objects from a type string', d: 'E', p: 'Build task' },
          { t: 'Implement a thread-safe Singleton (double-checked locking)', d: 'M', p: 'GeeksforGeeks', u: GFG('double checked locking singleton java') },
          { t: 'Implement a Builder pattern for constructing a complex Pizza object with optional toppings', d: 'M', p: 'Build task' },
          { t: 'Build a payment method Strategy pattern (Card/UPI/Wallet)', d: 'M', p: 'Build task' },
          { t: 'Wrap a legacy PaymentGateway class with an Adapter to match a new PaymentProcessor interface', d: 'M', p: 'Build task' },
          { t: 'Add logging/caching to a Service using the Decorator pattern without modifying the original class', d: 'M', p: 'Build task' },
          { t: 'Design a Facade over three subsystems (Inventory, Billing, Shipping) for a single checkout() call', d: 'M', p: 'Build task' },
          { t: 'Design an event notification system using Observer', d: 'H', p: 'Build task' } ] },
    ],
    mini: { title: 'Checkpoint Project — Pluggable Notification Engine', desc: 'A notification system (Email/SMS/Push) built entirely against SOLID: add a new channel without touching existing classes.' },
  },
  {
    id: 'build-tools', num: 4, phase: 0, title: 'Build Tools — Maven & Gradle',
    sub: 'Dependency management, build lifecycle, multi-module projects.',
    learnMore: { label: 'Maven — Getting Started Guide', url: 'https://maven.apache.org/guides/getting-started/' },
    subtopics: [
      { title: 'Maven Fundamentals',
        concepts: [
          'pom.xml declares your project\'s dependencies, plugins, and build lifecycle — Maven resolves the full dependency tree (including transitive dependencies) from that one file.',
          'The build lifecycle is a fixed sequence of phases (validate, compile, test, package, install, deploy) — running a later phase runs every phase before it too.',
          'Version conflicts between transitive dependencies are resolved by Maven\'s "nearest wins" rule — exclusions and dependency management overrides exist for when that rule picks wrong.',
        ],
        q: [
          { t: 'Set up a multi-module Maven project (api + core + common)', d: 'M', p: 'Build task' },
          { t: 'Resolve a dependency version conflict using exclusions', d: 'M', p: 'Build task' },
          { t: 'Write a custom Maven profile for dev vs prod builds', d: 'H', p: 'Build task' } ] },
      { title: 'Gradle Fundamentals',
        concepts: [
          'Gradle build scripts are code (Groovy or Kotlin DSL), not declarative XML — more flexible than Maven, at the cost of more ways to write a slow or confusing build.',
          'Gradle\'s incremental build and caching (local and remote) is its biggest practical win over Maven — unchanged tasks don\'t re-run.',
          'Tasks are the unit of work in Gradle; you can define custom tasks with arbitrary logic, which Maven makes much harder.',
        ],
        q: [
          { t: 'Convert a Maven pom.xml project to Gradle (Kotlin DSL)', d: 'M', p: 'Build task' },
          { t: 'Set up Gradle build caching for faster CI builds', d: 'M', p: 'Build task' },
          { t: 'Write a custom Gradle task to generate a build-info file', d: 'H', p: 'Build task' } ] },
    ],
    mini: { title: 'Checkpoint Project — Multi-Module Utility Library', desc: 'A shared internal library split into modules (validation, logging, common-dto), built and versioned with Gradle.' },
  },
  {
    id: 'git', num: 5, phase: 0, title: 'Version Control — Git',
    sub: 'Branching, merge vs rebase, conflict resolution, PR discipline.',
    learnMore: { label: 'Pro Git (free book)', url: 'https://git-scm.com/book/en/v2' },
    subtopics: [
      { title: 'Branching & Merging',
        concepts: [
          'A branch is just a movable pointer to a commit — cheap to create, which is why feature branches are the default workflow.',
          'merge creates a new commit joining two histories; rebase replays your commits on top of another branch, producing a linear history but rewriting commit hashes.',
          'reflog is your safety net — it records every place HEAD has pointed, so a "lost" commit is almost always recoverable.',
        ],
        q: [
          { t: 'Resolve a merge conflict in two divergent feature branches', d: 'E', p: 'Build task' },
          { t: 'Recover a deleted branch using reflog', d: 'M', p: 'Build task' },
          { t: 'Interactively rebase 5 commits into 2 clean commits', d: 'M', p: 'Build task' } ] },
      { title: 'Workflow & History Hygiene',
        concepts: [
          'A good commit message explains why, not what — the diff already shows what changed.',
          'Squashing before merge keeps main\'s history readable: one commit per logical change, not one per "fix typo" iteration.',
          'A .gitignore stops build output and secrets from ever entering history in the first place — cheaper than removing them after the fact.',
        ],
        q: [
          { t: 'Write a proper .gitignore for a Spring Boot + React monorepo', d: 'E', p: 'Build task' },
          { t: 'Squash and rewrite commit messages before a PR', d: 'M', p: 'Build task' },
          { t: 'Set up a pre-commit hook that blocks secrets from being committed', d: 'H', p: 'Build task' } ] },
    ],
    mini: { title: 'Checkpoint Project — Team Git Playbook', desc: 'A documented branching strategy (trunk-based or GitFlow) applied to one of your own repos, with hooks and PR templates.' },
  },

  // ==================================================================
  // PHASE 1 — DSA & ALGORITHMS
  // Restructured around the real 18-pattern taxonomy (NeetCode 150 /
  // Blind 75), grouped into 6 topics. Expanded to 15-20 verified questions
  // per pattern where that many genuinely exist as real, well-known
  // problems; a handful of naturally small patterns are capped honestly.
  // ==================================================================
  {
    id: 'dsa1', num: 6, phase: 1, title: 'DSA I — Arrays, Two Pointers & Sliding Window',
    sub: 'The three patterns everything else in DSA is built on: reading arrays fast with hashing, closing in from both ends, and tracking a moving window.',
    learnMore: { label: 'NeetCode 150 — Arrays & Hashing', url: 'https://neetcode.io/practice' },
    subtopics: [
      { title: 'Arrays & Hashing',
        concepts: [
          'A hash map/set gives O(1) average lookup — trade memory for speed whenever you need to check "have I seen this before?" fast.',
          'Prefix/suffix product or sum arrays let you answer "everything except me" questions in one pass without division or nested loops.',
          'Frequency counting (map from value → count) is the backbone of anagram, majority-element, and top-k problems.',
        ],
        learnMore: { label: 'GeeksforGeeks — Hashing', url: GFG('hashing data structure') },
        q: [
          { t: 'Two Sum', d: 'E', p: 'LeetCode', u: LC('two-sum') },
          { t: 'Contains Duplicate', d: 'E', p: 'LeetCode', u: LC('contains-duplicate') },
          { t: 'Valid Anagram', d: 'E', p: 'LeetCode', u: LC('valid-anagram') },
          { t: 'Majority Element', d: 'E', p: 'LeetCode', u: LC('majority-element') },
          { t: 'Group Anagrams', d: 'M', p: 'LeetCode', u: LC('group-anagrams') },
          { t: 'Top K Frequent Elements', d: 'M', p: 'LeetCode', u: LC('top-k-frequent-elements') },
          { t: 'Product of Array Except Self', d: 'M', p: 'LeetCode', u: LC('product-of-array-except-self') },
          { t: 'Valid Sudoku', d: 'M', p: 'LeetCode', u: LC('valid-sudoku') },
          { t: 'Longest Consecutive Sequence', d: 'M', p: 'LeetCode', u: LC('longest-consecutive-sequence') },
          { t: 'Contains Duplicate II', d: 'E', p: 'LeetCode', u: LC('contains-duplicate-ii') },
          { t: 'Find All Numbers Disappeared in an Array', d: 'E', p: 'LeetCode', u: LC('find-all-numbers-disappeared-in-an-array') },
          { t: 'Majority Element II', d: 'M', p: 'LeetCode', u: LC('majority-element-ii') },
          { t: '3Sum Closest', d: 'M', p: 'LeetCode', u: LC('3sum-closest') },
          { t: '4Sum', d: 'M', p: 'LeetCode', u: LC('4sum') },
          { t: 'Subarray Sum Equals K', d: 'M', p: 'LeetCode', u: LC('subarray-sum-equals-k') },
          { t: 'Rotate Array', d: 'M', p: 'LeetCode', u: LC('rotate-array') },
          { t: 'First Missing Positive', d: 'H', p: 'LeetCode', u: LC('first-missing-positive') },
        ] },
      { title: 'Two Pointers',
        concepts: [
          'Two indices move toward each other (or together) across a sorted structure, cutting a nested loop down to a single linear pass.',
          'Works because sortedness lets you reason about which side to move: if the sum is too big, shrink from the right; too small, grow from the left.',
          'Common variants: opposite-ends closing, fast/slow pointers, and partitioning a list in place around a pivot.',
        ],
        learnMore: { label: 'GeeksforGeeks — Two Pointer Technique', url: GFG('two pointer technique') },
        q: [
          { t: 'Valid Palindrome', d: 'E', p: 'LeetCode', u: LC('valid-palindrome') },
          { t: 'Remove Duplicates from Sorted Array', d: 'E', p: 'LeetCode', u: LC('remove-duplicates-from-sorted-array') },
          { t: 'Move Zeroes', d: 'E', p: 'LeetCode', u: LC('move-zeroes') },
          { t: 'Two Sum II — Input Array Is Sorted', d: 'M', p: 'LeetCode', u: LC('two-sum-ii-input-array-is-sorted') },
          { t: '3Sum', d: 'M', p: 'LeetCode', u: LC('3sum') },
          { t: 'Sort Colors', d: 'M', p: 'LeetCode', u: LC('sort-colors') },
          { t: 'Container With Most Water', d: 'M', p: 'LeetCode', u: LC('container-with-most-water') },
          { t: 'Trapping Rain Water', d: 'H', p: 'LeetCode', u: LC('trapping-rain-water') },
          { t: 'Remove Element', d: 'E', p: 'LeetCode', u: LC('remove-element') },
          { t: 'Reverse String', d: 'E', p: 'LeetCode', u: LC('reverse-string') },
          { t: 'Squares of a Sorted Array', d: 'E', p: 'LeetCode', u: LC('squares-of-a-sorted-array') },
          { t: 'Backspace String Compare', d: 'E', p: 'LeetCode', u: LC('backspace-string-compare') },
          { t: 'Sort Array By Parity', d: 'E', p: 'LeetCode', u: LC('sort-array-by-parity') },
          { t: 'Reverse Vowels of a String', d: 'E', p: 'LeetCode', u: LC('reverse-vowels-of-a-string') },
          { t: 'Boats to Save People', d: 'M', p: 'LeetCode', u: LC('boats-to-save-people') },
        ] },
      { title: 'Sliding Window',
        concepts: [
          'A window (a contiguous subarray/substring) expands to the right and contracts from the left, tracked with running state instead of recomputing from scratch.',
          'Use it whenever the question asks for the "best/longest/shortest contiguous subarray or substring" satisfying some condition.',
          'A monotonic deque keeps the window\'s max/min available in O(1) amortized time — the trick behind sliding-window-maximum problems.',
        ],
        learnMore: { label: 'GeeksforGeeks — Sliding Window Technique', url: GFG('window sliding technique') },
        q: [
          { t: 'Best Time to Buy and Sell Stock', d: 'E', p: 'LeetCode', u: LC('best-time-to-buy-and-sell-stock') },
          { t: 'Maximum Average Subarray I', d: 'E', p: 'LeetCode', u: LC('maximum-average-subarray-i') },
          { t: 'Longest Substring Without Repeating Characters', d: 'M', p: 'LeetCode', u: LC('longest-substring-without-repeating-characters') },
          { t: 'Longest Repeating Character Replacement', d: 'M', p: 'LeetCode', u: LC('longest-repeating-character-replacement') },
          { t: 'Permutation in String', d: 'M', p: 'LeetCode', u: LC('permutation-in-string') },
          { t: 'Fruit Into Baskets', d: 'M', p: 'LeetCode', u: LC('fruit-into-baskets') },
          { t: 'Minimum Window Substring', d: 'H', p: 'LeetCode', u: LC('minimum-window-substring') },
          { t: 'Sliding Window Maximum', d: 'H', p: 'LeetCode', u: LC('sliding-window-maximum') },
          { t: 'Max Consecutive Ones III', d: 'M', p: 'LeetCode', u: LC('max-consecutive-ones-iii') },
          { t: 'Minimum Size Subarray Sum', d: 'M', p: 'LeetCode', u: LC('minimum-size-subarray-sum') },
          { t: 'Longest Subarray of 1s After Deleting One Element', d: 'M', p: 'LeetCode', u: LC('longest-subarray-of-1s-after-deleting-one-element') },
          { t: 'Find All Anagrams in a String', d: 'M', p: 'LeetCode', u: LC('find-all-anagrams-in-a-string') },
          { t: 'Grumpy Bookstore Owner', d: 'M', p: 'LeetCode', u: LC('grumpy-bookstore-owner') },
          { t: 'Subarrays with K Different Integers', d: 'H', p: 'LeetCode', u: LC('subarrays-with-k-different-integers') },
        ] },
    ],
    mini: { title: 'Checkpoint Project — Custom Array/String Utility Kit', desc: "Implement your own mini-library (no built-ins): a hash-based frequency counter, a two-pointer palindrome/partition helper, and a sliding-window max tracker — then benchmark against Java's built-ins." },
  },
  {
    id: 'dsa2', num: 7, phase: 1, title: 'DSA II — Stack, Binary Search & Linked List',
    sub: 'LIFO order, halving the search space, and pointer-chasing — the structures behind parsers, sorted lookups, and every "reverse this" question.',
    learnMore: { label: 'NeetCode 150 — Stack', url: 'https://neetcode.io/practice' },
    subtopics: [
      { title: 'Stack',
        concepts: [
          'Last-in-first-out order is the natural fit for matching pairs (brackets), undo history, and "look back until something bigger/smaller" problems.',
          'A monotonic stack (values always increasing or decreasing) solves next-greater-element-style problems in one linear pass.',
          'Evaluating expressions (postfix, infix-to-postfix, calculators) is a classic stack application worth building from scratch once.',
        ],
        learnMore: { label: 'GeeksforGeeks — Stack Data Structure', url: GFG('stack data structure') },
        q: [
          { t: 'Valid Parentheses', d: 'E', p: 'LeetCode', u: LC('valid-parentheses') },
          { t: 'Min Stack', d: 'M', p: 'LeetCode', u: LC('min-stack') },
          { t: 'Evaluate Reverse Polish Notation', d: 'M', p: 'LeetCode', u: LC('evaluate-reverse-polish-notation') },
          { t: 'Generate Parentheses', d: 'M', p: 'LeetCode', u: LC('generate-parentheses') },
          { t: 'Daily Temperatures', d: 'M', p: 'LeetCode', u: LC('daily-temperatures') },
          { t: 'Car Fleet', d: 'M', p: 'LeetCode', u: LC('car-fleet') },
          { t: 'Asteroid Collision', d: 'M', p: 'LeetCode', u: LC('asteroid-collision') },
          { t: 'Largest Rectangle in Histogram', d: 'H', p: 'LeetCode', u: LC('largest-rectangle-in-histogram') },
          { t: 'Baseball Game', d: 'E', p: 'LeetCode', u: LC('baseball-game') },
          { t: 'Implement Queue using Stacks', d: 'E', p: 'LeetCode', u: LC('implement-queue-using-stacks') },
          { t: 'Implement Stack using Queues', d: 'E', p: 'LeetCode', u: LC('implement-stack-using-queues') },
          { t: 'Remove All Adjacent Duplicates In String', d: 'E', p: 'LeetCode', u: LC('remove-all-adjacent-duplicates-in-string') },
          { t: 'Next Greater Element I', d: 'E', p: 'LeetCode', u: LC('next-greater-element-i') },
          { t: 'Next Greater Element II', d: 'M', p: 'LeetCode', u: LC('next-greater-element-ii') },
          { t: 'Decode String', d: 'M', p: 'LeetCode', u: LC('decode-string') },
          { t: 'Simplify Path', d: 'M', p: 'LeetCode', u: LC('simplify-path') },
        ] },
      { title: 'Binary Search',
        concepts: [
          'Halves the search space every step — O(log n) — but only works on data with a monotonic property (sorted, or "answer gets worse/better monotonically").',
          'Two flavors: search for an exact value, or "binary search on the answer" — guess a value, check if it works, narrow the range.',
          'Watch the boundary conditions (lo <= hi vs lo < hi, mid rounding) — off-by-one bugs here are the most common binary-search mistake.',
        ],
        learnMore: { label: 'GeeksforGeeks — Binary Search', url: GFG('binary search') },
        q: [
          { t: 'Binary Search', d: 'E', p: 'LeetCode', u: LC('binary-search') },
          { t: 'Search Insert Position', d: 'E', p: 'LeetCode', u: LC('search-insert-position') },
          { t: 'Search a 2D Matrix', d: 'M', p: 'LeetCode', u: LC('search-a-2d-matrix') },
          { t: 'Koko Eating Bananas', d: 'M', p: 'LeetCode', u: LC('koko-eating-bananas') },
          { t: 'Find Minimum in Rotated Sorted Array', d: 'M', p: 'LeetCode', u: LC('find-minimum-in-rotated-sorted-array') },
          { t: 'Search in Rotated Sorted Array', d: 'M', p: 'LeetCode', u: LC('search-in-rotated-sorted-array') },
          { t: 'Time Based Key-Value Store', d: 'M', p: 'LeetCode', u: LC('time-based-key-value-store') },
          { t: 'Median of Two Sorted Arrays', d: 'H', p: 'LeetCode', u: LC('median-of-two-sorted-arrays') },
          { t: 'First Bad Version', d: 'E', p: 'LeetCode', u: LC('first-bad-version') },
          { t: "Sqrt(x)", d: 'E', p: 'LeetCode', u: LC('sqrtx') },
          { t: 'Find Peak Element', d: 'M', p: 'LeetCode', u: LC('find-peak-element') },
          { t: 'Find First and Last Position of Element in Sorted Array', d: 'M', p: 'LeetCode', u: LC('find-first-and-last-position-of-element-in-sorted-array') },
          { t: 'Search in Rotated Sorted Array II', d: 'M', p: 'LeetCode', u: LC('search-in-rotated-sorted-array-ii') },
          { t: 'Capacity To Ship Packages Within D Days', d: 'M', p: 'LeetCode', u: LC('capacity-to-ship-packages-within-d-days') },
          { t: 'Split Array Largest Sum', d: 'H', p: 'LeetCode', u: LC('split-array-largest-sum') },
        ] },
      { title: 'Linked List',
        concepts: [
          'No random access — every operation is a pointer walk, so most linked-list problems are really "can you rewire the next pointers correctly?"',
          'The fast/slow (tortoise-and-hare) pointer pair finds the middle, detects cycles, and finds cycle start — one technique, many problems.',
          'A dummy head node removes almost all of the special-casing around "what if I need to modify the first node?"',
        ],
        learnMore: { label: 'GeeksforGeeks — Linked List', url: GFG('linked list data structure') },
        q: [
          { t: 'Reverse Linked List', d: 'E', p: 'LeetCode', u: LC('reverse-linked-list') },
          { t: 'Merge Two Sorted Lists', d: 'E', p: 'LeetCode', u: LC('merge-two-sorted-lists') },
          { t: 'Linked List Cycle', d: 'E', p: 'LeetCode', u: LC('linked-list-cycle') },
          { t: 'Reorder List', d: 'M', p: 'LeetCode', u: LC('reorder-list') },
          { t: 'Remove Nth Node From End of List', d: 'M', p: 'LeetCode', u: LC('remove-nth-node-from-end-of-list') },
          { t: 'Copy List with Random Pointer', d: 'M', p: 'LeetCode', u: LC('copy-list-with-random-pointer') },
          { t: 'Add Two Numbers', d: 'M', p: 'LeetCode', u: LC('add-two-numbers') },
          { t: 'Find the Duplicate Number', d: 'M', p: 'LeetCode', u: LC('find-the-duplicate-number') },
          { t: 'LRU Cache', d: 'M', p: 'LeetCode', u: LC('lru-cache') },
          { t: 'Merge k Sorted Lists', d: 'H', p: 'LeetCode', u: LC('merge-k-sorted-lists') },
          { t: 'Middle of the Linked List', d: 'E', p: 'LeetCode', u: LC('middle-of-the-linked-list') },
          { t: 'Palindrome Linked List', d: 'E', p: 'LeetCode', u: LC('palindrome-linked-list') },
          { t: 'Remove Linked List Elements', d: 'E', p: 'LeetCode', u: LC('remove-linked-list-elements') },
          { t: 'Swap Nodes in Pairs', d: 'M', p: 'LeetCode', u: LC('swap-nodes-in-pairs') },
          { t: 'Rotate List', d: 'M', p: 'LeetCode', u: LC('rotate-list') },
          { t: 'Flatten a Multilevel Doubly Linked List', d: 'M', p: 'LeetCode', u: LC('flatten-a-multilevel-doubly-linked-list') },
        ] },
    ],
    mini: { title: 'Checkpoint Project — Build Your Own Data Structure Toolkit', desc: 'Implement a stack-based expression evaluator, a binary-search-powered sorted lookup table, and a singly linked list from scratch (including reverse and cycle detection) — then benchmark each against Java\'s built-ins.' },
  },
  {
    id: 'dsa3', num: 8, phase: 1, title: 'DSA III — Trees, Heaps & Tries',
    sub: 'Hierarchical structures: binary trees and BSTs, priority-ordered heaps, and prefix trees for fast string lookup.',
    learnMore: { label: 'NeetCode 150 — Trees', url: 'https://neetcode.io/practice' },
    subtopics: [
      { title: 'Trees',
        concepts: [
          'Recursion is the native language of trees — most tree problems are "process this node, then recurse on left/right and combine."',
          'DFS (preorder/inorder/postorder) explores depth-first with a call stack; BFS (level order) explores breadth-first with a queue — pick based on what the problem asks for.',
          'A Binary Search Tree adds one invariant (left < node < right) that turns search/insert/delete into O(log n) on average — but degrades to O(n) if unbalanced.',
        ],
        learnMore: { label: 'GeeksforGeeks — Binary Tree', url: GFG('binary tree data structure') },
        q: [
          { t: 'Invert Binary Tree', d: 'E', p: 'LeetCode', u: LC('invert-binary-tree') },
          { t: 'Maximum Depth of Binary Tree', d: 'E', p: 'LeetCode', u: LC('maximum-depth-of-binary-tree') },
          { t: 'Diameter of Binary Tree', d: 'E', p: 'LeetCode', u: LC('diameter-of-binary-tree') },
          { t: 'Balanced Binary Tree', d: 'E', p: 'LeetCode', u: LC('balanced-binary-tree') },
          { t: 'Lowest Common Ancestor of a BST', d: 'M', p: 'LeetCode', u: LC('lowest-common-ancestor-of-a-binary-search-tree') },
          { t: 'Binary Tree Level Order Traversal', d: 'M', p: 'LeetCode', u: LC('binary-tree-level-order-traversal') },
          { t: 'Validate Binary Search Tree', d: 'M', p: 'LeetCode', u: LC('validate-binary-search-tree') },
          { t: 'Kth Smallest Element in a BST', d: 'M', p: 'LeetCode', u: LC('kth-smallest-element-in-a-bst') },
          { t: 'Construct Binary Tree from Preorder and Inorder Traversal', d: 'M', p: 'LeetCode', u: LC('construct-binary-tree-from-preorder-and-inorder-traversal') },
          { t: 'Binary Tree Maximum Path Sum', d: 'H', p: 'LeetCode', u: LC('binary-tree-maximum-path-sum') },
          { t: 'Same Tree', d: 'E', p: 'LeetCode', u: LC('same-tree') },
          { t: 'Symmetric Tree', d: 'E', p: 'LeetCode', u: LC('symmetric-tree') },
          { t: 'Path Sum', d: 'E', p: 'LeetCode', u: LC('path-sum') },
          { t: 'Binary Tree Inorder Traversal', d: 'E', p: 'LeetCode', u: LC('binary-tree-inorder-traversal') },
          { t: 'Binary Tree Right Side View', d: 'M', p: 'LeetCode', u: LC('binary-tree-right-side-view') },
          { t: 'Lowest Common Ancestor of a Binary Tree', d: 'M', p: 'LeetCode', u: LC('lowest-common-ancestor-of-a-binary-tree') },
          { t: 'Count Good Nodes in Binary Tree', d: 'M', p: 'LeetCode', u: LC('count-good-nodes-in-binary-tree') },
          { t: 'Serialize and Deserialize Binary Tree', d: 'H', p: 'LeetCode', u: LC('serialize-and-deserialize-binary-tree') },
        ] },
      { title: 'Heaps & Priority Queue',
        concepts: [
          'A heap keeps the min (or max) accessible in O(1), with O(log n) insert/remove — the go-to structure for "give me the top/bottom K" problems.',
          'Java\'s PriorityQueue is a min-heap by default; pass a custom Comparator to flip it into a max-heap or sort by any key.',
          'Two heaps (a max-heap for the lower half, a min-heap for the upper half) is the standard trick for tracking a running median.',
        ],
        learnMore: { label: 'GeeksforGeeks — Heap Data Structure', url: GFG('heap data structure') },
        q: [
          { t: 'Kth Largest Element in a Stream', d: 'E', p: 'LeetCode', u: LC('kth-largest-element-in-a-stream') },
          { t: 'Last Stone Weight', d: 'E', p: 'LeetCode', u: LC('last-stone-weight') },
          { t: 'K Closest Points to Origin', d: 'M', p: 'LeetCode', u: LC('k-closest-points-to-origin') },
          { t: 'Kth Largest Element in an Array', d: 'M', p: 'LeetCode', u: LC('kth-largest-element-in-an-array') },
          { t: 'Task Scheduler', d: 'M', p: 'LeetCode', u: LC('task-scheduler') },
          { t: 'Design Twitter', d: 'M', p: 'LeetCode', u: LC('design-twitter') },
          { t: 'Find Median from Data Stream', d: 'H', p: 'LeetCode', u: LC('find-median-from-data-stream') },
          { t: 'Relative Ranks', d: 'E', p: 'LeetCode', u: LC('relative-ranks') },
          { t: 'Top K Frequent Words', d: 'M', p: 'LeetCode', u: LC('top-k-frequent-words') },
          { t: 'Reorganize String', d: 'M', p: 'LeetCode', u: LC('reorganize-string') },
          { t: 'Ugly Number II', d: 'M', p: 'LeetCode', u: LC('ugly-number-ii') },
          { t: 'Single-Threaded CPU', d: 'M', p: 'LeetCode', u: LC('single-threaded-cpu') },
        ],
      },
      { title: 'Tries',
        concepts: [
          'A trie (prefix tree) stores strings character-by-character along shared paths, so prefix lookup is O(word length), not O(number of words).',
          'Each node holds up to 26 children (for lowercase English) plus an "end of word" flag — that flag is what separates "prefix exists" from "word exists."',
          'This pattern has a genuinely small canonical problem set, but it underpins real features like autocomplete, spell-check, and IP routing tables.',
        ],
        learnMore: { label: 'GeeksforGeeks — Trie', url: GFG('trie insert and search') },
        q: [
          { t: 'Implement Trie (Prefix Tree)', d: 'M', p: 'LeetCode', u: LC('implement-trie-prefix-tree') },
          { t: 'Design Add and Search Words Data Structure', d: 'M', p: 'LeetCode', u: LC('design-add-and-search-words-data-structure') },
          { t: 'Word Search II', d: 'H', p: 'LeetCode', u: LC('word-search-ii') },
          { t: 'Longest Word in Dictionary', d: 'E', p: 'LeetCode', u: LC('longest-word-in-dictionary') },
          { t: 'Replace Words', d: 'M', p: 'LeetCode', u: LC('replace-words') },
          { t: 'Map Sum Pairs', d: 'M', p: 'LeetCode', u: LC('map-sum-pairs') },
          { t: 'Word Break II', d: 'H', p: 'LeetCode', u: LC('word-break-ii') },
        ] },
    ],
    mini: { title: 'Checkpoint Project — Autocomplete Engine', desc: 'Build a trie-backed autocomplete/spell-check tool, a BST-based ordered map, and a heap-based task scheduler that always runs the highest-priority job next.' },
  },
  {
    id: 'dsa4', num: 9, phase: 1, title: 'DSA IV — Backtracking & Graphs',
    sub: 'Systematic trial-and-error over decision trees, and traversing networks of connected nodes.',
    learnMore: { label: 'NeetCode 150 — Graphs', url: 'https://neetcode.io/practice' },
    subtopics: [
      { title: 'Backtracking',
        concepts: [
          'Explore a decision tree depth-first, commit to a choice, recurse, then undo ("backtrack") that choice before trying the next — the template behind every "generate all X" problem.',
          'Prune early: if a partial choice already violates the constraint, stop recursing down that branch instead of finishing it and checking at the end.',
          'Distinguish combinations (order doesn\'t matter, no reuse) from permutations (order matters) from subsets (include-or-exclude each element) — the loop structure differs for each.',
        ],
        learnMore: { label: 'GeeksforGeeks — Backtracking', url: GFG('backtracking algorithms') },
        q: [
          { t: 'Subsets', d: 'M', p: 'LeetCode', u: LC('subsets') },
          { t: 'Combination Sum', d: 'M', p: 'LeetCode', u: LC('combination-sum') },
          { t: 'Permutations', d: 'M', p: 'LeetCode', u: LC('permutations') },
          { t: 'Subsets II', d: 'M', p: 'LeetCode', u: LC('subsets-ii') },
          { t: 'Combination Sum II', d: 'M', p: 'LeetCode', u: LC('combination-sum-ii') },
          { t: 'Word Search', d: 'M', p: 'LeetCode', u: LC('word-search') },
          { t: 'Palindrome Partitioning', d: 'M', p: 'LeetCode', u: LC('palindrome-partitioning') },
          { t: 'Letter Combinations of a Phone Number', d: 'M', p: 'LeetCode', u: LC('letter-combinations-of-a-phone-number') },
          { t: 'N-Queens', d: 'H', p: 'LeetCode', u: LC('n-queens') },
          { t: 'Sudoku Solver', d: 'H', p: 'LeetCode', u: LC('sudoku-solver') },
          { t: 'Permutations II', d: 'M', p: 'LeetCode', u: LC('permutations-ii') },
          { t: 'Combinations', d: 'M', p: 'LeetCode', u: LC('combinations') },
          { t: 'Restore IP Addresses', d: 'M', p: 'LeetCode', u: LC('restore-ip-addresses') },
          { t: 'Gray Code', d: 'M', p: 'LeetCode', u: LC('gray-code') },
          { t: 'N-Queens II', d: 'H', p: 'LeetCode', u: LC('n-queens-ii') },
        ] },
      { title: 'Graphs',
        concepts: [
          'A graph is nodes + edges — represent it as an adjacency list (map of node → neighbors) for anything sparse, which is almost always the right default.',
          'BFS explores in layers and finds shortest paths in unweighted graphs; DFS explores deep-first and is natural for connectivity and cycle checks.',
          'Grid problems (islands, flood fill) are graphs in disguise — each cell is a node, and up/down/left/right cells are its edges.',
        ],
        learnMore: { label: 'GeeksforGeeks — Graph Data Structure', url: GFG('graph data structure and algorithms') },
        q: [
          { t: 'Number of Islands', d: 'M', p: 'LeetCode', u: LC('number-of-islands') },
          { t: 'Max Area of Island', d: 'M', p: 'LeetCode', u: LC('max-area-of-island') },
          { t: 'Clone Graph', d: 'M', p: 'LeetCode', u: LC('clone-graph') },
          { t: 'Rotting Oranges', d: 'M', p: 'LeetCode', u: LC('rotting-oranges') },
          { t: 'Pacific Atlantic Water Flow', d: 'M', p: 'LeetCode', u: LC('pacific-atlantic-water-flow') },
          { t: 'Surrounded Regions', d: 'M', p: 'LeetCode', u: LC('surrounded-regions') },
          { t: 'Course Schedule', d: 'M', p: 'LeetCode', u: LC('course-schedule') },
          { t: 'Redundant Connection', d: 'M', p: 'LeetCode', u: LC('redundant-connection') },
          { t: 'Word Ladder', d: 'H', p: 'LeetCode', u: LC('word-ladder') },
          { t: 'Flood Fill', d: 'E', p: 'LeetCode', u: LC('flood-fill') },
          { t: 'Island Perimeter', d: 'E', p: 'LeetCode', u: LC('island-perimeter') },
          { t: 'Is Graph Bipartite?', d: 'M', p: 'LeetCode', u: LC('is-graph-bipartite') },
          { t: 'Keys and Rooms', d: 'M', p: 'LeetCode', u: LC('keys-and-rooms') },
          { t: 'Accounts Merge', d: 'M', p: 'LeetCode', u: LC('accounts-merge') },
          { t: 'Evaluate Division', d: 'M', p: 'LeetCode', u: LC('evaluate-division') },
        ] },
    ],
    mini: { title: 'Checkpoint Project — Maze Solver & Graph Explorer', desc: 'Build a backtracking maze solver that finds a path (or all paths) through a grid, plus a BFS/DFS graph traversal visualizer that prints the order nodes are discovered.' },
  },
  {
    id: 'dsa5', num: 10, phase: 1, title: 'DSA V — Advanced Graphs & Dynamic Programming',
    sub: 'Weighted graphs and shortest-path algorithms, plus the two-dimensional thinking behind dynamic programming.',
    learnMore: { label: 'GeeksforGeeks — Dynamic Programming', url: GFG('dynamic programming') },
    subtopics: [
      { title: 'Advanced Graphs',
        concepts: [
          'Topological sort orders nodes of a DAG so every edge points forward — the algorithm behind "can these course prerequisites be satisfied?"',
          "Dijkstra's algorithm finds shortest paths from one source in a weighted graph with non-negative edges, using a min-heap to always expand the closest unvisited node next.",
          'Union-Find (Disjoint Set) answers "are these two nodes connected?" and "would adding this edge create a cycle?" in near-constant time — the backbone of Kruskal\'s MST algorithm.',
        ],
        learnMore: { label: 'GeeksforGeeks — Advanced Graph Algorithms', url: GFG('dijkstra algorithm shortest path') },
        q: [
          { t: 'Course Schedule II', d: 'M', p: 'LeetCode', u: LC('course-schedule-ii') },
          { t: 'Network Delay Time', d: 'M', p: 'LeetCode', u: LC('network-delay-time') },
          { t: 'Cheapest Flights Within K Stops', d: 'M', p: 'LeetCode', u: LC('cheapest-flights-within-k-stops') },
          { t: 'Min Cost to Connect All Points', d: 'M', p: 'LeetCode', u: LC('min-cost-to-connect-all-points') },
          { t: 'Swim in Rising Water', d: 'H', p: 'LeetCode', u: LC('swim-in-rising-water') },
          { t: 'Reconstruct Itinerary', d: 'H', p: 'LeetCode', u: LC('reconstruct-itinerary') },
          { t: 'Find the City With the Smallest Number of Neighbors at a Threshold Distance', d: 'M', p: 'LeetCode', u: LC('find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance') },
          { t: 'Path With Minimum Effort', d: 'M', p: 'LeetCode', u: LC('path-with-minimum-effort') },
          { t: 'Number of Provinces', d: 'M', p: 'LeetCode', u: LC('number-of-provinces') },
          { t: 'Redundant Connection II', d: 'H', p: 'LeetCode', u: LC('redundant-connection-ii') },
        ] },
      { title: '1-D Dynamic Programming',
        concepts: [
          'DP = recursion + remembering answers you already computed (memoization), so overlapping subproblems get solved once instead of exponentially many times.',
          'The hard part is finding the recurrence: "how does the answer for size n relate to smaller sizes?" — write that on paper before writing code.',
          'Once the recursive (top-down) version works, converting to an iterative (bottom-up) array fill usually drops the space complexity too.',
        ],
        learnMore: { label: 'GeeksforGeeks — Dynamic Programming', url: GFG('dynamic programming') },
        q: [
          { t: 'Climbing Stairs', d: 'E', p: 'LeetCode', u: LC('climbing-stairs') },
          { t: 'House Robber', d: 'M', p: 'LeetCode', u: LC('house-robber') },
          { t: 'House Robber II', d: 'M', p: 'LeetCode', u: LC('house-robber-ii') },
          { t: 'Longest Palindromic Substring', d: 'M', p: 'LeetCode', u: LC('longest-palindromic-substring') },
          { t: 'Palindromic Substrings', d: 'M', p: 'LeetCode', u: LC('palindromic-substrings') },
          { t: 'Decode Ways', d: 'M', p: 'LeetCode', u: LC('decode-ways') },
          { t: 'Coin Change', d: 'M', p: 'LeetCode', u: LC('coin-change') },
          { t: 'Word Break', d: 'M', p: 'LeetCode', u: LC('word-break') },
          { t: 'Longest Increasing Subsequence', d: 'M', p: 'LeetCode', u: LC('longest-increasing-subsequence') },
          { t: 'Partition Equal Subset Sum', d: 'M', p: 'LeetCode', u: LC('partition-equal-subset-sum') },
          { t: 'Min Cost Climbing Stairs', d: 'E', p: 'LeetCode', u: LC('min-cost-climbing-stairs') },
          { t: 'N-th Tribonacci Number', d: 'E', p: 'LeetCode', u: LC('n-th-tribonacci-number') },
          { t: 'Maximum Product Subarray', d: 'M', p: 'LeetCode', u: LC('maximum-product-subarray') },
          { t: 'Perfect Squares', d: 'M', p: 'LeetCode', u: LC('perfect-squares') },
          { t: 'Combination Sum IV', d: 'M', p: 'LeetCode', u: LC('combination-sum-iv') },
          { t: 'Integer Break', d: 'M', p: 'LeetCode', u: LC('integer-break') },
          { t: 'Delete and Earn', d: 'M', p: 'LeetCode', u: LC('delete-and-earn') },
        ] },
      { title: '2-D Dynamic Programming',
        concepts: [
          'When the state depends on two changing quantities (two string positions, or a grid row and column), the DP table becomes 2-D instead of a 1-D array.',
          'Classic shape: dp[i][j] = best answer using the first i elements of one sequence and the first j of another — fill row by row.',
          'Grid path-counting problems (unique paths) and string-comparison problems (edit distance, LCS) are the two big families here.',
        ],
        learnMore: { label: 'GeeksforGeeks — 2D Dynamic Programming', url: GFG('2d dynamic programming') },
        q: [
          { t: 'Unique Paths', d: 'M', p: 'LeetCode', u: LC('unique-paths') },
          { t: 'Longest Common Subsequence', d: 'M', p: 'LeetCode', u: LC('longest-common-subsequence') },
          { t: 'Best Time to Buy and Sell Stock with Cooldown', d: 'M', p: 'LeetCode', u: LC('best-time-to-buy-and-sell-stock-with-cooldown') },
          { t: 'Coin Change II', d: 'M', p: 'LeetCode', u: LC('coin-change-ii') },
          { t: 'Target Sum', d: 'M', p: 'LeetCode', u: LC('target-sum') },
          { t: 'Interleaving String', d: 'H', p: 'LeetCode', u: LC('interleaving-string') },
          { t: 'Longest Increasing Path in a Matrix', d: 'H', p: 'LeetCode', u: LC('longest-increasing-path-in-a-matrix') },
          { t: 'Distinct Subsequences', d: 'H', p: 'LeetCode', u: LC('distinct-subsequences') },
          { t: 'Edit Distance', d: 'H', p: 'LeetCode', u: LC('edit-distance') },
          { t: 'Maximal Square', d: 'H', p: 'LeetCode', u: LC('maximal-square') },
          { t: 'Unique Paths II', d: 'M', p: 'LeetCode', u: LC('unique-paths-ii') },
          { t: 'Minimum Path Sum', d: 'M', p: 'LeetCode', u: LC('minimum-path-sum') },
          { t: 'Triangle', d: 'M', p: 'LeetCode', u: LC('triangle') },
          { t: 'Out of Boundary Paths', d: 'M', p: 'LeetCode', u: LC('out-of-boundary-paths') },
          { t: 'Longest Palindromic Subsequence', d: 'M', p: 'LeetCode', u: LC('longest-palindromic-subsequence') },
          { t: 'Regular Expression Matching', d: 'H', p: 'LeetCode', u: LC('regular-expression-matching') },
        ] },
    ],
    mini: { title: 'Checkpoint Project — Route Planner with DP Optimizer', desc: "A Dijkstra-based shortest-route planner over a small weighted graph, paired with a DP-based budget optimizer (a knapsack-style allocator) that picks the best combination under a cost constraint." },
  },
  {
    id: 'dsa6', num: 11, phase: 1, title: 'DSA VI — Greedy, Intervals, Math & Bit Manipulation',
    sub: 'Making the locally-best choice, reasoning about overlapping ranges, and the number-theory and bitwise tricks that round out a complete DSA toolkit.',
    learnMore: { label: 'GeeksforGeeks — Greedy Algorithms', url: GFG('greedy algorithms') },
    subtopics: [
      { title: 'Greedy',
        concepts: [
          'A greedy algorithm makes the locally-optimal choice at each step and never reconsiders it — it only works when the problem has the "greedy-choice property," so always sanity-check with a small example.',
          'Sorting first (by start time, by ratio, by size) is the setup step for most greedy problems — the greedy choice usually becomes obvious once the data is ordered.',
          "Greedy is often paired with a proof by contradiction or exchange argument in interviews — being able to explain *why* the greedy choice is safe matters as much as the code.",
        ],
        learnMore: { label: 'GeeksforGeeks — Greedy Algorithms', url: GFG('greedy algorithms') },
        q: [
          { t: 'Maximum Subarray', d: 'M', p: 'LeetCode', u: LC('maximum-subarray') },
          { t: 'Jump Game', d: 'M', p: 'LeetCode', u: LC('jump-game') },
          { t: 'Jump Game II', d: 'M', p: 'LeetCode', u: LC('jump-game-ii') },
          { t: 'Gas Station', d: 'M', p: 'LeetCode', u: LC('gas-station') },
          { t: 'Hand of Straights', d: 'M', p: 'LeetCode', u: LC('hand-of-straights') },
          { t: 'Merge Triplets to Form Target Triplet', d: 'M', p: 'LeetCode', u: LC('merge-triplets-to-form-target-triplet') },
          { t: 'Partition Labels', d: 'M', p: 'LeetCode', u: LC('partition-labels') },
          { t: 'Valid Parenthesis String', d: 'M', p: 'LeetCode', u: LC('valid-parenthesis-string') },
          { t: 'Best Time to Buy and Sell Stock II', d: 'E', p: 'LeetCode', u: LC('best-time-to-buy-and-sell-stock-ii') },
          { t: 'Assign Cookies', d: 'E', p: 'LeetCode', u: LC('assign-cookies') },
          { t: 'Lemonade Change', d: 'E', p: 'LeetCode', u: LC('lemonade-change') },
          { t: 'Queue Reconstruction by Height', d: 'M', p: 'LeetCode', u: LC('queue-reconstruction-by-height') },
          { t: 'Candy', d: 'H', p: 'LeetCode', u: LC('candy') },
        ] },
      { title: 'Intervals',
        concepts: [
          'Sort intervals by start time first — almost every interval problem becomes a simple linear scan once they\'re in order.',
          'Two intervals overlap when one\'s start is before the other\'s end (and vice versa) — draw a number line if the condition ever feels unclear.',
          'Merging, inserting, and counting overlaps are the three core interval operations; scheduling/meeting-room problems are all variations on counting overlaps. Note: this is a naturally small real problem set — several classic "meeting rooms" problems are premium-locked on LeetCode, so a couple of items below are Build tasks instead of dead/paywalled links.',
        ],
        learnMore: { label: 'GeeksforGeeks — Interval Scheduling', url: GFG('merging intervals') },
        q: [
          { t: 'Insert Interval', d: 'M', p: 'LeetCode', u: LC('insert-interval') },
          { t: 'Merge Intervals', d: 'M', p: 'LeetCode', u: LC('merge-intervals') },
          { t: 'Non-overlapping Intervals', d: 'M', p: 'LeetCode', u: LC('non-overlapping-intervals') },
          { t: 'My Calendar I', d: 'M', p: 'LeetCode', u: LC('my-calendar-i') },
          { t: 'Car Pooling', d: 'M', p: 'LeetCode', u: LC('car-pooling') },
          { t: 'Minimum Number of Arrows to Burst Balloons', d: 'M', p: 'LeetCode', u: LC('minimum-number-of-arrows-to-burst-balloons') },
          { t: 'Minimum Interval to Include Each Query', d: 'H', p: 'LeetCode', u: LC('minimum-interval-to-include-each-query') },
          { t: 'Determine if a person can attend every meeting on their calendar given a list of (start, end) intervals', d: 'E', p: 'Build task' },
        ] },
      { title: 'Math & Geometry',
        concepts: [
          'Matrix problems (rotate, spiral, set-zeroes) come down to careful index arithmetic — work out the transformation on a small 3×3 example before coding.',
          'Number-theory basics (GCD, primality, modular exponentiation) show up in "is this valid" and "compute this efficiently" style questions.',
          'Watch for integer overflow and edge cases (0, negative numbers, empty grids) — math problems are graded as much on correctness at the edges as on the core logic.',
        ],
        learnMore: { label: 'GeeksforGeeks — Mathematical Algorithms', url: GFG('mathematical algorithms') },
        q: [
          { t: 'Happy Number', d: 'E', p: 'LeetCode', u: LC('happy-number') },
          { t: 'Plus One', d: 'E', p: 'LeetCode', u: LC('plus-one') },
          { t: 'Rotate Image', d: 'M', p: 'LeetCode', u: LC('rotate-image') },
          { t: 'Spiral Matrix', d: 'M', p: 'LeetCode', u: LC('spiral-matrix') },
          { t: 'Set Matrix Zeroes', d: 'M', p: 'LeetCode', u: LC('set-matrix-zeroes') },
          { t: "Pow(x, n)", d: 'M', p: 'LeetCode', u: LC('powx-n') },
          { t: 'Multiply Strings', d: 'M', p: 'LeetCode', u: LC('multiply-strings') },
          { t: 'Detect Squares', d: 'M', p: 'LeetCode', u: LC('detect-squares') },
          { t: 'Palindrome Number', d: 'E', p: 'LeetCode', u: LC('palindrome-number') },
          { t: 'Excel Sheet Column Title', d: 'E', p: 'LeetCode', u: LC('excel-sheet-column-title') },
          { t: 'Roman to Integer', d: 'E', p: 'LeetCode', u: LC('roman-to-integer') },
          { t: 'Greatest Common Divisor of Strings', d: 'E', p: 'LeetCode', u: LC('greatest-common-divisor-of-strings') },
          { t: 'Integer to Roman', d: 'M', p: 'LeetCode', u: LC('integer-to-roman') },
          { t: 'Basic Calculator II', d: 'M', p: 'LeetCode', u: LC('basic-calculator-ii') },
          { t: 'Count Primes', d: 'M', p: 'LeetCode', u: LC('count-primes') },
        ] },
      { title: 'Bit Manipulation',
        concepts: [
          'XOR cancels duplicates (x ^ x = 0, x ^ 0 = x) — the trick behind "find the single/missing number" problems without extra memory.',
          'Shifting left multiplies by 2, shifting right divides by 2 — bit tricks are often just fast arithmetic in disguise.',
          'n & (n-1) clears the lowest set bit — one line that powers counting-set-bits and power-of-two checks.',
        ],
        learnMore: { label: 'GeeksforGeeks — Bit Manipulation', url: GFG('bit manipulation for competitive programming') },
        q: [
          { t: 'Single Number', d: 'E', p: 'LeetCode', u: LC('single-number') },
          { t: 'Number of 1 Bits', d: 'E', p: 'LeetCode', u: LC('number-of-1-bits') },
          { t: 'Counting Bits', d: 'E', p: 'LeetCode', u: LC('counting-bits') },
          { t: 'Reverse Bits', d: 'E', p: 'LeetCode', u: LC('reverse-bits') },
          { t: 'Missing Number', d: 'E', p: 'LeetCode', u: LC('missing-number') },
          { t: 'Sum of Two Integers', d: 'M', p: 'LeetCode', u: LC('sum-of-two-integers') },
          { t: 'Reverse Integer', d: 'M', p: 'LeetCode', u: LC('reverse-integer') },
          { t: 'Power of Two', d: 'E', p: 'LeetCode', u: LC('power-of-two') },
          { t: 'Power of Three', d: 'E', p: 'LeetCode', u: LC('power-of-three') },
          { t: 'Hamming Distance', d: 'E', p: 'LeetCode', u: LC('hamming-distance') },
          { t: 'Binary Number with Alternating Bits', d: 'E', p: 'LeetCode', u: LC('binary-number-with-alternating-bits') },
          { t: 'XOR Operation in an Array', d: 'E', p: 'LeetCode', u: LC('xor-operation-in-an-array') },
        ] },
    ],
    mini: { title: 'Combined Project — DSA Judge Engine', desc: 'A small Java engine that runs test cases against a solution class for greedy/interval/DP problems and reports pass/fail with timing — a direct precursor to how a real online judge works. This closes out the entire DSA phase.' },
  },

  // ==================================================================
  // PHASE 2 — DATA LAYER
  // ==================================================================
  {
    id: 'sql-db', num: 12, phase: 2, title: 'Databases & SQL',
    sub: 'SQL fundamentals, PostgreSQL, transactions, ACID, indexing, query tuning, and the operational concerns (pooling, migrations, replication) that keep a database healthy in production.',
    learnMore: { label: 'PostgreSQL Tutorial', url: 'https://www.postgresql.org/docs/current/tutorial.html' },
    subtopics: [
      { title: 'Core SQL & Joins',
        concepts: [
          'SELECT/WHERE/GROUP BY/HAVING/ORDER BY run in a specific logical order that\'s different from how you type them — knowing that order explains why HAVING can filter on aggregates but WHERE can\'t.',
          'INNER JOIN keeps only matching rows; LEFT JOIN keeps every row from the left table even with no match — most real-world "who\'s missing" queries need LEFT JOIN plus a NULL check.',
          'Window functions (RANK, ROW_NUMBER, LAG) compute across a set of rows without collapsing them into groups — the modern replacement for a lot of self-join gymnastics.',
        ],
        q: [
          { t: 'Combine Two Tables', d: 'E', p: 'LeetCode', u: LC('combine-two-tables') },
          { t: 'Second Highest Salary', d: 'M', p: 'LeetCode', u: LC('second-highest-salary') },
          { t: 'Duplicate Emails', d: 'E', p: 'LeetCode', u: LC('duplicate-emails') },
          { t: 'Customers Who Never Order', d: 'E', p: 'LeetCode', u: LC('customers-who-never-order') },
          { t: 'Employees Earning More Than Their Managers', d: 'E', p: 'LeetCode', u: LC('employees-earning-more-than-their-managers') },
          { t: 'Rank Scores', d: 'M', p: 'LeetCode', u: LC('rank-scores') },
          { t: 'Department Highest Salary', d: 'M', p: 'LeetCode', u: LC('department-highest-salary') },
          { t: 'Department Top Three Salaries', d: 'H', p: 'LeetCode', u: LC('department-top-three-salaries') } ] },
      { title: 'Normalization & Schema Design',
        concepts: [
          'Normalization removes redundant data by splitting it across related tables — 3NF is the practical target for most transactional schemas.',
          'A junction (bridge) table is how you model many-to-many relationships in a relational database — two foreign keys, often composing the primary key together.',
          'Normalization isn\'t free: more joins at read time. Denormalizing deliberately (with a documented reason) is a valid trade-off for read-heavy tables.',
        ],
        q: [
          { t: 'Model a many-to-many tags system with a junction table', d: 'E', p: 'Build task' },
          { t: 'Normalize a flat orders table to 3NF', d: 'M', p: 'Build task' },
          { t: 'Design a schema for a library system with borrowing history', d: 'M', p: 'Build task' } ] },
      { title: 'Transactions, ACID & Indexing',
        concepts: [
          'ACID (Atomicity, Consistency, Isolation, Durability) is the contract a transaction makes: it happens completely or not at all, and concurrent transactions don\'t corrupt each other.',
          'Isolation levels trade correctness for concurrency — Read Committed is Postgres\'s default; Serializable is the strictest and slowest.',
          'An index turns an O(n) table scan into an O(log n) lookup, at the cost of slower writes and extra storage — index the columns your WHERE/JOIN/ORDER BY actually use.',
        ],
        q: [
          { t: 'Explain and demonstrate a dirty read with two transactions', d: 'M', p: 'Build task' },
          { t: 'Add the right index to fix a slow query (EXPLAIN ANALYZE)', d: 'M', p: 'Build task' },
          { t: 'Simulate and resolve a deadlock between two transactions', d: 'H', p: 'Build task' } ] },
      { title: 'Connection Pooling, Migrations & Replication',
        concepts: [
          'A connection pool (HikariCP) keeps a set of ready-to-use DB connections open instead of opening/closing one per request — opening a raw connection is expensive, and pooling is why Spring Boot apps stay fast under load.',
          'A migration tool (Flyway or Liquibase) versions your schema changes as code, applied in order — the same discipline as Git, but for your database structure.',
          'Replication copies data from a primary database to one or more replicas — read replicas offload read traffic, failover replicas keep the system alive if the primary goes down.',
          'Sharding splits a single logical database across multiple physical machines by some key — a scaling technique for when one machine\'s storage or throughput isn\'t enough, at the cost of much harder cross-shard queries.',
        ],
        learnMore: { label: 'HikariCP — README', url: 'https://github.com/brettwooldridge/HikariCP' },
        q: [
          { t: "Configure HikariCP pool size and explain why 'more connections' isn't always faster", d: 'E', p: 'Build task' },
          { t: 'Write a Flyway migration that adds a column with a safe default to an existing table', d: 'M', p: 'Build task' },
          { t: 'Explain the trade-off between synchronous and asynchronous replication for a read replica', d: 'M', p: 'Build task' },
          { t: 'Explain how you\'d choose a shard key for a multi-tenant SaaS database', d: 'H', p: 'Build task' },
        ] },
    ],
    mini: { title: 'Checkpoint Project — Schema + Query Tuning Lab', desc: 'Design a normalized PostgreSQL schema for an e-commerce store, wire it up through a pooled connection with Flyway migrations, then deliberately break and fix slow queries with indexes.' },
  },
  {
    id: 'jpa', num: 13, phase: 2, title: 'Hibernate / JPA',
    sub: 'Entities, relationships, JPQL, lazy vs eager, the N+1 problem, caching.',
    learnMore: { label: 'Baeldung — The Persistence Layer with Spring Data JPA', url: 'https://www.baeldung.com/the-persistence-layer-with-spring-data-jpa' },
    subtopics: [
      { title: 'Entities & Relationships',
        concepts: [
          'An @Entity maps a Java class to a table; @Id marks the primary key — Hibernate generates the SQL to keep the object and row in sync.',
          '@OneToMany/@ManyToOne/@ManyToMany model foreign-key relationships; get the owning side right or JPA won\'t know which table actually stores the foreign key.',
          'Bidirectional relationships need mappedBy on one side to avoid a duplicate join table or infinite JSON serialization loops.',
        ],
        q: [
          { t: 'Model a OneToMany between Order and OrderItem correctly', d: 'E', p: 'Build task' },
          { t: 'Fix a bidirectional ManyToMany causing infinite JSON recursion', d: 'M', p: 'Build task' },
          { t: 'Implement a self-referencing entity (Employee → Manager)', d: 'M', p: 'Build task' } ] },
      { title: 'Querying — JPQL, Criteria, Native & Spring Data',
        concepts: [
          'JPQL queries entities and their fields, not table/column names — it\'s SQL-shaped but operates on your object model.',
          'Spring Data JPA derives queries from method names (findByEmailAndActiveTrue) or lets you write JPQL directly with @Query — both save you from hand-writing repository boilerplate.',
          'The Criteria API builds queries programmatically with type-safe method calls — more verbose than JPQL, but composable for dynamic filters built at runtime.',
          'Native queries drop to raw SQL when JPQL can\'t express what you need — use sparingly, since they break the database-portability JPA otherwise gives you.',
        ],
        q: [
          { t: 'Write a JPQL query with joins and a WHERE on a nested field', d: 'E', p: 'Build task' },
          { t: 'Write 3 Spring Data JPA derived-query methods (findBy...) plus one custom @Query', d: 'E', p: 'Build task' },
          { t: 'Write a native query with pagination for a report', d: 'M', p: 'Build task' },
          { t: 'Build a dynamic search filter using the Criteria API', d: 'H', p: 'Build task' } ] },
      { title: 'Lazy vs Eager, N+1, Caching',
        concepts: [
          'LAZY loads a relationship only when accessed; EAGER loads it immediately with the parent — LAZY is the safer default, EAGER can silently pull in far more data than you meant to.',
          'The N+1 problem: one query for a list of N parents, then N more queries fetching each parent\'s children one at a time — fix it with a JOIN FETCH or an entity graph.',
          'Second-level cache stores entities across sessions/requests — a real win for read-heavy, rarely-changing data, but a correctness risk if you forget to invalidate it on writes.',
        ],
        q: [
          { t: 'Diagnose and fix an N+1 query using a given repository', d: 'M', p: 'Build task' },
          { t: 'Switch a relation from EAGER to LAZY without breaking a DTO mapper', d: 'M', p: 'Build task' },
          { t: 'Enable second-level cache for a read-heavy entity', d: 'H', p: 'Build task' } ] },
    ],
    mini: { title: 'Checkpoint Project — Inventory Persistence Layer', desc: 'A JPA layer for a warehouse system using Spring Data JPA repositories: entities, relationships, and one deliberately-fixed N+1 problem with before/after query logs.' },
  },

  // ==================================================================
  // PHASE 3 — THE FRAMEWORK
  // ==================================================================
  {
    id: 'spring', num: 14, phase: 3, title: 'Spring Core & Spring Boot',
    sub: 'IoC/DI, bean lifecycle, layered architecture, configuration, validation, and how Spring\'s AOP magic actually works underneath.',
    learnMore: { label: 'Spring Framework — Core Technologies', url: 'https://docs.spring.io/spring-framework/reference/core.html' },
    subtopics: [
      { title: 'IoC, DI & Bean Lifecycle',
        concepts: [
          'Inversion of Control: Spring creates and wires your objects (beans), instead of your code calling `new` and manually gluing dependencies together.',
          'Constructor injection is the recommended default — it makes required dependencies explicit and lets you create immutable, easily-testable classes.',
          'A bean\'s lifecycle (instantiate → inject dependencies → @PostConstruct → ready → @PreDestroy) is fully managed by the container; scopes (singleton vs prototype) control how many instances exist.',
        ],
        q: [
          { t: 'Convert field injection to constructor injection across a service', d: 'E', p: 'Build task' },
          { t: 'Resolve a circular dependency between two @Service beans', d: 'M', p: 'Build task' },
          { t: 'Write a custom @Configuration with @Bean and scopes (singleton/prototype)', d: 'M', p: 'Build task' } ] },
      { title: 'Layered Architecture & Config',
        concepts: [
          'Controller (HTTP in/out) → Service (business logic) → Repository (data access) keeps each layer replaceable and independently testable.',
          'Spring profiles (application-dev.yml, application-prod.yml) let the same code run with different configuration per environment, activated by a single active-profile flag.',
          '@ConfigurationProperties binds a whole block of YAML/properties to a typed Java object — safer and more discoverable than scattering @Value annotations everywhere.',
        ],
        q: [
          { t: 'Split a fat Controller into Controller/Service/Repository layers', d: 'E', p: 'Build task' },
          { t: 'Set up application-dev.yml and application-prod.yml with profiles', d: 'M', p: 'Build task' },
          { t: 'Externalize secrets using environment variables + @ConfigurationProperties', d: 'M', p: 'Build task' } ] },
      { title: 'Exception Handling & Validation',
        concepts: [
          '@ControllerAdvice + @ExceptionHandler centralizes error handling — one place maps exceptions to HTTP status codes instead of try/catch in every controller method.',
          '@Valid triggers Bean Validation (@NotNull, @Size, @Email, ...) on request bodies automatically, rejecting bad input before it reaches your business logic.',
          'A consistent error-response shape (RFC 7807 "problem details" or your own convention) makes API errors predictable for every client that calls you.',
        ],
        q: [
          { t: 'Build a global exception handler with @ControllerAdvice', d: 'M', p: 'Build task' },
          { t: 'Add request validation with @Valid and custom annotations', d: 'M', p: 'Build task' },
          { t: 'Return structured error responses (RFC 7807 style)', d: 'H', p: 'Build task' } ] },
      { title: 'Spring AOP',
        concepts: [
          'Aspect-Oriented Programming lets you inject behavior (logging, transactions, security checks) around existing methods without modifying their code — that\'s literally how @Transactional works under the hood.',
          'An aspect is made of advice (the code to run) and a pointcut (which methods it applies to, matched by an expression) — Spring weaves them together at runtime via proxies.',
          '@Around advice can run code before AND after a method, and even skip calling it entirely — the most powerful (and most easily misused) advice type.',
        ],
        learnMore: { label: 'Spring — Aspect Oriented Programming', url: 'https://docs.spring.io/spring-framework/reference/core/aop.html' },
        q: [
          { t: 'Write an @Before aspect that logs every method call in the Service layer', d: 'E', p: 'Build task' },
          { t: 'Write an @Around aspect that times method execution and logs slow calls', d: 'M', p: 'Build task' },
          { t: "Explain how @Transactional uses a proxy under the hood, and why calling an @Transactional method from within the same class doesn't trigger it", d: 'H', p: 'Build task' },
        ] },
    ],
    mini: { title: 'Checkpoint Project — Task Manager Service (Spring Boot)', desc: 'A clean layered Spring Boot service for tasks/projects, profile-based config, global exception handling, and an AOP-based logging aspect across the Service layer.' },
  },
  {
    id: 'rest', num: 15, phase: 3, title: 'REST API Design',
    sub: 'HTTP fundamentals, the networking layer underneath it, DTOs, versioning, pagination, and OpenAPI docs.',
    learnMore: { label: 'restfulapi.net — REST API Tutorial', url: 'https://restfulapi.net/' },
    subtopics: [
      { title: 'HTTP Semantics & Status Codes',
        concepts: [
          'GET/POST/PUT/PATCH/DELETE map to CRUD, but the real distinction that matters is idempotency: GET/PUT/DELETE should be safe to retry, POST usually isn\'t.',
          '2xx = success, 4xx = the client\'s fault (bad input, missing auth), 5xx = the server\'s fault — picking the right code is part of the API contract, not a detail.',
          'Status codes alone aren\'t enough context for a client — pair them with a clear, structured error body explaining what went wrong.',
        ],
        q: [
          { t: 'Map CRUD operations to correct HTTP verbs and status codes', d: 'E', p: 'Build task' },
          { t: 'Design idempotent PUT vs non-idempotent POST endpoints', d: 'M', p: 'Build task' },
          { t: 'Implement proper 4xx vs 5xx handling for a payments endpoint', d: 'M', p: 'Build task' } ] },
      { title: 'DTOs, Versioning & Pagination',
        concepts: [
          'A DTO (Data Transfer Object) is a shape designed for the API contract — mapping Entity → DTO stops internal database columns and relationships from leaking to clients.',
          'Version your API (URI prefix like /v2/, or a header) before you need to — it\'s the only way to change a contract without breaking every existing client at once.',
          'Offset pagination (page/size) is simple but slow on large tables; cursor-based pagination (keyset) stays fast because it doesn\'t need to skip rows.',
        ],
        q: [
          { t: 'Map Entity → DTO to avoid leaking internal fields', d: 'E', p: 'Build task' },
          { t: 'Version an API using URI vs header-based versioning', d: 'M', p: 'Build task' },
          { t: 'Add cursor-based pagination to a large listing endpoint', d: 'H', p: 'Build task' } ] },
      { title: 'Documentation & Contracts',
        concepts: [
          'OpenAPI/Swagger generates interactive, always-up-to-date docs directly from your code\'s annotations — far more reliable than a hand-written doc that drifts.',
          'A shared Postman collection with environment variables lets a whole team (or a frontend dev with no backend access) exercise every endpoint without reading the source.',
          'A consistent error contract across every endpoint (same field names, same structure) is what makes an API pleasant to integrate against.',
        ],
        q: [
          { t: 'Document an API fully with springdoc-openapi/Swagger', d: 'E', p: 'Build task' },
          { t: 'Write a Postman collection with environment variables', d: 'E', p: 'Build task' },
          { t: 'Design a consistent error-response contract across all endpoints', d: 'M', p: 'Build task' } ] },
      { title: 'Networking Foundations',
        concepts: [
          'HTTP is a request/response protocol layered on top of TCP; HTTPS adds TLS encryption on top of that — the padlock means the connection is encrypted, not that the site itself is trustworthy.',
          'DNS resolves a human-readable hostname to an IP address before any connection can be made — that lookup (often cached) is the first hidden step of every request.',
          'TCP guarantees ordered, reliable delivery at the cost of connection setup overhead (the three-way handshake); UDP is faster and connectionless but delivers no ordering or delivery guarantee.',
          'WebSockets upgrade an HTTP connection into a persistent, full-duplex channel — reach for them only when the server genuinely needs to push data to the client unprompted (chat, live updates).',
        ],
        learnMore: { label: 'MDN — An Overview of HTTP', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview' },
        q: [
          { t: 'Trace a full HTTP request lifecycle (DNS lookup, TCP handshake, TLS handshake, request/response) for a URL', d: 'E', p: 'Build task' },
          { t: "Explain when you'd choose TCP vs UDP for a given application (e.g. video call vs file download)", d: 'E', p: 'Build task' },
          { t: 'Use browser dev tools to inspect the DNS/connection/TLS timing breakdown of a real request', d: 'M', p: 'Build task' },
          { t: 'Build a minimal WebSocket echo server and client', d: 'M', p: 'Build task' },
        ] },
    ],
    mini: { title: 'Combined Project — Task Manager REST API', desc: 'Turn the Spring Boot checkpoint project into a documented, versioned, paginated REST API with Postman + Swagger.' },
  },

  // ==================================================================
  // PHASE 4 — PRODUCTION HARDENING
  // ==================================================================
  {
    id: 'security', num: 16, phase: 4, title: 'Security',
    sub: 'AuthN vs AuthZ, Spring Security, JWT, OAuth2 basics, password hashing, CORS, and the specific vulnerabilities every backend has to defend against.',
    learnMore: { label: 'OWASP Top Ten', url: 'https://owasp.org/www-project-top-ten/' },
    subtopics: [
      { title: 'Authentication vs Authorization',
        concepts: [
          'Authentication answers "who are you?" (login); authorization answers "what are you allowed to do?" (roles/permissions) — conflating the two is a common source of security bugs.',
          'Never store passwords in plaintext or with a fast hash — BCrypt (or Argon2) is deliberately slow and salted, making brute-force attacks impractical.',
          'Broken access control (OWASP #1) usually means checking authentication but forgetting authorization — verifying a request is real without verifying it\'s allowed to touch that resource.',
        ],
        q: [
          { t: 'Hash and verify passwords using BCrypt', d: 'E', p: 'Build task' },
          { t: 'Implement role-based access control (USER vs ADMIN)', d: 'M', p: 'Build task' },
          { t: 'Explain and fix a broken access control endpoint (OWASP #1)', d: 'M', p: 'Build task' } ] },
      { title: 'Spring Security & JWT',
        concepts: [
          'Spring Security is a chain of filters that intercepts every request before it reaches your controller — a custom UserDetailsService plugs your own user lookup into that chain.',
          'A JWT is a signed (not necessarily encrypted) token carrying claims — the server trusts it because of the signature, not because it looked it up in a session store.',
          '@PreAuthorize enforces method-level security with a SpEL expression, giving finer-grained control than URL-pattern-based rules alone.',
        ],
        q: [
          { t: 'Set up Spring Security with a custom UserDetailsService', d: 'M', p: 'Build task' },
          { t: 'Add method-level security with @PreAuthorize', d: 'M', p: 'Build task' },
          { t: 'Issue and validate JWT access + refresh tokens', d: 'H', p: 'Build task' } ] },
      { title: 'OAuth2 & CORS',
        concepts: [
          'OAuth2\'s authorization code flow lets a user grant your app access without ever handing it their password — the app gets a token, not the credentials.',
          'CORS is a browser-enforced rule, not a server security feature — it stops a browser page on one origin from silently calling your API on another unless you explicitly allow it.',
          'Rate limiting on auth endpoints specifically defends against brute-force login attempts — a login endpoint with no rate limit is an open invitation.',
        ],
        q: [
          { t: 'Configure CORS correctly for a React frontend calling your API', d: 'E', p: 'Build task' },
          { t: 'Explain the OAuth2 authorization code flow with a diagram', d: 'M', p: 'Build task' },
          { t: 'Add rate limiting to a login endpoint to block brute force', d: 'H', p: 'Build task' } ] },
      { title: 'Common Web Vulnerabilities — SQLi, XSS & CSRF',
        concepts: [
          'SQL injection happens when user input is concatenated directly into a query — parameterized queries (prepared statements) are the fix, not string-escaping tricks.',
          'XSS (Cross-Site Scripting) happens when unescaped user input is rendered as HTML/JS in another user\'s browser — modern frameworks escape output by default, which is why avoiding raw HTML injection prevents most of it.',
          'CSRF tricks a logged-in user\'s browser into submitting a request they didn\'t intend — CSRF tokens (or the SameSite cookie attribute) prove a request actually came from your own site\'s form.',
        ],
        learnMore: { label: 'OWASP Top Ten', url: 'https://owasp.org/www-project-top-ten/' },
        q: [
          { t: 'Demonstrate a SQL injection against unparameterized code, then fix it with a PreparedStatement', d: 'M', p: 'Build task' },
          { t: 'Build a form vulnerable to stored XSS, then fix it with proper output escaping', d: 'M', p: 'Build task' },
          { t: 'Explain how a CSRF token or SameSite cookie attribute stops a forged cross-site request', d: 'M', p: 'Build task' },
        ] },
    ],
    mini: { title: 'Checkpoint Project — Auth Service', desc: 'A standalone authentication microservice: signup, login, JWT issuing, role-based route protection, hardened against SQL injection, XSS, and CSRF.' },
  },
  {
    id: 'testing', num: 17, phase: 4, title: 'Testing',
    sub: 'JUnit, Mockito, unit vs integration, coverage, TDD basics.',
    learnMore: { label: 'JUnit 5 User Guide', url: 'https://junit.org/junit5/docs/current/user-guide/' },
    subtopics: [
      { title: 'Unit Testing with JUnit & Mockito',
        concepts: [
          'A unit test exercises one class in isolation — mock its dependencies (with Mockito) so a failure in the Repository doesn\'t also fail the Service\'s tests.',
          'assertThrows verifies that bad input actually throws the expected exception — untested exception paths are some of the most common production bugs.',
          'A stub returns canned data with no verification, a mock verifies interactions happened, a spy wraps a real object so you can override just some methods, and a fake is a lightweight working implementation (like an in-memory repository) — knowing which one you need keeps tests honest.',
        ],
        q: [
          { t: 'Write unit tests for a Service class mocking the Repository', d: 'E', p: 'Build task' },
          { t: 'Test exception paths using assertThrows', d: 'E', p: 'Build task' },
          { t: 'Mock an external API call using Mockito and verify interactions', d: 'M', p: 'Build task' },
          { t: 'Write one test each using a stub, a mock, a spy, and a fake, and explain when you\'d reach for each', d: 'M', p: 'Build task' },
        ] },
      { title: 'Integration Testing',
        concepts: [
          '@SpringBootTest boots the real application context — slower than a unit test, but it catches wiring/configuration bugs unit tests can\'t see.',
          '@WebMvcTest loads only the web layer (controllers, MockMvc) without the full context; @DataJpaTest loads only the JPA/repository layer against an in-memory DB — both are far faster than a full @SpringBootTest when you only need one slice.',
          'Testcontainers spins up a real, disposable Postgres (or any service) in Docker for tests — closer to production behavior than an in-memory H2 substitute.',
        ],
        q: [
          { t: 'Write a @SpringBootTest with an in-memory H2 database', d: 'M', p: 'Build task' },
          { t: 'Test a REST controller end-to-end with MockMvc using @WebMvcTest', d: 'M', p: 'Build task' },
          { t: 'Test a repository in isolation using @DataJpaTest', d: 'M', p: 'Build task' },
          { t: 'Set up Testcontainers to run tests against real PostgreSQL', d: 'H', p: 'Build task' } ] },
      { title: 'TDD & Coverage',
        concepts: [
          'Red-green-refactor: write a failing test first (red), write the minimum code to pass it (green), then clean up (refactor) with the safety net already in place.',
          'Coverage percentage measures which lines ran during tests — it says nothing about whether the assertions were meaningful, so treat it as a floor, not a goal.',
          'The edge cases most likely to be missed are empty input, null, boundary values (0, -1, max), and concurrent access — deliberately hunt for these.',
        ],
        q: [
          { t: 'Get a service class to 90%+ coverage with JaCoCo', d: 'E', p: 'Build task' },
          { t: 'Build one feature strictly red-green-refactor (TDD)', d: 'M', p: 'Build task' },
          { t: 'Identify untested edge cases in an existing class', d: 'M', p: 'Build task' } ] },
    ],
    mini: { title: 'Combined Project — Fully Tested Auth Service', desc: 'Add a complete unit + integration test suite (with Testcontainers, @WebMvcTest and @DataJpaTest slices) to the Auth Service project.' },
  },

  // ==================================================================
  // PHASE 5 — SCALE & SHIP
  // ==================================================================
  {
    id: 'cache-mq', num: 18, phase: 5, title: 'Caching & Messaging',
    sub: 'Redis basics and a message queue (Kafka or RabbitMQ).',
    learnMore: { label: 'Redis Documentation', url: 'https://redis.io/docs/latest/' },
    subtopics: [
      { title: 'Redis Caching',
        concepts: [
          'Redis is an in-memory key-value store — reads that would hit a slow DB query instead hit memory, often 100x+ faster.',
          '@Cacheable annotates a Spring method so its result is cached automatically on first call and served from cache afterward; @CacheEvict clears it when the underlying data changes.',
          'A TTL (time-to-live) on cached entries bounds how stale data can get without you having to manually invalidate everything.',
          'Cache invalidation is famously hard: write-through (update cache on every write) keeps it fresh but adds write latency; a cache stampede happens when many requests miss the cache at once and all hammer the DB simultaneously.',
        ],
        q: [
          { t: 'Cache a slow DB read endpoint with @Cacheable + TTL', d: 'E', p: 'Build task' },
          { t: 'Implement cache invalidation on update with @CacheEvict (write-through)', d: 'M', p: 'Build task' },
          { t: 'Handle a cache stampede with locking or request coalescing', d: 'H', p: 'Build task' } ] },
      { title: 'Message Queues (pick Kafka or RabbitMQ)',
        concepts: [
          'A queue decouples producer from consumer in time — the producer doesn\'t wait for the consumer to be ready or fast, it just publishes and moves on.',
          'This buys resilience (a slow/down consumer doesn\'t block the producer) at the cost of eventual, not immediate, consistency.',
          'At-least-once delivery may redeliver a message after a failure (so consumers must be idempotent); exactly-once is much harder to guarantee and usually means at-least-once plus deduplication on the consumer side.',
          'A dead-letter queue catches messages that repeatedly fail processing, so one poison message can\'t block or crash the whole consumer.',
        ],
        q: [
          { t: 'Publish and consume a simple event (OrderPlaced)', d: 'E', p: 'Build task' },
          { t: 'Design an async email-notification consumer decoupled from the API', d: 'M', p: 'Build task' },
          { t: 'Make a consumer idempotent so redelivered (at-least-once) messages don\'t double-process', d: 'M', p: 'Build task' },
          { t: 'Implement a dead-letter queue for failed message processing', d: 'H', p: 'Build task' } ] },
    ],
    mini: { title: 'Checkpoint Project — Order Events Pipeline', desc: 'Orders published as events, consumed asynchronously (idempotently) to update inventory and send notifications, with Redis caching on reads.' },
  },
  {
    id: 'docker', num: 19, phase: 5, title: 'Docker & Containers',
    sub: 'Dockerfile basics, docker-compose, containerizing Spring Boot.',
    learnMore: { label: 'Docker — Get Started', url: 'https://docs.docker.com/get-started/' },
    subtopics: [
      { title: 'Dockerfile Fundamentals',
        concepts: [
          'A Dockerfile is a recipe for a reproducible image — every environment (your laptop, CI, production) runs the exact same bytes.',
          'Multi-stage builds compile in one stage (with the full JDK) and copy only the final artifact into a slim runtime stage — dramatically smaller final images.',
          'Bake config out, not in: pass environment-specific values via environment variables at runtime, don\'t hardcode them into the image.',
        ],
        q: [
          { t: 'Pass environment-specific config into a container at runtime', d: 'E', p: 'Build task' },
          { t: 'Write a multi-stage Dockerfile for a Spring Boot app', d: 'M', p: 'Build task' },
          { t: 'Reduce a Java image size using a slim/distroless base', d: 'M', p: 'Build task' } ] },
      { title: 'docker-compose & Networking',
        concepts: [
          'docker-compose describes a multi-container app (API + DB + cache) as one YAML file, started with a single command.',
          'A named volume persists data outside the container\'s writable layer — without one, a container restart wipes your database.',
          'Containers on the same compose network can reach each other by service name; containers on different networks are isolated by default — a common source of "why can\'t these talk?" bugs.',
        ],
        q: [
          { t: 'Set up a named volume so DB data survives container restarts', d: 'E', p: 'Build task' },
          { t: 'Compose an app + PostgreSQL + Redis stack with one command', d: 'M', p: 'Build task' },
          { t: "Debug why two containers on different networks can't talk", d: 'M', p: 'Build task' } ] },
    ],
    mini: { title: 'Checkpoint Project — Fully Containerized Stack', desc: 'Package the Order Events Pipeline (API + DB + Redis + MQ) into a single docker-compose stack.' },
  },
  {
    id: 'cicd', num: 20, phase: 5, title: 'CI/CD & Deployment',
    sub: 'GitHub Actions, deployment strategy, environment configs, and real observability — not just a health check.',
    learnMore: { label: 'GitHub Actions Documentation', url: 'https://docs.github.com/en/actions' },
    subtopics: [
      { title: 'GitHub Actions',
        concepts: [
          'A workflow is triggered by an event (push, PR) and runs a sequence of jobs/steps in a fresh, disposable runner — nothing persists between runs unless you cache it explicitly.',
          'Running tests on every PR is the cheapest, highest-leverage CI check you can add — it catches regressions before they reach main.',
          'A matrix build runs the same job across multiple configurations (Java versions, OSes) in parallel, catching compatibility issues a single-version build would miss.',
        ],
        q: [
          { t: 'Write a workflow that runs tests on every PR', d: 'E', p: 'Build task' },
          { t: 'Add a build-and-push-to-registry job on merge to main', d: 'M', p: 'Build task' },
          { t: 'Set up a matrix build across two Java versions', d: 'M', p: 'Build task' } ] },
      { title: 'Deployment & Monitoring',
        concepts: [
          'A /health endpoint is the minimum contract a deploy pipeline (or load balancer) needs to know if an instance is actually serving traffic.',
          'Structured logging (JSON, consistent fields) is what makes logs searchable/alertable at scale — plain text logs don\'t scale past one developer tailing a file.',
          'Zero-downtime deploys route traffic away from an instance before restarting it, and back only once it\'s healthy — the alternative is a visible blip on every deploy.',
        ],
        q: [
          { t: 'Add structured logging and a /health endpoint', d: 'E', p: 'Build task' },
          { t: 'Deploy a container to a VM with a zero-downtime restart script', d: 'M', p: 'Build task' },
          { t: 'Set up a basic alert for high error rate or downtime', d: 'H', p: 'Build task' } ] },
      { title: 'Observability — Actuator, Logging & Metrics',
        concepts: [
          'Spring Boot Actuator exposes ready-made operational endpoints (/health, /metrics, /info) — the standard way a load balancer or monitoring tool checks if an instance is actually alive.',
          'SLF4J is the logging facade your code calls; Logback (or Log4j2) is the actual implementation underneath in a typical Spring Boot app — switching implementations shouldn\'t require touching your log statements.',
          'Prometheus scrapes and stores time-series metrics; Grafana turns those metrics into dashboards and alerts — together the standard open-source pairing for "is my service healthy right now?"',
        ],
        learnMore: { label: 'Spring Boot Actuator Reference', url: 'https://docs.spring.io/spring-boot/reference/actuator/index.html' },
        q: [
          { t: 'Enable Spring Boot Actuator and expose /health and /metrics endpoints', d: 'E', p: 'Build task' },
          { t: "Switch a service's logging to structured JSON output with SLF4J + Logback", d: 'M', p: 'Build task' },
          { t: 'Wire Actuator metrics into a local Prometheus + Grafana dashboard', d: 'H', p: 'Build task' },
        ] },
    ],
    mini: { title: 'Combined Project — Auto-Deployed Stack', desc: 'Full CI/CD: push to main → tests run → image built → deployed to your Azure VM automatically, with Actuator + Prometheus/Grafana observability.' },
  },

  // ==================================================================
  // PHASE 6 — THINK LIKE AN ARCHITECT
  // ==================================================================
  {
    id: 'sysdesign', num: 21, phase: 6, title: 'System Design Basics',
    sub: 'Scalability, load balancing, caching strategy, monoliths vs microservices, API gateways, and the distributed-systems concepts that come up in every design interview.',
    learnMore: { label: 'The System Design Primer', url: 'https://github.com/donnemartin/system-design-primer' },
    subtopics: [
      { title: 'Scalability Concepts',
        concepts: [
          'Vertical scaling (bigger machine) is simple but hits a ceiling and a single point of failure; horizontal scaling (more machines) has no hard ceiling but needs the app to be stateless.',
          'Estimate before you design: back-of-envelope numbers (requests/sec, storage/day) tell you whether a problem needs a single server or a distributed system.',
          'A rate limiter protects a system from being overwhelmed — token bucket allows controlled bursts, sliding window is stricter and smoother over time.',
        ],
        q: [
          { t: 'Explain vertical vs horizontal scaling with a real scenario', d: 'E', p: 'Build task' },
          { t: 'Design a URL shortener (traffic estimate, schema, scaling)', d: 'M', p: 'Build task' },
          { t: 'Design a rate limiter (token bucket vs sliding window)', d: 'H', p: 'Build task' } ] },
      { title: 'Monoliths, Microservices & Gateways',
        concepts: [
          'A monolith is simpler to build, test, and deploy at small scale; microservices trade that simplicity for independent scaling and deployment — don\'t default to microservices without a real reason.',
          'An API gateway is the single entry point that routes to backend services, and the natural place to centralize auth, rate limiting, and logging.',
          'Fan-out systems (notify millions of users) push work onto a queue and workers instead of doing it synchronously in the request path — the request returns fast, delivery happens in the background.',
        ],
        q: [
          { t: 'Decide monolith vs microservices for a given product spec', d: 'M', p: 'Build task' },
          { t: 'Design an API gateway routing to 3 backend services', d: 'M', p: 'Build task' },
          { t: 'Design a notification system for millions of users (fan-out)', d: 'H', p: 'Build task' } ] },
      { title: 'Resilience & Distributed Systems Concepts',
        concepts: [
          'CAP theorem: a distributed system can only fully guarantee two of Consistency, Availability, and Partition tolerance at once — since network partitions are a fact of life, the real choice in practice is CP vs AP.',
          'A circuit breaker (Resilience4j) stops calling a failing downstream service after enough failures, failing fast instead of piling up timeouts — it "trips open," then periodically tests if the service has recovered.',
          'Idempotency in distributed systems means a request can be safely retried without duplicating its effect — critical for payment/order APIs where a network retry must not double-charge a customer.',
          'A CDN caches static content at edge locations close to users, cutting latency and origin server load — the first line of defense for anything that doesn\'t change per-request.',
        ],
        learnMore: { label: 'The System Design Primer', url: 'https://github.com/donnemartin/system-design-primer' },
        q: [
          { t: 'Explain CAP theorem with a concrete example of choosing CP vs AP for a given system', d: 'M', p: 'Build task' },
          { t: 'Implement a circuit breaker around a flaky external API call using Resilience4j', d: 'M', p: 'Build task' },
          { t: 'Design an idempotency-key mechanism so a retried payment request never double-charges', d: 'H', p: 'Build task' },
        ] },
    ],
    mini: { title: 'Checkpoint Project — Design Doc: Your App at Scale', desc: 'Write a real system design doc for scaling one of your projects to 100k concurrent users — bottlenecks, caching, queueing, circuit breakers, and CDN placement.' },
  },
  {
    id: 'cloud', num: 22, phase: 6, title: 'Cloud Fundamentals',
    sub: 'Core AWS/Azure services for backend: compute, storage, managed databases.',
    learnMore: { label: 'AWS Cloud Practitioner Essentials', url: 'https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/' },
    subtopics: [
      { title: 'Compute & Storage',
        concepts: [
          'A VM gives full OS control but you own patching/scaling; managed compute (App Service, ECS) trades some control for far less operational overhead.',
          'Object storage (Blob/S3) is built for large, unstructured files (uploads, backups) — not a substitute for a database\'s querying ability.',
          'Autoscaling reacts to a metric (CPU, request count) to add/remove instances automatically — the cloud-native answer to "what if traffic spikes?"',
        ],
        q: [
          { t: 'Deploy a Spring Boot app to a fresh Azure VM from scratch', d: 'E', p: 'Build task' },
          { t: 'Set up object storage (Azure Blob/S3) for file uploads', d: 'M', p: 'Build task' },
          { t: 'Configure autoscaling rules for a compute instance group', d: 'H', p: 'Build task' } ] },
      { title: 'Managed Databases & Networking',
        concepts: [
          'A managed database (RDS, Azure Database for PostgreSQL) hands off backups, patching, and failover to the cloud provider — usually worth the extra cost over self-hosting.',
          'A VPC/VNet is your own isolated network inside the cloud — public subnets face the internet, private subnets (like your database) shouldn\'t.',
          'A security group/firewall is a whitelist: only open the exact ports something legitimately needs (443, your app port, DB port from the app only) — never "allow all" in production.',
        ],
        q: [
          { t: 'Configure a firewall/security group to only allow needed ports', d: 'E', p: 'Build task' },
          { t: 'Migrate a local PostgreSQL DB to a managed cloud DB instance', d: 'M', p: 'Build task' },
          { t: 'Set up a VPC/VNet with public and private subnets', d: 'H', p: 'Build task' } ] },
    ],
    mini: { title: 'Checkpoint Project — Cloud-Native Redeploy', desc: 'Re-architect one of your deployments using a managed DB + blob storage + proper network security groups.' },
  },

  // ==================================================================
  // PHASE 7 — FRONTEND & FULL-STACK
  // ==================================================================
  {
    id: 'html-css', num: 23, phase: 7, title: 'HTML, CSS & Responsive Design',
    sub: 'Semantic markup, accessibility, Flexbox/Grid layout, responsive breakpoints.',
    learnMore: { label: 'MDN — Learn HTML', url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML' },
    subtopics: [
      { title: 'Semantic HTML & Accessibility',
        concepts: [
          'Semantic tags (<nav>, <main>, <article>, <button>) tell the browser and assistive tech what content *means*, not just how it looks — a <div onclick> is not a button to a screen reader.',
          'Every interactive element needs to be reachable and operable by keyboard alone (Tab, Enter, Space) — mouse-only interactions lock out a real chunk of users.',
          'Alt text, sufficient color contrast, and a logical heading order (h1 → h2 → h3, no skipping) are the highest-leverage, lowest-effort accessibility wins.',
        ],
        q: [
          { t: 'Rebuild a div-soup page using semantic landmark elements', d: 'E', p: 'Build task' },
          { t: 'Make a custom form fully keyboard- and screen-reader-accessible', d: 'M', p: 'Build task' },
          { t: 'Audit a page against WCAG AA (contrast, alt text, focus order)', d: 'M', p: 'Build task' } ] },
      { title: 'CSS Layout (Flexbox & Grid)',
        concepts: [
          'Flexbox is one-dimensional (a row or a column) — reach for it when aligning/distributing items along a single axis.',
          'Grid is two-dimensional (rows and columns together) — reach for it when the layout itself is the point (page structure, card galleries).',
          'They compose: Grid for the overall page skeleton, Flexbox inside individual components — most real layouts use both.',
        ],
        q: [
          { t: 'Build a holy-grail layout with CSS Grid', d: 'E', p: 'Build task' },
          { t: 'Recreate a pricing-cards row that wraps cleanly with Flexbox', d: 'M', p: 'Build task' },
          { t: 'Build a responsive image gallery with grid-auto-fit/minmax', d: 'M', p: 'Build task' } ] },
      { title: 'Responsive Design & Media Queries',
        concepts: [
          'Mobile-first means writing the base styles for the smallest screen, then adding complexity with min-width media queries as the viewport grows — the opposite of overriding a desktop layout downward.',
          'A breakpoint should be chosen where *your content* breaks, not at a specific device width — devices change, your layout\'s natural break points don\'t.',
          'clamp()/min()/max() let font size and spacing scale fluidly between two bounds without needing a media query for every size in between.',
        ],
        q: [
          { t: 'Make a fixed desktop layout mobile-first with media queries', d: 'E', p: 'Build task' },
          { t: 'Build a navbar that collapses to a hamburger under 768px', d: 'M', p: 'Build task' },
          { t: 'Use clamp()/min()/max() for fluid typography and spacing', d: 'M', p: 'Build task' } ] },
    ],
    mini: { title: 'Checkpoint Project — Responsive Landing Page', desc: 'A pixel-clean, fully responsive, accessible landing page built with semantic HTML and Grid/Flexbox — no framework.' },
  },
  {
    id: 'js-dom', num: 24, phase: 7, title: 'JavaScript Core & DOM',
    sub: 'Language fundamentals, ES6+, DOM manipulation, events, async patterns.',
    learnMore: { label: 'MDN — JavaScript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide' },
    subtopics: [
      { title: 'JS Fundamentals & ES6+',
        concepts: [
          'Closures let a function remember variables from where it was defined, even after that outer function has returned — the mechanism behind private state and callbacks.',
          'var is function-scoped and hoisted with a confusing "undefined until assigned" behavior; let/const are block-scoped — default to const, use let only when reassignment is needed.',
          'Array methods (map, filter, reduce) transform data without mutating the original — understanding what each one returns is the key to chaining them correctly.',
        ],
        q: [
          { t: 'Predict and explain output of tricky closure/hoisting snippets', d: 'E', p: 'Build task' },
          { t: 'Reimplement map/filter/reduce from scratch on arrays', d: 'M', p: 'Build task' },
          { t: 'Deep-clone a nested object without structuredClone', d: 'M', p: 'Build task' } ] },
      { title: 'DOM Manipulation & Events',
        concepts: [
          'The DOM is a live tree representation of the page — JavaScript reads and mutates it directly, and the browser re-renders in response.',
          'Events bubble up from the element they fired on to its ancestors — event delegation exploits this by attaching one listener to a parent instead of one per child.',
          'Debouncing delays work until input pauses (good for search-as-you-type); throttling caps how often work can run regardless of input rate (good for scroll/resize handlers).',
        ],
        q: [
          { t: 'Build a to-do list with add/remove/toggle, no framework', d: 'E', p: 'Build task' },
          { t: 'Implement event delegation for a dynamic list', d: 'M', p: 'Build task' },
          { t: 'Build a debounced live-search input against a mock API', d: 'M', p: 'Build task' } ] },
      { title: 'Async JavaScript',
        concepts: [
          'JavaScript is single-threaded but non-blocking — async operations (fetch, timers) run in the background and their callbacks are queued to run when the call stack is clear.',
          'async/await is syntax sugar over Promises — it lets asynchronous code read top-to-bottom like synchronous code, including try/catch for errors.',
          'Promise.all runs multiple async operations concurrently and waits for all of them — much faster than awaiting each one sequentially when they don\'t depend on each other.',
        ],
        q: [
          { t: 'Rewrite a callback pyramid using async/await', d: 'E', p: 'Build task' },
          { t: 'Fetch and render data with proper loading + error states', d: 'M', p: 'Build task' },
          { t: 'Implement Promise.all with a concurrency limit', d: 'H', p: 'Build task' } ] },
    ],
    mini: { title: 'Checkpoint Project — Vanilla JS Weather Dashboard', desc: 'A no-framework app that fetches a weather API, handles loading/error states, and updates the DOM reactively.' },
  },
  {
    id: 'typescript', num: 25, phase: 7, title: 'TypeScript Fundamentals',
    sub: 'Types, interfaces, generics, and the advanced type features that matter in React.',
    learnMore: { label: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/handbook/intro.html' },
    subtopics: [
      { title: 'Types & Interfaces',
        concepts: [
          'TypeScript adds a type layer on top of JavaScript that\'s checked at compile time and erased at runtime — it catches a whole class of bugs before the code ever runs.',
          'interface and type both describe object shapes; interfaces can be extended/merged, types are more flexible for unions and computed shapes — most codebases pick one convention and stick to it.',
          'any opts out of type checking entirely — it should be a last resort, not a default escape hatch when a type is hard to express.',
        ],
        q: [
          { t: 'Type a messy JS module with interfaces and unions', d: 'E', p: 'Build task' },
          { t: 'Model an API response with nested/optional fields as types', d: 'M', p: 'Build task' },
          { t: 'Replace all `any` in a small codebase with precise types', d: 'M', p: 'Build task' } ] },
      { title: 'Advanced TS',
        concepts: [
          'Generics let a function or type work with any type while still preserving type information — `<T>` is a placeholder filled in at the call site.',
          'Utility types (Partial, Pick, Omit, Record) derive new types from existing ones instead of redefining them by hand — keeps types in sync with a single source of truth.',
          'A discriminated union (a shared "tag" field distinguishing variants) plus an exhaustive switch with a `never` default catches at compile time if you forget to handle a case.',
        ],
        q: [
          { t: 'Write a generic function with constrained type parameters', d: 'M', p: 'Build task' },
          { t: 'Use utility types (Partial, Pick, Omit, Record) to derive types', d: 'M', p: 'Build task' },
          { t: 'Build a discriminated union + exhaustive switch with never', d: 'H', p: 'Build task' } ] },
    ],
    mini: { title: 'Checkpoint Project — Typed API Client', desc: 'A small, fully-typed API client wrapper with generics for requests/responses and no `any` anywhere.' },
  },
  {
    id: 'react-fundamentals', num: 26, phase: 7, title: 'React Fundamentals',
    sub: 'Components, props, state, hooks, forms, and the render model.',
    learnMore: { label: 'React — Learn', url: 'https://react.dev/learn' },
    subtopics: [
      { title: 'Components & Props',
        concepts: [
          'A component is a function that returns UI — props are its read-only inputs, passed down from parent to child, never mutated by the child.',
          'children is a special prop that lets a component wrap arbitrary content it doesn\'t need to know the shape of — the pattern behind reusable layout/card components.',
          '"Lifting state up" means moving shared state to the nearest common ancestor of the components that need it — the default way to share data between siblings before reaching for Context.',
        ],
        q: [
          { t: 'Break a static page into reusable, prop-driven components', d: 'E', p: 'Build task' },
          { t: 'Build a reusable Card/List with children and render props', d: 'M', p: 'Build task' },
          { t: 'Lift state up to share data between two sibling components', d: 'M', p: 'Build task' } ] },
      { title: 'State & Hooks',
        concepts: [
          'useState triggers a re-render whenever its setter is called — React batches and schedules renders, it doesn\'t update the DOM synchronously on every call.',
          'useEffect runs side effects (fetching, subscriptions) after render; its cleanup function (the returned function) prevents leaks when the component unmounts or dependencies change.',
          'A custom hook is just a function starting with "use" that calls other hooks — the standard way to extract and reuse stateful logic across components.',
        ],
        q: [
          { t: 'Build a counter/toggle with useState correctly (no stale state)', d: 'E', p: 'Build task' },
          { t: 'Fetch data in useEffect with cleanup and a loading state', d: 'M', p: 'Build task' },
          { t: 'Extract shared logic into a custom hook (e.g. useLocalStorage)', d: 'M', p: 'Build task' } ] },
      { title: 'Forms & Events',
        concepts: [
          'A controlled input\'s value is driven entirely by React state — every keystroke updates state, and state renders back into the input, making React the single source of truth.',
          'For a multi-field form, a reducer (useReducer) often reads cleaner than a pile of individual useState calls, especially once validation logic gets involved.',
          'Debounce input handlers that trigger expensive work (API calls) and cancel stale in-flight requests when newer input arrives — otherwise responses can return out of order.',
        ],
        q: [
          { t: 'Build a controlled form with validation and error messages', d: 'E', p: 'Build task' },
          { t: 'Handle a multi-field form with a single state object + reducer', d: 'M', p: 'Build task' },
          { t: 'Debounce a search field and cancel stale requests', d: 'M', p: 'Build task' } ] },
    ],
    mini: { title: 'Checkpoint Project — React Task Board', desc: 'A component-driven task board (add/edit/complete) with custom hooks and controlled forms — no state library yet.' },
  },
  {
    id: 'react-advanced', num: 27, phase: 7, title: 'React Advanced & State Management',
    sub: 'Context, global state, performance, routing, and data fetching.',
    learnMore: { label: 'React — Scaling Up with Reducer and Context', url: 'https://react.dev/learn/scaling-up-with-reducer-and-context' },
    subtopics: [
      { title: 'Context API & Global State',
        concepts: [
          'Context lets a value skip past intermediate components straight to whatever descendant needs it — the fix for prop-drilling a value through five layers that don\'t use it themselves.',
          'An auth context is a common real use: hold the current user and login/logout functions once, read them anywhere via a hook, and gate routes based on that state.',
          'useReducer + Context is a lightweight alternative to a state-management library for genuinely complex, interrelated state — reach for a library only once this stops being enough.',
        ],
        q: [
          { t: 'Replace deep prop-drilling with a Context provider', d: 'E', p: 'Build task' },
          { t: 'Build an auth context with login/logout and a protected route', d: 'M', p: 'Build task' },
          { t: 'Model complex global state with useReducer + Context', d: 'M', p: 'Build task' } ] },
      { title: 'Performance',
        concepts: [
          'React re-renders a component whenever its state or props change — the Profiler shows you which components rendered and why, which is the first step before optimizing anything.',
          'memo/useMemo/useCallback prevent unnecessary re-renders or recomputation, but they have their own cost — apply them where profiling shows a real problem, not everywhere by default.',
          'Virtualization renders only the list items currently visible in the viewport, not all of them — the only real fix for a long list that\'s janky to scroll.',
        ],
        q: [
          { t: 'Find and fix an unnecessary-rerender bug with the Profiler', d: 'M', p: 'Build task' },
          { t: 'Apply memo/useMemo/useCallback where they actually help', d: 'M', p: 'Build task' },
          { t: 'Virtualize a long list to keep scrolling smooth', d: 'H', p: 'Build task' } ] },
      { title: 'Routing & Data Fetching',
        concepts: [
          'A client-side router intercepts navigation and swaps components without a full page reload — nested routes mirror nested UI layouts.',
          'A data-fetching library (React Query, SWR) adds caching, revalidation, and request deduplication on top of raw fetch — solving problems most apps eventually hit by hand-rolling their own.',
          'Every list endpoint needs three states handled explicitly: loading, error, and empty — "it just works when there\'s data" isn\'t a complete implementation.',
        ],
        q: [
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

// { c: solved, t: total, allDone } for one subtopic. Used by the topic-level
// checkbox (Phase 2 onward) — checking it marks every question in that
// subtopic done in one go; it shows checked whenever they already all are.
export function subtopicProgress(top, si, progress) {
  const s = top.subtopics[si];
  let c = 0;
  s.q.forEach((q, qi) => {
    if (progress && progress[qid(top.id, si, qi)]) c++;
  });
  const t = s.q.length;
  return { c, t, allDone: t > 0 && c === t };
}
