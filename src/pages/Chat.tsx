
import React, { useState, useEffect } from 'react';
import { MessageList, MessageType } from '@/components/MessageList';
import { MessageInput } from '@/components/MessageInput';
import { FilePreview } from '@/components/FilePreview';
import { getMessagesByNewest, sendMessage, joinChatById, getCurrentUser, mockUsers } from '@/utils/messageUtils';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Link2, Copy, Check, Users } from 'lucide-react';
import { toast } from 'sonner';
import { UserAvatar } from '@/components/UserAvatar';

const Chat = () => {
  const [messages, setMessages] = useState<MessageType[]>(getMessagesByNewest());
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isFilePreviewOpen, setIsFilePreviewOpen] = useState(false);
  const [chatId, setChatId] = useState('');
  const [copied, setCopied] = useState(false);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [chatParticipants, setChatParticipants] = useState<typeof mockUsers>([currentUser]);
  const [showParticipants, setShowParticipants] = useState(false);
  
  useEffect(() => {
    // Check if there's a chat ID in the URL params
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (id) {
      setChatId(id);
      // Join the existing chat
      const chatSession = joinChatById(id);
      setMessages(chatSession.messages);
      setChatParticipants(chatSession.participants);
      
      // Simulate other users joining (in a real app, this would be handled by a real-time backend)
      const simulateUserJoin = () => {
        // Randomly add another user that's not already in the chat
        const availableUsers = mockUsers.filter(user => 
          !chatSession.participants.some(p => p.id === user.id)
        );
        
        if (availableUsers.length > 0) {
          const randomUser = availableUsers[Math.floor(Math.random() * availableUsers.length)];
          const updatedParticipants = [...chatSession.participants, randomUser];
          setChatParticipants(updatedParticipants);
          
          // Add a system message that the user joined
          const joinMessage: MessageType = {
            id: `system-${Date.now()}`,
            content: `${randomUser.name} joined the chat`,
            sender: { 
              id: 'system', 
              name: 'System', 
              status: 'online',
              avatar: undefined 
            },
            timestamp: new Date(),
            isCurrentUser: false,
            isSystemMessage: true
          };
          
          setMessages(prev => [...prev, joinMessage]);
          
          // Make the user send a greeting message after a delay
          setTimeout(() => {
            const greeting: MessageType = {
              id: `msg-${Date.now()}`,
              content: `Hello everyone! I just joined via the shared link.`,
              sender: randomUser,
              timestamp: new Date(),
              isCurrentUser: false
            };
            setMessages(prev => [...prev, greeting]);
          }, 3000);
        }
      };
      
      // Only simulate another user joining if we're not already at max users
      if (chatSession.participants.length < mockUsers.length) {
        const delay = Math.random() * 5000 + 2000; // Random delay between 2-7 seconds
        setTimeout(simulateUserJoin, delay);
      }
    } else {
      // Generate a new chat ID if none exists
      const newChatId = generateChatId();
      setChatId(newChatId);
      
      // Update URL without refreshing the page
      const newUrl = `${window.location.pathname}?id=${newChatId}`;
      window.history.pushState({ path: newUrl }, '', newUrl);
    }
    
    // Poll for new messages (in a real app, this would use WebSockets or Server-Sent Events)
    const intervalId = setInterval(() => {
      // Simulate receiving messages from other users
      if (Math.random() > 0.8 && chatParticipants.length > 1) {
        const otherUsers = chatParticipants.filter(user => user.id !== currentUser.id);
        if (otherUsers.length > 0) {
          const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];
          const randomMessages = [
            "How's the project coming along?",
            "Did you see the latest design updates?",
            "When is our next meeting scheduled?",
            "I'll share some more files later today.",
            "Let me know if you need any help with that task."
          ];
          const randomContent = randomMessages[Math.floor(Math.random() * randomMessages.length)];
          
          const newMessage: MessageType = {
            id: `msg-${Date.now()}`,
            content: randomContent,
            sender: randomUser,
            timestamp: new Date(),
            isCurrentUser: false
          };
          
          setMessages(prev => [...prev, newMessage]);
        }
      }
    }, 15000); // Check every 15 seconds
    
    return () => clearInterval(intervalId);
  }, [chatId, chatParticipants, currentUser.id]);
  
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
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowParticipants(!showParticipants)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary/50 hover:bg-secondary/80 transition-colors"
              title="View participants"
            >
              <Users className="w-4 h-4" />
              <span className="text-sm">Participants ({chatParticipants.length})</span>
            </button>
            
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
        
        {showParticipants && (
          <div className="mt-4 p-3 bg-background/40 rounded-md">
            <h3 className="text-sm font-medium mb-2">Active Participants:</h3>
            <div className="flex flex-wrap gap-2">
              {chatParticipants.map(user => (
                <div key={user.id} className="flex items-center gap-2 px-2 py-1 bg-background/30 rounded-md">
                  <UserAvatar name={user.name} image={user.avatar} size="sm" status={user.status as 'online' | 'offline' | 'away'} />
                  <span className="text-xs font-medium">{user.name}</span>
                  {user.id === currentUser.id && (
                    <span className="text-xs bg-primary/20 text-primary px-1 rounded">You</span>
                  )}
                </div>
              ))}
            </div>
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
        <MessageInput onSendMessage={handleSendMessage} participants={chatParticipants} />
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
