import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { DocumentRepository } from '@/lib/repositories/document-repository';

export const runtime = 'edge';

/**
 * POST /api/upload
 *
 * Proxy upload: the client sends the file directly as multipart/form-data.
 * The server stores it in R2 and creates the document record in D1.
 */
export async function POST(req: NextRequest) {
  try {
    const { env } = getRequestContext();
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided in form data' },
        { status: 400 }
      );
    }

    const filename = file.name;
    const contentType = file.type || 'application/octet-stream';

    // Generate a unique key for R2
    const key = `docs/${Date.now()}-${filename}`;

    // Upload the file to R2 via binding
    await env.BUCKET.put(key, file.stream(), {
      httpMetadata: { contentType },
    });

    // Store metadata in D1
    const docId = crypto.randomUUID();
    const docRepo = new DocumentRepository(env.DB);
    const document = await docRepo.createDocument({
      id: docId,
      user_id: 'default-user', // TODO: replace with real auth
      filename,
      file_type: contentType,
      r2_key: key,
      status: 'uploading',
    });

    return NextResponse.json({
      docId: document.id,
      key,
      message: 'File uploaded successfully',
    });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
