import React from 'react';
import UploadZone from './components/upload/UploadZone';
import StudyHub from './components/study-hub/StudyHub';
import AssistantChat from './components/assistant/AssistantChat';

export default function Dashboard() {
  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
      {/* Left Section: Upload (3 cols) */}
      <div className="lg:col-span-3 p-6 border-r border-white/5 overflow-y-auto custom-scrollbar bg-background">
        <UploadZone />
      </div>

      {/* Middle Section: Study Hub (5 cols) */}
      <div className="lg:col-span-5 p-6 overflow-y-auto custom-scrollbar bg-secondary/10">
        <StudyHub />
      </div>

      {/* Right Section: AI Assistant (4 cols) */}
      <div className="lg:col-span-4 h-full overflow-hidden">
        <AssistantChat />
      </div>
    </div>
  );
}
