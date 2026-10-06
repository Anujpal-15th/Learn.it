'use client';

import { motion, useReducedMotion } from 'motion/react';

// "You are here" dot with a slow ripple. One per page at most. The explicit
// `initial` keeps server and client markup identical whatever the motion
// preference; under reduced motion the ring simply never animates in.
export default function HereMarker({ size = 10 }) {
  const reduce = useReducedMotion();
  return (
    <span className="here" style={{ width: size, height: size }} aria-hidden="true">
      <motion.span
        className="here-ring"
        initial={{ scale: 1, opacity: 0 }}
        animate={reduce ? undefined : { scale: [1, 2.4], opacity: [0.45, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.4, ease: 'easeOut' }}
      />
      <span className="here-dot" />
    </span>
  );
}
