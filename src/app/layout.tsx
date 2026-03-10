import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RHYTHM — Neon Beat',
  description:
    'A neon cyberpunk rhythm game. Hit the beats, chain combos, and climb the leaderboard.',
  keywords: ['rhythm game', 'music game', 'neon', 'cyberpunk', 'browser game'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#050510',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Preconnect to Google Fonts CDN */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="h-full bg-void-900 antialiased">{children}</body>
    </html>
  );
}
