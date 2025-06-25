import { useState, useEffect } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import Header from './components/Header';
import AuthPage from './components/AuthPage';
import HomePage from './components/HomePage';
import ChatRoom from './components/ChatRoom';
import CreateDiscussion from './components/CreateDiscussion';
import ProfilePage from './components/ProfilePage';
import { User, Message, ChatRoom as ChatRoomType, AuthState } from './types';
import { mockMessages } from './data/mockData';
import axios from 'axios';
import { BACKEND_URL } from './config';

type AppView = 'home' | 'chat' | 'create' | 'auth' | 'profile';

function App() {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: null
  });
  const [currentView, setCurrentView] = useState<AppView>('auth');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chatRooms, setChatRooms] = useState<ChatRoomType[]>([]);
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  // Simulate real-time message updates
  useEffect(() => {
    if (!auth.isAuthenticated) return;

    const interval = setInterval(() => {
      // Randomly add messages to active chats
      if (Math.random() < 0.3) { // 30% chance every 5 seconds
        const activeChatIds = chatRooms.map(room => room.id);
        const randomChatId = activeChatIds[Math.floor(Math.random() * activeChatIds.length)];

        const randomMessages = [
          'interesting point',
          'agreed',
          'anyone else think this?',
          'thanks for sharing',
          'what do you think?',
          'good discussion',
          'different perspective here',
          'reminds me of something'
        ];

        const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];

        const simulatedMessage: Message = {
          userId: 'anon-user',
          userName: 'Anonymous',
          userAvatar: '/QmczEYJCDvw1FU3kdMubyDoAy82hKiXF7vfPTXEB6tAH2G.webp',
          content: randomMessage,
          timestamp: new Date(),
          chatId: randomChatId
        };

        setMessages(prev => [...prev, simulatedMessage]);

        // Update last message time for the chat room
        setChatRooms(prev => prev.map(room =>
          room.id === randomChatId
            ? { ...room, lastMessage: new Date(), messageCount: room.messageCount + 1 }
            : room
        ));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [auth.isAuthenticated, chatRooms]);

  useEffect(() => {
    if (!auth.isAuthenticated) return;

    const fetchChatRooms = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/chat/rooms`);
        const parsedRooms = response.data.map((room: any) => ({
          ...room,
          lastMessage: room.lastMessage ? new Date(room.lastMessage) : null,
        }));
        setChatRooms(parsedRooms);
      } catch (error) {
        console.error('❌ Failed to fetch chat rooms:', error);
      }
    };


    fetchChatRooms();
  }, [auth.isAuthenticated]);


  const handleLogin = (user: User) => {
    setAuth({ isAuthenticated: true, user });
    setCurrentView('home');
  };

  const handleLogout = () => {
    setAuth({ isAuthenticated: false, user: null });
    setCurrentView('auth');
    setSelectedChatId(null);
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setAuth(prev => ({ ...prev, user: updatedUser }));

    // Update user info in existing messages
    setMessages(prev => prev.map(message =>
      message.userId === updatedUser.id
        ? {
          ...message,
          userName: updatedUser.displayName,
          userAvatar: updatedUser.profilePicture
        }
        : message
    ));
  };

  const handleJoinChat = (chatId: string) => {
    setSelectedChatId(chatId);
    setCurrentView('chat');
  };

  const handleCreateChat = (newChatRoom: ChatRoomType) => {
    setChatRooms(prev => [newChatRoom, ...prev]);
    setSelectedChatId(newChatRoom.id);
    setCurrentView('chat');
  };

  const handleSendMessage = async (message: Message) => {
    // Optimistically update UI
    setMessages(prev => [...prev, message]);

    // Update chat room stats
    setChatRooms(prev => prev.map(room =>
      room.id === message.chatId
        ? { ...room, lastMessage: message.timestamp, messageCount: room.messageCount + 1 }
        : room
    ));

    // Persist message to backend
    try {
      await axios.post(`${BACKEND_URL}/chat/message`, message);
    } catch (error) {
      console.error('Failed to save message to server:', error);
      // Optional: Rollback or notify user
    }
  };


  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedChatId(null);
  };

  const handleShowProfile = () => {
    setCurrentView('profile');
  };

  const selectedChatRoom = selectedChatId
    ? chatRooms.find(room => room.id === selectedChatId)
    : null;

  return (
    <ThemeProvider>
      <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        {!auth.isAuthenticated ? (
          <AuthPage onLogin={handleLogin} />
        ) : (
          <>
            {currentView !== 'chat' && currentView !== 'profile' && (
              <Header
                user={auth.user}
                onLogout={handleLogout}
                onHome={handleBackToHome}
                onProfile={handleShowProfile}
              />
            )}

            {currentView === 'home' && (
              <HomePage
                chatRooms={chatRooms}
                onJoinChat={handleJoinChat}
                onCreateDiscussion={() => setCurrentView('create')}
              />
            )}

            {currentView === 'create' && (
              <CreateDiscussion
                onBack={handleBackToHome}
                onCreateChat={handleCreateChat}
                existingChatRooms={chatRooms}
              />
            )}

            {currentView === 'profile' && auth.user && (
              <ProfilePage
                user={auth.user}
                onBack={handleBackToHome}
                onUpdateProfile={handleUpdateProfile}
              />
            )}

            {currentView === 'chat' && selectedChatRoom && auth.user && (
              <ChatRoom
                chatRoom={selectedChatRoom}
                messages={messages}
                user={auth.user}
                onBack={handleBackToHome}
                onSendMessage={handleSendMessage}
              />
            )}
          </>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;