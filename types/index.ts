export interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
  VECTOR_INDEX: VectorizeIndex;
  AI: Ai;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Document {
  id: string;
  user_id: string;
  filename: string;
  file_type: string;
  r2_key: string;
  status: 'uploading' | 'processing' | 'indexed' | 'error';
  created_at: string;
}

export interface Quiz {
  id: string;
  document_id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions_count: number;
  content: QuizContent;
  created_at: string;
}

export interface QuizContent {
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  document_id: string;
  last_message_at: string;
}
