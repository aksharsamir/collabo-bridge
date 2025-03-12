
import React, { useRef, useState } from 'react';
import { UploadCloud, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onFilesSelected: (files: FileList) => void;
  isLoading?: boolean;
  children?: React.ReactNode;
  maxFiles?: number;
  acceptedTypes?: string;
}

export const FileUpload = ({ 
  onFilesSelected, 
  isLoading = false, 
  children, 
  maxFiles = 10,
  acceptedTypes = "*" 
}: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = e.dataTransfer.files;
      if (files.length > maxFiles) {
        alert(`You can only upload up to ${maxFiles} files at once.`);
        return;
      }
      onFilesSelected(files);
    }
  };
  
  if (children) {
    return (
      <>
        <div 
          onClick={isLoading ? undefined : handleClick} 
          className={isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            children
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleChange}
          multiple
          accept={acceptedTypes}
          className="hidden"
        />
      </>
    );
  }
  
  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={isLoading ? undefined : handleDrop}
      onClick={isLoading ? undefined : handleClick}
      className={`
        w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6 transition-all duration-200
        ${isDragging ? 'border-primary bg-primary/5' : 'border-border'}
        ${isLoading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:border-primary/50 hover:bg-secondary/50'}
      `}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground text-center">Uploading...</p>
        </>
      ) : (
        <>
          <UploadCloud className="w-10 h-10 text-muted-foreground mb-4 file-upload-animation" />
          <p className="text-center font-medium mb-1">Drop files here or click to upload</p>
          <p className="text-sm text-muted-foreground text-center">
            (Up to {maxFiles} files at once)
          </p>
        </>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        multiple
        accept={acceptedTypes}
        className="hidden"
      />
    </div>
  );
};
