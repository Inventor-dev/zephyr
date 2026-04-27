import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getToken } from '@zephyr/shared';

interface RouteGuardProps {
  children: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const location = useLocation();
  const token = getToken();

  // 登录页不需要验证
  if (location.pathname === '/login') {
    return <>{children}</>;
  }

  // 未登录重定向到登录页
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default RouteGuard;
