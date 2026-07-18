// lib/backend-topics.js — a flat reference glossary of backend engineering
// topics, grouped by category. Separate from the phase-based roadmap: this
// is a bird's-eye "have I at least heard of and understood this?" checklist
// spanning the whole field, the same way lib/algorithms.js does for named
// algorithms. Every link below goes straight to a real, direct article or
// official documentation page — never a site search or a course page.

export const BACKEND_CATEGORIES = [
  {
    name: 'Languages & Runtimes',
    items: [
      { slug: 'jvm', t: 'The JVM', d: 'Bytecode, classloading, and the managed runtime every Java (and Kotlin, Scala, Clojure) program runs on top of.', url: 'https://docs.oracle.com/javase/specs/jvms/se21/html/index.html', src: 'Oracle' },
      { slug: 'garbage-collection', t: 'Garbage Collection', d: 'Automatic memory reclamation — generational collectors, stop-the-world pauses, and why GC tuning matters at scale.', url: 'https://docs.oracle.com/en/java/javase/21/gctuning/introduction-garbage-collection-tuning.html', src: 'Oracle' },
      { slug: 'nodejs-runtime', t: 'Node.js Event Loop', d: 'Single-threaded, non-blocking I/O model — the mechanism behind Node.js handling thousands of concurrent connections.', url: 'https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick', src: 'Node.js Docs' },
      { slug: 'static-vs-dynamic-typing', t: 'Static vs Dynamic Typing', d: 'Compile-time checked types (Java, Go, TypeScript) vs runtime-checked types (Python, JS, Ruby) — a real trade-off in safety vs iteration speed.', url: 'https://developer.mozilla.org/en-US/docs/Glossary/Static_typing', src: 'MDN' },
    ],
  },
  {
    name: 'Databases',
    items: [
      { slug: 'acid-transactions', t: 'ACID Transactions', d: 'Atomicity, Consistency, Isolation, Durability — the guarantees a relational database transaction makes.', url: 'https://www.postgresql.org/docs/current/tutorial-transactions.html', src: 'PostgreSQL Docs' },
      { slug: 'database-indexing', t: 'Database Indexing', d: 'B-tree and hash indexes that turn an O(n) scan into an O(log n) lookup, at the cost of slower writes.', url: 'https://www.postgresql.org/docs/current/indexes.html', src: 'PostgreSQL Docs' },
      { slug: 'orm', t: 'ORMs (Object-Relational Mapping)', d: 'Maps database rows to objects (Hibernate/JPA, Prisma, SQLAlchemy) — convenient, but hides real SQL cost if you\'re not careful.', url: 'https://hibernate.org/orm/documentation/', src: 'Hibernate Docs' },
      { slug: 'nosql-document-store', t: 'Document Stores', d: 'Schema-flexible JSON-like storage (MongoDB) — data modeled around how it\'s read, not normalized.', url: 'https://www.mongodb.com/docs/manual/core/data-modeling-introduction/', src: 'MongoDB Docs' },
      { slug: 'database-replication', t: 'Replication', d: 'Copying data from a primary to one or more replicas for read scaling and failover.', url: 'https://www.postgresql.org/docs/current/high-availability.html', src: 'PostgreSQL Docs' },
      { slug: 'database-sharding', t: 'Sharding', d: 'Splitting one logical database across multiple physical machines by a key, when a single machine can\'t hold or serve it all.', url: 'https://www.mongodb.com/docs/manual/sharding/', src: 'MongoDB Docs' },
    ],
  },
  {
    name: 'Caching',
    items: [
      { slug: 'redis-caching', t: 'Redis / In-Memory Caching', d: 'Keeping hot data in memory to skip a slow database round-trip.', url: 'https://redis.io/docs/latest/develop/get-started/', src: 'Redis Docs' },
      { slug: 'cache-invalidation', t: 'Cache Invalidation Strategies', d: 'Write-through, write-behind, and TTL-based expiry — the different ways to keep a cache from serving stale data.', url: 'https://aws.amazon.com/caching/best-practices/', src: 'AWS' },
      { slug: 'cdn', t: 'CDN (Content Delivery Network)', d: 'Caches static content at edge locations close to users, cutting latency and origin load.', url: 'https://developer.mozilla.org/en-US/docs/Glossary/CDN', src: 'MDN' },
      { slug: 'cache-stampede', t: 'Cache Stampede', d: 'What happens when many requests miss the cache at once and all hit the database simultaneously — and how locking/coalescing prevents it.', url: 'https://redis.io/glossary/cache-stampede/', src: 'Redis' },
    ],
  },
  {
    name: 'Messaging & Streaming',
    items: [
      { slug: 'message-queues', t: 'Message Queues', d: 'Decouples producer from consumer in time — RabbitMQ-style point-to-point delivery.', url: 'https://www.rabbitmq.com/tutorials', src: 'RabbitMQ Docs' },
      { slug: 'kafka', t: 'Apache Kafka', d: 'A distributed log for high-throughput event streaming — partitions, consumer groups, and offsets.', url: 'https://kafka.apache.org/documentation/#gettingStarted', src: 'Apache Kafka Docs' },
      { slug: 'pub-sub', t: 'Publish/Subscribe', d: 'One event, many independent subscribers — decouples producers entirely from knowing who consumes their events.', url: 'https://cloud.google.com/pubsub/docs/overview', src: 'Google Cloud Docs' },
      { slug: 'event-sourcing', t: 'Event Sourcing', d: 'Store every state change as an immutable event instead of just the current state — the full history becomes the source of truth.', url: 'https://martinfowler.com/eaaDev/EventSourcing.html', src: 'Martin Fowler' },
    ],
  },
  {
    name: 'API Design',
    items: [
      { slug: 'rest-api', t: 'REST', d: 'Resource-oriented HTTP APIs using standard verbs and status codes — the default for most public/internal APIs.', url: 'https://restfulapi.net/', src: 'restfulapi.net' },
      { slug: 'graphql', t: 'GraphQL', d: 'Clients request exactly the fields they need in one query, instead of over/under-fetching from fixed REST endpoints.', url: 'https://graphql.org/learn/', src: 'GraphQL.org' },
      { slug: 'grpc', t: 'gRPC', d: 'A high-performance RPC framework using Protocol Buffers — common for internal service-to-service calls.', url: 'https://grpc.io/docs/what-is-grpc/introduction/', src: 'gRPC.io' },
      { slug: 'webhooks', t: 'Webhooks', d: 'Your server calls a URL the client registered when an event happens — inverted, push-based API integration.', url: 'https://www.redhat.com/en/topics/automation/what-is-a-webhook', src: 'Red Hat' },
      { slug: 'api-gateway', t: 'API Gateway', d: 'A single entry point that routes to backend services and centralizes auth, rate limiting, and logging.', url: 'https://microservices.io/patterns/apigateway.html', src: 'microservices.io' },
    ],
  },
  {
    name: 'Authentication & Security',
    items: [
      { slug: 'oauth2', t: 'OAuth 2.0', d: 'Lets a user grant an app access without handing it their password — the authorization code flow is the standard pattern.', url: 'https://oauth.net/2/', src: 'OAuth.net' },
      { slug: 'jwt', t: 'JWT (JSON Web Tokens)', d: 'A signed token carrying claims — the server trusts it because of the signature, not a session-store lookup.', url: 'https://jwt.io/introduction', src: 'jwt.io' },
      { slug: 'owasp-top-ten', t: 'OWASP Top 10', d: 'The ten most critical web application security risks, updated periodically by the security community.', url: 'https://owasp.org/www-project-top-ten/', src: 'OWASP' },
      { slug: 'encryption-at-rest-in-transit', t: 'Encryption at Rest & in Transit', d: 'Protecting data on disk (at rest) and over the network (in transit, via TLS) — two separate concerns, both required.', url: 'https://cloud.google.com/docs/security/encryption/default-encryption', src: 'Google Cloud Docs' },
      { slug: 'rbac', t: 'Role-Based Access Control (RBAC)', d: 'Permissions attached to roles, roles attached to users — the standard model for "who can do what."', url: 'https://csrc.nist.gov/glossary/term/role_based_access_control', src: 'NIST' },
    ],
  },
  {
    name: 'Testing & Quality',
    items: [
      { slug: 'unit-testing', t: 'Unit Testing', d: 'Testing one class/function in isolation, dependencies mocked — the fastest, most numerous tests in a suite.', url: 'https://junit.org/junit5/docs/current/user-guide/', src: 'JUnit 5 Docs' },
      { slug: 'integration-testing', t: 'Integration Testing', d: 'Testing multiple components together (a real database, a real HTTP layer) — slower, but catches wiring bugs unit tests can\'t.', url: 'https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications.html', src: 'Spring Docs' },
      { slug: 'tdd', t: 'Test-Driven Development', d: 'Red-green-refactor: write a failing test first, then the minimum code to pass it, then clean up.', url: 'https://martinfowler.com/bliki/TestDrivenDevelopment.html', src: 'Martin Fowler' },
      { slug: 'static-analysis', t: 'Static Analysis / Linting', d: 'Catches bugs and style issues by analyzing code without running it — part of most CI pipelines today.', url: 'https://spotbugs.readthedocs.io/en/stable/', src: 'SpotBugs Docs' },
    ],
  },
  {
    name: 'Containers & Orchestration',
    items: [
      { slug: 'docker-containers', t: 'Docker Containers', d: 'Packages an app with its dependencies into a reproducible image that runs the same everywhere.', url: 'https://docs.docker.com/get-started/docker-overview/', src: 'Docker Docs' },
      { slug: 'kubernetes-orchestration', t: 'Kubernetes', d: 'Runs, scales, and self-heals a fleet of containers — the dominant orchestration platform.', url: 'https://kubernetes.io/docs/concepts/overview/', src: 'Kubernetes Docs' },
      { slug: 'service-mesh', t: 'Service Mesh', d: 'A dedicated infrastructure layer (Istio, Linkerd) handling service-to-service traffic, retries, and observability without app code changes.', url: 'https://istio.io/latest/about/service-mesh/', src: 'Istio Docs' },
      { slug: 'helm', t: 'Helm', d: 'A package manager for Kubernetes — templated, versioned, reusable sets of Kubernetes manifests.', url: 'https://helm.sh/docs/intro/using_helm/', src: 'Helm Docs' },
    ],
  },
  {
    name: 'CI/CD & DevOps',
    items: [
      { slug: 'ci-cd-pipelines', t: 'CI/CD Pipelines', d: 'Automated build, test, and deploy on every code change — the backbone of shipping safely and often.', url: 'https://docs.github.com/en/actions/about-github-actions/about-continuous-integration-with-github-actions', src: 'GitHub Docs' },
      { slug: 'blue-green-deployment', t: 'Blue-Green Deployment', d: 'Two identical environments; switch traffic to the new one instantly, keep the old one ready for instant rollback.', url: 'https://martinfowler.com/bliki/BlueGreenDeployment.html', src: 'Martin Fowler' },
      { slug: 'canary-releases', t: 'Canary Releases', d: 'Roll a new version out to a small slice of traffic first, watch for errors, then expand — limits blast radius of a bad deploy.', url: 'https://martinfowler.com/bliki/CanaryRelease.html', src: 'Martin Fowler' },
      { slug: 'infrastructure-as-code', t: 'Infrastructure as Code', d: 'Defining servers, networks, and databases in version-controlled config (Terraform) instead of clicking through a cloud console.', url: 'https://developer.hashicorp.com/terraform/intro', src: 'Terraform Docs' },
    ],
  },
  {
    name: 'Cloud Platforms',
    items: [
      { slug: 'aws-core-services', t: 'AWS Core Services', d: 'EC2 (compute), S3 (storage), RDS (managed databases) — the three services almost every AWS-hosted backend touches.', url: 'https://aws.amazon.com/getting-started/', src: 'AWS Docs' },
      { slug: 'serverless-computing', t: 'Serverless / FaaS', d: 'Functions that run on demand and scale to zero — you pay per invocation, not per running server.', url: 'https://aws.amazon.com/serverless/', src: 'AWS' },
      { slug: 'managed-databases', t: 'Managed Database Services', d: 'A cloud provider handles backups, patching, and failover for you (RDS, Cloud SQL) — usually worth the cost over self-hosting.', url: 'https://aws.amazon.com/rds/', src: 'AWS' },
      { slug: 'vpc-networking', t: 'VPC & Cloud Networking', d: 'Your own isolated network inside the cloud — public subnets face the internet, private ones (like your database) shouldn\'t.', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html', src: 'AWS Docs' },
    ],
  },
  {
    name: 'Observability',
    items: [
      { slug: 'structured-logging', t: 'Structured Logging', d: 'JSON, consistent-field logs instead of free text — what actually makes logs searchable and alertable at scale.', url: 'https://www.elastic.co/what-is/elk-stack', src: 'Elastic' },
      { slug: 'metrics-monitoring', t: 'Metrics & Monitoring', d: 'Time-series numbers (Prometheus) tracking system health, scraped and graphed (Grafana) over time.', url: 'https://prometheus.io/docs/introduction/overview/', src: 'Prometheus Docs' },
      { slug: 'distributed-tracing', t: 'Distributed Tracing', d: 'Follows one request across every service it touches — essential once a monolith becomes several microservices.', url: 'https://opentelemetry.io/docs/concepts/signals/traces/', src: 'OpenTelemetry Docs' },
      { slug: 'alerting', t: 'Alerting', d: 'Turning a monitored threshold breach into a page/notification before a user notices — the difference between monitoring and actually being on call.', url: 'https://prometheus.io/docs/alerting/latest/overview/', src: 'Prometheus Docs' },
    ],
  },
  {
    name: 'Architecture Patterns',
    items: [
      { slug: 'monolith-vs-microservices', t: 'Monolith vs Microservices', d: 'One deployable unit vs many independently-deployable services — a real trade-off, not a default "microservices are better."', url: 'https://martinfowler.com/articles/microservices.html', src: 'Martin Fowler' },
      { slug: 'event-driven-architecture', t: 'Event-Driven Architecture', d: 'Services react to events instead of calling each other directly — looser coupling, harder-to-trace flows.', url: 'https://aws.amazon.com/event-driven-architecture/', src: 'AWS' },
      { slug: 'cqrs', t: 'CQRS', d: 'Command Query Responsibility Segregation — separate models for writing data and reading it, when the same model for both stops fitting.', url: 'https://martinfowler.com/bliki/CQRS.html', src: 'Martin Fowler' },
      { slug: 'saga-pattern', t: 'Saga Pattern', d: 'Manages a multi-step transaction across services using a sequence of local transactions and compensating actions on failure.', url: 'https://microservices.io/patterns/data/saga.html', src: 'microservices.io' },
      { slug: 'domain-driven-design', t: 'Domain-Driven Design', d: 'Models software around the business domain\'s own language and boundaries ("bounded contexts") instead of technical layers.', url: 'https://martinfowler.com/bliki/DomainDrivenDesign.html', src: 'Martin Fowler' },
    ],
  },
  {
    name: 'System Design Concepts',
    items: [
      { slug: 'load-balancing', t: 'Load Balancing', d: 'Distributes incoming traffic across multiple servers — round robin, least connections, and other algorithms decide how.', url: 'https://aws.amazon.com/what-is/load-balancing/', src: 'AWS' },
      { slug: 'cap-theorem', t: 'CAP Theorem', d: 'A distributed system can only fully guarantee two of Consistency, Availability, and Partition tolerance at once.', url: 'https://www.ibm.com/topics/cap-theorem', src: 'IBM' },
      { slug: 'consistent-hashing', t: 'Consistent Hashing', d: 'Distributes keys across nodes so adding/removing a node only remaps a small fraction of keys — the trick behind scalable caches and sharded stores.', url: 'https://highscalability.com/consistent-hashing-algorithm/', src: 'High Scalability' },
      { slug: 'rate-limiting', t: 'Rate Limiting', d: 'Token bucket vs sliding window — the two standard algorithms for protecting a system from being overwhelmed.', url: 'https://cloud.google.com/architecture/rate-limiting-strategies-techniques', src: 'Google Cloud Docs' },
      { slug: 'circuit-breaker', t: 'Circuit Breaker', d: 'Stops calling a failing downstream service after enough failures, failing fast instead of piling up timeouts.', url: 'https://martinfowler.com/bliki/CircuitBreaker.html', src: 'Martin Fowler' },
    ],
  },
];

export function backendTopicKey(slug) {
  return 'backend::' + slug;
}

export function totalBackendTopics() {
  return BACKEND_CATEGORIES.reduce((n, c) => n + c.items.length, 0);
}
