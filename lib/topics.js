// lib/topics.js — the Java Backend Engineer roadmap content + small pure
// progress helpers.
//
// Curriculum refinement (Phase 3 of this project): restructured from the
// original 8-phase/30-topic roadmap into a curriculum designed around
// dependency-aware, learning-oriented phases. See CURRICULUM_REFINEMENT_PLAN.md
// for the full audit, data model, and backward-compatibility analysis this
// structure is built from.
//
// Shapes:
//   PHASES:         [{ name, desc, tier, numbered?, learnMore? }]
//     tier drives the 5(+1)-section UI grouping (roadmap page), without
//     changing phase numbering/prerequisites: 'core-foundations' | 'dsa' |
//     'backend' | 'production-advanced' | 'system-design' | 'optional'.
//     `numbered: false` (NoSQL, Full-Stack Extension only) marks a container
//     that exists purely to group optional-elective topics for the UI and is
//     NOT one of the approved 26 numbered curriculum phases — it must never
//     be counted in a "N phases" statistic or given a phase number badge.
//     Kubernetes stays `numbered: true` (implicit) — it IS phase 26, just
//     tier: 'optional' so it never contributes to required progress.
//   TOPICS:         [{ id, num, phase, title, sub, learnMore?, subtopics, mini, quiz }]
//     subtopics:    [{ title, concepts: [...], learnMore?, checklist?, q: [{ t, d, p, u? }] }]
//       - d = 'E'|'M'|'H'
//   PHASE_PROJECTS: [{ title, desc }]   one per PHASES entry, same order
//   CAPSTONE:       { title, desc }
//
// Backward compatibility: progress keys are `topicId::subtopicIndex::questionIndex`.
// Topic ids were kept unchanged wherever a phase reassignment was a genuine
// 1:1 move (security, testing, docker, cloud, kubernetes, nosql, the 5
// frontend topics, sql-db, build-tools, cache-mq, cicd, jpa — the latter four
// via a safe end-of-array trim/append that doesn't reindex surviving
// subtopics). Ids changed only where a topic was genuinely split or merged
// with no honest 1:1 owner (java-core, solid, git, linux-cli, spring, rest,
// sysdesign, and — after a post-implementation correction — java-fundamentals
// itself: its surviving OOP/Enums remainder now lives under a fresh id,
// `core-java`, rather than reusing `java-fundamentals` at reindexed subtopic
// positions, which would have silently misattributed old progress to
// unrelated new content). Existing progress on every orphaned old id is
// orphaned, not deleted, and stops counting toward anything. See
// CURRICULUM_REFINEMENT_PLAN.md §8 for the full per-topic reasoning.

export const DIFF = { E: 'Easy', M: 'Medium', H: 'Hard' };

export const PHASES = [
  {
    "name": "Phase 1 — Programming Foundations",
    "tier": "core-foundations",
    "desc": "Variables, control flow, and recursion — the raw material every later phase assumes you already have, taught before Java's own syntax gets in the way.",
    "learnMore": {
      "label": "Oracle — The Java Tutorials",
      "url": "https://docs.oracle.com/javase/tutorial/"
    }
  },
  {
    "name": "Phase 2 — Core Java",
    "tier": "core-foundations",
    "desc": "Classes, objects, and the four OOP pillars — the vocabulary the rest of this roadmap is written in.",
    "learnMore": {
      "label": "Oracle — Object-Oriented Programming Concepts",
      "url": "https://docs.oracle.com/javase/tutorial/java/concepts/"
    }
  },
  {
    "name": "Phase 3 — Object-Oriented Design",
    "tier": "core-foundations",
    "desc": "Beyond definitions: design a small system, not just recite what encapsulation means.",
    "learnMore": {
      "label": "GeeksforGeeks — SOLID Principles",
      "url": "https://www.geeksforgeeks.org/system-design/solid-principle-in-programming-understand-with-real-life-examples/"
    }
  },
  {
    "name": "Phase 4 — Collections & Generics",
    "tier": "core-foundations",
    "desc": "The data structures every Java program is built from, and how HashMap actually works underneath.",
    "learnMore": {
      "label": "Oracle — Collections Framework Overview",
      "url": "https://docs.oracle.com/javase/tutorial/collections/intro/index.html"
    }
  },
  {
    "name": "Phase 5 — Modern Java",
    "tier": "core-foundations",
    "desc": "Exceptions, streams, Optional, immutability, and the modern Date/Time API — how idiomatic Java is actually written today.",
    "learnMore": {
      "label": "Oracle — Streams Package",
      "url": "https://docs.oracle.com/javase/8/docs/api/java/util/stream/package-summary.html"
    }
  },
  {
    "name": "Phase 6 — Concurrency & JVM",
    "tier": "core-foundations",
    "desc": "Threads, locks, and how the JVM manages memory underneath it all — enough depth to reason about a real production incident, not more.",
    "learnMore": {
      "label": "Oracle — Concurrency Tutorial",
      "url": "https://docs.oracle.com/javase/tutorial/essential/concurrency/"
    }
  },
  {
    "name": "DSA & Algorithms",
    "tier": "dsa",
    "desc": "Every core data structure and algorithm pattern — a parallel track you can work on alongside the backend path, never a blocker to it.",
    "learnMore": {
      "label": "NeetCode — DSA Roadmap",
      "url": "https://neetcode.io/roadmap"
    }
  },
  {
    "name": "Phase 8 — Developer Fundamentals",
    "tier": "backend",
    "desc": "Git, Linux, and how HTTP actually works — the ground floor every backend job assumes you already have, taught before Spring hides it behind annotations.",
    "learnMore": {
      "label": "MDN — An Overview of HTTP",
      "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview"
    }
  },
  {
    "name": "Phase 9 — SQL & PostgreSQL",
    "tier": "backend",
    "desc": "Model and query data correctly — this is where most backend bugs actually live, and it comes before any ORM hides the SQL from you.",
    "learnMore": {
      "label": "PostgreSQL Tutorial",
      "url": "https://www.postgresql.org/docs/current/tutorial.html"
    }
  },
  {
    "name": "Phase 10 — JDBC & Maven",
    "tier": "backend",
    "desc": "The raw database driver underneath every ORM, and the build tool that's been running your projects since Phase 1.",
    "learnMore": {
      "label": "Maven — Getting Started Guide",
      "url": "https://maven.apache.org/guides/getting-started/"
    }
  },
  {
    "name": "Phase 11 — Spring Core",
    "tier": "backend",
    "desc": "Why Spring exists: Inversion of Control and Dependency Injection, understood, not memorized as annotations.",
    "learnMore": {
      "label": "Spring Framework Reference",
      "url": "https://docs.spring.io/spring-framework/reference/"
    }
  },
  {
    "name": "Phase 12 — Spring Boot & REST APIs",
    "tier": "backend",
    "desc": "Turn Spring Core into a real, callable service — layered architecture, DTOs, and API design that ships.",
    "learnMore": {
      "label": "Spring Boot Reference Docs",
      "url": "https://docs.spring.io/spring-boot/documentation.html"
    }
  },
  {
    "name": "Phase 13 — JPA & Hibernate",
    "tier": "backend",
    "desc": "The layer between your Java objects and your SQL tables — and exactly what each layer in SQL → JDBC → ORM → JPA → Hibernate → Spring Data JPA actually does.",
    "learnMore": {
      "label": "Hibernate ORM Documentation",
      "url": "https://hibernate.org/orm/documentation/"
    }
  },
  {
    "name": "Phase 14 — Production API Engineering",
    "tier": "backend",
    "desc": "What separates a working API from a production one: idempotency, rate limiting, real observability, and configuration that doesn't require a rebuild to change.",
    "learnMore": {
      "label": "Spring Boot Actuator Reference",
      "url": "https://docs.spring.io/spring-boot/reference/actuator/index.html"
    }
  },
  {
    "name": "Phase 15 — Spring Security",
    "tier": "backend",
    "desc": "Authentication and authorization as a model you understand, not a JWT config you copy-pasted.",
    "learnMore": {
      "label": "OWASP Top Ten",
      "url": "https://owasp.org/www-project-top-ten/"
    }
  },
  {
    "name": "Phase 16 — Testing",
    "tier": "backend",
    "desc": "Nothing ships without it — unit tests, integration tests, and Testcontainers, tied to the project you're actually building.",
    "learnMore": {
      "label": "JUnit 5 User Guide",
      "url": "https://junit.org/junit5/docs/current/user-guide/"
    }
  },
  {
    "name": "Phase 17 — Production Backend Engineering",
    "tier": "production-advanced",
    "desc": "The synthesis phase: clean code, refactoring, debugging, and code review, practiced on a real running project — not a separate theory unit.",
    "learnMore": {
      "label": "Refactoring.Guru — Code Smells",
      "url": "https://refactoring.guru/refactoring/smells"
    }
  },
  {
    "name": "Phase 18 — Redis & Caching",
    "tier": "production-advanced",
    "desc": "Skip the slow database round-trip for data you ask for again and again.",
    "learnMore": {
      "label": "Redis Documentation",
      "url": "https://redis.io/docs/latest/"
    }
  },
  {
    "name": "Phase 19 — Messaging & Kafka",
    "tier": "production-advanced",
    "desc": "Decouple services with an event log instead of direct calls — producers, consumers, partitions, and what happens when a message fails.",
    "learnMore": {
      "label": "Apache Kafka Documentation",
      "url": "https://kafka.apache.org/documentation/"
    }
  },
  {
    "name": "Phase 20 — Docker",
    "tier": "production-advanced",
    "desc": "\"Works on my machine\" stops being a real risk once it's containerized.",
    "learnMore": {
      "label": "Docker — Get Started",
      "url": "https://docs.docker.com/get-started/"
    }
  },
  {
    "name": "Phase 21 — CI/CD",
    "tier": "production-advanced",
    "desc": "Automated pipelines that build, test, and deploy — so shipping is a routine event, not a nerve-wracking one.",
    "learnMore": {
      "label": "GitHub Actions Documentation",
      "url": "https://docs.github.com/en/actions"
    }
  },
  {
    "name": "Phase 22 — Cloud",
    "tier": "production-advanced",
    "desc": "Take one project to real cloud infrastructure — pick one ecosystem and go deep, rather than a shallow tour of three.",
    "learnMore": {
      "label": "AWS Documentation",
      "url": "https://docs.aws.amazon.com/"
    }
  },
  {
    "name": "Phase 23 — LLD & Design Patterns",
    "tier": "system-design",
    "desc": "The trade-off-driven design discussion SOLID and the GoF patterns are actually for — earned only once you've felt a bad design hurt on a real project.",
    "learnMore": {
      "label": "GeeksforGeeks — SOLID Principles",
      "url": "https://www.geeksforgeeks.org/system-design/solid-principle-in-programming-understand-with-real-life-examples/"
    }
  },
  {
    "name": "Phase 24 — HLD & Distributed Systems",
    "tier": "system-design",
    "desc": "Zoom out from one service to a system that survives real traffic, real failures, and real growth.",
    "learnMore": {
      "label": "The System Design Primer",
      "url": "https://github.com/donnemartin/system-design-primer"
    }
  },
  {
    "name": "Phase 25 — Microservices",
    "tier": "system-design",
    "desc": "Only after you understand a well-designed monolith: when splitting a service is actually worth the coordination cost it adds.",
    "learnMore": {
      "label": "Microservices.io — Patterns",
      "url": "https://microservices.io/patterns/index.html"
    }
  },
  {
    "name": "Phase 26 — Kubernetes (Advanced/Optional)",
    "tier": "optional",
    "desc": "Not a prerequisite for becoming a capable Java backend engineer — orchestration for when you're running enough containers that Docker Compose stops being enough.",
    "learnMore": {
      "label": "Kubernetes Documentation",
      "url": "https://kubernetes.io/docs/home/"
    }
  },
  {
    "name": "NoSQL Databases (Optional)",
    "tier": "optional",
    "numbered": false,
    "desc": "Not part of the core Java Backend Engineer path — a useful elective once you understand relational modeling well enough to know when NOT to reach for it.",
    "learnMore": {
      "label": "MongoDB Documentation",
      "url": "https://www.mongodb.com/docs/manual/"
    }
  },
  {
    "name": "Full-Stack Extension (Optional)",
    "tier": "optional",
    "numbered": false,
    "desc": "Close the loop with a real frontend — entirely optional for a backend-focused path, kept here for anyone who wants to build the full stack themselves.",
    "learnMore": {
      "label": "MDN Web Docs",
      "url": "https://developer.mozilla.org/en-US/docs/Web"
    }
  }
];

export const PHASE_PROJECTS = [
  {
    "title": "Phase Project — Command-Line Utility Suite",
    "desc": "Three small command-line programs (a grade calculator, a number-guessing game, a recursive Towers-of-Hanoi solver) applying variables, control flow, and recursion — no classes beyond what a single main() needs yet."
  },
  {
    "title": "Phase Project — Console Banking System",
    "desc": "A multi-class console banking app (Account, SavingsAccount, CheckingAccount, Transaction) applying encapsulation, inheritance, and polymorphism — the first project with a real class hierarchy."
  },
  {
    "title": "Phase Project — Library System Design",
    "desc": "A designed-then-implemented Library system (Book, Member, Loan) applying composition over inheritance, with a UML class diagram produced before the code."
  },
  {
    "title": "Phase Project — Inventory Lookup System",
    "desc": "An in-memory inventory system using a generic repository interface, custom HashMap keys with correct equals()/hashCode(), and multiple Comparator-based sort orders."
  },
  {
    "title": "Phase Project — Order Processing Pipeline",
    "desc": "A stream-based order-validation pipeline using Optional instead of null throughout, immutable result types, and custom checked exceptions — no raw null anywhere in the codebase."
  },
  {
    "title": "Phase Project — Concurrent Task Processor",
    "desc": "A task-processing system using a correctly-sized ExecutorService, Callable/Future, a ReentrantLock guarding shared state, and the same workload re-run on virtual threads for comparison."
  },
  {
    "title": "Phase Project — DSA Problem Tracker CLI",
    "desc": "A Java console app that logs solved problems across all 18 DSA patterns from this track — arrays/two pointers/sliding window, stacks/binary search/linked lists, trees/heaps/tries, backtracking/graphs, advanced graphs/DP, and greedy/intervals/math/bit tricks — tracking your own stats by pattern and difficulty."
  },
  {
    "title": "Phase Project — Team Git Playbook & API Smoke-Test Script",
    "desc": "A documented branching strategy applied to one of your own repos, plus a bash script that curl-tests a public REST API and reports pass/fail per endpoint based on status code."
  },
  {
    "title": "Phase Project — Normalized PostgreSQL Schema for a Bookstore",
    "desc": "A normalized PostgreSQL schema (books, authors, orders, customers) with proper constraints and indexes, queried directly with hand-written SQL — no ORM yet."
  },
  {
    "title": "Phase Project — JDBC Data Access Layer",
    "desc": "Re-implement the Bookstore schema's data access using raw JDBC (PreparedStatement, connection pooling, transactions) — feel exactly what JPA/Hibernate will automate away in Phase 13, built as a Maven multi-module project."
  },
  {
    "title": "Phase Project — Plain Spring IoC Container Demo",
    "desc": "A small Spring (no Boot) application with 3-4 beans wired via constructor injection and a logging aspect applied via AOP to every Service-layer method — Spring's core mechanics with none of Boot's auto-configuration hiding them."
  },
  {
    "title": "Phase Project — Task Management REST API",
    "desc": "A documented, versioned, paginated REST API for managing projects/tasks/assignees, built on Spring Boot with proper layering, DTOs, and global exception handling — the shape of a real placement-ready backend project."
  },
  {
    "title": "Phase Project — JPA-Backed Bookstore API",
    "desc": "Re-implement the Bookstore's data access layer (Phase 9/10) as Spring Data JPA repositories with proper entity relationships, tuned queries, and zero N+1 issues — the same domain, three data-access technologies deep."
  },
  {
    "title": "Phase Project — Hardened Task API",
    "desc": "Take the Task Management API through a production-hardening pass: idempotency-key support, rate limiting, externalized configuration, and Actuator health/metrics endpoints wired to structured logging."
  },
  {
    "title": "Phase Project — Secured Booking API",
    "desc": "A booking/reservation API with JWT authentication and role-based access control, hardened against SQL injection, XSS, and CSRF."
  },
  {
    "title": "Phase Project — Fully Tested Booking API",
    "desc": "Add a complete unit + integration test suite (with Testcontainers, @WebMvcTest and @DataJpaTest slices) to the Secured Booking API."
  },
  {
    "title": "Phase Project — Production E-Commerce Backend",
    "desc": "A production-hardened order-management backend combining Spring Boot, PostgreSQL/JPA, Spring Security, a full test suite, Redis caching, and Docker — refactored for clean code and documented with an accurate README, the capstone of the core+production backend journey."
  },
  {
    "title": "Phase Project — Cached Product Catalog",
    "desc": "Add Redis caching (cache-aside, TTL, and an explicit invalidation strategy) in front of the E-Commerce Backend's product catalog reads, with before/after latency numbers."
  },
  {
    "title": "Phase Project — Distributed Order Events Pipeline",
    "desc": "Orders published as Kafka events on a keyed topic, consumed idempotently by a separate inventory service, with a dead-letter topic and a demonstrated at-least-once redelivery scenario handled correctly."
  },
  {
    "title": "Phase Project — Fully Containerized Stack",
    "desc": "Package the E-Commerce Backend (API + PostgreSQL + Redis + Kafka) into a single docker-compose stack that starts with one command."
  },
  {
    "title": "Phase Project — Automated Deployment Pipeline",
    "desc": "Full CI/CD: push to main → tests run → image built → deployed automatically, with Actuator + Prometheus/Grafana observability wired in from Phase 14."
  },
  {
    "title": "Phase Project — Cloud-Deployed Service",
    "desc": "Deploy one project to real cloud infrastructure on a single chosen provider — managed database, proper network security groups, not just a local docker-compose stack."
  },
  {
    "title": "Phase Project — Pluggable Notification Engine",
    "desc": "A notification system (Email/SMS/Push) built using a Factory + Strategy + Observer combination: add a new channel without touching existing classes, with the Problem → Principle → Pattern → Trade-offs reasoning documented for each."
  },
  {
    "title": "Phase Project — System Design Portfolio",
    "desc": "Three written design docs (URL shortener, rate limiter, notification fan-out) each with a capacity estimate, a replication/sharding decision, and a stated CAP trade-off — with one actually deployed on real cloud infrastructure."
  },
  {
    "title": "Phase Project — Distributed Order Processing System",
    "desc": "Split the E-Commerce Backend into Order, Inventory, and Payment services communicating via Kafka events, coordinated by a Saga (with compensating actions) and protected by a circuit breaker on any synchronous call between them."
  },
  {
    "title": "Phase Project — Kubernetes Redeploy",
    "desc": "Take the docker-compose stack and re-deploy it to Kubernetes with a Deployment, Service, ConfigMap, and a horizontal pod autoscaler — optional, advanced infrastructure beyond what's required to be job-ready."
  },
  {
    "title": "Optional Project — Dual-Store Product Catalog",
    "desc": "Model the E-Commerce Backend's product catalog in MongoDB (or a similar document store) and compare the query patterns and schema design against the equivalent PostgreSQL tables — same data, both approaches, side by side."
  },
  {
    "title": "Optional Project — Full-Stack Roadmap App",
    "desc": "A React + TypeScript frontend wired to your Spring Boot API with auth — entirely optional for a backend-focused path, for anyone who wants to close the loop and build the full stack themselves."
  }
];

export const CAPSTONE = {
  "title": "The Capstone",
  "desc": "A production-shaped capstone: a multi-module Spring Boot platform with JPA + PostgreSQL, secured with JWT, cached with Redis, event-driven with Kafka, fully tested, containerized, deployed via CI/CD to real cloud infrastructure, and documented with a system design doc — every core and advanced phase on this roadmap applied end to end. A React + TypeScript frontend (Full-Stack Extension) is a welcome addition, not a requirement."
};

