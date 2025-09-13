import { CreateFolderButton } from '@/components/CreateFolderButton';
import { FolderList } from '@/components/FolderList';
import { CreateFileForm } from '@/components/CreateFileForm';
import { Breadcrumb } from '@/components/Breadcrumb';

async function getFileSystemData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/filesystem`, {
      cache: 'no-store' // Always get fresh data
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch filesystem data');
    }
    
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error || 'Failed to load filesystem');
    }
  } catch (error) {
    console.error('Error loading filesystem:', error);
    return null;
  }
}

export default async function Home() {
  const root = await getFileSystemData();

  if (!root) {
    return (
      <div className="w-full p-6">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error loading files</p>
          <p className="text-sm mt-2">Failed to load the file system</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Breadcrumb - hidden on mobile for space */}
      <div className="hidden sm:block">
        <Breadcrumb currentPath="" className="mb-4" />
      </div>
      
      <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Files</h1>
          <p className="text-sm text-gray-600 mt-1">
            {root.children.length} item{root.children.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <CreateFolderButton folderPath="" />
        </div>
      </div>

      {/* Upload section - collapsible on mobile */}
      <div className="bg-white sm:bg-gray-50 rounded-lg p-3 sm:p-4 border sm:border-0">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Upload File</h3>
        <CreateFileForm folderPath="" />
      </div>

      <div className="folder-list">
        <FolderList nodes={root.children} currentPath="" />
      </div>
    </div>
  );
}
