
import React from 'react';
import { 
  FileText, 
  Image as ImageIcon, 
  FilePdf, 
  FileCode, 
  FileSpreadsheet,
  File,
  Download,
  ExternalLink,
  X
} from 'lucide-react';

interface FilePreviewProps {
  file: {
    id: string;
    name: string;
    type: string;
    url: string;
    size: number;
    uploadedAt: Date;
  };
  onClose?: () => void;
  onDownload?: (file: any) => void;
}

export const FilePreview = ({ file, onClose, onDownload }: FilePreviewProps) => {
  const isImage = file.type.startsWith('image/');
  const isPdf = file.type === 'application/pdf';
  const isSpreadsheet = file.type.includes('spreadsheet') || file.type.includes('excel');
  const isCode = file.type.includes('javascript') || file.type.includes('html') || file.type.includes('css');
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const getFileIcon = () => {
    if (isImage) return <ImageIcon className="w-16 h-16 text-blue-500" />;
    if (isPdf) return <FilePdf className="w-16 h-16 text-red-500" />;
    if (isSpreadsheet) return <FileSpreadsheet className="w-16 h-16 text-green-500" />;
    if (isCode) return <FileCode className="w-16 h-16 text-purple-500" />;
    return <FileText className="w-16 h-16 text-gray-500" />;
  };
  
  const handleDownload = () => {
    if (onDownload) {
      onDownload(file);
    } else {
      window.open(file.url, '_blank');
    }
  };
  
  return (
    <div className="glass-morphism rounded-lg p-6 animate-scale-in max-w-2xl mx-auto">
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-secondary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
      
      <div className="flex flex-col items-center">
        {isImage ? (
          <div className="w-full h-64 overflow-hidden rounded-lg mb-4 bg-secondary">
            <img 
              src={file.url} 
              alt={file.name} 
              className="w-full h-full object-contain" 
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 w-full bg-secondary rounded-lg mb-4">
            {getFileIcon()}
          </div>
        )}
        
        <div className="w-full">
          <h3 className="text-lg font-medium text-balance truncate">{file.name}</h3>
          
          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Type:</span>
              <span className="font-medium text-foreground">{file.type || 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span>Size:</span>
              <span className="font-medium text-foreground">{formatFileSize(file.size)}</span>
            </div>
            <div className="flex justify-between">
              <span>Uploaded:</span>
              <span className="font-medium text-foreground">
                {file.uploadedAt.toLocaleDateString()}
              </span>
            </div>
          </div>
          
          <div className="mt-6 flex space-x-4">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center space-x-2 bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            
            <button
              onClick={() => window.open(file.url, '_blank')}
              className="flex items-center justify-center space-x-2 bg-secondary text-secondary-foreground py-2 px-4 rounded-md hover:bg-secondary/80 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
