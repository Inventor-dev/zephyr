import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface AppState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  isMobile: boolean;
  setIsMobile: (mobile: boolean) => void;
}

const AppContext = createContext<AppState | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('zephyr_sidebar_collapsed') === 'true';
  });

  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('zephyr_theme') as 'light' | 'dark') || 'light';
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => {
      localStorage.setItem('zephyr_sidebar_collapsed', String(!prev));
      return !prev;
    });
  }, []);

  const setSidebarCollapsed = useCallback((collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
    localStorage.setItem('zephyr_sidebar_collapsed', String(collapsed));
  }, []);

  const setTheme = useCallback((newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    localStorage.setItem('zephyr_theme', newTheme);
  }, []);

  return (
    <AppContext.Provider
      value={{ sidebarCollapsed, toggleSidebar, setSidebarCollapsed, theme, setTheme, isMobile, setIsMobile }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppState {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
