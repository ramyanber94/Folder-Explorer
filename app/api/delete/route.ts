import { NextResponse } from 'next/server';
import { unlink, rmdir, stat } from 'fs/promises';
import { join } from 'path';

export const runtime = 'nodejs';

export async function DELETE(req: Request) {
  try {
    const { path } = await req.json();
    
    if (!path || typeof path !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Path is required' }, 
        { status: 400 }
      );
    }

    const userFilesDir = join(process.cwd(), 'public', 'user-files');
    const fullPath = join(userFilesDir, path);

    // Check if the item exists and determine if it's a folder
    try {
      const stats = await stat(fullPath);
      const isDirectory = stats.isDirectory();
      
      if (isDirectory) {
        await rmdir(fullPath, { recursive: true });
      } else {
        await unlink(fullPath);
      }

      return NextResponse.json({
        success: true,
        message: `${isDirectory ? 'Folder' : 'File'} deleted successfully`
      });
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return NextResponse.json(
          { success: false, error: 'File or folder not found' },
          { status: 404 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete item' },
      { status: 500 }
    );
  }
}
