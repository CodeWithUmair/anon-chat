import React, { useState } from 'react';
import { User } from '../types';
import { defaultAvatars } from '../data/mockData';
import { generateId } from '../utils/validation';
import { useThemeContext } from './ThemeProvider';
import { Upload, Moon, Sun } from 'lucide-react';

interface AuthPageProps {
  onLogin: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [displayName, setDisplayName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(defaultAvatars[0]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [profilePictureType, setProfilePictureType] = useState<'preset' | 'uploaded' | 'default'>('default');
  const [error, setError] = useState<string | null>(null);
  const { theme, toggleTheme, colors } = useThemeContext();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be smaller than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedImage(result);
      setProfilePictureType('uploaded');
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.removeItem('admin_display_name');

    if (!displayName.trim()) {
      setError('Please enter a display name');
      return;
    }

    if (displayName.length < 2) {
      setError('Display name must be at least 2 characters');
      return;
    }

    localStorage.setItem('admin_display_name', displayName.trim());

    let profilePicture = '/ChatGPT Image Jun 23, 2025, 12_06_51 PM.png';
    let finalProfilePictureType: 'preset' | 'uploaded' = 'preset';

    if (profilePictureType === 'preset') {
      profilePicture = selectedAvatar;
      finalProfilePictureType = 'preset';
    } else if (profilePictureType === 'uploaded' && uploadedImage) {
      profilePicture = uploadedImage;
      finalProfilePictureType = 'uploaded';
    }

    const user: User = {
      id: generateId(),
      username: generateId(),
      displayName: displayName.trim(),
      profilePicture,
      profilePictureType: finalProfilePictureType,
      joinedDate: new Date()
    };

    onLogin(user);
  };

  const getCurrentProfilePicture = () => {
    if (profilePictureType === 'uploaded' && uploadedImage) {
      return uploadedImage;
    } else if (profilePictureType === 'preset') {
      return selectedAvatar;
    } else {
      return '/ChatGPT Image Jun 23, 2025, 12_06_51 PM.png';
    }
  };

  const renderCurrentAvatar = () => {
    const currentPicture = getCurrentProfilePicture();
    const isPresetAvatar = profilePictureType === 'preset';

    return (
      <div style={{
        width: '80px',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `2px solid ${colors.border}`,
        borderRadius: '8px',
        backgroundColor: colors.surface,
        fontSize: isPresetAvatar ? '32px' : '16px',
        overflow: 'hidden',
        flexShrink: 0
      }}>
        {isPresetAvatar ? (
          currentPicture
        ) : (
          <img
            src={currentPicture}
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
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: colors.background,
      minHeight: '100vh',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Theme Toggle - Top Right */}
      <button
        onClick={toggleTheme}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: colors.surface,
          border: `2px solid ${colors.border}`,
          borderRadius: '50%',
          padding: '12px',
          cursor: 'pointer',
          fontSize: '12px',
          fontFamily: 'inherit',
          fontWeight: '600',
          color: colors.text,
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
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
        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
      </button>

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
          marginBottom: '8px',
          color: colors.text,
          textAlign: 'center'
        }}>
          Welcome to Anonymous Chat
        </h1>
        <p style={{
          fontSize: '14px',
          color: colors.textSecondary,
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          Choose your display name and profile picture to get started
        </p>

        {error && (
          <div style={{
            backgroundColor: colors.theme === 'dark' ? '#4a1a1a' : '#ffebee',
            border: `2px solid ${colors.error}`,
            borderRadius: '6px',
            padding: '12px',
            marginBottom: '24px',
            color: colors.error,
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Current Profile Picture Display */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            padding: '20px',
            border: `2px solid ${colors.border}`,
            borderRadius: '8px',
            backgroundColor: colors.surface
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '8px', color: colors.text }}>
                Your Profile Picture
              </div>
              {renderCurrentAvatar()}
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              fontSize: '14px',
              color: colors.text
            }}>
              Display Name:
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                setError(null);
              }}
              style={{
                width: '100%',
                padding: '12px',
                border: `2px solid ${colors.border}`,
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'inherit',
                backgroundColor: colors.surface,
                color: colors.text,
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              placeholder="Enter your display name"
              onFocus={(e) => e.target.style.borderColor = colors.primary}
              onBlur={(e) => e.target.style.borderColor = colors.border}
            />
            <div style={{
              fontSize: '12px',
              color: colors.textSecondary,
              marginTop: '4px'
            }}>
              This name will appear in chat messages (minimum 2 characters)
            </div>
          </div>

          {/* Profile Picture Options */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '16px',
              fontWeight: '600',
              fontSize: '14px',
              color: colors.text
            }}>
              Profile Picture Options:
            </label>

            {/* Default Option */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                color: colors.text
              }}>
                <input
                  type="radio"
                  name="pictureType"
                  checked={profilePictureType === 'default'}
                  onChange={() => setProfilePictureType('default')}
                  style={{ margin: 0 }}
                />
                Use default anonymous image
              </label>
            </div>

            {/* Preset Avatars */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                color: colors.text
              }}>
                <input
                  type="radio"
                  name="pictureType"
                  checked={profilePictureType === 'preset'}
                  onChange={() => setProfilePictureType('preset')}
                  style={{ margin: 0 }}
                />
                Choose from preset avatars:
              </label>
              {profilePictureType === 'preset' && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginLeft: '24px' }}>
                  {defaultAvatars.map((avatar) => (
                    <button
                      key={avatar}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar)}
                      style={{
                        padding: '8px 12px',
                        border: selectedAvatar === avatar ? `2px solid ${colors.primary}` : `2px solid ${colors.border}`,
                        borderRadius: '6px',
                        backgroundColor: selectedAvatar === avatar ? colors.primary : colors.surface,
                        color: selectedAvatar === avatar ? colors.surface : colors.text,
                        cursor: 'pointer',
                        fontSize: '16px',
                        transition: 'all 0.2s'
                      }}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Upload Custom Image */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                color: colors.text
              }}>
                <input
                  type="radio"
                  name="pictureType"
                  checked={profilePictureType === 'uploaded'}
                  onChange={() => setProfilePictureType('uploaded')}
                  style={{ margin: 0 }}
                />
                Upload custom image:
              </label>
              {profilePictureType === 'uploaded' && (
                <div style={{ marginLeft: '24px' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 16px',
                      backgroundColor: colors.surface,
                      border: `2px solid ${colors.border}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
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
                    <Upload size={16} />
                    Choose Image
                  </label>
                  <div style={{
                    fontSize: '12px',
                    color: colors.textSecondary,
                    marginTop: '8px'
                  }}>
                    Max 2MB, JPG/PNG/GIF supported
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px 24px',
              backgroundColor: colors.primary,
              color: colors.surface,
              border: `2px solid ${colors.primary}`,
              borderRadius: '6px',
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
            Enter Chat
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;