
import React, { useState, useEffect } from 'react';
import { MessageList } from '@/components/MessageList';
import { MessageInput } from '@/components/MessageInput';
import { FilePreview } from '@/components/FilePreview';
import { getMessagesByNewest, sendMessage } from '@/utils/messageUtils';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Link2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

const Chat = () => {
  const [messages, setMessages] = useState(getMessagesByNewest());
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isFilePreviewOpen, setIsFilePreviewOpen] = useState(false);
  const [chatId, setChatId] = useState('');
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    // Check if there's a chat ID in the URL params
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (id) {
      setChatId(id);
    } else {
      // Generate a new chat ID if none exists
      const newChatId = generateChatId();
      setChatId(newChatId);
      
      // Update URL without refreshing the page
      const newUrl = `${window.location.pathname}?id=${newChatId}`;
      window.history.pushState({ path: newUrl }, '', newUrl);
    }
  }, []);
  
  const generateChatId = () => {
    return Math.random().toString(36).substring(2, 10);
  };
  
  const shareLink = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?id=${chatId}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          setCopied(true);
          toast.success('Chat link copied to clipboard');
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {
          toast.error('Failed to copy link');
        });
    } else {
      // Fallback for browsers without clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      
      try {
        document.execCommand('copy');
        setCopied(true);
        toast.success('Chat link copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        toast.error('Failed to copy link');
      }
      
      document.body.removeChild(textArea);
    }
  };
  
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
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Team Chat</h1>
          
          <button
            onClick={shareLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors"
            title="Share chat link"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Link2 className="w-4 h-4" />
            )}
            <span className="text-sm">Share Link</span>
          </button>
        </div>
        
        {chatId && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Chat ID: {chatId}</span>
            <button
              onClick={shareLink}
              className="text-xs text-primary hover:underline"
            >
              <Copy className="w-3 h-3 inline mr-1" />
              Copy invite link
            </button>
          </div>
        )}
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
