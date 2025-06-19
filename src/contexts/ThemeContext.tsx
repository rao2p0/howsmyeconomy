import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type VisualMode = 'fun' | 'serious';

interface ThemeContextType {
  visualMode: VisualMode;
  toggleVisualMode: () => void;
  isFunMode: boolean;
  isSeriousMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [visualMode, setVisualMode] = useState<VisualMode>('fun');

  // Load saved preference from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('visualMode') as VisualMode;
    if (savedMode && (savedMode === 'fun' || savedMode === 'serious')) {
      setVisualMode(savedMode);
    }
  }, []);

  // Save preference to localStorage and update CSS class
  useEffect(() => {
    localStorage.setItem('visualMode', visualMode);
    
    // Add/remove theme class from document body
    if (visualMode === 'serious') {
      document.body.classList.add('theme-serious');
      document.body.classList.remove('theme-fun');
    } else {
      document.body.classList.add('theme-fun');
      document.body.classList.remove('theme-serious');
    }
  }, [visualMode]);

  const toggleVisualMode = () => {
    setVisualMode(prev => prev === 'fun' ? 'serious' : 'fun');
  };

  const value: ThemeContextType = {
    visualMode,
    toggleVisualMode,
    isFunMode: visualMode === 'fun',
    isSeriousMode: visualMode === 'serious'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 