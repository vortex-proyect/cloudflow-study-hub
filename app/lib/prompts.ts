/**
 * Centralized prompt definitions for Cloudflare Workers AI (Llama-3).
 * Edit prompts here without touching business logic.
 */

export const PROMPTS = {
  /** Default fallback system prompt */
  DEFAULT_SYSTEM:
    'You are a professional academic assistant. Provide clear, accurate, and well-structured answers.',

  /** Used by the /api/chat route when answering with document context */
  CHAT_WITH_CONTEXT: `You are the CloudFlow AI Assistant. Use the provided context to answer the user accurately.
If the answer is not in the context, tell the user you don't know, but offer to help in another way.
Always maintain a helpful, academic, and professional tone.`,

  /** Used by the /api/chat route when no document context is available */
  CHAT_GENERAL:
    'You are a helpful academic assistant. Provide clear, accurate answers to student questions.',

  /**
   * Quiz generation prompt template.
   * Call `buildQuizSystemPrompt(difficulty, count)` instead of using this directly.
   */
  QUIZ_SYSTEM_TEMPLATE:
    'You are an expert examiner. Generate a {{difficulty}} level quiz with {{count}} multiple choice questions based ONLY on the provided context.\nReturn the output in strict JSON format:\n{ "questions": [ { "question": "...", "options": ["A", "B", "C", "D"], "correctAnswer": 0, "explanation": "..." } ] }',
} as const;

/**
 * Build the quiz system prompt replacing placeholders with actual values.
 */
export function buildQuizSystemPrompt(difficulty: string, count: number): string {
  return PROMPTS.QUIZ_SYSTEM_TEMPLATE
    .replace('{{difficulty}}', difficulty)
    .replace('{{count}}', String(count));
}
