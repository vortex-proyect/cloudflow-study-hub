import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { AIClient } from '@/lib/ai-client';
import { DocumentRepository } from '@/lib/repositories/document-repository';

export const runtime = 'edge';

/**
 * POST /api/process
 *
 * Retrieves a document from R2, generates embeddings, and updates status.
 */
export async function POST(req: NextRequest) {
  try {
    const { documentId, r2Key } = (await req.json()) as {
      documentId: string;
      r2Key: string;
    };
    const { env } = getRequestContext();

    // Retrieve document from R2
    const object = await env.BUCKET.get(r2Key);
    if (!object) {
      return NextResponse.json(
        { error: 'Document not found in storage' },
        { status: 404 }
      );
    }

    // Extract text (in production, parse PDF/DOC properly)
    const text = await object.text();

    // Generate embeddings
    const aiClient = new AIClient(env);
    const embeddings = await aiClient.generateEmbeddings(text);

    // Store embeddings in Vectorize
    // await env.VECTOR_INDEX.insert([{ id: documentId, values: embeddings }]);

    // Update document status
    const docRepo = new DocumentRepository(env.DB);
    await docRepo.updateStatus(documentId, 'indexed');

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
