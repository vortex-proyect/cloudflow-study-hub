import { Env } from '../../types';

export class VectorStore {
  private index: VectorizeIndex;

  constructor(env: Env) {
    this.index = env.VECTOR_INDEX;
  }

  async upsertVectors(vectors: { id: string, values: number[] }[]) {
    await this.index.upsert(vectors);
  }

  async queryVectors(queryVector: number[], topK: number = 5) {
    return await this.index.query(queryVector, { topK, returnMetadata: true });
  }

  async deleteVectors(ids: string[]) {
    await this.index.delete(ids);
  }
}
