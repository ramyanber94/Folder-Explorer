'use client';

import Link from 'next/link';
import type { FolderNode, FileNode } from '@/core/types';
import { FilePreview } from './FilePreview';
import { ItemActions } from './ItemActions';

interface FolderListProps {
  nodes: Array<FolderNode | FileNode>;
  currentPath?: string;
  className?: string;
}


export function FolderList({ nodes, currentPath = "", className = "" }: FolderListProps) {
  if (!nodes.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-sm">This folder is empty</p>
        <p className="text-gray-400 text-xs mt-1">
          Create a new folder or upload files to get started
        </p>
      </div>
    );
  }



  return (
    <div className={`space-y-2 sm:space-y-1 ${className}`}>
      {nodes.map((node) => {
        if (node.type === 'folder') {
          // Build the path for navigation
          const folderPath = currentPath ? `${currentPath}/${node.name}` : node.name;
          const itemPath = currentPath ? `${currentPath}/${node.name}` : node.name;
          
          return (
            <div key={node.id} className="p-3 sm:p-3 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between sm:space-x-3">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">📁</span>
                  </div>
                  <Link
                    href={`/folder/${encodeURIComponent(folderPath)}`}
                    className="flex-1 min-w-0 hover:text-blue-600"
                  >
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {node.name}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 text-xs text-gray-500">
                      <span>Folder</span>
                      {node.updatedAt && (
                        <span className="hidden sm:inline">Modified {new Date(node.updatedAt).toLocaleDateString()}</span>
                      )}
                      {node.createdAt && (
                        <span className="hidden sm:inline">Created {new Date(node.createdAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </Link>
                </div>
                
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <ItemActions 
                    itemPath={itemPath}
                    itemName={node.name}
                    itemType="folder"
                  />
                  <Link
                    href={`/folder/${encodeURIComponent(folderPath)}`}
                    className="text-gray-400 hover:text-blue-600 p-1"
                  >
                    →
                  </Link>
                </div>
              </div>
            </div>
          );
        }

        const itemPath = currentPath ? `${currentPath}/${node.name}` : node.name;
        return (
          <div 
            key={node.id} 
            className="border rounded-lg bg-white hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between p-3">
              <div className="flex-1 min-w-0">
                <FilePreview file={node} className="" />
              </div>
              <div className="flex-shrink-0 ml-2">
                <ItemActions 
                  itemPath={itemPath}
                  itemName={node.name}
                  itemType="file"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
