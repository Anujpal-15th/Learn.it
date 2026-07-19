'use client';

// One checkable practice-question row. The whole row toggles done/undone;
// clicking the problem link opens it without toggling.

import { motion } from 'motion/react';
import { DIFF } from '@/lib/topics';

export default function QuestionRow({ q, id, done, onToggle }) {
  return (
    <motion.div
      className={'q-row' + (done ? ' done' : '')}
      onClick={() => onToggle(id)}
      role="button"
      tabIndex={0}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle(id);
        }
      }}
    >
      <div className="q-check">{done ? '✓' : ''}</div>
      <div className="q-text">
        {q.u ? (
          <a
            href={q.u}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            {q.t} {'↗'}
          </a>
        ) : (
          q.t
        )}
      </div>
      <div className="q-plat mono">{q.p}</div>
      <div className={'diff ' + q.d}>{DIFF[q.d]}</div>
    </motion.div>
  );
}
