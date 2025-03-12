
import { mockMessages } from './messageUtils';

export function getAllFiles() {
  const files: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    size: number;
    uploadedAt: Date;
    uploadedBy: string;
  }> = [];
  
  mockMessages.forEach(message => {
    if (message.attachments && message.attachments.length > 0) {
      message.attachments.forEach(attachment => {
        files.push({
          ...attachment,
          uploadedBy: message.sender.name,
        });
      });
    }
  });
  
  // Sort by upload date (newest first)
  return files.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
}

export function getFileTypeIcon(type: string) {
  if (type.startsWith('image/')) {
    return 'image';
  } else if (type.startsWith('video/')) {
    return 'video';
  } else if (type.startsWith('audio/')) {
    return 'audio';
  } else if (type.includes('pdf')) {
    return 'pdf';
  } else if (type.includes('spreadsheet') || type.includes('excel')) {
    return 'spreadsheet';
  } else if (type.includes('document') || type.includes('word')) {
    return 'document';
  } else if (type.includes('presentation') || type.includes('powerpoint')) {
    return 'presentation';
  } else {
    return 'file';
  }
}

export function getFilesByType() {
  const files = getAllFiles();
  const filesByType: { [key: string]: typeof files } = {
    images: [],
    documents: [],
    other: [],
  };
  
  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      filesByType.images.push(file);
    } else if (
      file.type.includes('pdf') || 
      file.type.includes('document') || 
      file.type.includes('word') || 
      file.type.includes('spreadsheet') || 
      file.type.includes('excel') || 
      file.type.includes('presentation') || 
      file.type.includes('powerpoint')
    ) {
      filesByType.documents.push(file);
    } else {
      filesByType.other.push(file);
    }
  });
  
  return filesByType;
}
