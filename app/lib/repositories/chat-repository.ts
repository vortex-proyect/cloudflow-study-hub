import { ChatMessage, ChatSession } from '@/types';

export class ChatRepository {
  constructor(private db: D1Database) {}

  async createSession(session: {
    id: string;
    user_id: string;
    document_id: string;
  }): Promise<void> {
    try {
      await this.db
        .prepare(
          'INSERT INTO chat_sessions (id, user_id, document_id) VALUES (?, ?, ?)'
        )
        .bind(session.id, session.user_id, session.document_id)
        .run();
    } catch (error) {
      console.error('[ChatRepository.createSession] Failed:', error);
      throw new Error(`Failed to create chat session ${session.id}`);
    }
  }

  async saveChatMessage(msg: {
    id: string;
    session_id: string;
    role: ChatMessage['role'];
    content: string;
  }): Promise<void> {
    try {
      await this.db
        .prepare(
          'INSERT INTO chat_messages (id, session_id, role, content) VALUES (?, ?, ?, ?)'
        )
        .bind(msg.id, msg.session_id, msg.role, msg.content)
        .run();
    } catch (error) {
      console.error('[ChatRepository.saveChatMessage] Failed:', error);
      throw new Error(`Failed to save chat message ${msg.id}`);
    }
  }

  async getChatHistory(sessionId: string): Promise<ChatMessage[]> {
    try {
      const result = await this.db
        .prepare(
          'SELECT * FROM chat_messages WHERE session_id = ? ORDER BY created_at ASC'
        )
        .bind(sessionId)
        .all<ChatMessage>();

      return result.results ?? [];
    } catch (error) {
      console.error('[ChatRepository.getChatHistory] Failed:', error);
      throw new Error(`Failed to retrieve chat history for session ${sessionId}`);
    }
  }
}
