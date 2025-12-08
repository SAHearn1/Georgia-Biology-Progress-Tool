import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Georgia Biology Progress Tool',
  description: 'Track student progress for Biology EOC testing',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
