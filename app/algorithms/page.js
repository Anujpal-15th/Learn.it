'use client';

// Algorithm List: a flat reference glossary of named algorithms (Huffman
// coding, Dijkstra, KMP, ...), grouped by category. Separate from the DSA
// phase's pattern-based topics: this is "have I learned this named
// algorithm?", not tied to solving a specific practice problem. Keyed under
// 'algo::' so it never collides with topic/subtopic question ids.

import { useRouter } from 'next/navigation';
import { ALGO_CATEGORIES, algoKey, algoLearnMore, totalAlgorithms } from '@/lib/algorithms';
import { useProgress } from '@/components/useProgress';
import AppNav from '@/components/AppNav';
import PageHeader from '@/components/PageHeader';
import PageEnter from '@/components/motion/PageEnter';
import ListItem from '@/components/motion/ListItem';
import ProgressBar from '@/components/motion/ProgressBar';
import AnimatedNumber from '@/components/motion/AnimatedNumber';
import rows from '../practice/check-row.module.css';

export default function AlgorithmsPage() {
  const router = useRouter();
  const { user, meta, loading, error, isDone, toggle, setSelectedCareer } = useProgress();

  // Java-only page: switching to another track goes back to the hub. Await
  // the save so /practice loads the new career.
  async function onCareerChange(id) {
    await setSelectedCareer(id);
    if (id !== 'java-developer') router.push('/practice');
  }

  if (loading) {
    return (
      <>
        <AppNav loading />
        <main className="page" aria-busy="true" />
      </>
    );
  }

  const total = totalAlgorithms();
  const solved = ALGO_CATEGORIES.reduce(
    (n, c) => n + c.items.filter((it) => isDone(algoKey(it.slug))).length,
    0
  );
  const pct = total ? Math.round((solved / total) * 100) : 0;

  return (
    <>
      <AppNav user={user} careerId={meta.selectedCareer || null} active="practice" onCareerChange={onCareerChange} />

      <PageEnter>
        <PageHeader
          back={{ href: '/practice', label: 'Practice' }}
          eyebrow="Reference"
          title="Algorithm List"
          sub="Every named algorithm worth knowing, grouped by category. A glossary and checklist, independent of the roadmap's DSA patterns."
        >
          <div className="progress-line">
            <span>
              <AnimatedNumber value={pct} suffix="%" />
            </span>
            <span className="meta-line">{solved}/{total} known</span>
            <ProgressBar value={pct} label="Algorithm List progress" />
          </div>
          {error ? <div className="detail-error" role="alert">{error}</div> : null}
        </PageHeader>

        {ALGO_CATEGORIES.map((cat, i) => {
          const doneC = cat.items.filter((it) => isDone(algoKey(it.slug))).length;
          return (
            <ListItem as="section" index={i} className="sub-block" key={cat.name}>
              <div className="sub-head">
                <h2 className="bank-group-title">{cat.name}</h2>
                <div className="sub-line" />
                <span className="sub-count mono">{doneC}/{cat.items.length}</span>
              </div>

              {cat.items.map((item) => {
                const id = algoKey(item.slug);
                const done = isDone(id);
                const learn = algoLearnMore(item);
                return (
                  <div key={item.slug} className={'q-row' + (done ? ' done' : '')}>
                    <button type="button" className={rows.toggle} aria-pressed={done} onClick={() => toggle(id)}>
                      <span className="q-check" aria-hidden="true">{done ? '✓' : ''}</span>
                      <span className="q-text">
                        <span className={rows.line}>{item.t}</span>
                        <span className={'algo-desc ' + rows.line}>{item.d}</span>
                      </span>
                    </button>
                    <a
                      className="algo-link mono"
                      href={learn.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={learn.label + ' (opens in a new tab)'}
                    >
                      {item.src} {'↗'}
                    </a>
                  </div>
                );
              })}
            </ListItem>
          );
        })}
      </PageEnter>
    </>
  );
}
