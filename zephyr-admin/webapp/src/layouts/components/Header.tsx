import React from 'react';
import { Layout, Space, Avatar, Dropdown, Badge, Button, theme } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  FullscreenOutlined,
} from '@ant-design/icons';
import { useApp } from '../../store/app';
import { useUser } from '../../store/user';
import type { MenuProps } from 'antd';

const { Header } = Layout;

const HeaderBar: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar } = useApp();
  const { userInfo, logout } = useUser();
  const { token: themeToken } = theme.useToken();

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ];

  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      logout();
    }
  };

  return (
    <Header
      style={{
        padding: '0 24px',
        background: themeToken.colorBgContainer,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 99,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Button
          type="text"
          icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleSidebar}
          style={{ fontSize: 16 }}
        />
      </div>

      <Space size={20}>
        <Badge count={3} size="small">
          <Button type="text" icon={<BellOutlined />} style={{ fontSize: 16 }} />
        </Badge>
        <Button type="text" icon={<FullscreenOutlined />} style={{ fontSize: 16 }} />
        <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }} placement="bottomRight">
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: '#1677ff' }} />
            <span style={{ fontSize: 14 }}>{userInfo?.nickname || 'Admin'}</span>
          </div>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default HeaderBar;
