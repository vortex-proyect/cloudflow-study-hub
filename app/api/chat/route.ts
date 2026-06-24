import { NextRequest, NextResponse } from 'next/server';
import { Env } from '@/types';
import { AIClient } from '@/lib/ai-client';
import { VectorStore } from '@/lib/vector-store';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { message, docId, sessionId } = await req.json();
    const env = (globalThis as any).env as Env;

    const ai = new AIClient(env);
    const vs = new VectorStore(env);

    // 1. Vectorize User Query
    const queryVector = await ai.generateEmbeddings(message);

    // 2. Retrieve Relevant Context (Simulated top-k from Vectorize)
    const results = await vs.queryVectors(queryVector, 5);

    // Extract chunk indices from metadata
    const indices = results.map((r: any) => r.metadata?.chunkIndex).filter(Boolean) as number[];

    // Fetch real text fragments from D1
    const fragments = await db.getChunks(docId, indices);
    const context = fragments.join('\\n\\n');

    if (!context) {
      throw new Error('No relevant context found in document');
    }

    // 3. Generate Response via Llama-3
    const systemPrompt = `You are the CloudFlow AI Assistant. Use the provided context to answer the user accurately.
    If the answer is not in the context, tell the user you don't know, but offer to help in another way.
    Always maintain a helpful, academic, and professional tone.`;

    const prompt = `Context: ${context}\n\nUser Question: ${message}`;
    const response = await ai.generateText(prompt, systemPrompt);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat Error:', error);
    return NextResponse.json({ error: 'AI Assistant is currently unavailable' }, { status: 500 });
  }
}
