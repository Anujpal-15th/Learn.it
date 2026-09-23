'use client';

// The one interactive element the homepage (and the dashboard's "choose your
// path" empty state) needs: pick a career, go to its roadmap. Reused in both
// places rather than duplicated.

import { motion } from 'motion/react';

export default function CareerCard({ career, onStart }) {
  return (
    <motion.div
      className="career-card"
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 350, damping: 26 }}
    >
      <div className="career-card-label">{career.label}</div>
      <div className="career-card-tagline mono">{career.tagline}</div>
      <p className="career-card-pitch">{career.pitch}</p>
      <button className="btn-primary" onClick={() => onStart(career.id)}>
        Start Roadmap
      </button>
    </motion.div>
  );
}
