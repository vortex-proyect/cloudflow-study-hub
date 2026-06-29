import { Document } from '@/types';

/** SQLite maximum bind variables per statement (safe limit) */
const MAX_BIND_VARS = 900;

export class DocumentRepository {
  constructor(private db: D1Database) {}

  async createDocument(doc: {
    id: string;
    user_id: string;
    filename: string;
    file_type: string;
    r2_key: string;
    status: Document['status'];
  }): Promise<Document> {
    try {
      await this.db
        .prepare(
          'INSERT INTO documents (id, user_id, filename, file_type, r2_key, status) VALUES (?, ?, ?, ?, ?, ?)'
        )
        .bind(doc.id, doc.user_id, doc.filename, doc.file_type, doc.r2_key, doc.status)
        .run();

      const created = await this.db
        .prepare('SELECT * FROM documents WHERE id = ?')
        .bind(doc.id)
        .first<Document>();

      if (!created) {
        throw new Error('Document was inserted but could not be retrieved');
      }
      return created;
    } catch (error) {
      console.error('[DocumentRepository.createDocument] Failed:', error);
      throw new Error(`Failed to create document ${doc.id}`);
    }
  }

  async updateStatus(documentId: string, status: Document['status']): Promise<void> {
    try {
      await this.db
        .prepare('UPDATE documents SET status = ? WHERE id = ?')
        .bind(status, documentId)
        .run();
    } catch (error) {
      console.error('[DocumentRepository.updateStatus] Failed:', error);
      throw new Error(`Failed to update status for document ${documentId}`);
    }
  }

  async getDocument(id: string): Promise<Document | null> {
    try {
      return await this.db
        .prepare('SELECT * FROM documents WHERE id = ?')
        .bind(id)
        .first<Document>();
    } catch (error) {
      console.error('[DocumentRepository.getDocument] Failed:', error);
      throw new Error(`Failed to retrieve document ${id}`);
    }
  }

  /**
   * Retrieve text chunks by index, batching the query to stay below
   * SQLite's bind-variable limit (~999).
   */
  async getChunks(documentId: string, indices: number[]): Promise<string[]> {
    if (indices.length === 0) return [];

    try {
      const results: string[] = [];

      // Process in safe batches (1 bind var for documentId + N for indices)
      const batchSize = MAX_BIND_VARS - 1;

      for (let i = 0; i < indices.length; i += batchSize) {
        const batch = indices.slice(i, i + batchSize);
        const placeholders = batch.map(() => '?').join(',');

        const rows = await this.db
          .prepare(
            `SELECT content FROM document_texts WHERE document_id = ? AND chunk_index IN (${placeholders}) ORDER BY chunk_index ASC`
          )
          .bind(documentId, ...batch)
          .all<{ content: string }>();

        if (rows.results) {
          results.push(...rows.results.map((r) => r.content));
        }
      }

      return results;
    } catch (error) {
      console.error('[DocumentRepository.getChunks] Failed:', error);
      throw new Error(`Failed to retrieve chunks for document ${documentId}`);
    }
  }
}
