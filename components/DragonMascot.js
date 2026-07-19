'use client';

// Optional decorative mascot (Phase 5 extra): a line-art dragon, drawn in
// the current accent color so it always matches the theme, that slowly
// loops around the edges of the viewport. Entirely self-contained — this
// is the whole "module": it renders itself, owns its own on/off state
// (persisted in localStorage), and exposes nothing else. Drop <DragonMascot />
// into a layout to attach it; delete it to detach it.

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

const STORAGE_KEY = 'ledger-dragon';
const MARGIN = 56;
const LOOP_SECONDS = 36;

export default function DragonMascot() {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [bounds, setBounds] = useState({ w: 1200, h: 800 });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    setEnabled(saved === null ? true : saved === 'on');
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    setReady(true);
  }, []);

  useEffect(() => {
    function measure() {
      setBounds({ w: window.innerWidth, h: window.innerHeight });
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  function toggle() {
    const next = !enabled;
    setEnabled(next);
    localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off');
  }

  if (!ready) return null;

  const m = MARGIN;
  const { w, h } = bounds;
  // Loop the viewport edges: top-left -> top-right -> bottom-right ->
  // bottom-left -> top-left. Rotation is interpolated across each leg so
  // the dragon banks into each turn instead of snapping.
  const xKeyframes = [m, w - m, w - m, m, m];
  const yKeyframes = [m, m, h - m, h - m, m];
  const rotateKeyframes = [0, 0, 90, 180, 270, 360];
  const xk = [...xKeyframes, m];
  const yk = [...yKeyframes, m];

  const showDragon = enabled && !reduceMotion;

  return (
    <>
      {showDragon ? (
        <motion.div
          aria-hidden="true"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 40,
            pointerEvents: 'none',
            willChange: 'transform',
          }}
          animate={{ x: xk, y: yk, rotate: rotateKeyframes }}
          transition={{ duration: LOOP_SECONDS, repeat: Infinity, ease: 'easeInOut' }}
        >
          <DragonSVG />
        </motion.div>
      ) : null}

      <button
        className="dragon-toggle"
        onClick={toggle}
        aria-pressed={enabled}
        aria-label={enabled ? 'Disable dragon mascot' : 'Enable dragon mascot'}
        title={enabled ? 'Disable dragon' : 'Enable dragon'}
      >
        🐉
      </button>
    </>
  );
}

const BODY_REST =
  'M8,60 C30,20 55,100 80,60 S130,20 155,60 S205,100 230,60 S270,25 295,45';
const BODY_FLEX =
  'M8,55 C30,92 55,14 80,55 S130,96 155,55 S205,14 230,55 S270,80 295,50';

function DragonSVG() {
  return (
    <svg width="150" height="64" viewBox="0 0 320 120" style={{ overflow: 'visible' }}>
      <motion.path
        fill="none"
        stroke="var(--accent)"
        strokeWidth="4"
        strokeLinecap="round"
        animate={{ d: [BODY_REST, BODY_FLEX, BODY_REST] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* dorsal spikes */}
      <path d="M28,22 L34,9 L41,24" fill="var(--accent)" opacity="0.85" />
      <path d="M150,22 L156,9 L163,24" fill="var(--accent)" opacity="0.85" />
      <path d="M225,22 L231,9 L238,24" fill="var(--accent)" opacity="0.85" />
      {/* head + whiskers */}
      <path
        d="M298,38 Q285,29 276,34"
        stroke="var(--accent)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M300,41 Q290,27 280,29"
        stroke="var(--accent)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      />
      <circle cx="298" cy="45" r="10" fill="var(--accent)" />
      <circle cx="301" cy="42" r="1.7" fill="var(--paper2)" />
    </svg>
  );
}
