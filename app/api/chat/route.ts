import { NextRequest, NextResponse } from 'next/server';
import { Env, ChatMessage } from '@/types';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();
    const env = (globalThis as any).env as Env;

    // Generate embeddings for the message
    const aiClient = new (await import('@/app/lib/ai-client')).AIClient(env);
    const embedding = await aiClient.generateEmbeddings(message);

    // Search vector store for relevant documents
    // const relevantDocs = await env.VECTOR_INDEX.query(embedding);

    // Generate response
    const systemPrompt = 'You are a helpful academic assistant. Provide clear, accurate answers to student questions.';
    const response = await aiClient.generateText(message, systemPrompt);

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
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
