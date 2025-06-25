import { ChatRoom, Message } from '../types';

export const defaultAvatars = [
  '🟦', '🟨', '🟩', '🟪', '🟫', '⚫', '🔴', '🟠'
];

export const categories = [
  'Music', 'Politics', 'Tech', 'Sports', 'Random', 'Gaming', 'Movies', 'Books'
];

export const mockChatRooms: ChatRoom[] = [
  {
    id: '1',
    title: 'Weekend Music Recommendations',
    category: 'Music',
    activeUsers: 23,
    lastMessage: new Date(Date.now() - 300000),
    messageCount: 156
  },
  {
    id: '2',
    title: 'Latest JavaScript Frameworks',
    category: 'Tech',
    activeUsers: 18,
    lastMessage: new Date(Date.now() - 120000),
    messageCount: 89
  },
  {
    id: '3',
    title: 'NBA Season Discussion',
    category: 'Sports',
    activeUsers: 31,
    lastMessage: new Date(Date.now() - 60000),
    messageCount: 203
  },
  {
    id: '4',
    title: 'Random Thoughts',
    category: 'Random',
    activeUsers: 12,
    lastMessage: new Date(Date.now() - 900000),
    messageCount: 45
  }
];

export const mockMessages: Message[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'MusicLover',
    userAvatar: '🟦',
    content: 'Anyone have good indie rock recommendations?',
    timestamp: new Date(Date.now() - 600000),
    chatId: '1'
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'RockFan',
    userAvatar: '🟨',
    content: 'Try Arctic Monkeys latest album, absolutely brilliant',
    timestamp: new Date(Date.now() - 540000),
    chatId: '1'
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'DevGuru',
    userAvatar: '/ChatGPT Image Jun 23, 2025, 12_06_51 PM.png',
    content: 'React 18 concurrent features are game changing',
    timestamp: new Date(Date.now() - 180000),
    chatId: '2'
  }
];