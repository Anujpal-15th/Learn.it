'use client';

// The shared top nav for the four primary surfaces (Home, Roadmap, Practice,
// Projects) — kept to exactly those four so the app doesn't grow a nav item
// per feature. Everything else (interview questions, DSA/LeetCode bank,
// networking, backend topics, readiness) is reachable from inside those four
// surfaces instead. Search lives as a small icon link, not a 5th tab.

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';

const LINKS = [
  { href: '/dashboard', label: 'Home' },
  { href: '/roadmap', label: 'Roadmap' },
  { href: '/practice', label: 'Practice' },
  { href: '/projects', label: 'Projects' },
];

export default function AppNav({ user, careerId, active }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
    router.refresh();
  }

  function hrefFor(link) {
    // Roadmap is career-scoped; the other three aren't.
    return link.href === '/roadmap' && careerId ? '/roadmap/' + careerId : link.href;
  }

  return (
    <div className="topbar">
      <div className="brand">
        <Logo size={26} />
        <span className="mark">Learn.it</span>
        {user ? <span className="sub">{user.name || user.email}</span> : null}
      </div>
      <button className="menu-btn" onClick={() => setMenuOpen((o) => !o)} aria-label="Menu" aria-expanded={menuOpen}>
        {menuOpen ? '✕' : '☰'}
      </button>
      <div className={'nav' + (menuOpen ? ' open' : '')}>
        {LINKS.filter((link) => link.href === '/dashboard' || careerId).map((link) => (
          <Link
            key={link.href}
            className={'tab' + (active === link.label.toLowerCase() ? ' current' : '')}
            href={hrefFor(link)}
          >
            {link.label}
          </Link>
        ))}
        <Link className="tab" href="/search" aria-label="Search">
          Search
        </Link>
        <ThemeToggle />
        <button className="tab" onClick={handleLogout}>Log out</button>
      </div>
    </div>
  );
}
