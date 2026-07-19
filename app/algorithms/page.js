'use client';

// Algorithm List — a flat reference glossary of named algorithms (Huffman
// coding, Dijkstra, KMP, ...), grouped by category. Separate from the DSA
// phase's pattern-based topics: this is "have I learned this named
// algorithm?", not tied to solving a specific practice problem. Uses the
// same useProgress hook (generic — works with any string id), keyed under
// 'algo::' so it never collides with topic/subtopic question ids.

import { useRouter } from 'next/navigation';
import { ALGO_CATEGORIES, algoKey, algoLearnMore, totalAlgorithms } from '@/lib/algorithms';
import { useProgress } from '@/components/useProgress';
import ThemeToggle from '@/components/ThemeToggle';

export default function AlgorithmsPage() {
  const router = useRouter();
  const { loading, error, isDone, toggle } = useProgress();

  if (loading) {
    return (
      <main className="boot">
        <div className="eyebrow">The Ledger</div>
        <p className="sub">Loading the algorithm list…</p>
      </main>
    );
  }

  const total = totalAlgorithms();
  const solved = ALGO_CATEGORIES.reduce(
    (n, c) => n + c.items.filter((it) => isDone(algoKey(it.slug))).length,
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
        <div className="detail-title">Algorithm List</div>
        <div className="detail-sub">
          Every named algorithm worth knowing, grouped by category — a
          glossary and checklist independent of the roadmap's DSA patterns.
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

      {ALGO_CATEGORIES.map((cat) => {
        const doneC = cat.items.filter((it) => isDone(algoKey(it.slug))).length;
        return (
          <div className="sub-block" key={cat.name}>
            <div className="sub-head">
              <span className="sub-title">{cat.name}</span>
              <div className="sub-line" />
              <span className="sub-count mono">{doneC}/{cat.items.length}</span>
            </div>

            {cat.items.map((item) => {
              const id = algoKey(item.slug);
              const done = isDone(id);
              const learn = algoLearnMore(item);
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
                    href={learn.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Learn {'↗'}
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
