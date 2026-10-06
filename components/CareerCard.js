'use client';

// Pick a career, go to its roadmap. Used by the dashboard's "Pick your track"
// empty state. The card itself doesn't move (the hover tint is CSS); only the
// button is interactive.

const HUE = { 'java-developer': 'var(--java)', 'ai-engineer': 'var(--ai)' };

export default function CareerCard({ career, onStart }) {
  return (
    <div className="career-card" data-career={career.id}>
      <div className="career-card-label">
        <span
          aria-hidden="true"
          style={{
            display: 'inline-block',
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: HUE[career.id] || 'var(--accent)',
            marginRight: 10,
            verticalAlign: 'middle',
          }}
        />
        {career.label}
      </div>
      <div className="career-card-tagline mono">{career.tagline}</div>
      <p className="career-card-pitch">{career.pitch}</p>
      <button type="button" className="btn-primary" onClick={() => onStart(career.id)}>
        Start Roadmap
      </button>
    </div>
  );
}
