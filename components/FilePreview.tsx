'use client';

import { FileNode } from '@/core/types';
import { getFileExtension, isPreviewable, formatFileSize } from '@/lib/fileUtils';

interface FilePreviewProps {
  file: FileNode;
  className?: string;
}

export function FilePreview({ file, className = "" }: FilePreviewProps) {
  const extension = getFileExtension(file.name);
  const canPreview = isPreviewable(file.name);

  const renderPreview = () => {
    if (!canPreview) {
      return (
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded">
          <FileIcon extension={extension} />
        </div>
      );
    }

    // Image preview
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(extension)) {
      return (
        <img 
          src={`/${file.name}`} 
          alt={file.name}
          className="w-12 h-12 object-cover rounded"
          loading="lazy"
          onError={(e) => {
            // Fallback to icon if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.nextElementSibling?.classList.remove('hidden');
          }}
        />
      );
    }

    // Video preview
    if (['mp4', 'webm', 'ogg'].includes(extension)) {
      return (
        <video 
          src={`/${file.name}`}
          className="w-12 h-12 rounded"
          muted
          preload="metadata"
        />
      );
    }

    // PDF preview
    if (extension === 'pdf') {
      return (
        <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded">
          <span className="text-red-600 text-xs font-semibold">PDF</span>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded">
        <FileIcon extension={extension} />
      </div>
    );
  };

  return (
    <div className={`flex items-center space-x-3 p-2 rounded hover:bg-gray-50 ${className}`}>
      <div className="flex-shrink-0">
        {renderPreview()}
        <div className="hidden w-12 h-12 items-center justify-center bg-gray-100 rounded">
          <FileIcon extension={extension} />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {file.name}
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            {file.size && (
              <span>{formatFileSize(file.size)}</span>
            )}
            <span className="uppercase">{extension || 'file'}</span>
          </div>
          <div className="flex items-center space-x-2 mt-1 sm:mt-0">
            {file.updatedAt && (
              <span className="hidden sm:inline">Modified {new Date(file.updatedAt).toLocaleDateString()}</span>
            )}
            {file.createdAt && (
              <span className="hidden sm:inline">Created {new Date(file.createdAt).toLocaleDateString()}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


function FileIcon({ extension }: { extension: string }) {
  const getIcon = (ext: string) => {
    switch (ext) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      case 'ppt':
      case 'pptx':
        return '📈';
      case 'zip':
      case 'rar':
      case '7z':
        return '🗜️';
      case 'txt':
        return '📃';
      case 'mp3':
      case 'wav':
      case 'ogg':
        return '🎵';
      case 'mp4':
      case 'avi':
      case 'mov':
        return '🎬';
      default:
        return '📄';
    }
  };

  return (
    <span className="text-lg">
      {getIcon(extension)}
    </span>
  );
}
