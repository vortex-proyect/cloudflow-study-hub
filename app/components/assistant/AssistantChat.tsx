"use client";
import React, { useState } from 'react';
import { LucideSend, LucideBot, LucideUser, LucideSparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function AssistantChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Hello! I have analyzed your documents. What would you like to explore today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate AI thinking
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now()+1).toString(),
        role: 'assistant',
        content: 'Based on the documents provided, the core concept of Quantum Tunneling is...'
      }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-secondary/30 border-l border-white/5 backdrop-blur-xl">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LucideBot className="w-5 h-5 text-primary" />
          <span className="font-semibold">AI Assistant</span>
        </div>
        <LucideSparkles className="w-4 h-4 text-primary/50 animate-pulse" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-3 max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "p-2 rounded-full shrink-0",
                msg.role === 'user' ? "bg-primary" : "bg-muted"
              )}>
                {msg.role === 'user' ? <LucideUser className="w-4 h-4 text-white" /> : <LucideBot className="w-4 h-4 text-primary" />}
              </div>
              <div className={cn(
                "p-3 rounded-2xl text-sm leading-relaxed",
                msg.role === 'user' ? "bg-primary text-white rounded-tr-none" : "bg-muted text-foreground rounded-tl-none border border-white/5"
              )}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="p-4 border-t border-white/5 bg-background/50">
        <div className="relative flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about your docs..."
            className="w-full bg-secondary border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:border-primary/50 transition-all"
          />
          <button
            onClick={handleSend}
            className="absolute right-2 p-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <LucideSend className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
