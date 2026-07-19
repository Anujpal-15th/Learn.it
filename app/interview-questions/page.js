'use client';

// Interview Q&A — commonly-asked interview questions, grouped by category.
// Different in kind from the other reference pages: each item IS a question
// to be able to answer, not a topic to learn — checked off once you can
// confidently answer it. Each category links to one real, direct article.

import { useRouter } from 'next/navigation';
import { INTERVIEW_CATEGORIES, interviewKey, totalInterviewQuestions } from '@/lib/interview-questions';
import { useProgress } from '@/components/useProgress';
import ThemeToggle from '@/components/ThemeToggle';

export default function InterviewQuestionsPage() {
  const router = useRouter();
  const { loading, error, isDone, toggle } = useProgress();

  if (loading) {
    return (
      <main className="boot">
        <div className="eyebrow">The Ledger</div>
        <p className="sub">Loading interview questions…</p>
      </main>
    );
  }

  const total = totalInterviewQuestions();
  const solved = INTERVIEW_CATEGORIES.reduce(
    (n, c) => n + c.items.filter((it) => isDone(interviewKey(it.slug))).length,
    0
  );

  return (
    <div className="detail">
      <div className="page-topbar">
        <button className="back-btn" onClick={() => router.push('/dashboard')}>
          ← Back to roadmap
        </button>
        <ThemeToggle />
      </div>

      <div className="detail-head">
        <div className="detail-num mono">REFERENCE</div>
        <div className="detail-title">Interview Q&amp;A</div>
        <div className="detail-sub">
          Commonly-asked interview questions across Java, Spring, databases,
          REST, system design, testing, and behavioral rounds — check one off
          once you can confidently answer it out loud, not just recognize it.
        </div>
        <div className="detail-progress">
          <div className="bar-bg">
            <div
              className="bar-fill"
              style={{ width: (total ? Math.round((solved / total) * 100) : 0) + '%' }}
            />
          </div>
          <span className="mono" style={{ fontSize: 12 }}>{solved}/{total} ready</span>
        </div>
        {error ? <div className="detail-error">{error}</div> : null}
      </div>

      {INTERVIEW_CATEGORIES.map((cat) => {
        const doneC = cat.items.filter((it) => isDone(interviewKey(it.slug))).length;
        return (
          <div className="sub-block" key={cat.name}>
            <div className="sub-head">
              <span className="bank-group-title">{cat.name}</span>
              <div className="sub-line" />
              <span className="sub-count mono">{doneC}/{cat.items.length}</span>
            </div>
            <a
              className="concept-more"
              href={cat.source.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-block', marginBottom: 12 }}
            >
              {cat.source.label} {'↗'}
            </a>

            {cat.items.map((item) => {
              const id = interviewKey(item.slug);
              const done = isDone(id);
              return (
                <div
                  key={item.slug}
                  className={'q-row' + (done ? ' done' : '')}
                  onClick={() => toggle(id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggle(id);
                    }
                  }}
                >
                  <div className="q-check">{done ? '✓' : ''}</div>
                  <div className="q-text">
                    <div>{item.q}</div>
                    <div className="algo-desc">{item.d}</div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
