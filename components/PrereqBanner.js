'use client';

// Soft, non-blocking "recommended prerequisites" notice. Never prevents
// access to the topic — it just tells the learner what's recommended first
// and lets them jump there, or ignore it and continue anyway.

import Link from 'next/link';

export default function PrereqBanner({ gaps }) {
  if (!gaps || gaps.length === 0) return null;

  return (
    <div className="prereq-banner">
      <div className="prereq-banner-label">Recommended prerequisites</div>
      <p className="prereq-banner-sub">
        You can continue anyway — these just make this topic easier.
      </p>
      <ul className="prereq-list">
        {gaps.map((g) => (
          <li key={g.id}>
            <Link href={'/topic/' + g.id}>{g.title}</Link>
            <span className="prereq-status mono">
              {g.status === 'IN_PROGRESS' ? 'in progress' : 'not started'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
