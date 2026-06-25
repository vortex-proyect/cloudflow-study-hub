import type { Metadata } from 'next';
import './globals.css';
import Shell from './components/layout/Shell';

export const metadata: Metadata = {
  title: 'CloudFlow Study Hub',
  description: 'AI-powered study platform powered by Cloudflare',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body>
        <Shell>
          {children}
        </Shell>
      </body>
    </html>
  );
}
