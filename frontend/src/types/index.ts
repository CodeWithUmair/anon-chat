export interface User {
  id: string;
  username: string;
  displayName: string;
  profilePicture: string;
  profilePictureType: 'preset' | 'uploaded';
  joinedDate: Date;
}

export interface Message {
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: Date;
  chatId: string;
}

export interface ChatRoom {
  id: string;
  title: string;
  category: string;
  activeUsers: number;
  lastMessage?: Date;
  messageCount: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}