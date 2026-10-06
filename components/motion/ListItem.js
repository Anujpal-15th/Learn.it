'use client';

import { motion } from 'motion/react';

const EASE_OUT = [0.16, 1, 0.3, 1];

// Same caching rule as Reveal: wrap custom components (e.g. next/link) once.
const wrapped = new Map();
function motionTag(as) {
  if (typeof as === 'string') return motion[as] || motion.div;
  if (!wrapped.has(as)) wrapped.set(as, motion.create(as));
  return wrapped.get(as);
}

// A list row that reveals once as it scrolls in. The stagger is capped at 8
// rows so long lists never wait on a growing delay.
export default function ListItem({ index = 0, as = 'div', className, children, ...rest }) {
  const Tag = motionTag(as);
  return (
    <Tag
      {...rest}
      className={className}
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.3, ease: EASE_OUT, delay: index < 8 ? index * 0.03 : 0 }}
    >
      {children}
    </Tag>
  );
}
