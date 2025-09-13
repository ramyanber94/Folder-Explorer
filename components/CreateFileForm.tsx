"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { uploadFile } from '@/app/actions/fileActions';

interface CreateFileFormProps {
  folderPath: string;
}

export function CreateFileForm({ folderPath }: CreateFileFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folderPath', folderPath);

    startTransition(async () => {
      const result = await uploadFile(formData);
      
      if (result.success) {
        setFile(null);
        // Reset the file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        router.refresh();
      } else {
        setError(result.error || 'Failed to upload file');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="file"
          accept=".png,.jpg,.jpeg,.gif,.webp,.svg,.mp4,.webm,.ogg,.pdf,.txt,.md"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          disabled={isPending}
        />
      </div>

      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}

      <button
        type="submit"
        disabled={!file || isPending}
        className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Uploading...' : 'Upload File'}
      </button>
    </form>
  );
}
