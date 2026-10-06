'use client';

import { motion } from 'motion/react';

const EASE_OUT = [0.16, 1, 0.3, 1];

// Content root of every app page (AppNav stays outside it, so the nav never
// moves between routes). No exit animation: the App Router can't run one.
export default function PageEnter({ children, className, ...rest }) {
  return (
    <motion.main
      {...rest}
      className={className ? 'page ' + className : 'page'}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE_OUT }}
    >
      {children}
    </motion.main>
  );
}
