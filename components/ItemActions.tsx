"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteItem, renameItem } from '@/app/actions/fileActions';

interface ItemActionsProps {
  itemPath: string;
  itemName: string;
  itemType: 'file' | 'folder';
  className?: string;
}

export function ItemActions({ itemPath, itemName, itemType, className = "" }: ItemActionsProps) {
  const [showActions, setShowActions] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(itemName);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete this ${itemType}?`)) {
      startTransition(async () => {
        const result = await deleteItem(itemPath);
        if (result.success) {
          router.refresh();
        } else {
          setError(result.error || 'Failed to delete item');
        }
      });
    }
  };

  const handleRename = () => {
    setIsRenaming(true);
    setNewName(itemName);
    setError(null);
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newName.trim();
    if (!trimmedName || trimmedName === itemName) {
      setIsRenaming(false);
      return;
    }

    startTransition(async () => {
      const result = await renameItem(itemPath, trimmedName);
      if (result.success) {
        setIsRenaming(false);
        setShowActions(false);
        router.refresh();
      } else {
        setError(result.error || 'Failed to rename item');
      }
    });
  };

  const handleCancel = () => {
    setIsRenaming(false);
    setNewName(itemName);
    setError(null);
  };

  if (isRenaming) {
    return (
      <div className="p-2 bg-white border rounded-lg shadow-lg">
        <form onSubmit={handleRenameSubmit} className="space-y-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
            disabled={isPending}
          />
          {error && (
            <p className="text-red-600 text-xs">{error}</p>
          )}
          <div className="flex gap-1">
            <button
              type="submit"
              disabled={isPending || !newName.trim()}
              className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50"
            >
              {isPending ? '...' : '✓'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isPending}
              className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 disabled:opacity-50"
            >
              ✕
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowActions(!showActions)}
        className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100"
        disabled={isPending}
      >
        ⋮
      </button>
      
      {showActions && (
        <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
          <button
            onClick={handleRename}
            disabled={isPending}
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 disabled:opacity-50"
          >
            📝 Rename
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            🗑️ Delete
          </button>
        </div>
      )}

      {error && !isRenaming && (
        <div className="absolute right-0 top-8 bg-red-100 border border-red-300 rounded-lg p-2 z-10 max-w-xs">
          <p className="text-red-700 text-xs">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700 text-xs ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Click outside to close */}
      {showActions && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowActions(false)}
        />
      )}
    </div>
  );
}
