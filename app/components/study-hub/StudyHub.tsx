import React from 'react';
import { LucideBookOpen, LucidePlay, LucideFileText, LucideLayers } from 'lucide-react';
import { motion } from 'framer-motion';

interface StudyMaterial {
  id: string;
  title: string;
  type: 'quiz' | 'summary' | 'concepts';
  status: 'ready' | 'processing';
}

const DUMMY_MATERIALS: StudyMaterial[] = [
  { id: '1', title: 'Advanced Quantum Physics Quiz', type: 'quiz', status: 'ready' },
  { id: '2', title: 'Chapter 4 Summary', type: 'summary', status: 'ready' },
  { id: '3', title: 'Core Concepts Map', type: 'concepts', status: 'ready' },
];

export default function StudyHub() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <LucideBookOpen className="w-5 h-5 text-primary" />
          Study Hub
        </h2>
        <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full border border-white/5">
          3 Materials Ready
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 overflow-y-auto pr-2 custom-scrollbar">
        {DUMMY_MATERIALS.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 rounded-2xl bg-secondary border border-white/5 hover:border-primary/50 transition-all group cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-2">
               {item.type === 'quiz' && <LucidePlay className="w-4 h-4 text-primary/50 group-hover:text-primary transition-colors" />}
               {item.type === 'summary' && <LucideFileText className="w-4 h-4 text-primary/50 group-hover:text-primary transition-colors" />}
               {item.type === 'concepts' && <LucideLayers className="w-4 h-4 text-primary/50 group-hover:text-primary transition-colors" />}
            </div>

            <div className="mb-4">
              <span className="text-[10px] uppercase tracking-widest text-primary font-bold">
                {item.type}
              </span>
              <h3 className="text-md font-semibold mt-1 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground italic">Updated 2m ago</span>
              <button className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary hover:text-white transition-all">
                {item.type === 'quiz' ? 'Start Quiz' : 'Open Document'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
