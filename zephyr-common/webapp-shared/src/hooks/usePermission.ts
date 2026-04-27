import { useCallback } from 'react';

/** 权限检查 Hook */
export function usePermission() {
  const checkPermission = useCallback((code: string): boolean => {
    // 从 localStorage 或 store 获取权限列表
    try {
      const permissions = JSON.parse(localStorage.getItem('zephyr_permissions') || '[]');
      return permissions.includes(code) || permissions.includes('*');
    } catch {
      return false;
    }
  }, []);

  const hasAnyPermission = useCallback((codes: string[]): boolean => {
    return codes.some((code) => checkPermission(code));
  }, [checkPermission]);

  const hasAllPermissions = useCallback((codes: string[]): boolean => {
    return codes.every((code) => checkPermission(code));
  }, [checkPermission]);

  return {
    checkPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}
