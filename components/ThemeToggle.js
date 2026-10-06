'use client';

// Icon-only light/dark toggle, persisted under `ledger-theme`. app/layout.js's
// inline script applies the saved/system theme before hydration, so this only
// reads the attribute after mount. The icon renders only once the real theme
// is known (state set in an effect, never read during render), so server and
// client markup match and the first icon appears without animating.

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

function Sun() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function Moon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
    </svg>
  );
}

export default function ThemeToggle({ className = 'btn-ghost btn-sm' }) {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
  }, []);

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('ledger-theme', next);
    } catch {}
    setTheme(next);
  }

  const label = theme === 'dark' ? 'Switch to light mode' : theme === 'light' ? 'Switch to dark mode' : 'Toggle color theme';

  return (
    <button type="button" className={className} onClick={toggle} aria-label={label} title={label}>
      {/* Fixed 16px box so the button never resizes before the icon appears. */}
      <span style={{ display: 'inline-flex', width: 16, height: 16 }}>
        <AnimatePresence mode="wait" initial={false}>
          {theme ? (
            <motion.span
              key={theme}
              style={{ display: 'inline-flex' }}
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
            >
              {theme === 'dark' ? <Sun /> : <Moon />}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </span>
    </button>
  );
}
