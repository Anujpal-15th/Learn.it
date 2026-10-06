'use client';

import { motion } from 'motion/react';

// Full-width track; the fill is scaled with a transform (never a width
// animation). Under reduced motion MotionConfig makes the scale jump.
export default function ProgressBar({ value = 0, size = 'md', label }) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div
      className={'pbar pbar-' + size}
      role="progressbar"
      aria-valuenow={Math.round(v)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <motion.div
        className="pbar-fill"
        style={{ originX: 0 }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: v / 100 }}
        transition={{ type: 'spring', stiffness: 140, damping: 26 }}
      />
    </div>
  );
}
