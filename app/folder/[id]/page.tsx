import { CreateFolderButton } from '@/components/CreateFolderButton';
import { FolderList } from '@/components/FolderList';
import { CreateFileForm } from '@/components/CreateFileForm';
import { Breadcrumb } from '@/components/Breadcrumb';

interface Props {
  params: { id: string };
}

async function getFolderData(folderPath: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/filesystem?path=${encodeURIComponent(folderPath)}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch folder data');
    }
    
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error || 'Failed to load folder');
    }
  } catch (error) {
    console.error('Error loading folder:', error);
    return null;
  }
}

export default async function FolderPage({ params }: Props) {
  // Convert the id back to a path (assuming it's URL encoded)
  const folderPath = decodeURIComponent(params.id);
  const folderData = await getFolderData(folderPath);
  
  if (!folderData) {
    return (
      <div className="w-full p-6">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error loading folder</p>
          <p className="text-sm mt-2">Failed to load the folder contents</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Breadcrumb is now handled by MobileNav on mobile, but keep for desktop */}
      <div className="hidden sm:block">
        <Breadcrumb currentPath={folderPath} className="mb-4" />
      </div>

      <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {folderData.name.split('/').pop() || 'Untitled Folder'}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {folderData.children.length} item{folderData.children.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <CreateFolderButton folderPath={folderPath} />
        </div>
      </div>

      <div className="bg-white sm:bg-gray-50 rounded-lg p-3 sm:p-4 border sm:border-0">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Upload File</h3>
        <CreateFileForm folderPath={folderPath} />
      </div>

      <div className="folder-list">
        <FolderList nodes={folderData.children} currentPath={folderPath} />
      </div>
    </div>
  );
}
