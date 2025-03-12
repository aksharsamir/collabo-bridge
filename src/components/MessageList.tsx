
import React, { useRef, useEffect } from 'react';
import { Message } from './Message';

interface MessageListProps {
  messages: Array<{
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
  }>;
  onFileView: (file: any) => void;
}

export const MessageList = ({ messages, onFileView }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Group messages by date
  const groupMessagesByDate = () => {
    const groups: { [key: string]: typeof messages } = {};
    
    messages.forEach(message => {
      const date = message.timestamp.toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };
  
  const groupedMessages = groupMessagesByDate();
  
  const renderDateLabel = (dateString: string) => {
    const messageDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString('en-US', { 
        month: 'short', day: 'numeric', year: 'numeric' 
      });
    }
  };
  
  return (
    <div className="space-y-6 pb-4 pt-3">
      {Object.entries(groupedMessages).map(([date, msgs]) => (
        <div key={date} className="space-y-4">
          <div className="flex justify-center">
            <div className="px-3 py-1 rounded-full text-xs bg-secondary text-secondary-foreground">
              {renderDateLabel(date)}
            </div>
          </div>
          
          {msgs.map((message, index) => {
            // System messages don't need consecutive handling
            if (message.isSystemMessage) {
              return (
                <Message
                  key={message.id}
                  message={message}
                  showSender={false}
                  isConsecutive={false}
                  onFileView={onFileView}
                />
              );
            }
            
            // Check if we need to show sender info (hide it if consecutive messages from same sender)
            const showSender = index === 0 || 
              msgs[index - 1].isSystemMessage || 
              msgs[index - 1].sender.id !== message.sender.id;
            
            // Handle consecutive messages from the same sender
            const isConsecutive = index > 0 && 
              !msgs[index - 1].isSystemMessage &&
              msgs[index - 1].sender.id === message.sender.id;
            
            return (
              <Message
                key={message.id}
                message={message}
                showSender={showSender}
                isConsecutive={isConsecutive}
                onFileView={onFileView}
              />
            );
          })}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
