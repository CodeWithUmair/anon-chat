import React, { useState } from 'react';
import { categories } from '../data/mockData';
import { generateId } from '../utils/validation';
import { useThemeContext } from './ThemeProvider';
import { ChatRoom } from '../types';
import { BACKEND_URL } from '../config';

interface CreateDiscussionProps {
  onBack: () => void;
  onCreateChat: (chatRoom: ChatRoom) => void;
  existingChatRooms: ChatRoom[];
}

const CreateDiscussion: React.FC<CreateDiscussionProps> = ({ onBack, onCreateChat, existingChatRooms }) => {
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { colors } = useThemeContext();

  // Get all existing categories (preset + custom ones from existing chats)
  const allCategories = Array.from(new Set([
    ...categories,
    ...existingChatRooms.map(room => room.category)
  ])).sort();

  const validateCustomCategory = (categoryName: string): string | null => {
    if (!categoryName.trim()) {
      return 'Please enter a custom board name';
    }

    if (categoryName.length > 16) {
      return 'Board name must be 16 characters or less';
    }

    if (categoryName.includes(' ')) {
      return 'Board name cannot contain spaces (single word only)';
    }

    // Check for special characters (allow only letters, numbers, and basic symbols)
    if (!/^[a-zA-Z0-9_-]+$/.test(categoryName)) {
      return 'Board name can only contain letters, numbers, hyphens, and underscores';
    }

    // Check if category already exists (case insensitive)
    const existingCategory = allCategories.find(
      cat => cat.toLowerCase() === categoryName.toLowerCase()
    );

    if (existingCategory) {
      return 'A board with this name already exists';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Please enter a discussion title');
      return;
    }

    if (title.length > 50) {
      setError('Title must be 50 characters or less');
      return;
    }

    const categoryToUse = isCustomCategory ? customCategory.trim() : selectedCategory;

    if (isCustomCategory) {
      const categoryError = validateCustomCategory(customCategory);
      if (categoryError) {
        setError(categoryError);
        return;
      }
    }

    // Check for duplicate title on client
    const duplicateTitle = existingChatRooms.find(
      room => room.title.toLowerCase() === title.trim().toLowerCase()
    );
    if (duplicateTitle) {
      setError('A discussion with this title already exists');
      return;
    }

    const newChat: ChatRoom = {
      id: generateId(),
      title: title.trim(),
      category: categoryToUse,
      activeUsers: 1,
      lastMessage: new Date(),
      messageCount: 0,
    };

    try {
      const res = await fetch(`${BACKEND_URL}/chat/room`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newChat),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.message || 'Failed to create chat room');
        return;
      }

      const savedRoom: ChatRoom = await res.json();
      onCreateChat(savedRoom); // Add to local state
    } catch (err) {
      setError('Failed to connect to server. Please try again.');
      console.error('❌ Error creating chat room:', err);
    }
  };


  const handleCustomCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomCategory(value);
    setError(null);

    // Real-time validation feedback
    if (value && validateCustomCategory(value)) {
      // Don't set error immediately, just clear it when valid
    }
  };

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: colors.background,
      minHeight: '100vh',
      padding: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        backgroundColor: colors.surface,
        border: `2px solid ${colors.border}`,
        borderRadius: '8px',
        padding: '32px',
        boxShadow: `4px 4px 0px ${colors.border}`
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: colors.text,
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          Start New Discussion
        </h1>

        {error && (
          <div style={{
            backgroundColor: colors.theme === 'dark' ? '#4a1a1a' : '#ffebee',
            border: `2px solid ${colors.error}`,
            borderRadius: '4px',
            padding: '12px',
            marginBottom: '20px',
            color: colors.error,
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              fontSize: '14px',
              color: colors.text
            }}>
              Subject:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError(null);
              }}
              maxLength={50}
              style={{
                width: '100%',
                padding: '12px',
                border: `2px solid ${colors.border}`,
                borderRadius: '4px',
                fontSize: '14px',
                fontFamily: 'inherit',
                backgroundColor: colors.surface,
                color: colors.text,
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              placeholder="Discussion topic..."
              onFocus={(e) => e.target.style.borderColor = colors.primary}
              onBlur={(e) => e.target.style.borderColor = colors.border}
            />
            <div style={{
              fontSize: '12px',
              color: colors.textSecondary,
              marginTop: '4px',
              textAlign: 'right'
            }}>
              {title.length}/50 characters
            </div>
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '12px',
              fontWeight: '600',
              fontSize: '14px',
              color: colors.text
            }}>
              Board:
            </label>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: colors.text }}>
                <input
                  type="radio"
                  name="category"
                  checked={!isCustomCategory}
                  onChange={() => setIsCustomCategory(false)}
                  style={{ margin: 0 }}
                />
                <span style={{ fontSize: '14px', fontWeight: '500' }}>
                  Existing board:
                </span>
              </label>
              {!isCustomCategory && (
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${colors.border}`,
                    borderRadius: '4px',
                    fontFamily: 'inherit',
                    fontSize: '14px',
                    backgroundColor: colors.surface,
                    color: colors.text,
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  {allCategories.map((category) => (
                    <option key={category} value={category}>
                      /{category}/
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: colors.text }}>
                <input
                  type="radio"
                  name="category"
                  checked={isCustomCategory}
                  onChange={() => setIsCustomCategory(true)}
                  style={{ margin: 0 }}
                />
                <span style={{ fontSize: '14px', fontWeight: '500' }}>
                  New board:
                </span>
              </label>
              {isCustomCategory && (
                <div>
                  <input
                    type="text"
                    value={customCategory}
                    onChange={handleCustomCategoryChange}
                    maxLength={16}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid ${colors.border}`,
                      borderRadius: '4px',
                      fontFamily: 'inherit',
                      fontSize: '14px',
                      backgroundColor: colors.surface,
                      color: colors.text,
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    placeholder="BoardName"
                    onFocus={(e) => e.target.style.borderColor = colors.primary}
                    onBlur={(e) => e.target.style.borderColor = colors.border}
                  />
                  <div style={{
                    fontSize: '12px',
                    color: colors.textSecondary,
                    marginTop: '6px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span>Single word only, no spaces • Letters, numbers, - and _ allowed</span>
                    <span>{customCategory.length}/16</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '12px 24px',
                backgroundColor: colors.primary,
                color: colors.surface,
                border: `2px solid ${colors.primary}`,
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s'
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
              Create Discussion
            </button>
            <button
              type="button"
              onClick={onBack}
              style={{
                flex: 1,
                padding: '12px 24px',
                backgroundColor: colors.surface,
                color: colors.text,
                border: `2px solid ${colors.border}`,
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = colors.text;
                e.currentTarget.style.color = colors.surface;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = colors.surface;
                e.currentTarget.style.color = colors.text;
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDiscussion;