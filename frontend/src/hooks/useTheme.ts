import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('chat-theme') as Theme;
    return savedTheme || 'light';
  });

  useEffect(() => {
    localStorage.setItem('chat-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const getThemeColors = () => {
    if (theme === 'dark') {
      return {
        background: '#1a1a1a',
        surface: '#2d2d2d',
        border: '#404040',
        text: '#ffffff',
        textSecondary: '#b0b0b0',
        primary: '#4080ff',
        primaryHover: '#5090ff',
        accent: '#f0f0f0',
        error: '#ff6b6b',
        success: '#51cf66',
        warning: '#ffd43b'
      };
    }
    
    return {
      background: '#ffffff',
      surface: '#ffffff',
      border: '#000000',
      text: '#000000',
      textSecondary: '#666666',
      primary: '#0000FF',
      primaryHover: '#0000CC',
      accent: '#f8f9ff',
      error: '#f44336',
      success: '#4caf50',
      warning: '#ff9800'
    };
  };

  return {
    theme,
    toggleTheme,
    colors: getThemeColors()
  };
};