'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';

interface MobileNavProps {
  children: React.ReactNode;
}

export function MobileNav({ children }: MobileNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Extract current path for breadcrumbs
  const getCurrentPath = (): string => {
    if (pathname === '/' || pathname === '/recent') {
      return '';
    }
    
    // For folder paths like /folder/path/to/folder
    if (pathname.startsWith('/folder/')) {
      const encodedPath = pathname.replace('/folder/', '');
      try {
        return decodeURIComponent(encodedPath);
      } catch {
        return encodedPath;
      }
    }
    
    return '';
  };

  const currentPath = getCurrentPath();
  const showBreadcrumbs = currentPath !== '';

  const navItems = [
    {
      href: '/',
      label: 'My Files',
      icon: '🏠',
      active: pathname === '/'
    },
    {
      href: '/recent',
      label: 'Recent',
      icon: '🕒',
      active: pathname === '/recent'
    }
  ];

  return (
    <>
      <div className="lg:hidden">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">File Explorer</h1>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </header>

        {showBreadcrumbs && (
          <div className="bg-white border-b border-gray-100 px-4 py-2">
            <Breadcrumb currentPath={currentPath} className="w-full" />
          </div>
        )}

        {isMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)}>
            <nav className="fixed top-0 left-0 bottom-0 w-64 bg-white shadow-xl">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 w-full p-3 rounded-lg text-left font-medium transition-colors ${
                      item.active
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        )}

        {/* Mobile Content */}
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen">
        <aside className="w-64 bg-gray-100 p-4 flex flex-col gap-2">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">File Explorer</h2>
          </div>
          
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 w-full p-3 rounded-lg font-medium transition-colors ${
                item.active
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </aside>
        
        <main className="flex-1 bg-gray-50 overflow-hidden">
          {children}
        </main>
      </div>
    </>
  );
}
