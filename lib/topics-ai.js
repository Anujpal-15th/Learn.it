// lib/topics-ai.js — the AI Engineer roadmap content, same shape as
// lib/topics.js (the Java Developer roadmap) so every existing helper in
// that file (qid, topicSolved, topicComplete, checklistKey, checklistProgress,
// quizKey, quizProgress) works unmodified against this data too — they only
// ever touch the (topic, progress) pair they're given, never the module-level
// Java TOPICS constant.
//
// Shapes mirror topics.js exactly:
//   PHASES:         [{ name, desc, learnMore? }]                (13)
//   TOPICS:         [{ id, num, phase, title, sub, learnMore?, subtopics, mini, quiz }]
//     subtopics:    [{ title, concepts, learnMore?, checklist, q: [{ t, d, p, u? }] }]
//   PHASE_PROJECTS: [{ title, desc }]                            (13, one per phase)
//   CAPSTONE:       { title, desc }
//
// Practice items are "Build task" style (no invented problem-bank URLs) —
// ML/AI topics aren't LeetCode-shaped, and the existing Java content already
// uses this same pattern for its non-algorithmic topics. learnMore links only
// point at well-known, stable, official documentation roots (python.org,
// numpy.org, pytorch.org, huggingface.co, langchain, fastapi, mlflow, kaggle) —
// never a guessed deep link or invented slug.

export const DIFF = { E: 'Easy', M: 'Medium', H: 'Hard' };

export const PHASES = [
  { name: 'Phase 0 — Python', desc: 'The language every AI/ML library is built on. Get fluent here before NumPy, PyTorch, or anything else asks more of you than the language itself can give.', learnMore: { label: 'Python — The Official Tutorial', url: 'https://docs.python.org/3/tutorial/index.html' } },
  { name: 'Phase 1 — Mathematics', desc: 'Linear algebra, probability, statistics, calculus, and optimization — not to pass an exam, but because every model you\'ll build is these ideas wearing code.', learnMore: { label: 'Khan Academy — Linear Algebra', url: 'https://www.khanacademy.org/math/linear-algebra' } },
  { name: 'Phase 2 — Data', desc: 'Before any model: load it, clean it, look at it, and shape it. Most real ML work happens here, not in the training loop.', learnMore: { label: 'NumPy — Quickstart', url: 'https://numpy.org/doc/stable/user/quickstart.html' } },
  { name: 'Phase 3 — Machine Learning', desc: 'Classical ML — regression through ensembles through unsupervised learning — the toolkit that still solves most real business problems.', learnMore: { label: 'scikit-learn — User Guide', url: 'https://scikit-learn.org/stable/user_guide.html' } },
  { name: 'Phase 4 — Deep Learning', desc: 'Neural networks from the perceptron up through the architectures (CNN, RNN, Transformer) that made modern AI possible.', learnMore: { label: 'CS231n — Convolutional Neural Networks for Visual Recognition', url: 'https://cs231n.github.io/' } },
  { name: 'Phase 5 — PyTorch', desc: 'Turn the theory into working code — tensors, autograd, and the training loop, the concrete skill behind every deep learning project on your resume.', learnMore: { label: 'PyTorch — Tutorials', url: 'https://pytorch.org/tutorials/' } },
  { name: 'Phase 6 — NLP', desc: 'Text is the hardest unstructured data to work with — tokenization through attention through the transformer architectures that now define the field.', learnMore: { label: 'Hugging Face — NLP Course', url: 'https://huggingface.co/learn/nlp-course' } },
  { name: 'Phase 7 — Generative AI', desc: 'Large language models as a product surface — prompting, structured outputs, function calling, and the APIs that put them in an application.', learnMore: { label: 'Prompt Engineering Guide', url: 'https://www.promptingguide.ai/' } },
  { name: 'Phase 8 — RAG', desc: 'Retrieval-Augmented Generation — ground an LLM in your own documents instead of hoping it memorized the answer.', learnMore: { label: 'LangChain — RAG', url: 'https://python.langchain.com/docs/tutorials/rag/' } },
  { name: 'Phase 9 — AI Agents', desc: 'Give a model tools, memory, and a planning loop — the difference between a chatbot and something that actually gets a multi-step task done.', learnMore: { label: 'LangGraph — Documentation', url: 'https://langchain-ai.github.io/langgraph/' } },
  { name: 'Phase 10 — AI Frameworks', desc: 'The libraries that turn everything in Phases 6–9 into shippable code without reinventing it from scratch.', learnMore: { label: 'Hugging Face — Documentation', url: 'https://huggingface.co/docs' } },
  { name: 'Phase 11 — Model Fine-Tuning', desc: 'Adapt a pretrained model to your own data — full fine-tuning, parameter-efficient methods (LoRA/PEFT), and quantization to make it deployable.', learnMore: { label: 'Hugging Face — PEFT', url: 'https://huggingface.co/docs/peft/index' } },
  { name: 'Phase 12 — AI Engineering / MLOps', desc: 'Ship it and keep it alive — serving, experiment tracking, monitoring, CI/CD, and cloud deployment for a model, not just an app.', learnMore: { label: 'MLflow — Documentation', url: 'https://mlflow.org/docs/latest/index.html' } },
];

export const PHASE_PROJECTS = [
  { title: 'Phase Project — CLI Data Analysis Tool', desc: 'A command-line tool (core Python only — functions, OOP, file handling, exception handling, no libraries yet) that ingests a CSV, validates it, and prints a summary report.' },
  { title: 'Phase Project — Math-from-Scratch Toolkit', desc: 'Implement matrix multiplication, a probability simulator (e.g. Monte Carlo estimate of π), and gradient descent on a simple function — in pure Python, no NumPy — to prove you understand the mechanics before a library hides them.' },
  { title: 'Phase Project — Exploratory Data Analysis Report', desc: 'A full EDA notebook on a real public dataset (Kaggle): cleaning, handling missing values, visualizing distributions with Matplotlib, and engineering at least three new features, documented with your reasoning at each step.' },
  { title: 'Phase Project — Customer Churn Predictor', desc: 'A supervised classification model predicting customer churn, comparing at least three algorithms (e.g. logistic regression, random forest, SVM) with proper train/test evaluation, a confusion matrix, and a justified final model choice.' },
  { title: 'Phase Project — Image Classifier', desc: 'A CNN trained from scratch (or via transfer learning) on a real image dataset, with a validation split, a training/loss curve, and an honest discussion of where it misclassifies.' },
  { title: 'Phase Project — Custom Training Loop From Scratch', desc: 'Re-implement Phase 4\'s classifier using raw PyTorch — Datasets, DataLoaders, autograd, and a hand-written training loop with checkpointing — instead of a high-level trainer, to prove you understand what\'s underneath one.' },
  { title: 'Phase Project — Sentiment Analysis System', desc: 'A text classification system (fine-tuned transformer or a classical baseline for comparison) that scores sentiment on real text data, with tokenization, an evaluation report, and a short write-up of where it fails.' },
  { title: 'Phase Project — Prompt-Engineered Content Assistant', desc: 'An application driving an LLM via deliberate prompt design, structured output parsing, and at least one function call — not a raw chat wrapper — for a real, specific task (e.g. structured resume parsing, meeting-notes summarizer).' },
  { title: 'Phase Project — PDF Question Answering System', desc: 'A RAG application: chunk and embed a set of real PDFs, store them in a vector database, retrieve relevant chunks for a question, and generate a grounded answer with citations back to the source pages.' },
  { title: 'Phase Project — Tool-Using Research Agent', desc: 'An agent with at least two real tools (e.g. web search + a calculator or code execution), memory across steps, and a visible plan — able to complete a multi-step research task and explain what it did and why.' },
  { title: 'Phase Project — Multi-Tool LangChain/LangGraph App', desc: 'Rebuild the RAG or agent project on LangChain/LangGraph with Hugging Face models, served behind a FastAPI backend — proving framework fluency, not just raw API calls.' },
  { title: 'Phase Project — Fine-Tuned Domain Model', desc: 'LoRA/PEFT fine-tune an open pretrained model on a narrow, real dataset, then quantize it for local inference — with a before/after comparison against the base model on the same evaluation set.' },
  { title: 'Phase Project — Production AI Application', desc: 'Deploy an AI application (any prior project) with experiment tracking (MLflow), containerization, a CI/CD pipeline, and basic production monitoring (latency, error rate, and at least one model-quality metric) — not just "it runs on my machine."' },
];

export const CAPSTONE = {
  title: 'The Capstone',
  desc:
    'A production-shaped AI capstone: a RAG-grounded, tool-using agent served through a FastAPI backend, backed by a fine-tuned or API-based LLM, containerized, tracked with MLflow, deployed via CI/CD, and monitored in production with real evaluation metrics — every phase on this roadmap applied end to end.',
};

