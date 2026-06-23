import React from 'react';
import { LucideLayoutDashboard, LucideFileText, LucideMessageSquare, LucideZap } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full h-16 border-b border-white/10 bg-background/80 backdrop-blur-md z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-electric-glow rounded-lg bg-primary">
            <LucideZap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            CloudFlow <span className="text-primary">Study Hub</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            My Library
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-blue-400 border border-white/20" />
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pt-16 h-screen overflow-hidden flex flex-col">
        {children}
      </main>
    </div>
  );
}
