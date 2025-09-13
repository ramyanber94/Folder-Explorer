"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createFolder } from '@/app/actions/fileActions';

interface CreateFolderButtonProps {
  folderPath: string;
}

export function CreateFolderButton({ folderPath }: CreateFolderButtonProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    setError(null);
    
    startTransition(async () => {
      const result = await createFolder(folderPath, trimmed);
      
      if (result.success) {
        setName('');
        setOpen(false);
        router.refresh();
      } else {
        setError(result.error || 'Failed to create folder');
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="border px-2 py-1 rounded bg-white hover:bg-gray-50 transition-colors"
      >
        + Folder
      </button>
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-4 min-w-[300px]">
            <h3 className="text-lg font-semibold text-gray-900">Create New Folder</h3>
            
            <input
              autoFocus
              type="text"
              placeholder="Folder name"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
              required
            />

            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}
            
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setName('');
                  setError(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isPending}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={isPending || !name.trim()}
              >
                {isPending ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
