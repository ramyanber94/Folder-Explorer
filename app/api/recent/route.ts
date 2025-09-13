import { NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import { generateId, sortByLastUpdate } from '@/lib/fileUtils';
import type { FileNode } from '@/core/types';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const publicDir = join(process.cwd(), 'public');
    const recentFiles = await getRecentFiles(publicDir, '', 20);
    
    return NextResponse.json({
      success: true,
      data: recentFiles
    });
  } catch (error) {
    console.error('Error fetching recent files:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recent files' },
      { status: 500 }
    );
  }
}

async function getRecentFiles(
  dirPath: string, 
  relativePath: string = '', 
  limit: number = 20
): Promise<FileNode[]> {
  try {
    const items = await readdir(dirPath);
    const allFiles: FileNode[] = [];

    for (const item of items) {
      const fullPath = join(dirPath, item);
      const itemRelativePath = relativePath ? `${relativePath}/${item}` : item;
      
      try {
        const stats = await stat(fullPath);
        
        if (stats.isDirectory()) {
          const subFiles = await getRecentFiles(fullPath, itemRelativePath, limit);
          allFiles.push(...subFiles);
        } else {
          const fileNode: FileNode = {
            id: generateId(),
            name: item,
            type: 'file',
            size: stats.size,
            extension: item.split('.').pop()?.toLowerCase() || '',
            mimeType: '', 
            createdAt: stats.birthtime,
            updatedAt: stats.mtime,
          };
          allFiles.push(fileNode);
        }
      } catch (error) {
        continue;
      }
    }

    return sortByLastUpdate(
      allFiles.filter(file => file.updatedAt), // Only include files with valid dates
      false // Don't prioritize folders since this is files-only
    ).slice(0, limit);
      
  } catch (error) {
    console.error('Error reading directory for recent files:', error);
    return [];
  }
}
