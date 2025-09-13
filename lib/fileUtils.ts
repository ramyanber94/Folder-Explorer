export function getFileExtension(fileName: string): string {
  return fileName.split('.').pop()?.toLowerCase() || '';
}

export function isPreviewable(fileName: string): boolean {
  const extension = getFileExtension(fileName);
  const previewableExtensions = [
    'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', // Images
    'mp4', 'webm', 'ogg', // Videos
    'pdf', 'txt', 'md' // Documents
  ];
  return previewableExtensions.includes(extension);
}

export function formatFileSize(bytes?: number): string {
  if (!bytes) return 'Unknown size';
  
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

export function getMimeType(fileName: string): string {
  const extension = getFileExtension(fileName);
  const mimeTypes: Record<string, string> = {
    // Images
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    // Videos
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'ogg': 'video/ogg',
    // Documents
    'pdf': 'application/pdf',
    'txt': 'text/plain',
    'md': 'text/markdown',
    // Archives
    'zip': 'application/zip',
    'rar': 'application/x-rar-compressed',
  };
  
  return mimeTypes[extension] || 'application/octet-stream';
}

export interface FileUploadOptions {
  allowOverwrite?: boolean;
  addTimestamp?: boolean;
}

export interface FileUploadResult {
  success: boolean;
  fileName?: string;
  filePath?: string;
  error?: string;
}

export function generateSafeFileName(originalName: string, addTimestamp = true): string {
  const cleanName = originalName.split('/').pop()?.split('\\').pop() || originalName;
  
  if (!addTimestamp) {
    return cleanName;
  }

  const nameWithoutExt = cleanName.replace(/\.[^/.]+$/, '');
  const extension = cleanName.split('.').pop() || '';
  
  return `${nameWithoutExt}_${Date.now()}.${extension}`;
}

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export function sortByLastUpdate<T extends { updatedAt?: Date; type?: 'file' | 'folder'; name: string }>(
  items: T[], 
  prioritizeFolders: boolean = false
): T[] {
  return items.sort((a, b) => {
    // First, sort by last update date (most recent first)
    const dateA = a.updatedAt?.getTime() ?? 0;
    const dateB = b.updatedAt?.getTime() ?? 0;
    
    if (dateA !== dateB) {
      return dateB - dateA; // Most recent first
    }
    
    // If prioritizeFolders is true and dates are equal, sort by type (folders first)
    if (prioritizeFolders && a.type && b.type && a.type !== b.type) {
      return a.type === 'folder' ? -1 : 1;
    }
    
    // If both type and date are equal, sort alphabetically
    return a.name.localeCompare(b.name);
  });
}

