'use client';

// Backend Topics: a flat reference glossary of backend engineering
// concepts/technologies, grouped by category. Separate from the phase-based
// roadmap: a bird's-eye "have I at least heard of and understood this?"
// checklist across the whole field, same shape as the Algorithm List page.
// Every learn-link goes to a real, direct article/doc page, never a site
// search or a course listing.

import { useRouter } from 'next/navigation';
import { BACKEND_CATEGORIES, backendTopicKey, totalBackendTopics } from '@/lib/backend-topics';
import { useProgress } from '@/components/useProgress';
import AppNav from '@/components/AppNav';
import PageHeader from '@/components/PageHeader';
import PageEnter from '@/components/motion/PageEnter';
import ListItem from '@/components/motion/ListItem';
import ProgressBar from '@/components/motion/ProgressBar';
import AnimatedNumber from '@/components/motion/AnimatedNumber';
import rows from '../practice/check-row.module.css';

export default function BackendTopicsPage() {
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

  const total = totalBackendTopics();
  const solved = BACKEND_CATEGORIES.reduce(
    (n, c) => n + c.items.filter((it) => isDone(backendTopicKey(it.slug))).length,
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
          title="Backend Topics"
          sub="A bird's-eye glossary of backend engineering: databases, caching, messaging, APIs, security, containers, cloud, architecture patterns and system design."
        >
          <div className="progress-line">
            <span>
              <AnimatedNumber value={pct} suffix="%" />
            </span>
            <span className="meta-line">{solved}/{total} known</span>
            <ProgressBar value={pct} label="Backend Topics progress" />
          </div>
          {error ? <div className="detail-error" role="alert">{error}</div> : null}
        </PageHeader>

        {BACKEND_CATEGORIES.map((cat, i) => {
          const doneC = cat.items.filter((it) => isDone(backendTopicKey(it.slug))).length;
          return (
            <ListItem as="section" index={i} className="sub-block" key={cat.name}>
              <div className="sub-head">
                <h2 className="bank-group-title">{cat.name}</h2>
                <div className="sub-line" />
                <span className="sub-count mono">{doneC}/{cat.items.length}</span>
              </div>

              {cat.items.map((item) => {
                const id = backendTopicKey(item.slug);
                const done = isDone(id);
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
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${item.src} — ${item.t} (opens in a new tab)`}
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
