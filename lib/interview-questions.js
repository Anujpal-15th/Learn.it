// lib/interview-questions.js — a checklist of commonly-asked interview
// questions, grouped by category. Different in kind from the other
// reference pages: the item text IS the question, and the description line
// says what it's actually testing (not "what the topic is"). Each category
// links to one real, direct interview-question article — never a search.

export const INTERVIEW_CATEGORIES = [
  {
    name: 'Core Java',
    source: { label: 'Baeldung — Java Interview Questions', url: 'https://www.baeldung.com/java-interview-questions' },
    items: [
      { slug: 'jvm-jre-jdk', q: 'What is the difference between JVM, JRE, and JDK?', d: 'Tests whether you understand the runtime vs the development toolchain, not just the acronyms.' },
      { slug: 'equals-hashcode', q: 'Why must you override hashCode() whenever you override equals()?', d: "Tests whether you understand hash-based collections (HashMap/HashSet) will silently break if you don't." },
      { slug: 'final-finally-finalize', q: "What's the difference between final, finally, and finalize()?", d: 'A classic "sounds similar, means completely different things" question.' },
      { slug: 'checked-vs-unchecked', q: 'When would you use a checked exception vs an unchecked one?', d: 'Tests judgment, not just definitions — most interviewers want a real opinion here.' },
      { slug: 'string-pool', q: 'Why is String immutable in Java, and what is the String pool?', d: 'Tests understanding of memory, security, and thread-safety implications of immutability.' },
    ],
  },
  {
    name: 'OOP & SOLID',
    source: { label: 'GeeksforGeeks — SOLID Principles', url: 'https://www.geeksforgeeks.org/system-design/solid-principle-in-programming-understand-with-real-life-examples/' },
    items: [
      { slug: 'overloading-vs-overriding', q: 'What is the difference between method overloading and overriding?', d: 'Tests whether you know overloading is compile-time (static) and overriding is runtime (dynamic) dispatch.' },
      { slug: 'composition-vs-inheritance', q: 'When would you choose composition over inheritance?', d: 'A senior-leaning question — tests whether you default to inheritance or actually think about coupling.' },
      { slug: 'liskov-example', q: 'Give a real example of code that violates the Liskov Substitution Principle.', d: "Tests whether SOLID is memorized or actually understood well enough to spot a violation." },
      { slug: 'interface-vs-abstract-class', q: 'When would you use an interface vs an abstract class?', d: 'Tests understanding of multiple inheritance limits and shared-state vs shared-contract.' },
      { slug: 'dependency-injection-why', q: 'What problem does Dependency Injection actually solve?', d: 'Tests whether you can explain DI in terms of testability/coupling, not just "it\'s what Spring does."' },
    ],
  },
  {
    name: 'Collections & Streams',
    source: { label: 'Baeldung — Java Interview Questions', url: 'https://www.baeldung.com/java-interview-questions' },
    items: [
      { slug: 'arraylist-vs-linkedlist', q: 'ArrayList vs LinkedList — when would you actually choose one over the other?', d: 'Tests Big-O intuition, not just memorized facts.' },
      { slug: 'hashmap-internals', q: 'How does HashMap work internally? What happens on a hash collision?', d: 'One of the most common Java interview questions — tests real internals knowledge, not surface-level usage.' },
      { slug: 'concurrent-modification', q: 'What causes a ConcurrentModificationException, and how do you avoid it?', d: 'Tests whether you understand fail-fast iterators, a common real-world bug.' },
      { slug: 'stream-vs-loop', q: 'When would you prefer a Stream pipeline over a plain for-loop?', d: 'Tests judgment about readability/parallelism trade-offs, not just stream syntax.' },
      { slug: 'comparable-vs-comparator', q: 'What is the difference between Comparable and Comparator?', d: 'Tests whether you know one is natural ordering (on the class) and one is external/pluggable.' },
    ],
  },
  {
    name: 'Multithreading & Concurrency',
    source: { label: 'Baeldung — Java Interview Questions', url: 'https://www.baeldung.com/java-interview-questions' },
    items: [
      { slug: 'thread-vs-runnable', q: 'Why is implementing Runnable generally preferred over extending Thread?', d: 'Tests whether you understand Java\'s single-inheritance limitation and separation of "what runs" from "how."' },
      { slug: 'synchronized-vs-volatile', q: 'What is the difference between synchronized and volatile?', d: 'A very common trap question — tests whether you know volatile gives visibility but NOT atomicity.' },
      { slug: 'deadlock-explain', q: 'What causes a deadlock, and how would you prevent one?', d: 'Tests whether you can explain lock ordering, not just define the term.' },
      { slug: 'executorservice-why', q: 'Why use an ExecutorService instead of creating raw Threads?', d: 'Tests understanding of thread-pool management and resource control under load.' },
      { slug: 'virtual-threads-explain', q: 'What are virtual threads, and what problem do they actually solve?', d: 'A 2026-relevant question — tests whether you know they help I/O-bound concurrency, not CPU-bound work.' },
    ],
  },
  {
    name: 'Spring & Spring Boot',
    source: { label: 'Baeldung — Spring Boot Interview Questions', url: 'https://www.baeldung.com/spring-boot-interview-questions' },
    items: [
      { slug: 'ioc-di-explain', q: 'What is Inversion of Control, and how does Dependency Injection implement it?', d: 'The single most common Spring question — tests whether you can explain it without just saying "Spring does it."' },
      { slug: 'bean-scopes', q: 'What are the different Spring bean scopes, and when would you use prototype over singleton?', d: 'Tests real usage judgment, since singleton is the default almost everyone uses without thinking.' },
      { slug: 'autoconfiguration-explain', q: 'How does Spring Boot autoconfiguration actually work?', d: 'Tests whether you understand @Conditional annotations and classpath scanning, not just that "it just works."' },
      { slug: 'transactional-pitfall', q: 'Why does calling an @Transactional method from within the same class not trigger the transaction?', d: 'A classic gotcha question — tests understanding of Spring AOP proxies.' },
      { slug: 'n-plus-one-fix', q: 'How would you diagnose and fix an N+1 query problem in a Spring Data JPA app?', d: 'Extremely common in real interviews — tests hands-on JPA debugging experience, not theory.' },
    ],
  },
  {
    name: 'Database & SQL',
    source: { label: 'GeeksforGeeks — SQL Interview Questions', url: 'https://www.geeksforgeeks.org/sql/sql-interview-questions/' },
    items: [
      { slug: 'inner-vs-left-join', q: 'What is the difference between INNER JOIN and LEFT JOIN? Give a real example.', d: 'One of the most-asked SQL questions — tests whether you can reason about which rows survive, not just recite definitions.' },
      { slug: 'normalization-why', q: 'Why normalize a database, and when would you deliberately denormalize?', d: 'Tests judgment about trade-offs, not just "3NF is good."' },
      { slug: 'index-tradeoff', q: 'What is a database index, and why wouldn\'t you index every column?', d: 'Tests understanding of the write-speed cost of indexing, which many candidates miss.' },
      { slug: 'acid-explain', q: 'Explain ACID with a concrete example of a transaction that would violate each property if broken.', d: 'Tests whether ACID is memorized or genuinely understood.' },
      { slug: 'nplus1-vs-join', q: 'What is the N+1 query problem, and how would you fix it at the SQL level?', d: 'Tests real production debugging experience, one of the most common backend interview topics.' },
    ],
  },
  {
    name: 'REST API Design',
    source: { label: 'restfulapi.net — REST API Tutorial', url: 'https://restfulapi.net/' },
    items: [
      { slug: 'put-vs-patch', q: 'What is the difference between PUT and PATCH?', d: 'Tests understanding of full-replacement vs partial-update semantics.' },
      { slug: 'idempotency-explain', q: 'What does idempotent mean for an HTTP method, and which methods are (and aren\'t)?', d: 'A very common REST question — tests real understanding of retry-safety, not just memorized verbs.' },
      { slug: 'api-versioning-tradeoffs', q: 'How would you version a public API, and what are the trade-offs of your approach?', d: 'Tests real design judgment — there is no single "correct" answer, which is the point.' },
      { slug: 'status-code-401-vs-403', q: 'What is the difference between a 401 and a 403 status code?', d: 'A common trap — tests whether you know 401 = not authenticated, 403 = authenticated but not authorized.' },
      { slug: 'pagination-approach', q: 'How would you design pagination for an endpoint returning millions of rows?', d: 'Tests whether you know offset pagination breaks down at scale and cursor-based pagination is the fix.' },
    ],
  },
  {
    name: 'System Design',
    source: { label: 'GeeksforGeeks — How to Answer a System Design Question', url: 'https://www.geeksforgeeks.org/how-to-answer-a-system-design-interview-problem/' },
    items: [
      { slug: 'design-url-shortener', q: 'Design a URL shortener. Walk through the schema, scale estimate, and bottlenecks.', d: 'The single most common system design interview question — tests structured thinking under ambiguity.' },
      { slug: 'design-rate-limiter', q: 'Design a rate limiter for an API. What algorithm would you use, and why?', d: 'Tests whether you know token bucket vs sliding window and can justify a choice.' },
      { slug: 'design-notification-fanout', q: 'Design a notification system that can reach 10 million users within a minute.', d: 'Tests understanding of queues, fan-out workers, and why this can\'t be done synchronously.' },
      { slug: 'cap-tradeoff-question', q: 'Would you choose consistency or availability for a payments system? For a social media feed?', d: 'Tests whether CAP theorem is understood as a real design trade-off, not abstract trivia.' },
      { slug: 'scale-read-heavy-service', q: 'How would you scale a read-heavy service that\'s currently hitting a single Postgres instance?', d: 'Tests whether caching, read replicas, and indexing come to mind before "just add more servers."' },
    ],
  },
  {
    name: 'Testing',
    source: { label: 'Baeldung — Java Interview Questions', url: 'https://www.baeldung.com/java-interview-questions' },
    items: [
      { slug: 'unit-vs-integration', q: 'What is the difference between a unit test and an integration test? When do you write each?', d: 'Tests judgment about test pyramid trade-offs, not just definitions.' },
      { slug: 'mock-vs-stub', q: 'What is the difference between a mock, a stub, and a spy?', d: 'A precise vocabulary question that also tests whether you actually understand what each is verifying.' },
      { slug: 'tdd-explain', q: 'Walk me through the red-green-refactor cycle with a real example.', d: 'Tests whether TDD is a practiced habit or just a term you\'ve heard.' },
      { slug: 'testcontainers-why', q: 'Why would you use Testcontainers instead of an in-memory H2 database for integration tests?', d: 'Tests awareness that H2 can behave differently from your real production database.' },
      { slug: 'coverage-meaningless', q: 'Why isn\'t 100% code coverage the same thing as "well-tested"?', d: 'Tests critical thinking about metrics vs actual quality.' },
    ],
  },
  {
    name: 'Behavioral',
    source: { label: 'GeeksforGeeks — STAR Methodology', url: 'https://www.geeksforgeeks.org/star-methodology/' },
    items: [
      { slug: 'star-conflict', q: 'Tell me about a time you disagreed with a teammate\'s technical decision. What did you do?', d: 'Tests communication and conflict-resolution — answer using Situation, Task, Action, Result.' },
      { slug: 'star-mistake', q: 'Tell me about a bug you shipped to production. What happened, and what did you change afterward?', d: 'Tests accountability and whether you actually learn from failure, not just avoid admitting it.' },
      { slug: 'star-deadline', q: 'Tell me about a time you had to cut scope to hit a deadline. How did you decide what to cut?', d: 'Tests prioritization judgment under real constraints.' },
      { slug: 'star-ambiguity', q: 'Tell me about a time you were given a task with unclear requirements. What did you do first?', d: 'Tests whether you ask clarifying questions or just start building on assumptions.' },
      { slug: 'star-mentoring', q: 'Tell me about a time you helped a teammate who was stuck.', d: 'Tests collaboration and communication, especially relevant for any team-based role.' },
    ],
  },
];

export function interviewKey(slug) {
  return 'interview::' + slug;
}

export function totalInterviewQuestions() {
  return INTERVIEW_CATEGORIES.reduce((n, c) => n + c.items.length, 0);
}
