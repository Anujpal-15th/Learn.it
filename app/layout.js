import { Sora, Inter, JetBrains_Mono } from 'next/font/google';
import { MotionConfig } from 'motion/react';
import './globals.css';

// New design system (v2): Sora for display/headings, Inter for body/UI —
// the professional-product pairing (Linear/Vercel/Raycast-style), replacing
// the earlier condensed-display/mono-heavy "dossier" look. Self-hosted via
// next/font — no render-blocking external request.
const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-body',
  display: 'swap',
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  title: 'Learn.it',
  description:
    'A full-stack Java learning roadmap and daily practice tracker — DSA to deployment.',
};

// Runs before React hydrates so the correct theme applies on first paint —
// without this, the page would flash light then snap to dark (or vice versa)
// for anyone who has a saved preference.
const themeInitScript = `
(function() {
  try {
    var saved = localStorage.getItem('ledger-theme');
    var theme = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        {/* Phase 2 accessibility fix: the CSS `prefers-reduced-motion` rule
            in globals.css only disables plain CSS transitions/animations —
            it has no effect on Framer Motion's JS-driven animations (spring
            hovers, stagger reveals, etc.) used throughout the app.
            reducedMotion="user" makes every motion.* component here
            automatically honor the OS-level setting instead. */}
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </body>
    </html>
  );
}
