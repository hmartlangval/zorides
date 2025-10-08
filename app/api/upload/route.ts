import { NextRequest, NextResponse } from 'next/server';
import { saveFile, UploadFolder } from '@/lib/upload';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const folder = (formData.get('folder') as UploadFolder) || 'posts';

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const urls: string[] = [];

    for (const file of files) {
      const url = await saveFile(file, folder);
      urls.push(url);
    }

    return NextResponse.json({ success: true, urls });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}
