import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { generateId, generateSafeFileName, getMimeType } from '@/lib/fileUtils';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folderPath = formData.get('folderPath')?.toString() || '';
    const providedName = formData.get('name')?.toString();
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' }, 
        { status: 400 }
      );
    }

    // Generate safe filename
    const originalName = (providedName && providedName.trim()) 
      ? providedName.trim() 
      : file.name;
    
    const safeFileName = generateSafeFileName(originalName, true);
    const userFilesDir = join(process.cwd(), 'public', 'user-files');
    const targetDir = folderPath ? join(userFilesDir, folderPath) : userFilesDir;
    const filePath = join(targetDir, safeFileName);

    try {
      // Ensure target directory exists
      await mkdir(targetDir, { recursive: true });
      
      // Write file to directory
      const bytes = await file.arrayBuffer();
      await writeFile(filePath, Buffer.from(bytes));
      
      // Create file node data for response
      const newFile = {
        id: generateId(),
        name: safeFileName,
        type: 'file' as const,
        size: file.size,
        mimeType: getMimeType(safeFileName),
        extension: safeFileName.split('.').pop()?.toLowerCase() || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return NextResponse.json({ 
        success: true, 
        data: newFile,
        message: 'File uploaded successfully'
      });

    } catch (fileError: any) {
      console.error('Failed to save file:', fileError);
      return NextResponse.json(
        { success: false, error: 'Failed to save file to server' }, 
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { success: false, error: 'File upload failed' }, 
      { status: 500 }
    );
  }
}
