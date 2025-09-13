'use server';

export async function createFolder(folderPath: string, folderName: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/filesystem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        folderPath: folderPath,
        name: folderName,
      }),
    });

    const result = await response.json();

    if (result.success) {
      return { success: true };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('Error creating folder:', error);
    return { success: false, error: 'Failed to create folder' };
  }
}

export async function uploadFile(formData: FormData) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      return { success: true };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    return { success: false, error: 'Failed to upload file' };
  }
}

export async function deleteItem(path: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path }),
    });

    const result = await response.json();

    if (result.success) {
      return { success: true };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    return { success: false, error: 'Failed to delete item' };
  }
}

export async function renameItem(oldPath: string, newName: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/rename`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        oldPath, 
        newName: newName.trim() 
      }),
    });

    const result = await response.json();

    if (result.success) {
      return { success: true };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('Error renaming item:', error);
    return { success: false, error: 'Failed to rename item' };
  }
}
