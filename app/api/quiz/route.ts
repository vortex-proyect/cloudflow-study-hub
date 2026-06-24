import { NextRequest, NextResponse } from 'next/server';
import { Env } from '@/types';
import { AIClient } from '@/lib/ai-client';
import { VectorStore } from '@/lib/vector-store';
import { DBClient } from '@/lib/db';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { docId, difficulty, count } = await req.json();
    const env = (globalThis as any).env as Env;

    const ai = new AIClient(env);
    const vs = new VectorStore(env);
    const db = new DBClient(env);

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

    // 2. Generate Quiz using Llama-3
    const quizJson = await ai.generateQuiz(context, difficulty, count);

    // Parse and validate JSON
    const parsedQuiz = JSON.parse(quizJson);

    // 3. Persist in D1
    const quizId = crypto.randomUUID();
    await db.createQuiz({
      id: quizId,
      document_id: docId,
      difficulty,
      questions_count: count,
      content: parsedQuiz
    });

    return NextResponse.json({ quizId, content: parsedQuiz });
  } catch (error) {
    console.error('Quiz Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate quiz' }, { status: 500 });
  }
}
