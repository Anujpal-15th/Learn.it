'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

const EASE_UI = [0.32, 0.72, 0, 1];

// Height expand/collapse. Padding belongs on .collapse-inner (never on the
// animated element) so nothing jumps at the start or end.
export default function Collapse({ open, children }) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          key="c"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{
            height: { duration: reduce ? 0 : 0.32, ease: EASE_UI },
            opacity: { duration: reduce ? 0 : 0.2 },
          }}
          style={{ overflow: 'hidden' }}
        >
          <div className="collapse-inner">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
