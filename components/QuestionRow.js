'use client';

// One checkable practice-question row. The check box is the real toggle (a
// <button>, so it's keyboard- and screen-reader-operable); clicking anywhere
// else on the row also toggles as a mouse convenience. The problem link opens
// without toggling. The row itself doesn't move on hover (rows jumping inside
// lists is noise); only the ✓ springs in when it changes.

import { AnimatePresence, motion } from 'motion/react';
import { DIFF } from '@/lib/topics';


export function CheckMark({ done }) {
  return (
    <AnimatePresence initial={false}>
      {done ? (
        <motion.span
          key="ok"
          aria-hidden="true"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 600, damping: 30 }}
        >
          ✓
        </motion.span>
      ) : null}
    </AnimatePresence>
  );
}

export default function QuestionRow({ q, id, done, onToggle }) {
  return (
    <div
      className={'q-row' + (done ? ' done' : '')}
      onClick={(e) => {
        if (e.target.closest('a, button')) return;
        onToggle(id);
      }}
    >
      <button
        type="button"
        className="q-check"
        aria-pressed={done}
        aria-label={'Mark "' + q.t + '" as done'}
        onClick={() => onToggle(id)}
      >
        <CheckMark done={done} />
      </button>
      <div className="q-text">
        {q.u ? (
          <a href={q.u} target="_blank" rel="noopener noreferrer">
            {q.t} <span aria-hidden="true">↗</span>
          </a>
        ) : (
          q.t
        )}
      </div>
      <div className="q-plat mono">{q.p}</div>
      <div className={'diff ' + q.d}>{DIFF[q.d]}</div>
    </div>
  );
}
