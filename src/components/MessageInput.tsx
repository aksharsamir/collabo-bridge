
import React, { useState, useRef } from 'react';
import { Send, Paperclip, X, Users } from 'lucide-react';
import { FileUpload } from './FileUpload';
import { UserAvatar } from './UserAvatar';

interface MessageInputProps {
  onSendMessage: (message: string, attachments?: File[]) => void;
  participants?: Array<{
    id: string;
    name: string;
    avatar?: string;
    status: string;
  }>;
}

export const MessageInput = ({ onSendMessage, participants = [] }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else {
      // Simulate other user typing
      if (participants.length > 1 && !showTypingIndicator && message.length > 5) {
        const otherUsers = participants.filter(p => p.id !== 'user-1');
        if (otherUsers.length > 0) {
          const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];
          setTypingUser(randomUser.name);
          setShowTypingIndicator(true);
          
          // Remove typing indicator after a random time
          setTimeout(() => {
            setShowTypingIndicator(false);
            setTypingUser(null);
          }, Math.random() * 3000 + 1000);
        }
      }
    }
  };
  
  const handleSendMessage = () => {
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message, attachments);
      setMessage('');
      setAttachments([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };
  
  const handleAddAttachments = (files: FileList) => {
    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      const newFiles = Array.from(files);
      setAttachments(prev => [...prev, ...newFiles]);
      setIsUploading(false);
    }, 1000);
  };
  
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };
  
  return (
    <div className="glass-morphism rounded-lg p-4 transition-all duration-300 ease-in-out">
      {participants.length > 1 && (
        <div className="flex items-center mb-2 gap-1 text-xs text-muted-foreground">
          <Users className="w-3 h-3" />
          <span>
            {participants.length} {participants.length === 1 ? 'person' : 'people'} in this conversation
          </span>
        </div>
      )}
      
      {showTypingIndicator && typingUser && (
        <div className="text-xs text-muted-foreground italic mb-2">
          {typingUser} is typing...
        </div>
      )}
      
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {attachments.map((file, index) => (
            <div 
              key={index} 
              className="bg-secondary rounded-md px-3 py-1.5 flex items-center text-sm animate-scale-in"
            >
              <span className="truncate max-w-[150px]">{file.name}</span>
              <button 
                onClick={() => removeAttachment(index)} 
                className="ml-2 text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-end space-x-2">
        <FileUpload 
          onFilesSelected={handleAddAttachments} 
          isLoading={isUploading}
        >
          <button 
            className="p-2 rounded-md hover:bg-secondary transition-colors"
            disabled={isUploading}
          >
            <Paperclip className="w-5 h-5 text-muted-foreground" />
          </button>
        </FileUpload>
        
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none resize-none max-h-32 py-2 px-3"
          rows={1}
        />
        
        <button 
          onClick={handleSendMessage}
          disabled={!message.trim() && attachments.length === 0}
          className={`p-2 rounded-full bg-primary text-primary-foreground transition-all duration-200 
            ${(!message.trim() && attachments.length === 0) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'}`}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
