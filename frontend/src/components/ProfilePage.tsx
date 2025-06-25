import React, { useState, useRef } from 'react';
import { User } from '../types';
import { defaultAvatars } from '../data/mockData';
import { useThemeContext } from './ThemeProvider';
import { ArrowLeft, Upload } from 'lucide-react';

interface ProfilePageProps {
  user: User;
  onBack: () => void;
  onUpdateProfile: (updatedUser: User) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onBack, onUpdateProfile }) => {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [selectedPresetAvatar, setSelectedPresetAvatar] = useState(
    user.profilePictureType === 'preset' && user.profilePicture !== '/ChatGPT Image Jun 23, 2025, 12_06_51 PM.png'
      ? user.profilePicture
      : defaultAvatars[0]
  );
  const [uploadedImage, setUploadedImage] = useState<string | null>(
    user.profilePictureType === 'uploaded' ? user.profilePicture : null
  );
  const [profilePictureType, setProfilePictureType] = useState<'preset' | 'uploaded' | 'default'>(
    user.profilePicture === '/ChatGPT Image Jun 23, 2025, 12_06_51 PM.png'
      ? 'default'
      : user.profilePictureType
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { colors } = useThemeContext();

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

    setError(null);
    setSuccess(null);

    if (!displayName.trim()) {
      setError('Display name is required');
      return;
    }

    if (displayName.length < 2) {
      setError('Display name must be at least 2 characters');
      return;
    }

    localStorage.setItem('admin_display_name', displayName.trim());

    let finalProfilePicture = '/ChatGPT Image Jun 23, 2025, 12_06_51 PM.png';
    let finalProfilePictureType: 'preset' | 'uploaded' = 'preset';

    if (profilePictureType === 'preset') {
      finalProfilePicture = selectedPresetAvatar;
      finalProfilePictureType = 'preset';
    } else if (profilePictureType === 'uploaded' && uploadedImage) {
      finalProfilePicture = uploadedImage;
      finalProfilePictureType = 'uploaded';
    }

    const updatedUser: User = {
      ...user,
      displayName: displayName.trim(),
      profilePicture: finalProfilePicture,
      profilePictureType: finalProfilePictureType
    };

    onUpdateProfile(updatedUser);
    setSuccess('Profile updated successfully!');

    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };

  const formatJoinDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getCurrentProfilePicture = () => {
    if (profilePictureType === 'uploaded' && uploadedImage) {
      return uploadedImage;
    } else if (profilePictureType === 'preset') {
      return selectedPresetAvatar;
    } else {
      return '/ChatGPT Image Jun 23, 2025, 12_06_51 PM.png';
    }
  };

  const renderCurrentAvatar = () => {
    const currentPicture = getCurrentProfilePicture();
    const isPresetAvatar = profilePictureType === 'preset';

    return (
      <div style={{
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `2px solid ${colors.border}`,
        borderRadius: '6px',
        backgroundColor: colors.surface,
        fontSize: isPresetAvatar ? '24px' : '16px',
        overflow: 'hidden'
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
      padding: '24px'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <button
            onClick={onBack}
            style={{
              backgroundColor: colors.surface,
              border: `2px solid ${colors.border}`,
              borderRadius: '6px',
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
              fontSize: '24px',
              fontWeight: '700',
              color: colors.text,
              margin: 0,
              marginBottom: '4px'
            }}>
              Profile Settings
            </h1>
            <div style={{ fontSize: '14px', color: colors.textSecondary }}>
              Member since {formatJoinDate(user.joinedDate)}
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div style={{
          backgroundColor: colors.surface,
          border: `2px solid ${colors.border}`,
          borderRadius: '8px',
          padding: '32px',
          boxShadow: `4px 4px 0px ${colors.border}`
        }}>
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

          {success && (
            <div style={{
              backgroundColor: colors.theme === 'dark' ? '#1a4a1a' : '#e8f5e8',
              border: `2px solid ${colors.success}`,
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '24px',
              color: colors.success,
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Current Profile Picture Display */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '20px',
              padding: '16px',
              border: `2px solid ${colors.border}`,
              borderRadius: '6px',
              backgroundColor: colors.accent
            }}>
              {renderCurrentAvatar()}
              <div>
                <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px', color: colors.text }}>
                  Current Picture
                </div>
                <div style={{ fontSize: '12px', color: colors.textSecondary }}>
                  {profilePictureType === 'preset' ? 'Preset Avatar' :
                    profilePictureType === 'uploaded' ? 'Uploaded Image' : 'Default Anonymous'}
                </div>
              </div>
            </div>

            {/* Profile Picture Section */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '16px',
                fontWeight: '600',
                fontSize: '16px',
                color: colors.text
              }}>
                Profile Picture Options
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
              <div style={{ marginBottom: '20px' }}>
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
                        onClick={() => setSelectedPresetAvatar(avatar)}
                        style={{
                          padding: '8px 12px',
                          border: selectedPresetAvatar === avatar ? `2px solid ${colors.primary}` : `2px solid ${colors.border}`,
                          borderRadius: '6px',
                          backgroundColor: selectedPresetAvatar === avatar ? colors.primary : colors.surface,
                          color: selectedPresetAvatar === avatar ? colors.surface : colors.text,
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
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
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
                    </button>
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

            {/* Display Name */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                fontSize: '14px',
                color: colors.text
              }}>
                Display Name (shown in chats):
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  setError(null);
                  setSuccess(null);
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
                placeholder="Enter display name"
                onFocus={(e) => e.target.style.borderColor = colors.primary}
                onBlur={(e) => e.target.style.borderColor = colors.border}
              />
              <div style={{
                fontSize: '12px',
                color: colors.textSecondary,
                marginTop: '4px'
              }}>
                This name appears in chat messages (minimum 2 characters)
              </div>
            </div>

            {/* Submit Button */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button
                type="submit"
                style={{
                  flex: 1,
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
                Save Changes
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
                  borderRadius: '6px',
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
    </div>
  );
};

export default ProfilePage;