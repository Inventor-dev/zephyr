import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HeaderBar from './components/Header';
import { useApp } from '../store/app';

const { Content } = Layout;

const BasicLayout: React.FC = () => {
  const { sidebarCollapsed } = useApp();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout style={{ marginLeft: sidebarCollapsed ? 80 : 240, transition: 'margin-left 0.2s' }}>
        <HeaderBar />
        <Content
          style={{
            margin: 24,
            padding: 24,
            background: '#f5f5f5',
            minHeight: 280,
            overflow: 'auto',
          }}
        >
          <Outlet />
          <div id="sub-app-container" style={{ minHeight: 400 }} />
        </Content>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;
