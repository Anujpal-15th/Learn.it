import { Archivo, Archivo_Black, JetBrains_Mono } from 'next/font/google';
import './globals.css';

// Self-hosted via next/font — downloaded and served at build time, no
// render-blocking external @import request (this was the biggest loading-time
// fix: the old globals.css pulled all three families from Google's CDN on
// every page load before anything could render).
const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-archivo',
  display: 'swap',
});
const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-archivo-black',
  display: 'swap',
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  title: 'The Ledger',
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
      className={`${archivo.variable} ${archivoBlack.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
