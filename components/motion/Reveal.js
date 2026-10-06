'use client';

import { motion } from 'motion/react';

const EASE_OUT = [0.16, 1, 0.3, 1];

// motion.create() must not run per render (it returns a new component type,
// which would remount the subtree every time), so custom components are
// wrapped once and cached. Plain tags use motion[tag].
const wrapped = new Map();
function motionTag(as) {
  if (typeof as === 'string') return motion[as] || motion.div;
  if (!wrapped.has(as)) wrapped.set(as, motion.create(as));
  return wrapped.get(as);
}

// A block that fades/rises in once when it scrolls into view.
export default function Reveal({ children, as = 'div', delay = 0, y = 12, className, ...rest }) {
  const Tag = motionTag(as);
  return (
    <Tag
      {...rest}
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.45, delay, ease: EASE_OUT }}
    >
      {children}
    </Tag>
  );
}
