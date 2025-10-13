import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check if window is defined (for SSR safety)
    if (typeof window !== 'undefined') {
      try {
        const savedTheme = localStorage.getItem('theme');
        // Check system preference if no saved theme
        if (!savedTheme) {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          return prefersDark ? 'dark' : 'light';
        }
        return savedTheme;
      } catch (error) {
        console.error('Error reading theme from localStorage:', error);
        return 'light';
      }
    }
    return 'light';
  });

  useEffect(() => {
    try {
      const root = document.documentElement;
      
      // Remove both classes first to avoid conflicts
      root.classList.remove('light', 'dark');
      
      // Add the current theme class
      root.classList.add(theme);
      
      // Save to localStorage
      localStorage.setItem('theme', theme);
      
      // Also set data attribute for additional styling options
      root.setAttribute('data-theme', theme);
    } catch (error) {
      console.error('Error applying theme:', error);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
