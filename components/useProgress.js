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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Always POST the freshest data, even if two toggles land back-to-back.
  const latest = useRef({ progress: {}, growth: {} });

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
        const data = progRes.ok ? await progRes.json() : { progress: {}, growth: {} };
        if (!active) return;
        setUser(me.user);
        setProgress(data.progress || {});
        setGrowth(data.growth || {});
        latest.current = { progress: data.progress || {}, growth: data.growth || {} };
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

  // Applies nextProgress/nextGrowth optimistically, persists them, and rolls
  // back to prevProgress/prevGrowth on failure. Shared by toggle (one id) and
  // toggleMany (a whole subtopic's worth of ids at once).
  async function commit(nextProgress, nextGrowth, prevProgress, prevGrowth) {
    setProgress(nextProgress);
    setGrowth(nextGrowth);
    latest.current = { progress: nextProgress, growth: nextGrowth };
    setError('');

    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(latest.current),
      });
      if (!res.ok) throw new Error('save failed');
    } catch {
      setProgress(prevProgress);
      setGrowth(prevGrowth);
      latest.current = { progress: prevProgress, growth: prevGrowth };
      setError('Could not save — check your connection and try again.');
    }
  }

  async function toggle(id) {
    const prevProgress = latest.current.progress;
    const prevGrowth = latest.current.growth;
    const wasDone = !!prevProgress[id];
    const nextProgress = { ...prevProgress, [id]: !wasDone };
    if (wasDone) delete nextProgress[id];

    const key = todayKey();
    const delta = wasDone ? -1 : 1;
    const nextGrowth = { ...prevGrowth };
    nextGrowth[key] = Math.max(0, (nextGrowth[key] || 0) + delta);

    await commit(nextProgress, nextGrowth, prevProgress, prevGrowth);
  }

  // Marks every id in `ids` done (or, if they're already all done, marks
  // them all undone) in a single save — the subtopic-level "mark topic
  // learned" checkbox on Phase 2+ topic pages.
  async function toggleMany(ids) {
    const prevProgress = latest.current.progress;
    const prevGrowth = latest.current.growth;
    const allDone = ids.every((id) => !!prevProgress[id]);
    const setTo = !allDone;

    const nextProgress = { ...prevProgress };
    let delta = 0;
    ids.forEach((id) => {
      const wasDone = !!prevProgress[id];
      if (wasDone === setTo) return;
      delta += setTo ? 1 : -1;
      if (setTo) nextProgress[id] = true;
      else delete nextProgress[id];
    });

    const key = todayKey();
    const nextGrowth = { ...prevGrowth };
    nextGrowth[key] = Math.max(0, (nextGrowth[key] || 0) + delta);

    await commit(nextProgress, nextGrowth, prevProgress, prevGrowth);
  }

  return { user, progress, growth, loading, error, isDone, toggle, toggleMany };
}
