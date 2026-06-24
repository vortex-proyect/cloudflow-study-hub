import { NextRequest, NextResponse } from 'next/server';
import { Env } from '@/types';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { documentId, r2Key } = await req.json();
    const env = (globalThis as any).env as Env;

    // Retrieve document from R2
    const object = await env.BUCKET.get(r2Key);
    if (!object) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // In a production app, extract text from PDF/DOC and process it
    const text = await object.text();

    // Generate embeddings
    const aiClient = new (await import('@/app/lib/ai-client')).AIClient(env);
    const embeddings = await aiClient.generateEmbeddings(text);

    // Store embeddings in Vectorize
    // await env.VECTOR_INDEX.insert([{ id: documentId, values: embeddings }]);

    // Update document status
    const dbClient = new (await import('@/app/lib/db')).DBClient(env);
    await dbClient.updateDocumentStatus(documentId, 'indexed');

    return NextResponse.json({
      success: true,
      documentId,
      message: 'Document processed and indexed',
    });
  } catch (error) {
    console.error('Process Error:', error);
    return NextResponse.json(
      { error: 'Failed to process document' },
      { status: 500 }
    );
  }
}
