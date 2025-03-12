
// Mock data for demonstration purposes
export const mockUsers = [
  {
    id: 'user-1',
    name: 'John Doe',
    avatar: undefined,
    status: 'online',
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    avatar: undefined,
    status: 'online',
  },
  {
    id: 'user-3',
    name: 'Robert Johnson',
    avatar: undefined,
    status: 'offline',
  },
];

// Mock messages data
export const mockMessages = [
  {
    id: 'msg-1',
    content: 'Hey team! I just uploaded the new design files for the product page.',
    sender: mockUsers[0],
    timestamp: new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // Yesterday
    attachments: [
      {
        id: 'file-1',
        name: 'Product_Design_v2.pdf',
        type: 'application/pdf',
        url: '#',
        size: 2500000,
        uploadedAt: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      }
    ],
    isCurrentUser: true,
  },
  {
    id: 'msg-2',
    content: 'Thanks John! I'll take a look at it right away.',
    sender: mockUsers[1],
    timestamp: new Date(new Date().getTime() - 23 * 60 * 60 * 1000), // Yesterday
    isCurrentUser: false,
  },
  {
    id: 'msg-3',
    content: 'The color scheme looks great! Just one concern about the navigation on mobile.',
    sender: mockUsers[1],
    timestamp: new Date(new Date().getTime() - 22 * 60 * 60 * 1000), // Yesterday
    isCurrentUser: false,
  },
  {
    id: 'msg-4',
    content: 'Here's a screenshot of the issue I'm seeing on smaller screens:',
    sender: mockUsers[1],
    timestamp: new Date(new Date().getTime() - 22 * 60 * 60 * 1000), // Yesterday
    attachments: [
      {
        id: 'file-2',
        name: 'mobile_nav_issue.jpg',
        type: 'image/jpeg',
        url: 'https://placehold.co/600x400',
        size: 150000,
        uploadedAt: new Date(new Date().getTime() - 22 * 60 * 60 * 1000),
      }
    ],
    isCurrentUser: false,
  },
  {
    id: 'msg-5',
    content: 'Good catch, Jane! I'll fix that navigation issue and upload a new version later today.',
    sender: mockUsers[0],
    timestamp: new Date(new Date().getTime() - 21 * 60 * 60 * 1000), // Yesterday
    isCurrentUser: true,
  },
  {
    id: 'msg-6',
    content: 'I've been working on the backend API documentation. Here it is:',
    sender: mockUsers[2],
    timestamp: new Date(new Date().getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
    attachments: [
      {
        id: 'file-3',
        name: 'API_Documentation_v1.docx',
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        url: '#',
        size: 1200000,
        uploadedAt: new Date(new Date().getTime() - 3 * 60 * 60 * 1000),
      }
    ],
    isCurrentUser: false,
  },
  {
    id: 'msg-7',
    content: 'Here\'s the updated design with the mobile navigation fixes.',
    sender: mockUsers[0],
    timestamp: new Date(), // Now
    attachments: [
      {
        id: 'file-4',
        name: 'Product_Design_v3.pdf',
        type: 'application/pdf',
        url: '#',
        size: 2700000,
        uploadedAt: new Date(),
      },
      {
        id: 'file-5',
        name: 'design_preview.jpg',
        type: 'image/jpeg',
        url: 'https://placehold.co/800x600',
        size: 350000,
        uploadedAt: new Date(),
      }
    ],
    isCurrentUser: true,
  },
];

export function getMessagesByNewest() {
  return [...mockMessages].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

export function getCurrentUser() {
  return mockUsers[0];
}

let messageIdCounter = mockMessages.length + 1;

export function sendMessage(content: string, attachments?: File[]) {
  const newMessage = {
    id: `msg-${messageIdCounter++}`,
    content,
    sender: getCurrentUser(),
    timestamp: new Date(),
    isCurrentUser: true,
    attachments: attachments ? attachments.map(file => ({
      id: `file-${Date.now()}-${file.name}`,
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file), // Create a temporary URL for the file
      size: file.size,
      uploadedAt: new Date(),
    })) : undefined,
  };
  
  return newMessage;
}
