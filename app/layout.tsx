import type { ReactNode } from 'react';
import { MobileNav } from '@/components/MobileNav';
import './globals.css';

export const metadata = {
  title: 'File Explorer',
  description: 'A simple file explorer application',};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="h-full bg-gray-50">
        <MobileNav>
          {children}
        </MobileNav>
      </body>
    </html>
  );
}
