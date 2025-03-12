
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUpload } from '@/components/FileUpload';
import { FilePreview } from '@/components/FilePreview';
import { getAllFiles, getFilesByType, getFileTypeIcon } from '@/utils/fileUtils';
import { SearchIcon, FilterIcon, Grid, List, FileIcon, ImageIcon, FileTextIcon, DownloadIcon } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const Files = () => {
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isFilePreviewOpen, setIsFilePreviewOpen] = useState(false);
  
  const allFiles = getAllFiles();
  const filesByType = getFilesByType();
  
  const filteredFiles = searchQuery 
    ? allFiles.filter(file => 
        file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allFiles;

  const handleFilesSelected = (files: FileList) => {
    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      // In a real app, you would upload files to a server here
      console.log('Files uploaded:', files);
    }, 2000);
  };
  
  const handleFileView = (file: any) => {
    setSelectedFile(file);
    setIsFilePreviewOpen(true);
  };

  const handleDownload = (file: any) => {
    // In a real app, you would implement actual file download here
    console.log('Downloading file:', file);
  };
  
  const renderFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <ImageIcon className="w-5 h-5 text-blue-500" />;
    } else if (type.includes('pdf') || type.includes('document')) {
      return <FileTextIcon className="w-5 h-5 text-red-500" />;
    } else {
      return <FileIcon className="w-5 h-5 text-gray-500" />;
    }
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  return (
    <div className="animate-fade-in">
      <div className="glass-morphism p-6 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <h1 className="text-2xl font-bold">Files</h1>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full md:w-64 bg-secondary/50"
              />
            </div>
            
            <div className="flex items-center bg-secondary/50 rounded-md">
              <button
                onClick={() => setViewType('grid')}
                className={`p-2 rounded-l-md ${viewType === 'grid' ? 'bg-primary text-primary-foreground' : ''}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewType('list')}
                className={`p-2 rounded-r-md ${viewType === 'list' ? 'bg-primary text-primary-foreground' : ''}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <FileUpload 
          onFilesSelected={handleFilesSelected} 
          isLoading={isUploading}
          acceptedTypes="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        />
      </div>
      
      <Tabs defaultValue="all" className="glass-morphism rounded-lg p-6">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Files</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="animate-fade-in">
          {viewType === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredFiles.map((file) => (
                <div 
                  key={file.id}
                  onClick={() => handleFileView(file)}
                  className="neo-morphism rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow animate-scale-in"
                >
                  <div className="h-32 flex items-center justify-center bg-secondary/50 rounded-md mb-3">
                    {file.type.startsWith('image/') ? (
                      <img 
                        src={file.url} 
                        alt={file.name} 
                        className="max-h-full max-w-full object-contain rounded-md" 
                        loading="lazy"
                      />
                    ) : (
                      <div className="text-4xl">{renderFileIcon(file.type)}</div>
                    )}
                  </div>
                  <div className="truncate font-medium">{file.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFiles.map((file) => (
                <div 
                  key={file.id}
                  onClick={() => handleFileView(file)}
                  className="neo-morphism rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow animate-fade-in"
                >
                  <div className="flex items-center">
                    <div className="mr-4">{renderFileIcon(file.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-medium">{file.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)} • {formatDate(file.uploadedAt)} • Uploaded by {file.uploadedBy}
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(file);
                      }}
                      className="p-2 hover:bg-secondary rounded-full transition-colors"
                    >
                      <DownloadIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="images" className="animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filesByType.images.map((file) => (
              <div 
                key={file.id}
                onClick={() => handleFileView(file)}
                className="neo-morphism rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow animate-scale-in"
              >
                <div className="h-32 flex items-center justify-center bg-secondary/50 rounded-md mb-3">
                  <img 
                    src={file.url} 
                    alt={file.name} 
                    className="max-h-full max-w-full object-contain rounded-md" 
                    loading="lazy"
                  />
                </div>
                <div className="truncate font-medium">{file.name}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="documents" className="animate-fade-in">
          <div className="space-y-2">
            {filesByType.documents.map((file) => (
              <div 
                key={file.id}
                onClick={() => handleFileView(file)}
                className="neo-morphism rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow animate-fade-in"
              >
                <div className="flex items-center">
                  <div className="mr-4">{renderFileIcon(file.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-medium">{file.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)} • {formatDate(file.uploadedAt)} • Uploaded by {file.uploadedBy}
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(file);
                    }}
                    className="p-2 hover:bg-secondary rounded-full transition-colors"
                  >
                    <DownloadIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="other" className="animate-fade-in">
          <div className="space-y-2">
            {filesByType.other.map((file) => (
              <div 
                key={file.id}
                onClick={() => handleFileView(file)}
                className="neo-morphism rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow animate-fade-in"
              >
                <div className="flex items-center">
                  <div className="mr-4">{renderFileIcon(file.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-medium">{file.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)} • {formatDate(file.uploadedAt)} • Uploaded by {file.uploadedBy}
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(file);
                    }}
                    className="p-2 hover:bg-secondary rounded-full transition-colors"
                  >
                    <DownloadIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isFilePreviewOpen} onOpenChange={setIsFilePreviewOpen}>
        <DialogContent className="p-0 bg-transparent border-none max-w-3xl">
          {selectedFile && (
            <FilePreview 
              file={selectedFile} 
              onClose={() => setIsFilePreviewOpen(false)}
              onDownload={handleDownload}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Files;
