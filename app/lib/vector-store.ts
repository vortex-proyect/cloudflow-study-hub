

export class VectorStore {
  private index: VectorizeIndex;

  constructor(env: CloudflareEnv) {
    this.index = env.VECTOR_INDEX;
  }

  async upsertVectors(vectors: { id: string; values: number[] }[]): Promise<void> {
    try {
      await this.index.upsert(vectors);
    } catch (error) {
      console.error('[VectorStore.upsertVectors] Failed:', error);
      throw new Error('Failed to upsert vectors into Vectorize');
    }
  }

  async queryVectors(queryVector: number[], topK: number = 5) {
    try {
      return await this.index.query(queryVector, { topK, returnMetadata: true });
    } catch (error) {
      console.error('[VectorStore.queryVectors] Failed:', error);
      throw new Error('Failed to query Vectorize index');
    }
  }

  async deleteVectors(ids: string[]): Promise<void> {
    try {
      await this.index.deleteByIds(ids);
    } catch (error) {
      console.error('[VectorStore.deleteVectors] Failed:', error);
      throw new Error('Failed to delete vectors from Vectorize');
    }
  }
}
