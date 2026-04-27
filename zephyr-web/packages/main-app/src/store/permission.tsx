import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface PermissionState {
  permissions: string[];
  roles: string[];
  setPermissions: (perms: string[]) => void;
  setRoles: (roles: string[]) => void;
  hasPermission: (code: string) => boolean;
  hasAnyPermission: (codes: string[]) => boolean;
}

const PermissionContext = createContext<PermissionState | null>(null);

export const PermissionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [permissions, setPermissionsState] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('zephyr_permissions');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [roles, setRolesState] = useState<string[]>([]);

  const setPermissions = useCallback((perms: string[]) => {
    setPermissionsState(perms);
    localStorage.setItem('zephyr_permissions', JSON.stringify(perms));
  }, []);

  const setRoles = useCallback((newRoles: string[]) => {
    setRolesState(newRoles);
  }, []);

  const hasPermission = useCallback(
    (code: string): boolean => {
      return permissions.includes(code) || permissions.includes('*');
    },
    [permissions]
  );

  const hasAnyPermission = useCallback(
    (codes: string[]): boolean => {
      return codes.some((code) => hasPermission(code));
    },
    [hasPermission]
  );

  return (
    <PermissionContext.Provider value={{ permissions, roles, setPermissions, setRoles, hasPermission, hasAnyPermission }}>
      {children}
    </PermissionContext.Provider>
  );
};

export function usePermission(): PermissionState {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermission must be used within a PermissionProvider');
  }
  return context;
}
