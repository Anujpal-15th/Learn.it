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

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${archivoBlack.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
