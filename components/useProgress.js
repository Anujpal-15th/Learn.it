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
        const meRes = await fetch('/api/auth/me');
        if (!meRes.ok) {
          router.replace('/login');
          return;
        }
        const me = await meRes.json();
        const progRes = await fetch('/api/progress');
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

  async function toggle(id) {
    const wasDone = !!latest.current.progress[id];
    const nextProgress = { ...latest.current.progress, [id]: !wasDone };
    if (wasDone) delete nextProgress[id];

    const key = todayKey();
    const delta = wasDone ? -1 : 1;
    const nextGrowth = { ...latest.current.growth };
    nextGrowth[key] = Math.max(0, (nextGrowth[key] || 0) + delta);

    // Optimistic UI.
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
      // Roll back on failure so the UI never lies about what's saved.
      const revertProgress = { ...latest.current.progress };
      if (wasDone) revertProgress[id] = true;
      else delete revertProgress[id];
      const revertGrowth = { ...latest.current.growth };
      revertGrowth[key] = Math.max(0, (revertGrowth[key] || 0) - delta);
      setProgress(revertProgress);
      setGrowth(revertGrowth);
      latest.current = { progress: revertProgress, growth: revertGrowth };
      setError('Could not save — check your connection and try again.');
    }
  }

  return { user, progress, growth, loading, error, isDone, toggle };
}
