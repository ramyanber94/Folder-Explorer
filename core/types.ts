export interface BaseNode {
  id: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FileNode extends BaseNode {
  type: 'file';
  size?: number;
  mimeType?: string;
  extension?: string;
}

export interface FolderNode extends BaseNode {
  type: 'folder';
  children: Array<FolderNode | FileNode>;
}

export type Node = FolderNode | FileNode;

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CreateFileRequest {
  file: File;
  name?: string;
}

export interface CreateFolderRequest {
  name: string;
}
