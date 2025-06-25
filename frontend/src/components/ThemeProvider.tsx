import React, { createContext, useContext } from 'react';
import { useTheme, Theme } from '../hooks/useTheme';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: {
    [x: string]: string;
    background: string;
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
    primary: string;
    primaryHover: string;
    accent: string;
    error: string;
    success: string;
    warning: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const themeData = useTheme();

  return (
    <ThemeContext.Provider value={themeData}>
      <div style={{ 
        backgroundColor: themeData.colors.background,
        color: themeData.colors.text,
        minHeight: '100vh',
        transition: 'background-color 0.3s ease, color 0.3s ease'
      }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};