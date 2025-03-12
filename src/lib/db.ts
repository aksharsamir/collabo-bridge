
import Database from 'better-sqlite3';
import { MessageType } from '@/components/MessageList';

// Initialize database
const db = new Database(':memory:'); // In-memory database for demo purposes

// Set up database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    avatar TEXT,
    status TEXT DEFAULT 'online'
  );
  
  CREATE TABLE IF NOT EXISTS chats (
    id TEXT PRIMARY KEY,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS chat_participants (
    chat_id TEXT,
    user_id TEXT,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (chat_id, user_id),
    FOREIGN KEY (chat_id) REFERENCES chats(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
  
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    chat_id TEXT NOT NULL,
    content TEXT NOT NULL,
    sender_id TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_system_message BOOLEAN DEFAULT 0,
    FOREIGN KEY (chat_id) REFERENCES chats(id),
    FOREIGN KEY (sender_id) REFERENCES users(id)
  );
  
  CREATE TABLE IF NOT EXISTS attachments (
    id TEXT PRIMARY KEY,
    message_id TEXT NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    url TEXT NOT NULL,
    size INTEGER NOT NULL,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES messages(id)
  );
`);

// Insert initial system user
db.prepare(`
  INSERT OR IGNORE INTO users (id, name, status)
  VALUES ('system', 'System', 'online')
`).run();

export interface User {
  id: string;
  name: string;
  avatar?: string;
  status: string;
}

export interface ChatSession {
  id: string;
  participants: User[];
  messages: MessageType[];
}

// User functions
export function createUser(name: string): User {
  const id = `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  
  db.prepare(`
    INSERT INTO users (id, name, status)
    VALUES (?, ?, 'online')
  `).run(id, name);
  
  return { id, name, status: 'online' };
}

export function getUserById(id: string): User | null {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  return user || null;
}

export function getAllUsers(): User[] {
  return db.prepare('SELECT * FROM users').all();
}

// Chat functions
export function createChat(): string {
  const chatId = Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  
  db.prepare(`
    INSERT INTO chats (id)
    VALUES (?)
  `).run(chatId);
  
  return chatId;
}

export function getChatById(chatId: string): ChatSession | null {
  const chat = db.prepare('SELECT * FROM chats WHERE id = ?').get(chatId);
  
  if (!chat) return null;
  
  const participants = db.prepare(`
    SELECT u.* FROM users u
    JOIN chat_participants cp ON u.id = cp.user_id
    WHERE cp.chat_id = ?
  `).all(chatId);
  
  const messages = getMessagesByChatId(chatId);
  
  return {
    id: chatId,
    participants,
    messages
  };
}

export function addUserToChat(chatId: string, userId: string): void {
  // Check if chat exists
  const chat = db.prepare('SELECT * FROM chats WHERE id = ?').get(chatId);
  
  if (!chat) {
    // Create the chat if it doesn't exist
    db.prepare('INSERT INTO chats (id) VALUES (?)').run(chatId);
  }
  
  // Add user to chat
  db.prepare(`
    INSERT OR IGNORE INTO chat_participants (chat_id, user_id)
    VALUES (?, ?)
  `).run(chatId, userId);
}

// Message functions
export function getMessagesByChatId(chatId: string): MessageType[] {
  const messages = db.prepare(`
    SELECT m.*, u.name as sender_name, u.avatar as sender_avatar, u.status as sender_status
    FROM messages m
    JOIN users u ON m.sender_id = u.id
    WHERE m.chat_id = ?
    ORDER BY m.timestamp ASC
  `).all(chatId);
  
  return messages.map(msg => {
    // Get attachments for message
    const attachments = db.prepare(`
      SELECT * FROM attachments 
      WHERE message_id = ?
    `).all(msg.id);
    
    const currentUserId = localStorage.getItem('currentUserId');
    
    return {
      id: msg.id,
      content: msg.content,
      sender: {
        id: msg.sender_id,
        name: msg.sender_name,
        avatar: msg.sender_avatar,
        status: msg.sender_status
      },
      timestamp: new Date(msg.timestamp),
      attachments: attachments.length > 0 ? attachments : undefined,
      isCurrentUser: msg.sender_id === currentUserId,
      isSystemMessage: Boolean(msg.is_system_message)
    };
  });
}

export function addMessage(
  chatId: string, 
  senderId: string, 
  content: string, 
  attachments?: Array<{ name: string; type: string; url: string; size: number }>,
  isSystemMessage: boolean = false
): MessageType {
  const messageId = `msg-${Date.now()}`;
  
  // Insert message
  db.prepare(`
    INSERT INTO messages (id, chat_id, content, sender_id, is_system_message, timestamp)
    VALUES (?, ?, ?, ?, ?, datetime('now'))
  `).run(messageId, chatId, content, senderId, isSystemMessage ? 1 : 0);
  
  // Insert attachments if any
  if (attachments && attachments.length > 0) {
    const stmt = db.prepare(`
      INSERT INTO attachments (id, message_id, name, type, url, size, uploaded_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `);
    
    attachments.forEach(attachment => {
      const attachmentId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      stmt.run(
        attachmentId,
        messageId,
        attachment.name,
        attachment.type,
        attachment.url,
        attachment.size
      );
    });
  }
  
  // Get the sender
  const sender = db.prepare('SELECT * FROM users WHERE id = ?').get(senderId);
  
  const currentUserId = localStorage.getItem('currentUserId');
  
  // Return the created message
  return {
    id: messageId,
    content,
    sender: {
      id: sender.id,
      name: sender.name,
      avatar: sender.avatar,
      status: sender.status
    },
    timestamp: new Date(),
    attachments: attachments?.map((att, index) => ({
      ...att,
      id: `file-${Date.now()}-${index}`,
      uploadedAt: new Date()
    })),
    isCurrentUser: sender.id === currentUserId,
    isSystemMessage
  };
}

export default db;
