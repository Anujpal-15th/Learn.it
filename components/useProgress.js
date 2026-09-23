'use client';

// Shared client hook for the interactive pages (topic detail, LeetCode bank).
// Loads the session + saved progress, and exposes an optimistic toggle that
// persists the full data blob to /api/progress. Toggling also updates the
// daily growth log so the dashboard's activity grid reflects real solves.
//
// Concurrency: writes are optimistically-locked on a server-side `version`
// counter (see app/api/progress/route.js). A POST based on a stale version
// gets a 409 back with the current server state instead of silently
// clobbering whatever another tab/device just saved — commit() below reacts
// to that by re-applying the SAME intended change on top of the fresh state
// and retrying, so neither tab's change is lost.

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

const MAX_RETRIES = 3;

export function useProgress() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState({});
  const [growth, setGrowth] = useState({});
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Always POST the freshest data, even if two toggles land back-to-back.
  const latest = useRef({ progress: {}, growth: {}, meta: {}, version: 0 });

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        // Fire both requests together — /api/progress re-derives the user
        // from the same session cookie independently, so there's no need to
        // wait for /api/auth/me to finish first. This roughly halves the
        // network wait on every page load.
        const [meRes, progRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/progress'),
        ]);
        if (!meRes.ok) {
          router.replace('/login');
          return;
        }
        const me = await meRes.json();
        const data = progRes.ok
          ? await progRes.json()
          : { progress: {}, growth: {}, meta: {}, version: 0 };
        if (!active) return;
        setUser(me.user);
        setProgress(data.progress || {});
        setGrowth(data.growth || {});
        setMeta(data.meta || {});
        latest.current = {
          progress: data.progress || {},
          growth: data.growth || {},
          meta: data.meta || {},
          version: data.version || 0,
        };
        setLoading(false);
      } catch {
        router.replace('/login');
      }
    })();
    return () => {
      active = false;
    };
  }, [router]);

  function isDone(id) {
    return !!progress[id];
  }

  // applyFn(base) -> { progress, growth, meta } describes the intended
  // change as a function of whatever base state turns out to be current,
  // not a value precomputed from a snapshot that might already be stale —
  // that's what lets a 409 retry reapply the same intent onto fresh data.
  async function commit(applyFn) {
    const original = latest.current;
    let base = original;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      const next = applyFn(base);
      setProgress(next.progress);
      setGrowth(next.growth);
      setMeta(next.meta);

      try {
        const res = await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...next, version: base.version }),
        });

        if (res.status === 409) {
          const body = await res.json();
          base = body.current; // fresh server state; retry with it as the new base
          continue;
        }

        if (!res.ok) throw new Error('save failed');

        const saved = await res.json();
        const finalState = { ...next, version: saved.version };
        latest.current = finalState;
        setError('');
        return;
      } catch {
        setProgress(original.progress);
        setGrowth(original.growth);
        setMeta(original.meta);
        latest.current = original;
        setError('Could not save — check your connection and try again.');
        return;
      }
    }

    // Exhausted retries under sustained contention — roll back the optimistic
    // UI to the last confirmed state rather than leaving it showing a change
    // that was never actually persisted.
    setProgress(original.progress);
    setGrowth(original.growth);
    setMeta(original.meta);
    latest.current = original;
    setError('Could not save — this account is being updated elsewhere right now. Please refresh and try again.');
  }

  async function toggle(id) {
    await commit((base) => {
      const wasDone = !!base.progress[id];
      const nextProgress = { ...base.progress, [id]: !wasDone };
      if (wasDone) delete nextProgress[id];

      const key = todayKey();
      const delta = wasDone ? -1 : 1;
      const nextGrowth = { ...base.growth };
      nextGrowth[key] = Math.max(0, (nextGrowth[key] || 0) + delta);

      return { progress: nextProgress, growth: nextGrowth, meta: base.meta };
    });
  }

  // Persists which career the learner is currently on — read by /dashboard
  // (empty state vs. personalized hub) and set from the homepage / roadmap page.
  async function setSelectedCareer(careerId) {
    await commit((base) => ({
      progress: base.progress,
      growth: base.growth,
      meta: { ...base.meta, selectedCareer: careerId },
    }));
  }

  return { user, progress, growth, meta, loading, error, isDone, toggle, setSelectedCareer };
}
