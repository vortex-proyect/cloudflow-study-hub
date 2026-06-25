"use client";
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideUpload, LucideFile, LucideX, LucideCheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function UploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  }, []);

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const simulateUpload = async () => {
    setUploading(true);
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      await new Promise(r => setTimeout(r, 200));
    }
    setUploading(false);
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative group flex-1 border-2 border-dashed rounded-3xl transition-all duration-300 cursor-pointer overflow-hidden",
          isDragging ? "border-primary bg-primary/10 scale-[0.99]" : "border-white/10 hover:border-primary/50 bg-secondary/50"
        )}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
          <div className="mb-4 p-4 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
            <LucideUpload className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Upload Your Knowledge</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs">
            Drag and drop your PDF, DOCX or TXT files here to start generating study materials.
          </p>
          <input type="file" multiple className="hidden" id="file-input" />
          <label
            htmlFor="file-input"
            className="px-6 py-2 bg-primary text-white rounded-full text-sm font-medium cursor-pointer hover:bg-blue-700 transition-colors shadow-lg shadow-primary/20"
          >
            Browse Files
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-3 h-fit">
        <AnimatePresence>
          {files.map((file, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={file.name + i}
              className="p-3 rounded-xl bg-secondary border border-white/5 flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <LucideFile className="w-4 h-4 text-primary" />
                <span className="text-sm truncate max-w-[150px]">{file.name}</span>
              </div>
              <button onClick={() => removeFile(i)} className="p-1 hover:bg-white/10 rounded-md transition-colors">
                <LucideX className="w-4 h-4 text-muted-foreground group-hover:text-white" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {files.length > 0 && (
          <button
            onClick={simulateUpload}
            disabled={uploading}
            className={cn(
              "w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2",
              uploading ? "bg-muted text-muted-foreground" : "bg-primary text-white hover:bg-blue-700 shadow-lg shadow-primary/30"
            )}
          >
            {uploading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing... {progress}%
              </div>
            ) : (
              <>
                <LucideCheckCircle className="w-4 h-4" />
                Generate Material
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
