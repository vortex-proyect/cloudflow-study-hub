import { Env } from '../../types';

export class AIClient {
  private ai: Ai;

  constructor(env: Env) {
    this.ai = env.AI;
  }

  async generateEmbeddings(text: string) {
    const response = await this.ai.run('@cf/baai/bge-large-en-v1.5', {
      text: [text]
    });
    return response.data[0];
  }

  async generateText(prompt: string, systemPrompt: string = 'You are a professional academic assistant.') {
    const response = await this.ai.run('@cf/meta/llama-3-8b-instruct', {
      prompt: `System: ${systemPrompt}\n\nUser: ${prompt}`
    });
    return response.response;
  }

  async generateQuiz(context: string, difficulty: string, count: number) {
    const systemPrompt = `You are an expert examiner. Generate a ${difficulty} level quiz with ${count} multiple choice questions based ONLY on the provided context.
    Return the output in strict JSON format:
    { "questions": [ { "question": "...", "options": ["A", "B", "C", "D"], "correctAnswer": 0, "explanation": "..." } ] }`;

    const prompt = `Context: ${context}\n\nGenerate the quiz now.`;
    return this.generateText(prompt, systemPrompt);
  }
}