export const TOPICS = [
  // ==================================================================
  // PHASE 0 — PYTHON
  // ==================================================================
  {
    id: 'python-fundamentals', num: 1, phase: 0, title: 'Python Fundamentals',
    sub: 'The language itself: syntax, functions, OOP, modules, environments, exceptions, typing, and async — everything NumPy, PyTorch, and every AI library you\'ll ever import is written on top of.',
    learnMore: { label: 'Python — The Official Tutorial', url: 'https://docs.python.org/3/tutorial/index.html' },
    subtopics: [
      { title: 'Syntax, Variables & Control Flow',
        concepts: [
          'Python is dynamically typed — a variable\'s type is decided at runtime, not declared up front — and indentation itself defines code blocks, not braces.',
          'Core control flow (if/elif/else, for, while, list/dict comprehensions) is more compact than most languages — a comprehension often replaces a full loop.',
          'Everything is an object, including functions and classes themselves — this is why Python supports first-class functions and decorators so naturally.',
        ],
        checklist: ['Dynamic Typing & Variables', 'if/elif/else & Loops', 'List/Dict/Set Comprehensions', 'Mutable vs Immutable Types'],
        q: [
          { t: 'Write a script that reads a list of numbers and reports mean, median, and mode without using a library', d: 'E', p: 'Build task' },
          { t: 'Rewrite a nested for-loop that builds a filtered list as a single comprehension', d: 'E', p: 'Build task' },
          { t: 'Demonstrate the mutable-default-argument pitfall and fix it', d: 'M', p: 'Build task' },
        ] },
      { title: 'Functions & OOP',
        concepts: [
          '*args and **kwargs let a function accept a variable number of positional/keyword arguments — the mechanism behind most flexible library APIs.',
          'A class defines __init__ (constructor) and instance methods; Python supports inheritance and duck typing (if it walks like a duck, no interface required).',
          'Dunder methods (__str__, __eq__, __len__) let your own objects integrate with built-in functions (print, ==, len) — this is how Python "operator overloading" actually works.',
        ],
        learnMore: { label: 'Python — Classes', url: 'https://docs.python.org/3/tutorial/classes.html' },
        checklist: ['Functions, *args & **kwargs', 'Classes & Instance Methods', 'Inheritance & Duck Typing', 'Dunder Methods'],
        q: [
          { t: 'Build a small class hierarchy (e.g. Shape → Circle/Rectangle) with a custom __str__ and __eq__', d: 'E', p: 'Build task' },
          { t: 'Write a function accepting *args and **kwargs and forward them to another function', d: 'E', p: 'Build task' },
          { t: 'Implement a Vector class supporting + and == via dunder methods', d: 'M', p: 'Build task' },
        ] },
      { title: 'Modules, Environments & File Handling',
        concepts: [
          'A module is just a .py file; a package is a directory of modules with an __init__.py — import resolution follows sys.path.',
          'A virtual environment (venv) isolates a project\'s dependencies from the system Python and other projects — never install ML libraries globally.',
          'The with statement (a context manager) guarantees a file is closed even if an exception is raised — the Python equivalent of try-with-resources.',
        ],
        learnMore: { label: 'Python — Virtual Environments', url: 'https://docs.python.org/3/library/venv.html' },
        checklist: ['Modules & Packages', 'Virtual Environments (venv)', 'Reading/Writing Files with `with`', 'pip & requirements.txt'],
        q: [
          { t: 'Split a script into a package with two modules and a clean __init__.py', d: 'E', p: 'Build task' },
          { t: 'Create a venv, install a dependency, and freeze it into requirements.txt', d: 'E', p: 'Build task' },
          { t: 'Write a CSV-processing script using `with` that survives a malformed row without crashing', d: 'M', p: 'Build task' },
        ] },
      { title: 'Exception Handling, Type Hints & Async',
        concepts: [
          'try/except/finally handles errors; catch the specific exception type you expect, not a bare except — the same discipline as any language.',
          'Type hints (def f(x: int) -> str) don\'t change runtime behavior but let tools (mypy, IDEs) catch real bugs before you run the code — and every serious ML codebase uses them.',
          'async/await lets I/O-bound code (API calls, file/network) run concurrently on a single thread — essential once you\'re calling LLM APIs that take seconds to respond.',
        ],
        learnMore: { label: 'Python — asyncio', url: 'https://docs.python.org/3/library/asyncio.html' },
        checklist: ['try/except/finally', 'Custom Exceptions', 'Type Hints (typing module)', 'async/await Basics'],
        q: [
          { t: 'Add type hints to an existing untyped script and fix what mypy flags', d: 'E', p: 'Build task' },
          { t: 'Write an async function that fetches from 3 URLs concurrently instead of sequentially', d: 'M', p: 'Build task' },
          { t: 'Design a custom exception hierarchy for a data-validation pipeline', d: 'M', p: 'Build task' },
        ] },
    ],
    mini: { title: 'Checkpoint Project — CLI CSV Report Tool', desc: 'A typed, exception-safe command-line tool that reads a CSV with `with`, validates rows, and prints a summary — using classes, comprehensions, and proper error handling throughout.' },
    quiz: [
      { q: 'Why is `def f(x=[]):` considered a bug-prone pattern in Python?', options: ['The default list is created once and shared across every call, not recreated each time', 'Lists cannot be used as default arguments at all', 'It causes a syntax error', 'It only affects Python 2, not Python 3'], correct: 0, explanation: 'Default arguments are evaluated once at function definition time — mutating that shared default across calls causes surprising bugs.' },
      { q: 'What does the `with` statement guarantee for a file handle?', options: ['The file is closed automatically even if an exception is raised inside the block', 'The file is opened in read-only mode', 'The file is automatically converted to JSON', 'It prevents the file from being modified'], correct: 0, explanation: 'This is Python\'s context-manager equivalent of try-with-resources — cleanup always runs.' },
      { q: 'What is the main reason to use a virtual environment for a Python project?', options: ['Isolate project dependencies from the system Python and other projects', 'Make the code run faster', 'Automatically write requirements.txt', 'Enable type hints'], correct: 0, explanation: 'Without isolation, installing one project\'s dependencies can silently break another\'s.' },
      { q: 'Why does async/await matter specifically for calling LLM or web APIs?', options: ['It lets I/O-bound waiting happen without blocking other work on the same thread', 'It makes the API respond faster', 'It is required syntax for any HTTP request', 'It replaces the need for error handling'], correct: 0, explanation: 'While waiting on a slow network response, async code can do other useful work instead of blocking.' },
      { q: 'What do Python type hints actually do at runtime?', options: ['Nothing by default — they exist for tooling (mypy, IDEs) to catch bugs before running', 'They enforce strict typing exactly like Java', 'They automatically convert values to the declared type', 'They slow down execution significantly'], correct: 0, explanation: 'Python remains dynamically typed at runtime; type hints are purely a static-analysis and documentation aid.' },
    ],
  },

  // ==================================================================
  // PHASE 1 — MATHEMATICS
  // ==================================================================
  {
    id: 'ai-math', num: 2, phase: 1, title: 'Mathematics for AI',
    sub: 'Linear algebra, probability, statistics, calculus, and optimization — the actual mechanics behind every model you\'ll build, not just the code that calls them.',
    learnMore: { label: 'Khan Academy — Linear Algebra', url: 'https://www.khanacademy.org/math/linear-algebra' },
    subtopics: [
      { title: 'Linear Algebra',
        concepts: [
          'A vector is a list of numbers; a matrix is a table of them — every dataset, weight layer, and embedding in ML is one or the other.',
          'Matrix multiplication is how a neural network layer transforms its input — dimensions must align (n×m times m×p), and this is the single most common shape-mismatch bug in deep learning code.',
          'Eigenvalues/eigenvectors and dot products underlie PCA (dimensionality reduction) and similarity search (cosine similarity) — both come back constantly in RAG and embeddings.',
        ],
        checklist: ['Vectors, Matrices & Tensors', 'Matrix Multiplication & Dot Product', 'Eigenvalues & Eigenvectors', 'Norms & Cosine Similarity'],
        q: [
          { t: 'Implement matrix multiplication by hand (no NumPy) and verify against NumPy\'s result', d: 'E', p: 'Build task' },
          { t: 'Compute cosine similarity between two vectors and explain what it means for embeddings', d: 'E', p: 'Build task' },
          { t: 'Implement PCA on a small dataset using eigendecomposition and explain each step', d: 'H', p: 'Build task' },
        ] },
      { title: 'Probability & Statistics',
        concepts: [
          'Probability distributions (normal, binomial, Bernoulli) model uncertainty — a model\'s output is often a probability distribution, not a single answer.',
          'Mean, variance, and standard deviation describe a dataset\'s center and spread; correlation measures how two variables move together (not causation).',
          'Bayes\' theorem — P(A|B) = P(B|A)P(A)/P(B) — underlies naive Bayes classifiers and how you should reason about model confidence given evidence.',
        ],
        checklist: ['Distributions (Normal, Binomial)', 'Mean, Variance & Standard Deviation', 'Correlation vs Causation', "Bayes' Theorem"],
        q: [
          { t: 'Simulate 10,000 coin flips and plot the resulting binomial distribution', d: 'E', p: 'Build task' },
          { t: 'Given a dataset, compute mean/variance/correlation and interpret what they mean for the business question', d: 'M', p: 'Build task' },
          { t: "Solve a classic Bayes' theorem word problem (e.g. medical test false-positive rate) and explain the intuition", d: 'M', p: 'Build task' },
        ] },
      { title: 'Calculus & Optimization',
        concepts: [
          'A derivative measures how a function\'s output changes as its input changes — gradient descent uses this to know which direction reduces a model\'s error.',
          'The chain rule lets you compute the derivative of a composed function (layer after layer after layer) — this IS backpropagation, mathematically.',
          'Gradient descent repeatedly steps opposite the gradient to minimize a loss function; the learning rate controls step size — too high overshoots, too low never converges.',
        ],
        learnMore: { label: 'Khan Academy — Calculus 1', url: 'https://www.khanacademy.org/math/calculus-1' },
        checklist: ['Derivatives & the Chain Rule', 'Partial Derivatives & Gradients', 'Gradient Descent', 'Convex vs Non-Convex Optimization'],
        q: [
          { t: 'Implement gradient descent from scratch to minimize a simple quadratic function', d: 'M', p: 'Build task' },
          { t: 'Manually compute the chain-rule derivative for a 2-layer function composition and verify with code', d: 'M', p: 'Build task' },
          { t: 'Plot loss vs. learning rate for gradient descent on the same function to show overshoot vs. slow convergence', d: 'M', p: 'Build task' },
        ] },
    ],
    mini: { title: 'Checkpoint Project — Gradient Descent Visualizer', desc: 'A from-scratch (no ML library) implementation of gradient descent on a 2D loss surface, plotting the descent path for several learning rates to show convergence, overshoot, and divergence.' },
    quiz: [
      { q: 'What does matrix multiplication compute that a neural network layer relies on?', options: ['A linear transformation of the input by a set of learned weights', 'The average of two matrices', 'A sorting operation over the input', 'A random projection with no learned component'], correct: 0, explanation: 'Each layer\'s forward pass is fundamentally a matrix multiply (plus bias and activation) transforming the input.' },
      { q: 'What does cosine similarity measure between two embedding vectors?', options: ['The angle between them, capturing directional similarity regardless of magnitude', 'Their exact Euclidean distance', 'Whether they have the same number of dimensions', 'The sum of their values'], correct: 0, explanation: 'Cosine similarity ignores vector length and focuses purely on direction — the standard metric for embedding similarity.' },
      { q: 'What does a derivative tell you in the context of gradient descent?', options: ['How the loss changes as a parameter changes, indicating which direction reduces it', 'The exact minimum of the function', 'The total number of training examples needed', 'Whether the model has overfit'], correct: 0, explanation: 'Gradient descent repeatedly steps opposite the gradient because that\'s the direction of steepest decrease.' },
      { q: 'What happens if the learning rate in gradient descent is set too high?', options: ['The parameter updates can overshoot the minimum and fail to converge, or diverge', 'Training becomes perfectly accurate immediately', 'It has no effect on convergence', 'It only affects the first training step'], correct: 0, explanation: 'Too large a step size can bounce past the minimum repeatedly instead of settling into it.' },
      { q: 'What is the chain rule used for in the context of neural networks?', options: ['Computing the derivative of a composed function — the mathematical basis of backpropagation', 'Randomly initializing weights', 'Choosing the batch size', 'Normalizing input features'], correct: 0, explanation: 'A network is a composition of functions (layer after layer); the chain rule is how you differentiate through all of them.' },
    ],
  },

  // ==================================================================
  // PHASE 2 — DATA
  // ==================================================================
  {
    id: 'data-tools', num: 3, phase: 2, title: 'Data — NumPy, Pandas & EDA',
    sub: 'Before any model: load real data, clean it, look at it, and shape it. This is where most real ML work actually happens.',
    learnMore: { label: 'Pandas — User Guide', url: 'https://pandas.pydata.org/docs/user_guide/index.html' },
    subtopics: [
      { title: 'NumPy — Arrays & Vectorized Operations',
        concepts: [
          'A NumPy array is a fixed-type, contiguous block of memory — operations on it run in compiled C, not the Python interpreter, which is why it\'s orders of magnitude faster than a Python loop.',
          'Broadcasting lets NumPy apply an operation between arrays of different (but compatible) shapes without writing an explicit loop.',
          'Vectorize everything you can — a for-loop over array elements in Python is almost always the wrong answer once NumPy is available.',
        ],
        learnMore: { label: 'NumPy — Quickstart', url: 'https://numpy.org/doc/stable/user/quickstart.html' },
        checklist: ['ndarray Basics & dtypes', 'Broadcasting', 'Vectorized Operations vs Loops', 'Indexing & Slicing'],
        q: [
          { t: 'Rewrite a Python-loop-based computation (e.g. normalize a list of numbers) as a vectorized NumPy operation', d: 'E', p: 'Build task' },
          { t: 'Benchmark a loop vs. a vectorized NumPy equivalent on 1M elements and report the speedup', d: 'M', p: 'Build task' },
        ] },
      { title: 'Pandas — DataFrames',
        concepts: [
          'A DataFrame is a labeled 2D table (rows + named columns) — the standard structure for tabular data in Python, built on top of NumPy.',
          'groupby + aggregation (mean, sum, count) is how you answer "what\'s the average X per Y" without writing manual loops.',
          'merge/join combines DataFrames on a key, the same concept as a SQL join — most real analysis pulls data from more than one table.',
        ],
        checklist: ['DataFrames & Series', 'Filtering, groupby & Aggregation', 'merge/join', 'Reading/Writing CSV, JSON, Parquet'],
        q: [
          { t: 'Load a real CSV dataset and answer 5 concrete questions about it using groupby/filter', d: 'E', p: 'Build task' },
          { t: 'Merge two related DataFrames on a shared key and handle the resulting missing values', d: 'M', p: 'Build task' },
        ] },
      { title: 'Visualization with Matplotlib',
        concepts: [
          'A histogram shows a single variable\'s distribution; a scatter plot shows the relationship between two — pick the chart type based on the question, not habit.',
          'Always label axes and add a title — an unlabeled chart in a report is a chart nobody can trust.',
          'Visualize BEFORE modeling — a scatter plot often reveals an outlier or a non-linear relationship no summary statistic would show you.',
        ],
        learnMore: { label: 'Matplotlib — Tutorials', url: 'https://matplotlib.org/stable/tutorials/index.html' },
        checklist: ['Histograms & Distributions', 'Scatter Plots & Correlation', 'Line Charts for Trends', 'Subplots & Labeling'],
        q: [
          { t: 'Plot the distribution of every numeric column in a dataset as a grid of histograms', d: 'E', p: 'Build task' },
          { t: 'Build a scatter plot revealing a relationship a summary table alone wouldn\'t show', d: 'M', p: 'Build task' },
        ] },
      { title: 'Data Cleaning, EDA & Feature Engineering',
        concepts: [
          'Missing data isn\'t automatically wrong data — decide per-column whether to drop, fill (mean/median/mode), or flag it as missing, based on what the column means.',
          'Exploratory Data Analysis (EDA) means understanding a dataset\'s shape, distributions, and relationships BEFORE modeling — skipping this is the #1 cause of a model that fails silently.',
          'Feature engineering — encoding categories, scaling numeric ranges, creating ratios/interactions — usually improves a model more than switching algorithms does.',
        ],
        checklist: ['Handling Missing Data', 'Outlier Detection', 'Categorical Encoding (one-hot, label)', 'Feature Scaling & New Feature Creation'],
        q: [
          { t: 'Clean a messy real-world dataset (missing values, inconsistent categories, outliers) and document every decision', d: 'M', p: 'Build task' },
          { t: 'Engineer at least three new features from an existing dataset and justify each one', d: 'M', p: 'Build task' },
          { t: 'Pick a dataset from Kaggle and produce a full EDA notebook with at least 5 findings', d: 'H', p: 'Kaggle', u: 'https://www.kaggle.com/datasets' },
        ] },
    ],
    mini: { title: 'Checkpoint Project — Full EDA Report', desc: 'A cleaned, feature-engineered, fully visualized EDA notebook on a real public dataset, ending in a written summary of the dataset\'s most important patterns.' },
    quiz: [
      { q: 'Why is a NumPy vectorized operation typically much faster than an equivalent Python for-loop?', options: ['It runs in compiled C over contiguous memory instead of the Python interpreter loop', 'NumPy uses a different programming language entirely', 'Python loops are disabled when NumPy is imported', 'Vectorized operations use less precision'], correct: 0, explanation: 'NumPy pushes the loop down into fast compiled code, avoiding per-element Python interpreter overhead.' },
      { q: 'What does a Pandas groupby + aggregation let you compute?', options: ['A summary statistic (mean, sum, count) per category without a manual loop', 'A join between two unrelated files', 'A random sample of the DataFrame', 'A new column with no relation to existing data'], correct: 0, explanation: 'groupby splits data into groups by a key, then applies an aggregation to each group — the SQL GROUP BY equivalent.' },
      { q: 'Why should you visualize data BEFORE modeling it?', options: ['A chart can reveal outliers or non-linear relationships a summary statistic would hide', 'Visualization is required by scikit-learn', 'It replaces the need for a train/test split', 'Models cannot be built without a chart first'], correct: 0, explanation: 'EDA catches problems (skew, outliers, weird distributions) that would otherwise silently degrade a model.' },
      { q: 'When is it appropriate to fill missing numeric data with the median instead of the mean?', options: ['When the column has outliers that would skew the mean', 'Never — mean is always correct', 'Only for categorical columns', 'Only when there are no missing values'], correct: 0, explanation: 'The median is robust to outliers, making it a safer fill value for skewed distributions.' },
      { q: 'What is target/data leakage in a machine learning pipeline?', options: ['Accidentally including information at training time that wouldn\'t be available at prediction time', 'A memory leak in the training loop', 'Sharing training data between two projects', 'Using too many features'], correct: 0, explanation: 'Leakage makes a model look great in testing and then fail in production, because it "cheated" using future/target-derived information.' },
    ],
  },

  // ==================================================================
  // PHASE 3 — MACHINE LEARNING
  // ==================================================================
  {
    id: 'ml-supervised', num: 4, phase: 3, title: 'Machine Learning — Supervised Learning',
    sub: 'Regression, classification, and the tree-based/margin-based/instance-based models that still solve most real-world prediction problems.',
    learnMore: { label: 'scikit-learn — Supervised Learning', url: 'https://scikit-learn.org/stable/supervised_learning.html' },
    subtopics: [
      { title: 'Regression',
        concepts: [
          'Linear regression predicts a continuous number as a weighted sum of features — simple, interpretable, and the right first model to try before anything fancier.',
          'It\'s fit by minimizing a loss function (typically mean squared error) via gradient descent or a closed-form solution.',
          'Regularization (L1/Lasso, L2/Ridge) penalizes large weights to prevent overfitting — L1 can zero out features entirely (feature selection), L2 shrinks them smoothly.',
        ],
        checklist: ['Linear Regression', 'Mean Squared Error & R²', 'Ridge (L2) & Lasso (L1) Regularization', 'Polynomial Regression & Overfitting'],
        q: [
          { t: 'Fit a linear regression on a real dataset (e.g. house prices) and interpret the coefficients', d: 'E', p: 'Build task' },
          { t: 'Compare Ridge vs Lasso on the same dataset and explain which features Lasso zeroed out', d: 'M', p: 'Build task' },
        ] },
      { title: 'Classification',
        concepts: [
          'Logistic regression predicts a probability (via the sigmoid function) for a binary outcome, not a raw number — it\'s a classifier, not a regressor, despite the name.',
          'A decision boundary is the line/surface separating predicted classes — visualize it to build intuition for how a classifier is actually "thinking."',
          'Class imbalance (99% negative, 1% positive) breaks naive accuracy as a metric — a model that always predicts "no" looks 99% accurate and is useless.',
        ],
        checklist: ['Logistic Regression & Sigmoid', 'Decision Boundaries', 'Class Imbalance', 'Multi-Class Classification (one-vs-rest)'],
        q: [
          { t: 'Build a binary classifier on an imbalanced dataset and show why accuracy alone is misleading', d: 'M', p: 'Build task' },
          { t: 'Plot the decision boundary of a logistic regression model on a 2-feature dataset', d: 'M', p: 'Build task' },
        ] },
      { title: 'Tree-Based & Ensemble Models',
        concepts: [
          'A decision tree splits data on the feature/threshold that best separates classes at each step — interpretable, but prone to overfitting if left unpruned.',
          'Random Forest trains many decision trees on random subsets of data/features and averages their votes — the single most reliable "default" model for tabular data.',
          'Boosting (the idea behind XGBoost/LightGBM) trains trees sequentially, each one correcting the previous ones\' errors — usually beats a plain random forest on structured data.',
        ],
        checklist: ['Decision Trees & Splitting Criteria', 'Random Forest (Bagging)', 'Gradient Boosting (concept)', 'Feature Importance'],
        q: [
          { t: 'Train a decision tree and a random forest on the same dataset and compare accuracy + overfitting', d: 'M', p: 'Build task' },
          { t: 'Extract and plot feature importances from a random forest to explain what drives its predictions', d: 'M', p: 'Build task' },
        ] },
      { title: 'SVM & KNN',
        concepts: [
          'Support Vector Machines find the decision boundary with the maximum margin between classes — the kernel trick lets it separate data that isn\'t linearly separable in the original feature space.',
          'K-Nearest Neighbors classifies a point by majority vote of its K closest training points — no training phase, but slow prediction on large datasets.',
          'Both are sensitive to feature scale — always standardize/normalize features before using either.',
        ],
        checklist: ['SVM & the Kernel Trick', 'K-Nearest Neighbors', 'Choosing K', 'Feature Scaling Sensitivity'],
        q: [
          { t: 'Train an SVM with a linear vs. RBF kernel on the same non-linearly-separable dataset and compare', d: 'M', p: 'Build task' },
          { t: 'Sweep K for a KNN classifier and plot accuracy vs. K to find the sweet spot', d: 'M', p: 'Build task' },
        ] },
    ],
    mini: { title: 'Checkpoint Project — Model Comparison Report', desc: 'Train logistic regression, random forest, and SVM on the same classification dataset, evaluate all three with the same metrics, and write a justified recommendation for which to ship.' },
    quiz: [
      { q: 'Why is logistic regression used for classification despite having "regression" in its name?', options: ['It outputs a probability via the sigmoid function, which is thresholded into a class', 'It only works on continuous targets', 'It is identical to linear regression', 'It cannot output probabilities'], correct: 0, explanation: 'Its output is a probability between 0 and 1, making it a classifier — the name is historical, not descriptive of its use.' },
      { q: 'Why is accuracy a misleading metric on a highly imbalanced dataset?', options: ['A model that always predicts the majority class can score high accuracy while being useless', 'Accuracy cannot be computed for imbalanced data', 'Imbalanced datasets always have 50/50 splits', 'Accuracy only applies to regression problems'], correct: 0, explanation: 'On a 99%/1% split, always predicting the majority class gives 99% accuracy while catching zero of the minority class.' },
      { q: 'What is the main idea behind Random Forest (bagging)?', options: ['Train many decision trees on random subsets of data/features and average their votes', 'Train one very deep single tree', 'Sequentially correct each tree\'s errors', 'Use only the single best-performing tree'], correct: 0, explanation: 'Averaging many diverse, independently-trained trees reduces the overfitting a single deep tree is prone to.' },
      { q: 'Why must SVM and KNN features typically be scaled before training?', options: ['Both rely on distances/margins, so features with larger ranges would dominate the calculation', 'Scaling is required by Python syntax', 'They only accept values between 0 and 1', 'Scaling speeds up tree-based models the same way'], correct: 0, explanation: 'Tree-based models split on thresholds and don\'t need scaling, but distance-based models are sensitive to feature scale.' },
      { q: 'What does L1 (Lasso) regularization do that L2 (Ridge) doesn\'t?', options: ['It can shrink some feature weights exactly to zero, performing feature selection', 'It always outperforms L2 in every case', 'It only works with classification, not regression', 'It removes the need for a train/test split'], correct: 0, explanation: 'L1\'s penalty shape can zero out weights entirely, while L2 shrinks them smoothly toward (but not to) zero.' },
    ],
  },
  {
    id: 'ml-unsupervised', num: 5, phase: 3, title: 'Machine Learning — Unsupervised Learning & Evaluation',
    sub: 'Finding structure without labels, reducing dimensionality, and — the part every ML project actually depends on — evaluating a model honestly.',
    learnMore: { label: 'scikit-learn — Model Evaluation', url: 'https://scikit-learn.org/stable/model_selection.html' },
    subtopics: [
      { title: 'Clustering',
        concepts: [
          'K-Means partitions data into K clusters by iteratively assigning points to the nearest centroid and recomputing centroids — you choose K up front.',
          'The elbow method (plotting within-cluster variance vs. K) is a common, imperfect heuristic for picking K.',
          'Hierarchical clustering builds a tree of nested clusters — useful when you don\'t want to commit to a fixed K in advance.',
        ],
        checklist: ['K-Means Clustering', 'Choosing K (Elbow Method)', 'Hierarchical Clustering', 'Cluster Evaluation (Silhouette Score)'],
        q: [
          { t: 'Cluster a real dataset with K-Means and use the elbow method to justify your choice of K', d: 'M', p: 'Build task' },
          { t: 'Compare K-Means clusters against known labels (if available) using silhouette score', d: 'M', p: 'Build task' },
        ] },
      { title: 'Dimensionality Reduction',
        concepts: [
          'PCA projects high-dimensional data onto the directions (principal components) of greatest variance — used for visualization, noise reduction, and speeding up downstream models.',
          't-SNE/UMAP are non-linear reduction techniques better suited for visualization than PCA, at the cost of not preserving global distances meaningfully.',
          'Reducing dimensions trades some information for speed and reduced overfitting risk — always check how much variance is retained.',
        ],
        checklist: ['PCA — Principal Component Analysis', 'Explained Variance', 't-SNE / UMAP for Visualization', 'Curse of Dimensionality'],
        q: [
          { t: 'Reduce a high-dimensional dataset to 2D with PCA and visualize it colored by class', d: 'M', p: 'Build task' },
          { t: 'Compare PCA vs. t-SNE visualizations of the same dataset and explain the difference in what each preserves', d: 'H', p: 'Build task' },
        ] },
      { title: 'Feature Engineering for Modeling',
        concepts: [
          'Feature engineering choices interact with the model you\'re using — trees don\'t need scaling, but SVM/KNN/linear models do.',
          'Interaction features (multiplying/combining two existing features) can expose a relationship a linear model couldn\'t otherwise capture.',
          'Leakage — accidentally including information that wouldn\'t be available at prediction time — is the most common cause of a model that looks great in testing and fails in production.',
        ],
        checklist: ['Interaction Features', 'Target/Data Leakage', 'Feature Selection Methods', 'Pipelines (scikit-learn Pipeline)'],
        q: [
          { t: 'Find and fix a deliberately-introduced data leakage bug in a given training pipeline', d: 'H', p: 'Build task' },
          { t: 'Build a scikit-learn Pipeline combining preprocessing + model so train/test transforms can\'t leak', d: 'M', p: 'Build task' },
        ] },
      { title: 'Model Evaluation & Metrics',
        concepts: [
          'Accuracy, precision, recall, and F1 each tell a different story — precision matters when false positives are costly, recall when false negatives are.',
          'A confusion matrix shows exactly which classes get confused with which — always look at it, not just one summary number.',
          'Cross-validation (k-fold) gives a more honest performance estimate than a single train/test split, especially on small datasets.',
        ],
        checklist: ['Precision, Recall & F1', 'Confusion Matrix', 'ROC Curve & AUC', 'k-Fold Cross-Validation'],
        q: [
          { t: 'Compute precision/recall/F1 for a classifier and explain which metric matters most for the specific problem', d: 'M', p: 'Build task' },
          { t: 'Run 5-fold cross-validation on a model and report the mean and standard deviation of the score', d: 'M', p: 'Build task' },
        ] },
    ],
    mini: { title: 'Checkpoint Project — Customer Segmentation', desc: 'A K-Means clustering project on real customer data — with PCA visualization, a justified choice of K, and a written profile of each resulting segment.' },
    quiz: [
      { q: 'What is the key difference between K-Means clustering and classification?', options: ['K-Means finds groups without any labels; classification learns from labeled examples', 'They are the same algorithm with different names', 'K-Means requires labeled data to run', 'Classification always uses more clusters than K-Means'], correct: 0, explanation: 'Clustering is unsupervised — there\'s no ground-truth label to learn from, only structure to discover.' },
      { q: 'What does PCA (Principal Component Analysis) do?', options: ['Projects high-dimensional data onto the directions of greatest variance', 'Removes all outliers from a dataset', 'Trains a classifier on reduced data automatically', 'Clusters data into a fixed number of groups'], correct: 0, explanation: 'PCA is a dimensionality-reduction technique used for visualization, noise reduction, and speeding up downstream models.' },
      { q: 'What does the "curse of dimensionality" refer to?', options: ['As dimensions increase, data becomes sparse and distance-based methods become less meaningful', 'Having too many rows in a dataset', 'A bug specific to Python\'s scikit-learn', 'Needing more RAM to store integers'], correct: 0, explanation: 'In very high dimensions, most points end up roughly equidistant from each other, breaking distance-based intuition.' },
      { q: 'What is a common, if imperfect, heuristic for choosing K in K-Means?', options: ['The elbow method — plotting within-cluster variance against K', 'Always setting K equal to the number of features', 'Always using K=2', 'Choosing K based on the dataset\'s file size'], correct: 0, explanation: 'The "elbow" in the variance-vs-K plot suggests a point of diminishing returns from adding more clusters.' },
      { q: 'Why might t-SNE be preferred over PCA specifically for visualization?', options: ['t-SNE can capture non-linear structure that PCA (a linear method) would miss', 'PCA cannot be plotted in 2D', 't-SNE preserves exact global distances better than PCA', 't-SNE is faster to compute on large datasets'], correct: 0, explanation: 't-SNE trades global distance preservation for revealing local, non-linear cluster structure — useful for visualization, less so for downstream distance-based computation.' },
    ],
  },

  // ==================================================================
  // PHASE 4 — DEEP LEARNING
  // ==================================================================
  {
    id: 'dl-foundations', num: 6, phase: 4, title: 'Deep Learning — Neural Network Foundations',
    sub: 'From the single perceptron to backpropagation, activation/loss functions, and optimizers — the mechanics underneath every deep learning architecture.',
    learnMore: { label: 'Deep Learning Book — Chapter 6', url: 'https://www.deeplearningbook.org/contents/mlp.html' },
    subtopics: [
      { title: 'Perceptron & Neural Network Basics',
        concepts: [
          'A perceptron computes a weighted sum of inputs plus a bias, then applies an activation function — stack many of these into layers and you have a neural network.',
          'A single-layer perceptron can only learn linearly separable patterns; hidden layers with non-linear activations are what let a network learn complex functions.',
          'Forward propagation is just: input → weighted sums + activations, layer by layer → output.',
        ],
        checklist: ['The Perceptron', 'Layers & Forward Propagation', 'Why Non-Linearity Matters', 'Universal Approximation (intuition)'],
        q: [
          { t: 'Implement a single perceptron from scratch and show it fails on a non-linearly-separable dataset (e.g. XOR)', d: 'M', p: 'Build task' },
          { t: 'Implement forward propagation through a 2-layer network by hand with NumPy', d: 'M', p: 'Build task' },
        ] },
      { title: 'Backpropagation & Gradient Descent',
        concepts: [
          'Backpropagation computes the gradient of the loss with respect to every weight, using the chain rule, working backward from the output layer.',
          'Stochastic gradient descent (SGD) updates weights using one (or a mini-batch of) example(s) at a time instead of the whole dataset — noisier, but far faster per step.',
          'Vanishing/exploding gradients happen when repeated multiplication through many layers shrinks or blows up the gradient — a major reason deep networks were historically hard to train.',
        ],
        checklist: ['Backpropagation (Chain Rule)', 'Batch vs Mini-Batch vs Stochastic GD', 'Vanishing/Exploding Gradients', 'Learning Rate Schedules'],
        q: [
          { t: 'Implement backpropagation by hand for a 2-layer network and verify gradients against PyTorch autograd', d: 'H', p: 'Build task' },
          { t: 'Demonstrate vanishing gradients in a deep sigmoid network vs. a ReLU network', d: 'H', p: 'Build task' },
        ] },
      { title: 'Activation & Loss Functions',
        concepts: [
          'ReLU (max(0, x)) is the default hidden-layer activation — simple, fast, and avoids the vanishing-gradient problem sigmoid/tanh have.',
          'Softmax converts raw output scores into a probability distribution over classes — the standard final layer for multi-class classification.',
          'Cross-entropy loss is the standard loss for classification; MSE is standard for regression — using the wrong one for the task is a common beginner bug.',
        ],
        checklist: ['ReLU, Sigmoid & Tanh', 'Softmax', 'Cross-Entropy Loss', 'When to Use Which Loss'],
        q: [
          { t: 'Plot ReLU, sigmoid, and tanh side by side and explain when each is (and isn\'t) appropriate', d: 'E', p: 'Build task' },
          { t: 'Implement cross-entropy loss from scratch and verify it matches PyTorch\'s built-in version', d: 'M', p: 'Build task' },
        ] },
      { title: 'Optimizers',
        concepts: [
          'Momentum accumulates a moving average of past gradients to smooth out noisy updates and speed convergence.',
          'Adam combines momentum with per-parameter adaptive learning rates — the default choice for most deep learning training in practice.',
          'An optimizer\'s learning rate is the single most impactful hyperparameter to tune — too high diverges, too low wastes compute.',
        ],
        checklist: ['SGD with Momentum', 'Adam Optimizer', 'Learning Rate Tuning', 'Overfitting: Dropout & Weight Decay'],
        q: [
          { t: 'Train the same small network with SGD vs. Adam and compare convergence speed', d: 'M', p: 'Build task' },
          { t: 'Add dropout to a network showing overfitting and show the validation curve improve', d: 'M', p: 'Build task' },
        ] },
    ],
    mini: { title: 'Checkpoint Project — Neural Network From Scratch', desc: 'A fully-connected neural network (forward pass, backprop, and an Adam-style optimizer) implemented in raw NumPy — no PyTorch/TensorFlow — trained on a small classification dataset.' },
    quiz: [
      { q: 'Why can\'t a single-layer perceptron learn a pattern like XOR?', options: ['XOR isn\'t linearly separable, and a perceptron with no hidden layer can only draw a straight decision boundary', 'XOR requires more training data than any dataset provides', 'Perceptrons cannot process binary inputs', 'XOR is only solvable with unsupervised learning'], correct: 0, explanation: 'This limitation of single-layer perceptrons is exactly why hidden layers with non-linear activations matter.' },
      { q: 'What does backpropagation compute?', options: ['The gradient of the loss with respect to every weight, via the chain rule, working backward from the output', 'The forward pass output of a network', 'A random initialization for weights', 'The optimal learning rate automatically'], correct: 0, explanation: 'Backprop is the chain-rule computation that tells you how to adjust each weight to reduce the loss.' },
      { q: 'Why is ReLU generally preferred over sigmoid as a hidden-layer activation in deep networks?', options: ['It avoids the vanishing-gradient problem that repeated sigmoid multiplications cause', 'It always outputs values between 0 and 1', 'It is slower but more accurate', 'Sigmoid cannot be used in any neural network'], correct: 0, explanation: 'Sigmoid\'s gradient shrinks toward the extremes, and multiplying many small gradients across layers can vanish to near-zero.' },
      { q: 'What is the role of the Adam optimizer compared to plain SGD?', options: ['It combines momentum with per-parameter adaptive learning rates, often converging faster', 'It removes the need for a loss function', 'It only works for convolutional networks', 'It guarantees finding the global minimum'], correct: 0, explanation: 'Adam adapts its step size per parameter and smooths noisy gradients — a common default in practice.' },
      { q: 'Why is cross-entropy loss standard for classification instead of MSE?', options: ['It is specifically shaped to penalize wrong-confident predictions on probability outputs', 'MSE cannot be computed for classification at all', 'Cross-entropy is always numerically smaller', 'They are mathematically identical for classification'], correct: 0, explanation: 'Cross-entropy is derived from probability theory and produces better gradients for classification than MSE, which is built for continuous targets.' },
    ],
  },
  {
    id: 'dl-architectures', num: 7, phase: 4, title: 'Deep Learning — Architectures',
    sub: 'CNNs for images, RNNs/LSTMs for sequences, and the Transformer — the three architecture families behind almost every modern deep learning system.',
    learnMore: { label: 'CS231n — Convolutional Networks', url: 'https://cs231n.github.io/convolutional-networks/' },
    subtopics: [
      { title: 'Convolutional Neural Networks (CNNs)',
        concepts: [
          'A convolutional layer slides a small learned filter across the input, detecting local patterns (edges, textures) regardless of where they appear in the image.',
          'Pooling layers (max pooling) downsample the feature map, reducing computation and giving some translation invariance.',
          'Stacking conv → pool blocks builds up from simple local features (edges) to complex ones (shapes, objects) the deeper you go.',
        ],
        checklist: ['Convolution & Filters', 'Pooling Layers', 'CNN Architecture (Conv → Pool → FC)', 'Data Augmentation for Images'],
        q: [
          { t: 'Implement a 2D convolution operation from scratch on a small image and compare against a library function', d: 'M', p: 'Build task' },
          { t: 'Train a small CNN on an image classification dataset and visualize its learned filters', d: 'H', p: 'Build task' },
        ] },
      { title: 'RNNs & LSTMs',
        concepts: [
          'A Recurrent Neural Network processes a sequence step by step, carrying a hidden state forward — built for data where order matters (text, time series).',
          'Plain RNNs suffer badly from vanishing gradients over long sequences — they effectively "forget" early context.',
          'LSTMs add gates (forget/input/output) that let the network learn what to remember and what to discard, fixing the long-range dependency problem RNNs have.',
        ],
        checklist: ['Recurrent Neural Networks (RNN)', 'The Vanishing Gradient Problem in RNNs', 'LSTM Gates', 'Sequence-to-Sequence Basics'],
        q: [
          { t: 'Train a simple RNN on a toy sequence prediction task and show it failing on long sequences', d: 'M', p: 'Build task' },
          { t: 'Train an LSTM on the same task and compare its performance on long-range dependencies', d: 'M', p: 'Build task' },
        ] },
      { title: 'Transformer Architectures (Introduction)',
        concepts: [
          'The Transformer replaced recurrence with self-attention — every token can directly attend to every other token in the sequence, in parallel, solving RNN\'s long-range and speed problems at once.',
          'Positional encoding injects order information back in, since attention itself has no notion of sequence position.',
          'This architecture (detailed further in the NLP phase) is the foundation of BERT, GPT, and essentially every modern language model.',
        ],
        learnMore: { label: 'The Illustrated Transformer', url: 'https://jalammar.github.io/illustrated-transformer/' },
        checklist: ['Self-Attention (Intuition)', 'Positional Encoding', 'Encoder vs Decoder Blocks', 'Why Transformers Replaced RNNs'],
        q: [
          { t: 'Read the "Attention Is All You Need" abstract and diagram the encoder-decoder architecture in your own words', d: 'E', p: 'Paper', u: 'https://arxiv.org/abs/1706.03762' },
          { t: 'Implement scaled dot-product attention from scratch on a toy sequence', d: 'H', p: 'Build task' },
        ] },
    ],
    mini: { title: 'Checkpoint Project — Image Classifier', desc: 'A CNN (from scratch or via transfer learning) trained on a real image dataset, with a training/validation loss curve and an honest error analysis of its worst misclassifications.' },
    quiz: [
      { q: 'What does a convolutional layer detect, mechanically?', options: ['Local patterns via a small learned filter slid across the input, regardless of position', 'The entire image at once as a single feature', 'Only edges, never textures or shapes', 'Randomly selected pixels'], correct: 0, explanation: 'The same filter is applied across the whole image, which is why CNNs generalize well to translated versions of a pattern.' },
      { q: 'What does a pooling layer (e.g. max pooling) accomplish?', options: ['Downsamples the feature map, reducing computation and adding some translation invariance', 'Increases the image resolution', 'Removes color channels', 'Replaces the need for convolution entirely'], correct: 0, explanation: 'Pooling shrinks the spatial dimensions while keeping the strongest signal, which also makes small shifts less impactful.' },
      { q: 'Why do plain RNNs struggle with long sequences?', options: ['Vanishing gradients over many time steps cause them to effectively "forget" early context', 'RNNs cannot process sequences longer than 10 items', 'They require labeled data for every time step', 'RNNs can only process images, not sequences'], correct: 0, explanation: 'The repeated multiplication through time steps shrinks gradients from distant past inputs toward zero.' },
      { q: 'What problem do LSTM gates solve that a plain RNN cell doesn\'t?', options: ['They let the network learn what to remember and what to discard over long sequences', 'They make training require no labeled data', 'They eliminate the need for backpropagation', 'They convert the RNN into a CNN'], correct: 0, explanation: 'The forget/input/output gates give an LSTM explicit control over its memory, fixing the long-range dependency problem.' },
      { q: 'What core mechanism let Transformers replace RNNs for most sequence tasks?', options: ['Self-attention lets every token attend to every other token directly, in parallel', 'Transformers process one token at a time like RNNs, just faster hardware', 'Transformers only work on images', 'Transformers eliminate the need for training data'], correct: 0, explanation: 'Removing recurrence in favor of parallel self-attention solved both RNNs\' long-range dependency and training-speed problems at once.' },
    ],
  },

  // ==================================================================
  // PHASE 5 — PYTORCH
  // ==================================================================
  {
    id: 'pytorch', num: 8, phase: 5, title: 'PyTorch',
    sub: 'Turning deep learning theory into working code — tensors, autograd, datasets, and the training loop, the concrete skill every deep learning project actually runs on.',
    learnMore: { label: 'PyTorch — Tutorials', url: 'https://pytorch.org/tutorials/' },
    subtopics: [
      { title: 'Tensors & Autograd',
        concepts: [
          'A PyTorch tensor is like a NumPy array but can track gradients and run on a GPU — the fundamental data structure of the whole framework.',
          'requires_grad=True tells PyTorch to build a computation graph for a tensor; calling .backward() automatically computes gradients via that graph.',
          'Autograd is what makes backpropagation "free" — you never hand-derive gradients in PyTorch, you just define the forward pass.',
        ],
        learnMore: { label: 'PyTorch — Autograd Tutorial', url: 'https://pytorch.org/tutorials/beginner/blitz/autograd_tutorial.html' },
        checklist: ['Tensor Basics & Operations', 'requires_grad & .backward()', 'The Computation Graph', 'CPU vs GPU Tensors'],
        q: [
          { t: 'Create tensors, run a small computation, and call .backward() to inspect the resulting gradients', d: 'E', p: 'Build task' },
          { t: 'Move a training script from CPU tensors to GPU tensors and confirm correctness is unchanged', d: 'M', p: 'Build task' },
        ] },
      { title: 'Datasets & DataLoaders',
        concepts: [
          'A Dataset defines how to fetch one sample; a DataLoader wraps it to handle batching, shuffling, and parallel loading — separating "what is a sample" from "how do we feed batches."',
          'Batching trades memory for training stability/speed — larger batches give a smoother gradient estimate but need more memory.',
          'transforms (e.g. torchvision.transforms) apply preprocessing/augmentation per-sample as data is loaded, not as a separate offline step.',
        ],
        checklist: ['Custom Dataset Class', 'DataLoader, Batching & Shuffling', 'Transforms & Augmentation', 'train/val/test Splits'],
        q: [
          { t: 'Write a custom Dataset class for a real dataset (images or tabular) and wrap it in a DataLoader', d: 'M', p: 'Build task' },
          { t: 'Add data augmentation transforms and show the effect on validation accuracy', d: 'M', p: 'Build task' },
        ] },
      { title: 'Training Loops',
        concepts: [
          'A training loop is: forward pass → compute loss → zero_grad() → backward() → optimizer.step(), repeated per batch, per epoch.',
          'Forgetting optimizer.zero_grad() is the single most common PyTorch bug — gradients accumulate across steps by default instead of resetting.',
          'model.train() vs model.eval() toggles behavior for layers like Dropout/BatchNorm that behave differently during training vs. inference.',
        ],
        checklist: ['The Training Loop (forward/backward/step)', 'zero_grad() and Why It Matters', 'model.train() vs model.eval()', 'Tracking Loss & Metrics per Epoch'],
        q: [
          { t: 'Write a complete training loop from scratch for a classifier, logging loss per epoch', d: 'M', p: 'Build task' },
          { t: 'Deliberately remove zero_grad() and show the training curve break, then fix it', d: 'E', p: 'Build task' },
        ] },
      { title: 'Model Saving, Checkpointing & GPU Training',
        concepts: [
          'torch.save(model.state_dict(), path) saves just the learned weights — the standard, portable way to checkpoint a model (vs. pickling the whole object).',
          'Checkpointing periodically during training lets you resume after a crash and recover the best-performing epoch, not just the last one.',
          'model.to(device) moves a model (and .to(device) on each batch) to GPU — training on GPU can be 10-50x faster for typical deep learning workloads.',
        ],
        checklist: ['Saving/Loading state_dict', 'Checkpointing Best Epoch', 'Moving Model & Data to GPU', 'Mixed-Precision Training (concept)'],
        q: [
          { t: 'Add checkpointing to a training loop that saves the best validation-loss model, and reload it for inference', d: 'M', p: 'Build task' },
          { t: 'Benchmark the same training loop on CPU vs GPU and report the speedup', d: 'M', p: 'Build task' },
        ] },
    ],
    mini: { title: 'Checkpoint Project — Custom Training Loop From Scratch', desc: 'Reimplement a prior classifier (from Phase 4) using raw PyTorch Datasets, DataLoaders, autograd, and a hand-written training loop with checkpointing — no high-level trainer.' },
    quiz: [
      { q: 'What does setting requires_grad=True on a PyTorch tensor enable?', options: ['PyTorch builds a computation graph, allowing .backward() to compute gradients automatically', 'The tensor becomes immutable', 'The tensor is automatically moved to GPU', 'The tensor is saved to disk automatically'], correct: 0, explanation: 'Autograd is what makes backpropagation "free" in PyTorch — you never hand-derive gradients yourself.' },
      { q: 'What is the single most common PyTorch training-loop bug?', options: ['Forgetting optimizer.zero_grad(), causing gradients to accumulate across steps', 'Calling .backward() too many times per epoch', 'Using too small a batch size', 'Importing torch incorrectly'], correct: 0, explanation: 'Gradients accumulate by default in PyTorch — without zero_grad(), each step\'s gradient gets added to the previous one.' },
      { q: 'What is the purpose of a DataLoader in PyTorch?', options: ['Handles batching, shuffling, and parallel loading on top of a Dataset', 'Defines the model architecture', 'Computes the loss function', 'Saves the trained model to disk'], correct: 0, explanation: 'A Dataset defines how to fetch one sample; DataLoader wraps it to efficiently produce batches for training.' },
      { q: 'Why do you call model.eval() before running validation or inference?', options: ['It changes the behavior of layers like Dropout/BatchNorm that differ between training and inference', 'It permanently disables the model', 'It is required before saving a model', 'It converts the model to run on CPU only'], correct: 0, explanation: 'Dropout should be off and BatchNorm should use running statistics at inference time, not per-batch statistics.' },
      { q: 'Why save torch.save(model.state_dict(), path) instead of pickling the whole model object?', options: ['state_dict is a portable snapshot of just the learned weights, less fragile across code changes', 'state_dict is required by law for open-source models', 'Pickling a model object is faster', 'state_dict includes the training data automatically'], correct: 0, explanation: 'Saving just the weights (not the full object graph) is the standard, more portable checkpointing approach.' },
    ],
  },

  // ==================================================================
  // PHASE 6 — NLP
  // ==================================================================
  {
    id: 'nlp', num: 9, phase: 6, title: 'Natural Language Processing',
    sub: 'Text processing, tokenization, embeddings, attention, and the transformer-based architectures (BERT, GPT) that now define the field.',
    learnMore: { label: 'Hugging Face — NLP Course', url: 'https://huggingface.co/learn/nlp-course' },
    subtopics: [
      { title: 'Text Processing & Tokenization',
        concepts: [
          'Raw text must be converted to numbers before any model can use it — tokenization is the first, most consequential step in that pipeline.',
          'Word-level tokenization breaks on whitespace/punctuation; subword tokenization (BPE, WordPiece) splits rare words into common sub-units, handling out-of-vocabulary words far better.',
          'Cleaning steps (lowercasing, removing stopwords, stemming/lemmatization) matter less for modern transformer models than they did for classical NLP — know when they still apply.',
        ],
        checklist: ['Text Cleaning & Normalization', 'Word vs Subword Tokenization (BPE)', 'Stopwords, Stemming & Lemmatization', 'Vocabulary & Out-of-Vocabulary Handling'],
        q: [
          { t: 'Tokenize the same sentence with a word-level tokenizer vs. a subword (BPE) tokenizer and compare the outputs', d: 'E', p: 'Build task' },
          { t: 'Build a text-cleaning pipeline (lowercase, remove stopwords, lemmatize) and measure its effect on a simple classifier', d: 'M', p: 'Build task' },
        ] },
      { title: 'Word & Sentence Embeddings',
        concepts: [
          'A word embedding maps a word to a dense vector such that semantically similar words end up close together in vector space — the foundational idea behind Word2Vec, GloVe, and every modern embedding model.',
          'Sentence/document embeddings extend this to whole passages, letting you compute similarity between texts, not just words — the basis of semantic search and RAG retrieval.',
          'Embeddings from a modern transformer model are contextual — the same word gets a different vector depending on surrounding context, unlike static embeddings like Word2Vec.',
        ],
        checklist: ['Word2Vec & GloVe (concept)', 'Contextual vs Static Embeddings', 'Sentence Embeddings', 'Cosine Similarity for Semantic Search'],
        q: [
          { t: 'Generate sentence embeddings for a set of texts and rank them by similarity to a query', d: 'M', p: 'Build task' },
          { t: 'Show that a static embedding gives the same vector for a word in two different contexts, then show a contextual model doesn\'t', d: 'M', p: 'Build task' },
        ] },
      { title: 'Attention Mechanism',
        concepts: [
          'Attention computes a weighted combination of all positions in a sequence for each output position — "which words should I focus on to understand this word."',
          'Self-attention (each token attending to every other token in the same sequence) is what lets a Transformer capture long-range dependencies without recurrence.',
          'Multi-head attention runs several attention computations in parallel with different learned projections, letting the model capture different kinds of relationships at once.',
        ],
        checklist: ['Query, Key & Value Vectors', 'Scaled Dot-Product Attention', 'Multi-Head Attention', 'Attention Visualization'],
        q: [
          { t: 'Implement scaled dot-product attention from scratch and verify against a library implementation', d: 'H', p: 'Build task' },
          { t: 'Visualize attention weights for a sentence to see which words the model attends to for a given token', d: 'M', p: 'Build task' },
        ] },
      { title: 'Transformer Architectures — BERT & GPT',
        concepts: [
          'BERT is encoder-only, trained to understand text bidirectionally (masked language modeling) — the natural choice for classification, NER, and similar understanding tasks.',
          'GPT is decoder-only, trained to predict the next token given everything before it — the natural choice for text generation.',
          'Fine-tuning a pretrained BERT/GPT model on your own labeled data almost always beats training a model from scratch, given how much language knowledge is already baked into the pretrained weights.',
        ],
        checklist: ['BERT (Encoder-Only, Masked LM)', 'GPT (Decoder-Only, Causal LM)', 'Encoder vs Decoder Use Cases', 'Fine-Tuning a Pretrained Model'],
        q: [
          { t: 'Fine-tune a pretrained BERT-style model on a text classification dataset using Hugging Face Transformers', d: 'H', p: 'Build task' },
          { t: 'Use a pretrained GPT-style model to generate text continuations and compare outputs at different temperatures', d: 'M', p: 'Build task' },
        ] },
    ],
    mini: { title: 'Checkpoint Project — Sentiment Analysis System', desc: 'A text classification system (a fine-tuned transformer, compared against a classical TF-IDF baseline) scoring sentiment on real text data, with a full evaluation report and error analysis.' },
    quiz: [
      { q: 'Why does subword tokenization (BPE) handle unseen words better than word-level tokenization?', options: ['Rare/unseen words are split into common sub-units instead of becoming a single unknown token', 'It removes all rare words from the vocabulary', 'It only tokenizes English text', 'Subword tokenization ignores punctuation entirely'], correct: 0, explanation: 'This is why modern tokenizers rarely hit a true out-of-vocabulary wall the way old word-level vocabularies did.' },
      { q: 'What is the key difference between static embeddings (Word2Vec) and contextual embeddings (from a Transformer)?', options: ['Contextual embeddings give the same word a different vector depending on surrounding context', 'Static embeddings are always more accurate', 'Contextual embeddings cannot be used for search', 'They are computed identically, just with different names'], correct: 0, explanation: '"Bank" (river) and "bank" (money) get the same Word2Vec vector but different contextual embeddings — a major reason modern NLP moved past static embeddings.' },
      { q: 'What do Query, Key, and Value vectors represent in self-attention?', options: ['A learned mechanism for each token to decide which other tokens to focus on', 'Three separate neural networks trained independently', 'The three layers of every Transformer block', 'Alternative names for input, hidden, and output layers'], correct: 0, explanation: 'The dot product of Query and Key determines attention weights, which are used to weight the Values being combined.' },
      { q: 'What is the architectural difference between BERT and GPT?', options: ['BERT is encoder-only (bidirectional understanding); GPT is decoder-only (causal, next-token generation)', 'They are the same architecture with different training data only', 'GPT cannot be fine-tuned', 'BERT is only used for image tasks'], correct: 0, explanation: 'This is why BERT suits classification/understanding tasks and GPT suits generation tasks.' },
      { q: 'Why does fine-tuning a pretrained transformer usually beat training a model from scratch on a small dataset?', options: ['The pretrained weights already encode substantial general language knowledge', 'Fine-tuning uses a different, faster algorithm entirely', 'Training from scratch is always technically impossible', 'Pretrained models require no data at all to fine-tune'], correct: 0, explanation: 'A small labeled dataset is rarely enough to learn language from nothing — fine-tuning leverages knowledge already baked into the pretrained weights.' },
    ],
  },

  // ==================================================================
  // PHASE 7 — GENERATIVE AI
  // ==================================================================
  {
    id: 'genai', num: 10, phase: 7, title: 'Generative AI & LLMs',
    sub: 'Large language models as a product surface — fundamentals, prompt engineering, structured outputs, function calling, and the APIs that put an LLM inside an application.',
    learnMore: { label: 'Prompt Engineering Guide', url: 'https://www.promptingguide.ai/' },
    subtopics: [
      { title: 'LLM Fundamentals & Context Windows',
        concepts: [
          'An LLM generates text one token at a time, each token conditioned on everything before it — it doesn\'t "know" anything beyond predicting the statistically likely next token given its training and context.',
          'The context window is the maximum number of tokens (input + output combined) a model can attend to at once — exceed it and earlier content is truncated or dropped.',
          'Temperature controls randomness in generation — low temperature is deterministic/focused, high temperature is more creative/varied and more likely to go off-track.',
        ],
        checklist: ['How LLMs Generate Text (Next-Token Prediction)', 'Context Window Limits', 'Temperature & Sampling Parameters', 'Hallucination — What It Is and Why It Happens'],
        q: [
          { t: 'Call an LLM API at three different temperatures on the same prompt and compare outputs', d: 'E', p: 'Build task' },
          { t: 'Construct a prompt that deliberately exceeds a model\'s context window and observe the failure mode', d: 'M', p: 'Build task' },
        ] },
      { title: 'Prompt Engineering',
        concepts: [
          'Zero-shot prompting asks the model to perform a task with no examples; few-shot prompting includes 2-3 examples in the prompt, often substantially improving output quality/format consistency.',
          'Chain-of-thought prompting ("think step by step") improves performance on reasoning tasks by making the model produce intermediate reasoning before the final answer.',
          'System prompts set persistent behavior/role/constraints separate from the user\'s actual message — the standard place to put instructions the model should always follow.',
        ],
        checklist: ['Zero-Shot vs Few-Shot Prompting', 'Chain-of-Thought Prompting', 'System Prompts vs User Prompts', 'Prompt Iteration & Evaluation'],
        q: [
          { t: 'Improve a zero-shot prompt\'s output quality by rewriting it as a few-shot prompt with 3 examples', d: 'M', p: 'Build task' },
          { t: 'Compare a direct-answer prompt vs. a chain-of-thought prompt on a multi-step reasoning question', d: 'M', p: 'Build task' },
        ] },
      { title: 'Structured Outputs & Function Calling',
        concepts: [
          'Structured output (JSON mode / schema-constrained generation) forces a model\'s response into a parseable shape your code can actually use, instead of parsing free text.',
          'Function calling lets a model decide to invoke a tool/function with specific arguments — the model doesn\'t execute the function itself, it just outputs the call, and your code runs it.',
          'This is the foundational mechanism behind both RAG (calling a retrieval function) and agents (calling any tool) — everything downstream builds on it.',
        ],
        checklist: ['JSON Mode / Schema-Constrained Output', 'Function Calling — How It Works', 'Validating Model Output Against a Schema', 'Handling Malformed Model Output'],
        q: [
          { t: 'Get an LLM to return structured JSON matching a defined schema and validate it in code', d: 'M', p: 'Build task' },
          { t: 'Define a function-calling tool (e.g. a weather lookup) and drive an LLM to call it with correct arguments', d: 'M', p: 'Build task' },
        ] },
      { title: 'Working with LLM APIs & Embeddings',
        concepts: [
          'Most LLM providers expose a chat-completions style API — messages in, a generated message out — with parameters for temperature, max tokens, and (often) function/tool definitions.',
          'An embeddings API converts text into a vector, separate from the generation API — this is the piece RAG systems actually depend on for retrieval.',
          'Track token usage and cost per request from the start — LLM API costs scale directly with input + output tokens, and it\'s easy to burn budget without noticing.',
        ],
        checklist: ['Chat Completions API Shape', 'Embeddings API', 'Token Counting & Cost Tracking', 'Rate Limits & Retries'],
        q: [
          { t: 'Build a small CLI chat client against a real LLM API, tracking token usage per call', d: 'M', p: 'Build task' },
          { t: 'Add retry-with-backoff handling for rate-limit errors when calling an LLM API', d: 'M', p: 'Build task' },
        ] },
    ],
    mini: { title: 'Checkpoint Project — Prompt-Engineered Content Assistant', desc: 'An application driving an LLM via deliberate prompt design, structured JSON output, and at least one function call — for a real, specific task, not a raw chat wrapper.' },
    quiz: [
      { q: 'What does an LLM actually do when it generates text?', options: ['Predicts the most statistically likely next token given everything before it', 'Looks up a pre-written answer from a database', 'Runs a search engine query internally', 'Executes the user\'s instructions as code'], correct: 0, explanation: 'This next-token-prediction mechanism is also why LLMs can hallucinate — a statistically plausible token isn\'t the same as a factually correct one.' },
      { q: 'What does the temperature parameter control during generation?', options: ['How random/varied the sampling of the next token is', 'The literal processing temperature of the GPU', 'The maximum length of the response', 'Whether the model uses function calling'], correct: 0, explanation: 'Low temperature is focused/deterministic; high temperature is more varied and more likely to wander off-track.' },
      { q: 'When an LLM "calls a function," what actually happens?', options: ['The model emits a structured call description; your code is responsible for actually executing it', 'The model directly executes code on its own servers', 'The function call bypasses the model entirely', 'The model can only call functions it wrote itself'], correct: 0, explanation: 'A very common misconception — the model never runs the function itself, it just decides to ask for it.' },
      { q: 'Why does few-shot prompting often outperform zero-shot for formatting-sensitive tasks?', options: ['Concrete examples in the prompt demonstrate the exact expected format/style', 'Few-shot prompts are always shorter', 'Zero-shot prompts are not supported by most models', 'Few-shot prompting requires no examples at all'], correct: 0, explanation: 'Showing 2-3 examples gives the model a concrete pattern to match, which plain instructions alone often can\'t pin down as reliably.' },
      { q: 'Why is JSON-mode/schema-constrained output useful in an application?', options: ['It forces the response into a parseable shape your code can use directly, instead of parsing free text', 'It makes the model respond faster', 'It removes the need for prompt engineering entirely', 'It only works for numeric outputs'], correct: 0, explanation: 'Free-text parsing is brittle; structured output gives your code a reliable contract to build on.' },
    ],
  },

  // ==================================================================
  // PHASE 8 — RAG
  // ==================================================================
  {
    id: 'rag', num: 11, phase: 8, title: 'Retrieval-Augmented Generation (RAG)',
    sub: 'Ground an LLM in your own documents instead of hoping it memorized the answer — chunking, embeddings, vector search, and evaluation.',
    learnMore: { label: 'LangChain — RAG Tutorial', url: 'https://python.langchain.com/docs/tutorials/rag/' },
    subtopics: [
      { title: 'Document Processing & Chunking',
        concepts: [
          'A document must be split into smaller chunks before embedding — a whole PDF is too large and too unfocused to embed usefully as one vector.',
          'Chunk size is a real trade-off: too small loses context, too large dilutes relevance and wastes context-window budget at query time.',
          'Chunk overlap (repeating a bit of text between consecutive chunks) prevents a key sentence from being split awkwardly across a chunk boundary.',
        ],
        checklist: ['Why Chunking Is Necessary', 'Fixed-Size vs Semantic Chunking', 'Chunk Overlap', 'Extracting Text from PDFs/HTML'],
        q: [
          { t: 'Chunk a real PDF with two different strategies (fixed-size vs. paragraph-based) and compare the resulting chunks', d: 'M', p: 'Build task' },
          { t: 'Show a case where a bad chunk boundary splits an important fact across two chunks, and fix it with overlap', d: 'M', p: 'Build task' },
        ] },
      { title: 'Embeddings & Vector Search',
        concepts: [
          'Each chunk gets embedded into a vector; a query at retrieval time is embedded the same way, and vector search finds chunks whose embeddings are closest to the query\'s.',
          'Approximate nearest neighbor (ANN) search trades a small amount of accuracy for massive speed gains — required once you have more than a few thousand vectors.',
          'The embedding model used for documents and queries must be the same model — mixing embedding models produces meaningless similarity scores.',
        ],
        checklist: ['Embedding Chunks for Retrieval', 'Vector Similarity Search', 'Approximate Nearest Neighbor (ANN)', 'Embedding Model Consistency'],
        q: [
          { t: 'Embed a set of chunks and a query, then retrieve the top-k most similar chunks by cosine similarity', d: 'M', p: 'Build task' },
          { t: 'Deliberately embed documents and queries with two different models and show retrieval quality collapse', d: 'M', p: 'Build task' },
        ] },
      { title: 'Vector Databases',
        concepts: [
          'A vector database stores embeddings alongside metadata and provides efficient similarity search at scale — the production alternative to a naive in-memory list of vectors.',
          'Metadata filtering (e.g. "only search chunks from this document") combined with vector search is usually necessary for real applications, not vector search alone.',
          'Indexing strategy (e.g. HNSW) affects the speed/accuracy trade-off of a vector database\'s search — know that this choice exists even if you don\'t tune it yourself at first.',
        ],
        checklist: ['What a Vector Database Provides', 'Metadata Filtering + Vector Search', 'Indexing Strategies (concept)', 'Popular Vector DBs (Pinecone, Chroma, pgvector)'],
        q: [
          { t: 'Store embedded chunks in a local vector database (e.g. Chroma) and query it with metadata filtering', d: 'M', p: 'Build task' },
          { t: 'Compare search results with and without a metadata filter on the same query', d: 'E', p: 'Build task' },
        ] },
      { title: 'Retrieval, Reranking & RAG Evaluation',
        concepts: [
          'Retrieving the top-k most similar chunks isn\'t always the top-k most USEFUL ones — a reranker (a second, more expensive model) can reorder retrieved chunks for actual relevance.',
          'A RAG pipeline is: embed query → retrieve chunks → (optionally rerank) → build a prompt with retrieved context → generate an answer, ideally with citations.',
          'RAG evaluation needs its own metrics: retrieval quality (did we fetch the right chunks?) and generation quality (did the model use them correctly?) are two separate failure modes.',
        ],
        checklist: ['Reranking Retrieved Chunks', 'Building the Final Prompt with Context', 'Citing Sources in the Answer', 'RAG Evaluation (Retrieval + Generation Metrics)'],
        q: [
          { t: 'Add a reranking step to a retrieval pipeline and show it changes the final top-k order', d: 'H', p: 'Build task' },
          { t: 'Build an evaluation set of Q&A pairs and measure whether your RAG pipeline retrieves the right chunk and cites it correctly', d: 'H', p: 'Build task' },
        ] },
    ],
    mini: { title: 'Checkpoint Project — PDF Question Answering System', desc: 'A RAG application: chunk and embed a set of real PDFs, store them in a vector database, retrieve relevant chunks for a question, and generate a grounded, cited answer.' },
    quiz: [
      { q: 'Why must a document be split into chunks before embedding it for RAG?', options: ['A whole large document is too large and unfocused to embed usefully as one vector', 'Embedding models cannot process more than one sentence', 'Chunking is only needed for PDFs, not other formats', 'It reduces the total number of API calls to zero'], correct: 0, explanation: 'Smaller, focused chunks produce embeddings that better represent a specific piece of content for retrieval.' },
      { q: 'What happens if you embed documents with one model and queries with a different model?', options: ['Similarity scores become meaningless since the embedding spaces aren\'t comparable', 'Retrieval quality improves due to diversity', 'The vector database automatically converts between spaces', 'Nothing — embedding models are always interchangeable'], correct: 0, explanation: 'Documents and queries must be embedded with the same model for cosine similarity comparisons to be meaningful.' },
      { q: 'Why would you add a reranking step after initial vector retrieval?', options: ['The top-k most similar chunks by embedding distance aren\'t always the top-k most relevant ones', 'Reranking replaces the need for embeddings entirely', 'It reduces the number of chunks needed to zero', 'Vector search never returns useful results without it'], correct: 0, explanation: 'A more expensive reranking model can reorder retrieved candidates for actual relevance to the query.' },
      { q: 'What are the two distinct failure modes a RAG evaluation needs to separate?', options: ['Retrieval quality (right chunks fetched?) and generation quality (used correctly?)', 'Latency and cost, only', 'Model size and training data size', 'Chunk size and vector dimension count'], correct: 0, explanation: 'A RAG system can retrieve the right chunk and still generate a wrong answer, or retrieve the wrong chunk entirely — these need separate metrics.' },
      { q: 'What does metadata filtering add to a vector database query?', options: ['Narrows the search to a subset (e.g. one document/date range) combined with similarity search', 'Replaces vector search entirely', 'Encrypts the stored vectors', 'Automatically re-embeds all documents'], correct: 0, explanation: 'Real applications usually need "search similar chunks, but only within this document/tenant/date range" — filtering plus similarity together.' },
    ],
  },

  // ==================================================================
  // PHASE 9 — AI AGENTS
  // ==================================================================
  {
    id: 'ai-agents', num: 12, phase: 9, title: 'AI Agents',
    sub: 'Give a model tools, memory, and a planning loop — the difference between a chatbot and something that actually completes a multi-step task.',
    learnMore: { label: 'LangGraph — Documentation', url: 'https://langchain-ai.github.io/langgraph/' },
    subtopics: [
      { title: 'Agent Architecture & Tool Use',
        concepts: [
          'An agent is an LLM wrapped in a loop: observe → decide (via function calling) → act (call a tool) → observe the result → repeat, until the task is done.',
          'Tools give an agent capabilities beyond text generation — web search, code execution, database queries, calling another API.',
          'The ReAct pattern (Reason + Act) has the model explicitly interleave reasoning traces with tool calls, which measurably improves reliability over letting it call tools silently.',
        ],
        checklist: ['The Observe-Decide-Act Loop', 'Defining Tools for an Agent', 'The ReAct Pattern', 'Tool Selection & Argument Construction'],
        q: [
          { t: 'Build an agent with two real tools (e.g. calculator + web search) that picks the right one per query', d: 'M', p: 'Build task' },
          { t: 'Log an agent\'s full reasoning trace (thought → action → observation) for a multi-step task', d: 'M', p: 'Build task' },
        ] },
      { title: 'Memory & Planning',
        concepts: [
          'Short-term memory is just the conversation/context passed in the prompt; long-term memory persists facts across sessions, typically via a vector store or database.',
          'Planning means having the agent decompose a complex task into subtasks before executing, rather than reacting one step at a time with no overall strategy.',
          'Without explicit planning, an agent can get stuck looping on the same failed action — a plan gives it something to check progress against.',
        ],
        checklist: ['Short-Term vs Long-Term Memory', 'Task Decomposition / Planning', 'Detecting and Recovering from Loops', 'Persisting State Across Sessions'],
        q: [
          { t: 'Add long-term memory (vector-store-backed) to an agent so it recalls facts from a previous session', d: 'H', p: 'Build task' },
          { t: 'Have an agent produce an explicit plan before executing a multi-step task and compare against no-plan behavior', d: 'M', p: 'Build task' },
        ] },
      { title: 'Multi-Agent Systems',
        concepts: [
          'A multi-agent system splits a task across several specialized agents (e.g. a researcher agent + a writer agent) instead of one agent trying to do everything.',
          'Orchestration defines how agents communicate and hand off work — sequential pipelines, a supervisor agent routing to workers, or fully decentralized negotiation.',
          'More agents means more coordination overhead and more places for something to fail silently — only split into multiple agents when a single agent\'s tool/context load genuinely justifies it.',
        ],
        checklist: ['Why Split Into Multiple Agents', 'Supervisor / Orchestrator Patterns', 'Agent-to-Agent Communication', 'Failure Modes in Multi-Agent Systems'],
        q: [
          { t: 'Build a 2-agent pipeline (researcher → writer) where one agent\'s output feeds the next', d: 'H', p: 'Build task' },
          { t: 'Add a supervisor agent that routes a task to one of two specialized worker agents based on the request', d: 'H', p: 'Build task' },
        ] },
      { title: 'Agent Evaluation',
        concepts: [
          'Evaluating an agent means checking task completion rate, not just whether individual LLM calls "look reasonable" — the agent can sound confident and still fail the task.',
          'Trace-level evaluation (did it pick the right tool? the right arguments?) catches failures a pure end-to-end pass/fail check would miss.',
          'Build a fixed evaluation set of representative tasks before iterating on an agent\'s prompts/tools — otherwise you can\'t tell if a change actually helped.',
        ],
        checklist: ['Task Completion Rate', 'Trace-Level Evaluation (Tool Choice, Arguments)', 'Building an Agent Evaluation Set', 'Regression Testing Agent Behavior'],
        q: [
          { t: 'Build a 10-task evaluation set for an agent and measure its completion rate before and after a prompt change', d: 'H', p: 'Build task' },
        ] },
    ],
    mini: { title: 'Checkpoint Project — Tool-Using Research Agent', desc: 'An agent with at least two real tools, memory across steps, and a visible plan — able to complete a multi-step research task and explain what it did and why.' },
    quiz: [
      { q: 'What is the core loop that defines an "agent" as opposed to a plain chatbot?', options: ['Observe → decide (via tool/function calling) → act → observe the result → repeat', 'A single prompt-response exchange with a longer system prompt', 'A chatbot with a larger context window', 'A model fine-tuned on more conversational data'], correct: 0, explanation: 'What makes something an agent is the loop that lets it take actions and react to their results, not just generate text once.' },
      { q: 'What does the ReAct (Reason + Act) pattern add to an agent\'s tool use?', options: ['Explicit interleaved reasoning traces alongside tool calls, improving reliability', 'The ability to call tools without any reasoning at all', 'A guarantee the agent never makes a mistake', 'Automatic multi-agent orchestration'], correct: 0, explanation: 'Making the model "think out loud" between actions measurably improves task success over silent tool-calling.' },
      { q: 'What is the difference between an agent\'s short-term and long-term memory?', options: ['Short-term is just the current context/conversation; long-term persists facts across sessions (e.g. via a vector store)', 'They are the same mechanism with different names', 'Long-term memory means a bigger context window only', 'Short-term memory requires a database'], correct: 0, explanation: 'Long-term memory needs to be explicitly persisted and retrieved — it doesn\'t come free from a large context window.' },
      { q: 'Why might splitting a task across multiple specialized agents be worse than a single agent?', options: ['More agents add coordination overhead and more places for silent failure', 'Multi-agent systems always run faster', 'A single agent cannot use more than one tool', 'Multi-agent systems require no evaluation'], correct: 0, explanation: 'Multi-agent architectures should be justified by genuine tool/context-load needs, not used by default — it\'s a common over-engineering trap.' },
      { q: 'Why is task completion rate a better agent-evaluation metric than "does the output look reasonable"?', options: ['An agent can sound confident and articulate while still failing the actual task', 'Completion rate is easier to compute than any other metric', 'Looking reasonable and completing the task are always the same thing', 'Task completion cannot be measured objectively'], correct: 0, explanation: 'Evaluating an agent means checking whether it actually accomplished the goal, not just whether its reasoning trace reads well.' },
    ],
  },

  // ==================================================================
  // PHASE 10 — AI FRAMEWORKS
  // ==================================================================
  {
    id: 'ai-frameworks', num: 13, phase: 10, title: 'AI Frameworks',
    sub: 'The libraries that turn RAG, agents, and model fine-tuning into shippable code instead of reinventing it from scratch — Hugging Face, LangChain/LangGraph, LlamaIndex, and FastAPI to serve it.',
    learnMore: { label: 'Hugging Face — Documentation', url: 'https://huggingface.co/docs' },
    subtopics: [
      { title: 'Hugging Face Ecosystem',
        concepts: [
          'The transformers library gives a unified API to load, run, and fine-tune thousands of pretrained models — you rarely write a transformer architecture from scratch in practice.',
          'The Hugging Face Hub hosts models, datasets, and demo Spaces — the standard place to find and share a pretrained model or dataset.',
          'The datasets library provides fast, memory-mapped access to large datasets, and pipeline() gives a one-line inference API for common tasks (classification, generation, embeddings).',
        ],
        learnMore: { label: 'Hugging Face — Transformers Docs', url: 'https://huggingface.co/docs/transformers/index' },
        checklist: ['transformers Library', 'The Hugging Face Hub', 'datasets Library', 'pipeline() for Quick Inference'],
        q: [
          { t: 'Load a pretrained model from the Hub and run inference with pipeline() for a real task', d: 'E', p: 'Build task' },
          { t: 'Load a dataset from the Hub and preprocess it for fine-tuning', d: 'M', p: 'Build task' },
        ] },
      { title: 'LangChain & LangGraph',
        concepts: [
          'LangChain provides composable building blocks (prompts, chains, retrievers, tools) so you don\'t hand-write every piece of an LLM application from scratch.',
          'A "chain" links steps together (e.g. retrieve → format prompt → call LLM → parse output); LangGraph extends this into an explicit, stateful graph — better suited for agents with loops and branches than a linear chain.',
          'These frameworks trade some raw-API simplicity for a lot of reusable plumbing (memory, retries, streaming, tracing) — worth it once an application outgrows a single script.',
        ],
        checklist: ['Chains & Composable Components', 'Retrievers & Prompt Templates', 'LangGraph — Stateful Graphs for Agents', 'When a Framework Is (and Isn\'t) Worth It'],
        q: [
          { t: 'Build a simple RAG chain in LangChain (retriever + prompt template + LLM) and compare it against a hand-rolled version', d: 'M', p: 'Build task' },
          { t: 'Build a small agent as a LangGraph graph with at least one conditional branch', d: 'H', p: 'Build task' },
        ] },
      { title: 'LlamaIndex',
        concepts: [
          'LlamaIndex is focused specifically on connecting LLMs to your data — ingestion, indexing, and querying — and is often faster to stand up a RAG pipeline with than a general-purpose framework.',
          'An index in LlamaIndex organizes your chunked/embedded data for efficient querying — different index types trade off build cost, query speed, and the kinds of queries they answer well.',
          'Query engines and data connectors are the two pieces that matter most in practice: getting data in cleanly, and getting relevant answers out.',
        ],
        checklist: ['Data Connectors & Ingestion', 'Index Types', 'Query Engines', 'LlamaIndex vs LangChain for RAG'],
        q: [
          { t: 'Build a basic document Q&A pipeline using LlamaIndex and compare the amount of code to your Phase 8 RAG project', d: 'M', p: 'Build task' },
        ] },
      { title: 'Serving with FastAPI',
        concepts: [
          'FastAPI is a modern Python web framework built for APIs — type-hint-driven request/response validation and automatic OpenAPI docs make it the standard choice for serving ML/AI models.',
          'An inference endpoint should validate input with a Pydantic model, handle errors gracefully, and avoid reloading a model on every request — load it once at startup.',
          'Async endpoints matter here specifically because calling an LLM API or a model on GPU is often I/O- or latency-bound — async lets FastAPI serve other requests while waiting.',
        ],
        learnMore: { label: 'FastAPI — Tutorial', url: 'https://fastapi.tiangolo.com/tutorial/' },
        checklist: ['Pydantic Request/Response Models', 'Loading a Model Once at Startup', 'Async Endpoints for I/O-Bound Calls', 'Automatic OpenAPI Docs'],
        q: [
          { t: 'Serve a trained model behind a FastAPI endpoint with a validated request schema', d: 'M', p: 'Build task' },
          { t: 'Convert a synchronous LLM-calling endpoint to async and load-test the difference', d: 'M', p: 'Build task' },
        ] },
    ],
    mini: { title: 'Checkpoint Project — Multi-Tool LangChain/LangGraph App', desc: 'Rebuild your Phase 8 or Phase 9 project on LangChain/LangGraph with Hugging Face models, served behind a FastAPI backend — proving framework fluency, not just raw API calls.' },
    quiz: [
      { q: 'What does the Hugging Face transformers library primarily give you?', options: ['A unified API to load, run, and fine-tune thousands of pretrained models', 'A replacement for PyTorch itself', 'A vector database', 'A prompt engineering guide'], correct: 0, explanation: 'You rarely write a transformer architecture from scratch in practice — transformers standardizes loading and using pretrained models.' },
      { q: 'Why would you reach for LangGraph over a simple linear LangChain chain?', options: ['LangGraph models explicit state and branches/loops, better suited to agents than a straight-line chain', 'LangGraph replaces the need for an LLM entirely', 'A linear chain can already express loops and branches equally well', 'LangGraph only works with OpenAI models'], correct: 0, explanation: 'Agents often need conditional branches and loops — a graph structure represents that far more naturally than a linear pipeline.' },
      { q: 'What is LlamaIndex most specifically focused on, compared to a general-purpose framework?', options: ['Connecting LLMs to your data — ingestion, indexing, and querying', 'Training models from scratch', 'Deploying Docker containers', 'Writing unit tests for ML pipelines'], correct: 0, explanation: 'LlamaIndex is often faster to stand up a RAG pipeline with specifically because that\'s its core focus.' },
      { q: 'Why load a model once at FastAPI startup instead of on every request?', options: ['Reloading a model per-request adds massive, unnecessary latency', 'FastAPI cannot load models inside request handlers at all', 'Models must be reloaded to stay accurate', 'It has no effect on performance'], correct: 0, explanation: 'Loading weights into memory is expensive — do it once at startup and reuse the loaded model across requests.' },
      { q: 'Why are async endpoints particularly relevant for an LLM-serving API?', options: ['Calling an LLM API or a GPU model is often latency-bound, and async lets other requests proceed while waiting', 'Async is required syntax for any FastAPI route', 'Async endpoints run on multiple CPU cores automatically', 'Async makes the model more accurate'], correct: 0, explanation: 'While one request waits on a slow LLM call, an async server can keep serving other requests instead of blocking.' },
    ],
  },

  // ==================================================================
  // PHASE 11 — MODEL FINE-TUNING
  // ==================================================================
  {
    id: 'fine-tuning', num: 14, phase: 11, title: 'Model Fine-Tuning',
    sub: 'Adapt a pretrained model to your own data — full fine-tuning, parameter-efficient methods (LoRA/PEFT), and quantization to make the result deployable.',
    learnMore: { label: 'Hugging Face — PEFT', url: 'https://huggingface.co/docs/peft/index' },
    subtopics: [
      { title: 'Transfer Learning & Full Fine-Tuning',
        concepts: [
          'Transfer learning reuses a model pretrained on a large general dataset and adapts it to a narrower task — almost always more data- and compute-efficient than training from scratch.',
          'Full fine-tuning updates every weight in the model on your data — most accurate ceiling, but expensive in compute and memory, and risks catastrophic forgetting of the base model\'s general ability.',
          'Freezing early layers and only training later ones is a middle ground — early layers tend to learn generic features that transfer well as-is.',
        ],
        checklist: ['Transfer Learning (concept)', 'Full Fine-Tuning', 'Layer Freezing', 'Catastrophic Forgetting'],
        q: [
          { t: 'Fine-tune a small pretrained model fully on a narrow dataset and compare it to the frozen-base-layers version', d: 'H', p: 'Build task' },
        ] },
      { title: 'Parameter-Efficient Fine-Tuning (LoRA / PEFT)',
        concepts: [
          'LoRA (Low-Rank Adaptation) freezes the original model weights and injects small trainable low-rank matrices into each layer — trains a tiny fraction of the parameters full fine-tuning would.',
          'PEFT (the Hugging Face library) provides a unified interface for LoRA and other parameter-efficient methods, letting you fine-tune large models on a single consumer GPU.',
          'Because the base weights are untouched, you can swap different LoRA "adapters" in and out of the same base model for different tasks without retraining from scratch each time.',
        ],
        checklist: ['LoRA — Low-Rank Adaptation', 'The PEFT Library', 'Swapping Adapters on One Base Model', 'Compute/Memory Trade-Offs vs Full Fine-Tuning'],
        q: [
          { t: 'Fine-tune a model with LoRA via the PEFT library and compare trainable-parameter count against full fine-tuning', d: 'H', p: 'Build task' },
        ] },
      { title: 'Quantization',
        concepts: [
          'Quantization reduces the numeric precision of a model\'s weights (e.g. 32-bit floats down to 8-bit or 4-bit integers), shrinking memory footprint and speeding up inference at some accuracy cost.',
          'Post-training quantization is applied after training completes; quantization-aware training simulates the precision loss during training itself, usually preserving more accuracy.',
          'Quantization is often what makes running a large model on a laptop or a single GPU feasible at all, not just faster.',
        ],
        checklist: ['Why Quantization Reduces Memory/Latency', 'Post-Training Quantization', 'Quantization-Aware Training (concept)', '8-bit / 4-bit Precision Trade-Offs'],
        q: [
          { t: 'Quantize a fine-tuned model to 8-bit and compare inference speed and output quality against the full-precision version', d: 'H', p: 'Build task' },
        ] },
    ],
    mini: { title: 'Checkpoint Project — Fine-Tuned Domain Model', desc: 'LoRA/PEFT fine-tune an open pretrained model on a narrow, real dataset, then quantize it for local inference — with a documented before/after comparison against the base model.' },
    quiz: [
      { q: 'What is the key idea behind LoRA (Low-Rank Adaptation)?', options: ['Freeze the original weights and train small, injected low-rank matrices instead', 'Retrain every weight in the model from scratch', 'Delete most of the model\'s layers to save memory', 'Only fine-tune the very first layer'], correct: 0, explanation: 'This trains a tiny fraction of the parameters full fine-tuning would need, making large-model fine-tuning feasible on modest hardware.' },
      { q: 'Why is full fine-tuning riskier than parameter-efficient fine-tuning for a narrow dataset?', options: ['It can cause catastrophic forgetting of the base model\'s general capabilities', 'It always trains faster than LoRA', 'It requires no GPU at all', 'Full fine-tuning cannot be undone once started'], correct: 0, explanation: 'Updating every weight on a narrow dataset risks overwriting general knowledge learned during pretraining.' },
      { q: 'What does quantization trade off?', options: ['Reduced numeric precision for smaller memory footprint and faster inference', 'Model accuracy for larger file size', 'Training speed for testing speed', 'GPU usage for CPU usage only'], correct: 0, explanation: 'Lowering precision (e.g. 32-bit to 8-bit) shrinks the model and speeds inference, at some accuracy cost.' },
      { q: 'What is a practical benefit of LoRA adapters being separate from the base model weights?', options: ["You can swap different adapters onto the same base model for different tasks without retraining from scratch each time", 'It removes the need for a base model entirely', 'Adapters can only be used once', 'It makes the base model open-source automatically'], correct: 0, explanation: 'Since the base weights are untouched, different LoRA adapters can be swapped in like plug-ins for different specialized tasks.' },
      { q: 'What is the difference between post-training quantization and quantization-aware training?', options: ['Post-training applies after training completes; QAT simulates precision loss during training, often preserving more accuracy', 'They produce identical results always', 'QAT can only be applied to CNNs', 'Post-training quantization requires retraining from scratch'], correct: 0, explanation: 'QAT lets the model adapt to reduced precision during training itself, usually giving a better accuracy/size trade-off.' },
    ],
  },

  // ==================================================================
  // PHASE 12 — AI ENGINEERING / MLOPS
  // ==================================================================
  {
    id: 'mlops', num: 15, phase: 12, title: 'AI Engineering & MLOps',
    sub: 'Ship a model and keep it alive — containerized serving, experiment tracking, monitoring, CI/CD, and cloud deployment.',
    learnMore: { label: 'MLflow — Documentation', url: 'https://mlflow.org/docs/latest/index.html' },
    subtopics: [
      { title: 'Containerizing & Serving Models',
        concepts: [
          'Docker packages a model, its dependencies, and a serving process into one reproducible image — "works on my machine" stops being a real risk once it\'s containerized.',
          'A serving layer (FastAPI, or a dedicated tool) exposes the model over HTTP with input validation, health checks, and consistent error handling.',
          'Keep the model loaded in memory across requests, and separate the serving container from training code — production images should be minimal, not carry the whole training pipeline.',
        ],
        learnMore: { label: 'Docker — Get Started', url: 'https://docs.docker.com/get-started/' },
        checklist: ['Containerizing a Model with Docker', 'A Minimal Serving Image', 'Health Checks', 'Separating Training vs Serving Code'],
        q: [
          { t: 'Containerize a FastAPI model-serving app with Docker and run it locally', d: 'M', p: 'Build task' },
        ] },
      { title: 'Experiment Tracking',
        concepts: [
          'Experiment tracking (e.g. MLflow) logs every training run\'s hyperparameters, metrics, and artifacts — without it, "which run produced this model?" becomes unanswerable within a week.',
          'Comparing runs side by side is how you actually make an informed decision about which model/hyperparameters to ship, instead of trusting memory.',
          'Model registries build on top of experiment tracking to version and promote a specific run\'s model to staging/production explicitly.',
        ],
        checklist: ['Logging Params, Metrics & Artifacts', 'Comparing Runs', 'Model Registry (concept)', 'Reproducibility of a Given Run'],
        q: [
          { t: 'Add MLflow tracking to an existing training script and compare 3 runs with different hyperparameters', d: 'M', p: 'Build task' },
        ] },
      { title: 'Monitoring & Evaluation in Production',
        concepts: [
          'Monitor both system health (latency, error rate, throughput) and model quality (prediction distribution, a proxy for accuracy) — a model can be "up" and still silently wrong.',
          'Data drift — the production input distribution shifting away from training data — degrades model quality gradually and often without triggering a system-level alert.',
          'Log predictions and (where possible) outcomes so quality regressions can be diagnosed after the fact, not just noticed anecdotally.',
        ],
        checklist: ['System Metrics vs Model-Quality Metrics', 'Data Drift Detection', 'Logging Predictions for Later Analysis', 'Alerting on Model Degradation'],
        q: [
          { t: 'Add basic monitoring (latency, error rate, and a model-output metric) to a served model endpoint', d: 'H', p: 'Build task' },
        ] },
      { title: 'CI/CD & Cloud Deployment',
        concepts: [
          'A CI/CD pipeline for ML runs tests AND a basic model-quality check before deployment — a code change that silently breaks the model shouldn\'t ship just because unit tests pass.',
          'Cloud deployment (a managed container service, or a dedicated ML platform) handles scaling, health checks, and rollout — know the option that fits your stack rather than defaulting to the most complex one.',
          'A rollback plan (a previous model version you can redeploy instantly) is not optional once a model is in production — treat a bad deploy the same way you\'d treat a bad software release.',
        ],
        checklist: ['CI/CD for a Model-Serving App', 'Automated Model-Quality Checks Pre-Deploy', 'Cloud Deployment Options', 'Rollback Strategy'],
        q: [
          { t: 'Set up a CI/CD pipeline (e.g. GitHub Actions) that runs tests and a basic model-quality check before deploying', d: 'H', p: 'Build task' },
          { t: 'Deploy a containerized model-serving app to a cloud provider and verify it\'s reachable and healthy', d: 'H', p: 'Build task' },
        ] },
    ],
    mini: { title: 'Checkpoint Project — Production AI Application', desc: 'Deploy an AI application (any prior project) with MLflow experiment tracking, containerization, a CI/CD pipeline, and basic production monitoring — not just "it runs on my machine."' },
    quiz: [
      { q: 'Why is experiment tracking (e.g. MLflow) important once you\'re running many training runs?', options: ['Without logging params/metrics per run, "which run produced this model?" becomes unanswerable', 'It automatically improves model accuracy', 'It replaces the need for a model registry', 'It is only useful for deep learning, not classical ML'], correct: 0, explanation: 'Comparing runs side by side depends on having actually logged what changed and what resulted from it.' },
      { q: 'What is data drift, and why is it dangerous?', options: ["Production input distribution shifts away from training data, degrading quality often without a clear system alert", 'A bug that corrupts data during transfer', 'A synonym for a database migration', 'Something that only affects unsupervised models'], correct: 0, explanation: 'A model can look "up" and healthy on system metrics while silently producing worse predictions due to drift.' },
      { q: 'Why should a production model-serving system separate training code from serving code?', options: ['Production images should be minimal and stable, not carry the whole (larger, more volatile) training pipeline', 'Training code cannot run in Docker', 'Serving code must be written in a different language', 'They must always be deployed to the same server'], correct: 0, explanation: 'A lean serving image reduces attack surface, deployment size, and the chance of training-only dependencies breaking production.' },
      { q: 'Why should a CI/CD pipeline for an ML service include a model-quality check, not just unit tests?', options: ['A code change can pass all unit tests while silently degrading the model\'s actual predictions', 'Unit tests are sufficient for any ML system', 'Model quality checks are only relevant for deep learning', 'CI/CD pipelines cannot run ML evaluation code'], correct: 0, explanation: 'Passing unit tests proves the code runs — it says nothing about whether the model still predicts well.' },
      { q: 'What should always accompany a production ML deployment, regardless of cloud provider?', options: ['A rollback plan to redeploy a previous known-good model version quickly', 'A guarantee the model will never need retraining', 'Removing all monitoring to reduce cost', 'Disabling logging to save storage'], correct: 0, explanation: 'Treat a bad model deploy the same way you\'d treat a bad software release — a fast rollback path is not optional.' },
    ],
  },
];
