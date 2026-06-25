"use client";
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideUpload, LucideFile, LucideX, LucideCheckCircle, Upload, File } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function UploadZone() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFiles = (fileList: globalThis.File[]) => {
    const validFiles = fileList.filter(
      (file) =>
        file.type === 'application/pdf' ||
        file.type === 'application/msword' ||
        file.type === 'text/plain'
    );

    if (validFiles.length === 0) {
      setError('Please upload PDF, DOC, or TXT files only');
      return;
    }

    setError(null);
    setFiles((prev) => [...prev, ...validFiles]);
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    try {
      for (const file of files) {
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
          }),
        });

        if (!response.ok) {
          throw new Error(`Upload failed for ${file.name}`);
        }
      }
      setFiles([]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Upload Documents</h2>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center cursor-pointer hover:border-white/40 transition"
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-primary" />
        <p className="text-sm text-muted-foreground">Drag and drop files here</p>
        <input
          type="file"
          multiple
          onChange={(e) => handleFiles(Array.from(e.target.files || []))}
          className="hidden"
          id="file-input"
          accept=".pdf,.doc,.docx,.txt"
        />
        <label htmlFor="file-input" className="text-primary text-sm hover:underline">
          or click to browse
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, idx) => (
            <div key={idx} className="flex items-center gap-2 p-2 bg-secondary/20 rounded">
              <File className="w-4 h-4" />
              <span className="text-sm truncate">{file.name}</span>
            </div>
          ))}
          <button
            onClick={uploadFiles}
            disabled={uploading}
            className="w-full bg-primary text-white py-2 rounded font-medium disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Documents'}
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
