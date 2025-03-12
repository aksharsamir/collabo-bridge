
import React from 'react';
import { UserAvatar } from './UserAvatar';
import { Paperclip, FileText, Image as ImageIcon, Film, Music, File, Info } from 'lucide-react';

interface MessageProps {
  message: {
    id: string;
    content: string;
    sender: {
      id: string;
      name: string;
      avatar?: string;
      status?: string;
    };
    timestamp: Date;
    attachments?: Array<{
      id: string;
      name: string;
      type: string;
      url: string;
      size: number;
      uploadedAt: Date;
    }>;
    isCurrentUser: boolean;
    isSystemMessage?: boolean;
  };
  showSender?: boolean;
  isConsecutive?: boolean;
  onFileView: (file: any) => void;
}

export const Message = ({ message, showSender = true, isConsecutive = false, onFileView }: MessageProps) => {
  const { content, sender, timestamp, attachments, isCurrentUser, isSystemMessage } = message;
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', minute: '2-digit' 
    });
  };
  
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <ImageIcon className="w-4 h-4" />;
    } else if (fileType.startsWith('video/')) {
      return <Film className="w-4 h-4" />;
    } else if (fileType.startsWith('audio/')) {
      return <Music className="w-4 h-4" />;
    } else if (fileType.includes('pdf')) {
      return <FileText className="w-4 h-4" />;
    } else {
      return <File className="w-4 h-4" />;
    }
  };

  // Render system messages differently
  if (isSystemMessage) {
    return (
      <div className="flex justify-center my-2">
        <div className="flex items-center gap-1 bg-muted/30 text-muted-foreground px-3 py-1 rounded-full text-xs">
          <Info className="w-3 h-3" />
          <span>{content}</span>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} ${isConsecutive ? 'mt-1' : 'mt-4'}`}
    >
      {!isCurrentUser && showSender && (
        <div className="mr-3 mt-1">
          <UserAvatar name={sender.name} image={sender.avatar} size="sm" status={sender.status as 'online' | 'offline' | 'away'} />
        </div>
      )}
      
      {!isCurrentUser && !showSender && (
        <div className="w-8 mr-3"></div>
      )}
      
      <div className={`max-w-[75%] flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
        {showSender && !isCurrentUser && (
          <div className="ml-1 mb-1 flex items-center">
            <span className="text-sm font-medium">{sender.name}</span>
            <span className="text-xs text-muted-foreground ml-2">{formatTime(timestamp)}</span>
          </div>
        )}
        
        <div className={`
          rounded-lg ${isCurrentUser ? 'bg-primary text-primary-foreground' : 'glass-morphism'}
          ${content ? 'px-4 py-3' : ''}
        `}>
          {content && (
            <div className="text-sm whitespace-pre-wrap break-words">{content}</div>
          )}
          
          {attachments && attachments.length > 0 && (
            <div className={`${content ? 'mt-3' : ''} space-y-2`}>
              {attachments.map(file => {
                const isImage = file.type.startsWith('image/');
                
                if (isImage) {
                  return (
                    <div 
                      key={file.id}
                      className="rounded-md overflow-hidden cursor-pointer"
                      onClick={() => onFileView(file)}
                    >
                      <img 
                        src={file.url} 
                        alt={file.name} 
                        className="max-h-48 object-contain w-full bg-background/5 animate-fade-in"
                        loading="lazy"
                      />
                    </div>
                  );
                }
                
                return (
                  <div
                    key={file.id}
                    onClick={() => onFileView(file)}
                    className={`
                      flex items-center rounded-md p-3
                      ${isCurrentUser ? 'bg-primary-foreground/10 hover:bg-primary-foreground/20' : 'bg-secondary hover:bg-secondary/70'}
                      cursor-pointer transition-colors
                    `}
                  >
                    <div className="mr-3">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="overflow-hidden flex-1">
                      <div className="text-sm font-medium truncate">{file.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {(showSender && isCurrentUser || !showSender && isCurrentUser) && (
          <div className="mr-1 mt-1 text-xs text-muted-foreground">
            {formatTime(timestamp)}
          </div>
        )}
      </div>
      
      {isCurrentUser && showSender && (
        <div className="ml-3 mt-1">
          <UserAvatar name={sender.name} image={sender.avatar} size="sm" />
        </div>
      )}
      
      {isCurrentUser && !showSender && (
        <div className="w-8 ml-3"></div>
      )}
    </div>
  );
};
