import { Env, User, Document, Quiz, ChatSession, ChatMessage } from '../../types';

export class DBClient {
  private db: D1Database;

  constructor(env: Env) {
    this.db = env.DB;
  }

  async getUser(id: string): Promise<User | null> {
    return await this.db.prepare('SELECT * FROM users WHERE id = ?').bind(id).first()<User>();
  }

  async createDocument(doc: Partial<Document>): Promise<Document> {
    await this.db.prepare(
      'INSERT INTO documents (id, user_id, filename, file_type, r2_key, status) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(doc.id, doc.user_id, doc.filename, doc.file_type, doc.r2_key, doc.status).run();

    return await this.db.prepare('SELECT * FROM documents WHERE id = ?').bind(doc.id).first()<Document>();
  }

  async updateDocumentStatus(id: string, status: Document['status']): Promise<void> {
    await this.db.prepare('UPDATE documents SET status = ? WHERE id = ?').bind(status, id).run();
  }

  async createQuiz(quiz: Partial<Quiz>): Promise<void> {
    await this.db.prepare(
      'INSERT INTO quizzes (id, document_id, difficulty, questions_count, content) VALUES (?, ?, ?, ?, ?)'
    ).bind(quiz.id, quiz.document_id, quiz.difficulty, quiz.questions_count, JSON.stringify(quiz.content)).run();
  }

  async getQuizzesByDocument(documentId: string): Promise<Quiz[]> {
    return await this.db.prepare('SELECT * FROM quizzes WHERE document_id = ?').bind(documentId).all()<Quiz>();
  }

  async saveChatMessage(msg: Partial<ChatMessage>): Promise<void> {
    await this.db.prepare(
      'INSERT INTO chat_messages (id, session_id, role, content) VALUES (?, ?, ?, ?)'
    ).bind(msg.id, msg.session_id, msg.role, msg.content).run();
  }

  async getChatHistory(sessionId: string): Promise<ChatMessage[]> {
    return await this.db.prepare('SELECT * FROM chat_messages WHERE session_id = ? ORDER BY created_at ASC').bind(sessionId).all()<ChatMessage>();
  }
}
