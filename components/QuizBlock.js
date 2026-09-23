'use client';

// Per-topic quiz (5 MCQs). Answering locks that question in — persisted via
// the same progress blob as everything else (quizKey), so it survives a
// refresh. The specific choice a learner made isn't persisted, only that
// they've answered — on a later visit an answered question shows as
// answered with the correct option revealed, not their original pick.
// ponytail: no per-choice persistence — add if "review your past answers"
// becomes a real ask, not just a nice-to-have.

import { useState } from 'react';
import { quizKey } from '@/lib/topics';

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
              {q.options.map((opt, oi) => {
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
                    {opt}
                  </button>
                );
              })}
            </div>
            {done ? <div className="quiz-explanation">{q.explanation}</div> : null}
          </div>
        );
      })}
    </div>
  );
}
