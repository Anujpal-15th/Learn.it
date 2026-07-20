'use client';

// Networking — a reference glossary of networking fundamentals, grouped by
// category. Complements the brief "Networking Foundations" subtopic under
// the REST topic with the fuller standalone treatment. Same shape as
// Algorithm List / Backend Topics.

import { useRouter } from 'next/navigation';
import { NETWORKING_CATEGORIES, networkingKey, totalNetworkingTopics } from '@/lib/networking';
import { useProgress } from '@/components/useProgress';
import ThemeToggle from '@/components/ThemeToggle';

export default function NetworkingPage() {
  const router = useRouter();
  const { loading, error, isDone, toggle } = useProgress();

  if (loading) {
    return (
      <main className="boot">
        <div className="eyebrow">Learn.it</div>
        <p className="sub">Loading networking topics…</p>
      </main>
    );
  }

  const total = totalNetworkingTopics();
  const solved = NETWORKING_CATEGORIES.reduce(
    (n, c) => n + c.items.filter((it) => isDone(networkingKey(it.slug))).length,
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
        <div className="detail-title">Networking</div>
        <div className="detail-sub">
          The layer underneath every API call — models, transport, naming,
          security, and how traffic gets scaled — independent of the phase
          roadmap.
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

      {NETWORKING_CATEGORIES.map((cat) => {
        const doneC = cat.items.filter((it) => isDone(networkingKey(it.slug))).length;
        return (
          <div className="sub-block" key={cat.name}>
            <div className="sub-head">
              <span className="bank-group-title">{cat.name}</span>
              <div className="sub-line" />
              <span className="sub-count mono">{doneC}/{cat.items.length}</span>
            </div>

            {cat.items.map((item) => {
              const id = networkingKey(item.slug);
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
