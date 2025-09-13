import { NextResponse } from 'next/server';
import { readdir, stat, mkdir } from 'fs/promises';
import { join } from 'path';
import { generateId, getMimeType, sortByLastUpdate } from '@/lib/fileUtils';
import type { FolderNode, FileNode } from '@/core/types';

export const runtime = 'nodejs';

async function initializeUserFilesDirectory(userFilesDir: string) {
  try {
    await mkdir(userFilesDir, { recursive: true });
    
    const items = await readdir(userFilesDir);
    
    if (items.length === 0) {
      // Create default folders
      await mkdir(join(userFilesDir, 'Documents'), { recursive: true });
      await mkdir(join(userFilesDir, 'Images'), { recursive: true });
    }
  } catch (error) {
    console.error('Error initializing user-files directory:', error);
  }
}

async function readDirectory(dirPath: string, relativePath: string = ''): Promise<(FolderNode | FileNode)[]> {
  try {
    const items = await readdir(dirPath);
    const nodes: (FolderNode | FileNode)[] = [];

    for (const item of items) {
      const fullPath = join(dirPath, item);
      const stats = await stat(fullPath);
      const itemRelativePath = relativePath ? join(relativePath, item) : item;

      if (stats.isDirectory()) {
        const children = await readDirectory(fullPath, itemRelativePath);
        
        const folderNode: FolderNode = {
          id: generateId(),
          name: item,   
          type: 'folder',
          children,
          createdAt: stats.birthtime,
          updatedAt: stats.mtime,
        };
        nodes.push(folderNode);
      } else {
        const fileNode: FileNode = {
          id: generateId(),
          name: item,
          type: 'file',
          size: stats.size,
          extension: item.split('.').pop()?.toLowerCase() || '',
          mimeType: getMimeType(item),
          createdAt: stats.birthtime,
          updatedAt: stats.mtime,
        };
        nodes.push(fileNode);
      }
    }

    return sortByLastUpdate(nodes, true);
  } catch (error) {
    console.error('Error reading directory:', error);
    return [];
  }
}

// GET - Read the user-files folder structure or specific folder
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedPath = searchParams.get('path') || '';
    
    const userFilesDir = join(process.cwd(), 'public', 'user-files');
    const targetDir = requestedPath ? join(userFilesDir, requestedPath) : userFilesDir;
    
    await initializeUserFilesDirectory(userFilesDir);

    try {
      const stats = await stat(targetDir);
      if (!stats.isDirectory()) {
        return NextResponse.json(
          { success: false, error: 'Path is not a directory' },
          { status: 400 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Directory not found' },
        { status: 404 }
      );
    }

    const children = await readDirectory(targetDir, requestedPath);
    
    const folderName = requestedPath ? requestedPath.split('/').pop() || 'user-files' : 'My Files';
    const folderNode: FolderNode = {
      id: requestedPath || 'root',
      name: folderName,
      type: 'folder',
      children,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json({
      success: true,
      data: folderNode,
    });
  } catch (error) {
    console.error('Error reading filesystem:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to read filesystem' },
      { status: 500 }
    );
  }
}

// POST - Create a new folder in user-files directory
export async function POST(req: Request) {
  try {
    const { folderPath, name } = await req.json();
    
    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Folder name is required' },
        { status: 400 }
      );
    }

    const userFilesDir = join(process.cwd(), 'public', 'user-files');
    
    await initializeUserFilesDirectory(userFilesDir);
    
    const targetDir = folderPath 
      ? join(userFilesDir, folderPath, name.trim())
      : join(userFilesDir, name.trim());

    try {
      const stats = await stat(targetDir);
      if (stats.isDirectory()) {
        return NextResponse.json(
          { success: false, error: 'Folder already exists' },
          { status: 409 }
        );
      }
    } catch (error) {
      console.log('Folder does not exist, proceeding to create it.');
    }

    try {
      await mkdir(targetDir, { recursive: true });
    } catch (error: any) {
      if (error.code === 'EEXIST') {
        return NextResponse.json(
          { success: false, error: 'Folder already exists' },
          { status: 409 }
        );
      }
      throw error; // Re-throw other errors
    }

    return NextResponse.json({
      success: true,
      message: 'Folder created successfully',
      data: {
        id: generateId(),
        name: name.trim(),
        type: 'folder',
        children: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });
  } catch (error) {
    console.error('Error creating folder:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create folder' },
      { status: 500 }
    );
  }
}
