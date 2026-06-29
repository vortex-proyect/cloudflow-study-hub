import { Quiz, QuizContent } from '@/types';

export class QuizRepository {
  constructor(private db: D1Database) {}

  async createQuiz(quiz: {
    id: string;
    document_id: string;
    difficulty: Quiz['difficulty'];
    questions_count: number;
    content: QuizContent;
  }): Promise<void> {
    try {
      await this.db
        .prepare(
          'INSERT INTO quizzes (id, document_id, difficulty, questions_count, content) VALUES (?, ?, ?, ?, ?)'
        )
        .bind(
          quiz.id,
          quiz.document_id,
          quiz.difficulty,
          quiz.questions_count,
          JSON.stringify(quiz.content)
        )
        .run();
    } catch (error) {
      console.error('[QuizRepository.createQuiz] Failed:', error);
      throw new Error(`Failed to create quiz ${quiz.id}`);
    }
  }

  async getQuizzesByDocument(documentId: string): Promise<Quiz[]> {
    try {
      const result = await this.db
        .prepare('SELECT * FROM quizzes WHERE document_id = ?')
        .bind(documentId)
        .all<Quiz>();

      return result.results ?? [];
    } catch (error) {
      console.error('[QuizRepository.getQuizzesByDocument] Failed:', error);
      throw new Error(`Failed to retrieve quizzes for document ${documentId}`);
    }
  }
}
