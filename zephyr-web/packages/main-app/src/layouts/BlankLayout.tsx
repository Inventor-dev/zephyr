import React from 'react';
import { Outlet } from 'react-router-dom';

const BlankLayout: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Outlet />
    </div>
  );
};

export default BlankLayout;
