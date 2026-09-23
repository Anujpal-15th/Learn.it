// lib/interview-questions-ai.js — AI Engineer interview question bank, same
// shape as lib/interview-questions.js (the Java bank) so the interview page
// can render either with the same component logic. Uses the same
// interviewKey() progress-key helper (imported from lib/interview-questions.js)
// — slugs here are all distinct from the Java bank's, so there's no collision
// even though both sets share one 'interview::' key namespace.

export const INTERVIEW_CATEGORIES_AI = [
  {
    name: 'Python',
    source: { label: 'GeeksforGeeks — Python Interview Questions', url: 'https://www.geeksforgeeks.org/python/python-interview-questions/' },
    items: [
      { slug: 'ai-gil-explain', q: 'What is the GIL, and why does it limit true multithreaded CPU-bound Python code?', d: 'Tests whether you know the GIL affects CPU-bound threads, not I/O-bound or multiprocessing code.' },
      { slug: 'ai-mutable-default', q: 'Why is using a mutable default argument (e.g. def f(x=[])) a bug waiting to happen?', d: 'A classic gotcha — tests whether you understand default arguments are evaluated once, at function definition time.' },
      { slug: 'ai-list-vs-generator', q: 'When would you use a generator instead of returning a list?', d: 'Tests understanding of lazy evaluation and memory trade-offs, relevant for large dataset processing.' },
      { slug: 'ai-decorator-explain', q: 'What is a decorator, and how would you write one that times a function\'s execution?', d: 'Tests understanding of first-class functions and closures, not just decorator syntax.' },
      { slug: 'ai-deep-vs-shallow-copy', q: 'What is the difference between a shallow copy and a deep copy?', d: 'Tests understanding of reference semantics for nested mutable objects.' },
    ],
  },
  {
    name: 'Statistics & Probability',
    source: { label: 'GeeksforGeeks — Statistics Interview Questions', url: 'https://www.geeksforgeeks.org/data-science/statistics-interview-questions-for-data-science/' },
    items: [
      { slug: 'ai-p-value-explain', q: 'What is a p-value, and what is the most common misinterpretation of it?', d: 'Tests whether you know a p-value is not "the probability the null hypothesis is true."' },
      { slug: 'ai-type1-vs-type2', q: 'What is the difference between a Type I and a Type II error?', d: 'Tests understanding of false positive vs false negative in a hypothesis-testing context.' },
      { slug: 'ai-central-limit', q: 'What does the Central Limit Theorem actually say, and why does it matter for ML?', d: 'Tests whether the theorem is understood, not just recited — underlies why sample means behave predictably.' },
      { slug: 'ai-correlation-causation', q: 'Give a real example where two variables are correlated but not causally related.', d: 'Tests critical thinking, one of the most common data-science interview traps.' },
      { slug: 'ai-bias-variance', q: 'Explain the bias-variance trade-off with a concrete modeling example.', d: 'A foundational ML interview question — tests whether you can connect the concept to overfitting/underfitting.' },
    ],
  },
  {
    name: 'Machine Learning',
    source: { label: 'GeeksforGeeks — Machine Learning Interview Questions', url: 'https://www.geeksforgeeks.org/machine-learning/machine-learning-interview-questions/' },
    items: [
      { slug: 'ai-overfitting-fix', q: 'How would you diagnose and fix an overfitting model?', d: 'Tests practical judgment — regularization, more data, simpler model, cross-validation.' },
      { slug: 'ai-precision-recall-tradeoff', q: 'When would you optimize for precision over recall, and vice versa?', d: 'Tests real-world judgment with concrete examples (spam filter vs. cancer screening).' },
      { slug: 'ai-random-forest-vs-boosting', q: 'What is the key difference between bagging (Random Forest) and boosting (XGBoost)?', d: 'Tests understanding of parallel independent trees vs. sequential error-correcting trees.' },
      { slug: 'ai-feature-scaling-why', q: 'Which algorithms require feature scaling, and which don\'t? Why?', d: 'Tests whether you understand distance-based vs. tree-based model assumptions.' },
      { slug: 'ai-cross-validation-why', q: 'Why is a single train/test split often not enough to trust a model\'s reported performance?', d: 'Tests understanding of variance in small-sample evaluation and why k-fold CV is preferred.' },
    ],
  },
  {
    name: 'Deep Learning',
    source: { label: 'GeeksforGeeks — Deep Learning Interview Questions', url: 'https://www.geeksforgeeks.org/deep-learning/deep-learning-interview-questions/' },
    items: [
      { slug: 'ai-vanishing-gradient', q: 'What causes vanishing gradients, and how do modern architectures address it?', d: 'Tests understanding of ReLU, residual connections, and normalization as fixes.' },
      { slug: 'ai-batch-vs-layer-norm', q: 'What is the difference between batch normalization and layer normalization?', d: 'Tests whether you know layer norm doesn\'t depend on batch statistics, which matters for sequence models.' },
      { slug: 'ai-dropout-explain', q: 'How does dropout prevent overfitting, and why is it disabled at inference time?', d: 'Tests understanding of the mechanism, not just "it randomly turns off neurons."' },
      { slug: 'ai-cnn-vs-fc', q: 'Why do CNNs generalize better than fully-connected networks for images?', d: 'Tests understanding of parameter sharing and translation invariance.' },
      { slug: 'ai-adam-vs-sgd', q: 'Why might Adam converge faster than plain SGD, and when might SGD still be preferred?', d: 'Tests real understanding of adaptive learning rates vs. generalization trade-offs.' },
    ],
  },
  {
    name: 'NLP & Transformers',
    source: { label: 'Hugging Face — NLP Course', url: 'https://huggingface.co/learn/nlp-course' },
    items: [
      { slug: 'ai-attention-explain', q: 'Explain self-attention in your own words, without using the word "attention."', d: 'Forces real understanding over memorized vocabulary — a common senior-level framing.' },
      { slug: 'ai-bert-vs-gpt', q: 'What is the architectural difference between BERT and GPT, and why does it matter for their use cases?', d: 'Tests encoder-only vs. decoder-only understanding and task fit.' },
      { slug: 'ai-tokenization-oov', q: 'How does subword tokenization (BPE) handle a word it has never seen before?', d: 'Tests understanding of why modern tokenizers rarely have a true out-of-vocabulary problem.' },
      { slug: 'ai-positional-encoding-why', q: 'Why do Transformers need positional encoding when RNNs don\'t?', d: 'Tests understanding that attention has no inherent notion of sequence order.' },
      { slug: 'ai-fine-tune-vs-prompt', q: 'When would you fine-tune a model instead of just improving your prompt?', d: 'Tests real judgment about cost, data availability, and task complexity trade-offs.' },
    ],
  },
  {
    name: 'LLMs & Generative AI',
    source: { label: 'Prompt Engineering Guide', url: 'https://www.promptingguide.ai/' },
    items: [
      { slug: 'ai-hallucination-explain', q: 'Why do LLMs hallucinate, and what mitigations actually help?', d: 'Tests understanding beyond "the model made something up" — grounding, RAG, and lower temperature as real mitigations.' },
      { slug: 'ai-context-window-tradeoff', q: 'What are the trade-offs of just stuffing more context into a prompt instead of using retrieval?', d: 'Tests cost/latency/relevance-dilution awareness, not just "bigger context is always better."' },
      { slug: 'ai-function-calling-explain', q: 'How does function calling actually work — does the model execute the function?', d: 'A common misconception check — tests whether you know the model only emits the call, your code executes it.' },
      { slug: 'ai-few-shot-why', q: 'Why might few-shot prompting outperform zero-shot for a formatting-sensitive task?', d: 'Tests practical prompt-engineering judgment.' },
      { slug: 'ai-temperature-explain', q: 'What does temperature actually control in generation, mechanically?', d: 'Tests whether you understand it reshapes the output probability distribution before sampling, not just "randomness."' },
    ],
  },
  {
    name: 'RAG',
    source: { label: 'LangChain — RAG Tutorial', url: 'https://python.langchain.com/docs/tutorials/rag/' },
    items: [
      { slug: 'ai-rag-vs-finetune', q: 'When would you choose RAG over fine-tuning to give a model new knowledge?', d: 'Tests real judgment — RAG for frequently-changing/verifiable facts, fine-tuning for behavior/style.' },
      { slug: 'ai-chunk-size-tradeoff', q: 'What happens if your chunk size is too large? Too small?', d: 'Tests understanding of the relevance-dilution vs. lost-context trade-off.' },
      { slug: 'ai-reranking-why', q: 'Why would you add a reranking step after initial vector retrieval?', d: 'Tests understanding that top-k similarity isn\'t always top-k relevance.' },
      { slug: 'ai-embedding-model-mismatch', q: 'What happens if you embed your documents with one model and your queries with another?', d: 'Tests understanding that embedding spaces from different models aren\'t comparable.' },
      { slug: 'ai-rag-eval-approach', q: 'How would you evaluate whether a RAG system is actually retrieving the right information?', d: 'Tests whether you separate retrieval quality from generation quality as two distinct failure modes.' },
    ],
  },
  {
    name: 'AI Agents',
    source: { label: 'LangGraph — Documentation', url: 'https://langchain-ai.github.io/langgraph/' },
    items: [
      { slug: 'ai-agent-vs-chatbot', q: 'What actually makes something an "agent" rather than just a chatbot with a system prompt?', d: 'Tests whether you can articulate the tool-use + loop + decision-making distinction.' },
      { slug: 'ai-agent-loop-failure', q: 'How would you detect and prevent an agent from getting stuck in a repeating loop?', d: 'Tests practical reliability engineering for agentic systems, not just theory.' },
      { slug: 'ai-multi-agent-when', q: 'When does splitting a task across multiple agents actually help, versus adding unnecessary complexity?', d: 'Tests judgment — a common over-engineering trap in agent design.' },
      { slug: 'ai-agent-memory-types', q: 'What is the difference between an agent\'s short-term and long-term memory, and how is each typically implemented?', d: 'Tests understanding of context-window memory vs. persisted vector-store memory.' },
      { slug: 'ai-agent-eval-approach', q: 'How would you evaluate whether an agent is reliable enough to ship?', d: 'Tests whether you think about task completion rate and trace-level correctness, not vibes.' },
    ],
  },
  {
    name: 'ML System Design',
    source: { label: 'GeeksforGeeks — Machine Learning System Design', url: 'https://www.geeksforgeeks.org/machine-learning/machine-learning-system-design/' },
    items: [
      { slug: 'ai-design-recsys', q: 'Design a recommendation system for an e-commerce homepage. What data would you need, and how would you evaluate it offline vs. online?', d: 'A classic ML system design question — tests structured thinking about data, model choice, and evaluation.' },
      { slug: 'ai-design-fraud-detection', q: 'Design a real-time fraud detection system. How would you handle the extreme class imbalance?', d: 'Tests awareness of latency constraints and imbalanced-data techniques together.' },
      { slug: 'ai-design-content-moderation', q: 'Design a content moderation pipeline using an LLM. Where would you put human review?', d: 'Tests practical judgment about LLM reliability limits and human-in-the-loop design.' },
      { slug: 'ai-model-drift-monitoring', q: 'How would you detect that a production model has degraded, without waiting for a business metric to drop?', d: 'Tests understanding of data drift monitoring as an earlier warning signal.' },
      { slug: 'ai-ab-test-model', q: 'How would you A/B test a new model version against the current production model?', d: 'Tests understanding of traffic splitting, guardrail metrics, and rollback criteria.' },
    ],
  },
];
