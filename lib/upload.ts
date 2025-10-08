import fs from 'fs/promises';
import path from 'path';

export type UploadFolder = 'avatars' | 'posts' | 'events';

// Local file storage (V1) - Cloud-ready structure for V2+
export async function saveFile(
  file: File,
  folder: UploadFolder
): Promise<string> {
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
    
    // Ensure directory exists
    await fs.mkdir(uploadDir, { recursive: true });
    
    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${sanitizedName}`;
    const filepath = path.join(uploadDir, filename);
    
    // Save file
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filepath, buffer);
    
    // Return public URL path
    return `/uploads/${folder}/${filename}`;
  } catch (error) {
    console.error('File upload error:', error);
    throw new Error('Failed to upload file');
  }
}

export async function deleteFile(fileUrl: string): Promise<void> {
  try {
    const filepath = path.join(process.cwd(), 'public', fileUrl);
    await fs.unlink(filepath);
  } catch (error) {
    console.error('File deletion error:', error);
    // Don't throw - file might already be deleted
  }
}

// V2+ Cloud Storage Placeholder
// export async function saveToCloud(file: File): Promise<string> {
//   // TODO: Implement Cloudinary/AWS S3 upload
//   // For now, use local storage
//   return saveFile(file, 'posts');
// }
