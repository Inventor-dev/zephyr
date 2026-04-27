import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import BasicLayout from '../layouts/BasicLayout';
import BlankLayout from '../layouts/BlankLayout';
import LoginPage from '../pages/login';
import DashboardPage from '../pages/dashboard';
import EndpointPage from '../pages/endpoint';
import RouteGuard from './guard';

const AppRouter: React.FC = () => {
  return (
    <RouteGuard>
      <Routes>
        {/* 登录页 - 空布局 */}
        <Route element={<BlankLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* 主布局 */}
        <Route element={<BasicLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/endpoint" element={<EndpointPage />} />

          {/* 系统管理 - 子应用路由占位 */}
          <Route path="/system/user" element={<SubAppPlaceholder title="用户管理" />} />
          <Route path="/system/dept" element={<SubAppPlaceholder title="部门管理" />} />
          <Route path="/system/endpoint" element={<SubAppPlaceholder title="端点管理" />} />

          {/* 权限管理 */}
          <Route path="/permission/role" element={<SubAppPlaceholder title="角色管理" />} />
          <Route path="/permission/menu" element={<SubAppPlaceholder title="菜单管理" />} />

          {/* 数据字典 */}
          <Route path="/dict/type" element={<SubAppPlaceholder title="字典类型" />} />
          <Route path="/dict/data" element={<SubAppPlaceholder title="字典数据" />} />

          {/* 日志管理 */}
          <Route path="/log/operation" element={<SubAppPlaceholder title="操作日志" />} />
          <Route path="/log/login" element={<SubAppPlaceholder title="登录日志" />} />

          {/* 系统监控 */}
          <Route path="/monitor/online" element={<SubAppPlaceholder title="在线用户" />} />
          <Route path="/monitor/cache" element={<SubAppPlaceholder title="缓存监控" />} />

          {/* 代码生成 */}
          <Route path="/codegen/tables" element={<SubAppPlaceholder title="表列表" />} />
          <Route path="/codegen/preview" element={<SubAppPlaceholder title="代码预览" />} />

          {/* 动态表单 */}
          <Route path="/form/list" element={<SubAppPlaceholder title="表单模板" />} />
          <Route path="/form/designer" element={<SubAppPlaceholder title="表单设计器" />} />

          {/* 扩展点 */}
          <Route path="/extension/list" element={<SubAppPlaceholder title="扩展点列表" />} />
          <Route path="/extension/detail" element={<SubAppPlaceholder title="实现管理" />} />
        </Route>

        {/* 默认重定向 */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </RouteGuard>
  );
};

/** 子应用占位组件 */
const SubAppPlaceholder: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <div
        style={{
          padding: 60,
          background: '#fff',
          borderRadius: 8,
          border: '1px dashed #d9d9d9',
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔌</div>
        <h2 style={{ margin: 0, color: '#333' }}>{title}</h2>
        <p style={{ color: '#999', marginTop: 8 }}>子应用加载中...</p>
      </div>
    </div>
  );
};

export default AppRouter;
