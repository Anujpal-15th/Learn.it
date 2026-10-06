'use client';

// Per-topic quiz (5 MCQs). Answering locks that question in — persisted via
// the same progress blob as everything else (quizKey), so it survives a
// refresh. The specific choice a learner made isn't persisted, only that
// they've answered — on a later visit an answered question shows as
// answered with the correct option revealed, not their original pick.
// ponytail: no per-choice persistence — add if "review your past answers"
// becomes a real ask, not just a nice-to-have.
//
// Every quiz in the content stores its correct answer at index 0, so options
// are shown in a deterministic shuffled order seeded from `${topic.id}:${qi}`
// (same order on server, client and every visit — no Math.random). All
// correctness checks and the `selected` state use the ORIGINAL option index;
// nothing persisted depends on display order.

import { useState } from 'react';
import { quizKey } from '@/lib/topics';
import Collapse from '@/components/motion/Collapse';

// FNV-1a string hash -> mulberry32 PRNG -> Fisher-Yates over option indices.
export function optionOrder(seedText, n) {
  let h = 0x811c9dc5;
  for (let i = 0; i < seedText.length; i++) {
    h ^= seedText.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  let a = h >>> 0;
  const rng = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

export default function QuizBlock({ topic, isDone, toggle }) {
  const quiz = topic.quiz || [];
  const [selected, setSelected] = useState({});

  if (quiz.length === 0) return null;

  function choose(qi, optionIndex) {
    if (isDone(quizKey(topic.id, qi))) return;
    setSelected((s) => ({ ...s, [qi]: optionIndex }));
    toggle(quizKey(topic.id, qi));
  }

  const answeredCount = quiz.filter((_, qi) => isDone(quizKey(topic.id, qi))).length;

  return (
    <div className="quiz-block">
      <div className="sub-head">
        <span className="sub-title">Quiz</span>
        <div className="sub-line" />
        <span className="sub-count mono">{answeredCount}/{quiz.length}</span>
      </div>

      {quiz.map((q, qi) => {
        const key = quizKey(topic.id, qi);
        const done = isDone(key);
        const chosen = selected[qi];
        return (
          <div className={'quiz-question' + (done ? ' answered' : '')} key={qi}>
            <div className="quiz-q-text">{qi + 1}. {q.q}</div>
            <div className="quiz-options">
              {optionOrder(topic.id + ':' + qi, q.options.length).map((oi) => {
                const isCorrect = oi === q.correct;
                const isChosen = chosen === oi;
                let cls = 'quiz-option';
                if (done && isCorrect) cls += ' correct';
                else if (done && isChosen && !isCorrect) cls += ' incorrect';
                return (
                  <button
                    key={oi}
                    type="button"
                    className={cls}
                    disabled={done}
                    onClick={() => choose(qi, oi)}
                  >
                    {q.options[oi]}
                  </button>
                );
              })}
            </div>
            <Collapse open={done}>
              <div className="quiz-explanation">{q.explanation}</div>
            </Collapse>
          </div>
        );
      })}
    </div>
  );
}
