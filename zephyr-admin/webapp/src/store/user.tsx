import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface UserInfo {
  id: string;
  username: string;
  nickname: string;
  avatar?: string;
  roles: string[];
  permissions: string[];
}

interface UserState {
  userInfo: UserInfo | null;
  token: string | null;
  setUserInfo: (info: UserInfo) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserState | null>(null);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userInfo, setUserInfoState] = useState<UserInfo | null>(() => {
    try {
      const stored = localStorage.getItem('zephyr_user_info');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setTokenState] = useState<string | null>(() => {
    return localStorage.getItem('zephyr_token');
  });

  const setUserInfo = useCallback((info: UserInfo) => {
    setUserInfoState(info);
    localStorage.setItem('zephyr_user_info', JSON.stringify(info));
    localStorage.setItem('zephyr_permissions', JSON.stringify(info.permissions));
  }, []);

  const setToken = useCallback((newToken: string) => {
    setTokenState(newToken);
    localStorage.setItem('zephyr_token', newToken);
  }, []);

  const logout = useCallback(() => {
    setUserInfoState(null);
    setTokenState(null);
    localStorage.removeItem('zephyr_user_info');
    localStorage.removeItem('zephyr_token');
    localStorage.removeItem('zephyr_permissions');
    window.location.href = '/login';
  }, []);

  return (
    <UserContext.Provider value={{ userInfo, token, setUserInfo, setToken, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export function useUser(): UserState {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
