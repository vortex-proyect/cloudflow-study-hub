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

    return NextResponse.json({
      response,
      embedding,
    });
  } catch (error) {
    console.error('Chat Error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
