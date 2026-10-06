'use client';

// Site search across both roadmaps: topics, subtopics, practice questions,
// resources, and projects. Small static content set (a few thousand
// entries), so a plain client-side substring/relevance filter is all this
// needs, no search service or dependency.

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { buildSearchIndex, searchContent } from '@/lib/roadmap-engine';
import { useProgress } from '@/components/useProgress';
import AppNav from '@/components/AppNav';
import PageHeader from '@/components/PageHeader';
import PageEnter from '@/components/motion/PageEnter';
import styles from './search.module.css';

export default function SearchPage() {
  const { user, meta, loading, setSelectedCareer } = useProgress();
  const [query, setQuery] = useState('');
  const index = useMemo(buildSearchIndex, []);
  const results = useMemo(() => searchContent(query, index), [query, index]);

  if (loading) {
    return (
      <>
        <AppNav loading />
        <main className="page" aria-busy="true" />
      </>
    );
  }

  return (
    <>
      <AppNav user={user} careerId={meta.selectedCareer || null} active={null} onCareerChange={setSelectedCareer} />

      <PageEnter>
        <PageHeader
          eyebrow="Search"
          title="Find anything"
          sub="Topics, technologies, projects, resources and practice questions, across both tracks."
        />

        <input
          className="search-input"
          type="text"
          aria-label="Search Learn.it"
          placeholder="Try “HashMap”, “Spring Security”, “RAG”, “Transformers”…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />

        <p className={'meta-line ' + styles.count} aria-live="polite">
          {query ? (results.length ? `${results.length} result${results.length === 1 ? '' : 's'}` : `No results for “${query}”.`) : ''}
        </p>

        <div>
          {results.map((r, i) => (
            // Every result opens its in-app page (questions and resources
            // live on their topic page, where they can be checked off).
            <Link key={i} className="search-result" href={r.url}>
              <span className="search-result-type">{r.type}</span>
              <div>
                <div className="search-result-title">{r.title}</div>
                <div className="search-result-subtitle">
                  {r.career} · {r.subtitle}
                </div>
              </div>
              <span className="row-go" aria-hidden="true">›</span>
            </Link>
          ))}
        </div>
      </PageEnter>
    </>
  );
}
