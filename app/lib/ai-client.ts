import { PROMPTS, buildQuizSystemPrompt } from './prompts';

export class AIClient {
  private ai: Ai;

  constructor(env: CloudflareEnv) {
    this.ai = env.AI;
  }

  async generateEmbeddings(text: string): Promise<number[]> {
    try {
      const response = await this.ai.run('@cf/baai/bge-large-en-v1.5', {
        text: [text],
      });
      if (!('data' in response) || !response.data || !response.data[0]) {
        throw new Error('Unexpected embedding response format');
      }
      return response.data[0];
    } catch (error) {
      console.error('[AIClient.generateEmbeddings] Failed:', error);
      throw new Error('Failed to generate embeddings from Cloudflare AI');
    }
  }

  async generateText(
    prompt: string,
    systemPrompt: string = PROMPTS.DEFAULT_SYSTEM
  ): Promise<string> {
    try {
      const response = await this.ai.run('@cf/meta/llama-3-8b-instruct', {
        prompt: `System: ${systemPrompt}\n\nUser: ${prompt}`,
      });
      if (!response.response) {
        throw new Error('Empty response from model');
      }
      return response.response;
    } catch (error) {
      console.error('[AIClient.generateText] Failed:', error);
      throw new Error('Failed to generate text from Cloudflare AI');
    }
  }

  async generateQuiz(
    context: string,
    difficulty: string,
    count: number
  ): Promise<string> {
    const systemPrompt = buildQuizSystemPrompt(difficulty, count);
    const prompt = `Context: ${context}\n\nGenerate the quiz now.`;
    return this.generateText(prompt, systemPrompt);
  }
}
