'use client';

// Small theme toggle — flips the polarity of the same strict two-tone
// system (Design.md stays black/white either way, just inverted), persisted
// in localStorage. app/layout.js's inline script applies the saved/system
// theme before hydration so there's no flash on load.

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    setTheme(document.documentElement.getAttribute('data-theme') || 'light');
  }, []);

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('ledger-theme', next);
    setTheme(next);
  }

  return (
    <button className="tab" onClick={toggle} aria-label="Toggle dark mode">
      {theme === 'dark' ? '☀ Light' : '● Dark'}
    </button>
  );
}
