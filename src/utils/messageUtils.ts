
import { 
  getUserById,
  addMessage,
  getChatById,
  addUserToChat,
  createChat,
  createUser
} from '@/lib/db';
import { MessageType } from '@/components/MessageList';

// Get current user from localStorage or create a default one
export function getCurrentUser() {
  const userId = localStorage.getItem('currentUserId');
  const userName = localStorage.getItem('currentUserName');
  
  if (userId && userName) {
    return {
      id: userId,
      name: userName,
      status: 'online'
    };
  }
  
  return null;
}

// Get messages by chat ID
export function getMessagesByNewest(chatId?: string): MessageType[] {
  if (!chatId) return [];
  
  const chat = getChatById(chatId);
  if (!chat) return [];
  
  return [...chat.messages].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

// Send a message
export function sendMessage(chatId: string, content: string, attachments?: File[]) {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error('No current user found');
  
  let processedAttachments;
  
  if (attachments && attachments.length > 0) {
    processedAttachments = attachments.map(file => ({
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
      size: file.size,
    }));
  }
  
  return addMessage(chatId, currentUser.id, content, processedAttachments);
}

// Join or create a chat session by ID
export function joinChatById(chatId: string, user: { id: string; name: string; status: string }) {
  // Add user to the chat
  addUserToChat(chatId, user.id);
  
  // Add a system message that the user joined
  addMessage(
    chatId,
    'system',
    `${user.name} joined the chat`,
    undefined,
    true
  );
  
  return getChatById(chatId);
}

// Create a new chat
export function createNewChat() {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error('No current user found');
  
  const chatId = createChat();
  addUserToChat(chatId, currentUser.id);
  
  return chatId;
}

// Check if a user needs to join (doesn't have stored credentials)
export function needsToJoin(): boolean {
  return !localStorage.getItem('currentUserId');
}
