'use client';

// Segmented Java Developer / AI Engineer control. Purely controlled: it shows
// `value` and reports clicks/arrow keys through `onChange` — callers decide
// what a switch means (AppNav: persist or navigate; signup: update ?career).
// value == null means "no track yet": no pill, both segments neutral.

import { useId, useRef } from 'react';
import { motion } from 'motion/react';
import { CAREERS } from '@/lib/roadmaps';
import s from './CareerSwitcher.module.css';

const HUE = { 'java-developer': 'java', 'ai-engineer': 'ai' };
const PILL_SPRING = { type: 'spring', stiffness: 500, damping: 40 };

export default function CareerSwitcher({ value, onChange, size = 'md', disabled = false, block = false, className }) {
  const pillId = 'track-pill' + useId();
  const refs = useRef([]);
  const checkedIndex = CAREERS.findIndex((c) => c.id === value);

  function select(i) {
    if (disabled || CAREERS[i].id === value) return;
    if (onChange) onChange(CAREERS[i].id);
  }

  function onKeyDown(e, i) {
    const n = CAREERS.length;
    let next;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % n;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + n) % n;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = n - 1;
    else return;
    e.preventDefault();
    if (refs.current[next]) refs.current[next].focus();
    select(next);
  }

  const cls = [s.group, size === 'sm' ? s.sm : s.md, block ? s.block : '', className || '']
    .filter(Boolean)
    .join(' ');

  return (
    <div role="radiogroup" aria-label="Career track" aria-disabled={disabled || undefined} className={cls}>
      {CAREERS.map((c, i) => {
        const checked = c.id === value;
        // Roving tabindex: only the checked segment (or the first, when
        // nothing is checked) is in the tab order.
        const tabbable = checked || (checkedIndex === -1 && i === 0);
        return (
          <motion.button
            key={c.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={tabbable ? 0 : -1}
            disabled={disabled}
            className={s.seg}
            data-hue={HUE[c.id]}
            whileTap={disabled ? undefined : { scale: 0.98 }}
            onClick={() => select(i)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {checked ? (
              <motion.span layoutId={pillId} className={s.pill} transition={PILL_SPRING} aria-hidden="true" />
            ) : null}
            <span className={s.dot} aria-hidden="true" />
            <span className={s.label}>{c.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
