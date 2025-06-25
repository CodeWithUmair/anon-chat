import React, { useState, useEffect, useRef } from 'react';
import { Message, User, ChatRoom as ChatRoomType } from '../types';
import { validateMessage } from '../utils/validation';
import { useRateLimit } from '../hooks/useRateLimit';
import { useThemeContext } from './ThemeProvider';
import { ArrowLeft, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { BACKEND_URL } from '../config';

interface ChatRoomProps {
  chatRoom: ChatRoomType;
  messages: Message[];
  user: User;
  onBack: () => void;
  onSendMessage: (message: Message) => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({
  chatRoom,
  messages,
  user,
  onBack,
  onSendMessage
}) => {
  const [messageText, setMessageText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatMessages = messages.filter(msg => msg.chatId === chatRoom.id);
  const { colors } = useThemeContext();

  // Rate limiting: 5 messages per 30 seconds (with progressive penalties)
  const { checkRateLimit, isLimited, remainingTime, currentMultiplier, getRateLimitMessage } = useRateLimit({
    maxMessages: 5,
    timeWindowMs: 30000 // 30 seconds
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check rate limit
    if (!checkRateLimit()) {
      setError(getRateLimitMessage());
      return;
    }

    // Validate input
    const validationError = validateMessage(messageText);
    if (validationError) {
      setError(validationError);
      return;
    }

    const newMessage: Message = {
      userId: user.id,
      userName: user.displayName,
      userAvatar: user.profilePicture,
      content: messageText.trim(),
      timestamp: new Date(),
      chatId: chatRoom.id
    };

    try {
      setIsLoading(true);
      const res = await axios.post(`${BACKEND_URL}/chat/message`, newMessage);
      console.log("✅ Message saved to DB:", res.data);

      // Update UI after successful save
      onSendMessage(res.data.savedMessage || newMessage);
      setMessageText('');
      setError(null);
    } catch (error) {
      console.error("❌ Failed to save message:", error);
      setError("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false)
    }
  };


  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const renderUserAvatar = (message: Message) => {
    // Check if it's a preset avatar (single emoji) or uploaded/default image
    const isPresetAvatar = message.userAvatar.length <= 2; // Emoji are typically 1-2 characters

    return (
      <div style={{
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        backgroundColor: 'transparent',
        fontSize: isPresetAvatar ? '20px' : '12px',
        overflow: 'hidden',
        flexShrink: 0
      }}>
        {isPresetAvatar ? (
          message.userAvatar
        ) : (
          <img
            src={message.userAvatar}
            alt="Profile"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '50%'
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: colors.background,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: colors.surface,
        borderBottom: `2px solid ${colors.border}`,
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          <button
            onClick={onBack}
            style={{
              backgroundColor: colors.surface,
              border: `2px solid ${colors.border}`,
              borderRadius: '4px',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              color: colors.text
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
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: colors.text,
              margin: 0,
              marginBottom: '4px'
            }}>
              {chatRoom.title}
            </h1>
            <div style={{ fontSize: '14px', color: colors.primary, fontWeight: '500' }}>
              /{chatRoom.category}/ • {chatRoom.activeUsers} users online
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px',
        maxHeight: 'calc(100vh - 200px)'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {chatMessages.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              fontSize: '16px',
              color: colors.textSecondary
            }}>
              No messages yet. Start the conversation!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'flex-start'
                  }}
                >
                  {renderUserAvatar(message)}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '14px',
                      marginBottom: '6px'
                    }}>
                      <span style={{
                        color: message.userId === user.id ? colors.primary : colors.text,
                        fontWeight: '600'
                      }}>
                        {message.userName}
                      </span>
                      <span style={{
                        color: colors.textSecondary,
                        fontSize: '13px'
                      }}>
                        {formatDateTime(message.timestamp)}
                      </span>
                    </div>
                    <div style={{
                      fontSize: '15px',
                      lineHeight: '1.5',
                      wordWrap: 'break-word',
                      color: message.userId === user.id ? colors.primary : colors.text,
                      fontWeight: message.userId === user.id ? '500' : 'normal'
                    }}>
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div style={{
        backgroundColor: colors.surface,
        borderTop: `2px solid ${colors.border}`,
        padding: '20px 24px'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <form onSubmit={handleSendMessage}>
            {error && (
              <div style={{
                backgroundColor: colors.theme === 'dark' ? '#4a1a1a' : '#ffebee',
                border: `2px solid ${colors.error}`,
                borderRadius: '4px',
                padding: '8px 12px',
                marginBottom: '12px',
                color: colors.error,
                fontSize: '13px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {isLimited && <Clock size={14} />}
                {currentMultiplier > 1 && <AlertTriangle size={14} />}
                {error}
              </div>
            )}

            {/* Rate limit warning */}
            {isLimited && (
              <div style={{
                backgroundColor: colors.theme === 'dark' ? '#4a3a1a' : '#fff3cd',
                border: `2px solid ${colors.warning}`,
                borderRadius: '4px',
                padding: '8px 12px',
                marginBottom: '12px',
                color: colors.theme === 'dark' ? '#ffd43b' : '#856404',
                fontSize: '13px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Clock size={14} />
                {currentMultiplier > 1 && <AlertTriangle size={14} />}
                Rate limited: {remainingTime}s remaining
                {currentMultiplier > 1 && ` (${currentMultiplier}x penalty for repeated violations)`}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => {
                    setMessageText(e.target.value);
                    setError(null);
                  }}
                  disabled={isLimited}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${colors.border}`,
                    borderRadius: '6px',
                    fontFamily: 'inherit',
                    fontSize: '14px',
                    backgroundColor: colors.surface,
                    color: colors.text,
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    opacity: isLimited ? 0.5 : 1
                  }}
                  placeholder={isLimited ? "Rate limited - please wait..." : "Message (240 chars max, no links)"}
                  maxLength={240}
                  onFocus={(e) => !isLimited && (e.target.style.borderColor = colors.primary)}
                  onBlur={(e) => e.target.style.borderColor = colors.border}
                />
                <div style={{
                  fontSize: '12px',
                  color: colors.textSecondary,
                  marginTop: '4px',
                  textAlign: 'right'
                }}>
                  {messageText.length}/240
                </div>
              </div>
              <button
                type="submit"
                disabled={!messageText.trim() || isLimited}
                style={{
                  padding: '12px 24px',
                  backgroundColor: (messageText.trim() && !isLimited) ? colors.primary : colors.surface,
                  color: (messageText.trim() && !isLimited) ? colors.surface : colors.textSecondary,
                  border: `2px solid ${(messageText.trim() && !isLimited) ? colors.primary : colors.border}`,
                  borderRadius: '6px',
                  cursor: (messageText.trim() && !isLimited) ? 'pointer' : 'not-allowed',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  fontWeight: '600',
                  opacity: (messageText.trim() && !isLimited) ? 1 : 0.5,
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  if (messageText.trim() && !isLimited) {
                    e.currentTarget.style.backgroundColor = colors.surface;
                    e.currentTarget.style.color = colors.primary;
                  }
                }}
                onMouseOut={(e) => {
                  if (messageText.trim() && !isLimited) {
                    e.currentTarget.style.backgroundColor = colors.primary;
                    e.currentTarget.style.color = colors.surface;
                  }
                }}
              >
                {
                  isLoading ? <Loader2 className='animate-spin' /> : "Send"
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;