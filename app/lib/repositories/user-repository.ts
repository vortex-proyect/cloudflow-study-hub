import { User } from '@/types';

export class UserRepository {
  constructor(private db: D1Database) {}

  async getUser(id: string): Promise<User | null> {
    try {
      return await this.db
        .prepare('SELECT * FROM users WHERE id = ?')
        .bind(id)
        .first<User>();
    } catch (error) {
      console.error('[UserRepository.getUser] Failed:', error);
      throw new Error(`Failed to retrieve user ${id}`);
    }
  }

  async createUser(id: string, email: string): Promise<void> {
    try {
      await this.db
        .prepare('INSERT INTO users (id, email) VALUES (?, ?)')
        .bind(id, email)
        .run();
    } catch (error) {
      console.error('[UserRepository.createUser] Failed:', error);
      throw new Error(`Failed to create user ${id}`);
    }
  }
}
