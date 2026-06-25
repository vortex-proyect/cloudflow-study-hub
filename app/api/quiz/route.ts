import { NextRequest, NextResponse } from 'next/server';
import { Env } from '@/types';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { difficulty, count, documentId } = await req.json();
    const env = (globalThis as any).env as Env;

    // In a real implementation, fetch the document content from R2
    // For now, we'll generate a quiz based on a sample context
    const sampleContext = 'JavaScript is a versatile programming language used for web development, server-side applications, and more. It supports both object-oriented and functional programming paradigms.';

    // 1. Retrieve representative context for the whole document
    const queryVector = await ai.generateEmbeddings('General overview and key concepts of the document');
    const results = await vs.queryVectors(queryVector, 10);

    // Extract chunk indices from metadata
    const indices = results.map((r: any) => r.metadata?.chunkIndex).filter(Boolean) as number[];

    // Fetch real text fragments from D1
    const fragments = await db.getChunks(docId, indices);
    const context = fragments.join('\\n\\n');

    if (!context) {
      throw new Error('No relevant context found to generate quiz');
    }

    const dbClient = new (await import('@/app/lib/db')).DBClient(env);
    
    const quizId = crypto.randomUUID();
    await dbClient.createQuiz({
      id: quizId,
      document_id: documentId || 'default',
      difficulty: difficulty as any,
      questions_count: count,
      content: JSON.parse(quizContent),
    });

    return NextResponse.json({
      id: quizId,
      difficulty,
      questions_count: count,
      content: quizContent,
    });
  } catch (error) {
    console.error('Quiz Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz' },
      { status: 500 }
    );
  }
}
