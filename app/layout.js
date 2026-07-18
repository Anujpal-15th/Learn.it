import './globals.css';

export const metadata = {
  title: 'The Ledger',
  description:
    'A full-stack Java learning roadmap and daily practice tracker — DSA to deployment.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
