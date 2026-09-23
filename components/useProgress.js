'use client';

// Shared client hook for the interactive pages (topic detail, LeetCode bank).
// Loads the session + saved progress, and exposes an optimistic toggle that
// persists the full data blob to /api/progress. Toggling also updates the
// daily growth log so the dashboard's activity grid reflects real solves.

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function useProgress() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState({});
  const [growth, setGrowth] = useState({});
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Always POST the freshest data, even if two toggles land back-to-back.
  const latest = useRef({ progress: {}, growth: {}, meta: {} });

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
        const data = progRes.ok ? await progRes.json() : { progress: {}, growth: {}, meta: {} };
        if (!active) return;
        setUser(me.user);
        setProgress(data.progress || {});
        setGrowth(data.growth || {});
        setMeta(data.meta || {});
        latest.current = { progress: data.progress || {}, growth: data.growth || {}, meta: data.meta || {} };
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

  // Applies a next { progress, growth, meta } optimistically, persists it,
  // and rolls back to prev on failure. Any field a caller doesn't change
  // just passes through unchanged from latest.current.
  async function commit(next, prev) {
    setProgress(next.progress);
    setGrowth(next.growth);
    setMeta(next.meta);
    latest.current = next;
    setError('');

    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      });
      if (!res.ok) throw new Error('save failed');
    } catch {
      setProgress(prev.progress);
      setGrowth(prev.growth);
      setMeta(prev.meta);
      latest.current = prev;
      setError('Could not save — check your connection and try again.');
    }
  }

  async function toggle(id) {
    const prev = latest.current;
    const wasDone = !!prev.progress[id];
    const nextProgress = { ...prev.progress, [id]: !wasDone };
    if (wasDone) delete nextProgress[id];

    const key = todayKey();
    const delta = wasDone ? -1 : 1;
    const nextGrowth = { ...prev.growth };
    nextGrowth[key] = Math.max(0, (nextGrowth[key] || 0) + delta);

    await commit({ progress: nextProgress, growth: nextGrowth, meta: prev.meta }, prev);
  }

  // Persists which career the learner is currently on — read by /dashboard
  // (empty state vs. personalized hub) and set from the homepage / roadmap page.
  async function setSelectedCareer(careerId) {
    const prev = latest.current;
    const nextMeta = { ...prev.meta, selectedCareer: careerId };
    await commit({ progress: prev.progress, growth: prev.growth, meta: nextMeta }, prev);
  }

  return { user, progress, growth, meta, loading, error, isDone, toggle, setSelectedCareer };
}
