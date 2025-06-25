import React, { useEffect, useState } from 'react';
import { ChatRoom } from '../types';
import { categories } from '../data/mockData';
import { useThemeContext } from './ThemeProvider';
import { Search } from 'lucide-react';

interface HomePageProps {
  chatRooms: ChatRoom[];
  onJoinChat: (chatId: string) => void;
  onCreateDiscussion: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ chatRooms, onJoinChat, onCreateDiscussion }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const { colors } = useThemeContext();

  const filteredRooms = chatRooms.filter(room => {
    const matchesCategory = selectedCategory === 'All' || room.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedRooms = [...filteredRooms].sort((a, b) => b.activeUsers - a.activeUsers);

  const formatTimeAgo = (date: Date | string) => {
    const parsed = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - parsed.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`;
    return `${Math.floor(diffMins / 1440)}d`;
  };

  useEffect(() => {
    const adminName = localStorage.getItem('admin_display_name')?.trim().toLowerCase() === 'adminadmin';
    setIsAdmin(!!adminName); // true if exists, false if null
  }, []);

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: colors.background,
      minHeight: '100vh',
      padding: '24px'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: colors.text,
            marginBottom: '8px'
          }}>
            Discussion Boards
          </h1>
          {isAdmin ? <p style={{ fontSize: '16px', color: colors.textSecondary, marginBottom: '24px' }}>
            You are logged in as an admin. You can create new discussion boards.
          </p> : (
            <p style={{ fontSize: '16px', color: colors.textSecondary, marginBottom: '24px' }}>
              Join active discussions.
            </p>
          )}

          {isAdmin && (
            <button
              onClick={onCreateDiscussion}
              style={{
                backgroundColor: colors.primary,
                color: colors.surface,
                border: `2px solid ${colors.primary}`,
                borderRadius: '6px',
                padding: '12px 24px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s',
                marginBottom: '24px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = colors.surface;
                e.currentTarget.style.color = colors.primary;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary;
                e.currentTarget.style.color = colors.surface;
              }}
            >
              Start New Discussion
            </button>
          )}
        </div>

        <div style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '24px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '250px' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: colors.textSecondary
              }}
            />
            <input
              type="text"
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 40px',
                border: `2px solid ${colors.border}`,
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'inherit',
                backgroundColor: colors.surface,
                color: colors.text,
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = colors.primary}
              onBlur={(e) => e.target.style.borderColor = colors.border}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label style={{ fontWeight: '600', fontSize: '14px', color: colors.text }}>
              Filter:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '12px 16px',
                border: `2px solid ${colors.border}`,
                borderRadius: '6px',
                fontFamily: 'inherit',
                fontSize: '14px',
                backgroundColor: colors.surface,
                color: colors.text,
                cursor: 'pointer',
                outline: 'none',
                minWidth: '120px'
              }}
            >
              <option value="All">All</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{
          border: `2px solid ${colors.border}`,
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: colors.surface
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 80px 80px 80px',
            backgroundColor: colors.surface,
            borderBottom: `2px solid ${colors.border}`,
            fontWeight: '600',
            fontSize: '14px'
          }}>
            <div style={{ padding: '16px 20px', borderRight: `1px solid ${colors.border}`, color: colors.text }}>
              Discussion
            </div>
            <div style={{ padding: '16px 12px', textAlign: 'center', borderRight: `1px solid ${colors.border}`, color: colors.text }}>
              Users
            </div>
            <div style={{ padding: '16px 12px', textAlign: 'center', borderRight: `1px solid ${colors.border}`, color: colors.text }}>
              Posts
            </div>
            <div style={{ padding: '16px 12px', textAlign: 'center', color: colors.text }}>
              Last
            </div>
          </div>

          {sortedRooms.map((room, index) => (
            <div
              key={room.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 80px 80px 80px',
                backgroundColor: colors.surface,
                cursor: 'pointer',
                borderBottom: index < sortedRooms.length - 1 ? `1px solid ${colors.border}` : 'none',
                transition: 'background-color 0.2s'
              }}
              onClick={() => onJoinChat(room.id)}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.accent}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = colors.surface}
            >
              <div style={{
                padding: '16px 20px',
                borderRight: `1px solid ${colors.border}`
              }}>
                <div style={{ fontWeight: '600', fontSize: '15px', marginBottom: '4px', color: colors.text }}>
                  {room.title}
                </div>
                <div style={{ color: colors.primary, fontSize: '13px', fontWeight: '500' }}>
                  /{room.category}/
                </div>
              </div>
              <div style={{
                padding: '16px 12px',
                textAlign: 'center',
                borderRight: `1px solid ${colors.border}`,
                fontSize: '14px',
                fontWeight: '600',
                color: colors.text,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {room.activeUsers}
              </div>
              <div style={{
                padding: '16px 12px',
                textAlign: 'center',
                borderRight: `1px solid ${colors.border}`,
                fontSize: '14px',
                color: colors.text,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {room.messageCount}
              </div>
              <div style={{
                padding: '16px 12px',
                textAlign: 'center',
                fontSize: '12px',
                color: colors.textSecondary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {room.lastMessage ? formatTimeAgo(room.lastMessage) : '-'}
              </div>
            </div>
          ))}
        </div>

        {sortedRooms.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            fontSize: '16px',
            color: colors.textSecondary
          }}>
            {searchQuery ? 'No discussions found matching your search.' : 'No discussions found in this category.'}
            <br />
            {isAdmin ? <button
              onClick={onCreateDiscussion}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: colors.primary,
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '16px',
                marginTop: '12px',
                fontFamily: 'inherit'
              }}
            >
              Start the first one
            </button> : <></>}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;