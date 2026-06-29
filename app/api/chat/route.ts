import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { AIClient } from '@/lib/ai-client';
import { DocumentRepository } from '@/lib/repositories/document-repository';
import { ChatRepository } from '@/lib/repositories/chat-repository';
import { VectorStore } from '@/lib/vector-store';
import { PROMPTS } from '@/lib/prompts';

export const runtime = 'edge';

/**
 * POST /api/chat
 *
 * Receives a user message, retrieves relevant document context via
 * Vectorize, and generates a response with Llama-3.
 */
export async function POST(req: NextRequest) {
  try {
    const { message, sessionId, documentId } = (await req.json()) as {
      message: string;
      sessionId: string;
      documentId?: string;
    };
    const { env } = getRequestContext();

    const ai = new AIClient(env);
    const vs = new VectorStore(env);
    const docRepo = new DocumentRepository(env.DB);
    const chatRepo = new ChatRepository(env.DB);

    // Save the user message
    await chatRepo.saveChatMessage({
      id: crypto.randomUUID(),
      session_id: sessionId,
      role: 'user',
      content: message,
    });

    // 1. Generate embeddings for the user message
    const embedding = await ai.generateEmbeddings(message);

    // 2. Search vector store for relevant document chunks
    const results = await vs.queryVectors(embedding, 5);
    const indices = (results.matches ?? [])
      .map((r) => r.metadata?.chunkIndex)
      .filter((idx): idx is number => typeof idx === 'number');

    let response: string;

    if (documentId && indices.length > 0) {
      // Context-aware response
      const fragments = await docRepo.getChunks(documentId, indices);
      const context = fragments.join('\n\n');

      const prompt = `Context: ${context}\n\nUser Question: ${message}`;
      response = await ai.generateText(prompt, PROMPTS.CHAT_WITH_CONTEXT);
    } else {
      // General response (no document context available)
      response = await ai.generateText(message, PROMPTS.CHAT_GENERAL);
    }

    // Save the assistant response
    await chatRepo.saveChatMessage({
      id: crypto.randomUUID(),
      session_id: sessionId,
      role: 'assistant',
      content: response,
    });

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat Error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
