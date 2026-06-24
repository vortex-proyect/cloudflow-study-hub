'use client';

import React from 'react';

interface ShellProps {
  children: React.ReactNode;
}

export default function Shell({ children }: ShellProps) {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-secondary/20 border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold electric-glow">CloudFlow Study Hub</h1>
            <p className="text-sm text-muted-foreground mt-1">AI-powered learning platform</p>
          </div>
          <div className="text-sm text-muted-foreground">
            Powered by Cloudflare
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