export const TOPICS = [
  {
    "id": "programming-foundations",
    "num": 1,
    "phase": 0,
    "title": "Programming Foundations",
    "sub": "Before Java's own syntax: variables, operators, control flow, and recursion. If you've never programmed before, this is where you actually start — everything else in this roadmap assumes it.",
    "learnMore": {
      "label": "Oracle — Language Basics Trail",
      "url": "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/index.html"
    },
    "subtopics": [
      {
        "title": "Variables & Data Types",
        "concepts": [
          "Java is statically typed: every variable has a fixed type declared up front (int, double, boolean, String, ...) that the compiler checks before the program ever runs.",
          "Primitives (int, long, double, char, boolean) store raw values directly; everything else (String, arrays, objects) is a reference to memory elsewhere.",
          "Know the default values (0, false, null), the difference between int and Integer (autoboxing), and why == on objects compares references, not content."
        ],
        "learnMore": {
          "label": "Oracle — Java Variables Tutorial",
          "url": "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/variables.html"
        },
        "checklist": [
          "Primitive Types (int, double, boolean, char)",
          "Reference Types & the Heap",
          "Default Values & Autoboxing",
          "Type Casting"
        ],
        "q": [
          {
            "t": "Welcome to Java!",
            "d": "E",
            "p": "HackerRank",
            "u": "https://www.hackerrank.com/challenges/welcome-to-java/problem"
          },
          {
            "t": "Java Datatypes",
            "d": "E",
            "p": "HackerRank",
            "u": "https://www.hackerrank.com/challenges/java-datatypes/problem"
          },
          {
            "t": "Java Output Formatting",
            "d": "E",
            "p": "HackerRank",
            "u": "https://www.hackerrank.com/challenges/java-output-formatting/problem"
          },
          {
            "t": "Write a program that demonstrates primitive vs. reference-type behavior when passed to a method",
            "d": "E",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Operators & Control Flow",
        "concepts": [
          "Arithmetic, relational, logical, and assignment operators combine into expressions — know operator precedence well enough to predict output without running the code.",
          "if/else and switch pick one branch; for/while/do-while repeat a block — every algorithm you'll ever write is built from just these primitives.",
          "A modern switch expression (Java 14+) can return a value directly, replacing a lot of fall-through-prone switch statements."
        ],
        "learnMore": {
          "label": "Oracle — Control Flow Statements",
          "url": "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/flow.html"
        },
        "checklist": [
          "Arithmetic, Relational & Logical Operators",
          "if/else & switch",
          "for/while/do-while Loops",
          "Modern Switch Expressions"
        ],
        "q": [
          {
            "t": "Java If-Else",
            "d": "E",
            "p": "HackerRank",
            "u": "https://www.hackerrank.com/challenges/java-if-else/problem"
          },
          {
            "t": "Java Loops I",
            "d": "E",
            "p": "HackerRank",
            "u": "https://www.hackerrank.com/challenges/java-loops-i/problem"
          },
          {
            "t": "Java Loops II",
            "d": "M",
            "p": "HackerRank",
            "u": "https://www.hackerrank.com/challenges/java-loops-ii/problem"
          },
          {
            "t": "Write a program using a switch expression to classify a numeric grade into A/B/C/D/F",
            "d": "E",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Recursion & Problem Solving",
        "concepts": [
          "A recursive function solves a problem by calling itself on a smaller version of the same problem, until it hits a base case small enough to answer directly — every recursive function needs both a base case and a step that genuinely shrinks the problem, or it never terminates.",
          "Trace recursion by drawing the call stack: each call waits for the one below it to return before it can finish itself — this is exactly why a StackOverflowError happens when recursion never reaches its base case.",
          "Problem solving as a discipline, before any specific algorithm: restate the problem in your own words, work a small example by hand, identify the pattern, then write code — most \"I don't know where to start\" moments are actually skipped step one."
        ],
        "learnMore": {
          "label": "GeeksforGeeks — Recursion",
          "url": "https://www.geeksforgeeks.org/dsa/recursion/"
        },
        "checklist": [
          "Base Case & Recursive Case",
          "Tracing the Call Stack",
          "Recursion vs Iteration",
          "A Problem-Solving Framework"
        ],
        "q": [
          {
            "t": "Write a recursive function to compute factorial, then trace its call stack by hand for n=5",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Write a recursive function to reverse a string without using any built-in reverse",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Convert a recursive Fibonacci function to an iterative one and compare their call counts for n=10",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Write a recursive function to sum the digits of a number until a single digit remains",
            "d": "E",
            "p": "Build task"
          }
        ]
      }
    ],
    "mini": {
      "title": "Checkpoint Project — Command-Line Grade Calculator",
      "desc": "A console program that reads student scores, uses control flow to assign letter grades, and includes a recursive function (e.g. computing a running average) as part of the same program."
    },
    "quiz": [
      {
        "q": "What does it mean that Java is statically typed?",
        "options": [
          "A variable's type is fixed and checked by the compiler before the program runs",
          "A variable's type can change at runtime",
          "Types only matter for primitives, not objects",
          "The type is inferred by the JVM at startup"
        ],
        "correct": 0,
        "explanation": "Static typing means the compiler checks and locks in a variable's type up front, unlike a dynamically typed language."
      },
      {
        "q": "What is the default value of an uninitialized instance field of type boolean?",
        "options": [
          "false",
          "true",
          "null",
          "0"
        ],
        "correct": 0,
        "explanation": "Java gives every uninitialized instance field a default — false for boolean, 0 for numeric primitives, null for references."
      },
      {
        "q": "Method overloading is resolved at which point?",
        "options": [
          "Compile time, based on argument types",
          "Runtime, based on the actual object type",
          "Only for static methods",
          "It is never resolved automatically"
        ],
        "correct": 0,
        "explanation": "Overloading is static (compile-time) dispatch — a distinct concept from overriding, which is dynamic (runtime) dispatch."
      },
      {
        "q": "What two things does every correct recursive function need?",
        "options": [
          "A base case, and a step that shrinks the problem toward it",
          "A loop and a counter",
          "A return type of void",
          "At least two parameters"
        ],
        "correct": 0,
        "explanation": "Without a base case, or without genuinely shrinking the problem each call, recursion never terminates."
      },
      {
        "q": "What causes a StackOverflowError?",
        "options": [
          "Recursion (or any call chain) that never reaches a base case, exhausting the call stack",
          "Running out of heap memory",
          "Dividing by zero",
          "An infinite loop with no function calls"
        ],
        "correct": 0,
        "explanation": "Each unfinished call sits on the stack waiting for the one below it to return — recursion with no working base case never returns, and the stack fills up."
      }
    ]
  },
  {
    "id": "core-java",
    "num": 2,
    "phase": 1,
    "title": "Core Java — Classes, Objects & OOP Basics",
    "sub": "Classes, objects, constructors, and the four OOP pillars — the vocabulary every later phase (and every Java job interview) assumes you already speak fluently.",
    "learnMore": {
      "label": "Oracle — Object-Oriented Programming Concepts",
      "url": "https://docs.oracle.com/javase/tutorial/java/concepts/"
    },
    "subtopics": [
      {
        "title": "OOP Pillars",
        "concepts": [
          "Encapsulation: keep fields private, expose behavior through methods — an object controls its own state instead of letting outside code mutate it directly.",
          "Inheritance lets a subclass reuse and extend a superclass; polymorphism lets you call the same method name on different subclasses and get type-specific behavior.",
          "Abstraction hides implementation detail behind an interface or abstract class — callers depend on \"what it does,\" not \"how it does it.\""
        ],
        "learnMore": {
          "label": "Oracle — Object-Oriented Programming Concepts",
          "url": "https://docs.oracle.com/javase/tutorial/java/concepts/"
        },
        "checklist": [
          "Encapsulation",
          "Inheritance",
          "Polymorphism (Overloading vs Overriding)",
          "Abstraction (Interfaces vs Abstract Classes)"
        ],
        "q": [
          {
            "t": "Java Inheritance I",
            "d": "E",
            "p": "HackerRank",
            "u": "https://www.hackerrank.com/challenges/java-inheritance-1/problem"
          },
          {
            "t": "Build a BankAccount class demonstrating encapsulation (private balance, public deposit/withdraw with validation)",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Build a Shape hierarchy (Circle, Rectangle, Triangle) overriding an abstract area() method to demonstrate polymorphism",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Define a Payable interface and implement it across two unrelated classes to demonstrate abstraction",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Write two overloaded methods and one overridden method in the same small program, and explain the difference",
            "d": "E",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Enums, var & Records",
        "concepts": [
          "An enum is a fixed set of named constants — safer than raw ints/strings for a closed set of states (OrderStatus.PENDING/SHIPPED/DELIVERED), and it can carry its own fields and methods.",
          "var lets the compiler infer a local variable's type from its initializer — still statically typed under the hood, just less typing; use it only when the inferred type is obvious from the right-hand side.",
          "A record (Java 16+) is a compact, immutable data carrier — one line replaces a hand-written constructor + getters + equals/hashCode/toString, ideal for DTOs."
        ],
        "learnMore": {
          "label": "Oracle — Record Classes",
          "url": "https://docs.oracle.com/en/java/javase/17/language/records.html"
        },
        "checklist": [
          "Enums as Typed Constants",
          "var Type Inference",
          "Records for Immutable DTOs"
        ],
        "q": [
          {
            "t": "Model OrderStatus as an enum with a field (e.g. a display label) instead of raw strings",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Rewrite a verbose, local-variable-declaration-heavy method using var where it genuinely improves readability",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Convert a hand-written immutable DTO class (constructor + getters + equals/hashCode) into a record",
            "d": "E",
            "p": "Build task"
          }
        ]
      }
    ],
    "mini": {
      "title": "Checkpoint Project — Console Banking System",
      "desc": "A small class hierarchy (Account, SavingsAccount, CheckingAccount) demonstrating encapsulation, inheritance, and polymorphism, with an enum for account status and a record for transaction receipts."
    },
    "quiz": [
      {
        "q": "Which OOP pillar is demonstrated by keeping fields private and exposing behavior through methods?",
        "options": [
          "Encapsulation",
          "Inheritance",
          "Polymorphism",
          "Abstraction"
        ],
        "correct": 0,
        "explanation": "Encapsulation means an object controls its own state instead of letting outside code mutate fields directly."
      },
      {
        "q": "What is the main advantage of a record over a hand-written immutable class?",
        "options": [
          "One line replaces a constructor + getters + equals/hashCode/toString",
          "Records are mutable by default",
          "Records can extend other classes",
          "Records replace interfaces entirely"
        ],
        "correct": 0,
        "explanation": "A record is a compact, immutable data carrier — ideal for DTOs — generating the boilerplate automatically."
      },
      {
        "q": "What does the `static` keyword mean on a field or method?",
        "options": [
          "It belongs to the class itself, not to any one instance",
          "It can never be changed after initialization",
          "It is only visible within the same package",
          "It runs automatically when the JVM starts"
        ],
        "correct": 0,
        "explanation": "A static member is shared across every instance — there's exactly one copy, owned by the class."
      },
      {
        "q": "What does marking a class `final` prevent?",
        "options": [
          "The class from being subclassed",
          "The class from having any fields",
          "The class from being instantiated",
          "The class from implementing interfaces"
        ],
        "correct": 0,
        "explanation": "A final class can't be extended — String is a well-known example, precisely so its immutability guarantee can't be broken by a subclass."
      },
      {
        "q": "What is the purpose of a Java package?",
        "options": [
          "Namespacing and organizing related classes, with its own access-control level",
          "Compiling code faster",
          "Encrypting class files",
          "Replacing the need for a build tool"
        ],
        "correct": 0,
        "explanation": "Packages group related classes and give you package-private (default) access as a visibility level between private and public."
      }
    ]
  },
  {
    "id": "ood-foundations",
    "num": 3,
    "phase": 2,
    "title": "Object-Oriented Design",
    "sub": "Beyond four definitions: composition vs. inheritance, coupling, cohesion, and enough UML to communicate a design — so you can design a small object-oriented system, not just recite what OOP means.",
    "learnMore": {
      "label": "GeeksforGeeks — SOLID Principles",
      "url": "https://www.geeksforgeeks.org/system-design/solid-principle-in-programming-understand-with-real-life-examples/"
    },
    "subtopics": [
      {
        "title": "Single Responsibility & Open/Closed",
        "concepts": [
          "A class should have one reason to change — if you can describe it with \"and,\" it's probably doing two jobs.",
          "Open/Closed: open for extension, closed for modification — add new behavior via new classes/interfaces, not by editing tested code.",
          "Watch for the smell of a class that keeps growing an if/else or switch every time a new case is added — that's usually an OCP violation."
        ],
        "checklist": [
          "Single Responsibility Principle",
          "Open/Closed Principle",
          "Identifying SRP Violations"
        ],
        "q": [
          {
            "t": "Identify SRP violations in a given 150-line class",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Refactor a God class that handles orders, payments and emails",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Add a new discount type without modifying existing code (OCP)",
            "d": "M",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Composition, Coupling & Cohesion",
        "concepts": [
          "Composition builds a class out of other objects (\"has-a\") instead of extending a parent (\"is-a\") — it's more flexible because you can swap a composed part at runtime, while inheritance locks in a relationship at compile time.",
          "Coupling measures how much one class depends on the internal details of another — low coupling means you can change one class without breaking others; high coupling means a small change ripples everywhere.",
          "Cohesion measures how focused a single class is — a highly cohesive class does one clear job well; a low-cohesion class is a grab-bag of unrelated responsibilities, usually a sign it should be split."
        ],
        "learnMore": {
          "label": "GeeksforGeeks — Cohesion and Coupling",
          "url": "https://www.geeksforgeeks.org/software-engineering/software-engineering-coupling-and-cohesion/"
        },
        "checklist": [
          "Composition (\"has-a\") vs Inheritance (\"is-a\")",
          "Low vs High Coupling",
          "Low vs High Cohesion",
          "Designing a Small Object Model"
        ],
        "q": [
          {
            "t": "Refactor a Car class that extends Engine into a Car that has-a Engine (composition)",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Given a tightly-coupled OrderService that directly `new`s a MySQLRepository, decouple it behind an interface",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Design a small object model (3-4 classes) for a library system, and justify each class's single responsibility",
            "d": "M",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "UML Basics",
        "concepts": [
          "A UML class diagram shows classes, their attributes/methods, and the relationships between them (association, inheritance, composition, aggregation) — the most commonly used diagram for communicating an object model.",
          "A sequence diagram shows the order messages are exchanged between objects over time — useful for describing one specific flow (e.g. \"what happens when a user checks out\") rather than the static structure.",
          "Composition (\"owns,\" solid diamond) means the part can't outlive the whole; aggregation (\"has,\" hollow diamond) means it can — a common UML distinction that maps directly to real design decisions."
        ],
        "learnMore": {
          "label": "GeeksforGeeks — UML Diagrams",
          "url": "https://www.geeksforgeeks.org/system-design/unified-modeling-language-uml-introduction/"
        },
        "checklist": [
          "Class Diagrams",
          "Sequence Diagrams",
          "Association vs Composition vs Aggregation",
          "Reading Relationship Multiplicities"
        ],
        "q": [
          {
            "t": "Draw a class diagram for a Library system (Book, Member, Loan) showing multiplicities",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Draw a sequence diagram for a checkout flow involving Cart, PaymentService, and OrderService",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Explain, with an example, the difference between composition and aggregation in a UML diagram",
            "d": "E",
            "p": "Build task"
          }
        ]
      }
    ],
    "mini": {
      "title": "Checkpoint Project — Library System Design",
      "desc": "Design (and implement) a small Library system (Book, Member, Loan) applying SRP, composition over inheritance, and documented with a UML class diagram showing every relationship."
    },
    "quiz": [
      {
        "q": "What does the Single Responsibility Principle say?",
        "options": [
          "A class should have one reason to change",
          "A class should implement one interface",
          "A class should have exactly one public method",
          "A class should never be subclassed"
        ],
        "correct": 0,
        "explanation": "SRP is about reasons to change, not literal method/field counts — a class doing two unrelated jobs should be split."
      },
      {
        "q": "When would you generally prefer composition over inheritance?",
        "options": [
          "When you want to reuse behavior without being locked into an \"is-a\" relationship",
          "Whenever performance matters",
          "Only in functional languages",
          "Never — inheritance is always the safer default"
        ],
        "correct": 0,
        "explanation": "Composition (\"has-a\") is more flexible and avoids fragile deep inheritance hierarchies that couple classes tightly."
      },
      {
        "q": "What does low coupling between two classes mean?",
        "options": [
          "Changing one class is unlikely to require changing the other",
          "The classes are in the same package",
          "The classes share a common parent",
          "The classes have the same number of methods"
        ],
        "correct": 0,
        "explanation": "Low coupling means each class can change independently — a core goal of good object-oriented design."
      },
      {
        "q": "What does a solid (filled) diamond mean in a UML class diagram?",
        "options": [
          "Composition — the part cannot outlive the whole",
          "Inheritance",
          "A one-to-many relationship only",
          "An interface implementation"
        ],
        "correct": 0,
        "explanation": "A filled diamond marks composition; a hollow diamond marks aggregation, where the part CAN outlive the whole."
      },
      {
        "q": "A class with low cohesion is best described as:",
        "options": [
          "A grab-bag of unrelated responsibilities that should probably be split",
          "A class with too many private fields",
          "A class that implements too few interfaces",
          "A class with no constructor"
        ],
        "correct": 0,
        "explanation": "High cohesion means a class does one clear job well; low cohesion is a warning sign the class is doing too much."
      }
    ]
  },
  {
    "id": "collections-generics",
    "num": 4,
    "phase": 3,
    "title": "Collections & Generics",
    "sub": "List, Set, Map, and the generics that make them type-safe — plus what actually happens inside a HashMap when you call put() and get().",
    "learnMore": {
      "label": "Oracle — Collections Framework Overview",
      "url": "https://docs.oracle.com/javase/tutorial/collections/intro/index.html"
    },
    "subtopics": [
      {
        "title": "Collections Framework",
        "concepts": [
          "List (ordered, duplicates OK), Set (no duplicates), and Map (key→value) are the three families — pick based on what question you need to ask the data.",
          "ArrayList is fast random access, slow middle-insert; LinkedList is the reverse — know the Big-O trade-off before defaulting to ArrayList everywhere.",
          "HashMap/HashSet give O(1) average operations via hashing; TreeMap/TreeSet trade that for O(log n) but keep keys sorted.",
          "A HashMap works by calling hashCode() on the key to pick a bucket (an index into an internal array), then equals() to find the exact entry within that bucket — this is why the equals/hashCode contract (equal objects MUST have equal hash codes) is not optional: break it and get() silently fails to find an entry you know is there.",
          "A collision (two different keys hashing to the same bucket) is normal, not a bug — Java handles it by chaining entries in a linked list (or a balanced tree, since Java 8, once a bucket gets large) inside that bucket, which is why a bad hashCode() (e.g. always returning 0) degrades HashMap from O(1) toward O(n).",
          "Reach for HashMap when you need fast key lookup and don't care about order; reach for LinkedHashMap when you need insertion order too, and TreeMap when you need sorted order — using HashMap for a mutable object as a key (whose hashCode can change after insertion) is a classic, hard-to-debug mistake."
        ],
        "learnMore": {
          "label": "Oracle — Collections Framework Overview",
          "url": "https://docs.oracle.com/javase/tutorial/collections/intro/index.html"
        },
        "checklist": [
          "List, Set & Map",
          "ArrayList vs LinkedList",
          "HashMap vs TreeMap",
          "hashCode() & equals() Contract",
          "Collision Handling (Buckets & Chaining)",
          "Choosing the Right Collection"
        ],
        "q": [
          {
            "t": "LRU Cache",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/lru-cache/"
          },
          {
            "t": "Insert Delete GetRandom O(1)",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/insert-delete-getrandom-o1/"
          },
          {
            "t": "Design a bounded blocking queue using core collections",
            "d": "H",
            "p": "Build task"
          },
          {
            "t": "Implement a class used as a HashMap key, override equals()/hashCode() correctly, and write a test proving lookup fails if you only override one of them",
            "d": "M",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Generics, Iterators & Comparators",
        "concepts": [
          "Generics let a class or method work with any type while still catching type errors at compile time — List<String> can't accidentally accept an Integer, unlike a raw List.",
          "An Iterator is how a for-each loop actually works under the hood — it also safely supports removing elements mid-iteration, which a plain for-each loop cannot do without throwing ConcurrentModificationException.",
          "Comparable defines a class's one natural ordering (compareTo, implemented on the class itself); Comparator defines an external, pluggable ordering you can swap without touching the class — use Comparator whenever you need more than one way to sort the same type."
        ],
        "learnMore": {
          "label": "Oracle — Generics Trail",
          "url": "https://docs.oracle.com/javase/tutorial/java/generics/index.html"
        },
        "checklist": [
          "Generic Classes & Methods",
          "Bounded Type Parameters",
          "Iterator & ConcurrentModificationException",
          "Comparable vs Comparator"
        ],
        "q": [
          {
            "t": "Write a generic Box<T> class with a bounded type parameter (e.g. T extends Number)",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Demonstrate ConcurrentModificationException by removing from a List during a for-each loop, then fix it with an Iterator",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Sort a list of Person objects three different ways using three different Comparators, without modifying the Person class",
            "d": "M",
            "p": "Build task"
          }
        ]
      }
    ],
    "mini": {
      "title": "Checkpoint Project — Inventory Lookup System",
      "desc": "An in-memory inventory system using a generic repository interface, a custom key class with correct equals()/hashCode() used as a HashMap key, and multiple Comparators for sorting results."
    },
    "quiz": [
      {
        "q": "Which collection gives O(1) average-case lookup by key?",
        "options": [
          "HashMap",
          "TreeMap",
          "LinkedList",
          "ArrayList"
        ],
        "correct": 0,
        "explanation": "HashMap uses hashing for near-constant-time get/put on average; TreeMap trades that for O(log n) sorted order."
      },
      {
        "q": "What must you override alongside equals() to keep HashMap/HashSet working correctly?",
        "options": [
          "hashCode()",
          "toString()",
          "compareTo()",
          "clone()"
        ],
        "correct": 0,
        "explanation": "Equal objects must produce equal hash codes, or hash-based collections will silently fail to find entries you know are there."
      },
      {
        "q": "What actually happens inside a HashMap when two different keys produce the same hashCode() (a collision)?",
        "options": [
          "Both entries are chained (or tree-stored) in the same bucket, and equals() distinguishes them on lookup",
          "The second insert silently overwrites the first, regardless of equals()",
          "The HashMap throws an exception",
          "The HashMap automatically resizes to avoid ever storing two entries in one bucket"
        ],
        "correct": 0,
        "explanation": "Collisions are normal and expected — a poor hashCode() (e.g. a constant) degrades a HashMap toward O(n)."
      },
      {
        "q": "What is the main benefit of generics over using raw types (e.g. a raw List)?",
        "options": [
          "Type errors are caught at compile time instead of causing a ClassCastException at runtime",
          "Generic code runs faster",
          "Generics remove the need for interfaces",
          "Generics only work with primitives"
        ],
        "correct": 0,
        "explanation": "A List<String> simply cannot compile-time-accept an Integer, whereas a raw List would only fail when you cast the wrong element out."
      },
      {
        "q": "When would you use a Comparator instead of implementing Comparable?",
        "options": [
          "When you need more than one way to sort the same type, without modifying the class",
          "When the class has no natural ordering at all and never will",
          "Comparator is required for every sortable class",
          "Comparable is deprecated in modern Java"
        ],
        "correct": 0,
        "explanation": "Comparable is a class's single natural ordering; Comparator lets you define as many external, swappable orderings as you need."
      }
    ]
  },
  {
    "id": "modern-java",
    "num": 5,
    "phase": 4,
    "title": "Modern Java",
    "sub": "Exception handling, streams and lambdas, and how idiomatic Java is actually written today: Optional instead of null, immutability by default, and the Date/Time API that replaced the old broken one.",
    "learnMore": {
      "label": "Oracle — Streams Package",
      "url": "https://docs.oracle.com/javase/8/docs/api/java/util/stream/package-summary.html"
    },
    "subtopics": [
      {
        "title": "Exception Handling",
        "concepts": [
          "Checked exceptions must be declared or caught (compiler-enforced); unchecked (RuntimeException) exceptions are for programmer errors you don't want to force-catch everywhere.",
          "try-with-resources auto-closes anything implementing AutoCloseable — the modern default over manual finally-block cleanup.",
          "Catch the most specific exception you can meaningfully handle; swallowing exceptions silently (empty catch block) hides real bugs."
        ],
        "learnMore": {
          "label": "Oracle — Exceptions Tutorial",
          "url": "https://docs.oracle.com/javase/tutorial/essential/exceptions/"
        },
        "checklist": [
          "Checked vs Unchecked Exceptions",
          "try-with-resources",
          "Custom Exceptions",
          "Exception Chaining"
        ],
        "q": [
          {
            "t": "Build a custom checked exception hierarchy for a banking app",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Fix a try-with-resources leak in given code",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Design a retry-with-backoff wrapper using custom exceptions",
            "d": "H",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Streams, Lambdas & Functional Interfaces",
        "concepts": [
          "A stream describes a pipeline of operations (filter, map, reduce) over data — it's declarative (\"what to compute\"), not imperative (\"how to loop\").",
          "A lambda is a compact anonymous implementation of a functional interface (one abstract method) — Runnable, Comparator, and Function are common targets.",
          "Streams are lazy and single-use: nothing runs until a terminal operation (collect, forEach, reduce) is called, and a stream can't be reused after that."
        ],
        "learnMore": {
          "label": "Oracle — Streams Package",
          "url": "https://docs.oracle.com/javase/8/docs/api/java/util/stream/package-summary.html"
        },
        "checklist": [
          "Stream Pipeline (filter/map/reduce)",
          "Lambda Expressions",
          "Functional Interfaces",
          "Collectors"
        ],
        "q": [
          {
            "t": "Sum all even numbers in a list using streams",
            "d": "E",
            "p": "HackerRank",
            "u": "https://www.hackerrank.com/domains/java"
          },
          {
            "t": "Group employees by department using Collectors.groupingBy",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Implement a custom Collector for a running statistics summary",
            "d": "H",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Optional, Immutability & the Date/Time API",
        "concepts": [
          "Optional<T> makes \"this might not have a value\" part of the method signature itself, forcing callers to handle absence explicitly instead of risking a NullPointerException three calls later.",
          "An immutable object (like String, or any class with only final fields and no setters) can't be changed after construction — it's automatically thread-safe and can't be corrupted by code that holds a reference to it.",
          "java.time (LocalDate, LocalDateTime, ZonedDateTime, Instant) replaced the old mutable, thread-unsafe Date/Calendar classes — know the difference between a date-only, date+time, and timezone-aware type, and never do manual timezone math yourself."
        ],
        "learnMore": {
          "label": "Oracle — Date Time Trail",
          "url": "https://docs.oracle.com/javase/tutorial/datetime/"
        },
        "checklist": [
          "Optional — Avoiding Null",
          "Designing an Immutable Class",
          "LocalDate / LocalDateTime / ZonedDateTime",
          "Instant & Duration"
        ],
        "q": [
          {
            "t": "Refactor a method that returns null on \"not found\" to return Optional<T> instead, and update callers",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Design an immutable Money class (amount + currency) with no setters, only \"with\"-style methods that return a new instance",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Compute the difference in days between two LocalDates, and separately the difference in seconds between two Instants",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Convert a LocalDateTime in one timezone to another using ZonedDateTime, and explain a daylight-saving-time edge case",
            "d": "M",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Annotations & Reflection Basics",
        "concepts": [
          "An annotation attaches metadata to code (@Override, @Deprecated, or your own custom ones) — it doesn't change behavior by itself, but frameworks (Spring, JUnit, Jackson) read it via reflection to decide what to do.",
          "Reflection lets code inspect and manipulate classes, methods, and fields at runtime instead of compile time — it's how @Autowired finds a constructor to call, and how a test runner finds every @Test method without you registering them manually.",
          "Reflection is powerful but has real costs: it bypasses some compile-time safety, is slower than direct calls, and can break encapsulation if misused — know it exists and how frameworks use it, more than you need to write your own reflection-heavy code."
        ],
        "learnMore": {
          "label": "Oracle — Annotations",
          "url": "https://docs.oracle.com/javase/tutorial/java/annotations/"
        },
        "checklist": [
          "Built-in Annotations (@Override, @Deprecated)",
          "Writing a Custom Annotation",
          "Reading Annotations via Reflection",
          "Where Frameworks Use This"
        ],
        "q": [
          {
            "t": "Write a custom @LogExecutionTime annotation (definition only, no processing yet)",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Use reflection to list every method on a class annotated with your custom annotation, and invoke them",
            "d": "H",
            "p": "Build task"
          },
          {
            "t": "Explain, in your own words, how a testing framework finds and runs every @Test-annotated method without you registering them",
            "d": "E",
            "p": "Build task"
          }
        ]
      }
    ],
    "mini": {
      "title": "Checkpoint Project — Order Processing Pipeline",
      "desc": "A stream-based pipeline that validates, transforms, and summarizes a batch of Order records, using Optional throughout instead of null, an immutable OrderSummary result type, and custom checked exceptions for invalid input."
    },
    "quiz": [
      {
        "q": "What must a resource implement to be used in a try-with-resources block?",
        "options": [
          "AutoCloseable",
          "Serializable",
          "Comparable",
          "Cloneable"
        ],
        "correct": 0,
        "explanation": "try-with-resources calls close() automatically on anything implementing AutoCloseable, even if an exception is thrown."
      },
      {
        "q": "A Java Stream is best described as:",
        "options": [
          "Lazy and single-use — nothing runs until a terminal operation",
          "Eager and reusable across multiple pipelines",
          "A mutable in-memory collection",
          "Always executed in parallel"
        ],
        "correct": 0,
        "explanation": "Nothing in a stream pipeline runs until a terminal operation like collect() or forEach() is called, and it can't be reused afterward."
      },
      {
        "q": "What is the main benefit of returning Optional<T> instead of null from a method?",
        "options": [
          "It forces callers to explicitly handle the \"no value\" case instead of risking a NullPointerException",
          "It makes the method run faster",
          "It automatically retries on failure",
          "It converts the return type to a primitive"
        ],
        "correct": 0,
        "explanation": "Optional makes absence part of the type signature, so the compiler and the caller both have to acknowledge it."
      },
      {
        "q": "Why is an immutable object automatically thread-safe?",
        "options": [
          "Its state can never change after construction, so there's nothing for concurrent threads to corrupt",
          "It uses synchronized internally",
          "It can only be accessed by one thread at a time by the JVM",
          "Immutable objects are stored differently in memory"
        ],
        "correct": 0,
        "explanation": "With no mutable state, there's no race condition to have — this is a major reason immutability is valuable in concurrent code."
      },
      {
        "q": "What is the modern replacement for the old java.util.Date/Calendar classes?",
        "options": [
          "The java.time package (LocalDate, LocalDateTime, ZonedDateTime, Instant)",
          "java.sql.Date",
          "String-based date handling",
          "There is no modern replacement"
        ],
        "correct": 0,
        "explanation": "java.time (introduced in Java 8) is immutable and thread-safe, fixing the well-known problems with the old mutable Date/Calendar API."
      }
    ]
  },
  {
    "id": "concurrency-jvm",
    "num": 6,
    "phase": 5,
    "title": "Concurrency & JVM",
    "sub": "Threads, locks, and the ExecutorService patterns real services use — plus enough JVM memory/GC understanding to reason about a production incident, without going deeper than you need yet.",
    "learnMore": {
      "label": "Oracle — Concurrency Tutorial",
      "url": "https://docs.oracle.com/javase/tutorial/essential/concurrency/"
    },
    "subtopics": [
      {
        "title": "Multithreading & Concurrency",
        "concepts": [
          "A thread is an independent path of execution; shared mutable state between threads is where almost every concurrency bug comes from.",
          "Implementing Runnable (or Callable) and handing it to a Thread/ExecutorService is preferred over extending Thread directly — it keeps your class free to extend something else.",
          "volatile guarantees visibility of a variable's latest value across threads but not atomicity of compound operations (like increment) — that's what atomic classes (AtomicInteger) and synchronized are for.",
          "ExecutorService manages a pool of worker threads for you instead of raw Threads; CompletableFuture chains async work without blocking — the modern alternative to raw wait/notify.",
          "A deadlock happens when two threads each hold a lock the other needs — always acquire locks in a consistent order to avoid it; a race condition happens when the outcome depends on timing you don't control."
        ],
        "learnMore": {
          "label": "Oracle — Concurrency Tutorial",
          "url": "https://docs.oracle.com/javase/tutorial/essential/concurrency/"
        },
        "checklist": [
          "Thread vs Runnable",
          "synchronized & volatile",
          "Atomic Classes",
          "ExecutorService & CompletableFuture",
          "Deadlocks & Race Conditions"
        ],
        "q": [
          {
            "t": "Implement the same task using Thread (extends) vs Runnable (implements), and explain why Runnable is preferred",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Print numbers alternately using two threads",
            "d": "M",
            "p": "GeeksforGeeks",
            "u": "https://www.geeksforgeeks.org/?s=print%20numbers%20alternately%20using%20two%20threads%20java"
          },
          {
            "t": "Demonstrate a race condition with a non-atomic counter, then fix it with AtomicInteger",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Implement a thread-safe counter without synchronized",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Submit 5 tasks to an ExecutorService thread pool and collect results with Future/CompletableFuture",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Build a producer-consumer queue with wait/notify",
            "d": "H",
            "p": "Build task"
          },
          {
            "t": "Reproduce a deadlock between two threads acquiring two locks in opposite order, then fix it",
            "d": "H",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Locks, Callable & ExecutorService in Depth",
        "concepts": [
          "Callable<V> is like Runnable but can return a value and throw a checked exception — submit it to an ExecutorService and get back a Future<V> you can block on (or poll) for the result.",
          "A ReentrantLock gives you more control than synchronized (tryLock with a timeout, interruptible waits, multiple condition variables) at the cost of having to remember to unlock it yourself, always in a finally block.",
          "Sizing a thread pool wrong is a common real bug: too few threads under-utilizes I/O-bound work, too many threads for CPU-bound work causes context-switch thrashing — the right size depends on whether the work is I/O- or CPU-bound."
        ],
        "learnMore": {
          "label": "Oracle — Executors",
          "url": "https://docs.oracle.com/javase/tutorial/essential/concurrency/executors.html"
        },
        "checklist": [
          "Callable & Future",
          "ReentrantLock vs synchronized",
          "Sizing a Thread Pool",
          "CompletableFuture Chaining"
        ],
        "q": [
          {
            "t": "Submit a Callable to an ExecutorService and handle both its result and a thrown exception via Future",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Replace a synchronized block with a ReentrantLock using tryLock with a timeout, falling back gracefully if the lock isn't acquired",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Chain three async steps with CompletableFuture (fetch, transform, save), handling failure at any step",
            "d": "H",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "JVM Internals & Memory Management",
        "concepts": [
          "The JVM splits memory into stack (per-thread, method calls & local variables) and heap (shared, all objects) — a StackOverflowError comes from the stack, an OutOfMemoryError almost always from the heap.",
          "The heap is generational: new objects are allocated in Young Gen (Eden + Survivor spaces); objects that survive enough collections get promoted to Old Gen — this split is what makes garbage collection fast in practice.",
          "A garbage collector reclaims memory for objects with no reachable references — minor GCs on Young Gen are frequent and cheap, major/full GCs on Old Gen are rare and expensive, which is why GC tuning is really about minimizing full GCs."
        ],
        "learnMore": {
          "label": "Oracle — Garbage Collection Tuning Guide",
          "url": "https://docs.oracle.com/en/java/javase/17/gctuning/introduction-garbage-collection-tuning.html"
        },
        "checklist": [
          "Stack vs Heap Memory",
          "Generational Garbage Collection",
          "GC Tuning Flags"
        ],
        "q": [
          {
            "t": "Explain the difference between stack and heap memory with a diagram",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Force and observe a StackOverflowError vs an OutOfMemoryError with two small programs",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Explain Java's generational garbage collection (Young Gen, Old Gen, minor vs major GC)",
            "d": "M",
            "p": "GeeksforGeeks",
            "u": "https://www.geeksforgeeks.org/?s=java%20garbage%20collection%20generational"
          },
          {
            "t": "Use JVM flags (-Xms, -Xmx, -XX:+PrintGCDetails) to observe GC behavior on a memory-heavy program",
            "d": "H",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Modern Java — Virtual Threads (Project Loom)",
        "concepts": [
          "Virtual threads (Java 21+) are managed by the JVM, not the OS — you can run millions of them concurrently instead of the low thousands a platform-thread pool tops out at.",
          "They turn blocking I/O from a scalability problem into a non-issue: you write plain synchronous-looking code, and the JVM parks the virtual thread (not the OS thread) while it waits.",
          "Executors.newVirtualThreadPerTaskExecutor() gives you a thread-per-task model without the usual thread-pool sizing tradeoffs — but virtual threads don't help CPU-bound work, only I/O-bound concurrency."
        ],
        "learnMore": {
          "label": "Oracle — Virtual Threads",
          "url": "https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html"
        },
        "q": [
          {
            "t": "Rewrite a thread-pool-based I/O task runner using Executors.newVirtualThreadPerTaskExecutor()",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Compare throughput of 10,000 blocking I/O tasks on platform threads vs virtual threads",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Explain why virtual threads do NOT speed up a CPU-bound (non-blocking) computation",
            "d": "E",
            "p": "Build task"
          }
        ]
      }
    ],
    "mini": {
      "title": "Checkpoint Project — Concurrent Task Processor",
      "desc": "A task-processing system using an ExecutorService sized appropriately for I/O-bound work, Callable/Future for results, a ReentrantLock guarding shared state, and a demonstration of the same workload on virtual threads."
    },
    "quiz": [
      {
        "q": "What does the volatile keyword guarantee?",
        "options": [
          "Visibility of a field's latest value across threads",
          "Atomicity of compound operations like i++",
          "That the field is immutable",
          "That reads always hit a lock"
        ],
        "correct": 0,
        "explanation": "volatile only guarantees visibility, not atomicity — a classic interview trap question."
      },
      {
        "q": "What does a Future returned by submitting a Callable to an ExecutorService represent?",
        "options": [
          "A handle to a result that may not be ready yet, which you can block on or poll",
          "The thread itself",
          "A guaranteed-immediate result",
          "An error handler"
        ],
        "correct": 0,
        "explanation": "Future.get() blocks until the Callable completes (or throws), giving you the eventual result or exception."
      },
      {
        "q": "What advantage does ReentrantLock have over synchronized?",
        "options": [
          "tryLock with a timeout and interruptible waits",
          "It requires no manual unlocking",
          "It is faster in every single case",
          "It works across multiple JVMs"
        ],
        "correct": 0,
        "explanation": "ReentrantLock gives you more control (timeouts, interruptibility, multiple conditions) at the cost of needing an explicit unlock, always in a finally block."
      },
      {
        "q": "What is a StackOverflowError typically caused by, in memory terms?",
        "options": [
          "Exhausting the per-thread call stack, often via runaway recursion",
          "Running out of heap space",
          "A garbage collection pause",
          "A deadlock between two threads"
        ],
        "correct": 0,
        "explanation": "The stack holds method calls and local variables; a call chain that never returns (like broken recursion) exhausts it."
      },
      {
        "q": "Why don't virtual threads speed up CPU-bound work?",
        "options": [
          "Virtual threads help I/O-bound concurrency by parking cheaply during waits — they don't add more CPU cores",
          "Virtual threads are slower than platform threads for everything",
          "Virtual threads can only run one at a time",
          "CPU-bound work cannot use threads at all"
        ],
        "correct": 0,
        "explanation": "Virtual threads solve the \"too many blocked OS threads\" problem — a CPU-bound task isn't blocked, so there's nothing to park."
      }
    ]
  },
  {
    "id": "dsa1",
    "num": 7,
    "phase": 6,
    "title": "DSA I — Arrays, Two Pointers & Sliding Window",
    "sub": "The three patterns everything else in DSA is built on: reading arrays fast with hashing, closing in from both ends, and tracking a moving window.",
    "learnMore": {
      "label": "NeetCode 150 — Arrays & Hashing",
      "url": "https://neetcode.io/practice"
    },
    "subtopics": [
      {
        "title": "Arrays & Hashing",
        "concepts": [
          "A hash map/set gives O(1) average lookup — trade memory for speed whenever you need to check \"have I seen this before?\" fast.",
          "Prefix/suffix product or sum arrays let you answer \"everything except me\" questions in one pass without division or nested loops.",
          "Frequency counting (map from value → count) is the backbone of anagram, majority-element, and top-k problems."
        ],
        "learnMore": {
          "label": "GeeksforGeeks — Hashing",
          "url": "https://www.geeksforgeeks.org/dsa/hashing-data-structure/"
        },
        "q": [
          {
            "t": "Two Sum",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/two-sum/"
          },
          {
            "t": "Contains Duplicate",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/contains-duplicate/"
          },
          {
            "t": "Valid Anagram",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/valid-anagram/"
          },
          {
            "t": "Majority Element",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/majority-element/"
          },
          {
            "t": "Group Anagrams",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/group-anagrams/"
          },
          {
            "t": "Top K Frequent Elements",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/top-k-frequent-elements/"
          },
          {
            "t": "Product of Array Except Self",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/product-of-array-except-self/"
          },
          {
            "t": "Valid Sudoku",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/valid-sudoku/"
          },
          {
            "t": "Longest Consecutive Sequence",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/longest-consecutive-sequence/"
          },
          {
            "t": "Contains Duplicate II",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/contains-duplicate-ii/"
          },
          {
            "t": "Find All Numbers Disappeared in an Array",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/"
          },
          {
            "t": "Majority Element II",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/majority-element-ii/"
          },
          {
            "t": "3Sum Closest",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/3sum-closest/"
          },
          {
            "t": "4Sum",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/4sum/"
          },
          {
            "t": "Subarray Sum Equals K",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/subarray-sum-equals-k/"
          },
          {
            "t": "Rotate Array",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/rotate-array/"
          },
          {
            "t": "First Missing Positive",
            "d": "H",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/first-missing-positive/"
          }
        ]
      },
      {
        "title": "Two Pointers",
        "concepts": [
          "Two indices move toward each other (or together) across a sorted structure, cutting a nested loop down to a single linear pass.",
          "Works because sortedness lets you reason about which side to move: if the sum is too big, shrink from the right; too small, grow from the left.",
          "Common variants: opposite-ends closing, fast/slow pointers, and partitioning a list in place around a pivot."
        ],
        "learnMore": {
          "label": "GeeksforGeeks — Two Pointer Technique",
          "url": "https://www.geeksforgeeks.org/dsa/two-pointers-technique/"
        },
        "q": [
          {
            "t": "Valid Palindrome",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/valid-palindrome/"
          },
          {
            "t": "Remove Duplicates from Sorted Array",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/remove-duplicates-from-sorted-array/"
          },
          {
            "t": "Move Zeroes",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/move-zeroes/"
          },
          {
            "t": "Two Sum II — Input Array Is Sorted",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/"
          },
          {
            "t": "3Sum",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/3sum/"
          },
          {
            "t": "Sort Colors",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/sort-colors/"
          },
          {
            "t": "Container With Most Water",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/container-with-most-water/"
          },
          {
            "t": "Trapping Rain Water",
            "d": "H",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/trapping-rain-water/"
          },
          {
            "t": "Remove Element",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/remove-element/"
          },
          {
            "t": "Reverse String",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/reverse-string/"
          },
          {
            "t": "Squares of a Sorted Array",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/squares-of-a-sorted-array/"
          },
          {
            "t": "Backspace String Compare",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/backspace-string-compare/"
          },
          {
            "t": "Sort Array By Parity",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/sort-array-by-parity/"
          },
          {
            "t": "Reverse Vowels of a String",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/reverse-vowels-of-a-string/"
          },
          {
            "t": "Boats to Save People",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/boats-to-save-people/"
          }
        ]
      },
      {
        "title": "Sliding Window",
        "concepts": [
          "A window (a contiguous subarray/substring) expands to the right and contracts from the left, tracked with running state instead of recomputing from scratch.",
          "Use it whenever the question asks for the \"best/longest/shortest contiguous subarray or substring\" satisfying some condition.",
          "A monotonic deque keeps the window's max/min available in O(1) amortized time — the trick behind sliding-window-maximum problems."
        ],
        "learnMore": {
          "label": "GeeksforGeeks — Sliding Window Technique",
          "url": "https://www.geeksforgeeks.org/dsa/window-sliding-technique/"
        },
        "q": [
          {
            "t": "Best Time to Buy and Sell Stock",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/"
          },
          {
            "t": "Maximum Average Subarray I",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/maximum-average-subarray-i/"
          },
          {
            "t": "Longest Substring Without Repeating Characters",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/longest-substring-without-repeating-characters/"
          },
          {
            "t": "Longest Repeating Character Replacement",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/longest-repeating-character-replacement/"
          },
          {
            "t": "Permutation in String",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/permutation-in-string/"
          },
          {
            "t": "Fruit Into Baskets",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/fruit-into-baskets/"
          },
          {
            "t": "Minimum Window Substring",
            "d": "H",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/minimum-window-substring/"
          },
          {
            "t": "Sliding Window Maximum",
            "d": "H",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/sliding-window-maximum/"
          },
          {
            "t": "Max Consecutive Ones III",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/max-consecutive-ones-iii/"
          },
          {
            "t": "Minimum Size Subarray Sum",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/minimum-size-subarray-sum/"
          },
          {
            "t": "Longest Subarray of 1s After Deleting One Element",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/longest-subarray-of-1s-after-deleting-one-element/"
          },
          {
            "t": "Find All Anagrams in a String",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/find-all-anagrams-in-a-string/"
          },
          {
            "t": "Grumpy Bookstore Owner",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/grumpy-bookstore-owner/"
          },
          {
            "t": "Subarrays with K Different Integers",
            "d": "H",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/subarrays-with-k-different-integers/"
          }
        ]
      }
    ],
    "mini": {
      "title": "Checkpoint Project — Custom Array/String Utility Kit",
      "desc": "Implement your own mini-library (no built-ins): a hash-based frequency counter, a two-pointer palindrome/partition helper, and a sliding-window max tracker — then benchmark against Java's built-ins."
    },
    "quiz": [
      {
        "q": "The two-pointer technique is most useful for:",
        "options": [
          "Sorted arrays or problems where you scan from both ends inward",
          "Unsorted graphs",
          "Recursive tree traversal",
          "Hash collisions"
        ],
        "correct": 0,
        "explanation": "Two pointers exploit sorted order (or a known invariant) to avoid an O(n²) nested loop."
      },
      {
        "q": "What is the time complexity of the sliding window technique for finding a max-sum subarray of fixed size k?",
        "options": [
          "O(n)",
          "O(n²)",
          "O(n log n)",
          "O(2^n)"
        ],
        "correct": 0,
        "explanation": "A sliding window updates the sum incrementally as it slides, visiting each element a constant number of times."
      },
      {
        "q": "What does a HashMap-based frequency counter give you that a nested loop doesn't?",
        "options": [
          "O(1) average lookup/update instead of O(n) per check",
          "Guaranteed sorted output",
          "Thread safety",
          "Lower memory usage"
        ],
        "correct": 0,
        "explanation": "Hashing turns \"have I seen this before?\" into a constant-time check instead of scanning what you've seen so far."
      },
      {
        "q": "Why use two pointers instead of a HashSet to detect a palindrome?",
        "options": [
          "O(1) extra space instead of O(n)",
          "It's always faster in Big-O time complexity",
          "HashSets can't store characters",
          "It handles Unicode better"
        ],
        "correct": 0,
        "explanation": "Two pointers comparing from both ends need no extra storage, while a HashSet-based approach would use O(n) space."
      },
      {
        "q": "What is the main risk of an off-by-one error in a sliding window's window-size calculation?",
        "options": [
          "Including one too many or too few elements, giving a wrong result",
          "Causing a stack overflow",
          "Making the algorithm run forever",
          "Triggering a compiler error"
        ],
        "correct": 0,
        "explanation": "Sliding window bugs are almost always boundary/index mistakes — the algorithm compiles and runs, just returns the wrong answer."
      }
    ]
  },
  {
    "id": "dsa2",
    "num": 8,
    "phase": 6,
    "title": "DSA II — Stack, Binary Search & Linked List",
    "sub": "LIFO order, halving the search space, and pointer-chasing — the structures behind parsers, sorted lookups, and every \"reverse this\" question.",
    "learnMore": {
      "label": "NeetCode 150 — Stack",
      "url": "https://neetcode.io/practice"
    },
    "subtopics": [
      {
        "title": "Stack",
        "concepts": [
          "Last-in-first-out order is the natural fit for matching pairs (brackets), undo history, and \"look back until something bigger/smaller\" problems.",
          "A monotonic stack (values always increasing or decreasing) solves next-greater-element-style problems in one linear pass.",
          "Evaluating expressions (postfix, infix-to-postfix, calculators) is a classic stack application worth building from scratch once."
        ],
        "learnMore": {
          "label": "GeeksforGeeks — Stack Data Structure",
          "url": "https://www.geeksforgeeks.org/dsa/stack-data-structure/"
        },
        "q": [
          {
            "t": "Valid Parentheses",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/valid-parentheses/"
          },
          {
            "t": "Min Stack",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/min-stack/"
          },
          {
            "t": "Evaluate Reverse Polish Notation",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/evaluate-reverse-polish-notation/"
          },
          {
            "t": "Generate Parentheses",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/generate-parentheses/"
          },
          {
            "t": "Daily Temperatures",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/daily-temperatures/"
          },
          {
            "t": "Car Fleet",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/car-fleet/"
          },
          {
            "t": "Asteroid Collision",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/asteroid-collision/"
          },
          {
            "t": "Largest Rectangle in Histogram",
            "d": "H",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/largest-rectangle-in-histogram/"
          },
          {
            "t": "Baseball Game",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/baseball-game/"
          },
          {
            "t": "Implement Queue using Stacks",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/implement-queue-using-stacks/"
          },
          {
            "t": "Implement Stack using Queues",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/implement-stack-using-queues/"
          },
          {
            "t": "Remove All Adjacent Duplicates In String",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/"
          },
          {
            "t": "Next Greater Element I",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/next-greater-element-i/"
          },
          {
            "t": "Next Greater Element II",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/next-greater-element-ii/"
          },
          {
            "t": "Decode String",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/decode-string/"
          },
          {
            "t": "Simplify Path",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/simplify-path/"
          }
        ]
      },
      {
        "title": "Binary Search",
        "concepts": [
          "Halves the search space every step — O(log n) — but only works on data with a monotonic property (sorted, or \"answer gets worse/better monotonically\").",
          "Two flavors: search for an exact value, or \"binary search on the answer\" — guess a value, check if it works, narrow the range.",
          "Watch the boundary conditions (lo <= hi vs lo < hi, mid rounding) — off-by-one bugs here are the most common binary-search mistake."
        ],
        "learnMore": {
          "label": "GeeksforGeeks — Binary Search",
          "url": "https://www.geeksforgeeks.org/dsa/binary-search/"
        },
        "q": [
          {
            "t": "Binary Search",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/binary-search/"
          },
          {
            "t": "Search Insert Position",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/search-insert-position/"
          },
          {
            "t": "Search a 2D Matrix",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/search-a-2d-matrix/"
          },
          {
            "t": "Koko Eating Bananas",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/koko-eating-bananas/"
          },
          {
            "t": "Find Minimum in Rotated Sorted Array",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/"
          },
          {
            "t": "Search in Rotated Sorted Array",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/search-in-rotated-sorted-array/"
          },
          {
            "t": "Time Based Key-Value Store",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/time-based-key-value-store/"
          },
          {
            "t": "Median of Two Sorted Arrays",
            "d": "H",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/median-of-two-sorted-arrays/"
          },
          {
            "t": "First Bad Version",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/first-bad-version/"
          },
          {
            "t": "Sqrt(x)",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/sqrtx/"
          },
          {
            "t": "Find Peak Element",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/find-peak-element/"
          },
          {
            "t": "Find First and Last Position of Element in Sorted Array",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/"
          },
          {
            "t": "Search in Rotated Sorted Array II",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/search-in-rotated-sorted-array-ii/"
          },
          {
            "t": "Capacity To Ship Packages Within D Days",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/"
          },
          {
            "t": "Split Array Largest Sum",
            "d": "H",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/split-array-largest-sum/"
          }
        ]
      },
      {
        "title": "Linked List",
        "concepts": [
          "No random access — every operation is a pointer walk, so most linked-list problems are really \"can you rewire the next pointers correctly?\"",
          "The fast/slow (tortoise-and-hare) pointer pair finds the middle, detects cycles, and finds cycle start — one technique, many problems.",
          "A dummy head node removes almost all of the special-casing around \"what if I need to modify the first node?\""
        ],
        "learnMore": {
          "label": "GeeksforGeeks — Linked List",
          "url": "https://www.geeksforgeeks.org/dsa/linked-list-data-structure/"
        },
        "q": [
          {
            "t": "Reverse Linked List",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/reverse-linked-list/"
          },
          {
            "t": "Merge Two Sorted Lists",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/merge-two-sorted-lists/"
          },
          {
            "t": "Linked List Cycle",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/linked-list-cycle/"
          },
          {
            "t": "Reorder List",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/reorder-list/"
          },
          {
            "t": "Remove Nth Node From End of List",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/remove-nth-node-from-end-of-list/"
          },
          {
            "t": "Copy List with Random Pointer",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/copy-list-with-random-pointer/"
          },
          {
            "t": "Add Two Numbers",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/add-two-numbers/"
          },
          {
            "t": "Find the Duplicate Number",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/find-the-duplicate-number/"
          },
          {
            "t": "LRU Cache",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/lru-cache/"
          },
          {
            "t": "Merge k Sorted Lists",
            "d": "H",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/merge-k-sorted-lists/"
          },
          {
            "t": "Middle of the Linked List",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/middle-of-the-linked-list/"
          },
          {
            "t": "Palindrome Linked List",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/palindrome-linked-list/"
          },
          {
            "t": "Remove Linked List Elements",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/remove-linked-list-elements/"
          },
          {
            "t": "Swap Nodes in Pairs",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/swap-nodes-in-pairs/"
          },
          {
            "t": "Rotate List",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/rotate-list/"
          },
          {
            "t": "Flatten a Multilevel Doubly Linked List",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/flatten-a-multilevel-doubly-linked-list/"
          }
        ]
      }
    ],
    "mini": {
      "title": "Checkpoint Project — Build Your Own Data Structure Toolkit",
      "desc": "Implement a stack-based expression evaluator, a binary-search-powered sorted lookup table, and a singly linked list from scratch (including reverse and cycle detection) — then benchmark each against Java's built-ins."
    },
    "quiz": [
      {
        "q": "What is the time complexity of binary search on a sorted array of n elements?",
        "options": [
          "O(log n)",
          "O(n)",
          "O(n log n)",
          "O(1)"
        ],
        "correct": 0,
        "explanation": "Binary search halves the search space every step, giving logarithmic time."
      },
      {
        "q": "A stack is the natural data structure for which of these?",
        "options": [
          "Matching balanced parentheses / undo history",
          "Finding the shortest path in a graph",
          "Sorting a list of numbers",
          "Looking up a value by key"
        ],
        "correct": 0,
        "explanation": "A stack's LIFO order matches problems like bracket matching, undo stacks, and expression evaluation."
      },
      {
        "q": "How do you detect a cycle in a singly linked list in O(1) space?",
        "options": [
          "Floyd's tortoise-and-hare (slow/fast pointer)",
          "Store every node in a HashSet",
          "Reverse the list twice",
          "Count the nodes"
        ],
        "correct": 0,
        "explanation": "Two pointers moving at different speeds will eventually meet if and only if there's a cycle — no extra memory needed."
      },
      {
        "q": "What is the worst-case time complexity of binary search on an UNSORTED array?",
        "options": [
          "Binary search doesn't work correctly on unsorted data at all",
          "O(log n), same as sorted",
          "O(1)",
          "O(n²)"
        ],
        "correct": 0,
        "explanation": "Binary search relies entirely on the sorted-order invariant — running it on unsorted data gives meaningless results, not just a slower runtime."
      },
      {
        "q": "Reversing a singly linked list iteratively requires tracking which pointers?",
        "options": [
          "previous, current, and next",
          "Only the head",
          "Only the tail",
          "The list length"
        ],
        "correct": 0,
        "explanation": "You need all three to safely redirect each node's next pointer without losing the rest of the list."
      }
    ]
  },
  {
    "id": "dsa3",
    "num": 9,
    "phase": 6,
    "title": "DSA III — Trees, Heaps & Tries",
    "sub": "Hierarchical structures: binary trees and BSTs, priority-ordered heaps, and prefix trees for fast string lookup.",
    "learnMore": {
      "label": "NeetCode 150 — Trees",
      "url": "https://neetcode.io/practice"
    },
    "subtopics": [
      {
        "title": "Trees",
        "concepts": [
          "Recursion is the native language of trees — most tree problems are \"process this node, then recurse on left/right and combine.\"",
          "DFS (preorder/inorder/postorder) explores depth-first with a call stack; BFS (level order) explores breadth-first with a queue — pick based on what the problem asks for.",
          "A Binary Search Tree adds one invariant (left < node < right) that turns search/insert/delete into O(log n) on average — but degrades to O(n) if unbalanced."
        ],
        "learnMore": {
          "label": "GeeksforGeeks — Binary Tree",
          "url": "https://www.geeksforgeeks.org/dsa/binary-tree-data-structure/"
        },
        "q": [
          {
            "t": "Invert Binary Tree",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/invert-binary-tree/"
          },
          {
            "t": "Maximum Depth of Binary Tree",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/maximum-depth-of-binary-tree/"
          },
          {
            "t": "Diameter of Binary Tree",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/diameter-of-binary-tree/"
          },
          {
            "t": "Balanced Binary Tree",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/balanced-binary-tree/"
          },
          {
            "t": "Lowest Common Ancestor of a BST",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/"
          },
          {
            "t": "Binary Tree Level Order Traversal",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/binary-tree-level-order-traversal/"
          },
          {
            "t": "Validate Binary Search Tree",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/validate-binary-search-tree/"
          },
          {
            "t": "Kth Smallest Element in a BST",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/kth-smallest-element-in-a-bst/"
          },
          {
            "t": "Construct Binary Tree from Preorder and Inorder Traversal",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/"
          },
          {
            "t": "Binary Tree Maximum Path Sum",
            "d": "H",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/binary-tree-maximum-path-sum/"
          },
          {
            "t": "Same Tree",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/same-tree/"
          },
          {
            "t": "Symmetric Tree",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/symmetric-tree/"
          },
          {
            "t": "Path Sum",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/path-sum/"
          },
          {
            "t": "Binary Tree Inorder Traversal",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/binary-tree-inorder-traversal/"
          },
          {
            "t": "Binary Tree Right Side View",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/binary-tree-right-side-view/"
          },
          {
            "t": "Lowest Common Ancestor of a Binary Tree",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/"
          },
          {
            "t": "Count Good Nodes in Binary Tree",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/count-good-nodes-in-binary-tree/"
          },
          {
            "t": "Serialize and Deserialize Binary Tree",
            "d": "H",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/"
          }
        ]
      },
      {
        "title": "Heaps & Priority Queue",
        "concepts": [
          "A heap keeps the min (or max) accessible in O(1), with O(log n) insert/remove — the go-to structure for \"give me the top/bottom K\" problems.",
          "Java's PriorityQueue is a min-heap by default; pass a custom Comparator to flip it into a max-heap or sort by any key.",
          "Two heaps (a max-heap for the lower half, a min-heap for the upper half) is the standard trick for tracking a running median."
        ],
        "learnMore": {
          "label": "GeeksforGeeks — Heap Data Structure",
          "url": "https://www.geeksforgeeks.org/dsa/heap-data-structure/"
        },
        "q": [
          {
            "t": "Kth Largest Element in a Stream",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/kth-largest-element-in-a-stream/"
          },
          {
            "t": "Last Stone Weight",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/last-stone-weight/"
          },
          {
            "t": "K Closest Points to Origin",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/k-closest-points-to-origin/"
          },
          {
            "t": "Kth Largest Element in an Array",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/kth-largest-element-in-an-array/"
          },
          {
            "t": "Task Scheduler",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/task-scheduler/"
          },
          {
            "t": "Design Twitter",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/design-twitter/"
          },
          {
            "t": "Find Median from Data Stream",
            "d": "H",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/find-median-from-data-stream/"
          },
          {
            "t": "Relative Ranks",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/relative-ranks/"
          },
          {
            "t": "Top K Frequent Words",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/top-k-frequent-words/"
          },
          {
            "t": "Reorganize String",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/reorganize-string/"
          },
          {
            "t": "Ugly Number II",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/ugly-number-ii/"
          },
          {
            "t": "Single-Threaded CPU",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/single-threaded-cpu/"
          }
        ]
      },
      {
        "title": "Tries",
        "concepts": [
          "A trie (prefix tree) stores strings character-by-character along shared paths, so prefix lookup is O(word length), not O(number of words).",
          "Each node holds up to 26 children (for lowercase English) plus an \"end of word\" flag — that flag is what separates \"prefix exists\" from \"word exists.\"",
          "This pattern has a genuinely small canonical problem set, but it underpins real features like autocomplete, spell-check, and IP routing tables."
        ],
        "learnMore": {
          "label": "GeeksforGeeks — Trie",
          "url": "https://www.geeksforgeeks.org/dsa/trie-insert-and-search/"
        },
        "q": [
          {
            "t": "Implement Trie (Prefix Tree)",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/implement-trie-prefix-tree/"
          },
          {
            "t": "Design Add and Search Words Data Structure",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/design-add-and-search-words-data-structure/"
          },
          {
            "t": "Word Search II",
            "d": "H",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/word-search-ii/"
          },
          {
            "t": "Longest Word in Dictionary",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/longest-word-in-dictionary/"
          },
          {
            "t": "Replace Words",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/replace-words/"
          },
          {
            "t": "Map Sum Pairs",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/map-sum-pairs/"
          },
          {
            "t": "Word Break II",
            "d": "H",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/word-break-ii/"
          }
        ]
      }
    ],
    "mini": {
      "title": "Checkpoint Project — Autocomplete Engine",
      "desc": "Build a trie-backed autocomplete/spell-check tool, a BST-based ordered map, and a heap-based task scheduler that always runs the highest-priority job next."
    },
    "quiz": [
      {
        "q": "What makes a Trie efficient for prefix-based lookups like autocomplete?",
        "options": [
          "Shared prefixes are stored once, so lookup is O(word length), not O(n words)",
          "It sorts all words alphabetically first",
          "It hashes every word",
          "It only works for numbers"
        ],
        "correct": 0,
        "explanation": "A Trie's structure directly encodes shared prefixes, making prefix search proportional to the query length, not the dataset size."
      },
      {
        "q": "In a valid Binary Search Tree, an in-order traversal visits nodes:",
        "options": [
          "In sorted ascending order",
          "In random order",
          "Level by level",
          "In reverse insertion order"
        ],
        "correct": 0,
        "explanation": "BST's left < node < right invariant means in-order traversal naturally produces sorted output."
      },
      {
        "q": "What operation does a min-heap guarantee O(log n) for?",
        "options": [
          "Insert and extract-min",
          "Random access by index",
          "Searching for an arbitrary value",
          "Sorting in O(n)"
        ],
        "correct": 0,
        "explanation": "A heap keeps the minimum at the root, and insert/extract-min both cost O(log n) due to the sift-up/sift-down."
      },
      {
        "q": "What is the worst-case time complexity of search in an unbalanced BST?",
        "options": [
          "O(n), if the tree degenerates into a linked list",
          "O(log n), always",
          "O(1)",
          "O(n²)"
        ],
        "correct": 0,
        "explanation": "Without balancing (like AVL/Red-Black trees), a BST built from sorted input can degenerate into a linked list."
      },
      {
        "q": "Why is a heap the right structure for a \"run the highest-priority job next\" scheduler?",
        "options": [
          "It gives O(log n) insert and O(1) peek at the highest priority item",
          "It keeps items in insertion order",
          "It requires no comparisons",
          "It automatically deletes stale jobs"
        ],
        "correct": 0,
        "explanation": "A priority queue backed by a heap is the standard structure for always accessing the current max/min efficiently."
      }
    ]
  },
  {
    "id": "dsa4",
    "num": 10,
    "phase": 6,
    "title": "DSA IV — Backtracking & Graphs",
    "sub": "Systematic trial-and-error over decision trees, and traversing networks of connected nodes.",
    "learnMore": {
      "label": "NeetCode 150 — Graphs",
      "url": "https://neetcode.io/practice"
    },
    "subtopics": [
      {
        "title": "Backtracking",
        "concepts": [
          "Explore a decision tree depth-first, commit to a choice, recurse, then undo (\"backtrack\") that choice before trying the next — the template behind every \"generate all X\" problem.",
          "Prune early: if a partial choice already violates the constraint, stop recursing down that branch instead of finishing it and checking at the end.",
          "Distinguish combinations (order doesn't matter, no reuse) from permutations (order matters) from subsets (include-or-exclude each element) — the loop structure differs for each."
        ],
        "learnMore": {
          "label": "GeeksforGeeks — Backtracking",
          "url": "https://www.geeksforgeeks.org/dsa/backtracking-algorithms/"
        },
        "q": [
          {
            "t": "Subsets",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/subsets/"
          },
          {
            "t": "Combination Sum",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/combination-sum/"
          },
          {
            "t": "Permutations",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/permutations/"
          },
          {
            "t": "Subsets II",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/subsets-ii/"
          },
          {
            "t": "Combination Sum II",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/combination-sum-ii/"
          },
          {
            "t": "Word Search",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/word-search/"
          },
          {
            "t": "Palindrome Partitioning",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/palindrome-partitioning/"
          },
          {
            "t": "Letter Combinations of a Phone Number",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/letter-combinations-of-a-phone-number/"
          },
          {
            "t": "N-Queens",
            "d": "H",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/n-queens/"
          },
          {
            "t": "Sudoku Solver",
            "d": "H",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/sudoku-solver/"
          },
          {
            "t": "Permutations II",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/permutations-ii/"
          },
          {
            "t": "Combinations",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/combinations/"
          },
          {
            "t": "Restore IP Addresses",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/restore-ip-addresses/"
          },
          {
            "t": "Gray Code",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/gray-code/"
          },
          {
            "t": "N-Queens II",
            "d": "H",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/n-queens-ii/"
          }
        ]
      },
      {
        "title": "Graphs",
        "concepts": [
          "A graph is nodes + edges — represent it as an adjacency list (map of node → neighbors) for anything sparse, which is almost always the right default.",
          "BFS explores in layers and finds shortest paths in unweighted graphs; DFS explores deep-first and is natural for connectivity and cycle checks.",
          "Grid problems (islands, flood fill) are graphs in disguise — each cell is a node, and up/down/left/right cells are its edges."
        ],
        "learnMore": {
          "label": "GeeksforGeeks — Graph Data Structure",
          "url": "https://www.geeksforgeeks.org/dsa/graph-data-structure-and-algorithms/"
        },
        "q": [
          {
            "t": "Number of Islands",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/number-of-islands/"
          },
          {
            "t": "Max Area of Island",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/max-area-of-island/"
          },
          {
            "t": "Clone Graph",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/clone-graph/"
          },
          {
            "t": "Rotting Oranges",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/rotting-oranges/"
          },
          {
            "t": "Pacific Atlantic Water Flow",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/pacific-atlantic-water-flow/"
          },
          {
            "t": "Surrounded Regions",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/surrounded-regions/"
          },
          {
            "t": "Course Schedule",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/course-schedule/"
          },
          {
            "t": "Redundant Connection",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/redundant-connection/"
          },
          {
            "t": "Word Ladder",
            "d": "H",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/word-ladder/"
          },
          {
            "t": "Flood Fill",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/flood-fill/"
          },
          {
            "t": "Island Perimeter",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/island-perimeter/"
          },
          {
            "t": "Is Graph Bipartite?",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/is-graph-bipartite/"
          },
          {
            "t": "Keys and Rooms",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/keys-and-rooms/"
          },
          {
            "t": "Accounts Merge",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/accounts-merge/"
          },
          {
            "t": "Evaluate Division",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/evaluate-division/"
          }
        ]
      }
    ],
    "mini": {
      "title": "Checkpoint Project — Maze Solver & Graph Explorer",
      "desc": "Build a backtracking maze solver that finds a path (or all paths) through a grid, plus a BFS/DFS graph traversal visualizer that prints the order nodes are discovered."
    },
    "quiz": [
      {
        "q": "What is the core idea behind backtracking?",
        "options": [
          "Try a choice, recurse, and undo it if it doesn't lead to a solution",
          "Always choose the locally best option and never revisit it",
          "Solve subproblems once and cache them",
          "Process items level by level"
        ],
        "correct": 0,
        "explanation": "Backtracking explores a decision tree and prunes/undoes (\"backtracks\") branches that fail, unlike greedy or DP approaches."
      },
      {
        "q": "BFS explores a graph:",
        "options": [
          "Layer by layer, using a queue",
          "As deep as possible before backtracking, using a stack/recursion",
          "In random order",
          "Only along the shortest edge weight"
        ],
        "correct": 0,
        "explanation": "BFS visits all neighbors at the current distance before going further, which is why it finds shortest paths in unweighted graphs."
      },
      {
        "q": "What data structure is DFS naturally implemented with (besides recursion)?",
        "options": [
          "A stack",
          "A queue",
          "A heap",
          "A hash map"
        ],
        "correct": 0,
        "explanation": "DFS explores as deep as possible before backtracking — a stack (or the call stack via recursion) captures that \"go deep, then pop back\" behavior."
      },
      {
        "q": "Why does BFS guarantee the shortest path in an UNWEIGHTED graph, but DFS does not?",
        "options": [
          "BFS explores nodes in increasing distance order from the source",
          "BFS visits every node twice",
          "DFS never terminates",
          "BFS uses less memory"
        ],
        "correct": 0,
        "explanation": "Because BFS expands the frontier one layer at a time, the first time it reaches a node is guaranteed to be via a shortest path."
      },
      {
        "q": "In a backtracking maze solver, what prevents infinite loops when the maze has cycles?",
        "options": [
          "Marking visited cells before recursing further",
          "Using a bigger stack size",
          "Sorting the moves",
          "Backtracking cannot handle cycles at all"
        ],
        "correct": 0,
        "explanation": "Without a visited-check, backtracking can revisit the same cell forever — marking visited cells (and unmarking on backtrack, if paths must be reusable) is essential."
      }
    ]
  },
  {
    "id": "dsa5",
    "num": 11,
    "phase": 6,
    "title": "DSA V — Advanced Graphs & Dynamic Programming",
    "sub": "Weighted graphs and shortest-path algorithms, plus the two-dimensional thinking behind dynamic programming.",
    "learnMore": {
      "label": "GeeksforGeeks — Dynamic Programming",
      "url": "https://www.geeksforgeeks.org/dsa/dynamic-programming/"
    },
    "subtopics": [
      {
        "title": "Advanced Graphs",
        "concepts": [
          "Topological sort orders nodes of a DAG so every edge points forward — the algorithm behind \"can these course prerequisites be satisfied?\"",
          "Dijkstra's algorithm finds shortest paths from one source in a weighted graph with non-negative edges, using a min-heap to always expand the closest unvisited node next.",
          "Union-Find (Disjoint Set) answers \"are these two nodes connected?\" and \"would adding this edge create a cycle?\" in near-constant time — the backbone of Kruskal's MST algorithm."
        ],
        "learnMore": {
          "label": "GeeksforGeeks — Advanced Graph Algorithms",
          "url": "https://www.geeksforgeeks.org/dsa/dijkstras-shortest-path-algorithm-greedy-algo-7/"
        },
        "q": [
          {
            "t": "Course Schedule II",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/course-schedule-ii/"
          },
          {
            "t": "Network Delay Time",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/network-delay-time/"
          },
          {
            "t": "Cheapest Flights Within K Stops",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/cheapest-flights-within-k-stops/"
          },
          {
            "t": "Min Cost to Connect All Points",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/min-cost-to-connect-all-points/"
          },
          {
            "t": "Swim in Rising Water",
            "d": "H",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/swim-in-rising-water/"
          },
          {
            "t": "Reconstruct Itinerary",
            "d": "H",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/reconstruct-itinerary/"
          },
          {
            "t": "Find the City With the Smallest Number of Neighbors at a Threshold Distance",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/"
          },
          {
            "t": "Path With Minimum Effort",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/path-with-minimum-effort/"
          },
          {
            "t": "Number of Provinces",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/number-of-provinces/"
          },
          {
            "t": "Redundant Connection II",
            "d": "H",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/redundant-connection-ii/"
          }
        ]
      },
      {
        "title": "1-D Dynamic Programming",
        "concepts": [
          "DP = recursion + remembering answers you already computed (memoization), so overlapping subproblems get solved once instead of exponentially many times.",
          "The hard part is finding the recurrence: \"how does the answer for size n relate to smaller sizes?\" — write that on paper before writing code.",
          "Once the recursive (top-down) version works, converting to an iterative (bottom-up) array fill usually drops the space complexity too."
        ],
        "learnMore": {
          "label": "GeeksforGeeks — Dynamic Programming",
          "url": "https://www.geeksforgeeks.org/dsa/dynamic-programming/"
        },
        "q": [
          {
            "t": "Climbing Stairs",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/climbing-stairs/"
          },
          {
            "t": "House Robber",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/house-robber/"
          },
          {
            "t": "House Robber II",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/house-robber-ii/"
          },
          {
            "t": "Longest Palindromic Substring",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/longest-palindromic-substring/"
          },
          {
            "t": "Palindromic Substrings",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/palindromic-substrings/"
          },
          {
            "t": "Decode Ways",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/decode-ways/"
          },
          {
            "t": "Coin Change",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/coin-change/"
          },
          {
            "t": "Word Break",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/word-break/"
          },
          {
            "t": "Longest Increasing Subsequence",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/longest-increasing-subsequence/"
          },
          {
            "t": "Partition Equal Subset Sum",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/partition-equal-subset-sum/"
          },
          {
            "t": "Min Cost Climbing Stairs",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/min-cost-climbing-stairs/"
          },
          {
            "t": "N-th Tribonacci Number",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/n-th-tribonacci-number/"
          },
          {
            "t": "Maximum Product Subarray",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/maximum-product-subarray/"
          },
          {
            "t": "Perfect Squares",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/perfect-squares/"
          },
          {
            "t": "Combination Sum IV",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/combination-sum-iv/"
          },
          {
            "t": "Integer Break",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/integer-break/"
          },
          {
            "t": "Delete and Earn",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/delete-and-earn/"
          }
        ]
      },
      {
        "title": "2-D Dynamic Programming",
        "concepts": [
          "When the state depends on two changing quantities (two string positions, or a grid row and column), the DP table becomes 2-D instead of a 1-D array.",
          "Classic shape: dp[i][j] = best answer using the first i elements of one sequence and the first j of another — fill row by row.",
          "Grid path-counting problems (unique paths) and string-comparison problems (edit distance, LCS) are the two big families here."
        ],
        "learnMore": {
          "label": "GeeksforGeeks — 2D Dynamic Programming",
          "url": "https://www.geeksforgeeks.org/dsa/dp-on-grids/"
        },
        "q": [
          {
            "t": "Unique Paths",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/unique-paths/"
          },
          {
            "t": "Longest Common Subsequence",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/longest-common-subsequence/"
          },
          {
            "t": "Best Time to Buy and Sell Stock with Cooldown",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/"
          },
          {
            "t": "Coin Change II",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/coin-change-ii/"
          },
          {
            "t": "Target Sum",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/target-sum/"
          },
          {
            "t": "Interleaving String",
            "d": "H",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/interleaving-string/"
          },
          {
            "t": "Longest Increasing Path in a Matrix",
            "d": "H",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/longest-increasing-path-in-a-matrix/"
          },
          {
            "t": "Distinct Subsequences",
            "d": "H",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/distinct-subsequences/"
          },
          {
            "t": "Edit Distance",
            "d": "H",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/edit-distance/"
          },
          {
            "t": "Maximal Square",
            "d": "H",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/maximal-square/"
          },
          {
            "t": "Unique Paths II",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/unique-paths-ii/"
          },
          {
            "t": "Minimum Path Sum",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/minimum-path-sum/"
          },
          {
            "t": "Triangle",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/triangle/"
          },
          {
            "t": "Out of Boundary Paths",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/out-of-boundary-paths/"
          },
          {
            "t": "Longest Palindromic Subsequence",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/longest-palindromic-subsequence/"
          },
          {
            "t": "Regular Expression Matching",
            "d": "H",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/regular-expression-matching/"
          }
        ]
      }
    ],
    "mini": {
      "title": "Checkpoint Project — Route Planner with DP Optimizer",
      "desc": "A Dijkstra-based shortest-route planner over a small weighted graph, paired with a DP-based budget optimizer (a knapsack-style allocator) that picks the best combination under a cost constraint."
    },
    "quiz": [
      {
        "q": "Why doesn't Dijkstra's algorithm work correctly with negative edge weights?",
        "options": [
          "It assumes once a node is finalized its shortest distance can't improve, which negative edges can violate",
          "It doesn't support weighted graphs at all",
          "It only works on trees",
          "It requires the graph to be undirected"
        ],
        "correct": 0,
        "explanation": "Dijkstra greedily finalizes the closest unvisited node — a later negative edge could still find a shorter path, breaking that assumption."
      },
      {
        "q": "What is the defining property of a problem solvable with dynamic programming?",
        "options": [
          "Optimal substructure and overlapping subproblems",
          "It must be solvable with a single greedy pass",
          "It must involve a graph",
          "It has no valid recursive solution"
        ],
        "correct": 0,
        "explanation": "DP caches solutions to overlapping subproblems that combine into an optimal solution — without both properties, DP doesn't help."
      },
      {
        "q": "What does memoization add to a plain recursive solution?",
        "options": [
          "Caching results of subproblems already solved, avoiding recomputation",
          "Parallel execution",
          "Automatic base-case detection",
          "Guaranteed O(1) time"
        ],
        "correct": 0,
        "explanation": "Memoization turns an exponential naive recursion (e.g. Fibonacci) into polynomial time by reusing cached subproblem answers."
      },
      {
        "q": "Bellman-Ford is preferred over Dijkstra specifically when:",
        "options": [
          "The graph may have negative edge weights",
          "The graph is very large",
          "The graph is a tree",
          "You need the fastest possible algorithm"
        ],
        "correct": 0,
        "explanation": "Bellman-Ford is slower than Dijkstra but correctly handles negative weights and can detect negative cycles."
      },
      {
        "q": "In the classic knapsack DP, what do the two dimensions of the DP table typically represent?",
        "options": [
          "Items considered so far, and remaining capacity",
          "Row and column of the input matrix",
          "Time and space complexity",
          "Number of graph nodes and edges"
        ],
        "correct": 0,
        "explanation": "The state (item index, remaining capacity) captures everything needed to decide the optimal value from that point forward."
      }
    ]
  },
  {
    "id": "dsa6",
    "num": 12,
    "phase": 6,
    "title": "DSA VI — Greedy, Intervals, Math & Bit Manipulation",
    "sub": "Making the locally-best choice, reasoning about overlapping ranges, and the number-theory and bitwise tricks that round out a complete DSA toolkit.",
    "learnMore": {
      "label": "GeeksforGeeks — Greedy Algorithms",
      "url": "https://www.geeksforgeeks.org/dsa/greedy-algorithms/"
    },
    "subtopics": [
      {
        "title": "Greedy",
        "concepts": [
          "A greedy algorithm makes the locally-optimal choice at each step and never reconsiders it — it only works when the problem has the \"greedy-choice property,\" so always sanity-check with a small example.",
          "Sorting first (by start time, by ratio, by size) is the setup step for most greedy problems — the greedy choice usually becomes obvious once the data is ordered.",
          "Greedy is often paired with a proof by contradiction or exchange argument in interviews — being able to explain *why* the greedy choice is safe matters as much as the code."
        ],
        "learnMore": {
          "label": "GeeksforGeeks — Greedy Algorithms",
          "url": "https://www.geeksforgeeks.org/dsa/greedy-algorithms/"
        },
        "q": [
          {
            "t": "Maximum Subarray",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/maximum-subarray/"
          },
          {
            "t": "Jump Game",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/jump-game/"
          },
          {
            "t": "Jump Game II",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/jump-game-ii/"
          },
          {
            "t": "Gas Station",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/gas-station/"
          },
          {
            "t": "Hand of Straights",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/hand-of-straights/"
          },
          {
            "t": "Merge Triplets to Form Target Triplet",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/merge-triplets-to-form-target-triplet/"
          },
          {
            "t": "Partition Labels",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/partition-labels/"
          },
          {
            "t": "Valid Parenthesis String",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/valid-parenthesis-string/"
          },
          {
            "t": "Best Time to Buy and Sell Stock II",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/"
          },
          {
            "t": "Assign Cookies",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/assign-cookies/"
          },
          {
            "t": "Lemonade Change",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/lemonade-change/"
          },
          {
            "t": "Queue Reconstruction by Height",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/queue-reconstruction-by-height/"
          },
          {
            "t": "Candy",
            "d": "H",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/candy/"
          }
        ]
      },
      {
        "title": "Intervals",
        "concepts": [
          "Sort intervals by start time first — almost every interval problem becomes a simple linear scan once they're in order.",
          "Two intervals overlap when one's start is before the other's end (and vice versa) — draw a number line if the condition ever feels unclear.",
          "Merging, inserting, and counting overlaps are the three core interval operations; scheduling/meeting-room problems are all variations on counting overlaps. Note: this is a naturally small real problem set — several classic \"meeting rooms\" problems are premium-locked on LeetCode, so a couple of items below are Build tasks instead of dead/paywalled links."
        ],
        "learnMore": {
          "label": "GeeksforGeeks — Interval Scheduling",
          "url": "https://www.geeksforgeeks.org/dsa/merging-intervals/"
        },
        "q": [
          {
            "t": "Insert Interval",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/insert-interval/"
          },
          {
            "t": "Merge Intervals",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/merge-intervals/"
          },
          {
            "t": "Non-overlapping Intervals",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/non-overlapping-intervals/"
          },
          {
            "t": "My Calendar I",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/my-calendar-i/"
          },
          {
            "t": "Car Pooling",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/car-pooling/"
          },
          {
            "t": "Minimum Number of Arrows to Burst Balloons",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/"
          },
          {
            "t": "Minimum Interval to Include Each Query",
            "d": "H",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/minimum-interval-to-include-each-query/"
          },
          {
            "t": "Determine if a person can attend every meeting on their calendar given a list of (start, end) intervals",
            "d": "E",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Math & Geometry",
        "concepts": [
          "Matrix problems (rotate, spiral, set-zeroes) come down to careful index arithmetic — work out the transformation on a small 3×3 example before coding.",
          "Number-theory basics (GCD, primality, modular exponentiation) show up in \"is this valid\" and \"compute this efficiently\" style questions.",
          "Watch for integer overflow and edge cases (0, negative numbers, empty grids) — math problems are graded as much on correctness at the edges as on the core logic."
        ],
        "learnMore": {
          "label": "GeeksforGeeks — Mathematical Algorithms",
          "url": "https://www.geeksforgeeks.org/dsa/mathematical-algorithms/"
        },
        "q": [
          {
            "t": "Happy Number",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/happy-number/"
          },
          {
            "t": "Plus One",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/plus-one/"
          },
          {
            "t": "Rotate Image",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/rotate-image/"
          },
          {
            "t": "Spiral Matrix",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/spiral-matrix/"
          },
          {
            "t": "Set Matrix Zeroes",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/set-matrix-zeroes/"
          },
          {
            "t": "Pow(x, n)",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/powx-n/"
          },
          {
            "t": "Multiply Strings",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/multiply-strings/"
          },
          {
            "t": "Detect Squares",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/detect-squares/"
          },
          {
            "t": "Palindrome Number",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/palindrome-number/"
          },
          {
            "t": "Excel Sheet Column Title",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/excel-sheet-column-title/"
          },
          {
            "t": "Roman to Integer",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/roman-to-integer/"
          },
          {
            "t": "Greatest Common Divisor of Strings",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/greatest-common-divisor-of-strings/"
          },
          {
            "t": "Integer to Roman",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/integer-to-roman/"
          },
          {
            "t": "Basic Calculator II",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/basic-calculator-ii/"
          },
          {
            "t": "Count Primes",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/count-primes/"
          }
        ]
      },
      {
        "title": "Bit Manipulation",
        "concepts": [
          "XOR cancels duplicates (x ^ x = 0, x ^ 0 = x) — the trick behind \"find the single/missing number\" problems without extra memory.",
          "Shifting left multiplies by 2, shifting right divides by 2 — bit tricks are often just fast arithmetic in disguise.",
          "n & (n-1) clears the lowest set bit — one line that powers counting-set-bits and power-of-two checks."
        ],
        "learnMore": {
          "label": "GeeksforGeeks — Bit Manipulation",
          "url": "https://www.geeksforgeeks.org/dsa/all-about-bit-manipulation/"
        },
        "q": [
          {
            "t": "Single Number",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/single-number/"
          },
          {
            "t": "Number of 1 Bits",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/number-of-1-bits/"
          },
          {
            "t": "Counting Bits",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/counting-bits/"
          },
          {
            "t": "Reverse Bits",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/reverse-bits/"
          },
          {
            "t": "Missing Number",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/missing-number/"
          },
          {
            "t": "Sum of Two Integers",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/sum-of-two-integers/"
          },
          {
            "t": "Reverse Integer",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/reverse-integer/"
          },
          {
            "t": "Power of Two",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/power-of-two/"
          },
          {
            "t": "Power of Three",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/power-of-three/"
          },
          {
            "t": "Hamming Distance",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/hamming-distance/"
          },
          {
            "t": "Binary Number with Alternating Bits",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/binary-number-with-alternating-bits/"
          },
          {
            "t": "XOR Operation in an Array",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/xor-operation-in-an-array/"
          }
        ]
      }
    ],
    "mini": {
      "title": "Combined Project — DSA Judge Engine",
      "desc": "A small Java engine that runs test cases against a solution class for greedy/interval/DP problems and reports pass/fail with timing — a direct precursor to how a real online judge works. This closes out the entire DSA phase."
    },
    "quiz": [
      {
        "q": "A greedy algorithm makes decisions:",
        "options": [
          "Locally optimal at each step, without reconsidering earlier choices",
          "By trying every possible combination",
          "Only after sorting the entire input twice",
          "By backtracking whenever a step fails"
        ],
        "correct": 0,
        "explanation": "Greedy commits to the best-looking local choice and never revisits it — correct only when the problem has the greedy-choice property."
      },
      {
        "q": "When merging overlapping intervals, what's the first step that makes the rest of the algorithm simple?",
        "options": [
          "Sort the intervals by start time",
          "Sort the intervals by length",
          "Reverse the input",
          "Convert intervals to a graph"
        ],
        "correct": 0,
        "explanation": "Once sorted by start, you only ever need to compare each interval against the last merged one, giving an O(n log n) solution."
      },
      {
        "q": "The XOR bit trick a ^ a = 0 is commonly used to solve which type of problem?",
        "options": [
          "Finding the single non-duplicated element in an array of pairs",
          "Sorting an array",
          "Finding the maximum subarray sum",
          "Detecting a cycle in a linked list"
        ],
        "correct": 0,
        "explanation": "XORing every element cancels out pairs, leaving only the element that appears once — O(n) time, O(1) space."
      },
      {
        "q": "Why can a greedy solution fail on a problem that actually needs dynamic programming?",
        "options": [
          "A locally optimal choice can lock out a better global solution",
          "Greedy algorithms are always slower",
          "Greedy algorithms cannot use sorting",
          "DP problems never have a greedy-looking structure"
        ],
        "correct": 0,
        "explanation": "Classic example: coin change with arbitrary denominations — the greedy largest-coin-first approach doesn't always give the minimum number of coins."
      },
      {
        "q": "What is the time complexity of checking if two intervals overlap?",
        "options": [
          "O(1)",
          "O(n)",
          "O(log n)",
          "O(n²)"
        ],
        "correct": 0,
        "explanation": "Comparing two intervals' start/end values is a fixed number of comparisons regardless of input size."
      }
    ]
  },
  {
    "id": "dev-fundamentals",
    "num": 13,
    "phase": 7,
    "title": "Developer Fundamentals",
    "sub": "Git, Linux, and how HTTP actually works underneath every API you'll ever build or call — the ground floor every backend job assumes, taught before Spring hides it behind annotations.",
    "learnMore": {
      "label": "Pro Git (free book)",
      "url": "https://git-scm.com/book/en/v2"
    },
    "subtopics": [
      {
        "title": "Branching & Merging",
        "concepts": [
          "A branch is just a movable pointer to a commit — cheap to create, which is why feature branches are the default workflow.",
          "merge creates a new commit joining two histories; rebase replays your commits on top of another branch, producing a linear history but rewriting commit hashes.",
          "reflog is your safety net — it records every place HEAD has pointed, so a \"lost\" commit is almost always recoverable."
        ],
        "checklist": [
          "Branches",
          "Merge vs Rebase",
          "Resolving Conflicts",
          "reflog"
        ],
        "q": [
          {
            "t": "Resolve a merge conflict in two divergent feature branches",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Recover a deleted branch using reflog",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Interactively rebase 5 commits into 2 clean commits",
            "d": "M",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Workflow & History Hygiene",
        "concepts": [
          "A good commit message explains why, not what — the diff already shows what changed.",
          "Squashing before merge keeps main's history readable: one commit per logical change, not one per \"fix typo\" iteration.",
          "A .gitignore stops build output and secrets from ever entering history in the first place — cheaper than removing them after the fact."
        ],
        "checklist": [
          "Commit Message Discipline",
          "Squashing Commits",
          ".gitignore",
          "Pre-commit Hooks"
        ],
        "q": [
          {
            "t": "Write a proper .gitignore for a Spring Boot + React monorepo",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Squash and rewrite commit messages before a PR",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Set up a pre-commit hook that blocks secrets from being committed",
            "d": "H",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Filesystem & Permissions",
        "concepts": [
          "Absolute paths start from / and always mean the same thing; relative paths depend on your current directory — know which one a command expects.",
          "Every file has an owner, a group, and permission bits for each (read/write/execute) — chmod changes what's allowed, chown changes who owns it.",
          "A symbolic link points to a path (breaks if the target moves); a hard link points to the same underlying data (survives the original being deleted) — different failure modes, different use cases."
        ],
        "learnMore": {
          "label": "Linux Journey — Filesystem",
          "url": "https://linuxjourney.com/lesson/filesystem-hierarchy"
        },
        "checklist": [
          "Navigating the Filesystem (cd, ls, pwd)",
          "File Permissions (chmod, chown)",
          "Symbolic & Hard Links",
          "Finding Files (find, grep)"
        ],
        "q": [
          {
            "t": "Use find and grep to locate every .log file modified in the last 24 hours containing the word ERROR",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Fix a script that fails with 'permission denied' by diagnosing and correcting the file's permission bits",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Explain the difference between a hard link and a symbolic link with a concrete example of each breaking",
            "d": "M",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Process Management & Networking",
        "concepts": [
          "ps/top show what's running and how much CPU/memory it's using; kill sends a signal (not always \"force stop\") to a process by PID.",
          "A foreground job blocks your shell until it finishes; & backgrounds it, and nohup keeps it running after you log out — the basis for running a server process on a remote machine.",
          "netstat/ss show which processes are listening on which ports — the first thing to check when \"why can't I connect to this service\" comes up."
        ],
        "checklist": [
          "Process Management (ps, top, kill)",
          "Foreground vs Background Jobs",
          "systemd & Services",
          "Networking Basics (netstat/ss, ports)"
        ],
        "q": [
          {
            "t": "Start a long-running process, background it, then find and kill it by PID",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Write a systemd unit file that keeps a Java app running and restarts it on crash",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Use ss or netstat to find which process is holding port 8080 open",
            "d": "E",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Shell Scripting",
        "concepts": [
          "A bash script is just a sequence of the same commands you'd type interactively, plus variables, conditionals, and loops — start by scripting something you already do by hand.",
          "Every command returns an exit code (0 = success, non-zero = failure) — scripts should check this ($?) instead of assuming everything worked.",
          "Piping (|) and redirection (>, >>, <) chain commands together and control where output goes — the core of \"compose small tools\" Unix philosophy."
        ],
        "learnMore": {
          "label": "Bash Reference Manual",
          "url": "https://www.gnu.org/software/bash/manual/bash.html"
        },
        "checklist": [
          "Bash Variables & Conditionals",
          "Loops & Functions",
          "Piping & Redirection",
          "Exit Codes & Error Handling"
        ],
        "q": [
          {
            "t": "Write a bash script that backs up a directory to a timestamped archive and logs success/failure",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Write a deploy script that checks the exit code of each step and aborts with a clear message on failure",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Chain three commands with pipes to extract and count unique IP addresses from a log file",
            "d": "M",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "HTTP Semantics & Status Codes",
        "concepts": [
          "GET/POST/PUT/PATCH/DELETE map to CRUD, but the real distinction that matters is idempotency: GET/PUT/DELETE should be safe to retry, POST usually isn't.",
          "2xx = success, 4xx = the client's fault (bad input, missing auth), 5xx = the server's fault — picking the right code is part of the API contract, not a detail.",
          "Status codes alone aren't enough context for a client — pair them with a clear, structured error body explaining what went wrong."
        ],
        "checklist": [
          "HTTP Verbs (GET/POST/PUT/PATCH/DELETE)",
          "Status Code Categories (2xx/4xx/5xx)",
          "Idempotency"
        ],
        "q": [
          {
            "t": "Map CRUD operations to correct HTTP verbs and status codes",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Design idempotent PUT vs non-idempotent POST endpoints",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Implement proper 4xx vs 5xx handling for a payments endpoint",
            "d": "M",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Networking Foundations",
        "concepts": [
          "HTTP is a request/response protocol layered on top of TCP; HTTPS adds TLS encryption on top of that — the padlock means the connection is encrypted, not that the site itself is trustworthy.",
          "DNS resolves a human-readable hostname to an IP address before any connection can be made — that lookup (often cached) is the first hidden step of every request.",
          "TCP guarantees ordered, reliable delivery at the cost of connection setup overhead (the three-way handshake); UDP is faster and connectionless but delivers no ordering or delivery guarantee.",
          "WebSockets upgrade an HTTP connection into a persistent, full-duplex channel — reach for them only when the server genuinely needs to push data to the client unprompted (chat, live updates)."
        ],
        "learnMore": {
          "label": "MDN — An Overview of HTTP",
          "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview"
        },
        "checklist": [
          "HTTP vs HTTPS",
          "DNS Resolution",
          "TCP vs UDP",
          "WebSockets"
        ],
        "q": [
          {
            "t": "Trace a full HTTP request lifecycle (DNS lookup, TCP handshake, TLS handshake, request/response) for a URL",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Explain when you'd choose TCP vs UDP for a given application (e.g. video call vs file download)",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Use browser dev tools to inspect the DNS/connection/TLS timing breakdown of a real request",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Build a minimal WebSocket echo server and client",
            "d": "M",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "REST, JSON & the Request/Response Lifecycle",
        "concepts": [
          "REST is an architectural style, not a protocol — resources are identified by URLs, manipulated with standard HTTP methods, and represented as a portable format (almost always JSON today).",
          "A request/response cycle has a clear shape on both sides: a request line + headers + optional body goes out, a status line + headers + optional body comes back — every HTTP client and server library is built around this same shape.",
          "Headers carry metadata separate from the body — Content-Type tells the receiver how to parse the body, and cookies (set via Set-Cookie, sent back via Cookie) are how a stateless protocol like HTTP can still track a session across requests."
        ],
        "learnMore": {
          "label": "MDN — HTTP Headers",
          "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers"
        },
        "checklist": [
          "REST as an Architectural Style",
          "JSON — Structure & Parsing",
          "Request/Response Anatomy",
          "Headers & Cookies"
        ],
        "q": [
          {
            "t": "Use curl (or Postman) to send a GET and a POST request to a public API, inspecting the full request and response headers",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Hand-write a JSON payload representing a nested object (a user with a list of addresses), then parse it back",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Explain what a cookie-based session requires from both the server (Set-Cookie) and the client (sending Cookie back) on every request",
            "d": "M",
            "p": "Build task"
          }
        ]
      }
    ],
    "mini": {
      "title": "Checkpoint Project — Team Git Playbook & API Smoke-Test Script",
      "desc": "A documented branching strategy applied to one of your own repos, plus a bash script that uses curl to smoke-test a public REST API's GET/POST endpoints and checks the exit code and status code of each call."
    },
    "quiz": [
      {
        "q": "What does `git rebase` do differently from `git merge`?",
        "options": [
          "Rewrites commit history onto a new base instead of creating a merge commit",
          "Deletes the branch being rebased",
          "Only works on the main branch",
          "Merges automatically without conflicts ever occurring"
        ],
        "correct": 0,
        "explanation": "Rebase replays your commits on top of another branch, producing a linear history, instead of merge's explicit merge commit."
      },
      {
        "q": "What does the command `chmod +x script.sh` do?",
        "options": [
          "Makes the script file executable",
          "Compiles the script",
          "Changes the file's owner",
          "Deletes the file"
        ],
        "correct": 0,
        "explanation": "chmod changes file permissions; +x adds the executable bit so the script can be run directly."
      },
      {
        "q": "What is the difference between PUT and DELETE being \"idempotent\" and POST usually not being?",
        "options": [
          "Retrying PUT/DELETE has the same effect as doing it once; retrying POST can create duplicates",
          "Idempotent methods are always faster",
          "POST cannot be used with JSON bodies",
          "Idempotency only applies to GET requests"
        ],
        "correct": 0,
        "explanation": "A client can safely retry an idempotent request after a timeout without side effects — POST usually can't be retried that safely."
      },
      {
        "q": "What does the Content-Type header tell the receiver of an HTTP request or response?",
        "options": [
          "How to parse the body (e.g. application/json)",
          "The size of the body in bytes",
          "Which server handled the request",
          "The client's IP address"
        ],
        "correct": 0,
        "explanation": "Without a correct Content-Type, the receiver wouldn't know whether to parse the body as JSON, HTML, plain text, or something else."
      },
      {
        "q": "Why does DNS resolution happen before a TCP connection can be established?",
        "options": [
          "TCP needs an IP address to connect to, and DNS is what translates a hostname into one",
          "DNS encrypts the connection",
          "TCP cannot use hostnames at all in any circumstance",
          "DNS and TCP happen simultaneously, never in sequence"
        ],
        "correct": 0,
        "explanation": "A hostname is meaningless to TCP/IP routing on its own — DNS is the lookup step that makes the hostname useful for actually connecting."
      }
    ]
  },
  {
    "id": "sql-db",
    "num": 14,
    "phase": 8,
    "title": "SQL & PostgreSQL",
    "sub": "SQL fundamentals, PostgreSQL, transactions, ACID, indexing, query tuning, and the operational concerns (pooling, migrations, replication) that keep a database healthy in production.",
    "learnMore": {
      "label": "PostgreSQL Tutorial",
      "url": "https://www.postgresql.org/docs/current/tutorial.html"
    },
    "subtopics": [
      {
        "title": "Core SQL & Joins",
        "concepts": [
          "SELECT/WHERE/GROUP BY/HAVING/ORDER BY run in a specific logical order that's different from how you type them — knowing that order explains why HAVING can filter on aggregates but WHERE can't.",
          "INNER JOIN keeps only matching rows; LEFT JOIN keeps every row from the left table even with no match — most real-world \"who's missing\" queries need LEFT JOIN plus a NULL check.",
          "Window functions (RANK, ROW_NUMBER, LAG) compute across a set of rows without collapsing them into groups — the modern replacement for a lot of self-join gymnastics."
        ],
        "checklist": [
          "SELECT & WHERE Filtering",
          "JOIN Types (INNER / LEFT / RIGHT / FULL)",
          "GROUP BY & HAVING",
          "Subqueries & Nested Queries",
          "Aggregate Functions (COUNT, SUM, AVG, MIN, MAX)",
          "Window Functions (RANK, ROW_NUMBER, LAG/LEAD)",
          "ORDER BY & Sorting",
          "UNION / INTERSECT / EXCEPT"
        ],
        "q": [
          {
            "t": "Combine Two Tables",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/combine-two-tables/"
          },
          {
            "t": "Second Highest Salary",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/second-highest-salary/"
          },
          {
            "t": "Duplicate Emails",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/duplicate-emails/"
          },
          {
            "t": "Customers Who Never Order",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/customers-who-never-order/"
          },
          {
            "t": "Employees Earning More Than Their Managers",
            "d": "E",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/employees-earning-more-than-their-managers/"
          },
          {
            "t": "Rank Scores",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/rank-scores/"
          },
          {
            "t": "Department Highest Salary",
            "d": "M",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/department-highest-salary/"
          },
          {
            "t": "Department Top Three Salaries",
            "d": "H",
            "p": "LeetCode",
            "u": "https://leetcode.com/problems/department-top-three-salaries/"
          }
        ]
      },
      {
        "title": "Normalization & Schema Design",
        "concepts": [
          "Normalization removes redundant data by splitting it across related tables — 3NF is the practical target for most transactional schemas.",
          "A junction (bridge) table is how you model many-to-many relationships in a relational database — two foreign keys, often composing the primary key together.",
          "Normalization isn't free: more joins at read time. Denormalizing deliberately (with a documented reason) is a valid trade-off for read-heavy tables."
        ],
        "checklist": [
          "1NF, 2NF, 3NF",
          "Primary Keys & Foreign Keys",
          "Many-to-Many via Junction Tables",
          "Denormalization Trade-offs",
          "Entity-Relationship (ER) Diagrams"
        ],
        "q": [
          {
            "t": "Model a many-to-many tags system with a junction table",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Normalize a flat orders table to 3NF",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Design a schema for a library system with borrowing history",
            "d": "M",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Transactions, ACID & Indexing",
        "concepts": [
          "ACID (Atomicity, Consistency, Isolation, Durability) is the contract a transaction makes: it happens completely or not at all, and concurrent transactions don't corrupt each other.",
          "Isolation levels trade correctness for concurrency, weakest to strictest: Read Uncommitted (dirty reads allowed — you can see another transaction's uncommitted changes), Read Committed (blocks dirty reads, but re-reading the same row twice in one transaction can see a different value — a non-repeatable read), Repeatable Read (locks in the rows you've already read, but a range query can still see rows another transaction inserted — a phantom read), and Serializable (strictest — transactions behave as if run one at a time, no anomalies at all).",
          "PostgreSQL's default is Read Committed; it doesn't actually implement Read Uncommitted (it always blocks dirty reads, even if you request that level), and its Repeatable Read uses snapshot isolation, which also happens to prevent phantom reads — stricter in practice than the SQL standard technically requires.",
          "An index turns an O(n) table scan into an O(log n) lookup, at the cost of slower writes and extra storage — index the columns your WHERE/JOIN/ORDER BY actually use."
        ],
        "checklist": [
          "ACID Properties",
          "Isolation Levels",
          "Indexing Basics (B-Tree)",
          "Composite Indexes",
          "EXPLAIN / Query Plans",
          "Deadlocks & Locking"
        ],
        "q": [
          {
            "t": "Explain and demonstrate a dirty read with two transactions",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Add the right index to fix a slow query (EXPLAIN ANALYZE)",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Simulate and resolve a deadlock between two transactions",
            "d": "H",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Connection Pooling, Migrations & Replication",
        "concepts": [
          "A connection pool (HikariCP) keeps a set of ready-to-use DB connections open instead of opening/closing one per request — opening a raw connection is expensive, and pooling is why Spring Boot apps stay fast under load.",
          "A migration tool (Flyway or Liquibase) versions your schema changes as code, applied in order — the same discipline as Git, but for your database structure.",
          "Replication copies data from a primary database to one or more replicas — read replicas offload read traffic, failover replicas keep the system alive if the primary goes down.",
          "Sharding splits a single logical database across multiple physical machines by some key — a scaling technique for when one machine's storage or throughput isn't enough, at the cost of much harder cross-shard queries."
        ],
        "learnMore": {
          "label": "HikariCP — README",
          "url": "https://github.com/brettwooldridge/HikariCP"
        },
        "checklist": [
          "Connection Pooling (HikariCP)",
          "Schema Migrations (Flyway/Liquibase)",
          "Read Replicas",
          "Sharding Basics"
        ],
        "q": [
          {
            "t": "Configure HikariCP pool size and explain why 'more connections' isn't always faster",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Write a Flyway migration that adds a column with a safe default to an existing table",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Explain the trade-off between synchronous and asynchronous replication for a read replica",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Explain how you'd choose a shard key for a multi-tenant SaaS database",
            "d": "H",
            "p": "Build task"
          }
        ]
      }
    ],
    "mini": {
      "title": "Checkpoint Project — Normalized PostgreSQL Schema for a Bookstore",
      "desc": "A normalized PostgreSQL schema (books, authors, orders, customers) with proper constraints and indexes, wired up through a pooled connection with Flyway migrations, queried directly with hand-written SQL — no ORM yet."
    },
    "quiz": [
      {
        "q": "What is the difference between an INNER JOIN and a LEFT JOIN?",
        "options": [
          "LEFT JOIN keeps all left-table rows even without a match; INNER JOIN only keeps matches",
          "They always produce identical results",
          "INNER JOIN is always faster",
          "LEFT JOIN only works on indexed columns"
        ],
        "correct": 0,
        "explanation": "A LEFT JOIN preserves every row from the left table, filling unmatched right-table columns with NULL."
      },
      {
        "q": "What does the ACID \"I\" (Isolation) guarantee?",
        "options": [
          "Concurrent transactions don't see each other's uncommitted changes",
          "Data is never lost after a crash",
          "A transaction is all-or-nothing",
          "Every row has a unique key"
        ],
        "correct": 0,
        "explanation": "Isolation controls what one transaction can see of another's in-progress changes, governed by the isolation level."
      },
      {
        "q": "Why wouldn't you index every column in a table?",
        "options": [
          "Each index adds write overhead and storage cost",
          "Databases only allow one index per table",
          "Indexes make SELECT queries slower",
          "Indexes are deprecated in modern SQL"
        ],
        "correct": 0,
        "explanation": "Every index must be updated on every INSERT/UPDATE/DELETE — indexing everything trades write speed for read speed you may not need."
      },
      {
        "q": "What normal form eliminates transitive dependencies on the primary key?",
        "options": [
          "Third Normal Form (3NF)",
          "First Normal Form (1NF)",
          "Boyce-Codd Normal Form only",
          "Fourth Normal Form (4NF)"
        ],
        "correct": 0,
        "explanation": "3NF requires every non-key column to depend only on the key, not on another non-key column."
      },
      {
        "q": "What is a database transaction primarily used to guarantee?",
        "options": [
          "A group of operations either all succeed or all roll back together",
          "Faster query execution",
          "Automatic indexing",
          "Data replication across servers"
        ],
        "correct": 0,
        "explanation": "Transactions give you atomicity — critical for operations like transferring money between two accounts."
      }
    ]
  },
  {
    "id": "build-tools",
    "num": 15,
    "phase": 9,
    "title": "JDBC & Maven",
    "sub": "The raw database driver underneath every ORM, and the build tool your projects have quietly been using since Phase 1 (a `javac`/`java` one-liner was all you needed until now) — here's the full lifecycle, dependency management, and multi-module setup.",
    "learnMore": {
      "label": "Maven — Getting Started Guide",
      "url": "https://maven.apache.org/guides/getting-started/"
    },
    "subtopics": [
      {
        "title": "Maven Fundamentals",
        "concepts": [
          "pom.xml declares your project's dependencies, plugins, and build lifecycle — Maven resolves the full dependency tree (including transitive dependencies) from that one file.",
          "The build lifecycle is a fixed sequence of phases (validate, compile, test, package, install, deploy) — running a later phase runs every phase before it too.",
          "Version conflicts between transitive dependencies are resolved by Maven's \"nearest wins\" rule — exclusions and dependency management overrides exist for when that rule picks wrong."
        ],
        "checklist": [
          "pom.xml & Dependencies",
          "Build Lifecycle",
          "Multi-Module Projects",
          "Dependency Conflicts"
        ],
        "q": [
          {
            "t": "Set up a multi-module Maven project (api + core + common)",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Resolve a dependency version conflict using exclusions",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Write a custom Maven profile for dev vs prod builds",
            "d": "H",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Gradle Fundamentals",
        "concepts": [
          "Gradle build scripts are code (Groovy or Kotlin DSL), not declarative XML — more flexible than Maven, at the cost of more ways to write a slow or confusing build.",
          "Gradle's incremental build and caching (local and remote) is its biggest practical win over Maven — unchanged tasks don't re-run.",
          "Tasks are the unit of work in Gradle; you can define custom tasks with arbitrary logic, which Maven makes much harder."
        ],
        "checklist": [
          "Gradle Build Scripts (Kotlin DSL)",
          "Tasks",
          "Build Caching"
        ],
        "q": [
          {
            "t": "Convert a Maven pom.xml project to Gradle (Kotlin DSL)",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Set up Gradle build caching for faster CI builds",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Write a custom Gradle task to generate a build-info file",
            "d": "H",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "JDBC Fundamentals",
        "concepts": [
          "JDBC is the raw API underneath JPA/Hibernate and Spring Data — Connection, Statement, and ResultSet are what those tools generate and manage for you automatically.",
          "A Statement built with string concatenation is how SQL injection happens; a PreparedStatement with ? placeholders is parameterized and safe — always prefer it, even for \"obviously safe\" values.",
          "A ResultSet is a cursor, not a collection — you read it forward, row by row, and it (and the Connection) must be closed, which is exactly what try-with-resources is for."
        ],
        "learnMore": {
          "label": "Oracle — JDBC Basics",
          "url": "https://docs.oracle.com/javase/tutorial/jdbc/basics/index.html"
        },
        "checklist": [
          "DriverManager & Connection",
          "Statement vs PreparedStatement",
          "ResultSet Iteration",
          "Resource Cleanup (try-with-resources)"
        ],
        "q": [
          {
            "t": "Write a raw JDBC program that connects to PostgreSQL and runs a parameterized SELECT",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Demonstrate a SQL injection via string-concatenated Statement, then fix it with PreparedStatement",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Write a JDBC insert wrapped in try-with-resources that correctly closes the Connection and Statement",
            "d": "M",
            "p": "Build task"
          }
        ]
      }
    ],
    "mini": {
      "title": "Checkpoint Project — JDBC Data Access Layer",
      "desc": "Re-implement the Bookstore schema's data access using raw JDBC (PreparedStatement, connection pooling, transactions) — feel exactly what JPA/Hibernate will automate away next, built as a Maven multi-module project."
    },
    "quiz": [
      {
        "q": "What is the primary job of a build tool like Maven or Gradle?",
        "options": [
          "Manage dependencies and automate the build/test/package lifecycle",
          "Run the application in production",
          "Replace version control",
          "Compile-time type checking"
        ],
        "correct": 0,
        "explanation": "Build tools resolve dependencies, compile, run tests, and package your code into a deployable artifact, reproducibly."
      },
      {
        "q": "In Maven, where are a project's dependencies declared?",
        "options": [
          "pom.xml",
          "build.gradle",
          "settings.json",
          "MANIFEST.MF"
        ],
        "correct": 0,
        "explanation": "pom.xml is Maven's project object model file, declaring dependencies, plugins, and build configuration."
      },
      {
        "q": "What does \"dependency scope\" (e.g. test vs compile) control?",
        "options": [
          "When and where a dependency is available (build, test, runtime)",
          "The version number of the dependency",
          "Whether the dependency is open source",
          "The dependency's file size"
        ],
        "correct": 0,
        "explanation": "A test-scoped dependency (like JUnit) is available for tests but excluded from the final production artifact."
      },
      {
        "q": "What is a key advantage Gradle is often cited for over Maven?",
        "options": [
          "A more flexible, script-based build with incremental build caching",
          "It requires no configuration at all",
          "It only supports Java, not Kotlin",
          "It cannot resolve transitive dependencies"
        ],
        "correct": 0,
        "explanation": "Gradle's Groovy/Kotlin DSL and build caching often make builds faster and more customizable than Maven's XML-based model."
      },
      {
        "q": "What is a \"transitive dependency\"?",
        "options": [
          "A dependency of your dependency, pulled in automatically",
          "A dependency only used in tests",
          "A circular dependency between two modules",
          "A dependency resolved at runtime only"
        ],
        "correct": 0,
        "explanation": "If your dependency itself depends on other libraries, those get pulled into your project transitively unless excluded."
      }
    ]
  },
  {
    "id": "spring-core",
    "num": 16,
    "phase": 10,
    "title": "Spring Core — IoC, DI & AOP",
    "sub": "Why Spring exists, explained rather than memorized: Inversion of Control, Dependency Injection, the bean lifecycle, and how Aspect-Oriented Programming makes @Transactional work at all.",
    "learnMore": {
      "label": "Spring Framework Reference — IoC Container",
      "url": "https://docs.spring.io/spring-framework/reference/core/beans.html"
    },
    "subtopics": [
      {
        "title": "IoC, DI & Bean Lifecycle",
        "concepts": [
          "Inversion of Control: Spring creates and wires your objects (beans), instead of your code calling `new` and manually gluing dependencies together.",
          "Constructor injection is the recommended default — it makes required dependencies explicit and lets you create immutable, easily-testable classes.",
          "A bean's lifecycle (instantiate → inject dependencies → @PostConstruct → ready → @PreDestroy) is fully managed by the container; scopes (singleton vs prototype) control how many instances exist."
        ],
        "checklist": [
          "Inversion of Control (IoC)",
          "Constructor vs Field Injection",
          "Bean Scopes (Singleton/Prototype)",
          "Bean Lifecycle Callbacks (@PostConstruct/@PreDestroy)"
        ],
        "q": [
          {
            "t": "Convert field injection to constructor injection across a service",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Resolve a circular dependency between two @Service beans",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Write a custom @Configuration with @Bean and scopes (singleton/prototype)",
            "d": "M",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Spring AOP",
        "concepts": [
          "Aspect-Oriented Programming lets you inject behavior (logging, transactions, security checks) around existing methods without modifying their code — that's literally how @Transactional works under the hood.",
          "An aspect is made of advice (the code to run) and a pointcut (which methods it applies to, matched by an expression) — Spring weaves them together at runtime via proxies.",
          "@Around advice can run code before AND after a method, and even skip calling it entirely — the most powerful (and most easily misused) advice type."
        ],
        "learnMore": {
          "label": "Spring — Aspect Oriented Programming",
          "url": "https://docs.spring.io/spring-framework/reference/core/aop.html"
        },
        "checklist": [
          "Aspects, Advice & Pointcuts",
          "@Before / @After / @Around",
          "How @Transactional Works (Proxies)",
          "Common AOP Use Cases (Logging, Auditing)"
        ],
        "q": [
          {
            "t": "Write an @Before aspect that logs every method call in the Service layer",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Write an @Around aspect that times method execution and logs slow calls",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Explain how @Transactional uses a proxy under the hood, and why calling an @Transactional method from within the same class doesn't trigger it",
            "d": "H",
            "p": "Build task"
          }
        ]
      }
    ],
    "mini": {
      "title": "Checkpoint Project — Plain Spring IoC Container Demo",
      "desc": "A small Spring (no Boot) application with 3-4 beans wired entirely via constructor injection, a custom @Configuration class, and a logging aspect applied via @Around to every Service-layer method."
    },
    "quiz": [
      {
        "q": "What is Inversion of Control (IoC)?",
        "options": [
          "The framework, not your code, controls object creation and wiring",
          "A design pattern for sorting algorithms",
          "A way to reverse a collection",
          "A database transaction isolation level"
        ],
        "correct": 0,
        "explanation": "Instead of your code calling `new` to build dependencies, the container creates and injects them — inverting who's in control."
      },
      {
        "q": "What is the default Spring bean scope?",
        "options": [
          "Singleton — one shared instance per container",
          "Prototype — a new instance every injection",
          "Request — one per HTTP request",
          "Session — one per user session"
        ],
        "correct": 0,
        "explanation": "Singleton is the default; you opt into prototype/request/session scope explicitly when you need a different lifecycle."
      },
      {
        "q": "Why is constructor injection generally preferred over field injection?",
        "options": [
          "It makes required dependencies explicit and lets you create immutable, easily-testable classes",
          "It is the only form Spring supports",
          "Field injection is deprecated and will be removed",
          "Constructor injection is faster at runtime"
        ],
        "correct": 0,
        "explanation": "A class with final fields set via its constructor can't be constructed in an invalid state, and is trivial to unit test without Spring at all."
      },
      {
        "q": "What does Spring AOP let you do?",
        "options": [
          "Apply cross-cutting logic (logging, transactions) without modifying the target class",
          "Replace object-oriented design entirely",
          "Compile Java to bytecode faster",
          "Automatically generate REST endpoints"
        ],
        "correct": 0,
        "explanation": "AOP proxies wrap a bean's methods to inject behavior like @Transactional or a custom logging aspect, separate from business logic."
      },
      {
        "q": "Why does calling an @Transactional method from within the same class often fail to start a transaction?",
        "options": [
          "Spring's AOP proxy is bypassed on internal (self) method calls",
          "Transactional annotations only work on interfaces",
          "The method must be static",
          "Spring disables transactions inside loops"
        ],
        "correct": 0,
        "explanation": "The proxy that applies @Transactional wraps external calls to the bean — a direct `this.method()` call skips the proxy entirely."
      }
    ]
  },
  {
    "id": "spring-boot-rest",
    "num": 17,
    "phase": 11,
    "title": "Spring Boot & REST APIs",
    "sub": "Turn Spring Core into a real, callable service: layered architecture, externalized config, centralized exception handling, and REST API design (DTOs, versioning, pagination) that's actually documented.",
    "learnMore": {
      "label": "Spring Boot Reference Docs",
      "url": "https://docs.spring.io/spring-boot/documentation.html"
    },
    "subtopics": [
      {
        "title": "Layered Architecture & Config",
        "concepts": [
          "Controller (HTTP in/out) → Service (business logic) → Repository (data access) keeps each layer replaceable and independently testable.",
          "Spring profiles (application-dev.yml, application-prod.yml) let the same code run with different configuration per environment, activated by a single active-profile flag.",
          "@ConfigurationProperties binds a whole block of YAML/properties to a typed Java object — safer and more discoverable than scattering @Value annotations everywhere."
        ],
        "checklist": [
          "Controller/Service/Repository Layers",
          "application.yml & Profiles",
          "@ConfigurationProperties",
          "Externalized Configuration"
        ],
        "q": [
          {
            "t": "Split a fat Controller into Controller/Service/Repository layers",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Set up application-dev.yml and application-prod.yml with profiles",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Externalize secrets using environment variables + @ConfigurationProperties",
            "d": "M",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Exception Handling & Validation",
        "concepts": [
          "@ControllerAdvice + @ExceptionHandler centralizes error handling — one place maps exceptions to HTTP status codes instead of try/catch in every controller method.",
          "@Valid triggers Bean Validation (@NotNull, @Size, @Email, ...) on request bodies automatically, rejecting bad input before it reaches your business logic.",
          "A consistent error-response shape (RFC 7807 \"problem details\" or your own convention) makes API errors predictable for every client that calls you."
        ],
        "checklist": [
          "@ControllerAdvice & @ExceptionHandler",
          "Bean Validation (@Valid, @NotNull, @Size)",
          "Custom Validation Annotations",
          "Structured Error Responses"
        ],
        "q": [
          {
            "t": "Build a global exception handler with @ControllerAdvice",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Add request validation with @Valid and custom annotations",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Return structured error responses (RFC 7807 style)",
            "d": "H",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "DTOs, Versioning & Pagination",
        "concepts": [
          "A DTO (Data Transfer Object) is a shape designed for the API contract — mapping Entity → DTO stops internal database columns and relationships from leaking to clients.",
          "Version your API (URI prefix like /v2/, or a header) before you need to — it's the only way to change a contract without breaking every existing client at once.",
          "Offset pagination (page/size) is simple but slow on large tables; cursor-based pagination (keyset) stays fast because it doesn't need to skip rows."
        ],
        "checklist": [
          "Entity vs DTO Mapping",
          "API Versioning Strategies",
          "Offset vs Cursor Pagination"
        ],
        "q": [
          {
            "t": "Map Entity → DTO to avoid leaking internal fields",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Version an API using URI vs header-based versioning",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Add cursor-based pagination to a large listing endpoint",
            "d": "H",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Documentation & Contracts",
        "concepts": [
          "OpenAPI/Swagger generates interactive, always-up-to-date docs directly from your code's annotations — far more reliable than a hand-written doc that drifts.",
          "A shared Postman collection with environment variables lets a whole team (or a frontend dev with no backend access) exercise every endpoint without reading the source.",
          "A consistent error contract across every endpoint (same field names, same structure) is what makes an API pleasant to integrate against."
        ],
        "checklist": [
          "OpenAPI / Swagger",
          "Postman Collections",
          "Consistent Error Contracts"
        ],
        "q": [
          {
            "t": "Document an API fully with springdoc-openapi/Swagger",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Write a Postman collection with environment variables",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Design a consistent error-response contract across all endpoints",
            "d": "M",
            "p": "Build task"
          }
        ]
      }
    ],
    "mini": {
      "title": "Checkpoint Project — Task Management REST API",
      "desc": "A documented, versioned, paginated REST API for managing projects/tasks/assignees, built on Spring Boot with proper layering, DTOs, global exception handling, and Bean Validation — the shape of a real placement-ready backend project."
    },
    "quiz": [
      {
        "q": "@ControllerAdvice + @ExceptionHandler is used for:",
        "options": [
          "Centralizing error handling into one place instead of try/catch in every controller",
          "Validating request bodies",
          "Logging every HTTP request",
          "Configuring the embedded server port"
        ],
        "correct": 0,
        "explanation": "One global handler maps exceptions to HTTP status codes and a consistent error-response shape, instead of duplicating that logic per endpoint."
      },
      {
        "q": "What does @Valid trigger on a request body?",
        "options": [
          "Bean Validation annotations (@NotNull, @Size, @Email) before the body reaches your business logic",
          "Automatic database persistence",
          "JSON serialization",
          "Authentication"
        ],
        "correct": 0,
        "explanation": "@Valid rejects malformed input at the controller boundary, before it can reach and corrupt business logic."
      },
      {
        "q": "What is the difference between PUT and PATCH?",
        "options": [
          "PUT replaces the whole resource; PATCH applies a partial update",
          "PUT is read-only; PATCH writes data",
          "PATCH requires no request body",
          "They are functionally identical"
        ],
        "correct": 0,
        "explanation": "PUT sends the full new representation, while PATCH sends only the fields that changed."
      },
      {
        "q": "Why is offset-based pagination (LIMIT/OFFSET) problematic at large scale?",
        "options": [
          "The database still has to scan and discard all skipped rows",
          "It cannot return results in order",
          "It requires no index at all",
          "It only works with NoSQL databases"
        ],
        "correct": 0,
        "explanation": "A large OFFSET forces the database to walk past many rows before returning results — cursor-based pagination avoids this."
      },
      {
        "q": "What is a common, safe approach to versioning a public REST API?",
        "options": [
          "A version segment in the URL path (e.g. /api/v1/...)",
          "Never versioning and just changing behavior in place",
          "Requiring clients to guess the schema",
          "Only versioning the database, not the API"
        ],
        "correct": 0,
        "explanation": "URL-path versioning is explicit and simple for clients to pin to, though header-based versioning is a valid alternative."
      }
    ]
  },
  {
    "id": "jpa",
    "num": 18,
    "phase": 12,
    "title": "JPA & Hibernate",
    "sub": "The layer between your Java objects and your SQL tables. The chain: SQL → JDBC → ORM → JPA → Hibernate → Spring Data JPA — each one exists to hide (and sometimes leak) the layer below it.",
    "learnMore": {
      "label": "Baeldung — The Persistence Layer with Spring Data JPA",
      "url": "https://www.baeldung.com/the-persistence-layer-with-spring-data-jpa"
    },
    "subtopics": [
      {
        "title": "Entities & Relationships",
        "concepts": [
          "An @Entity maps a Java class to a table; @Id marks the primary key — Hibernate generates the SQL to keep the object and row in sync.",
          "@OneToMany/@ManyToOne/@ManyToMany model foreign-key relationships; get the owning side right or JPA won't know which table actually stores the foreign key.",
          "Bidirectional relationships need mappedBy on one side to avoid a duplicate join table or infinite JSON serialization loops."
        ],
        "checklist": [
          "@Entity & @Id",
          "@OneToMany / @ManyToOne",
          "@ManyToMany & Join Tables",
          "Cascading (CascadeType)",
          "Bidirectional Mapping & mappedBy"
        ],
        "q": [
          {
            "t": "Model a OneToMany between Order and OrderItem correctly",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Fix a bidirectional ManyToMany causing infinite JSON recursion",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Implement a self-referencing entity (Employee → Manager)",
            "d": "M",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Querying — JPQL, Criteria, Native & Spring Data",
        "concepts": [
          "JPQL queries entities and their fields, not table/column names — it's SQL-shaped but operates on your object model.",
          "Spring Data JPA derives queries from method names (findByEmailAndActiveTrue) or lets you write JPQL directly with @Query — both save you from hand-writing repository boilerplate.",
          "The Criteria API builds queries programmatically with type-safe method calls — more verbose than JPQL, but composable for dynamic filters built at runtime.",
          "Native queries drop to raw SQL when JPQL can't express what you need — use sparingly, since they break the database-portability JPA otherwise gives you."
        ],
        "checklist": [
          "JPQL Basics",
          "Spring Data Derived Query Methods",
          "@Query Annotation",
          "Criteria API",
          "Native Queries & Pagination"
        ],
        "q": [
          {
            "t": "Write a JPQL query with joins and a WHERE on a nested field",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Write 3 Spring Data JPA derived-query methods (findBy...) plus one custom @Query",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Write a native query with pagination for a report",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Build a dynamic search filter using the Criteria API",
            "d": "H",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Lazy vs Eager, N+1, Caching",
        "concepts": [
          "LAZY loads a relationship only when accessed; EAGER loads it immediately with the parent — LAZY is the safer default, EAGER can silently pull in far more data than you meant to.",
          "The N+1 problem: one query for a list of N parents, then N more queries fetching each parent's children one at a time — fix it with a JOIN FETCH or an entity graph.",
          "Second-level cache stores entities across sessions/requests — a real win for read-heavy, rarely-changing data, but a correctness risk if you forget to invalidate it on writes."
        ],
        "checklist": [
          "FetchType.LAZY vs EAGER",
          "The N+1 Query Problem",
          "JOIN FETCH & Entity Graphs",
          "Second-Level Cache"
        ],
        "q": [
          {
            "t": "Diagnose and fix an N+1 query using a given repository",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Switch a relation from EAGER to LAZY without breaking a DTO mapper",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Enable second-level cache for a read-heavy entity",
            "d": "H",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Dirty Checking & Locking Strategies",
        "concepts": [
          "Dirty checking is how Hibernate knows what to UPDATE without you calling save() again — it compares a managed entity's current field values against a snapshot taken when it was loaded, inside the persistence context.",
          "Optimistic locking (a @Version column) assumes conflicts are rare: it lets two transactions read the same row, and only fails the second write if the version changed underneath it — cheap, no blocking, but requires handling the conflict.",
          "Pessimistic locking (SELECT ... FOR UPDATE) assumes conflicts are likely: it locks the row for the duration of the transaction, blocking other writers — safer under high contention, at the cost of reduced concurrency."
        ],
        "learnMore": {
          "label": "Hibernate ORM — Locking",
          "url": "https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html#locking"
        },
        "checklist": [
          "Dirty Checking & the Persistence Context",
          "Optimistic Locking (@Version)",
          "Pessimistic Locking (SELECT FOR UPDATE)",
          "Choosing Between Them"
        ],
        "q": [
          {
            "t": "Modify a managed entity's field and observe Hibernate auto-generate the UPDATE on transaction commit, with no explicit save() call",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Add @Version to an entity and demonstrate an OptimisticLockException when two transactions update the same row concurrently",
            "d": "H",
            "p": "Build task"
          },
          {
            "t": "Use a pessimistic lock on an inventory row during a checkout flow to prevent overselling, and explain the throughput trade-off",
            "d": "H",
            "p": "Build task"
          }
        ]
      }
    ],
    "mini": {
      "title": "Checkpoint Project — JPA-Backed Bookstore API",
      "desc": "Re-implement the Bookstore's data access layer as Spring Data JPA repositories with proper entity relationships, tuned queries, and one deliberately-fixed N+1 problem with before/after query logs — the same domain, three data-access technologies deep."
    },
    "quiz": [
      {
        "q": "What must be set on the non-owning side of a bidirectional @OneToMany/@ManyToOne relationship?",
        "options": [
          "mappedBy, to avoid a duplicate join table or infinite JSON serialization loop",
          "@JoinColumn, declaring the foreign key a second time",
          "@ManyToMany, to make the relationship symmetric",
          "Nothing — JPA infers the owning side automatically"
        ],
        "correct": 0,
        "explanation": "mappedBy tells JPA which side already owns the foreign key, preventing a redundant join table and infinite bidirectional serialization."
      },
      {
        "q": "What does a JPQL query operate on, unlike a native SQL query?",
        "options": [
          "Entity objects and their fields, not table and column names",
          "Only primary keys",
          "Raw JDBC ResultSets",
          "XML mapping files"
        ],
        "correct": 0,
        "explanation": "JPQL is SQL-shaped but queries your object model — Hibernate translates it into the actual SQL against your tables."
      },
      {
        "q": "What is the N+1 query problem?",
        "options": [
          "Fetching a list, then issuing one extra query per item for related data",
          "Running the same query N times by mistake",
          "A migration that adds N+1 columns",
          "A deadlock between N transactions"
        ],
        "correct": 0,
        "explanation": "Lazy-loaded associations accessed in a loop trigger one query per row, instead of one join query — a very common JPA performance bug."
      },
      {
        "q": "How does Hibernate know what to UPDATE when you modify a managed entity's field, without calling save() again?",
        "options": [
          "Dirty checking compares the entity's current values against a snapshot taken when it was loaded",
          "It re-reads and diffs the entire table on every commit",
          "It requires an explicit @Update annotation on the field",
          "It doesn't — you must always call save() explicitly"
        ],
        "correct": 0,
        "explanation": "Inside the persistence context, Hibernate tracks a snapshot per managed entity and auto-generates the UPDATE for whatever changed by commit time."
      },
      {
        "q": "What does adding @Version to an entity enable?",
        "options": [
          "Optimistic locking — a concurrent write fails if another transaction changed the row first",
          "Automatic backups of every row",
          "Pessimistic, blocking row-level locking for the whole transaction",
          "Faster reads via second-level caching"
        ],
        "correct": 0,
        "explanation": "Optimistic locking assumes conflicts are rare: two transactions can read the same row, but the second write fails once the version has moved underneath it."
      }
    ]
  },
  {
    "id": "production-api-engineering",
    "num": 19,
    "phase": 13,
    "title": "Production API Engineering",
    "sub": "What separates a working API from a production one: idempotency under retries, rate limiting, externalized configuration, and real observability (Actuator, structured logging, metrics).",
    "learnMore": {
      "label": "Spring Boot Actuator Reference",
      "url": "https://docs.spring.io/spring-boot/reference/actuator/index.html"
    },
    "subtopics": [
      {
        "title": "Idempotency, Rate Limiting & Configuration Management",
        "concepts": [
          "An idempotency key lets a client safely retry a request (e.g. after a timeout, unsure if it succeeded) without the server processing it twice — the server remembers the key and returns the original result for any repeat, instead of creating a duplicate order or double-charging a payment.",
          "Rate limiting protects a service from being overwhelmed by one client (accidentally or intentionally) — a 429 Too Many Requests response, ideally with a Retry-After header, is how a well-behaved API pushes back.",
          "Configuration (database URLs, feature flags, timeouts) belongs outside the code — externalized to environment variables or a config service — so the exact same build can run in dev/staging/production with only its config changing, never a rebuild."
        ],
        "learnMore": {
          "label": "Stripe — Idempotent Requests",
          "url": "https://docs.stripe.com/api/idempotent_requests"
        },
        "checklist": [
          "Idempotency Keys for Retried Requests",
          "Rate Limiting a REST Endpoint",
          "Externalized Configuration",
          "The Twelve-Factor App (config principle)"
        ],
        "q": [
          {
            "t": "Add idempotency-key support to a POST /orders endpoint so a retried request never creates a duplicate order",
            "d": "H",
            "p": "Build task"
          },
          {
            "t": "Implement a simple rate limiter (token bucket) for a REST endpoint, returning 429 with a Retry-After header once exceeded",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Move a hard-coded database URL and API key out of application.yml into environment variables",
            "d": "E",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Observability — Actuator, Logging & Metrics",
        "concepts": [
          "Spring Boot Actuator exposes ready-made operational endpoints (/health, /metrics, /info) — the standard way a load balancer or monitoring tool checks if an instance is actually alive.",
          "SLF4J is the logging facade your code calls; Logback (or Log4j2) is the actual implementation underneath in a typical Spring Boot app — switching implementations shouldn't require touching your log statements.",
          "Prometheus scrapes and stores time-series metrics; Grafana turns those metrics into dashboards and alerts — together the standard open-source pairing for \"is my service healthy right now?\""
        ],
        "learnMore": {
          "label": "Spring Boot Actuator Reference",
          "url": "https://docs.spring.io/spring-boot/reference/actuator/index.html"
        },
        "checklist": [
          "Spring Boot Actuator",
          "SLF4J & Logback",
          "Prometheus & Grafana"
        ],
        "q": [
          {
            "t": "Enable Spring Boot Actuator and expose /health and /metrics endpoints",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Switch a service's logging to structured JSON output with SLF4J + Logback",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Wire Actuator metrics into a local Prometheus + Grafana dashboard",
            "d": "H",
            "p": "Build task"
          }
        ]
      }
    ],
    "mini": {
      "title": "Checkpoint Project — Hardened Task API",
      "desc": "Take the Phase 12 Task Management API and add idempotency-key support on its create endpoint, a rate limiter, environment-variable-based configuration, and Actuator health/metrics endpoints wired to structured logging."
    },
    "quiz": [
      {
        "q": "What does an idempotency key let a client do safely?",
        "options": [
          "Retry a request without the server processing it twice",
          "Skip authentication",
          "Bypass rate limiting",
          "Cache the response indefinitely"
        ],
        "correct": 0,
        "explanation": "The server remembers the key and returns the original result for any repeat, instead of e.g. creating a duplicate order."
      },
      {
        "q": "What HTTP status code should a rate-limited request typically receive?",
        "options": [
          "429 Too Many Requests",
          "403 Forbidden",
          "500 Internal Server Error",
          "404 Not Found"
        ],
        "correct": 0,
        "explanation": "429, ideally with a Retry-After header, is the standard way an API pushes back on a client exceeding its limit."
      },
      {
        "q": "Why should configuration (database URLs, API keys) live outside the code, in environment variables?",
        "options": [
          "The same build can run in dev/staging/production with only its config changing",
          "It makes the code compile faster",
          "It is required by the Java language",
          "It automatically encrypts the values"
        ],
        "correct": 0,
        "explanation": "Externalized config avoids needing a rebuild for every environment, and keeps secrets out of source control."
      },
      {
        "q": "What does Spring Boot Actuator's /health endpoint provide?",
        "options": [
          "A standard way for a load balancer or monitoring tool to check if an instance is alive",
          "A list of all database tables",
          "A performance profiler",
          "A place to view source code"
        ],
        "correct": 0,
        "explanation": "Actuator exposes ready-made operational endpoints — /health is the one infrastructure checks to decide whether to route traffic to an instance."
      },
      {
        "q": "What is the standard open-source pairing for turning metrics into dashboards and alerts?",
        "options": [
          "Prometheus (collects/stores metrics) + Grafana (visualizes them)",
          "SLF4J + Logback",
          "JUnit + Mockito",
          "Maven + Gradle"
        ],
        "correct": 0,
        "explanation": "Prometheus scrapes and stores time-series metrics; Grafana turns them into dashboards and alerts."
      }
    ]
  },
  {
    "id": "security",
    "num": 20,
    "phase": 14,
    "title": "Spring Security",
    "sub": "AuthN vs AuthZ, Spring Security, JWT, OAuth2 basics, password hashing, CORS, and the specific vulnerabilities every backend has to defend against.",
    "learnMore": {
      "label": "OWASP Top Ten",
      "url": "https://owasp.org/www-project-top-ten/"
    },
    "subtopics": [
      {
        "title": "Authentication vs Authorization",
        "concepts": [
          "Authentication answers \"who are you?\" (login); authorization answers \"what are you allowed to do?\" (roles/permissions) — conflating the two is a common source of security bugs.",
          "Never store passwords in plaintext or with a fast hash — BCrypt (or Argon2) is deliberately slow and salted, making brute-force attacks impractical.",
          "Broken access control (OWASP #1) usually means checking authentication but forgetting authorization — verifying a request is real without verifying it's allowed to touch that resource."
        ],
        "checklist": [
          "AuthN vs AuthZ",
          "Password Hashing (BCrypt)",
          "Role-Based Access Control (RBAC)",
          "Broken Access Control (OWASP #1)"
        ],
        "q": [
          {
            "t": "Hash and verify passwords using BCrypt",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Implement role-based access control (USER vs ADMIN)",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Explain and fix a broken access control endpoint (OWASP #1)",
            "d": "M",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Spring Security & JWT",
        "concepts": [
          "Spring Security is a chain of filters that intercepts every request before it reaches your controller — a custom UserDetailsService plugs your own user lookup into that chain.",
          "A JWT is a signed (not necessarily encrypted) token carrying claims — the server trusts it because of the signature, not because it looked it up in a session store.",
          "@PreAuthorize enforces method-level security with a SpEL expression, giving finer-grained control than URL-pattern-based rules alone."
        ],
        "checklist": [
          "Spring Security Filter Chain",
          "UserDetailsService",
          "JWT Structure & Signing",
          "Method-Level Security (@PreAuthorize)"
        ],
        "q": [
          {
            "t": "Set up Spring Security with a custom UserDetailsService",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Add method-level security with @PreAuthorize",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Issue and validate JWT access + refresh tokens",
            "d": "H",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "OAuth2 & CORS",
        "concepts": [
          "OAuth2's authorization code flow lets a user grant your app access without ever handing it their password — the app gets a token, not the credentials.",
          "CORS is a browser-enforced rule, not a server security feature — it stops a browser page on one origin from silently calling your API on another unless you explicitly allow it.",
          "Rate limiting on auth endpoints specifically defends against brute-force login attempts — a login endpoint with no rate limit is an open invitation."
        ],
        "checklist": [
          "OAuth2 Authorization Code Flow",
          "CORS Configuration",
          "Rate Limiting"
        ],
        "q": [
          {
            "t": "Configure CORS correctly for a React frontend calling your API",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Explain the OAuth2 authorization code flow with a diagram",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Add rate limiting to a login endpoint to block brute force",
            "d": "H",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Common Web Vulnerabilities — SQLi, XSS & CSRF",
        "concepts": [
          "SQL injection happens when user input is concatenated directly into a query — parameterized queries (prepared statements) are the fix, not string-escaping tricks.",
          "XSS (Cross-Site Scripting) happens when unescaped user input is rendered as HTML/JS in another user's browser — modern frameworks escape output by default, which is why avoiding raw HTML injection prevents most of it.",
          "CSRF tricks a logged-in user's browser into submitting a request they didn't intend — CSRF tokens (or the SameSite cookie attribute) prove a request actually came from your own site's form."
        ],
        "learnMore": {
          "label": "OWASP Top Ten",
          "url": "https://owasp.org/www-project-top-ten/"
        },
        "checklist": [
          "SQL Injection & Prepared Statements",
          "Cross-Site Scripting (XSS)",
          "Cross-Site Request Forgery (CSRF)"
        ],
        "q": [
          {
            "t": "Demonstrate a SQL injection against unparameterized code, then fix it with a PreparedStatement",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Build a form vulnerable to stored XSS, then fix it with proper output escaping",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Explain how a CSRF token or SameSite cookie attribute stops a forged cross-site request",
            "d": "M",
            "p": "Build task"
          }
        ]
      }
    ],
    "mini": {
      "title": "Checkpoint Project — Secured Booking API",
      "desc": "A booking/reservation API with JWT authentication and role-based access control, hardened against SQL injection, XSS, and CSRF."
    },
    "quiz": [
      {
        "q": "What is the difference between authentication and authorization?",
        "options": [
          "Authentication proves who you are; authorization decides what you're allowed to do",
          "They are the same concept with different names",
          "Authorization always happens before authentication",
          "Authentication only applies to APIs, not web apps"
        ],
        "correct": 0,
        "explanation": "You authenticate once (login), then every subsequent request is authorized against your roles/permissions."
      },
      {
        "q": "Why should passwords be hashed with a slow algorithm like bcrypt instead of a fast one like SHA-256?",
        "options": [
          "Slowness makes brute-force and rainbow-table attacks impractical",
          "bcrypt encrypts instead of hashing",
          "Fast hashes are always insecure to store",
          "SHA-256 cannot be used for passwords at all"
        ],
        "correct": 0,
        "explanation": "bcrypt is deliberately slow and salted, making it computationally expensive to try billions of guesses."
      },
      {
        "q": "What does JWT stand for and what does it typically carry?",
        "options": [
          "JSON Web Token — a signed, self-contained set of claims about the user",
          "Java Web Task — a scheduled background job",
          "JSON Write Trigger — a database hook",
          "Just Web Traffic — an HTTP log format"
        ],
        "correct": 0,
        "explanation": "A JWT is signed so the server can verify it wasn't tampered with, without a database lookup on every request."
      },
      {
        "q": "What does CSRF (Cross-Site Request Forgery) exploit?",
        "options": [
          "A browser automatically sending cookies with a request from another site",
          "A SQL injection in a login form",
          "A weak password hash",
          "An unencrypted HTTPS connection"
        ],
        "correct": 0,
        "explanation": "CSRF tricks a logged-in user's browser into making an unwanted request, relying on cookies being sent automatically — CSRF tokens defend against this."
      },
      {
        "q": "What is the primary defense against SQL injection?",
        "options": [
          "Parameterized queries / prepared statements instead of string concatenation",
          "Encrypting the entire database",
          "Rate limiting requests",
          "Using a NoSQL database instead"
        ],
        "correct": 0,
        "explanation": "Parameterized queries separate code from data, so user input can never be interpreted as SQL syntax."
      }
    ]
  },
  {
    "id": "testing",
    "num": 21,
    "phase": 15,
    "title": "Testing",
    "sub": "JUnit and Mockito for isolated unit tests, Spring Boot's test slices and Testcontainers for realistic integration tests, and the TDD discipline that keeps both honest — coverage is a floor, not a goal.",
    "learnMore": {
      "label": "JUnit 5 User Guide",
      "url": "https://junit.org/junit5/docs/current/user-guide/"
    },
    "subtopics": [
      {
        "title": "Unit Testing with JUnit & Mockito",
        "concepts": [
          "A unit test exercises one class in isolation — mock its dependencies (with Mockito) so a failure in the Repository doesn't also fail the Service's tests.",
          "assertThrows verifies that bad input actually throws the expected exception — untested exception paths are some of the most common production bugs.",
          "A stub returns canned data with no verification, a mock verifies interactions happened, a spy wraps a real object so you can override just some methods, and a fake is a lightweight working implementation (like an in-memory repository) — knowing which one you need keeps tests honest."
        ],
        "checklist": [
          "JUnit 5 Basics (@Test, Assertions)",
          "Mockito Mocking",
          "Stub vs Mock vs Spy vs Fake",
          "assertThrows for Exception Testing"
        ],
        "q": [
          {
            "t": "Write unit tests for a Service class mocking the Repository",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Test exception paths using assertThrows",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Mock an external API call using Mockito and verify interactions",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Write one test each using a stub, a mock, a spy, and a fake, and explain when you'd reach for each",
            "d": "M",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Integration Testing",
        "concepts": [
          "@SpringBootTest boots the real application context — slower than a unit test, but it catches wiring/configuration bugs unit tests can't see.",
          "@WebMvcTest loads only the web layer (controllers, MockMvc) without the full context; @DataJpaTest loads only the JPA/repository layer against an in-memory DB — both are far faster than a full @SpringBootTest when you only need one slice.",
          "Testcontainers spins up a real, disposable Postgres (or any service) in Docker for tests — closer to production behavior than an in-memory H2 substitute."
        ],
        "checklist": [
          "@SpringBootTest",
          "@WebMvcTest & MockMvc",
          "@DataJpaTest",
          "Testcontainers"
        ],
        "q": [
          {
            "t": "Write a @SpringBootTest with an in-memory H2 database",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Test a REST controller end-to-end with MockMvc using @WebMvcTest",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Test a repository in isolation using @DataJpaTest",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Set up Testcontainers to run tests against real PostgreSQL",
            "d": "H",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "TDD & Coverage",
        "concepts": [
          "Red-green-refactor: write a failing test first (red), write the minimum code to pass it (green), then clean up (refactor) with the safety net already in place.",
          "Coverage percentage measures which lines ran during tests — it says nothing about whether the assertions were meaningful, so treat it as a floor, not a goal.",
          "The edge cases most likely to be missed are empty input, null, boundary values (0, -1, max), and concurrent access — deliberately hunt for these."
        ],
        "checklist": [
          "Red-Green-Refactor",
          "Code Coverage (JaCoCo)",
          "Identifying Edge Cases"
        ],
        "q": [
          {
            "t": "Get a service class to 90%+ coverage with JaCoCo",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Build one feature strictly red-green-refactor (TDD)",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Identify untested edge cases in an existing class",
            "d": "M",
            "p": "Build task"
          }
        ]
      }
    ],
    "mini": {
      "title": "Checkpoint Project — Fully Tested Booking API",
      "desc": "Add a complete unit + integration test suite (with Testcontainers, @WebMvcTest and @DataJpaTest slices) to the Secured Booking API."
    },
    "quiz": [
      {
        "q": "What is the main difference between a unit test and an integration test?",
        "options": [
          "A unit test isolates one component (often with mocks); an integration test exercises real collaborators together",
          "Integration tests never use assertions",
          "Unit tests always require a database",
          "They test the exact same thing, just at different speeds"
        ],
        "correct": 0,
        "explanation": "The test pyramid favors many fast, isolated unit tests and fewer, slower integration tests that catch wiring issues."
      },
      {
        "q": "What is the difference between a mock and a stub?",
        "options": [
          "A mock verifies interactions happened; a stub just returns canned responses",
          "A stub is faster than a mock in every case",
          "Mocks can only be used in Python",
          "They are interchangeable terms with no real difference"
        ],
        "correct": 0,
        "explanation": "You assert against a mock (\"was this method called?\"); a stub just feeds fixed data to the code under test."
      },
      {
        "q": "Why would you prefer Testcontainers over an in-memory H2 database for integration tests?",
        "options": [
          "H2 can behave differently from your real production database (Postgres, MySQL)",
          "Testcontainers is faster to start than H2",
          "H2 cannot run any SQL at all",
          "Testcontainers requires no Docker"
        ],
        "correct": 0,
        "explanation": "Testcontainers spins up the real database in a container, catching dialect-specific bugs H2 would silently hide."
      },
      {
        "q": "What is the red-green-refactor cycle in TDD?",
        "options": [
          "Write a failing test, make it pass minimally, then improve the code",
          "Write all tests after the feature is complete",
          "Refactor first, then write tests",
          "Only refactor code that's currently broken"
        ],
        "correct": 0,
        "explanation": "TDD's cycle keeps you honest that the test actually fails first (red), then passes (green), then gets cleaned up."
      },
      {
        "q": "Why isn't 100% code coverage the same as \"well tested\"?",
        "options": [
          "Coverage measures lines executed, not whether the right assertions were made",
          "Coverage tools are always inaccurate",
          "100% coverage is impossible to achieve",
          "Coverage only applies to integration tests"
        ],
        "correct": 0,
        "explanation": "A test can execute every line and assert nothing meaningful — coverage is a floor, not proof of correctness."
      }
    ]
  },
  {
    "id": "production-engineering-capstone",
    "num": 22,
    "phase": 16,
    "title": "Production Backend Engineering",
    "sub": "The synthesis phase: clean code, refactoring, systematic debugging, and code review — practiced on the real, running project you've been building since Phase 12, not as a separate theory unit.",
    "learnMore": {
      "label": "Refactoring.Guru — Code Smells",
      "url": "https://refactoring.guru/refactoring/smells"
    },
    "subtopics": [
      {
        "title": "Clean Code & Refactoring",
        "concepts": [
          "A good name explains intent without needing a comment — if you need a comment to explain what a variable or method does, the name is probably wrong, not the comment missing.",
          "Refactoring changes a program's internal structure without changing its observable behavior — the only way to do this safely is with a test suite that catches you if you accidentally do change behavior.",
          "Small, focused methods (doing one thing, named for what that thing is) are easier to test, easier to read, and easier to reuse than one long method that does five things in sequence."
        ],
        "learnMore": {
          "label": "Refactoring.Guru — Code Smells",
          "url": "https://refactoring.guru/refactoring/smells"
        },
        "checklist": [
          "Naming for Intent",
          "Extract Method / Extract Class",
          "Identifying Code Smells",
          "Refactoring Safely (Tests First)"
        ],
        "q": [
          {
            "t": "Given a 100-line method doing validation, calculation, and persistence, extract it into 3 well-named methods",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Identify and name 3 code smells in a given class (e.g. long method, feature envy, primitive obsession)",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Refactor a class with misleading variable names (a, temp, data2) into self-explanatory ones, with no behavior change",
            "d": "E",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Debugging, Code Review & Documentation",
        "concepts": [
          "Systematic debugging beats guessing: reproduce the bug reliably first, form a specific hypothesis about the cause, test that hypothesis with the smallest possible change, and repeat — \"just add print statements everywhere\" is a last resort, not a first step.",
          "A good code review comment explains why a change is needed, not just what to change — and distinguishes a blocking issue (must fix) from a suggestion (your call) so the author isn't left guessing what's actually required.",
          "Documentation that goes stale is worse than no documentation — write a README that explains how to run and test the project (which breaks loudly when wrong) rather than a design doc that silently drifts from the real code."
        ],
        "learnMore": {
          "label": "GeeksforGeeks — Debugging in Java",
          "url": "https://www.geeksforgeeks.org/java/debugging-in-java/"
        },
        "checklist": [
          "A Systematic Debugging Process",
          "Using a Debugger (Breakpoints, Watches, Stepping)",
          "Giving Useful Code Review Feedback",
          "Writing a README That Stays Accurate"
        ],
        "q": [
          {
            "t": "Debug a given failing test using breakpoints and step-through, documenting your hypothesis-test-repeat process",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Review a given pull request and leave at least one blocking comment and one non-blocking suggestion, clearly labeled",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Write a README for one of your own projects covering setup, run, and test instructions that someone else could follow cold",
            "d": "E",
            "p": "Build task"
          }
        ]
      }
    ],
    "mini": {
      "title": "Checkpoint Project — Production E-Commerce Backend",
      "desc": "Take your Task/Order API through a full production hardening pass: refactor its worst 2-3 code smells, write a README that accurately documents setup/run/test, and produce a self-review of the codebase identifying what you'd flag in someone else's PR."
    },
    "quiz": [
      {
        "q": "What is the risk of naming a variable something like `temp` or `data2`?",
        "options": [
          "The name explains nothing about intent, forcing readers to trace usage to understand it",
          "It will cause a compiler error",
          "It makes the code run slower",
          "Java reserves these names internally"
        ],
        "correct": 0,
        "explanation": "A good name explains intent without needing a comment — a vague name pushes that cost onto every future reader."
      },
      {
        "q": "What must be true before you can safely refactor a piece of code?",
        "options": [
          "You have tests that would catch an accidental behavior change",
          "The code must already be perfectly clean",
          "You have manager approval",
          "The code must be less than 50 lines"
        ],
        "correct": 0,
        "explanation": "Refactoring is supposed to change structure without changing behavior — without tests, you can't verify you actually achieved that."
      },
      {
        "q": "What is the first step in systematic debugging?",
        "options": [
          "Reproduce the bug reliably",
          "Add print statements everywhere",
          "Rewrite the suspected function from scratch",
          "Ask a teammate to fix it"
        ],
        "correct": 0,
        "explanation": "You can't test a hypothesis about a bug you can't reliably reproduce — reproduction comes before diagnosis."
      },
      {
        "q": "What distinguishes a good code review comment from a vague one?",
        "options": [
          "It explains why a change is needed and whether it's blocking or a suggestion",
          "It only points out typos",
          "It approves the PR without reading it",
          "It rewrites the entire file"
        ],
        "correct": 0,
        "explanation": "A reviewer who says \"why\" (not just \"what\") and is explicit about blocking vs. optional saves the author real back-and-forth."
      },
      {
        "q": "Why is a README that documents setup/run/test commands often more valuable than a separate design doc?",
        "options": [
          "It breaks loudly (a failed command) when it goes stale, while a design doc can silently drift from the real code",
          "Design docs are never useful",
          "READMEs are required by Git",
          "Design docs take longer to write"
        ],
        "correct": 0,
        "explanation": "Documentation that's exercised regularly (running the commands) tends to stay accurate; documentation that's only read tends to rot."
      }
    ]
  },
  {
    "id": "cache-mq",
    "num": 23,
    "phase": 17,
    "title": "Redis & Caching",
    "sub": "Redis as an in-memory cache in front of a slow database: what to cache, how to invalidate it correctly, and the failure modes — stampedes, staleness — that make caching harder than it looks.",
    "learnMore": {
      "label": "Redis Documentation",
      "url": "https://redis.io/docs/latest/"
    },
    "subtopics": [
      {
        "title": "Redis Caching",
        "concepts": [
          "Redis is an in-memory key-value store — reads that would hit a slow DB query instead hit memory, often 100x+ faster.",
          "@Cacheable annotates a Spring method so its result is cached automatically on first call and served from cache afterward; @CacheEvict clears it when the underlying data changes.",
          "A TTL (time-to-live) on cached entries bounds how stale data can get without you having to manually invalidate everything.",
          "Cache invalidation is famously hard: write-through (update cache on every write) keeps it fresh but adds write latency; a cache stampede happens when many requests miss the cache at once and all hammer the DB simultaneously."
        ],
        "checklist": [
          "Redis Basics (Key-Value Store)",
          "@Cacheable & @CacheEvict",
          "TTL & Expiration",
          "Cache Stampede & Coalescing"
        ],
        "q": [
          {
            "t": "Cache a slow DB read endpoint with @Cacheable + TTL",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Implement cache invalidation on update with @CacheEvict (write-through)",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Handle a cache stampede with locking or request coalescing",
            "d": "H",
            "p": "Build task"
          }
        ]
      }
    ],
    "mini": {
      "title": "Checkpoint Project — Cached Product Catalog",
      "desc": "Add Redis caching (cache-aside, TTL, and an explicit invalidation strategy) in front of the E-Commerce Backend's product catalog reads, with before/after latency numbers."
    },
    "quiz": [
      {
        "q": "What problem does Redis caching primarily solve?",
        "options": [
          "Skipping a slow database round-trip for frequently-read data",
          "Guaranteeing data is never lost",
          "Replacing the need for a database entirely",
          "Encrypting data at rest"
        ],
        "correct": 0,
        "explanation": "Keeping hot data in memory avoids repeatedly hitting a slower disk-backed database for the same reads."
      },
      {
        "q": "What is a cache stampede?",
        "options": [
          "Many requests miss the cache at once and all hit the database simultaneously",
          "The cache growing too large and crashing",
          "A cache key colliding with another key",
          "The database overwriting cached data"
        ],
        "correct": 0,
        "explanation": "A stampede happens when a popular cache entry expires and a flood of requests all race to recompute it at once — locking/coalescing prevents it."
      },
      {
        "q": "What does a TTL (time-to-live) on a Redis-cached entry control?",
        "options": [
          "How long an entry can go without being refreshed before it's treated as stale and expired",
          "The maximum number of keys Redis can hold",
          "How many replicas Redis keeps of the entry",
          "The encryption strength of the cached value"
        ],
        "correct": 0,
        "explanation": "A TTL bounds how stale cached data can get without requiring you to manually invalidate every entry."
      },
      {
        "q": "What is the main trade-off of a write-through cache strategy?",
        "options": [
          "Every write goes to both cache and database, adding write latency for read consistency",
          "It never needs invalidation",
          "It only works with NoSQL",
          "It removes the need for a database"
        ],
        "correct": 0,
        "explanation": "Write-through keeps cache and DB in sync at write time, at the cost of slower writes compared to write-behind."
      },
      {
        "q": "What does @CacheEvict do in a Spring application?",
        "options": [
          "Removes a cached entry so the next call re-fetches and re-caches fresh data",
          "Adds a new entry to the cache",
          "Increases a cached entry's TTL",
          "Disables caching globally"
        ],
        "correct": 0,
        "explanation": "@CacheEvict clears a cache entry when the underlying data changes, so a stale value isn't served after a write."
      }
    ]
  },
  {
    "id": "messaging-kafka",
    "num": 24,
    "phase": 18,
    "title": "Messaging & Kafka",
    "sub": "Decouple services with an event log instead of direct calls — producers, partitions, consumer groups, and what happens when a message can't be processed.",
    "learnMore": {
      "label": "Apache Kafka Documentation",
      "url": "https://kafka.apache.org/documentation/"
    },
    "subtopics": [
      {
        "title": "Message Queues (pick Kafka or RabbitMQ)",
        "concepts": [
          "A queue decouples producer from consumer in time — the producer doesn't wait for the consumer to be ready or fast, it just publishes and moves on.",
          "This buys resilience (a slow/down consumer doesn't block the producer) at the cost of eventual, not immediate, consistency.",
          "At-least-once delivery may redeliver a message after a failure (so consumers must be idempotent); exactly-once is much harder to guarantee and usually means at-least-once plus deduplication on the consumer side.",
          "A dead-letter queue catches messages that repeatedly fail processing, so one poison message can't block or crash the whole consumer."
        ],
        "checklist": [
          "Producer/Consumer Pattern",
          "Kafka vs RabbitMQ Basics",
          "At-Least-Once vs Exactly-Once Delivery",
          "Dead-Letter Queues"
        ],
        "q": [
          {
            "t": "Publish and consume a simple event (OrderPlaced)",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Design an async email-notification consumer decoupled from the API",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Make a consumer idempotent so redelivered (at-least-once) messages don't double-process",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Implement a dead-letter queue for failed message processing",
            "d": "H",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Kafka — Producers, Consumers & Topics",
        "concepts": [
          "A Kafka topic is an append-only log split into partitions — a producer writes messages to a partition (by key, or round-robin), and each message gets a permanent, ordered offset within that partition.",
          "A consumer group lets multiple consumer instances split a topic's partitions between them for parallel processing — Kafka guarantees each partition is read by only one consumer within a group at a time, which is where ordering guarantees come from (per-partition, not per-topic).",
          "Kafka only guarantees order WITHIN a partition, not across partitions — if you need related events processed in order (e.g. all events for one user), they must share the same partition key."
        ],
        "learnMore": {
          "label": "Apache Kafka — Introduction",
          "url": "https://kafka.apache.org/documentation/#gettingStarted"
        },
        "checklist": [
          "Topics & Partitions",
          "Producers & Partition Keys",
          "Consumer Groups & Offsets",
          "Ordering Guarantees"
        ],
        "q": [
          {
            "t": "Produce messages with the same key to a 3-partition topic and verify they all land in the same partition",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Run two consumer instances in the same consumer group against a topic and observe how partitions are split between them",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Explain why ordering across two different users' events isn't guaranteed, but ordering within one user's events is (given a good partition key)",
            "d": "M",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Retries, Dead-Letter Queues & Event-Driven Architecture",
        "concepts": [
          "At-least-once delivery (Kafka's default) means a consumer can see the same message more than once after a retry — the consumer's processing logic must be idempotent (safe to run twice), or duplicate messages cause duplicate side effects.",
          "A dead-letter queue (DLQ) catches messages a consumer repeatedly fails to process, instead of blocking the whole partition retrying forever or silently dropping the message — someone (a human or a separate process) can inspect the DLQ later.",
          "Event-driven architecture means services react to events published by other services instead of calling each other directly — this decouples services (the publisher doesn't need to know who's listening) at the cost of harder-to-trace, eventually-consistent flows."
        ],
        "learnMore": {
          "label": "Confluent — Kafka Consumer Design",
          "url": "https://docs.confluent.io/kafka/design/consumer-design.html"
        },
        "checklist": [
          "At-Least-Once Delivery & Idempotent Consumers",
          "Retry Strategies",
          "Dead-Letter Queues",
          "Event-Driven Architecture Trade-offs"
        ],
        "q": [
          {
            "t": "Make a consumer idempotent by tracking processed message ids, then simulate a duplicate delivery and confirm no duplicate side effect",
            "d": "H",
            "p": "Build task"
          },
          {
            "t": "Route a message to a dead-letter topic after 3 failed processing attempts",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Design an event-driven order flow (OrderPlaced → InventoryReserved → PaymentCharged) and identify what happens if one step fails partway",
            "d": "H",
            "p": "Build task"
          }
        ]
      }
    ],
    "mini": {
      "title": "Checkpoint Project — Order Events Pipeline",
      "desc": "Orders published as Kafka events on a keyed topic, consumed idempotently by a separate service to update inventory, with a dead-letter topic for messages that fail processing after 3 retries."
    },
    "quiz": [
      {
        "q": "What is a key trade-off of event-driven architecture (services reacting to published events) compared to calling each other directly?",
        "options": [
          "Better decoupling between services, at the cost of harder-to-trace, eventually-consistent flows",
          "It eliminates the need for any error handling",
          "It guarantees every service stays perfectly in sync instantly",
          "It removes the need for a message broker"
        ],
        "correct": 0,
        "explanation": "The publisher doesn't need to know who's listening, but that decoupling makes the overall flow harder to trace and only eventually consistent."
      },
      {
        "q": "What determines which partition a Kafka producer writes a message to?",
        "options": [
          "The message key (same key → same partition), or round-robin if no key is given",
          "The message's size in bytes",
          "The consumer group reading it",
          "A random number every time, regardless of key"
        ],
        "correct": 0,
        "explanation": "Using a consistent key is how you get ordering guarantees for related messages — they always land in the same partition."
      },
      {
        "q": "What does a consumer group let multiple consumer instances do?",
        "options": [
          "Split a topic's partitions between them for parallel processing, with each partition read by only one member at a time",
          "Read every message twice for redundancy",
          "Automatically merge into a single consumer",
          "Skip messages they don't recognize"
        ],
        "correct": 0,
        "explanation": "Kafka guarantees one partition is consumed by only one instance within a group at a time — this is the source of per-partition ordering."
      },
      {
        "q": "Why must a Kafka consumer be idempotent under at-least-once delivery?",
        "options": [
          "The same message can be delivered more than once after a retry, so processing it twice must be safe",
          "Kafka guarantees exactly-once delivery by default",
          "Idempotency is only relevant for producers",
          "Consumers never see duplicate messages"
        ],
        "correct": 0,
        "explanation": "At-least-once is Kafka's default — without idempotent processing, a redelivered message causes duplicate side effects (e.g. double-charging)."
      },
      {
        "q": "What is a dead-letter queue (DLQ) for?",
        "options": [
          "Catching messages a consumer repeatedly fails to process, instead of blocking the partition or silently dropping them",
          "Storing successfully processed messages permanently",
          "Encrypting sensitive message payloads",
          "Load-balancing between producers"
        ],
        "correct": 0,
        "explanation": "A DLQ lets a human or a separate process inspect messages that couldn't be processed, without stalling the rest of the partition."
      }
    ]
  },
  {
    "id": "docker",
    "num": 25,
    "phase": 19,
    "title": "Docker & Containers",
    "sub": "Package a Spring Boot app into a reproducible, portable image with a multi-stage Dockerfile, then compose it with a database and cache into a one-command local stack — the same environment from your laptop to production.",
    "learnMore": {
      "label": "Docker — Get Started",
      "url": "https://docs.docker.com/get-started/"
    },
    "subtopics": [
      {
        "title": "Dockerfile Fundamentals",
        "concepts": [
          "A Dockerfile is a recipe for a reproducible image — every environment (your laptop, CI, production) runs the exact same bytes.",
          "Multi-stage builds compile in one stage (with the full JDK) and copy only the final artifact into a slim runtime stage — dramatically smaller final images.",
          "Bake config out, not in: pass environment-specific values via environment variables at runtime, don't hardcode them into the image."
        ],
        "checklist": [
          "Dockerfile Basics (FROM/COPY/RUN/CMD)",
          "Multi-Stage Builds",
          "Image Size Optimization",
          "Environment Variables in Containers"
        ],
        "q": [
          {
            "t": "Pass environment-specific config into a container at runtime",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Write a multi-stage Dockerfile for a Spring Boot app",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Reduce a Java image size using a slim/distroless base",
            "d": "M",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "docker-compose & Networking",
        "concepts": [
          "docker-compose describes a multi-container app (API + DB + cache) as one YAML file, started with a single command.",
          "A named volume persists data outside the container's writable layer — without one, a container restart wipes your database.",
          "Containers on the same compose network can reach each other by service name; containers on different networks are isolated by default — a common source of \"why can't these talk?\" bugs."
        ],
        "checklist": [
          "docker-compose Basics",
          "Named Volumes",
          "Container Networking"
        ],
        "q": [
          {
            "t": "Set up a named volume so DB data survives container restarts",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Compose an app + PostgreSQL + Redis stack with one command",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Debug why two containers on different networks can't talk",
            "d": "M",
            "p": "Build task"
          }
        ]
      }
    ],
    "mini": {
      "title": "Checkpoint Project — Fully Containerized Stack",
      "desc": "Package the E-Commerce Backend (API + PostgreSQL + Redis + Kafka) into a single docker-compose stack that starts with one command."
    },
    "quiz": [
      {
        "q": "What problem does Docker primarily solve?",
        "options": [
          "\"Works on my machine\" — packaging an app with its exact runtime environment",
          "Automatically writing your application code",
          "Replacing version control",
          "Guaranteeing zero downtime deployments"
        ],
        "correct": 0,
        "explanation": "A container bundles the app, its dependencies, and OS-level config into one portable, reproducible unit."
      },
      {
        "q": "What is the difference between a Docker image and a container?",
        "options": [
          "An image is a read-only template; a container is a running instance of it",
          "They are the same thing with different names",
          "An image can only run once",
          "A container is stored in the Docker Hub, an image is not"
        ],
        "correct": 0,
        "explanation": "You can start many containers from the same image, each an isolated running instance."
      },
      {
        "q": "What does docker-compose let you do that a single Dockerfile doesn't?",
        "options": [
          "Define and run multiple linked containers (app, DB, cache) together",
          "Build smaller images",
          "Skip writing a Dockerfile entirely",
          "Automatically scale to multiple servers"
        ],
        "correct": 0,
        "explanation": "Compose orchestrates multiple services with shared networking/volumes from one YAML file — useful for local dev stacks."
      },
      {
        "q": "Why use a multi-stage Dockerfile build?",
        "options": [
          "To keep the final image small by excluding build-only tools/dependencies",
          "To run tests automatically",
          "To support multiple programming languages in one container",
          "To enable horizontal scaling"
        ],
        "correct": 0,
        "explanation": "A multi-stage build compiles in one stage and copies only the needed artifacts into a lean final image."
      },
      {
        "q": "What does a Docker volume provide that the container's own filesystem doesn't?",
        "options": [
          "Data that persists beyond the container's lifecycle",
          "Faster CPU performance",
          "Network isolation",
          "Automatic image versioning"
        ],
        "correct": 0,
        "explanation": "A container's filesystem is ephemeral by default — a volume is how you persist data like a database's files."
      }
    ]
  },
  {
    "id": "cicd",
    "num": 26,
    "phase": 20,
    "title": "CI/CD",
    "sub": "GitHub Actions, deployment strategy, environment configs, and real observability — not just a health check.",
    "learnMore": {
      "label": "GitHub Actions Documentation",
      "url": "https://docs.github.com/en/actions"
    },
    "subtopics": [
      {
        "title": "GitHub Actions",
        "concepts": [
          "A workflow is triggered by an event (push, PR) and runs a sequence of jobs/steps in a fresh, disposable runner — nothing persists between runs unless you cache it explicitly.",
          "Running tests on every PR is the cheapest, highest-leverage CI check you can add — it catches regressions before they reach main.",
          "A matrix build runs the same job across multiple configurations (Java versions, OSes) in parallel, catching compatibility issues a single-version build would miss."
        ],
        "checklist": [
          "Workflow Triggers & Events",
          "Jobs & Steps",
          "Matrix Builds"
        ],
        "q": [
          {
            "t": "Write a workflow that runs tests on every PR",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Add a build-and-push-to-registry job on merge to main",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Set up a matrix build across two Java versions",
            "d": "M",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Deployment & Monitoring",
        "concepts": [
          "A /health endpoint is the minimum contract a deploy pipeline (or load balancer) needs to know if an instance is actually serving traffic.",
          "Structured logging (JSON, consistent fields) is what makes logs searchable/alertable at scale — plain text logs don't scale past one developer tailing a file.",
          "Zero-downtime deploys route traffic away from an instance before restarting it, and back only once it's healthy — the alternative is a visible blip on every deploy."
        ],
        "checklist": [
          "Health Check Endpoints",
          "Structured Logging",
          "Zero-Downtime Deployment"
        ],
        "q": [
          {
            "t": "Add structured logging and a /health endpoint",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Deploy a container to a VM with a zero-downtime restart script",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Set up a basic alert for high error rate or downtime",
            "d": "H",
            "p": "Build task"
          }
        ]
      }
    ],
    "mini": {
      "title": "Combined Project — Auto-Deployed Stack",
      "desc": "Full CI/CD: push to main → tests run → image built → deployed to your chosen cloud VM automatically, with Actuator + Prometheus/Grafana observability."
    },
    "quiz": [
      {
        "q": "What does Continuous Integration (CI) primarily ensure?",
        "options": [
          "Every code change is automatically built and tested before merging",
          "Code is deployed to production automatically on every commit",
          "All developers work on the same branch",
          "Tests are written after the feature ships"
        ],
        "correct": 0,
        "explanation": "CI catches integration problems early by running the build/test suite on every push, not deployment itself."
      },
      {
        "q": "What is the difference between Continuous Delivery and Continuous Deployment?",
        "options": [
          "Delivery keeps every change release-ready but requires a manual trigger; Deployment ships automatically",
          "They are identical concepts",
          "Delivery only applies to mobile apps",
          "Deployment never runs tests first"
        ],
        "correct": 0,
        "explanation": "Continuous Deployment removes the manual approval gate that Continuous Delivery still keeps."
      },
      {
        "q": "What does a health check endpoint (like Spring Boot Actuator's /health) enable?",
        "options": [
          "Automated systems can detect if an instance is unhealthy and stop routing traffic to it",
          "It replaces the need for logging",
          "It automatically fixes bugs",
          "It encrypts application traffic"
        ],
        "correct": 0,
        "explanation": "Load balancers and orchestrators poll health endpoints to decide whether an instance should receive traffic."
      },
      {
        "q": "Why version-tag Docker images (e.g. app:1.4.2) instead of always using \"latest\"?",
        "options": [
          "Reproducible deployments and safe rollbacks to a known-good version",
          "Tagged images run faster",
          "Docker requires a version tag to build at all",
          "It reduces image size"
        ],
        "correct": 0,
        "explanation": "With \"latest\" you can't reliably roll back — you don't know what was actually running."
      },
      {
        "q": "What is the purpose of a rollback strategy in a deployment pipeline?",
        "options": [
          "Quickly redeploy a known-good previous version if the new one breaks in production",
          "Automatically fix bugs in the new version",
          "Prevent all deployments from failing",
          "Replace manual testing entirely"
        ],
        "correct": 0,
        "explanation": "A fast, tested rollback path turns a bad deploy into a brief incident instead of an extended outage."
      }
    ]
  },
  {
    "id": "cloud",
    "num": 27,
    "phase": 21,
    "title": "Cloud",
    "sub": "Take one project to real cloud infrastructure: compute from a raw VM to managed platforms, object storage, a managed database, and the network security — VPCs, security groups — that keeps it from being wide open to the internet.",
    "learnMore": {
      "label": "AWS Cloud Practitioner Essentials",
      "url": "https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/"
    },
    "subtopics": [
      {
        "title": "Compute & Storage",
        "concepts": [
          "A VM gives full OS control but you own patching/scaling; managed compute (App Service, ECS) trades some control for far less operational overhead.",
          "Object storage (Blob/S3) is built for large, unstructured files (uploads, backups) — not a substitute for a database's querying ability.",
          "Autoscaling reacts to a metric (CPU, request count) to add/remove instances automatically — the cloud-native answer to \"what if traffic spikes?\""
        ],
        "checklist": [
          "Virtual Machines vs Managed Compute",
          "Object Storage (S3/Blob)",
          "Autoscaling"
        ],
        "q": [
          {
            "t": "Deploy a Spring Boot app to a fresh Azure VM from scratch",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Set up object storage (Azure Blob/S3) for file uploads",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Configure autoscaling rules for a compute instance group",
            "d": "H",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Managed Databases & Networking",
        "concepts": [
          "A managed database (RDS, Azure Database for PostgreSQL) hands off backups, patching, and failover to the cloud provider — usually worth the extra cost over self-hosting.",
          "A VPC/VNet is your own isolated network inside the cloud — public subnets face the internet, private subnets (like your database) shouldn't.",
          "A security group/firewall is a whitelist: only open the exact ports something legitimately needs (443, your app port, DB port from the app only) — never \"allow all\" in production."
        ],
        "checklist": [
          "Managed Database Services (RDS)",
          "VPC/VNet Basics",
          "Security Groups & Firewalls"
        ],
        "q": [
          {
            "t": "Configure a firewall/security group to only allow needed ports",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Migrate a local PostgreSQL DB to a managed cloud DB instance",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Set up a VPC/VNet with public and private subnets",
            "d": "H",
            "p": "Build task"
          }
        ]
      }
    ],
    "mini": {
      "title": "Checkpoint Project — Cloud-Native Redeploy",
      "desc": "Re-architect one of your deployments using a managed DB + blob storage + proper network security groups."
    },
    "quiz": [
      {
        "q": "What is a key benefit of a managed database service (e.g. RDS, Cloud SQL) over self-hosting Postgres on a VM?",
        "options": [
          "The provider handles backups, patching, and failover for you",
          "It is always free",
          "It removes the need for indexes",
          "It guarantees zero latency"
        ],
        "correct": 0,
        "explanation": "Managed services trade some control for offloading operational burden like backups, patching, and HA setup."
      },
      {
        "q": "What does a VPC (Virtual Private Cloud) provide?",
        "options": [
          "An isolated, private network boundary for your cloud resources",
          "A content delivery network",
          "A managed database",
          "A CI/CD pipeline"
        ],
        "correct": 0,
        "explanation": "A VPC lets you control exactly which resources can reach each other and the public internet."
      },
      {
        "q": "What is the purpose of a security group in cloud networking?",
        "options": [
          "A virtual firewall controlling inbound/outbound traffic for specific resources",
          "A group of users with admin access",
          "A backup schedule configuration",
          "A DNS routing rule"
        ],
        "correct": 0,
        "explanation": "Security groups define exactly which ports/sources are allowed to reach a given instance or service."
      },
      {
        "q": "Why use object/blob storage (e.g. S3) instead of storing files on a server's local disk?",
        "options": [
          "Durability and scalability independent of any single server's lifecycle",
          "It's always faster than local disk",
          "It requires no access control",
          "Local disk storage is deprecated"
        ],
        "correct": 0,
        "explanation": "A server can be replaced or scaled without losing files, since the storage lives outside the compute instance itself."
      },
      {
        "q": "What is the principle of least privilege in cloud IAM?",
        "options": [
          "Grant only the permissions a resource/user actually needs, nothing more",
          "Grant admin access to every service by default",
          "Disable all permissions until a support ticket is filed",
          "Only apply to production environments"
        ],
        "correct": 0,
        "explanation": "Minimizing granted permissions limits the damage if credentials are ever compromised."
      }
    ]
  },
  {
    "id": "lld-design-patterns",
    "num": 28,
    "phase": 22,
    "title": "LLD & Design Patterns",
    "sub": "The trade-off-driven design discussion SOLID and the Gang-of-Four patterns are actually for — earned now that you've felt a bad design cause real pain on a real project, not memorized as a list of names.",
    "learnMore": {
      "label": "GeeksforGeeks — SOLID Principles",
      "url": "https://www.geeksforgeeks.org/system-design/solid-principle-in-programming-understand-with-real-life-examples/"
    },
    "subtopics": [
      {
        "title": "Liskov, Interface Segregation & Dependency Inversion",
        "concepts": [
          "Liskov Substitution: a subclass must be usable anywhere its parent is expected, without surprising callers — no silently narrowing behavior or throwing where the parent wouldn't.",
          "Interface Segregation: many small, focused interfaces beat one fat interface that forces implementers to stub out methods they don't need.",
          "Dependency Inversion: depend on abstractions (interfaces), not concrete classes — high-level policy shouldn't know about low-level implementation details."
        ],
        "checklist": [
          "Liskov Substitution Principle",
          "Interface Segregation Principle",
          "Dependency Inversion Principle"
        ],
        "q": [
          {
            "t": "Split a fat \"Worker\" interface into role-based interfaces",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Fix a Rectangle/Square inheritance that breaks LSP",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Invert a hard dependency on a concrete MySQL class",
            "d": "M",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "DRY, KISS & YAGNI",
        "concepts": [
          "DRY (Don't Repeat Yourself): every piece of knowledge should have one authoritative representation — duplicated logic means a rule change has to happen in multiple places, and they will eventually drift out of sync.",
          "KISS (Keep It Simple): the simplest design that actually solves the problem is usually the right one — cleverness that isn't earned by a real requirement is a maintenance cost, not a feature.",
          "YAGNI (You Aren't Gonna Need It): don't build the flexible, general version of something until a second real use case shows up — speculative abstraction is often wasted work that also makes the code harder to read."
        ],
        "learnMore": {
          "label": "GeeksforGeeks — Software Design Principles",
          "url": "https://www.geeksforgeeks.org/software-engineering/an-introduction-to-software-development-design-principles/"
        },
        "checklist": [
          "DRY — Don't Repeat Yourself",
          "KISS — Keep It Simple",
          "YAGNI — You Aren't Gonna Need It",
          "Recognizing Premature Abstraction"
        ],
        "q": [
          {
            "t": "Find and eliminate 3 instances of duplicated business logic in a given codebase (DRY)",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Simplify an over-engineered class using 3 layers of indirection for something a single method could do (KISS)",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Identify and remove a speculative 'plugin system' built for a requirement that never materialized (YAGNI)",
            "d": "M",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Creational Design Patterns",
        "concepts": [
          "Creational patterns control how objects get created, hiding the concrete class being instantiated behind a more flexible interface.",
          "Singleton guarantees exactly one instance exists; Factory Method lets a subclass decide which concrete class to instantiate; Abstract Factory creates whole families of related objects without specifying their concrete classes.",
          "Builder separates constructing a complex object from its final representation — useful when a constructor would otherwise need many optional parameters; Prototype creates new objects by cloning an existing instance instead of building from scratch."
        ],
        "learnMore": {
          "label": "GeeksforGeeks — Creational Design Patterns",
          "url": "https://www.geeksforgeeks.org/system-design/creational-design-pattern/"
        },
        "checklist": [
          "Singleton",
          "Factory Method",
          "Abstract Factory",
          "Builder",
          "Prototype"
        ],
        "q": [
          {
            "t": "Build a Factory Method for creating different Shape objects from a type string",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Implement a thread-safe Singleton (double-checked locking)",
            "d": "M",
            "p": "GeeksforGeeks",
            "u": "https://www.geeksforgeeks.org/?s=double%20checked%20locking%20singleton%20java"
          },
          {
            "t": "Design an Abstract Factory that produces matching UI component families (dark/light theme buttons + dialogs)",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Implement a Builder pattern for constructing a complex Pizza object with optional toppings",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Implement Prototype to clone a complex Document object (with nested sections) instead of rebuilding it",
            "d": "M",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Structural Design Patterns",
        "concepts": [
          "Structural patterns compose classes and objects into larger structures while keeping them flexible — most solve \"how do I make these two incompatible things work together\" problems.",
          "Adapter converts one interface into another a client expects; Facade provides one simple interface over a complicated subsystem; Decorator adds behavior to an object dynamically without subclassing.",
          "Proxy controls access to another object (lazy loading, access control, logging); Composite lets you treat a group of objects and a single object uniformly (a file and a folder); Bridge separates an abstraction from its implementation so both can vary independently."
        ],
        "learnMore": {
          "label": "GeeksforGeeks — Structural Design Patterns",
          "url": "https://www.geeksforgeeks.org/system-design/structural-design-patterns/"
        },
        "checklist": [
          "Adapter",
          "Facade",
          "Decorator",
          "Proxy",
          "Composite",
          "Bridge"
        ],
        "q": [
          {
            "t": "Wrap a legacy PaymentGateway class with an Adapter to match a new PaymentProcessor interface",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Design a Facade over three subsystems (Inventory, Billing, Shipping) for a single checkout() call",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Add logging/caching to a Service using the Decorator pattern without modifying the original class",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Build a Proxy that lazy-loads an expensive Image object only when it's actually displayed",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Model a file system (File and Folder) using Composite so both can be treated uniformly",
            "d": "M",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Behavioral Design Patterns",
        "concepts": [
          "Behavioral patterns manage how objects communicate and distribute responsibility — the largest GoF category, since \"how should these parts talk to each other\" is where most design flexibility actually lives.",
          "Strategy swaps an algorithm at runtime behind a common interface; Observer notifies dependents automatically when something changes; State lets an object change its behavior when its internal state changes, without a giant if/else.",
          "Command turns a request into a standalone object (enabling undo/redo and queuing); Template Method defines an algorithm's skeleton in a base class and lets subclasses override specific steps; Chain of Responsibility passes a request along a chain of handlers until one handles it."
        ],
        "learnMore": {
          "label": "GeeksforGeeks — Behavioral Design Patterns",
          "url": "https://www.geeksforgeeks.org/system-design/behavioral-design-patterns/"
        },
        "checklist": [
          "Strategy",
          "Observer",
          "State",
          "Command",
          "Template Method",
          "Chain of Responsibility"
        ],
        "q": [
          {
            "t": "Build a payment method Strategy pattern (Card/UPI/Wallet)",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Design an event notification system using Observer",
            "d": "H",
            "p": "Build task"
          },
          {
            "t": "Model an order status (or traffic light) using the State pattern instead of a big switch statement",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Implement Command to support undo/redo on a text editor's operations",
            "d": "H",
            "p": "Build task"
          },
          {
            "t": "Use Template Method to define a common data-import skeleton (open, parse, validate, save) with format-specific subclasses",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Implement Chain of Responsibility for a support-ticket escalation system (L1 → L2 → Manager)",
            "d": "M",
            "p": "Build task"
          }
        ]
      }
    ],
    "mini": {
      "title": "Checkpoint Project — Pluggable Notification Engine",
      "desc": "A notification system (Email/SMS/Push) built using a Factory + Strategy + Observer combination: add a new channel without touching existing classes, documented with the Problem → Poor Design → Principle → Pattern → Trade-offs reasoning for each pattern used."
    },
    "quiz": [
      {
        "q": "Which principle does violating the Liskov Substitution Principle look like?",
        "options": [
          "A subclass that breaks behavior callers expect from the base class",
          "A subclass with more public methods than its parent",
          "A class implementing too many interfaces",
          "A method with too many parameters"
        ],
        "correct": 0,
        "explanation": "LSP means a subtype must be substitutable for its base type without breaking correctness — e.g. a Square extending Rectangle that breaks setWidth/setHeight independence."
      },
      {
        "q": "What problem does the Strategy pattern solve?",
        "options": [
          "Swapping an algorithm at runtime behind a common interface",
          "Guaranteeing only one instance of a class exists",
          "Converting one interface into another",
          "Notifying dependents when something changes"
        ],
        "correct": 0,
        "explanation": "Strategy lets you plug in different algorithms (e.g. payment methods) without an if/else chain, and swap them at runtime."
      },
      {
        "q": "What is the \"Poor Design → Principle → Pattern → Trade-offs\" framing meant to prevent?",
        "options": [
          "Memorizing pattern names without understanding the real problem each one solves",
          "Ever using more than one pattern in a project",
          "Writing any design documentation",
          "Using inheritance at all"
        ],
        "correct": 0,
        "explanation": "A pattern applied without understanding what design smell it fixes usually adds complexity without earning it — trade-offs matter as much as the pattern itself."
      },
      {
        "q": "When would YAGNI argue against building a flexible plugin system right now?",
        "options": [
          "When there's only one real use case so far, and the second one is speculative",
          "Whenever performance is a concern",
          "Never — flexibility is always worth building in advance",
          "Only in small codebases"
        ],
        "correct": 0,
        "explanation": "YAGNI says don't build the general, flexible version until a second real use case actually shows up — speculative abstraction is often wasted, harder-to-read work."
      },
      {
        "q": "What does the Observer pattern let you do?",
        "options": [
          "Automatically notify dependents when an object's state changes",
          "Convert an object into a different interface",
          "Guarantee a single instance",
          "Undo/redo a sequence of operations"
        ],
        "correct": 0,
        "explanation": "Observer decouples a subject from the (possibly many) dependents that need to react when it changes."
      }
    ]
  },
  {
    "id": "hld-distributed-systems",
    "num": 29,
    "phase": 23,
    "title": "HLD & Distributed Systems",
    "sub": "Zoom out from one service to a system that survives real traffic: capacity estimation, replication, sharding, CAP, and the resilience patterns (circuit breakers, idempotency, CDNs) that keep it up when parts of it fail.",
    "learnMore": {
      "label": "The System Design Primer",
      "url": "https://github.com/donnemartin/system-design-primer"
    },
    "subtopics": [
      {
        "title": "Scalability Concepts",
        "concepts": [
          "Vertical scaling (bigger machine) is simple but hits a ceiling and a single point of failure; horizontal scaling (more machines) has no hard ceiling but needs the app to be stateless.",
          "Estimate before you design: back-of-envelope numbers (requests/sec, storage/day) tell you whether a problem needs a single server or a distributed system.",
          "A rate limiter protects a system from being overwhelmed — token bucket allows controlled bursts, sliding window is stricter and smoother over time."
        ],
        "checklist": [
          "Vertical vs Horizontal Scaling",
          "Back-of-Envelope Estimation",
          "Rate Limiting (Token Bucket / Sliding Window)"
        ],
        "q": [
          {
            "t": "Explain vertical vs horizontal scaling with a real scenario",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Design a URL shortener (traffic estimate, schema, scaling)",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Design a rate limiter (token bucket vs sliding window)",
            "d": "H",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Capacity Estimation, Replication & Sharding",
        "concepts": [
          "Capacity estimation turns a vague requirement (\"support our users\") into numbers (requests/sec, storage/day, bandwidth) you can actually design against — a back-of-envelope estimate that's roughly right beats no estimate at all.",
          "Replication copies data across multiple database nodes for read scaling and failover — a primary handles writes, replicas serve reads and can be promoted if the primary fails, at the cost of eventual (not instant) consistency between them.",
          "Sharding splits one logical dataset across multiple physical databases by a key (e.g. user id) when a single machine can't hold or serve all the data — the hard part is choosing a shard key that distributes load evenly and doesn't force cross-shard queries for common operations."
        ],
        "learnMore": {
          "label": "The System Design Primer — Replication",
          "url": "https://github.com/donnemartin/system-design-primer#replication"
        },
        "checklist": [
          "Back-of-Envelope Capacity Estimation",
          "Primary-Replica Replication",
          "Sharding & Shard Key Selection",
          "Disaster Recovery Basics"
        ],
        "q": [
          {
            "t": "Estimate requests/sec and storage/day for a URL shortener with 10M daily active users, showing your math",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Design a sharding scheme for a multi-tenant SaaS database, choosing and justifying a shard key",
            "d": "H",
            "p": "Build task"
          },
          {
            "t": "Explain the trade-off between synchronous and asynchronous replication for a payments database",
            "d": "M",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Resilience & Distributed Systems Concepts",
        "concepts": [
          "CAP theorem: a distributed system can only fully guarantee two of Consistency, Availability, and Partition tolerance at once — since network partitions are a fact of life, the real choice in practice is CP vs AP.",
          "A circuit breaker (Resilience4j) stops calling a failing downstream service after enough failures, failing fast instead of piling up timeouts — it \"trips open,\" then periodically tests if the service has recovered.",
          "Idempotency in distributed systems means a request can be safely retried without duplicating its effect — critical for payment/order APIs where a network retry must not double-charge a customer.",
          "A CDN caches static content at edge locations close to users, cutting latency and origin server load — the first line of defense for anything that doesn't change per-request."
        ],
        "learnMore": {
          "label": "The System Design Primer",
          "url": "https://github.com/donnemartin/system-design-primer"
        },
        "checklist": [
          "CAP Theorem",
          "Circuit Breakers",
          "Idempotency Keys",
          "CDNs"
        ],
        "q": [
          {
            "t": "Explain CAP theorem with a concrete example of choosing CP vs AP for a given system",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Implement a circuit breaker around a flaky external API call using Resilience4j",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Design an idempotency-key mechanism so a retried payment request never double-charges",
            "d": "H",
            "p": "Build task"
          }
        ]
      }
    ],
    "mini": {
      "title": "Checkpoint Project — System Design Portfolio",
      "desc": "Three written design docs (URL shortener, rate limiter, notification fan-out) each including a capacity estimate, a replication/sharding decision with justification, and a stated CAP trade-off — with one actually deployed on real cloud infrastructure."
    },
    "quiz": [
      {
        "q": "What does the CAP theorem state?",
        "options": [
          "A distributed system can guarantee at most two of Consistency, Availability, and Partition tolerance at once",
          "A system must always choose Consistency over Availability",
          "CAP only applies to relational databases",
          "CAP theorem is about caching strategies"
        ],
        "correct": 0,
        "explanation": "Since network partitions are unavoidable in practice, the real-world choice is usually between consistency and availability during a partition."
      },
      {
        "q": "Why estimate capacity (requests/sec, storage/day) before designing a system?",
        "options": [
          "It tells you whether the problem needs a single server or a distributed system at all",
          "It is required by every interview rubric with no practical value",
          "It replaces the need for a database schema",
          "It only matters for mobile applications"
        ],
        "correct": 0,
        "explanation": "A back-of-envelope estimate that's roughly right is far more useful than designing blind, or over-engineering for a scale you'll never hit."
      },
      {
        "q": "What is the hardest part of designing a sharding scheme?",
        "options": [
          "Choosing a shard key that distributes load evenly without forcing cross-shard queries for common operations",
          "Writing the SQL to create the tables",
          "Naming the shards",
          "Sharding is never actually hard in practice"
        ],
        "correct": 0,
        "explanation": "A poorly chosen shard key can create hot shards (uneven load) or force expensive cross-shard joins for routine queries."
      },
      {
        "q": "What does a circuit breaker do when a downstream service keeps failing?",
        "options": [
          "Trips open and fails fast instead of piling up timeouts, then periodically tests if the service has recovered",
          "Automatically restarts the failing service",
          "Silently retries forever",
          "Deletes the failing service from the registry"
        ],
        "correct": 0,
        "explanation": "Failing fast prevents a cascading pile-up of slow, doomed requests against a service that's already struggling."
      },
      {
        "q": "Why is idempotency critical for a payments API specifically?",
        "options": [
          "A network retry must not double-charge a customer",
          "Payments APIs never need to be retried",
          "Idempotency only matters for GET requests",
          "It has no special relevance to payments over any other domain"
        ],
        "correct": 0,
        "explanation": "A client that times out waiting for a response and retries could otherwise trigger the charge twice — idempotency keys prevent that."
      }
    ]
  },
  {
    "id": "microservices",
    "num": 30,
    "phase": 24,
    "title": "Microservices",
    "sub": "Only after you understand a well-designed monolith: when splitting a service is actually worth the coordination cost — service discovery, distributed transactions via Saga, and circuit breakers between services.",
    "learnMore": {
      "label": "Microservices.io — Patterns",
      "url": "https://microservices.io/patterns/index.html"
    },
    "subtopics": [
      {
        "title": "Monoliths, Microservices & Gateways",
        "concepts": [
          "A monolith is simpler to build, test, and deploy at small scale; microservices trade that simplicity for independent scaling and deployment — don't default to microservices without a real reason.",
          "An API gateway is the single entry point that routes to backend services, and the natural place to centralize auth, rate limiting, and logging.",
          "Fan-out systems (notify millions of users) push work onto a queue and workers instead of doing it synchronously in the request path — the request returns fast, delivery happens in the background."
        ],
        "checklist": [
          "Monolith vs Microservices Trade-offs",
          "API Gateways",
          "Fan-Out Systems"
        ],
        "q": [
          {
            "t": "Decide monolith vs microservices for a given product spec",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Design an API gateway routing to 3 backend services",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Design a notification system for millions of users (fan-out)",
            "d": "H",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Service Discovery, Saga & Circuit Breakers",
        "concepts": [
          "Service discovery lets services find each other by name instead of hard-coded IPs/ports — as instances scale up/down or move, a registry keeps the current, correct location for each service name.",
          "A distributed transaction across multiple services can't use a single database ACID transaction — the Saga pattern instead runs a sequence of local transactions, each with a compensating action to undo it if a later step fails.",
          "A circuit breaker specifically in a microservices context stops Service A from hammering a failing Service B with requests that will just time out — it \"trips open\" after enough failures, fails fast, and periodically lets one test request through to check if B has recovered."
        ],
        "learnMore": {
          "label": "Microservices.io — Saga Pattern",
          "url": "https://microservices.io/patterns/data/saga.html"
        },
        "checklist": [
          "Service Discovery",
          "Inter-Service Communication (sync vs async)",
          "The Saga Pattern & Compensating Actions",
          "Circuit Breakers Between Services"
        ],
        "q": [
          {
            "t": "Design a Saga for an order flow spanning Order, Inventory, and Payment services, including what each compensating action undoes",
            "d": "H",
            "p": "Build task"
          },
          {
            "t": "Add a circuit breaker (Resilience4j) around a call from one service to another, and demonstrate it tripping open under repeated failures",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Explain when you'd choose synchronous (REST) vs asynchronous (event-based) communication between two services",
            "d": "M",
            "p": "Build task"
          }
        ]
      }
    ],
    "mini": {
      "title": "Checkpoint Project — Distributed Order Processing System",
      "desc": "Split your Order Management backend into Order, Inventory, and Payment services communicating via Kafka events, with a Saga coordinating the checkout flow (including compensating actions) and a circuit breaker on any synchronous call between them."
    },
    "quiz": [
      {
        "q": "What is the main trade-off of choosing microservices over a monolith?",
        "options": [
          "Independent scaling and deployment, traded for the coordination cost of a distributed system",
          "Microservices are always faster to build initially",
          "Monoliths cannot be tested",
          "Microservices remove the need for a database"
        ],
        "correct": 0,
        "explanation": "Don't default to microservices without a real reason — a monolith is simpler to build, test, and deploy at small scale."
      },
      {
        "q": "What does service discovery solve?",
        "options": [
          "Letting services find each other by name instead of hard-coded IPs/ports that change as instances scale",
          "Encrypting traffic between services",
          "Automatically writing API documentation",
          "Load testing a service"
        ],
        "correct": 0,
        "explanation": "As instances scale up/down or move, a registry keeps the current, correct location for each service name."
      },
      {
        "q": "What does the Saga pattern replace a single ACID transaction with?",
        "options": [
          "A sequence of local transactions, each with a compensating action to undo it if a later step fails",
          "A single distributed lock across all services",
          "A shared database across all services",
          "A manual rollback performed by an engineer"
        ],
        "correct": 0,
        "explanation": "A distributed transaction can't use one database's ACID guarantees across services — Saga coordinates a sequence of local transactions instead."
      },
      {
        "q": "What is an API gateway's role in a microservices architecture?",
        "options": [
          "A single entry point that routes to backend services, and a natural place to centralize auth/rate limiting/logging",
          "A database shared by all services",
          "A message queue",
          "A monitoring dashboard"
        ],
        "correct": 0,
        "explanation": "Clients talk to one gateway instead of needing to know about every backend service individually."
      },
      {
        "q": "When would you choose asynchronous (event-based) over synchronous (REST) communication between two services?",
        "options": [
          "When the caller doesn't need an immediate response and services should be decoupled from each other's availability",
          "Always — synchronous communication should never be used between services",
          "Only for read operations",
          "Asynchronous communication is not possible between microservices"
        ],
        "correct": 0,
        "explanation": "Async decouples services (the publisher doesn't need the subscriber to be up right now) at the cost of eventual consistency and harder tracing."
      }
    ]
  },
  {
    "id": "kubernetes",
    "num": 31,
    "phase": 25,
    "title": "Kubernetes & Orchestration",
    "sub": "Docker gets one container running reliably; Kubernetes is how you run, scale, and self-heal a whole fleet of them. The dominant orchestration tool in 2026 — most backend job descriptions assume it.",
    "learnMore": {
      "label": "Kubernetes — Concepts",
      "url": "https://kubernetes.io/docs/concepts/"
    },
    "subtopics": [
      {
        "title": "Core Objects",
        "concepts": [
          "A Pod is the smallest deployable unit (usually one container); a Deployment describes the desired state (how many replicas, which image) and Kubernetes continuously works to match reality to it.",
          "A Service gives a stable network identity to a set of pods that come and go — pods get recycled constantly, but the Service address doesn't change.",
          "ConfigMaps hold non-secret configuration, Secrets hold sensitive values (base64-encoded, not encrypted by default) — both get mounted into pods as env vars or files, keeping config out of the image."
        ],
        "checklist": [
          "Pods & Deployments",
          "Services & Networking",
          "ConfigMaps & Secrets",
          "ReplicaSets & Scaling"
        ],
        "q": [
          {
            "t": "Deploy a Spring Boot app to a local Kubernetes cluster (minikube/kind) with a Deployment and Service",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Move a hardcoded database URL out of the image and into a ConfigMap and Secret",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Manually scale a Deployment to 3 replicas and verify traffic is distributed across all of them",
            "d": "E",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Scaling & Operations",
        "concepts": [
          "A Horizontal Pod Autoscaler adds/removes pod replicas based on a metric (usually CPU) — the cluster-level equivalent of cloud autoscaling, but for your own pods.",
          "A rolling update replaces old pods with new ones gradually, keeping the service available throughout; a bad rollout can be rolled back to the previous version in one command.",
          "Readiness probes tell Kubernetes when a pod is ready to receive traffic; liveness probes tell it when a pod is stuck and should be restarted — get these wrong and you either send traffic to a pod that isn't ready, or kill one that's just slow."
        ],
        "learnMore": {
          "label": "Kubernetes — Pod Lifecycle",
          "url": "https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/"
        },
        "checklist": [
          "Horizontal Pod Autoscaling",
          "Rolling Updates & Rollbacks",
          "Readiness & Liveness Probes",
          "Namespaces"
        ],
        "q": [
          {
            "t": "Set up a Horizontal Pod Autoscaler that scales a Deployment based on CPU usage",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Trigger a rolling update to a new image version, then roll it back after simulating a bad deploy",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Add readiness and liveness probes to a Spring Boot Deployment using its Actuator health endpoint",
            "d": "M",
            "p": "Build task"
          }
        ]
      }
    ],
    "mini": {
      "title": "Checkpoint Project — Kubernetes Redeploy",
      "desc": "Take the docker-compose stack from the Docker topic and re-deploy it to Kubernetes with a Deployment, Service, ConfigMap, and a horizontal pod autoscaler."
    },
    "quiz": [
      {
        "q": "What is a Kubernetes Pod?",
        "options": [
          "The smallest deployable unit — one or more containers sharing network/storage",
          "A single physical server",
          "A backup of a container image",
          "A Kubernetes configuration file"
        ],
        "correct": 0,
        "explanation": "A Pod wraps one or more tightly-coupled containers that should always run together on the same node."
      },
      {
        "q": "What does a Kubernetes Service provide?",
        "options": [
          "A stable network endpoint that routes to a changing set of Pods",
          "A backup mechanism for Pods",
          "A way to build container images",
          "A CI/CD pipeline"
        ],
        "correct": 0,
        "explanation": "Pods come and go (rescheduled, scaled, restarted); a Service gives clients one stable address regardless."
      },
      {
        "q": "What does a Horizontal Pod Autoscaler do?",
        "options": [
          "Automatically adds/removes Pod replicas based on metrics like CPU usage",
          "Increases a single Pod's CPU/memory limits",
          "Balances load across multiple clusters",
          "Encrypts traffic between Pods"
        ],
        "correct": 0,
        "explanation": "HPA scales the NUMBER of pod replicas out or in — \"horizontal\" scaling — in response to observed load."
      },
      {
        "q": "What is the purpose of a ConfigMap in Kubernetes?",
        "options": [
          "Externalize configuration data from container images",
          "Store encrypted secrets",
          "Define network policies",
          "Schedule Pods onto specific nodes"
        ],
        "correct": 0,
        "explanation": "ConfigMaps let you change config without rebuilding the image — Secrets are the equivalent for sensitive values."
      },
      {
        "q": "What does a Kubernetes Deployment manage?",
        "options": [
          "Desired Pod replica count and rolling updates for a set of Pods",
          "Physical server provisioning",
          "DNS records for external domains",
          "Docker image building"
        ],
        "correct": 0,
        "explanation": "A Deployment declares the desired state (replica count, image version) and Kubernetes reconciles the actual state to match, including rolling updates."
      }
    ]
  },
  {
    "id": "nosql",
    "num": 32,
    "phase": 26,
    "title": "NoSQL Databases",
    "sub": "When relational modeling doesn't fit — document stores, key-value stores, and the trade-offs that come with giving up SQL's guarantees. Every backend role in 2026 expects you to know when NOT to reach for Postgres.",
    "learnMore": {
      "label": "MongoDB — Manual",
      "url": "https://www.mongodb.com/docs/manual/"
    },
    "subtopics": [
      {
        "title": "Document & Key-Value Stores",
        "concepts": [
          "MongoDB stores JSON-like documents (BSON) in collections instead of rows in tables — related data is often embedded in one document instead of joined across several.",
          "Schema flexibility means different documents in the same collection can have different fields — powerful for evolving data, but it pushes validation from the database into your application code.",
          "Redis isn't just a cache — as a key-value store it has real data structures (strings, hashes, lists, sets, sorted sets) that make it a legitimate primary store for specific access patterns like leaderboards or session data."
        ],
        "learnMore": {
          "label": "Redis — Data Types",
          "url": "https://redis.io/docs/latest/develop/data-types/"
        },
        "checklist": [
          "MongoDB Document Model",
          "Schema Flexibility & Schema-on-Read",
          "Redis Data Structures (beyond caching)",
          "Key-Value Store Use Cases"
        ],
        "q": [
          {
            "t": "Model a product catalog as MongoDB documents, choosing embedding vs referencing for variants and reviews",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Build a leaderboard using a Redis sorted set instead of a SQL table with ORDER BY",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Write and run 5 basic MongoDB CRUD queries (find, filter, update, aggregate)",
            "d": "E",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "SQL vs NoSQL Trade-offs",
        "concepts": [
          "CAP theorem in practice: most NoSQL stores choose availability + partition tolerance (AP) with eventual consistency, where relational databases traditionally choose consistency first.",
          "Reach for NoSQL when your data is naturally document-shaped, your schema changes often, or you need to scale horizontally past what vertical scaling and read replicas can handle — not by default.",
          "Eventual consistency means a read right after a write might not see that write yet — fine for a social media like-count, not fine for a bank balance."
        ],
        "checklist": [
          "CAP Theorem in Practice",
          "When to Choose NoSQL over SQL",
          "Eventual Consistency",
          "Denormalization in Document Stores"
        ],
        "q": [
          {
            "t": "Write a short design doc comparing a relational vs document-store schema for a social media feed",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Explain a real scenario where eventual consistency would cause a visible, user-facing bug",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Decide SQL vs NoSQL for three different given scenarios (banking, product catalog, chat messages) and justify each",
            "d": "M",
            "p": "Build task"
          }
        ]
      }
    ],
    "mini": {
      "title": "Checkpoint Project — Dual-Store Activity Feed",
      "desc": "Store user activity events in MongoDB (or a similar document store) and compare the query patterns and schema design against an equivalent relational table — same data, both approaches, side by side."
    },
    "quiz": [
      {
        "q": "What is the core design difference between a document store (MongoDB) and a relational database?",
        "options": [
          "Data is modeled around how it's read, not normalized across tables",
          "Document stores don't support indexes",
          "Relational databases can't store JSON",
          "Document stores never scale horizontally"
        ],
        "correct": 0,
        "explanation": "A document store embeds related data together for read efficiency, trading off the normalization discipline of a relational schema."
      },
      {
        "q": "What does \"eventual consistency\" mean for a NoSQL store that favors availability over strict consistency?",
        "options": [
          "A read immediately after a write might not reflect that write yet",
          "Data is never consistent, at any point",
          "Every read always returns the most recent write instantly",
          "Consistency only matters for relational databases"
        ],
        "correct": 0,
        "explanation": "Fine for a social media like-count; not fine for a bank balance — this is the trade-off eventual consistency makes explicit."
      },
      {
        "q": "When would a document store genuinely be the better fit than a relational database?",
        "options": [
          "When your data is naturally hierarchical/nested and rarely needs cross-entity joins",
          "Whenever you need strong multi-row ACID transactions",
          "Whenever your schema is highly relational",
          "Always — document stores are a strict upgrade"
        ],
        "correct": 0,
        "explanation": "Document stores shine for read-heavy, embeddable data (e.g. a user profile with nested settings) — not for heavily joined, transactional data."
      },
      {
        "q": "What is a key trade-off of denormalizing (embedding) data in a document store?",
        "options": [
          "Updates to shared data may need to touch many documents",
          "It always uses less storage than normalization",
          "It makes joins faster than SQL",
          "It removes the need for indexes"
        ],
        "correct": 0,
        "explanation": "Embedding avoids joins at read time but means the same fact can live in multiple documents, complicating updates."
      },
      {
        "q": "Per the CAP theorem, which two guarantees do most NoSQL stores typically prioritize, trading off strict consistency?",
        "options": [
          "Availability and Partition tolerance (AP)",
          "Consistency and Partition tolerance (CP) only",
          "Consistency and Availability, ignoring partitions",
          "NoSQL stores are exempt from CAP theorem"
        ],
        "correct": 0,
        "explanation": "Relational databases traditionally choose consistency first; most NoSQL stores choose availability + partition tolerance with eventual consistency instead."
      }
    ]
  },
  {
    "id": "html-css",
    "num": 33,
    "phase": 27,
    "title": "HTML, CSS & Responsive Design",
    "sub": "Semantic markup, accessibility, Flexbox/Grid layout, responsive breakpoints.",
    "learnMore": {
      "label": "MDN — Learn HTML",
      "url": "https://developer.mozilla.org/en-US/docs/Learn/HTML"
    },
    "subtopics": [
      {
        "title": "Semantic HTML & Accessibility",
        "concepts": [
          "Semantic tags (<nav>, <main>, <article>, <button>) tell the browser and assistive tech what content *means*, not just how it looks — a <div onclick> is not a button to a screen reader.",
          "Every interactive element needs to be reachable and operable by keyboard alone (Tab, Enter, Space) — mouse-only interactions lock out a real chunk of users.",
          "Alt text, sufficient color contrast, and a logical heading order (h1 → h2 → h3, no skipping) are the highest-leverage, lowest-effort accessibility wins."
        ],
        "checklist": [
          "Semantic Landmark Elements",
          "Keyboard Accessibility",
          "WCAG Contrast & Alt Text"
        ],
        "q": [
          {
            "t": "Rebuild a div-soup page using semantic landmark elements",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Make a custom form fully keyboard- and screen-reader-accessible",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Audit a page against WCAG AA (contrast, alt text, focus order)",
            "d": "M",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "CSS Layout (Flexbox & Grid)",
        "concepts": [
          "Flexbox is one-dimensional (a row or a column) — reach for it when aligning/distributing items along a single axis.",
          "Grid is two-dimensional (rows and columns together) — reach for it when the layout itself is the point (page structure, card galleries).",
          "They compose: Grid for the overall page skeleton, Flexbox inside individual components — most real layouts use both."
        ],
        "checklist": [
          "Flexbox Basics",
          "CSS Grid Basics",
          "Combining Grid & Flexbox"
        ],
        "q": [
          {
            "t": "Build a holy-grail layout with CSS Grid",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Recreate a pricing-cards row that wraps cleanly with Flexbox",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Build a responsive image gallery with grid-auto-fit/minmax",
            "d": "M",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Responsive Design & Media Queries",
        "concepts": [
          "Mobile-first means writing the base styles for the smallest screen, then adding complexity with min-width media queries as the viewport grows — the opposite of overriding a desktop layout downward.",
          "A breakpoint should be chosen where *your content* breaks, not at a specific device width — devices change, your layout's natural break points don't.",
          "clamp()/min()/max() let font size and spacing scale fluidly between two bounds without needing a media query for every size in between."
        ],
        "checklist": [
          "Mobile-First Design",
          "Media Query Breakpoints",
          "clamp()/min()/max() for Fluid Sizing"
        ],
        "q": [
          {
            "t": "Make a fixed desktop layout mobile-first with media queries",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Build a navbar that collapses to a hamburger under 768px",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Use clamp()/min()/max() for fluid typography and spacing",
            "d": "M",
            "p": "Build task"
          }
        ]
      }
    ],
    "mini": {
      "title": "Checkpoint Project — Responsive Landing Page",
      "desc": "A pixel-clean, fully responsive, accessible landing page built with semantic HTML and Grid/Flexbox — no framework."
    },
    "quiz": [
      {
        "q": "Why prefer semantic HTML elements (<nav>, <article>, <button>) over generic <div>s?",
        "options": [
          "They convey meaning to screen readers and improve accessibility/SEO for free",
          "They render faster in every browser",
          "They require less CSS",
          "Semantic elements cannot be styled"
        ],
        "correct": 0,
        "explanation": "A screen reader can announce \"navigation\" or \"button\" from the tag itself — a <div> gives it nothing."
      },
      {
        "q": "What is the main difference between Flexbox and CSS Grid?",
        "options": [
          "Flexbox is one-dimensional (row or column); Grid is two-dimensional (rows and columns together)",
          "Grid only works in Chrome",
          "Flexbox cannot wrap items",
          "They produce identical layouts always"
        ],
        "correct": 0,
        "explanation": "Reach for Flexbox for a single row/column of items, and Grid when you need to control both axes at once."
      },
      {
        "q": "What does a mobile-first media query approach mean?",
        "options": [
          "Base styles target small screens; larger breakpoints add complexity with min-width queries",
          "Only mobile devices are supported",
          "Desktop styles are written first, then overridden for mobile",
          "Media queries are unnecessary with mobile-first design"
        ],
        "correct": 0,
        "explanation": "Starting from the simplest (mobile) layout and progressively enhancing for larger screens is usually a cleaner CSS cascade."
      },
      {
        "q": "What accessibility attribute would you add to an icon-only button with no visible text?",
        "options": [
          "aria-label describing the action",
          "tabindex=\"-1\" to remove it from focus",
          "role=\"presentation\"",
          "alt text is sufficient on a <button>"
        ],
        "correct": 0,
        "explanation": "Without visible text, a screen reader has nothing to announce unless you provide an aria-label."
      },
      {
        "q": "What CSS property is most directly responsible for an element's stacking order relative to siblings?",
        "options": [
          "z-index (within a positioned stacking context)",
          "font-weight",
          "line-height",
          "text-align"
        ],
        "correct": 0,
        "explanation": "z-index controls layer order, but only takes effect on positioned elements (relative/absolute/fixed/sticky) within a stacking context."
      }
    ]
  },
  {
    "id": "js-dom",
    "num": 34,
    "phase": 27,
    "title": "JavaScript Core & DOM",
    "sub": "Language fundamentals, ES6+, DOM manipulation, events, async patterns.",
    "learnMore": {
      "label": "MDN — JavaScript Guide",
      "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide"
    },
    "subtopics": [
      {
        "title": "JS Fundamentals & ES6+",
        "concepts": [
          "Closures let a function remember variables from where it was defined, even after that outer function has returned — the mechanism behind private state and callbacks.",
          "var is function-scoped and hoisted with a confusing \"undefined until assigned\" behavior; let/const are block-scoped — default to const, use let only when reassignment is needed.",
          "Array methods (map, filter, reduce) transform data without mutating the original — understanding what each one returns is the key to chaining them correctly."
        ],
        "checklist": [
          "Closures",
          "var vs let vs const",
          "Array Methods (map/filter/reduce)"
        ],
        "q": [
          {
            "t": "Predict and explain output of tricky closure/hoisting snippets",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Reimplement map/filter/reduce from scratch on arrays",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Deep-clone a nested object without structuredClone",
            "d": "M",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "DOM Manipulation & Events",
        "concepts": [
          "The DOM is a live tree representation of the page — JavaScript reads and mutates it directly, and the browser re-renders in response.",
          "Events bubble up from the element they fired on to its ancestors — event delegation exploits this by attaching one listener to a parent instead of one per child.",
          "Debouncing delays work until input pauses (good for search-as-you-type); throttling caps how often work can run regardless of input rate (good for scroll/resize handlers)."
        ],
        "checklist": [
          "DOM Selection & Mutation",
          "Event Bubbling & Delegation",
          "Debounce vs Throttle"
        ],
        "q": [
          {
            "t": "Build a to-do list with add/remove/toggle, no framework",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Implement event delegation for a dynamic list",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Build a debounced live-search input against a mock API",
            "d": "M",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Async JavaScript",
        "concepts": [
          "JavaScript is single-threaded but non-blocking — async operations (fetch, timers) run in the background and their callbacks are queued to run when the call stack is clear.",
          "async/await is syntax sugar over Promises — it lets asynchronous code read top-to-bottom like synchronous code, including try/catch for errors.",
          "Promise.all runs multiple async operations concurrently and waits for all of them — much faster than awaiting each one sequentially when they don't depend on each other."
        ],
        "checklist": [
          "Callbacks vs Promises",
          "async/await",
          "Promise.all & Concurrency"
        ],
        "q": [
          {
            "t": "Rewrite a callback pyramid using async/await",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Fetch and render data with proper loading + error states",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Implement Promise.all with a concurrency limit",
            "d": "H",
            "p": "Build task"
          }
        ]
      }
    ],
    "mini": {
      "title": "Checkpoint Project — Vanilla JS Weather Dashboard",
      "desc": "A no-framework app that fetches a weather API, handles loading/error states, and updates the DOM reactively."
    },
    "quiz": [
      {
        "q": "What is the difference between == and === in JavaScript?",
        "options": [
          "=== checks value and type without coercion; == coerces types before comparing",
          "They are functionally identical",
          "=== is deprecated",
          "== is only for numbers"
        ],
        "correct": 0,
        "explanation": "== can produce surprising results (e.g. \"0\" == false is true); === is almost always the safer default."
      },
      {
        "q": "What does the JavaScript event loop enable?",
        "options": [
          "Non-blocking async operations on a single thread via a callback/microtask queue",
          "True multi-threaded parallel execution",
          "Automatic garbage collection of closures",
          "Synchronous blocking of the entire page during a fetch"
        ],
        "correct": 0,
        "explanation": "JS is single-threaded, but the event loop lets async work (timers, fetch) run without blocking the main thread."
      },
      {
        "q": "What is a closure in JavaScript?",
        "options": [
          "A function that retains access to variables from its enclosing scope after that scope has returned",
          "A method that closes a database connection",
          "A way to prevent a variable from being reassigned",
          "A synonym for an IIFE"
        ],
        "correct": 0,
        "explanation": "Closures are why a function returned from another function can still \"remember\" variables from where it was created."
      },
      {
        "q": "What is the difference between Promise.then() and async/await?",
        "options": [
          "async/await is syntactic sugar over promises, making async code read like synchronous code",
          "async/await is faster at runtime",
          "Promises cannot be used with async/await",
          "await blocks the entire browser tab"
        ],
        "correct": 0,
        "explanation": "Under the hood, both are built on the same Promise mechanism — await just makes chaining more readable."
      },
      {
        "q": "Why can directly mutating the DOM in a tight loop hurt performance?",
        "options": [
          "Each mutation can trigger a reflow/repaint, so batching changes is faster",
          "The DOM only allows one mutation per second",
          "JavaScript cannot mutate the DOM more than once",
          "Mutating the DOM always throws an error in loops"
        ],
        "correct": 0,
        "explanation": "Frameworks like React batch DOM updates for exactly this reason — many small unbatched writes are expensive."
      }
    ]
  },
  {
    "id": "typescript",
    "num": 35,
    "phase": 27,
    "title": "TypeScript Fundamentals",
    "sub": "Types, interfaces, generics, and the advanced type features that matter in React.",
    "learnMore": {
      "label": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/intro.html"
    },
    "subtopics": [
      {
        "title": "Types & Interfaces",
        "concepts": [
          "TypeScript adds a type layer on top of JavaScript that's checked at compile time and erased at runtime — it catches a whole class of bugs before the code ever runs.",
          "interface and type both describe object shapes; interfaces can be extended/merged, types are more flexible for unions and computed shapes — most codebases pick one convention and stick to it.",
          "any opts out of type checking entirely — it should be a last resort, not a default escape hatch when a type is hard to express."
        ],
        "checklist": [
          "Basic Types & Type Inference",
          "interface vs type",
          "Avoiding any"
        ],
        "q": [
          {
            "t": "Type a messy JS module with interfaces and unions",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Model an API response with nested/optional fields as types",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Replace all `any` in a small codebase with precise types",
            "d": "M",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Advanced TS",
        "concepts": [
          "Generics let a function or type work with any type while still preserving type information — `<T>` is a placeholder filled in at the call site.",
          "Utility types (Partial, Pick, Omit, Record) derive new types from existing ones instead of redefining them by hand — keeps types in sync with a single source of truth.",
          "A discriminated union (a shared \"tag\" field distinguishing variants) plus an exhaustive switch with a `never` default catches at compile time if you forget to handle a case."
        ],
        "checklist": [
          "Generics",
          "Utility Types (Partial/Pick/Omit/Record)",
          "Discriminated Unions"
        ],
        "q": [
          {
            "t": "Write a generic function with constrained type parameters",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Use utility types (Partial, Pick, Omit, Record) to derive types",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Build a discriminated union + exhaustive switch with never",
            "d": "H",
            "p": "Build task"
          }
        ]
      }
    ],
    "mini": {
      "title": "Checkpoint Project — Typed API Client",
      "desc": "A small, fully-typed API client wrapper with generics for requests/responses and no `any` anywhere."
    },
    "quiz": [
      {
        "q": "What is the main benefit TypeScript adds over plain JavaScript?",
        "options": [
          "Compile-time type checking that catches errors before the code ever runs",
          "Faster runtime execution",
          "Automatic UI rendering",
          "Built-in state management"
        ],
        "correct": 0,
        "explanation": "TypeScript compiles away entirely — its value is entirely in catching bugs and improving tooling before runtime."
      },
      {
        "q": "What does an `interface` in TypeScript primarily describe?",
        "options": [
          "The shape of an object — what properties/methods it must have",
          "A runtime class you can instantiate",
          "A database schema",
          "A CSS style rule"
        ],
        "correct": 0,
        "explanation": "Interfaces are a compile-time-only contract; they don't exist in the compiled JavaScript output."
      },
      {
        "q": "What is a generic (e.g. `function identity<T>(x: T): T`) used for?",
        "options": [
          "Writing reusable, type-safe code that works across multiple types without using `any`",
          "Making a function run faster",
          "Disabling type checking for that function",
          "Converting a function into a class"
        ],
        "correct": 0,
        "explanation": "Generics let a function/type stay flexible while still preserving specific type information at each call site."
      },
      {
        "q": "Why is `any` generally discouraged in a TypeScript codebase?",
        "options": [
          "It disables type checking for that value, defeating the purpose of using TypeScript",
          "It makes the code run slower",
          "It is not valid TypeScript syntax",
          "`any` only works with numbers"
        ],
        "correct": 0,
        "explanation": "Reaching for `any` to \"make an error go away\" silently reintroduces the exact bugs TypeScript is meant to catch."
      },
      {
        "q": "What does a union type like `string | number` mean?",
        "options": [
          "A value can be either a string or a number",
          "A value must be both a string and a number simultaneously",
          "It defines a new class",
          "It is only valid inside generics"
        ],
        "correct": 0,
        "explanation": "Union types express \"one of these possible types,\" and TypeScript narrows which one you have based on runtime checks."
      }
    ]
  },
  {
    "id": "react-fundamentals",
    "num": 36,
    "phase": 27,
    "title": "React Fundamentals",
    "sub": "Components, props, state, hooks, forms, and the render model.",
    "learnMore": {
      "label": "React — Learn",
      "url": "https://react.dev/learn"
    },
    "subtopics": [
      {
        "title": "Components & Props",
        "concepts": [
          "A component is a function that returns UI — props are its read-only inputs, passed down from parent to child, never mutated by the child.",
          "children is a special prop that lets a component wrap arbitrary content it doesn't need to know the shape of — the pattern behind reusable layout/card components.",
          "\"Lifting state up\" means moving shared state to the nearest common ancestor of the components that need it — the default way to share data between siblings before reaching for Context."
        ],
        "checklist": [
          "Function Components",
          "Props & children",
          "Lifting State Up"
        ],
        "q": [
          {
            "t": "Break a static page into reusable, prop-driven components",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Build a reusable Card/List with children and render props",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Lift state up to share data between two sibling components",
            "d": "M",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "State & Hooks",
        "concepts": [
          "useState triggers a re-render whenever its setter is called — React batches and schedules renders, it doesn't update the DOM synchronously on every call.",
          "useEffect runs side effects (fetching, subscriptions) after render; its cleanup function (the returned function) prevents leaks when the component unmounts or dependencies change.",
          "A custom hook is just a function starting with \"use\" that calls other hooks — the standard way to extract and reuse stateful logic across components."
        ],
        "checklist": [
          "useState",
          "useEffect & Cleanup",
          "Custom Hooks"
        ],
        "q": [
          {
            "t": "Build a counter/toggle with useState correctly (no stale state)",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Fetch data in useEffect with cleanup and a loading state",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Extract shared logic into a custom hook (e.g. useLocalStorage)",
            "d": "M",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Forms & Events",
        "concepts": [
          "A controlled input's value is driven entirely by React state — every keystroke updates state, and state renders back into the input, making React the single source of truth.",
          "For a multi-field form, a reducer (useReducer) often reads cleaner than a pile of individual useState calls, especially once validation logic gets involved.",
          "Debounce input handlers that trigger expensive work (API calls) and cancel stale in-flight requests when newer input arrives — otherwise responses can return out of order."
        ],
        "checklist": [
          "Controlled Inputs",
          "Form Validation",
          "useReducer for Forms"
        ],
        "q": [
          {
            "t": "Build a controlled form with validation and error messages",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Handle a multi-field form with a single state object + reducer",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Debounce a search field and cancel stale requests",
            "d": "M",
            "p": "Build task"
          }
        ]
      }
    ],
    "mini": {
      "title": "Checkpoint Project — React Task Board",
      "desc": "A component-driven task board (add/edit/complete) with custom hooks and controlled forms — no state library yet."
    },
    "quiz": [
      {
        "q": "What triggers a React component to re-render?",
        "options": [
          "Its state or props changing",
          "The browser window resizing",
          "A page reload only",
          "Every setInterval tick regardless of state"
        ],
        "correct": 0,
        "explanation": "React schedules a re-render whenever a component's own state changes (via its setter) or its props change."
      },
      {
        "q": "What does the useEffect cleanup function (the function it returns) prevent?",
        "options": [
          "Leaks from subscriptions/timers continuing after a component unmounts or deps change",
          "The component from rendering at all",
          "State from ever updating",
          "Props from being passed down"
        ],
        "correct": 0,
        "explanation": "Without cleanup, an interval or subscription set up in useEffect keeps running even after the component is gone."
      },
      {
        "q": "What does \"lifting state up\" mean?",
        "options": [
          "Moving shared state to the nearest common ancestor of the components that need it",
          "Storing state in a global variable",
          "Converting state to props permanently",
          "Moving state into a CSS file"
        ],
        "correct": 0,
        "explanation": "It's the default way to share data between sibling components before reaching for Context or a state library."
      },
      {
        "q": "What is a controlled input in React?",
        "options": [
          "An input whose value is driven entirely by React state, updated on every change",
          "Any input element regardless of implementation",
          "An input that cannot be edited by the user",
          "An input validated only on the server"
        ],
        "correct": 0,
        "explanation": "React state is the single source of truth — every keystroke updates state, which renders back into the input's value."
      },
      {
        "q": "What is a custom hook?",
        "options": [
          "A function starting with \"use\" that calls other hooks to extract reusable stateful logic",
          "A hook that only works in class components",
          "A CSS utility for hover effects",
          "A built-in React API for routing"
        ],
        "correct": 0,
        "explanation": "Custom hooks are the standard way to share stateful logic (like a fetch-with-loading pattern) across multiple components."
      }
    ]
  },
  {
    "id": "react-advanced",
    "num": 37,
    "phase": 27,
    "title": "React Advanced & State Management",
    "sub": "Context, global state, performance, routing, and data fetching.",
    "learnMore": {
      "label": "React — Scaling Up with Reducer and Context",
      "url": "https://react.dev/learn/scaling-up-with-reducer-and-context"
    },
    "subtopics": [
      {
        "title": "Context API & Global State",
        "concepts": [
          "Context lets a value skip past intermediate components straight to whatever descendant needs it — the fix for prop-drilling a value through five layers that don't use it themselves.",
          "An auth context is a common real use: hold the current user and login/logout functions once, read them anywhere via a hook, and gate routes based on that state.",
          "useReducer + Context is a lightweight alternative to a state-management library for genuinely complex, interrelated state — reach for a library only once this stops being enough."
        ],
        "checklist": [
          "Context API Basics",
          "Auth Context Pattern",
          "useReducer + Context"
        ],
        "q": [
          {
            "t": "Replace deep prop-drilling with a Context provider",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Build an auth context with login/logout and a protected route",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Model complex global state with useReducer + Context",
            "d": "M",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Performance",
        "concepts": [
          "React re-renders a component whenever its state or props change — the Profiler shows you which components rendered and why, which is the first step before optimizing anything.",
          "memo/useMemo/useCallback prevent unnecessary re-renders or recomputation, but they have their own cost — apply them where profiling shows a real problem, not everywhere by default.",
          "Virtualization renders only the list items currently visible in the viewport, not all of them — the only real fix for a long list that's janky to scroll."
        ],
        "checklist": [
          "React Profiler",
          "memo / useMemo / useCallback",
          "List Virtualization"
        ],
        "q": [
          {
            "t": "Find and fix an unnecessary-rerender bug with the Profiler",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Apply memo/useMemo/useCallback where they actually help",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Virtualize a long list to keep scrolling smooth",
            "d": "H",
            "p": "Build task"
          }
        ]
      },
      {
        "title": "Routing & Data Fetching",
        "concepts": [
          "A client-side router intercepts navigation and swaps components without a full page reload — nested routes mirror nested UI layouts.",
          "A data-fetching library (React Query, SWR) adds caching, revalidation, and request deduplication on top of raw fetch — solving problems most apps eventually hit by hand-rolling their own.",
          "Every list endpoint needs three states handled explicitly: loading, error, and empty — \"it just works when there's data\" isn't a complete implementation."
        ],
        "checklist": [
          "Client-Side Routing",
          "Data-Fetching Libraries (React Query/SWR)",
          "Loading/Error/Empty States"
        ],
        "q": [
          {
            "t": "Set up multi-page routing with nested routes and params",
            "d": "E",
            "p": "Build task"
          },
          {
            "t": "Add data fetching with cache + revalidation (e.g. React Query)",
            "d": "M",
            "p": "Build task"
          },
          {
            "t": "Handle loading/error/empty states for a paginated list",
            "d": "M",
            "p": "Build task"
          }
        ]
      }
    ],
    "mini": {
      "title": "Checkpoint Project — Full-Stack Frontend",
      "desc": "A routed React + TS app with auth context, global state, cached data fetching, and real loading/error states — wired to a real API."
    },
    "quiz": [
      {
        "q": "What problem does React Context solve?",
        "options": [
          "Passing a value to deeply nested components without prop-drilling through every layer",
          "Making a component render faster",
          "Replacing the need for props entirely",
          "Handling HTTP requests directly"
        ],
        "correct": 0,
        "explanation": "A value in Context can be read by any descendant, skipping intermediate components that don't use it themselves."
      },
      {
        "q": "Why might useMemo or useCallback fail to actually improve performance if used everywhere?",
        "options": [
          "They have their own comparison/memoization cost, which can outweigh the benefit for cheap computations",
          "They are deprecated in modern React",
          "They only work with class components",
          "They break component rendering entirely"
        ],
        "correct": 0,
        "explanation": "Memoization isn't free — apply it where profiling shows a real, expensive re-render/recompute problem."
      },
      {
        "q": "What does list virtualization solve?",
        "options": [
          "Rendering only the currently-visible items of a very long list, keeping scrolling smooth",
          "Making API calls faster",
          "Reducing bundle size",
          "Improving SEO for a list page"
        ],
        "correct": 0,
        "explanation": "Rendering thousands of DOM nodes at once is slow — virtualization renders only what's in (or near) the viewport."
      },
      {
        "q": "What is a benefit of a data-fetching library (React Query/SWR) over raw fetch + useEffect?",
        "options": [
          "Built-in caching, revalidation, and request deduplication",
          "It eliminates the need for an API entirely",
          "It replaces React itself",
          "It only works with GraphQL"
        ],
        "correct": 0,
        "explanation": "These libraries solve problems (stale data, duplicate in-flight requests, refetch-on-focus) that most apps eventually hit hand-rolling their own fetching logic."
      },
      {
        "q": "Why must every list endpoint explicitly handle loading, error, AND empty states?",
        "options": [
          "\"It just works when there's data\" is an incomplete implementation — each state needs deliberate UI",
          "React automatically handles all three",
          "Only the error state actually matters in practice",
          "Empty and loading states are visually identical by default"
        ],
        "correct": 0,
        "explanation": "A missing empty-state or error-state is one of the most common real-world UI bugs in production apps."
      }
    ]
  }
];

// --- Pure progress helpers (used by dashboard, topic pages, LeetCode bank) ---

export function qid(topicId, si, qi) {
  return topicId + '::' + si + '::' + qi;
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

// Progress key for one item in a subtopic's concept checklist (Phase 2
// onward). Distinct namespace ('concept') so it never collides with
// qid()'s question keys even at the same topic/subtopic index.
export function checklistKey(topicId, si, ci) {
  return topicId + '::' + si + '::concept::' + ci;
}

// { c: solved, t: total } for one subtopic's concept checklist.
export function checklistProgress(top, si, progress) {
  const s = top.subtopics[si];
  const list = s.checklist || [];
  let c = 0;
  list.forEach((_, ci) => {
    if (progress && progress[checklistKey(top.id, si, ci)]) c++;
  });
  return { c, t: list.length };
}

// --- Quiz progress helpers (guided-learning layer, additive) ---
// Distinct 'quiz' namespace so these never collide with question/checklist
// keys on the same topic. A quiz question is "answered" once the learner has
// locked in a choice, regardless of whether it was correct — the quiz block
// itself is what shows correctness/explanation; progress only tracks
// completion, same as everything else in this app.

export function quizKey(topicId, qi) {
  return topicId + '::quiz::' + qi;
}

// { c: answered, t: total } for one topic's quiz.
export function quizProgress(top, progress) {
  const list = top.quiz || [];
  let c = 0;
  list.forEach((_, qi) => {
    if (progress && progress[quizKey(top.id, qi)]) c++;
  });
  return { c, t: list.length };
}

export function quizComplete(top, progress) {
  const { c, t } = quizProgress(top, progress);
  return t > 0 && c === t;
}

// --- Project completion helpers (checkpoint + phase projects) ---

export function projectKey(topicId) {
  return topicId + '::project';
}

export function projectDone(topicId, progress) {
  return !!(progress && progress[projectKey(topicId)]);
}

export function phaseProjectKey(careerId, phaseIndex) {
  return careerId + '::phaseProject::' + phaseIndex;
}

export function phaseProjectDone(careerId, phaseIndex, progress) {
  return !!(progress && progress[phaseProjectKey(careerId, phaseIndex)]);
}
