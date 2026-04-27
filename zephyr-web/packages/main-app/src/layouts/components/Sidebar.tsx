import React, { useMemo } from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  SettingOutlined,
  SafetyCertificateOutlined,
  BookOutlined,
  FileTextOutlined,
  MonitorOutlined,
  CodeOutlined,
  FormOutlined,
  ApiOutlined,
  UserOutlined,
  ApartmentOutlined,
  UnorderedListOutlined,
  ToolOutlined,
  DatabaseOutlined,
  CloudServerOutlined,
  TableOutlined,
  AppstoreOutlined,
  BlockOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../store/app';
import type { MenuProps } from 'antd';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: '仪表盘',
  },
  {
    key: 'system',
    icon: <SettingOutlined />,
    label: '系统管理',
    children: [
      { key: '/system/user', icon: <UserOutlined />, label: '用户管理' },
      { key: '/system/dept', icon: <ApartmentOutlined />, label: '部门管理' },
      { key: '/system/endpoint', icon: <ApiOutlined />, label: '端点管理' },
    ],
  },
  {
    key: 'permission',
    icon: <SafetyCertificateOutlined />,
    label: '权限管理',
    children: [
      { key: '/permission/role', icon: <SafetyCertificateOutlined />, label: '角色管理' },
      { key: '/permission/menu', icon: <UnorderedListOutlined />, label: '菜单管理' },
    ],
  },
  {
    key: 'dict',
    icon: <BookOutlined />,
    label: '数据字典',
    children: [
      { key: '/dict/type', icon: <BookOutlined />, label: '字典类型' },
      { key: '/dict/data', icon: <DatabaseOutlined />, label: '字典数据' },
    ],
  },
  {
    key: 'log',
    icon: <FileTextOutlined />,
    label: '日志管理',
    children: [
      { key: '/log/operation', icon: <FileTextOutlined />, label: '操作日志' },
      { key: '/log/login', icon: <FileTextOutlined />, label: '登录日志' },
    ],
  },
  {
    key: 'monitor',
    icon: <MonitorOutlined />,
    label: '系统监控',
    children: [
      { key: '/monitor/online', icon: <CloudServerOutlined />, label: '在线用户' },
      { key: '/monitor/cache', icon: <DatabaseOutlined />, label: '缓存监控' },
    ],
  },
  {
    key: 'codegen',
    icon: <CodeOutlined />,
    label: '代码生成',
    children: [
      { key: '/codegen/tables', icon: <TableOutlined />, label: '表列表' },
      { key: '/codegen/preview', icon: <CodeOutlined />, label: '代码预览' },
    ],
  },
  {
    key: 'form',
    icon: <FormOutlined />,
    label: '动态表单',
    children: [
      { key: '/form/list', icon: <AppstoreOutlined />, label: '表单模板' },
      { key: '/form/designer', icon: <ToolOutlined />, label: '表单设计器' },
    ],
  },
  {
    key: 'extension',
    icon: <BlockOutlined />,
    label: '扩展点',
    children: [
      { key: '/extension/list', icon: <BlockOutlined />, label: '扩展点列表' },
      { key: '/extension/detail', icon: <SettingOutlined />, label: '实现管理' },
    ],
  },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar } = useApp();

  const selectedKeys = useMemo(() => {
    return [location.pathname];
  }, [location.pathname]);

  const openKeys = useMemo(() => {
    const path = location.pathname;
    const parts = path.split('/').filter(Boolean);
    if (parts.length > 1) {
      return ['/' + parts[0]];
    }
    return [];
  }, [location.pathname]);

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key);
  };

  return (
    <Sider
      collapsible
      collapsed={sidebarCollapsed}
      onCollapse={toggleSidebar}
      trigger={null}
      width={240}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {sidebarCollapsed ? (
          <span style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>Z</span>
        ) : (
          <span style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
            ⚡ Zephyr
          </span>
        )}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={selectedKeys}
        defaultOpenKeys={openKeys}
        items={menuItems}
        onClick={handleMenuClick}
      />
    </Sider>
  );
};

export default Sidebar;
