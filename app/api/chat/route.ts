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

    // We'll simulate context reconstruction here since Vectorize doesn't store
    // full text in the index by default (it stores IDs and vectors)
    // In production, you'd fetch the original chunks from a KV store or R2
    const context = `[Context from Document ${docId}]: This is a simulated retrieval of the 5 most relevant fragments from your document.`;

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
