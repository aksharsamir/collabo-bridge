
import React, { useState } from 'react';
import { MessageList } from '@/components/MessageList';
import { MessageInput } from '@/components/MessageInput';
import { FilePreview } from '@/components/FilePreview';
import { getMessagesByNewest, sendMessage } from '@/utils/messageUtils';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const Chat = () => {
  const [messages, setMessages] = useState(getMessagesByNewest());
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isFilePreviewOpen, setIsFilePreviewOpen] = useState(false);
  
  const handleSendMessage = (content: string, attachments?: File[]) => {
    const newMessage = sendMessage(content, attachments);
    setMessages(prev => [...prev, newMessage]);
  };
  
  const handleFileView = (file: any) => {
    setSelectedFile(file);
    setIsFilePreviewOpen(true);
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-150px)]">
      <div className="glass-morphism p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-bold">Team Chat</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto glass-morphism rounded-lg p-4 mb-6">
        <MessageList 
          messages={messages} 
          onFileView={handleFileView} 
        />
      </div>
      
      <div>
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
      
      <Dialog open={isFilePreviewOpen} onOpenChange={setIsFilePreviewOpen}>
        <DialogContent className="p-0 bg-transparent border-none max-w-3xl">
          {selectedFile && (
            <FilePreview 
              file={selectedFile} 
              onClose={() => setIsFilePreviewOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Chat;
