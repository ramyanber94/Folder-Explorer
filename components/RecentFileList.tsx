'use client';

import type { FileNode } from '@/core/types';
import { FilePreview } from './FilePreview';

interface RecentFileListProps {
  files: FileNode[];
  className?: string;
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString();
}

export function RecentFileList({ files, className = "" }: RecentFileListProps) {
  if (!files.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-sm">No files have been modified recently</p>
        <p className="text-gray-400 text-xs mt-1">
          Upload or modify files to see them here
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-2 sm:space-y-1 ${className}`}>
      {files.map((file) => (
        <div 
          key={file.id} 
          className="border rounded-lg bg-white hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center justify-between p-3">
            <div className="flex-1 min-w-0">
              <FilePreview file={file} className="" />
              
              {/* Additional recent file information */}
              <div className="ml-3 pl-2 text-xs text-gray-600 space-y-1 mt-2">
                {file.updatedAt && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                    <span className="font-medium text-blue-600">Last modified:</span>
                    <span>{formatRelativeTime(new Date(file.updatedAt))}</span>
                    <span className="text-gray-400 hidden sm:inline">
                      ({new Date(file.updatedAt).toLocaleString()})
                    </span>
                  </div>
                )}
                {file.createdAt && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                    <span className="font-medium text-green-600">Created:</span>
                    <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                    <span className="text-gray-400 hidden sm:inline">
                      ({new Date(file.createdAt).toLocaleTimeString()})
                    </span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}
