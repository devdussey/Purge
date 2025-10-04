import { createContext, useContext, useEffect, ReactNode, useState } from 'react';

interface ThemeContextType {
  theme: 'dark' | 'light' | 'auto';
  effectiveTheme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light' | 'auto') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<'dark' | 'light' | 'auto'>(() => {
    // Load from localStorage
    const saved = localStorage.getItem('purge-settings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        return settings.theme || 'dark';
      } catch {
        return 'dark';
      }
    }
    return 'dark';
  });

  const getEffectiveTheme = (): 'dark' | 'light' => {
    if (theme === 'auto') {
      // Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
      return 'dark';
    }
    return theme;
  };

  const effectiveTheme = getEffectiveTheme();

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(effectiveTheme);
  }, [effectiveTheme]);

  // Listen for settings changes
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('purge-settings');
      if (saved) {
        try {
          const settings = JSON.parse(saved);
          if (settings.theme && settings.theme !== theme) {
            setThemeState(settings.theme);
          }
        } catch (e) {
          console.error('Failed to parse settings:', e);
        }
      }
    };

    // Poll localStorage every 500ms to detect changes
    const interval = setInterval(handleStorageChange, 500);
    return () => clearInterval(interval);
  }, [theme]);

  const setTheme = (newTheme: 'dark' | 'light' | 'auto') => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, setTheme }}>
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
