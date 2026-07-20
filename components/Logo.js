// The Learn.it mark: an "L" whose foot flows directly into a checkmark —
// learning, with progress checked off. Uses the live theme tokens so it
// matches light/dark mode automatically wherever it's rendered in-app.

export default function Logo({ size = 28 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <rect x="4" y="4" width="56" height="56" rx="16" fill="var(--accent)" />
      <path
        d="M22,18 L22,44 L30,44 L38,50 L48,26"
        fill="none"
        stroke="var(--accent-ink)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
