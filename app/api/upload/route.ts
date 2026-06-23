import { NextRequest, NextResponse } from 'next/server';
import { Env } from '@/types';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { filename, contentType } = await req.json();
    const env = (globalThis as any).env as Env;

    // Generate a unique key for R2
    const key = `docs/${Date.now()}-${filename}`;

    // Create a presigned URL for the client to upload directly to R2
    // Cloudflare R2 presigned URLs are created via a specific worker API or an S3-compatible call
    // Since this is Next.js on Pages, we use the binding directly
    const uploadUrl = await env.BUCKET.put(key, new Response(''), {
        // In a real production env, you'd use a dedicated presigned URL generator
        // For the purpose of this Hub, we simulate the secure upload flow
    });

    // Store metadata in D1
    const docId = crypto.randomUUID();
    await env.DB.prepare(
      'INSERT INTO documents (id, user_id, filename, file_type, r2_key, status) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(docId, 'default-user', filename, contentType, key, 'uploading').run();

    return NextResponse.json({
      uploadUrl: 'https://r2.cloudflow.study/upload', // Simplified for the boilerplate
      docId: docId,
      key: key
    });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 });
  }
}
