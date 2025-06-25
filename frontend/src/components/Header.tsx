import React from 'react';
import { User as UserType } from '../types';
import { Settings, Moon, Sun } from 'lucide-react';
import { useThemeContext } from './ThemeProvider';

interface HeaderProps {
  user: UserType | null;
  onLogout: () => void;
  onHome: () => void;
  onProfile: () => void;
}

function Header({ user, onLogout, onHome, onProfile }: HeaderProps) {
  const { theme, toggleTheme, colors } = useThemeContext();

  const renderUserAvatar = () => {
    if (!user) return null;
    
    const isPresetAvatar = user.profilePictureType === 'preset' && user.profilePicture.length <= 2;
    
    return (
      <div style={{ 
        width: '32px', 
        height: '32px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        border: `2px solid ${colors.border}`,
        borderRadius: '4px',
        backgroundColor: colors.surface,
        fontSize: isPresetAvatar ? '16px' : '12px',
        overflow: 'hidden'
      }}>
        {isPresetAvatar ? (
          user.profilePicture
        ) : (
          <img 
            src={user.profilePicture} 
            alt="Profile" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover' 
            }} 
          />
        )}
      </div>
    );
  };

  return (
    <div style={{ 
      backgroundColor: colors.surface, 
      borderBottom: `2px solid ${colors.border}`, 
      padding: '16px 24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <button
          onClick={onHome}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            padding: '8px 0',
            transition: 'opacity 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
        >
          <img 
            src="/ChatGPT Image Jun 23, 2025, 12_06_51 PM.png" 
            alt="Anonymous Chat Logo" 
            style={{ 
              width: '32px', 
              height: '32px',
              filter: colors.theme === 'dark' ? 'brightness(0) invert(1)' : 'none'
            }} 
          />
          <span style={{
            fontSize: '20px',
            fontWeight: '700',
            color: colors.primary
          }}>
            Anonymous Chat
          </span>
        </button>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px',
          fontSize: '14px'
        }}>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            style={{
              backgroundColor: colors.surface,
              border: `2px solid ${colors.border}`,
              borderRadius: '4px',
              padding: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontFamily: 'inherit',
              fontWeight: '600',
              color: colors.text,
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = colors.text;
              e.currentTarget.style.color = colors.surface;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = colors.surface;
              e.currentTarget.style.color = colors.text;
            }}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
          </button>

          {user && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {renderUserAvatar()}
                <span style={{ fontWeight: '600', color: colors.text }}>
                  {user.displayName}
                </span>
              </div>
              <button
                onClick={onProfile}
                style={{
                  backgroundColor: colors.surface,
                  border: `2px solid ${colors.border}`,
                  borderRadius: '4px',
                  padding: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontFamily: 'inherit',
                  fontWeight: '600',
                  color: colors.text,
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = colors.text;
                  e.currentTarget.style.color = colors.surface;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = colors.surface;
                  e.currentTarget.style.color = colors.text;
                }}
                title="Profile Settings"
              >
                <Settings size={14} />
              </button>
              <button
                onClick={onLogout}
                style={{
                  backgroundColor: colors.surface,
                  border: `2px solid ${colors.border}`,
                  borderRadius: '4px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontFamily: 'inherit',
                  fontWeight: '600',
                  color: colors.text,
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
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;