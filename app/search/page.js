'use client';

// Site search across both roadmaps: topics, subtopics, practice questions,
// resources, and projects. Small static content set (a few thousand
// entries) — a plain client-side substring/relevance filter is all this
// needs, no search service or dependency.

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { buildSearchIndex, searchContent } from '@/lib/roadmap-engine';
import { useProgress } from '@/components/useProgress';
import ThemeToggle from '@/components/ThemeToggle';

export default function SearchPage() {
  const router = useRouter();
  const { loading } = useProgress();
  const [query, setQuery] = useState('');
  const index = useMemo(buildSearchIndex, []);
  const results = useMemo(() => searchContent(query, index), [query, index]);

  if (loading) {
    return (
      <main className="boot">
        <div className="eyebrow">Learn.it</div>
        <p className="sub">Loading…</p>
      </main>
    );
  }

  return (
    <div className="detail">
      <div className="page-topbar">
        <button className="back-btn" onClick={() => router.push('/dashboard')}>
          ← Back to dashboard
        </button>
        <ThemeToggle />
      </div>

      <div className="detail-head">
        <div className="detail-num mono">SEARCH</div>
        <div className="detail-title">Find anything on Learn.it</div>
        <div className="detail-sub">Search across topics, technologies, projects, resources, and practice questions.</div>
      </div>

      <input
        className="search-input"
        type="text"
        placeholder="Try “HashMap”, “Spring Security”, “RAG”, “Transformers”…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />

      <div style={{ marginTop: 20 }}>
        {query && results.length === 0 ? (
          <p className="hero-sub">No results for “{query}.”</p>
        ) : (
          results.map((r, i) => (
            <a
              key={i}
              className="search-result"
              href={r.url}
              target={r.external ? '_blank' : undefined}
              rel={r.external ? 'noopener noreferrer' : undefined}
              onClick={(e) => {
                if (!r.external) {
                  e.preventDefault();
                  router.push(r.url);
                }
              }}
            >
              <span className="search-result-type">{r.type}</span>
              <span>
                <div className="search-result-title">{r.title}</div>
                <div className="search-result-subtitle">{r.career} · {r.subtitle}</div>
              </span>
            </a>
          ))
        )}
      </div>
    </div>
  );
}
