import './globals.css';
import Shell from './components/layout/Shell';

export const metadata = {
  title: 'CloudFlow Study Hub',
  description: 'AI-Powered Study Material Hub',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Shell>
          {children}
        </Shell>
      </body>
    </html>
  );
}
