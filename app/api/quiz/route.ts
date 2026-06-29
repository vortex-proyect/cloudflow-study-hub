import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { AIClient } from '@/lib/ai-client';
import { DocumentRepository } from '@/lib/repositories/document-repository';
import { QuizRepository } from '@/lib/repositories/quiz-repository';
import { VectorStore } from '@/lib/vector-store';

export const runtime = 'edge';

/**
 * POST /api/quiz
 *
 * Generates a quiz based on a document's content using Llama-3.
 */
export async function POST(req: NextRequest) {
  try {
    const { difficulty, count, documentId } = (await req.json()) as {
      difficulty: string;
      count: number;
      documentId: string;
    };
    const { env } = getRequestContext();

    const ai = new AIClient(env);
    const vs = new VectorStore(env);
    const docRepo = new DocumentRepository(env.DB);
    const quizRepo = new QuizRepository(env.DB);

    // 1. Generate a query embedding to find representative document chunks
    const queryVector = await ai.generateEmbeddings(
      'General overview and key concepts of the document'
    );
    const results = await vs.queryVectors(queryVector, 10);

    // 2. Extract chunk indices from metadata and fetch text from D1
    const indices = (results.matches ?? [])
      .map((r) => r.metadata?.chunkIndex)
      .filter((idx): idx is number => typeof idx === 'number');

    const fragments = await docRepo.getChunks(documentId, indices);
    const context = fragments.join('\n\n');

    if (!context) {
      return NextResponse.json(
        { error: 'No relevant context found to generate quiz' },
        { status: 404 }
      );
    }

    // 3. Generate quiz via Llama-3
    const quizContent = await ai.generateQuiz(context, difficulty, count);
    const parsedContent = JSON.parse(quizContent);

    // 4. Persist quiz in D1
    const quizId = crypto.randomUUID();
    await quizRepo.createQuiz({
      id: quizId,
      document_id: documentId || 'default',
      difficulty: difficulty as 'easy' | 'medium' | 'hard',
      questions_count: count,
      content: parsedContent,
    });

    return NextResponse.json({
      id: quizId,
      difficulty,
      questions_count: count,
      content: parsedContent,
    });
  } catch (error) {
    console.error('Quiz Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz' },
      { status: 500 }
    );
  }
}
