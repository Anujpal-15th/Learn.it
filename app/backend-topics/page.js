'use client';

// Backend Topics — a flat reference glossary of backend engineering
// concepts/technologies, grouped by category. Separate from the phase-based
// roadmap: a bird's-eye "have I at least heard of and understood this?"
// checklist across the whole field, same shape as the Algorithm List page.
// Every learn-link goes to a real, direct article/doc page — never a site
// search or a course listing.

import { useRouter } from 'next/navigation';
import { BACKEND_CATEGORIES, backendTopicKey, totalBackendTopics } from '@/lib/backend-topics';
import { useProgress } from '@/components/useProgress';

export default function BackendTopicsPage() {
  const router = useRouter();
  const { loading, error, isDone, toggle } = useProgress();

  if (loading) {
    return (
      <main className="boot">
        <div className="eyebrow">The Ledger</div>
        <p className="sub">Loading backend topics…</p>
      </main>
    );
  }

  const total = totalBackendTopics();
  const solved = BACKEND_CATEGORIES.reduce(
    (n, c) => n + c.items.filter((it) => isDone(backendTopicKey(it.slug))).length,
    0
  );

  return (
    <div className="detail">
      <button className="back-btn" onClick={() => router.push('/')}>
        ← Back to roadmap
      </button>

      <div className="detail-head">
        <div className="detail-num mono">REFERENCE</div>
        <div className="detail-title">Backend Topics</div>
        <div className="detail-sub">
          A bird's-eye glossary of backend engineering — databases, caching,
          messaging, APIs, security, containers, cloud, architecture
          patterns, and system design — independent of the phase roadmap.
        </div>
        <div className="detail-progress">
          <div className="bar-bg">
            <div
              className="bar-fill"
              style={{ width: (total ? Math.round((solved / total) * 100) : 0) + '%' }}
            />
          </div>
          <span className="mono" style={{ fontSize: 12 }}>{solved}/{total} known</span>
        </div>
        {error ? <div className="detail-error">{error}</div> : null}
      </div>

      {BACKEND_CATEGORIES.map((cat) => {
        const doneC = cat.items.filter((it) => isDone(backendTopicKey(it.slug))).length;
        return (
          <div className="sub-block" key={cat.name}>
            <div className="sub-head">
              <span className="bank-group-title">{cat.name}</span>
              <div className="sub-line" />
              <span className="sub-count mono">{doneC}/{cat.items.length}</span>
            </div>

            {cat.items.map((item) => {
              const id = backendTopicKey(item.slug);
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
                    <div>{item.t}</div>
                    <div className="algo-desc">{item.d}</div>
                  </div>
                  <a
                    className="algo-link mono"
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.src} {'↗'}
                  </a>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
