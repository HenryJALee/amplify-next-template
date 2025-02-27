import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number;
  className?: string;
  children?: React.ReactNode;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelect,
  accept = 'image/*',
  maxSize = 2 * 1024 * 1024, // 2MB default
  className = '',
  children
}) => {
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    const file = files[0];
    if (file.size > maxSize) {
      alert('File is too large. Maximum size is 10MB.');
      return;
    }

    onFileSelect(file);
  }, [maxSize, onFileSelect]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const file = e.target.files[0];
    if (file.size > maxSize) {
      alert('File is too large. Maximum size is 10MB.');
      return;
    }

    onFileSelect(file);
  }, [maxSize, onFileSelect]);

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`relative ${className}`}
    >
      <input
        type="file"
        onChange={handleChange}
        accept={accept}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      {children || (
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">
            Drag and drop or click to upload
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Maximum file size: 10MB
          </p>
        </div>
      )}
    </div>
  );
};