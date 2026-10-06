'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { animate, useReducedMotion } from 'motion/react';

const EASE_OUT = [0.16, 1, 0.3, 1];
// Layout effect on the client so the count starts before paint (no flash of
// the final value); plain effect on the server to avoid React's SSR warning.
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// Renders the real value as text (correct without JS), then counts from the
// previously shown value (0 on mount) to the new one. It writes to the one
// text node React owns, so React's own updates never fight it.
export default function AnimatedNumber({ value, suffix = '', duration = 0.8 }) {
  const ref = useRef(null);
  const shown = useRef(0);
  const reduce = useReducedMotion();
  const text = `${value}${suffix}`;

  useIsoLayoutEffect(() => {
    const node = ref.current && ref.current.firstChild;
    const to = Number(value) || 0;
    if (!node) return undefined;
    const from = shown.current;
    if (reduce || from === to) {
      shown.current = to;
      node.nodeValue = `${value}${suffix}`;
      return undefined;
    }
    const controls = animate(from, to, {
      duration,
      ease: EASE_OUT,
      onUpdate: (v) => {
        shown.current = v;
        node.nodeValue = Math.round(v) + suffix;
      },
    });
    return () => controls.stop();
  }, [value, suffix, duration, reduce]);

  return (
    <span ref={ref} className="mono-num" style={{ minWidth: text.length + 'ch' }}>
      {text}
    </span>
  );
}
