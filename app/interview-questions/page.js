'use client';

// Interview Q&A — commonly-asked interview questions, grouped by category,
// now split across both career tracks. Each item IS a question to be able
// to answer, checked off once you can confidently answer it. Defaults to
// whichever track matches the learner's selected career.

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { INTERVIEW_CATEGORIES, interviewKey } from '@/lib/interview-questions';
import { INTERVIEW_CATEGORIES_AI } from '@/lib/interview-questions-ai';
import { useProgress } from '@/components/useProgress';
import ThemeToggle from '@/components/ThemeToggle';

const TRACKS = {
  java: { label: 'Java Developer', categories: INTERVIEW_CATEGORIES },
  ai: { label: 'AI Engineer', categories: INTERVIEW_CATEGORIES_AI },
};

export default function InterviewQuestionsPage() {
  const router = useRouter();
  const { meta, loading, error, isDone, toggle } = useProgress();
  const [track, setTrack] = useState(null);

  const activeTrack = track || (meta.selectedCareer === 'ai-engineer' ? 'ai' : 'java');

  if (loading) {
    return (
      <main className="boot">
        <div className="eyebrow">Learn.it</div>
        <p className="sub">Loading interview questions…</p>
      </main>
    );
  }

  const categories = TRACKS[activeTrack].categories;
  const total = categories.reduce((n, c) => n + c.items.length, 0);
  const solved = categories.reduce(
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
          Commonly-asked interview questions — check one off once you can
          confidently answer it out loud, not just recognize it.
        </div>

        <div className="landing-cta" style={{ marginTop: 14, marginBottom: 6 }}>
          {Object.entries(TRACKS).map(([key, t]) => (
            <button
              key={key}
              className={activeTrack === key ? 'btn-primary' : 'back-btn'}
              onClick={() => setTrack(key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="detail-progress">
          <div className="bar-bg">
            <div className="bar-fill" style={{ width: (total ? Math.round((solved / total) * 100) : 0) + '%' }} />
          </div>
          <span className="mono" style={{ fontSize: 12 }}>{solved}/{total} ready</span>
        </div>
        {error ? <div className="detail-error">{error}</div> : null}
      </div>

      {categories.map((cat) => {
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
