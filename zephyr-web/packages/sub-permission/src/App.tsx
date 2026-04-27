import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { themeConfig } from '@zephyr/shared';
import RolePage from './pages/role';
import MenuPage from './pages/menu';

const App: React.FC = () => (
  <ConfigProvider theme={themeConfig} locale={zhCN}>
    <BrowserRouter>
      <Routes>
        <Route path="/role" element={<RolePage />} />
        <Route path="/menu" element={<MenuPage />} />
      </Routes>
    </BrowserRouter>
  </ConfigProvider>
);

export default App;
