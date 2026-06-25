'use client';

import React, { useState } from 'react';
import { BookOpen, RotateCw } from 'lucide-react';

export default function StudyHub() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const generateQuiz = async (difficulty: 'easy' | 'medium' | 'hard') => {
    setLoading(true);
    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          difficulty,
          count: 5,
        }),
      });

      if (response.ok) {
        const quiz = await response.json();
        setQuizzes((prev) => [...prev, quiz]);
      }
    } catch (error) {
      console.error('Failed to generate quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Study Materials
        </h2>

        <div className="space-y-3">
          <button
            onClick={() => generateQuiz('easy')}
            disabled={loading}
            className="w-full bg-green-600/20 border border-green-600/50 hover:bg-green-600/30 text-green-300 py-2 rounded font-medium disabled:opacity-50 transition"
          >
            {loading ? 'Generating...' : 'Generate Easy Quiz'}
          </button>
          <button
            onClick={() => generateQuiz('medium')}
            disabled={loading}
            className="w-full bg-yellow-600/20 border border-yellow-600/50 hover:bg-yellow-600/30 text-yellow-300 py-2 rounded font-medium disabled:opacity-50 transition"
          >
            {loading ? 'Generating...' : 'Generate Medium Quiz'}
          </button>
          <button
            onClick={() => generateQuiz('hard')}
            disabled={loading}
            className="w-full bg-red-600/20 border border-red-600/50 hover:bg-red-600/30 text-red-300 py-2 rounded font-medium disabled:opacity-50 transition"
          >
            {loading ? 'Generating...' : 'Generate Hard Quiz'}
          </button>
        </div>
      </div>

      {quizzes.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-md font-semibold">Generated Quizzes</h3>
          {quizzes.map((quiz, idx) => (
            <div key={idx} className="p-4 bg-secondary/20 border border-white/10 rounded">
              <p className="text-sm text-muted-foreground">Quiz {idx + 1}</p>
              <p className="text-sm mt-2">Difficulty: {quiz.difficulty}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
