'use client';

// Interview Q&A: commonly-asked interview questions, grouped by category,
// for the selected career track (the top-bar switcher changes it). Each item
// IS a question to be able to answer, checked off once you can confidently
// answer it.

import { INTERVIEW_CATEGORIES, interviewKey } from '@/lib/interview-questions';
import { INTERVIEW_CATEGORIES_AI } from '@/lib/interview-questions-ai';
import { getCareer } from '@/lib/roadmaps';
import { useProgress } from '@/components/useProgress';
import AppNav from '@/components/AppNav';
import PageHeader from '@/components/PageHeader';
import PageEnter from '@/components/motion/PageEnter';
import ListItem from '@/components/motion/ListItem';
import ProgressBar from '@/components/motion/ProgressBar';
import AnimatedNumber from '@/components/motion/AnimatedNumber';
import rows from '../practice/check-row.module.css';

export default function InterviewQuestionsPage() {
  const { user, meta, loading, error, isDone, toggle, setSelectedCareer } = useProgress();

  if (loading) {
    return (
      <>
        <AppNav loading />
        <main className="page" aria-busy="true" />
      </>
    );
  }

  const isAi = meta.selectedCareer === 'ai-engineer';
  const career = getCareer(isAi ? 'ai-engineer' : 'java-developer');
  const categories = isAi ? INTERVIEW_CATEGORIES_AI : INTERVIEW_CATEGORIES;
  const total = categories.reduce((n, c) => n + c.items.length, 0);
  const solved = categories.reduce(
    (n, c) => n + c.items.filter((it) => isDone(interviewKey(it.slug))).length,
    0
  );
  const pct = total ? Math.round((solved / total) * 100) : 0;

  return (
    <>
      <AppNav user={user} careerId={meta.selectedCareer || null} active="practice" onCareerChange={setSelectedCareer} />

      <PageEnter>
        <PageHeader
          back={{ href: '/practice', label: 'Practice' }}
          eyebrow={career.label}
          title="Interview Q&A"
          sub="Check a question off once you can answer it out loud, not just recognize it."
        >
          <div className="progress-line">
            <span>
              <AnimatedNumber value={pct} suffix="%" />
            </span>
            <span className="meta-line">{solved}/{total} ready</span>
            <ProgressBar value={pct} label="Interview Q&A progress" />
          </div>
          {error ? <div className="detail-error" role="alert">{error}</div> : null}
        </PageHeader>

        {categories.map((cat, i) => {
          const doneC = cat.items.filter((it) => isDone(interviewKey(it.slug))).length;
          return (
            <ListItem as="section" index={i} className="sub-block" key={career.id + cat.name}>
              <div className="sub-head">
                <h2 className="bank-group-title">{cat.name}</h2>
                <div className="sub-line" />
                <span className="sub-count mono">{doneC}/{cat.items.length}</span>
              </div>
              <a
                className={'link-arrow ' + rows.source}
                href={cat.source.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {cat.source.label} <span aria-hidden="true">↗</span>
              </a>

              {cat.items.map((item) => {
                const id = interviewKey(item.slug);
                const done = isDone(id);
                return (
                  <div key={item.slug} className={'q-row' + (done ? ' done' : '')}>
                    <button type="button" className={rows.toggle} aria-pressed={done} onClick={() => toggle(id)}>
                      <span className="q-check" aria-hidden="true">{done ? '✓' : ''}</span>
                      <span className="q-text">
                        <span className={rows.line}>{item.q}</span>
                        <span className={'algo-desc ' + rows.line}>{item.d}</span>
                      </span>
                    </button>
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
