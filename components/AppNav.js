'use client';

// The one top bar for every page. Contract (spec section 6):
//   user           undefined = loading, null = logged out, object = logged in
//   careerId       'java-developer' | 'ai-engineer' | null
//   active         'home' | 'roadmap' | 'practice' | 'projects' | null
//   onCareerChange optional; default swaps the career segment in the URL
//                  (roadmap/checklist) or goes to /roadmap/{id}
//   loading        logo + disabled switcher only
//   minimal        logo + theme toggle only (auth pages); careerId, if given,
//                  still drives the track accent
// AppNav is the only runtime writer of html[data-track] and
// localStorage['learnit-track'] (the layout pre-paint script is the other).

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { CAREERS } from '@/lib/roadmaps';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import CareerSwitcher from './CareerSwitcher';
import s from './AppNav.module.css';

const TABS = [
  { key: 'home', label: 'Home', href: () => '/dashboard', always: true },
  { key: 'roadmap', label: 'Roadmap', href: (id) => '/roadmap/' + id },
  { key: 'practice', label: 'Practice', href: () => '/practice' },
  { key: 'projects', label: 'Projects', href: () => '/projects' },
];

const POP = {
  initial: { opacity: 0, y: -6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.18, ease: [0.32, 0.72, 0, 1] },
};

const isCareer = (id) => CAREERS.some((c) => c.id === id);

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

function MenuIcon({ open }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
    </svg>
  );
}

export default function AppNav({ user, careerId = null, active = null, onCareerChange, loading = false, minimal = false }) {
  const router = useRouter();
  const pathname = usePathname() || '';
  const uid = useId();
  const menuId = 'nav-menu' + uid;
  const accountId = 'nav-account' + uid;

  const [pending, setPending] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const menuRef = useRef(null);
  const menuBtnRef = useRef(null);
  const accountRef = useRef(null);
  const accountBtnRef = useRef(null);

  // Optimistic pill: a click shows the new track immediately; the real value
  // takes over once the parent's careerId catches up.
  const shown = pending ?? (isCareer(careerId) ? careerId : null);
  const isLoading = loading || user === undefined;
  const loggedIn = !loading && !!user;

  useEffect(() => {
    setPending(null);
  }, [careerId]);

  useEffect(() => {
    if (!shown) return;
    document.documentElement.dataset.track = shown;
    try {
      localStorage.setItem('learnit-track', shown);
    } catch {}
  }, [shown]);

  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  // Escape and outside click close whichever popover is open.
  useEffect(() => {
    if (!menuOpen && !accountOpen) return undefined;
    function onPointerDown(e) {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
      if (accountOpen && accountRef.current && !accountRef.current.contains(e.target)) setAccountOpen(false);
    }
    function onKeyDown(e) {
      if (e.key !== 'Escape') return;
      if (menuOpen) {
        setMenuOpen(false);
        if (menuBtnRef.current) menuBtnRef.current.focus();
      }
      if (accountOpen) {
        setAccountOpen(false);
        if (accountBtnRef.current) accountBtnRef.current.focus();
      }
    }
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen, accountOpen]);

  function defaultCareerChange(id) {
    if (careerId && pathname.includes(careerId)) router.push(pathname.replace(careerId, id));
    else router.push('/roadmap/' + id);
  }

  function handleCareer(id) {
    setPending(id);
    try {
      const result = (onCareerChange || defaultCareerChange)(id);
      if (result && typeof result.then === 'function') result.catch(() => setPending(null));
    } catch {
      setPending(null);
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    router.replace('/login');
    router.refresh();
  }

  const tabs = loggedIn ? TABS.filter((t) => t.always || shown) : [];
  const tabLinks = (className) =>
    tabs.map((t) => (
      <Link
        key={t.key}
        href={t.href(shown)}
        className={className}
        aria-current={active === t.key ? 'page' : undefined}
      >
        {t.label}
      </Link>
    ));

  const initial = loggedIn ? ((user.name || user.email || '?').trim()[0] || '?').toUpperCase() : '';
  const logoHref = loggedIn || loading ? '/dashboard' : '/';

  return (
    <header className={s.bar + (minimal ? ' ' + s.minimal : '')}>
      <div className={s.row}>
        <Link href={logoHref} className={s.brand} aria-label="Learn.it home">
          <Logo size={26} />
          <span className={s.mark} aria-hidden="true">
            Learn.it
          </span>
        </Link>

        {minimal ? null : (
          <div className={s.switch}>
            <CareerSwitcher
              value={shown}
              onChange={handleCareer}
              disabled={isLoading && !shown}
              className={s.switcher}
            />
          </div>
        )}

        <div className={s.right}>
          {minimal ? (
            <ThemeToggle className={s.iconBtn} />
          ) : isLoading ? null : !loggedIn ? (
            <>
              <ThemeToggle className={s.iconBtn} />
              <Link href="/login" className="btn-ghost btn-sm">
                Log in
              </Link>
              <Link href="/signup" className="btn-primary btn-sm">
                Sign up
              </Link>
            </>
          ) : (
            <>
              {/* Desktop (>=1025px): tabs inline. */}
              <nav aria-label="Main" className={s.tabs + ' ' + s.wide}>
                {tabLinks(s.tab)}
              </nav>
              <Link href="/search" className={s.iconBtn} aria-label="Search">
                <SearchIcon />
              </Link>
              <ThemeToggle className={s.iconBtn + ' ' + s.wide} />

              <div ref={accountRef} className={s.wide}>
                <button
                  ref={accountBtnRef}
                  type="button"
                  className={s.iconBtn}
                  aria-label="Account"
                  aria-expanded={accountOpen}
                  aria-controls={accountId}
                  onClick={() => setAccountOpen((o) => !o)}
                >
                  <span className={s.avatar} aria-hidden="true">
                    {initial}
                  </span>
                </button>
                <AnimatePresence>
                  {accountOpen ? (
                    <motion.div key="account" id={accountId} className={s.pop} {...POP}>
                      <AccountBlock user={user} onLogout={handleLogout} />
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              {/* <=1024px: tabs, theme and account move into this panel. */}
              <div ref={menuRef} className={s.narrow}>
                <button
                  ref={menuBtnRef}
                  type="button"
                  className={s.iconBtn}
                  aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={menuOpen}
                  aria-controls={menuId}
                  onClick={() => setMenuOpen((o) => !o)}
                >
                  <MenuIcon open={menuOpen} />
                </button>
                <AnimatePresence>
                  {menuOpen ? (
                    <motion.div key="menu" id={menuId} className={s.pop + ' ' + s.panel} {...POP}>
                      <nav aria-label="Main" className={s.panelTabs}>
                        {tabLinks(s.panelTab)}
                      </nav>
                      <div className={s.panelRow}>
                        <span>Theme</span>
                        <ThemeToggle className={s.iconBtn} />
                      </div>
                      <AccountBlock user={user} onLogout={handleLogout} />
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function AccountBlock({ user, onLogout }) {
  return (
    <div className={s.account}>
      {user.name ? <div className={s.accountName}>{user.name}</div> : null}
      {user.email ? <div className={s.accountEmail}>{user.email}</div> : null}
      <button type="button" className={'btn-ghost btn-sm ' + s.logout} onClick={onLogout}>
        Log out
      </button>
    </div>
  );
}
