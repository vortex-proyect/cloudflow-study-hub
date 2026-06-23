import { NextRequest, NextResponse } from 'next/server';
import { Env } from '@/types';
import { AIClient } from '@/lib/ai-client';
import { VectorStore } from '@/lib/vector-store';
import { DBClient } from '@/lib/db';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { docId, key } = await req.json();
    const env = (globalThis as any).env as Env;

    const db = new DBClient(env);
    const ai = new AIClient(env);
    const vs = new VectorStore(env);

    // 1. Fetch document from R2
    const object = await env.BUCKET.get(key);
    if (!object) throw new Error('Document not found in R2');

    const text = await object.text();

    // 2. Chunking (Recursive Character Splitter Simplified)
    const chunks = [];
    const chunkSize = 500;
    const overlap = 50;

    for (let i = 0; i < text.length; i += chunkSize - overlap) {
      chunks.push(text.substring(i, i + chunkSize));
    }

    // 3. Embeddings and Vectorization
    const vectorData = await Promise.all(chunks.map(async (chunk, index) => {
      const embedding = await ai.generateEmbeddings(chunk);
      return {
        id: `${docId}-chunk-${index}`,
        values: embedding,
        metadata: { docId, chunkIndex: index, text: chunk.substring(0, 100) } // Sample
      };
    }));

    await vs.upsertVectors(vectorData);

    // 4. Update Status in D1
    await db.updateDocumentStatus(docId, 'indexed');

    return NextResponse.json({ success: true, chunksProcessed: chunks.length });
  } catch (error) {
    console.error('Processing Error:', error);
    return NextResponse.json({ error: 'Failed to process document' }, { status: 500 });
  }
}
