
import React, { useState, useEffect } from 'react';
import { MessageList, MessageType } from '@/components/MessageList';
import { MessageInput } from '@/components/MessageInput';
import { FilePreview } from '@/components/FilePreview';
import { 
  getMessagesByNewest, 
  sendMessage, 
  joinChatById, 
  createNewChat, 
  getCurrentUser,
  needsToJoin
} from '@/utils/messageUtils';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Link2, Copy, Check, Users, Phone, Video, Search, MoreVertical } from 'lucide-react';
import { toast } from 'sonner';
import { UserAvatar } from '@/components/UserAvatar';
import { UserJoinDialog } from '@/components/UserJoinDialog';
import { getChatById } from '@/lib/db';

const Chat = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isFilePreviewOpen, setIsFilePreviewOpen] = useState(false);
  const [chatId, setChatId] = useState('');
  const [copied, setCopied] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; status: string } | null>(null);
  const [chatParticipants, setChatParticipants] = useState<Array<{ id: string; name: string; avatar?: string; status: string }>>([]);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  
  useEffect(() => {
    // Check if there's a chat ID in the URL params and if user needs to join
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const userNeedsToJoin = needsToJoin();
    
    // If user needs to join, show the join dialog
    if (userNeedsToJoin) {
      setShowJoinDialog(true);
    } else {
      // User already has credentials
      const user = getCurrentUser();
      setCurrentUser(user);
      
      if (id) {
        // Join existing chat
        handleExistingChat(id, user);
      } else {
        // Generate a new chat ID if none exists
        handleNewChat(user);
      }
    }
    
    // Set up polling for new messages
    const intervalId = setInterval(() => {
      if (chatId) {
        refreshMessages(chatId);
      }
    }, 3000); // Poll every 3 seconds
    
    return () => clearInterval(intervalId);
  }, [chatId]);
  
  const handleUserJoined = (user: { id: string; name: string; status: string }) => {
    setShowJoinDialog(false);
    setCurrentUser(user);
    
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (id) {
      handleExistingChat(id, user);
    } else {
      handleNewChat(user);
    }
  };
  
  const handleExistingChat = (id: string, user: { id: string; name: string; status: string } | null) => {
    if (!user) return;
    
    setChatId(id);
    const chatSession = joinChatById(id, user);
    
    if (chatSession) {
      setMessages(chatSession.messages);
      setChatParticipants(chatSession.participants);
    }
  };
  
  const handleNewChat = (user: { id: string; name: string; status: string } | null) => {
    if (!user) return;
    
    const newChatId = createNewChat();
    setChatId(newChatId);
    setChatParticipants([user]);
    
    // Update URL without refreshing the page
    const newUrl = `${window.location.pathname}?id=${newChatId}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };
  
  const refreshMessages = (id: string) => {
    const chatSession = getChatById(id);
    
    if (chatSession) {
      setMessages(chatSession.messages);
      setChatParticipants(chatSession.participants);
    }
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
    if (!chatId) return;
    
    const newMessage = sendMessage(chatId, content, attachments);
    setMessages(prev => [...prev, newMessage]);
  };
  
  const handleFileView = (file: any) => {
    setSelectedFile(file);
    setIsFilePreviewOpen(true);
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-150px)]">
      <div className="bg-[#00a884] dark:bg-gray-800 p-3 rounded-t-lg mb-1">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {chatParticipants.length > 1 ? (
              <div className="relative">
                <UserAvatar 
                  name={chatParticipants[1].name} 
                  image={chatParticipants[1].avatar} 
                  size="md" 
                  status={chatParticipants[1].status as 'online' | 'offline' | 'away'} 
                />
                <div className="absolute -bottom-1 -right-1">
                  <div className="flex -space-x-2">
                    {chatParticipants.slice(2, 4).map((user, i) => (
                      <div key={i} className="relative w-5 h-5 rounded-full border-2 border-[#00a884] dark:border-gray-800 z-10">
                        <UserAvatar 
                          name={user.name} 
                          image={user.avatar} 
                          size="xs" 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <UserAvatar 
                name="Team Chat" 
                size="md" 
              />
            )}
            
            <div>
              <h1 className="font-semibold text-white">
                {chatParticipants.length > 1 
                  ? `${chatParticipants[1].name}${chatParticipants.length > 2 ? ` and ${chatParticipants.length - 2} others` : ''}` 
                  : 'Team Chat'}
              </h1>
              <div className="text-xs text-green-100">
                {chatParticipants.filter(p => p.status === 'online').length} online
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="text-white hover:bg-white/10 p-2 rounded-full transition-colors">
              <Video className="w-5 h-5" />
            </button>
            <button className="text-white hover:bg-white/10 p-2 rounded-full transition-colors">
              <Phone className="w-5 h-5" />
            </button>
            <button className="text-white hover:bg-white/10 p-2 rounded-full transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowParticipants(!showParticipants)} 
              className="text-white hover:bg-white/10 p-2 rounded-full transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {showParticipants && (
          <div className="mt-4 p-3 bg-white/10 rounded-md">
            <h3 className="text-sm font-medium mb-2 text-white">Participants:</h3>
            <div className="flex flex-wrap gap-2">
              {chatParticipants.map(user => (
                <div key={user.id} className="flex items-center gap-2 px-2 py-1 bg-white/10 rounded-md">
                  <UserAvatar name={user.name} image={user.avatar} size="sm" status={user.status as 'online' | 'offline' | 'away'} />
                  <span className="text-xs font-medium text-white">{user.name}</span>
                  {currentUser && user.id === currentUser.id && (
                    <span className="text-xs bg-white/20 text-white px-1 rounded">You</span>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-3 flex justify-between">
              <span className="text-xs text-white/80">Chat ID: {chatId}</span>
              <button
                onClick={shareLink}
                className="flex items-center gap-1 text-xs text-white hover:underline"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                Copy invite link
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto bg-[url('https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png')] bg-repeat p-4 mb-1">
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
      
      <UserJoinDialog 
        open={showJoinDialog} 
        onComplete={handleUserJoined} 
      />
    </div>
  );
};

export default Chat;
