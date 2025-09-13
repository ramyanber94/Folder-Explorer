import { RecentFileList } from '@/components/RecentFileList';
import Link from 'next/link';
import type { FileNode } from '@/core/types';

async function getRecentFiles(): Promise<FileNode[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/recent`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch recent files');
    }
    
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Error fetching recent files:', error);
    return [];
  }
}

export default async function RecentPage() {
  const recentFiles = await getRecentFiles();

  return (
    <div className="w-full p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Back to My Files - only on desktop, mobile uses hamburger menu */}
      <div className="hidden sm:block">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors hover:underline mb-4"
        >
          <span className="mr-1">←</span>
          Back to My Files
        </Link>
      </div>

      
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Recent Files</h1>
        <p className="text-sm text-gray-600 mt-1">
          {recentFiles.length} file{recentFiles.length !== 1 ? 's' : ''} recently modified
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Files are sorted by last modification date, showing the most recently changed first
        </p>
      </div>

      <div className="bg-white sm:bg-gray-50 rounded-lg border sm:border-0">
        <RecentFileList files={recentFiles} className="p-3 sm:p-4" />
      </div>
    </div>
  );
}
